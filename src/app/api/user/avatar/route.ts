import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  try {
    const { email, imageDataUrl } = (await req.json().catch(() => ({}))) as {
      email?: string;
      imageDataUrl?: string | null;
    };

    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
    }

    // Remove o avatar
    if (!imageDataUrl) {
      await sql`update users set avatar_url = null where email = ${email}`;
      await sql`insert into users (email) values (${email}) on conflict (email) do nothing`;
      return NextResponse.json({ ok: true });
    }

    // Valida a dataURL
    if (
      typeof imageDataUrl !== "string" ||
      !imageDataUrl.startsWith("data:image/") ||
      !imageDataUrl.includes(";base64,")
    ) {
      return NextResponse.json({ error: "Formato de imagem inválido" }, { status: 400 });
    }

    const base64 = imageDataUrl.split(",")[1];
    if (!base64) {
      return NextResponse.json({ error: "Imagem corrompida" }, { status: 400 });
    }
    const buf = Buffer.from(base64, "base64");

    // Blob
    const blob = await put(`avatars/${email}-${Date.now()}.png`, buf, {
      access: "public",
      contentType: "image/png",
    });

    // Postgres
    await sql`
      insert into users (email, avatar_url)
      values (${email}, ${blob.url})
      on conflict (email) do update set avatar_url = ${blob.url}
    `;

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e: any) {
    console.error("[avatar/POST] Error:", e);
    return NextResponse.json({ error: e?.message || "Falha ao salvar a foto" }, { status: 500 });
  }
}
