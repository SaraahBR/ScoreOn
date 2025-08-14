import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { sql } from "@vercel/postgres";

type ApiErrorKey =
  | "email_required"
  | "invalid_image_format"
  | "image_corrupted"
  | "image_too_large"
  | "missing_blob_token"
  | "save_image_error";

const STATUS_BY_REASON: Record<ApiErrorKey, number> = {
  email_required: 400,
  invalid_image_format: 400,
  image_corrupted: 400,
  image_too_large: 413, // Payload Too Large
  missing_blob_token: 500,
  save_image_error: 500,
};

function pickLang(req: Request) {
  const raw = req.headers.get("accept-language") || "";
  const code = raw.split(",")[0]?.trim() || "pt";
  const base = code.split("-")[0];
  return (["pt", "en", "es"].includes(base) ? base : "pt") as "pt" | "en" | "es";
}

function json(body: any, lang: "pt" | "en" | "es", status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-language": lang,
      "cache-control": "no-store",
    },
  });
}

function parseDataUrl(dataUrl: string) {
  const m = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
  if (!m) return null;
  const [, mime, b64] = m;
  return { mime, base64: b64 };
}

function extFromMime(mime: string) {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

// estima bytes do base64 sem decodificar tudo
function approxBytesFromBase64(b64: string) {
  const len = b64.length;
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return (len * 3) / 4 - pad;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Salva e remove a foto do usuário (Vercel Blob + Postgres)
export async function POST(req: Request) {
  const lang = pickLang(req);

  try {
    const url = new URL(req.url);
    const cleanup = url.searchParams.get("cleanup") === "1"; // ?cleanup=1 apaga avatar antigo (opcional)

    const { email, imageDataUrl } = (await req.json().catch(() => ({}))) as {
      email?: string;
      imageDataUrl?: string | null;
    };

    if (!email) {
      return json({ ok: false, error: "email_required", lang }, lang, STATUS_BY_REASON.email_required);
    }

    // Remoção
    if (!imageDataUrl) {
      await sql`update users set avatar_url = null where email = ${email}`;
      await sql`insert into users (email) values (${email}) on conflict (email) do nothing`;
      return json({ ok: true, action: "removed", lang }, lang, 200);
    }

    if (typeof imageDataUrl !== "string") {
      return json({ ok: false, error: "invalid_image_format", lang }, lang, STATUS_BY_REASON.invalid_image_format);
    }

    const parsed = parseDataUrl(imageDataUrl);
    if (!parsed) {
      return json({ ok: false, error: "invalid_image_format", lang }, lang, STATUS_BY_REASON.invalid_image_format);
    }

    const { mime, base64 } = parsed;
    if (!base64) {
      return json({ ok: false, error: "image_corrupted", lang }, lang, STATUS_BY_REASON.image_corrupted);
    }

    const approxBytes = approxBytesFromBase64(base64);
    if (approxBytes > MAX_BYTES) {
      return json(
        { ok: false, error: "image_too_large", maxBytes: MAX_BYTES, lang },
        lang,
        STATUS_BY_REASON.image_too_large
      );
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return json({ ok: false, error: "missing_blob_token", lang }, lang, STATUS_BY_REASON.missing_blob_token);
    }

    const ext = extFromMime(mime);
    const safeEmail = encodeURIComponent(email);
    const buf = Buffer.from(base64, "base64");

    // (opcional) pegar avatar antigo antes de atualizar
    let oldUrl: string | null = null;
    if (cleanup) {
      const prev = await sql<{ avatar_url: string }>`
        select avatar_url from users where email = ${email}
      `;
      oldUrl = prev.rows[0]?.avatar_url || null;
    }

    // Upload no Blob (público)
    const blob = await put(`avatars/${safeEmail}-${Date.now()}.${ext}`, buf, {
      access: "public",
      contentType: mime,
    });

    // Upsert no Postgres
    await sql`
      insert into users (email, avatar_url)
      values (${email}, ${blob.url})
      on conflict (email) do update set avatar_url = ${blob.url}
    `;

    // (opcional) tentar remover o arquivo anterior
    if (cleanup && oldUrl && oldUrl !== blob.url) {
      try {
        await del(oldUrl);
      } catch {
        // silencioso
      }
    }

    return json({ ok: true, action: "saved", url: blob.url, lang }, lang, 200);
  } catch (e: any) {
    console.error("[avatar/POST] Error:", e);
    return json(
      { ok: false, error: "save_image_error", lang, detail: e?.message ?? null },
      lang,
      STATUS_BY_REASON.save_image_error
    );
  }
}
