import { NextResponse } from "next/server";
import { setUserImage } from "@/lib/user-repo";

export async function POST(req: Request) {
  try {
    const { email, imageDataUrl } = await req.json().catch(() => ({}));
    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
    }

    if (imageDataUrl && typeof imageDataUrl === "string") {
      const okPrefix = imageDataUrl.startsWith("data:image/");
      const hasBase64 = imageDataUrl.includes(";base64,");
      if (!okPrefix || !hasBase64) {
        return NextResponse.json({ error: "Formato de imagem inválido" }, { status: 400 });
      }
    }

    const res = await setUserImage(email, imageDataUrl ?? null);
    if (!res.ok) {
      const status = res.reason === "not_found" ? 404 : 400;
      return NextResponse.json({ error: res.reason }, { status });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erro ao salvar a foto" }, { status: 500 });
  }
}
