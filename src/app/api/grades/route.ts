import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

const json = (b: any, s = 200) =>
  new NextResponse(JSON.stringify(b), {
    status: s,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

// GET /api/grades?email=...&classId=...
// -> devolve { assessment_id, student_id, value } para a turma
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const email = sp.get("email");
  const classIdStr = sp.get("classId");
  if (!email || !classIdStr)
    return json({ ok: false, error: "missing_params" }, 400);
  const classId = Number(classIdStr);

  const { rows } = await sql/*sql*/ `
    select g.assessment_id, g.student_id, g.value::text
    from grades g
    join assessments a on a.id = g.assessment_id
    where g.user_email = ${email} and a.class_id = ${classId}
  `;
  return json({ ok: true, items: rows });
}

// POST /api/grades  { email, assessment_id, student_id, value }
// UPSERT pela unique(user_email, assessment_id, student_id)
export async function POST(req: Request) {
  const { email, assessment_id, student_id, value } = await req
    .json()
    .catch(() => ({}));
  if (!email || !assessment_id || !student_id || value === undefined) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }

  // valida ownership: avaliação e aluno pertencem ao usuário e mesma turma
  const a = await sql/*sql*/ `
    select a.id, a.class_id from assessments a
    where a.id = ${assessment_id} and a.user_email = ${email}
  `;
  if (!a.rowCount)
    return json({ ok: false, error: "assessment_not_found" }, 404);

  const s = await sql/*sql*/ `
    select st.id, st.class_id from students st
    where st.id = ${student_id} and st.user_email = ${email}
  `;
  if (!s.rowCount) return json({ ok: false, error: "student_not_found" }, 404);

  if (a.rows[0].class_id !== s.rows[0].class_id) {
    return json({ ok: false, error: "class_mismatch" }, 400);
  }

  const { rows } = await sql/*sql*/ `
    insert into grades (user_email, assessment_id, student_id, value)
    values (${email}, ${assessment_id}, ${student_id}, ${value})
    on conflict (user_email, assessment_id, student_id)
    do update set value = excluded.value
    returning assessment_id, student_id, value::text
  `;
  return json({ ok: true, item: rows[0] });
}

// DELETE /api/grades?email=...&assessmentId=...&studentId=...
export async function DELETE(req: Request) {
  const sp = new URL(req.url).searchParams;
  const email = sp.get("email");
  const assessmentId = sp.get("assessmentId");
  const studentId = sp.get("studentId");
  if (!email || !assessmentId || !studentId)
    return json({ ok: false, error: "missing_params" }, 400);

  const { rowCount } = await sql/*sql*/ `
    delete from grades
    where user_email = ${email}
      and assessment_id = ${Number(assessmentId)}
      and student_id = ${Number(studentId)}
  `;
  if ((rowCount ?? 0) === 0) {
    return json({ ok: false, error: "not_found" }, 404);
  }
}
