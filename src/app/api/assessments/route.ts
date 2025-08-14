import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

const json = (b:any, s=200) =>
  new NextResponse(JSON.stringify(b), { status:s, headers:{ "content-type":"application/json; charset=utf-8", "cache-control":"no-store" }});

// GET /api/assessments?email=...&classId=...  (retorna term também)
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const email = sp.get("email");
  const classIdStr = sp.get("classId");
  if (!email || !classIdStr) return json({ ok:false, error:"missing_params" }, 400);
  const classId = Number(classIdStr);

  const { rows } = await sql/*sql*/`
    select id, name, class_id, coalesce(weight,1.0) as weight, coalesce(term,'Geral') as term
    from assessments
    where user_email = ${email} and class_id = ${classId}
    order by created_at desc, id desc
  `;
  return json({ ok:true, items: rows });
}

// POST /api/assessments { email, class_id, name, weight?, term? }
export async function POST(req: Request) {
  const { email, class_id, name, weight, term } = await req.json().catch(() => ({}));
  if (!email || !class_id || !name) return json({ ok:false, error:"missing_fields" }, 400);
  const w = Number(weight ?? 1);
  if (!Number.isFinite(w) || w <= 0) return json({ ok:false, error:"invalid_weight" }, 400);
  const termVal = (typeof term === "string" && term.trim()) ? term.trim() : "Geral";

  const own = await sql/*sql*/`select id from classes where id = ${class_id} and user_email = ${email}`;
  if (!own.rowCount) return json({ ok:false, error:"class_not_found" }, 404);

  const { rows } = await sql/*sql*/`
    insert into assessments (user_email, class_id, name, weight, term)
    values (${email}, ${class_id}, ${name}, ${w}, ${termVal})
    returning id, name, class_id, weight, term
  `;
  return json({ ok:true, item: rows[0] });
}

// PUT /api/assessments { email, id, name?, weight?, term? }
export async function PUT(req: Request) {
  const { email, id, name, weight, term } = await req.json().catch(() => ({}));
  if (!email || !id) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }

  const newName =
    typeof name === "string" && name.trim() ? name.trim() : null;

  let newWeight: number | null = null;
  if (weight !== undefined) {
    const w = Number(String(weight).replace(",", "."));
    if (!Number.isFinite(w) || w <= 0) {
      return json({ ok: false, error: "invalid_weight" }, 400);
    }
    newWeight = w;
  }

  const newTerm =
    typeof term === "string" && term.trim() ? term.trim() : null;

  const { rowCount, rows } = await sql/*sql*/`
    update assessments
    set
      name   = coalesce(${newName}, name),
      weight = coalesce(${newWeight}, weight),
      term   = coalesce(${newTerm}, term)
    where id = ${id} and user_email = ${email}
    returning id, name, class_id, weight, term
  `;

  if (!rowCount) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true, item: rows[0] });
}

// DELETE igual ao que você já tem
export async function DELETE(req: Request) {
  const sp = new URL(req.url).searchParams;
  const idStr = sp.get("id");
  const email = sp.get("email");
  if (!idStr || !email) return json({ ok:false, error:"missing_params" }, 400);
  const id = Number(idStr);
  const { rowCount } = await sql/*sql*/`delete from assessments where id = ${id} and user_email = ${email}`;
  if (!rowCount) return json({ ok:false, error:"not_found" }, 404);
  return json({ ok:true });
}
