"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Container,
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

  // ---------- estados do perfil ----------
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [sex, setSex] = useState<string>("Não Informar");
  const [birthdate, setBirthdate] = useState(""); // YYYY-MM-DD

  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState(""); // Bairo
  const [city, setCity] = useState("");
  const [stateUF, setStateUF] = useState("");           // Estado/UF
  const [cep, setCep] = useState("");
  const [phone, setPhone] = useState("");

  // ---------- avatar ----------
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    (session?.user?.image as string) || null
  );
  const [savingAvatar, setSavingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- loading / snackbar ----------
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [snack, setSnack] = useState<Snack>({
    open: false,
    message: "",
    severity: "success",
  });
  const openSnack = (message: string, severity: Snack["severity"] = "success") =>
    setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // ---------- carregar perfil (GET) ----------
  useEffect(() => {
    const email = session?.user?.email;
    if (!email) return;

    (async () => {
      setLoadingProfile(true);
      try {
        const res = await fetch(
          `/api/user/profile?email=${encodeURIComponent(email)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (res.ok && data) {
          setName(data.name || session?.user?.name || "");
          setCpf(data.cpf || "");
          setSex(data.sex || "Não Informar");
          setBirthdate(data.birthdate ? String(data.birthdate).slice(0, 10) : "");

          setAddress(data.address || "");
          setNeighborhood(data.neighborhood || "");  
          setCity(data.city || "");
          setStateUF(data.state || "");              
          setCep(data.cep || "");
          setPhone(data.phone || "");

          setAvatarPreview(
            data.avatar_url || (session?.user?.image as string) || null
          );
        }
      } catch {
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [session?.user?.email]);

  useEffect(() => {
    const img = (session?.user?.image as string) || null;
    setAvatarPreview((prev) => prev ?? img);
  }, [session?.user?.image]);

  // avatar handlers
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

      await update();
      router.refresh();
      openSnack(t("api.success.image_saved", "Foto atualizada com sucesso!"), "success");
    } catch (err: any) {
      openSnack(err?.message || t("api.errors.save_image_error", "Erro ao salvar a foto."), "error");
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
      openSnack(err?.message || t("api.errors.save_image_error", "Erro ao remover a foto."), "error");
    } finally {
      setSavingAvatar(false);
    }
  }

  // Salvar perfil (POST)
  async function handleSaveProfile() {
    if (!session?.user?.email) return;
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          name,
          cpf,
          sex,
          birthdate: birthdate || null,
          address,
          neighborhood,  
          city,
          state: stateUF, 
          cep,
          phone,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.error || t("api.errors.save_profile_error", "Não foi possível salvar os dados.")
        );

      await update();
      router.refresh();
      openSnack(t("api.success.profile_saved", "Dados salvos com sucesso!"), "success");
    } catch (err: any) {
      openSnack(err?.message || t("api.errors.save_profile_error", "Erro ao salvar os dados."), "error");
    } finally {
      setSavingProfile(false);
    }
  }

  const busy = savingAvatar || loadingProfile || savingProfile;

  return (
    <>
      {/* Loading geral */}
      <Backdrop open={busy} sx={{ color: "#fff", zIndex: (t) => t.zIndex.modal + 1 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="inherit" />
          <Typography variant="body1">
            {savingAvatar
              ? t("accountPage.avatar.updating", "Atualizando sua foto…")
              : savingProfile
              ? t("accountPage.my_data.saving", "Salvando seus dados…")
              : t("accountPage.my_data.loading", "Carregando perfil…")}
          </Typography>
        </Stack>
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnack} severity={snack.severity} variant="filled" sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("accountPage.title", "Informações da conta")}
        </Typography>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          {t("accountPage.my_data.title", "Meus dados")}
        </Typography>

        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          {/* Foto de perfil */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, flexWrap: "wrap" }}>
            <Avatar
              src={avatarPreview || undefined}
              alt={t("accountPage.avatar.alt", "Foto do perfil")}
              sx={{ width: 72, height: 72 }}
              imgProps={{ referrerPolicy: "no-referrer" }}
            />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button variant="outlined" onClick={handlePickFile} disabled={busy}>
                {t("accountPage.avatar.choose", "Escolher foto")}
              </Button>
              <Button
                variant="contained"
                color="warning"
                disableElevation
                onClick={handleSaveAvatar}
                disabled={busy || !avatarPreview}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 1.5,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                }}
              >
                {savingAvatar ? t("accountPage.avatar.saving", "Salvando...") : t("accountPage.avatar.save", "Salvar foto")}
              </Button>
              {avatarPreview && (
                <Button color="error" variant="text" onClick={handleRemoveAvatar} disabled={busy}>
                  {t("accountPage.avatar.remove", "Remover")}
                </Button>
              )}
            </Stack>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </Stack>

          {/* Campos do perfil */}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label={t("accountPage.my_data.cpf", "CPF")}
            fullWidth
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder={t("accountPage.my_data.cpf_placeholder", "Digite seu CPF")}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="sexo-label">{t("accountPage.my_data.gender", "Sexo")}</InputLabel>
            <Select
              labelId="sexo-label"
              id="sexo"
              value={sex}
              label={t("accountPage.my_data.gender", "Sexo")}
              onChange={(e) => setSex(e.target.value as string)}
            >
              <MenuItem value="Feminino">{t("accountPage.my_data.gender_female", "Feminino")}</MenuItem>
              <MenuItem value="Masculino">{t("accountPage.my_data.gender_male", "Masculino")}</MenuItem>
              <MenuItem value="Não Informar">{t("accountPage.my_data.gender_unspecified", "Não Informar")}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label={t("accountPage.my_data.birth", "Data de nascimento")}
            type="date"
            fullWidth
            margin="normal"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          {/* Endereço */}
          <Box
            sx={{
              mt: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
            }}
          >
            <TextField
              label={t("accountPage.address.address", "Endereço")}
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("accountPage.address.address_placeholder", "Digite seu endereço")}
            />
            <TextField
              label={t("accountPage.address.neighborhood", "Bairro")}
              fullWidth
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder={t("accountPage.address.neighborhood_placeholder", "Digite seu bairro")}
            />
            <TextField
              label={t("accountPage.address.city", "Cidade")}
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("accountPage.address.city_placeholder", "Digite sua cidade")}
            />
            <TextField
              label={t("accountPage.address.state", "Estado")}
              fullWidth
              value={stateUF}
              onChange={(e) => setStateUF(e.target.value)}
              placeholder={t("accountPage.address.state_placeholder", "Digite seu estado (UF)")}
            />
            <TextField
              label={t("accountPage.address.zip", "CEP")}
              fullWidth
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder={t("accountPage.address.zip_placeholder", "Digite seu CEP")}
            />
            <TextField
              label={t("accountPage.address.phone", "Telefone")}
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("accountPage.address.phone_placeholder", "Digite seu telefone")}
            />
          </Box>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="warning"
              disableElevation
              onClick={handleSaveProfile}
              disabled={busy}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 1.5,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              {t("accountPage.my_data.save_changes", "Salvar alterações")}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
