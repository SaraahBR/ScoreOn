"use client";

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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ProfileMenu from "../../login/profilemenu";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #fff 0%, #f4ebdd 60%, #efe6d8 100%)",
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
            gap: 2,
          }}
        >
          {/* Marca */}
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Image
                src="/logo.png"
                alt="ScoreOn"
                width={isMobile ? 34 : 40}
                height={isMobile ? 34 : 40}
                priority
                style={{ borderRadius: "50%" }}
              />
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}
              >
                ScoreOn
              </Typography>
            </Box>
          </Link>

          {/* Links + Perfil */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
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
              Início
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
              Quem somos
            </Button>

            <ProfileMenu />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
