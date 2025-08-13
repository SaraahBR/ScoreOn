"use client";

import { Box, Container, Typography, Link as MLink, Stack } from "@mui/material";
import Link from "next/link";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 8, py: 4, borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} ScoreOn. Todos os direitos reservados.
          </Typography>
          <Stack direction="row" spacing={2}>
            <MLink component={Link} href="/quem-somos" color="inherit" underline="hover">Quem somos</MLink>
            <MLink component={Link} href="/login" color="inherit" underline="hover">Login</MLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}