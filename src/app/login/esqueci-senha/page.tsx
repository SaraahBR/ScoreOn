"use client";

import React, { useState } from "react";
import { Button, Container, Paper, TextField, Typography, Box, Alert } from "@mui/material";

export default function Page() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset/by-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErr(data?.error || "Não foi possível redefinir a senha.");
        return;
      }
      setMsg("Senha atualizada com sucesso! Já pode fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Esqueci a senha
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          O <strong>código de recuperação</strong> é o mesmo código que foi mostrado para você
          no momento do cadastro. Guarde esse código para sempre — ele é necessário para redefinir sua senha.
        </Alert>

        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Código de recuperação"
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
            required
          />

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
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
