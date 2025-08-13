"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function MinhaConta() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [sexo, setSexo] = useState<string>("Não Informar");

  // Foto de Perfil
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    (session?.user?.image as string) || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveAvatar() {
    if (!session?.user?.email) {
      alert(t("accountPage.avatar.login_required"));
      return;
    }
    if (!avatarPreview) {
      alert(t("accountPage.avatar.select_first"));
      return;
    }
    setSavingAvatar(true);
    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          imageDataUrl: avatarPreview,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t("api.errors.save_image_error"));
      }
      alert(t("api.success.image_saved"));
    } catch (err: any) {
      alert(err.message || t("api.errors.save_image_error"));
    } finally {
      setSavingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!session?.user?.email) return;
    setSavingAvatar(true);
    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          imageDataUrl: null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || t("api.errors.save_image_error"));
      }
      setAvatarFile(null);
      setAvatarPreview(null);
      alert(t("api.success.image_removed"));
    } catch (err: any) {
      alert(err.message || t("api.errors.save_image_error"));
    } finally {
      setSavingAvatar(false);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("accountPage.title")}
      </Typography>

      {/* Meus dados */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        {t("accountPage.my_data.title")}
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        {/* Foto de perfil */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 2, flexWrap: "wrap" }}
        >
          <Avatar
            src={avatarPreview || undefined}
            alt={t("accountPage.avatar.alt")}
            sx={{ width: 72, height: 72 }}
            imgProps={{ referrerPolicy: "no-referrer" }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button variant="outlined" onClick={handlePickFile}>
              {t("accountPage.avatar.choose")}
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAvatar}
              disabled={savingAvatar || !avatarPreview}
            >
              {savingAvatar
                ? t("accountPage.avatar.saving")
                : t("accountPage.avatar.save")}
            </Button>
            {avatarPreview && (
              <Button color="error" variant="text" onClick={handleRemoveAvatar}>
                {t("accountPage.avatar.remove")}
              </Button>
            )}
          </Stack>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Stack>

        <TextField
          label={t("accountPage.my_data.email")}
          fullWidth
          value={session?.user?.email || ""}
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label={t("accountPage.my_data.name")}
          fullWidth
          value={session?.user?.name || ""}
          margin="normal"
        />
        <TextField
          label={t("accountPage.my_data.cpf")}
          fullWidth
          placeholder={t("accountPage.my_data.cpf_placeholder")}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="sexo-label">{t("accountPage.my_data.gender")}</InputLabel>
          <Select
            labelId="sexo-label"
            id="sexo"
            value={sexo}
            label={t("accountPage.my_data.gender")}
            onChange={(e) => setSexo(e.target.value as string)}
          >
            <MenuItem value="Feminino">{t("accountPage.my_data.gender_female")}</MenuItem>
            <MenuItem value="Masculino">{t("accountPage.my_data.gender_male")}</MenuItem>
            <MenuItem value="Não Informar">{t("accountPage.my_data.gender_unspecified")}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label={t("accountPage.my_data.birth")}
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button variant="outlined" color="primary">
            {t("accountPage.my_data.save_changes")}
          </Button>
          <Button variant="outlined" color="primary">
            {t("accountPage.my_data.change_password")}
          </Button>
        </Box>
      </Paper>

      {/* Endereço */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("accountPage.address.title")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <TextField
              label={t("accountPage.address.address")}
              fullWidth
              placeholder={t("accountPage.address.address_placeholder")}
              margin="normal"
            />
            <TextField
              label={t("accountPage.address.city")}
              fullWidth
              placeholder={t("accountPage.address.city_placeholder")}
              margin="normal"
            />
            <TextField
              label={t("accountPage.address.zip")}
              fullWidth
              placeholder={t("accountPage.address.zip_placeholder")}
              margin="normal"
            />
            <TextField
              label={t("accountPage.address.phone")}
              fullWidth
              placeholder={t("accountPage.address.phone_placeholder")}
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" color="primary">
                {t("accountPage.address.save")}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
