"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

type Props = { token: string };

export default function VerifyClient({ token }: Props) {
  const [status, setStatus] = useState<"ok" | "fail" | "loading">(
    token ? "loading" : "fail"
  );

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        setStatus(res.ok ? "ok" : "fail");
      } catch {
        setStatus("fail");
      }
    })();
  }, [token]);

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verificação de e-mail
      </Typography>

      {status === "loading" && <Typography>Verificando...</Typography>}

      {status === "ok" && (
        <Box>
          <Typography>
            ✅ E-mail verificado com sucesso. Você já pode entrar.
          </Typography>
          <Button
            component={Link}
            href="/login"
            sx={{ mt: 2 }}
            variant="contained"
          >
            Ir para o login
          </Button>
        </Box>
      )}

      {status === "fail" && (
        <Typography>❌ Link inválido ou expirado.</Typography>
      )}
    </Container>
  );
}
