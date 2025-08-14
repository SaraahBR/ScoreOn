"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function VerifyPage() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"ok" | "fail" | "loading">("loading");

  useEffect(() => {
    const token = params.get("token");
    async function run() {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      setStatus(res.ok ? "ok" : "fail");
    }
    if (token) run();
  }, [params]);

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verificação de e-mail
      </Typography>
      {status === "loading" && <Typography>Verificando...</Typography>}
      {status === "ok" && (
        <Box>
          <Typography>✅ E-mail verificado com sucesso. Você já pode entrar.</Typography>
          <Button component={Link} href="/login" sx={{ mt: 2 }} variant="contained">Ir para o login</Button>
        </Box>
      )}
      {status === "fail" && <Typography>❌ Link inválido ou expirado.</Typography>}
    </Container>
  );
}
