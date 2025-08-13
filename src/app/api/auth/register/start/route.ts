import { NextResponse } from "next/server";
import { startPendingRegistration, getUserByEmail } from "@/lib/user-repo";
import { hash } from "bcryptjs";

type ApiErrorKey =
  | "invalid_data"
  | "email_in_use";

const STATUS_BY_REASON: Record<ApiErrorKey, number> = {
  invalid_data: 400,
  email_in_use: 409,
};

function pickLang(req: Request) {
  const raw = req.headers.get("accept-language") || "";
  const code = raw.split(",")[0]?.trim() || "pt";
  const base = code.split("-")[0];
  return (["pt", "en", "es"].includes(base) ? base : "pt") as "pt" | "en" | "es";
}

export async function POST(req: Request) {
  const lang = pickLang(req);

  const { name, email, password } = await req.json().catch(() => ({} as any));
  if (!name || !email || !password) {
    const body = { ok: false, error: "invalid_data" as ApiErrorKey, lang };
    return new NextResponse(JSON.stringify(body), {
      status: STATUS_BY_REASON.invalid_data,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-language": lang,
      },
    });
  }

  const exists = await getUserByEmail(email);
  if (exists) {
    const body = { ok: false, error: "email_in_use" as ApiErrorKey, lang };
    return new NextResponse(JSON.stringify(body), {
      status: STATUS_BY_REASON.email_in_use,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-language": lang,
      },
    });
  }

  const passwordHash = await hash(password, 10);
  const { pendingId, code, expiresIn } = await startPendingRegistration(
    name,
    email,
    passwordHash
  );

  const body = { ok: true, pendingId, code, expiresIn, lang };
  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-language": lang,
    },
  });
}
