"use client";

import { useMemo } from "react";
import { Box, Typography, Paper, TextField, Button, Stack } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useTranslation } from "react-i18next";
import styles from "./FaleConosco.module.css";

export default function ContatoPage() {
  const { t } = useTranslation("common");

  const mapContainerStyle = useMemo(
    () => ({
      width: "100%",
      height: "220px",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
      marginTop: 12,
      marginBottom: 8
    }),
    []
  );

  return (
    <Box sx={{ mt: { xs: 4, md: 8 }, mb: 8, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: 900,
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4
        }}
      >
        {/* Lateral: Endereço, contatos e mapa */}
        <Box
          sx={{
            minWidth: 260,
            maxWidth: 320,
            flex: "0 0 260px",
            bgcolor: "#f9fafb",
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "flex-start",
            mb: { xs: 2, md: 0 }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}>
            {t("contactPage.sidebar.title")}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <RoomIcon color="action" />
            <Typography
              variant="body2"
              component="div"
              dangerouslySetInnerHTML={{ __html: t("contactPage.sidebar.address_html") }}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon color="action" />
            <Typography variant="body2">{t("contactPage.sidebar.email")}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <PhoneIcon color="action" />
            <Typography variant="body2">{t("contactPage.sidebar.phone")}</Typography>
          </Stack>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5, fontWeight: 600 }}>
            {t("contactPage.sidebar.find_us")}
          </Typography>

          {/* Mapa via iframe */}
          <div style={mapContainerStyle as React.CSSProperties}>
            <iframe
              title="Mapa - Instituto Caldeira"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.4082647506166!2d-51.203875523558885!3d-29.99643142905315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951979e0c5d78685%3A0x48abb378377374b3!2sInstituto%20Caldeira!5e0!3m2!1spt-BR!2sbr!4v1755193596623!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Box>

        {/* Formulário */}
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {t("contactPage.form.title")}
          </Typography>

          <form className={styles.formulario}>
            <Stack spacing={2}>
              <TextField
                label={t("contactPage.form.fields.name")}
                name="nome"
                required
                fullWidth
              />
              <TextField
                label={t("contactPage.form.fields.email")}
                name="email"
                type="email"
                required
                fullWidth
              />
              <TextField
                label={t("contactPage.form.fields.message")}
                name="mensagem"
                required
                fullWidth
                multiline
                minRows={4}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ alignSelf: "flex-end", minWidth: 140 }}
              >
                {t("contactPage.form.submit")}
              </Button>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
