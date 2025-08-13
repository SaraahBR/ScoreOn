import { NextResponse } from "next/server";
import { setUserImage } from "@/lib/user-repo";

type ApiErrorKey =
  | "email_required"
  | "invalid_image_format"
  | "not_found"
  | "save_image_error";

const STATUS_BY_REASON: Record<ApiErrorKey, number> = {
  email_required: 400,
  invalid_image_format: 400,
  not_found: 404,
  save_image_error: 500,
};

function pickLang(req: Request) {
  const raw = req.headers.get("accept-language") || "";
  const code = raw.split(",")[0]?.trim() || "pt";
  const base = code.split("-")[0];
  return (["pt", "en", "es"].includes(base) ? base : "pt") as "pt" | "en" | "es";
}

// Salva e Remove a Foto (do usuário)
export async function POST(req: Request) {
  const lang = pickLang(req);

  try {
    const { email, imageDataUrl } = (await req.json().catch(() => ({}))) as {
      email?: string;
      imageDataUrl?: string | null;
    };

    if (!email) {
      const body = { ok: false, error: "email_required" as ApiErrorKey, lang };
      return new NextResponse(JSON.stringify(body), {
        status: STATUS_BY_REASON.email_required,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "content-language": lang,
        },
      });
    }

    if (imageDataUrl && typeof imageDataUrl === "string") {
      const okPrefix = imageDataUrl.startsWith("data:image/");
      const hasBase64 = imageDataUrl.includes(";base64,");
      if (!okPrefix || !hasBase64) {
        const body = { ok: false, error: "invalid_image_format" as ApiErrorKey, lang };
        return new NextResponse(JSON.stringify(body), {
          status: STATUS_BY_REASON.invalid_image_format,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "content-language": lang,
          },
        });
      }
    }

    const isRemove = !imageDataUrl; // null/undefined => remover
    const res = await setUserImage(email, imageDataUrl ?? null);

    if (!res.ok) {
      const reason = (res.reason ?? "save_image_error") as ApiErrorKey;
      const status = STATUS_BY_REASON[reason] ?? 400;
      const body = { ok: false, error: reason, lang };
      return new NextResponse(JSON.stringify(body), {
        status,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "content-language": lang,
        },
      });
    }

    const body = { ok: true, action: isRemove ? "removed" : "saved", lang };
    return new NextResponse(JSON.stringify(body), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-language": lang,
      },
    });
  } catch {
    const body = { ok: false, error: "save_image_error" as ApiErrorKey, lang };
    return new NextResponse(JSON.stringify(body), {
      status: STATUS_BY_REASON.save_image_error,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-language": lang,
      },
    });
  }
}
