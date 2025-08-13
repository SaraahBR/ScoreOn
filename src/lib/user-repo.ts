import { randomUUID } from "crypto";

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  passwordHash: string;
  emailVerified: boolean;
  recoveryCode: string; 
};

type PendingReg = {
  id: string;            
  name: string;
  email: string;
  passwordHash: string;
  code: string;         
  expires: number;       
  attempts: number;     
};

declare global {
  var __USERS__: Map<string, User> | undefined;
  var __PENDINGS__: Map<string, PendingReg> | undefined;
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

export async function getUserByEmail(email: string) {
  return users.get(email.toLowerCase()) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  image?: string | null;
  recoveryCode: string; 
}) {
  const key = data.email.toLowerCase();
  if (users.has(key)) throw new Error("E-mail já cadastrado");
  const user: User = {
    id: randomUUID(),
    name: data.name,
    email: key,
    image: data.image ?? null,
    passwordHash: data.passwordHash,
    emailVerified: true, 
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

export async function setUserImage(email: string, image: string | null) {
  const u = users.get(email.toLowerCase());
  if (!u) return { ok: false, reason: "not_found" };
  u.image = image || null; 
  return { ok: true };
}

export function generate6Digits() {
  return String(Math.floor(100000 + Math.random() * 900000));
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
