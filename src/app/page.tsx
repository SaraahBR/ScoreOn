"use client";

import { Container, Typography, Box, Button, Stack } from "@mui/material";
import Hero from "./components/hero/Hero";
import Features from "./components/features/Features";

export default function HomePage() {
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: 28, md: 36 } }}>
          ScoreOn — Sistema de Controle de Notas
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Gerencie turmas, cadastre alunos e registre avaliações com praticidade.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
          <Button variant="contained" href="/login/criar-conta">Começar agora</Button>
          <Button
            variant="outlined"
            href="/documentacao"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentação
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