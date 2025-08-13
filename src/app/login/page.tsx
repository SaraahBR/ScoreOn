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
import LoginIcon from "@mui/icons-material/Login";

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

          <Box sx={{ mt: 0.5, mb: 1, textAlign: "right" }}>
            <Link
              href="/login/esqueci-senha"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="body2" sx={{ color: "#bfa14a" }}>
                Esqueci a senha
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#bfa14a",
                "&:hover": { backgroundColor: "#a68f3d" },
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                minWidth: "60px",
                padding: 0,
              }}
            >
              {loading ? "..." : <LoginIcon fontSize="large" />}
            </Button>
          </Box>
        </Box>

        <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            component={Link}
            href="/login/criar-conta"
            variant="contained"
            sx={{
              backgroundColor: "#bfa14a",
              "&:hover": { backgroundColor: "#a68f3d" },
              textTransform: "none",
              fontSize: "0.9rem",
              px: 3,
              py: 0.8,
              borderRadius: "8px",
            }}
          >
            Criar Conta
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#bfa14a",
              "&:hover": { backgroundColor: "#a68f3d" },
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
                    color: "#bfa14a",
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

        <Typography variant="body2" sx={{ mt: 2 }}>
          Ao continuar, você concorda com nossos termos.
        </Typography>
      </Paper>
    </Container>
  );
}
