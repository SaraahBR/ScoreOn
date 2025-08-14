import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

// GET /api/students?email=...&classId=optional
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const classIdStr = searchParams.get("classId");
  if (!email) return json({ ok: false, error: "email_required" }, 400);

  // opcionalmente, normaliza para número
  const classId = classIdStr ? Number(classIdStr) : null;

  let rows: any[] = [];

  if (classId) {
    // com filtro de turma
    const res = await sql/*sql*/`
      select s.id, s.name, s.registration, s.class_id
      from students s
      where s.user_email = ${email} and s.class_id = ${classId}
      order by s.created_at desc, s.id desc
    `;
    rows = res.rows;
  } else {
    // sem filtro de turma
    const res = await sql/*sql*/`
      select s.id, s.name, s.registration, s.class_id
      from students s
      where s.user_email = ${email}
      order by s.created_at desc, s.id desc
    `;
    rows = res.rows;
  }

  return json({ ok: true, items: rows });
}


// POST /api/students { email, name, registration, class_id }
export async function POST(req: Request) {
  const { email, name, registration, class_id } = await req.json().catch(() => ({}));
  if (!email || !name || !registration || !class_id) return json({ ok: false, error: "missing_fields" }, 400);

  // Garante que a turma pertence ao usuário
  const cls = await sql/*sql*/`select id from classes where id = ${class_id} and user_email = ${email}`;
  if (!cls.rowCount) return json({ ok: false, error: "class_not_found" }, 404);

  const { rows } = await sql/*sql*/`
    insert into students (user_email, class_id, name, registration)
    values (${email}, ${class_id}, ${name}, ${registration})
    returning id, name, registration, class_id
  `;
  return json({ ok: true, item: rows[0] });
}

// PUT /api/students { email, id, name, registration }
export async function PUT(req: Request) {
  const { email, id, name, registration } = await req.json().catch(() => ({}));
  if (!email || !id || !name || !registration) return json({ ok: false, error: "missing_fields" }, 400);

  const { rowCount, rows } = await sql/*sql*/`
    update students
    set name = ${name}, registration = ${registration}
    where id = ${id} and user_email = ${email}
    returning id, name, registration, class_id
  `;
  if (!rowCount) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true, item: rows[0] });
}

// DELETE /api/students?id=...&email=...
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const email = searchParams.get("email");
  if (!id || !email) return json({ ok: false, error: "missing_fields" }, 400);

  const { rowCount } = await sql/*sql*/`
    delete from students where id = ${id} and user_email = ${email}
  `;
  if (!rowCount) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true });
}
