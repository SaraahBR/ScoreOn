"use client";

import React from "react";
import Grid from "@mui/material/Grid";
import { Paper, Typography, Stack, Box } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import { useTranslation } from "react-i18next";
import styles from "./Features.module.css";

type FeatureItem = {
  icon: JSX.Element;
  titleKey: string;
  descKey: string;
};

const items: FeatureItem[] = [
  {
    icon: <GroupIcon />,
    titleKey: "features.students.title",
    descKey: "features.students.desc"
  },
  {
    icon: <AssessmentIcon />,
    titleKey: "features.grades.title",
    descKey: "features.grades.desc"
  },
  {
    icon: <SecurityIcon />,
    titleKey: "features.trust.title",
    descKey: "features.trust.desc"
  }
];

export default function Features() {
  const { t } = useTranslation();

  return (
    <Box className={styles.section}>
      <Grid container spacing={3}>
        {items.map((f) => (
          <Grid key={f.titleKey} item xs={12} md={4}>
            <Paper elevation={0} className={styles.card}>
              <Stack spacing={1}>
                <Typography variant="h6" component="h3" className={styles.titleRow}>
                  <span className={styles.iconWrap}>{f.icon}</span>
                  {t(f.titleKey)}
                </Typography>
                <Typography className={styles.desc}>{t(f.descKey)}</Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
