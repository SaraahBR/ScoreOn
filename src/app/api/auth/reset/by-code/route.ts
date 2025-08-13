import { NextResponse } from "next/server";
import { resetPasswordWithRecoveryCode } from "@/lib/user-repo";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { email, code, password } = await req.json().catch(() => ({}));
  if (!email || !code || !password) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const newHash = await hash(password, 10);
  const result = await resetPasswordWithRecoveryCode(email, code, newHash);

  if (!result.ok) {
    const map: Record<string, number> = {
      not_found: 404,
      mismatch: 400,
    };
    return NextResponse.json({ error: result.reason }, { status: map[result.reason!] ?? 400 });
  }

  return NextResponse.json({ ok: true });
}
