"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  Stack,
  Button,
  Container,
  Box,
  Typography,
  useMediaQuery,
  IconButton,
  Tooltip,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import ProfileMenu from "../../login/profilemenu";

export default function Navbar() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t, i18n, ready } = useTranslation("common");
  const [open, setOpen] = useState(false);

  if (!ready) return null;

  const active = (i18n.resolvedLanguage || i18n.language || "pt")
    .split("-")[0] as "pt" | "en" | "es";

  const change = async (code: "pt" | "en" | "es") => {
    if (code === active) return;
    await i18n.changeLanguage(code);
    try {
      localStorage.setItem("i18nextLng", code);
      document.cookie = `i18next=${code};path=/;max-age=31536000`;
    } catch {}
    document.documentElement.setAttribute(
      "lang",
      code === "pt" ? "pt-BR" : code
    );
  };

  const flagButtonSx = (isActive: boolean) =>
    ({
      p: 0,
      width: 32,
      height: 22,
      borderRadius: 0,
      overflow: "hidden",
      bgcolor: "transparent",
      border: `2px solid ${
        isActive
          ? theme.palette.mode === "dark"
            ? "#ddd"
            : "#333"
          : alpha(theme.palette.text.primary, 0.35)
      }`,
      opacity: isActive ? 1 : 0.95,
      transition:
        "transform .15s ease, opacity .15s ease, border-color .15s ease",
      boxShadow: "none",
      "&:hover": {
        transform: "scale(1.04)",
        opacity: 1,
        borderColor: theme.palette.text.primary,
        bgcolor: "transparent",
      },
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
      },
    } as const);

  const flagImgStyle: React.CSSProperties = {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    display: "block",
  };

  const LangButtonsInline = () => (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ ml: 0.75 }}>
      {([
        { code: "pt", src: "/flags/br.webp", label: "Português (BR)" },
        { code: "en", src: "/flags/us.webp", label: "English (US)" },
        { code: "es", src: "/flags/es.webp", label: "Español (ES)" },
      ] as const).map(({ code, src, label }) => (
        <Tooltip key={code} title={label} placement="bottom">
          <IconButton
            onClick={() => change(code)}
            size="small"
            sx={flagButtonSx(active === code)}
            aria-label={`Mudar idioma para ${label}`}
          >
            <Image
              src={src}
              alt={label}
              width={32}
              height={22}
              style={flagImgStyle}
            />
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );

  const DrawerContent = (
    <Box
      role="presentation"
      sx={{
        width: { xs: "100vw", sm: 340 },
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Image
            src="/logo.png"
            alt={t("appName", { defaultValue: "ScoreOn" })}
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <Typography variant="subtitle1" fontWeight={700}>
            {t("appName", { defaultValue: "ScoreOn" })}
          </Typography>
        </Stack>

        <IconButton
          aria-label={t("navbar.close", { defaultValue: "Fechar menu" })}
          onClick={() => setOpen(false)}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <nav
        aria-label={t("navbar.navigation", {
          defaultValue: "Navegação principal",
        })}
      >
        <List>
          <ListItemButton component={Link} href="/" onClick={() => setOpen(false)}>
            <ListItemText
              primary={t("navbar.home", { defaultValue: "Início" })}
            />
          </ListItemButton>

          <ListItemButton
            component={Link}
            href="/quem-somos"
            onClick={() => setOpen(false)}
          >
            <ListItemText
              primary={t("navbar.about", { defaultValue: "Quem Somos" })}
            />
          </ListItemButton>
        </List>
      </nav>

      <Divider sx={{ my: 1.5 }} />

      <Box aria-label={t("navbar.language", { defaultValue: "Selecionar idioma" })}>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>
          {t("navbar.language", { defaultValue: "Idioma" })}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {(["pt", "en", "es"] as const).map((code) => {
            const map = {
              pt: { src: "/flags/br.webp", label: "Português (BR)" },
              en: { src: "/flags/us.webp", label: "English (US)" },
              es: { src: "/flags/es.webp", label: "Español (ES)" },
            }[code];
            return (
              <IconButton
                key={code}
                onClick={() => {
                  change(code);
                  setOpen(false);
                }}
                size="small"
                sx={flagButtonSx(active === code)}
                aria-label={`Mudar idioma para ${map.label}`}
              >
                <Image
                  src={map.src}
                  alt={map.label}
                  width={32}
                  height={22}
                  style={flagImgStyle}
                />
              </IconButton>
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ my: 1.5 }} />
      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        {t("navbar.tagline", {
          defaultValue: "Aprenda e evolua com o ScoreOn",
        })}
      </Typography>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(135deg, #fff 0%, #f4ebdd 60%, #efe6d8 100%)",
        color: "var(--graphite-900)",
        backdropFilter: "saturate(160%) blur(8px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            height: { xs: 60, sm: 72 },
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          {/* Logo + Nome */}
          <Link
            href="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Image
                src="/logo.png"
                alt={t("appName", { defaultValue: "ScoreOn" })}
                width={isMobile ? 34 : 40}
                height={isMobile ? 34 : 40}
                priority
                style={{ borderRadius: "50%" }}
              />
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {t("appName", { defaultValue: "ScoreOn" })}
              </Typography>
            </Box>
          </Link>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            {!isMdDown && (
              <>
                <Button
                  component={Link}
                  href="/"
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 1.75,
                    py: 0.75,
                    borderRadius: 999,
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
                  }}
                >
                  {t("navbar.home", { defaultValue: "Início" })}
                </Button>

                <Button
                  component={Link}
                  href="/quem-somos"
                  color="inherit"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    px: 1.75,
                    py: 0.75,
                    borderRadius: 999,
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.06)" },
                  }}
                >
                  {t("navbar.about", { defaultValue: "Quem Somos" })}
                </Button>
              </>
            )}

            {/* Ícone de perfil */}
            <ProfileMenu />

            {/* Bandeiras à direita do perfil! */}
            <LangButtonsInline />

            {isMdDown && (
              <IconButton
                aria-label={t("navbar.open", { defaultValue: "Abrir menu" })}
                onClick={() => setOpen(true)}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg,#0b0b0c 0%,#121219 100%)"
                : "linear-gradient(135deg,#ffffff 0%,#f7f2ea 100%)",
          },
        }}
      >
        {DrawerContent}
      </Drawer>
    </AppBar>
  );
}
