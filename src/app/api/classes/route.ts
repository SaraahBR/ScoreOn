import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

// GET /api/classes?email=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return json({ ok: false, error: "email_required" }, 400);

  const { rows } = await sql/*sql*/`
    select id, name, school_year from classes
    where user_email = ${email}
    order by created_at desc, id desc
  `;
  return json({ ok: true, items: rows });
}

// POST /api/classes { email, name, school_year }
export async function POST(req: Request) {
  const { email, name, school_year } = await req.json().catch(() => ({}));
  if (!email || !name || !school_year) return json({ ok: false, error: "missing_fields" }, 400);

  const { rows } = await sql/*sql*/`
    insert into classes (user_email, name, school_year)
    values (${email}, ${name}, ${school_year})
    returning id, name, school_year
  `;
  return json({ ok: true, item: rows[0] });
}

// PUT /api/classes { email, id, name, school_year }
export async function PUT(req: Request) {
  const { email, id, name, school_year } = await req.json().catch(() => ({}));
  if (!email || !id || !name || !school_year) return json({ ok: false, error: "missing_fields" }, 400);

  const { rowCount, rows } = await sql/*sql*/`
    update classes
    set name = ${name}, school_year = ${school_year}
    where id = ${id} and user_email = ${email}
    returning id, name, school_year
  `;
  if (!rowCount) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true, item: rows[0] });
}

// DELETE /api/classes?id=...&email=...
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const email = searchParams.get("email");
  if (!id || !email) return json({ ok: false, error: "missing_fields" }, 400);

  const { rowCount } = await sql/*sql*/`
    delete from classes where id = ${id} and user_email = ${email}
  `;
  if (!rowCount) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true });
}
