"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type Snack = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

export default function MinhaConta() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  const [sexo, setSexo] = useState<string>("Não Informar");

  // Foto de Perfil
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    (session?.user?.image as string) || null
  );
  const [savingAvatar, setSavingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Snackbar
  const [snack, setSnack] = useState<Snack>({
    open: false,
    message: "",
    severity: "success",
  });
  const openSnack = (
    message: string,
    severity: Snack["severity"] = "success"
  ) => setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  useEffect(() => {
    const img = (session?.user?.image as string) || null;
    setAvatarPreview((prev) => prev ?? img);
  }, [session?.user?.image]);

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSaveAvatar() {
    if (!session?.user?.email) {
      openSnack(
        t("accountPage.avatar.login_required", "Faça login para alterar a foto."),
        "warning"
      );
      return;
    }
    if (!avatarPreview) {
      openSnack(
        t("accountPage.avatar.select_first", "Selecione uma imagem primeiro."),
        "info"
      );
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

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.error ||
            t("api.errors.save_image_error", "Não foi possível salvar a foto.")
        );

      if (data?.url) setAvatarPreview(data.url);

      await update(); // atualiza sessão
      router.refresh(); // atualiza cache de rotas

      openSnack(
        t("api.success.image_saved", "Foto atualizada com sucesso!"),
        "success"
      );
    } catch (err: any) {
      openSnack(
        err?.message ||
          t("api.errors.save_image_error", "Erro ao salvar a foto."),
        "error"
      );
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

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.error ||
            t("api.errors.save_image_error", "Não foi possível remover a foto.")
        );

      setAvatarPreview(null);

      await update();
      router.refresh();

      openSnack(t("api.success.image_removed", "Foto removida."), "success");
    } catch (err: any) {
      openSnack(
        err?.message ||
          t("api.errors.save_image_error", "Erro ao remover a foto."),
        "error"
      );
    } finally {
      setSavingAvatar(false);
    }
  }

  return (
    <>
      {/* Tela de carregamento durante upload/refresh */}
      <Backdrop
        open={savingAvatar}
        sx={{ color: "#fff", zIndex: (t) => t.zIndex.modal + 1 }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="inherit" />
          <Typography variant="body1">
            {t("accountPage.avatar.updating", "Atualizando sua foto…")}
          </Typography>
        </Stack>
      </Backdrop>

      {/* Snackbar global da página */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("accountPage.title", "Informações da conta")}
        </Typography>

        {/* Meus dados */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          {t("accountPage.my_data.title", "Meus dados")}
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
              alt={t("accountPage.avatar.alt", "Foto do perfil")}
              sx={{ width: 72, height: 72 }}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button variant="outlined" onClick={handlePickFile} disabled={savingAvatar}>
                {t("accountPage.avatar.choose", "Escolher foto")}
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveAvatar}
                disabled={savingAvatar || !avatarPreview}
              >
                {savingAvatar
                  ? t("accountPage.avatar.saving", "Salvando...")
                  : t("accountPage.avatar.save", "Salvar foto")}
              </Button>
              {avatarPreview && (
                <Button
                  color="error"
                  variant="text"
                  onClick={handleRemoveAvatar}
                  disabled={savingAvatar}
                >
                  {t("accountPage.avatar.remove", "Remover")}
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
            label={t("accountPage.my_data.email", "E-mail")}
            fullWidth
            value={session?.user?.email || ""}
            margin="normal"
            InputProps={{ readOnly: true }}
          />

          <TextField
            label={t("accountPage.my_data.name", "Nome")}
            fullWidth
            defaultValue={session?.user?.name || ""}
            margin="normal"
          />

          <TextField
            label={t("accountPage.my_data.cpf", "CPF")}
            fullWidth
            placeholder={t(
              "accountPage.my_data.cpf_placeholder",
              "Digite seu CPF"
            )}
            margin="normal"
          />

          {/* Sexo em dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="sexo-label">
              {t("accountPage.my_data.gender", "Sexo")}
            </InputLabel>
            <Select
              labelId="sexo-label"
              id="sexo"
              value={sexo}
              label={t("accountPage.my_data.gender", "Sexo")}
              onChange={(e) => setSexo(e.target.value as string)}
            >
              <MenuItem value="Feminino">
                {t("accountPage.my_data.gender_female", "Feminino")}
              </MenuItem>
              <MenuItem value="Masculino">
                {t("accountPage.my_data.gender_male", "Masculino")}
              </MenuItem>
              <MenuItem value="Não Informar">
                {t("accountPage.my_data.gender_unspecified", "Não Informar")}
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label={t("accountPage.my_data.birth", "Data de nascimento")}
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="outlined" color="primary" disabled={savingAvatar}>
              {t("accountPage.my_data.save_changes", "Salvar alterações")}
            </Button>
            <Button variant="outlined" color="primary" disabled={savingAvatar}>
              {t("accountPage.my_data.change_password", "Mudar senha")}
            </Button>
          </Box>
        </Paper>

        {/* Endereço */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("accountPage.address.title", "Endereço")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <TextField
                label={t("accountPage.address.address", "Endereço")}
                fullWidth
                placeholder={t(
                  "accountPage.address.address_placeholder",
                  "Digite seu endereço"
                )}
                margin="normal"
              />
              <TextField
                label={t("accountPage.address.city", "Cidade")}
                fullWidth
                placeholder={t(
                  "accountPage.address.city_placeholder",
                  "Digite sua cidade"
                )}
                margin="normal"
              />
              <TextField
                label={t("accountPage.address.zip", "CEP")}
                fullWidth
                placeholder={t(
                  "accountPage.address.zip_placeholder",
                  "Digite seu CEP"
                )}
                margin="normal"
              />
              <TextField
                label={t("accountPage.address.phone", "Telefone")}
                fullWidth
                placeholder={t(
                  "accountPage.address.phone_placeholder",
                  "Digite seu telefone"
                )}
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" color="primary" disabled={savingAvatar}>
                  {t("accountPage.address.save", "Salvar endereço")}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
