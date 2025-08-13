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
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation(); // usa common.json
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
        alert(res.error || t("loginPage.login_failed"));
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
        {t("loginPage.title")}
      </Typography>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label={t("loginPage.email")}
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <TextField
            label={t("loginPage.password")}
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
                {t("loginPage.forgot_password")}
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
              aria-label={t("loginPage.login")}
              title={t("loginPage.login")}
            >
              {loading ? t("loginPage.loading_ellipsis") : <LoginIcon fontSize="large" />}
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
            {t("loginPage.create_account")}
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
            {t("loginPage.login_with_google")}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          {t("loginPage.terms_notice")}
        </Typography>
      </Paper>
    </Container>
  );
}
