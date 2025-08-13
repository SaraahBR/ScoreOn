import { NextResponse } from "next/server";
import { startPendingRegistration, getUserByEmail } from "@/lib/user-repo";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json().catch(() => ({}));
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const exists = await getUserByEmail(email);
  if (exists) {
    return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
  }

  const passwordHash = await hash(password, 10);
  const { pendingId, code, expiresIn } = await startPendingRegistration(name, email, passwordHash);

  return NextResponse.json({ ok: true, pendingId, code, expiresIn });
}
