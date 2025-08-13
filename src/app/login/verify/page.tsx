"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function VerifyPage() {
  const { t } = useTranslation(); 
  const params = useSearchParams();
  const [status, setStatus] = useState<"ok" | "fail" | "loading">("loading");

  useEffect(() => {
    const token = params.get("token");
    async function run() {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setStatus(res.ok ? "ok" : "fail");
    }
    if (token) run();
  }, [params]);

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("verifyPage.title")}
      </Typography>

      {status === "loading" && <Typography>{t("verifyPage.loading")}</Typography>}

      {status === "ok" && (
        <Box>
          <Typography>{t("verifyPage.success")}</Typography>
          <Button component={Link} href="/login" sx={{ mt: 2 }} variant="contained">
            {t("verifyPage.goToLogin")}
          </Button>
        </Box>
      )}

      {status === "fail" && <Typography>{t("verifyPage.error")}</Typography>}
    </Container>
  );
}
