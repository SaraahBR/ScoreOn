// app/login/reset/reset-form.tsx
"use client";

import { useState } from "react";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";

type Props = { token: string };

export default function ResetForm({ token }: Props) {
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      alert("Senha atualizada! Já pode entrar.");
      // opcional: redirecionar
      // window.location.href = "/login";
    } else {
      alert("Link inválido ou expirado.");
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Redefinir senha
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label="Nova senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              Salvar nova senha
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
