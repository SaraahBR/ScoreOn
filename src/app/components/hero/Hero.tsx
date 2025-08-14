"use client";

import { Paper, Typography, Stack, Button, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./Hero.module.css";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Paper elevation={0} className={styles.paper}>
        <div className={styles.row}>
          <Stack spacing={1.5} className={styles.copy}>
            <Typography variant="h3" component="h2" className={styles.title}>
              {t("hero.title")}
            </Typography>

            <Typography className={styles.subtitle}>
              {t("hero.subtitle")}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<SchoolIcon />}
                component={Link}
                href="/login/minhas-turmas"
                className={styles.ctaPrimary}
              >
                {t("hero.cta_primary")}
              </Button>

              <Button
                variant="text"
                component={Link}
                href="/exemplos"
                className={styles.ctaGhost}
              >
                {t("hero.cta_secondary")}
              </Button>
            </Stack>
          </Stack>

          <Box className={styles.visual} aria-hidden />
        </div>
      </Paper>
    </div>
  );
}
