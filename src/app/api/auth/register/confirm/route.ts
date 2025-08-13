import { NextResponse } from "next/server";
import { confirmPendingRegistration } from "@/lib/user-repo";

type ApiErrorKey =
  | "invalid_data"
  | "not_found"
  | "expired"
  | "mismatch"
  | "too_many_attempts";

const STATUS_BY_REASON: Record<ApiErrorKey, number> = {
  invalid_data: 400,
  not_found: 404,
  expired: 410,
  mismatch: 400,
  too_many_attempts: 429,
};

function pickLang(req: Request) {
  
  const raw = req.headers.get("accept-language") || "";
  const code = raw.split(",")[0]?.trim() || "pt";
  const base = code.split("-")[0];
  return (["pt", "en", "es"].includes(base) ? base : "pt") as "pt" | "en" | "es";
}

export async function POST(req: Request) {
  const lang = pickLang(req);

  const { pendingId, code } = await req.json().catch(() => ({} as any));

  if (!pendingId || !code) {
    const body = { ok: false, error: "invalid_data" as ApiErrorKey, lang };
    return new NextResponse(JSON.stringify(body), {
      status: STATUS_BY_REASON.invalid_data,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-language": lang,
      },
    });
  }

  const result = await confirmPendingRegistration(pendingId, code);

  if (!result.ok) {
    const reason = (result.reason ?? "mismatch") as ApiErrorKey;
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

  const body = { ok: true, lang };
  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-language": lang,
    },
  });
}
