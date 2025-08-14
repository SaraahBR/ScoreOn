import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

type Lang = "pt" | "en" | "es";
function pickLang(req: Request): Lang {
  const raw = req.headers.get("accept-language") || "";
  const code = raw.split(",")[0]?.trim() || "pt";
  const base = code.split("-")[0];
  return (["pt", "en", "es"].includes(base) ? base : "pt") as Lang;
}
function json(body: any, lang: Lang, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-language": lang,
      "cache-control": "no-store",
    },
  });
}

export async function GET(req: Request) {
  const lang = pickLang(req);
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return json({ ok: false, error: "email_required" }, lang, 400);
  }

  const result = await sql/*sql*/`
    select
      email, name, cpf, sex, birthdate,
      address, neighborhood, city, state, cep, phone,
      avatar_url
    from users
    where email = ${email}
    limit 1
  `;

  const row = result.rows[0];
  if (!row) {
    return json(
      {
        ok: true,
        email,
        name: null,
        cpf: null,
        sex: "Não Informar",
        birthdate: null,
        address: null,
        neighborhood: null,
        city: null,
        state: null,
        cep: null,
        phone: null,
        avatar_url: null,
      },
      lang,
      200
    );
  }

  return json({ ok: true, ...row }, lang, 200);
}

export async function POST(req: Request) {
  const lang = pickLang(req);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, lang, 400);
  }

  const {
    email,
    name = null,
    cpf = null,
    sex = null,
    birthdate = null, 
    address = null,
    neighborhood = null,
    city = null,
    state = null,
    cep = null,
    phone = null,
  } = body || {};

  if (!email) {
    return json({ ok: false, error: "email_required" }, lang, 400);
  }

  
  await sql/*sql*/`
    insert into users (
      email, name, cpf, sex, birthdate,
      address, neighborhood, city, state, cep, phone
    )
    values (
      ${email},
      ${name},
      ${cpf},
      ${sex},
      ${birthdate},          
      ${address},
      ${neighborhood},
      ${city},
      ${state},
      ${cep},
      ${phone}
    )
    on conflict (email) do update set
      name = excluded.name,
      cpf = excluded.cpf,
      sex = excluded.sex,
      birthdate = excluded.birthdate,
      address = excluded.address,
      neighborhood = excluded.neighborhood,
      city = excluded.city,
      state = excluded.state,
      cep = excluded.cep,
      phone = excluded.phone
  `;

  return json({ ok: true }, lang, 200);
}
