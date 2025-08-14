import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";

type ApiErrorKey =
  | "email_required"
  | "invalid_image_format"
  | "image_corrupted"
  | "save_image_error";

const STATUS_BY_REASON: Record<ApiErrorKey, number> = {
  email_required: 400,
  invalid_image_format: 400,
  image_corrupted: 400,
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
    },
  });
}

// Salva e remove a foto do usuário (via Vercel Blob + Postgres)
export async function POST(req: Request) {
  const lang = pickLang(req);

  try {
    const { email, imageDataUrl } = (await req.json().catch(() => ({}))) as {
      email?: string;
      imageDataUrl?: string | null;
    };

    if (!email) {
      return json({ ok: false, error: "email_required", lang }, lang, STATUS_BY_REASON.email_required);
    }

    // Remoção (null/undefined => remover)
    if (!imageDataUrl) {
      await sql`update users set avatar_url = null where email = ${email}`;
      // garante existência do usuário sem sobrescrever
      await sql`insert into users (email) values (${email}) on conflict (email) do nothing`;
      return json({ ok: true, action: "removed", lang }, lang, 200);
    }

    // Validação da dataURL
    if (
      typeof imageDataUrl !== "string" ||
      !imageDataUrl.startsWith("data:image/") ||
      !imageDataUrl.includes(";base64,")
    ) {
      return json(
        { ok: false, error: "invalid_image_format", lang },
        lang,
        STATUS_BY_REASON.invalid_image_format
      );
    }

    const base64 = imageDataUrl.split(",")[1];
    if (!base64) {
      return json(
        { ok: false, error: "image_corrupted", lang },
        lang,
        STATUS_BY_REASON.image_corrupted
      );
    }

    const buf = Buffer.from(base64, "base64");

    // Upload no Blob (público)
    const blob = await put(`avatars/${email}-${Date.now()}.png`, buf, {
      access: "public",
      contentType: "image/png",
    });

    // Upsert no Postgres
    await sql`
      insert into users (email, avatar_url)
      values (${email}, ${blob.url})
      on conflict (email) do update set avatar_url = ${blob.url}
    `;

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
