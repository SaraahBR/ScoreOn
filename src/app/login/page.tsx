"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Container, Typography, Paper, Stack, Button, Avatar } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  const { data: session, status } = useSession();

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: 28, md: 36 } }}>
        Login
      </Typography>

      <Paper sx={{ p: 3 }}>
        {status === "loading" && <Typography>Carregando...</Typography>}

        {!session && status !== "loading" && (
          <Stack spacing={2} alignItems="center">
            <Typography>Entre com sua conta do Google para continuar.</Typography>
            <Button variant="contained" startIcon={<GoogleIcon />} onClick={() => signIn("google", { callbackUrl: "/" })}>
              Entrar com Google
            </Button>
          </Stack>
        )}

        {session && (
          <Stack spacing={2} alignItems="center">
            <Avatar src={session.user?.image ?? undefined} alt={session.user?.name ?? "Usuário"} sx={{ width: 64, height: 64 }} />
            <Typography variant="h6">{session.user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">{session.user?.email}</Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => signOut({ callbackUrl: "/login" })}>Sair</Button>
              <Button variant="contained" href="/">Ir para a Home</Button>
            </Stack>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}