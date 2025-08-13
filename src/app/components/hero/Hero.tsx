"use client";

import { Paper, Typography, Stack, Button, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.wrapper}>
      <Paper elevation={0} className={styles.paper}>
        <div className={styles.row}>
          <Stack spacing={1.5} className={styles.copy}>
            <Typography variant="h3" component="h2" className={styles.title}>
              Centralize as notas dos seus alunos
            </Typography>

            <Typography className={styles.subtitle}>
              Cadastre avaliações, acompanhe médias e gere relatórios com poucos cliques.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<SchoolIcon />}
                component={Link}
                href="/login/minhas-turmas"
                className={styles.ctaPrimary}
              >
                Cadastrar turma
              </Button>
              <Button
                variant="text"
                className={styles.ctaGhost}
                component={Link}
                href="/exemplos"
              >
                Ver exemplos
              </Button>
            </Stack>
          </Stack>

          <Box className={styles.visual} aria-hidden />
        </div>
      </Paper>
    </div>
  );
}
