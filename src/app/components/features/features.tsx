// src/app/components/features/features.tsx
"use client";

import Grid from "@mui/material/Grid"; 
import { Paper, Typography, Stack } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";

const items = [
  { icon: <GroupIcon />, title: "Turmas e alunos", desc: "Gerencie turmas e perfis de alunos com facilidade." },
  { icon: <AssessmentIcon />, title: "Avaliações e médias", desc: "Registre notas, calcule médias e acompanhe evolução." },
  { icon: <SecurityIcon />, title: "Confiável", desc: "Padrões de acessibilidade e boas práticas." }
];

export default function Features() {
  return (
    <Grid container spacing={3}>
      {items.map((f) => (
        <Grid key={f.title} xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: "divider", height: "100%" }}>
            <Stack spacing={1}>
              <Typography variant="h6" component="h3" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {f.icon} {f.title}
              </Typography>
              <Typography color="text.secondary">{f.desc}</Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
