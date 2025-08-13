"use client";

import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.css";

interface HeaderProps {
 
  titleKey: string;
 
  subtitleKey?: string;
}

export default function Header({ titleKey, subtitleKey }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <Box className={styles.headerBox}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          component="h1"
          className={styles.headerTitle}
          gutterBottom
        >
          {t(titleKey)}
        </Typography>

        {subtitleKey && (
          <Typography variant="body1" className={styles.headerSubtitle}>
            {t(subtitleKey)}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
