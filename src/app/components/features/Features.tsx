"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import { Paper, Typography, Stack, Box } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import styles from "./Features.module.css";

const items = [
  { icon: <GroupIcon />, title: "Turmas e alunos", desc: "Gerencie turmas e perfis de alunos com facilidade." },
  { icon: <AssessmentIcon />, title: "Avaliações e médias", desc: "Registre notas, calcule médias e acompanhe evolução." },
  { icon: <SecurityIcon />, title: "Confiável", desc: "Padrões de acessibilidade e boas práticas." }
];

export default function Features() {
  return (
    <Box className={styles.section}>
      <Grid container spacing={3}>
        {items.map((f) => (
          <Grid key={f.title} item xs={12} md={4}>
            <Paper elevation={0} className={styles.card}>
              <Stack spacing={1}>
                <Typography variant="h6" component="h3" className={styles.titleRow}>
                  <span className={styles.iconWrap}>{f.icon}</span>
                  {f.title}
                </Typography>
                <Typography className={styles.desc}>{f.desc}</Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
