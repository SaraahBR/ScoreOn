"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Divider,
} from "@mui/material";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        alert(res.error || "Falha no login");
        return;
      }
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label="E-mail"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <TextField
            label="Senha"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {/* Esqueci a senha */}
          <Box sx={{ mt: 0.5, mb: 1, textAlign: "right" }}>
            <Link
              href="/login/esqueci-senha"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="body2" color="primary">
                Esqueci a senha
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </Box>
        </Box>

        {/* Botão Criar Conta */}
        <Box mt={1.5}>
          <Button
            component={Link}
            href="/login/criar-conta"
            variant="contained"
            fullWidth
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              py: 1,
            }}
          >
            Criar Conta
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Botão Google */}
        <Box>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#1a73e8",
              "&:hover": { backgroundColor: "#1669c1" },
              textTransform: "none",
              py: 1.1,
            }}
            startIcon={
              <Box
                component="span"
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: 16,
                    lineHeight: 1,
                    color: "#1a73e8",
                    transform: "translateY(0.5px)", 
                  }}
                >
                  G
                </Box>
              </Box>
            }
          >
            Login com Google
          </Button>
        </Box>

        {/* Termos */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Ao continuar, você concorda com nossos termos.
        </Typography>
      </Paper>
    </Container>
  );
}
