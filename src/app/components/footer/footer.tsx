"use client";

import { Box, Container, Typography, Link as MLink, Stack } from "@mui/material";
import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <Box component="footer" className={styles.footerBox}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
          <Typography variant="body2" className={styles.footerText}>
            © {new Date().getFullYear()} ScoreOn. Todos os direitos reservados.
          </Typography>
          <Stack direction="row" spacing={2} className={styles.footerLinks}>
            <MLink component={Link} href="/quem-somos" className={styles.footerLink}>
              Quem somos
            </MLink>
            <MLink component={Link} href="/login" className={styles.footerLink}>
              Login
            </MLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
