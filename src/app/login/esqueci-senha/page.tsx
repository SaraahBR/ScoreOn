"use client";

import React, { useState } from "react";
import { Button, Container, Paper, TextField, Typography, Box, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

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
        const maybeKey = String(data?.error || "");
        const translated =
          maybeKey && t(`api.errors.${maybeKey}`, maybeKey) !== `api.errors.${maybeKey}`
            ? t(`api.errors.${maybeKey}`)
            : (data?.error || t("reset.errors.generic"));
        setErr(translated);
        return;
      }

      setMsg(t("reset.success"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("reset.title")}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t("reset.info")}
        </Alert>

        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label={t("reset.form.email")}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label={t("reset.form.code")}
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 6 }}
            required
          />

          <TextField
            label={t("reset.form.new_password")}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? t("reset.saving") : t("reset.save")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
