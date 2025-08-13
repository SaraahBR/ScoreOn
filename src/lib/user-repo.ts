// src/lib/user-repo.ts
import { randomUUID } from "crypto";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  passwordHash: string;
  emailVerified: boolean;
  recoveryCode: string; // <— mesmo código do cadastro; guarde para sempre
};

// ---- Persistência em globalThis para não perder dados em HMR (dev) ----
type PendingReg = {
  id: string;            // pendingId
  name: string;
  email: string;
  passwordHash: string;
  code: string;          // 6 dígitos (mostrado no cadastro e será o recoveryCode)
  expires: number;       // TTL (10min)
  attempts: number;      // limite de tentativas
};

declare global {
  // eslint-disable-next-line no-var
  var __USERS__: Map<string, User> | undefined;
  // eslint-disable-next-line no-var
  var __PENDINGS__: Map<string, PendingReg> | undefined;
  // eslint-disable-next-line no-var
  var __PENDING_BY_EMAIL__: Map<string, string> | undefined;
}

const users: Map<string, User> =
  globalThis.__USERS__ ?? new Map<string, User>();
const pendings: Map<string, PendingReg> =
  globalThis.__PENDINGS__ ?? new Map<string, PendingReg>();
const byEmail: Map<string, string> =
  globalThis.__PENDING_BY_EMAIL__ ?? new Map<string, string>();

globalThis.__USERS__ = users;
globalThis.__PENDINGS__ = pendings;
globalThis.__PENDING_BY_EMAIL__ = byEmail;

// ======================= API pública =======================

export async function getUserByEmail(email: string) {
  return users.get(email.toLowerCase()) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  image?: string | null;
  recoveryCode: string; // obrigatório agora
}) {
  const key = data.email.toLowerCase();
  if (users.has(key)) throw new Error("E-mail já cadastrado");
  const user: User = {
    id: randomUUID(),
    name: data.name,
    email: key,
    image: data.image ?? null,
    passwordHash: data.passwordHash,
    emailVerified: true, // verificação local concluída
    recoveryCode: data.recoveryCode,
  };
  users.set(key, user);
  return user;
}

export async function updatePassword(email: string, passwordHash: string) {
  const u = users.get(email.toLowerCase());
  if (!u) return false;
  u.passwordHash = passwordHash;
  return true;
}

export async function resetPasswordWithRecoveryCode(
  email: string,
  recoveryCode: string,
  newPasswordHash: string
) {
  const u = users.get(email.toLowerCase());
  if (!u) return { ok: false, reason: "not_found" };
  if (u.recoveryCode !== recoveryCode) return { ok: false, reason: "mismatch" };
  u.passwordHash = newPasswordHash;
  return { ok: true };
}

export function generate6Digits() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function setUserImage(email: string, image: string | null) {
  const u = users.get(email.toLowerCase());
  if (!u) return { ok: false, reason: "not_found" };
  u.image = image || null; 
  return { ok: true };
}


export async function startPendingRegistration(
  name: string,
  email: string,
  passwordHash: string,
  ttlMs = 10 * 60 * 1000
) {
  const lower = email.toLowerCase();

  if (users.has(lower)) throw new Error("E-mail já cadastrado");

  const prev = byEmail.get(lower);
  if (prev) {
    pendings.delete(prev);
    byEmail.delete(lower);
  }

  const pendingId = randomUUID();
  const code = generate6Digits();

  const rec: PendingReg = {
    id: pendingId,
    name,
    email: lower,
    passwordHash,
    code,
    expires: Date.now() + ttlMs,
    attempts: 0,
  };

  pendings.set(pendingId, rec);
  byEmail.set(lower, pendingId);

  return { pendingId, code, expiresIn: Math.floor(ttlMs / 1000) };
}

export async function confirmPendingRegistration(pendingId: string, code: string) {
  const rec = pendings.get(pendingId);
  if (!rec) return { ok: false, reason: "not_found" };
  if (Date.now() > rec.expires) {
    pendings.delete(pendingId);
    byEmail.delete(rec.email);
    return { ok: false, reason: "expired" };
  }
  rec.attempts += 1;
  if (rec.code !== code) {
    if (rec.attempts >= 5) {
      pendings.delete(pendingId);
      byEmail.delete(rec.email);
      return { ok: false, reason: "too_many_attempts" };
    }
    return { ok: false, reason: "mismatch" };
  }

  // cria usuário definitivo — salva o code como recoveryCode
  await createUser({
    name: rec.name,
    email: rec.email,
    passwordHash: rec.passwordHash,
    recoveryCode: rec.code,
  });

  pendings.delete(pendingId);
  byEmail.delete(rec.email);

  return { ok: true };
}
