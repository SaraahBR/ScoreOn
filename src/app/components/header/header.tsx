"use client";

import { Box, Container, Typography } from "@mui/material";
import styles from "./header.module.css";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box className={styles.headerBox}>
      <Container maxWidth="lg">
        <Typography variant="h1" component="h1" className={styles.headerTitle} gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" className={styles.headerSubtitle}>
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
