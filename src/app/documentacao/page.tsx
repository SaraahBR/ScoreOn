"use client";

import { Container, Typography, Paper, Stack } from "@mui/material";
import styles from "./Documentacao.module.css";
import { useTranslation } from "react-i18next";

export default function DocumentacaoPage() {
  const { t } = useTranslation("common");

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper className={styles.docPaper} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom className={styles.docTitle}>
          {t("docs.title")}
        </Typography>

        <Typography variant="body1" paragraph>
          {t("docs.intro")}
        </Typography>

        <Typography variant="h5" gutterBottom className={styles.docSectionTitle}>
          {t("docs.howToUse")}
        </Typography>

        <Stack spacing={2}>
          <div className={styles.docStep}>
            <Typography variant="h6">{t("docs.steps.one.title")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("docs.steps.one.text") }}
            />
          </div>

          <div className={styles.docStep}>
            <Typography variant="h6">{t("docs.steps.two.title")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("docs.steps.two.text") }}
            />
          </div>

          <div className={styles.docStep}>
            <Typography variant="h6">{t("docs.steps.three.title")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("docs.steps.three.text") }}
            />
          </div>

          <div className={styles.docStep}>
            <Typography variant="h6">{t("docs.steps.four.title")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("docs.steps.four.text") }}
            />
          </div>

          <div className={styles.docStep}>
            <Typography variant="h6">{t("docs.steps.five.title")}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: t("docs.steps.five.text") }}
            />
          </div>
        </Stack>

        <Typography variant="h5" gutterBottom className={styles.docSectionTitle} sx={{ mt: 4 }}>
          {t("docs.faqTitle")}
        </Typography>

        <Stack spacing={1}>
          <div className={styles.docFaqItem}>
            <Typography variant="subtitle1" className={styles.docFaqTitle}>
              {t("docs.faq.q1")}
            </Typography>
            <Typography variant="body2">{t("docs.faq.a1")}</Typography>
          </div>

          <div className={styles.docFaqItem}>
            <Typography variant="subtitle1" className={styles.docFaqTitle}>
              {t("docs.faq.q2")}
            </Typography>
            <Typography variant="body2">{t("docs.faq.a2")}</Typography>
          </div>

          <div className={styles.docFaqItem}>
            <Typography variant="subtitle1" className={styles.docFaqTitle}>
              {t("docs.faq.q3")}
            </Typography>
            <Typography variant="body2">{t("docs.faq.a3")}</Typography>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}
