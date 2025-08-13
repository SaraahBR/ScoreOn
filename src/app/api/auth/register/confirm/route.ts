import { NextResponse } from "next/server";
import { confirmPendingRegistration } from "@/lib/user-repo";

export async function POST(req: Request) {
  const { pendingId, code } = await req.json().catch(() => ({}));
  if (!pendingId || !code) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const result = await confirmPendingRegistration(pendingId, code);
  if (!result.ok) {
    const map: Record<string, number> = {
      not_found: 404,
      expired: 410,
      mismatch: 400,
      too_many_attempts: 429,
    };
    return NextResponse.json({ error: result.reason }, { status: map[result.reason!] ?? 400 });
  }

  return NextResponse.json({ ok: true });
}
