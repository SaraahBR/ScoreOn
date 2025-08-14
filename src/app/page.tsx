"use client";

import { Container, Typography, Box, Button, Stack } from "@mui/material";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t, ready } = useTranslation("common");
  if (!ready) return null;

  const testimonialPalette = [
    { bg: "#fffbe6", avatar: "A", avatarBg: "#ffe066", avatarColor: "#bfa100", authorColor: "#bfa100" },
    { bg: "#e6f7ff", avatar: "C", avatarBg: "#91d5ff", avatarColor: "#005fa3", authorColor: "#005fa3" },
    { bg: "#f6ffed", avatar: "M", avatarBg: "#b7eb8f", avatarColor: "#389e0d", authorColor: "#389e0d" },
    { bg: "#fff0f6", avatar: "J", avatarBg: "#ffadd2", avatarColor: "#c41d7f", authorColor: "#c41d7f" },
    { bg: "#f0f5ff", avatar: "S", avatarBg: "#adc6ff", avatarColor: "#2f54eb", authorColor: "#2f54eb" }
  ];

  const cards = t("homePage.testimonials.cards", { returnObjects: true }) as Array<{ text: string; author: string }>;

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 4, md: 8 },
          mb: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" }
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: 28, md: 40 },
            fontWeight: 800,
            color: "#111",
            fontFamily: "Smooch Sans, Arial, sans-serif",
            letterSpacing: 0.5,
            textAlign: { xs: "center", md: "left" },
            mb: 1
          }}
        >
          {t("landing.title")}
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          {t("landing.subtitle")}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
            fontSize: { xs: 16, md: 20 },
            fontWeight: 500,
            textAlign: { xs: "center", md: "left" },
            maxWidth: 600
          }}
        >
          {t("homePage.lead")}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4, justifyContent: { xs: "center", md: "flex-start" } }}>
          <Button variant="contained" href="/login/criar-conta">
            {t("landing.cta_start")}
          </Button>
          <Button variant="outlined" href="/documentacao" target="_blank" rel="noopener noreferrer">
            {t("landing.cta_docs")}
          </Button>
        </Stack>

        <Hero />
        <Box sx={{ mt: 8 }}>
          <Features />
        </Box>
      </Container>

      {/* Bloco de Benefícios */}
      <Box sx={{ mb: 6, p: { xs: 2, md: 4 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: "center", letterSpacing: 0.5 }}>
          {t("homePage.benefits.title")}
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="center" alignItems="stretch">
          {[
            { emoji: "⏱️", title: t("homePage.benefits.items.time.title"), text: t("homePage.benefits.items.time.text") },
            { emoji: "🔒", title: t("homePage.benefits.items.security.title"), text: t("homePage.benefits.items.security.text") },
            { emoji: "🎯", title: t("homePage.benefits.items.ease.title"), text: t("homePage.benefits.items.ease.text") }
          ].map((b, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                minWidth: 220,
                maxWidth: 340,
                bgcolor: "#f9fafb",
                borderRadius: 2,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: 0
              }}
            >
              <Box sx={{ fontSize: 36, mb: 1 }}>{b.emoji}</Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: "center" }}>
                {b.title}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
                {b.text}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Texto institucional */}
      <Box
        sx={{
          mb: 8,
          bgcolor: "#f7f9fb",
          border: "1px solid #e3e7ef",
          borderRadius: 2,
          px: { xs: 2, md: 4 },
          py: { xs: 2.5, md: 3 },
          textAlign: "center",
          maxWidth: 800,
          mx: "auto"
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, color: "#333", fontSize: { xs: 16.5, md: 19 }, letterSpacing: 0.1 }}>
          {t("homePage.mission")}
        </Typography>
      </Box>

      {/* Carrossel de Depoimentos */}
      <Box
        sx={{
          mt: 8,
          mb: 7,
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          ml: "-50vw",
          mr: "-50vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.default",
          overflow: "hidden"
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}>
          {t("homePage.testimonials.title")}
        </Typography>

        <Box sx={{ width: "100vw", overflow: "hidden", position: "relative", px: { xs: 0, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              willChange: "transform",
              minWidth: "400%",
              animation: "scroll-x-infinite 48s linear infinite",
              "@keyframes scroll-x-infinite": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
              "&:hover": { animationPlayState: "paused" }
            }}
          >
            {[...Array(4)]
              .flatMap(() => cards)
              .map((card, idx) => {
                const p = testimonialPalette[idx % testimonialPalette.length];
                return (
                  <Box
                    key={idx}
                    sx={{
                      bgcolor: p.bg,
                      p: 3,
                      pb: 4,
                      borderRadius: 3,
                      boxShadow: 2,
                      minWidth: 320,
                      mx: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      flex: "0 0 320px"
                    }}
                  >
                    <Box sx={{ position: "absolute", top: 18, left: 18, fontSize: 38, color: p.avatarColor, opacity: 0.13, zIndex: 0 }}>
                      “
                    </Box>
                    <Box sx={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box
                        sx={{
                          bgcolor: p.avatarBg,
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1
                        }}
                      >
                        <Typography variant="h6" sx={{ color: p.avatarColor, fontWeight: 700 }}>
                          {p.avatar}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontStyle: "italic", textAlign: "center", mb: 1 }}>
                        {card.text}
                      </Typography>
                      <Typography variant="caption" sx={{ display: "block", fontWeight: 500, color: p.authorColor }}>
                        — {card.author}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Box>

        <Typography variant="caption" sx={{ mt: 2, color: "#aaa", textAlign: "center" }}>
          {t("homePage.testimonials.pause_hint")}
        </Typography>
      </Box>
    </Container>
  );
}
