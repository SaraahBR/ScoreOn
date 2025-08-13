"use client";

import { Box, Paper, Typography, Stack, Button } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

export default function Hero() {
  return (
    <Paper elevation={1} sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center" justifyContent="space-between">
        <Stack spacing={1}>
          <Typography variant="h5" component="h2">
            Centralize as notas dos seus alunos
          </Typography>
          <Typography color="text.secondary">
            Cadastre avaliações, acompanhe médias e gere relatórios com poucos cliques.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<SchoolIcon />}>Cadastrar turma</Button>
            <Button variant="text">Ver exemplos</Button>
          </Stack>
        </Stack>
        <Box sx={{ width: { xs: "100%", md: 360 }, height: 180, bgcolor: "grey.100", borderRadius: 2 }} />
      </Stack>
    </Paper>
  );
}
