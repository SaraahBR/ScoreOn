"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Stack, Button, Container } from "@mui/material";
import ProfileMenu from "@/app/login/profilemenu";

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            ScoreOn
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={Link} href="/" color="inherit">
              Início
            </Button>
            <Button component={Link} href="/quem-somos" color="inherit">
              Quem somos
            </Button>
            <Button component={Link} href="/login" color="inherit">
              Login
            </Button>

            <ProfileMenu />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
