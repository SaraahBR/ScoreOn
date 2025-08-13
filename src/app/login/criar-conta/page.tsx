"use client";

import { useState } from "react";
import { Button, Container, Paper, TextField, Typography, Box, Alert } from "@mui/material";

export default function Page() {
  const [step, setStep] = useState<"form" | "code">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pendingId, setPendingId] = useState("");
  const [serverCode, setServerCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validarSenha(senha: string) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(senha);
  }

  async function startRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validarSenha(password)) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Erro ao iniciar cadastro");
        return;
      }
      setPendingId(data.pendingId);
      setServerCode(data.code);
      setStep("code");
    } finally {
      setLoading(false);
    }
  }

  async function confirmRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingId, code: inputCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Código inválido");
        return;
      }
      alert("Conta criada com sucesso! Agora você pode entrar com e-mail e senha.");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Criar conta
      </Typography>

      <Paper sx={{ p: 3 }}>
        {step === "form" && (
          <Box component="form" onSubmit={startRegister}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}
            <TextField label="Nome" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="E-mail" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Gerando código..." : "Continuar"}
              </Button>
            </Box>
          </Box>
        )}

        {step === "code" && (
          <Box component="form" onSubmit={confirmRegister}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>}

            {/* Mensagem igual à de recuperação de senha */}
            <Alert severity="info" sx={{ mb: 2 }}>
              O <strong>código de confirmação</strong> mostrado abaixo é único e será necessário
              para confirmar a criação da sua conta.
            </Alert>

            <Typography sx={{ mb: 1 }}>
              Digite o código mostrado abaixo para confirmar seu cadastro:
            </Typography>

            <Box
              sx={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "8px",
                mb: 2,
                p: 2,
                textAlign: "center",
                border: "1px solid #ddd",
                borderRadius: 1,
                userSelect: "none",
              }}
            >
              {serverCode}
            </Box>

            <TextField
              label="Código"
              fullWidth
              margin="normal"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
              required
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Confirmando..." : "Confirmar cadastro"}
              </Button>
              <Button type="button" variant="text" onClick={() => setStep("form")} disabled={loading}>
                Voltar
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
