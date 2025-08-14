"use client";

import { Container, Typography, Box, Button, Stack } from "@mui/material";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation("common");

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: 28, md: 36 } }}
        >
          {t("landing.title", { defaultValue: "ScoreOn — Sistema de Controle de Notas" })}
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          {t("landing.subtitle", {
            defaultValue: "Gerencie turmas, cadastre alunos e registre avaliações com praticidade.",
          })}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
          <Button
            variant="contained"
            component={Link}
            href="/login/criar-conta"
          >
            {t("landing.cta_start", { defaultValue: "Começar agora" })}
          </Button>

          <Button
            variant="outlined"
            component={Link}
            href="/documentacao"
          >
            {t("landing.cta_docs", { defaultValue: "Documentação" })}
          </Button>
        </Stack>

        <Hero />
        <Box sx={{ mt: 8 }}>
          <Features />
        </Box>
      </Container>
    </>
  );
}
