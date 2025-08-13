"use client";

import { Paper, Typography, Stack, Button, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.wrapper}>
      <Paper elevation={1} className={styles.paper}>
        <div className={styles.row}>
          <Stack spacing={1}>
            <Typography variant="h5" component="h2" className={styles.title}>
              Centralize as notas dos seus alunos
            </Typography>
            <Typography color="text.secondary">
              Cadastre avaliações, acompanhe médias e gere relatórios com poucos cliques.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<SchoolIcon />}
                component={Link}
                href="/turmas"
              >
                Cadastrar turma
              </Button>
              <Button variant="text">Ver exemplos</Button>
            </Stack>
          </Stack>

          <Box className={styles.imagePlaceholder} />
        </div>
      </Paper>
    </div>
  );
}