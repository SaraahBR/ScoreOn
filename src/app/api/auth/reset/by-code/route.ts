import { NextResponse } from "next/server";
import { resetPasswordWithRecoveryCode } from "@/lib/user-repo";
import { hash } from "bcryptjs";

type ApiErrorKey =
  | "invalid_data"
  | "not_found"
  | "mismatch";

const STATUS_BY_REASON: Record<ApiErrorKey, number> = {
  invalid_data: 400,
  not_found: 404,
  mismatch: 400,
};

function pickLang(req: Request) {
  const raw = req.headers.get("accept-language") || "";
  const code = raw.split(",")[0]?.trim() || "pt";
  const base = code.split("-")[0];
  return (["pt", "en", "es"].includes(base) ? base : "pt") as "pt" | "en" | "es";
}

export async function POST(req: Request) {
  const lang = pickLang(req);

  const { email, code, password } = await req.json().catch(() => ({} as any));
  if (!email || !code || !password) {
    const body = { ok: false, error: "invalid_data" as ApiErrorKey, lang };
    return new NextResponse(JSON.stringify(body), {
      status: STATUS_BY_REASON.invalid_data,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-language": lang,
      },
    });
  }

  const newHash = await hash(password, 10);
  const result = await resetPasswordWithRecoveryCode(email, code, newHash);

  if (!result.ok) {
    const reason = (result.reason ?? "mismatch") as ApiErrorKey;
    const status = STATUS_BY_REASON[reason] ?? 400;

    const body = { ok: false, error: reason, lang };
    return new NextResponse(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
