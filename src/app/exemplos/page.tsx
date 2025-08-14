"use client";

import { Container, Typography, Paper, Stack, Box } from "@mui/material";
import styles from "./Exemplos.module.css";
import { useTranslation } from "react-i18next";

export default function ExemplosPage() {
  const { t } = useTranslation("common");

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper className={styles.exemploPaper} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom className={styles.exemploTitle}>
          {t("exemplos.titulo")}
        </Typography>

        <Typography
          variant="body1"
          paragraph
          dangerouslySetInnerHTML={{ __html: t("exemplos.introducao") }}
        />

        <Stack spacing={3}>
          <Box className={styles.exemploStep}>
            <Typography variant="h5">{t("exemplos.passo1.titulo")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("exemplos.passo1.texto") }}
            />
          </Box>

          <Box className={styles.exemploStep}>
            <Typography variant="h5">{t("exemplos.passo2.titulo")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("exemplos.passo2.texto") }}
            />
          </Box>

          <Box className={styles.exemploStep}>
            <Typography variant="h5">{t("exemplos.passo3.titulo")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("exemplos.passo3.texto") }}
            />
          </Box>

          <Box className={styles.exemploStep}>
            <Typography variant="h5">{t("exemplos.passo4.titulo")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("exemplos.passo4.texto") }}
            />
          </Box>
        </Stack>

        <Typography
          variant="h5"
          gutterBottom
          className={styles.exemploSectionTitle}
          sx={{ mt: 4 }}
        >
          {t("exemplos.dicas.titulo")}
        </Typography>

        <ul className={styles.dicasList}>
          <li>{t("exemplos.dicas.lista1")}</li>
          <li>{t("exemplos.dicas.lista2")}</li>
          <li>{t("exemplos.dicas.lista3")}</li>
        </ul>
      </Paper>
    </Container>
  );
}
