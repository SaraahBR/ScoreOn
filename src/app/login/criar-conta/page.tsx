"use client";

import { useState } from "react";
import { Button, Container, Paper, TextField, Typography, Box, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

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
      setError(t("register.password_rules"));
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
        
        const maybeKey = String(data?.error || "");
        const translated =
          maybeKey && t(`api.errors.${maybeKey}`, maybeKey) !== `api.errors.${maybeKey}`
            ? t(`api.errors.${maybeKey}`)
            : (data?.error || t("register.errors.start_failed"));
        setError(translated);
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
        const maybeKey = String(data?.error || "");
        const translated =
          maybeKey && t(`api.errors.${maybeKey}`, maybeKey) !== `api.errors.${maybeKey}`
            ? t(`api.errors.${maybeKey}`)
            : (data?.error || t("register.errors.invalid_code"));
        setError(translated);
        return;
      }

      alert(t("register.success_created"));
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("register.title")}
      </Typography>

      <Paper sx={{ p: 3 }}>
        {step === "form" && (
          <Box component="form" onSubmit={startRegister}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {String(error)}
              </Alert>
            )}

            <TextField
              label={t("register.form.name")}
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              label={t("register.form.email")}
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <TextField
              label={t("register.form.password")}
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={t("register.password_hint")}
              required
            />

            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? t("register.generating_code") : t("register.continue")}
              </Button>
            </Box>
          </Box>
        )}

        {step === "code" && (
          <Box component="form" onSubmit={confirmRegister}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {String(error)}
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
              {/* Mensagem igual à de recuperação de senha */}
              {t("register.code.info_html", {
              })}
              {t("register.code.info")}
            </Alert>

            <Typography sx={{ mb: 1 }}>{t("register.code.prompt")}</Typography>

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
              label={t("register.code.label")}
              fullWidth
              margin="normal"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
              required
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? t("register.confirming") : t("register.confirm")}
              </Button>
              <Button
                type="button"
                variant="text"
                onClick={() => setStep("form")}
                disabled={loading}
              >
                {t("register.back")}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
