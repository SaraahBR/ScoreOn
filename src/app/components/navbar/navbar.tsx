"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Stack, Button, Container } from "@mui/material";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary" elevation={1} className={styles.bar}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component={Link} href="/" className={styles.brand}>
            ScoreOn
          </Typography>

          <Stack direction="row" className={styles.links}>
            <Button component={Link} href="/" color="inherit">Início</Button>
            <Button component={Link} href="/quem-somos" color="inherit">Quem somos</Button>
            <Button component={Link} href="/login" color="inherit">Login</Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
