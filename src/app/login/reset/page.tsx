"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        alert(t("resetConfirm.success"));
        window.location.href = "/login";
      } else {
        alert(t("resetConfirm.error_link"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("resetConfirm.title")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label={t("resetConfirm.new_password")}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? t("resetConfirm.saving") : t("resetConfirm.save")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
