"use client";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./Turmas.module.css";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

interface Turma {
  id: number;
  name: string;
  school_year: string;
}
interface TurmaForm {
  nome: string;
  ano: string;
}

export default function TurmasPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error" | "info" | "warning";
  }>({ open: false, msg: "", sev: "success" });
  const openSnack = (msg: string, sev: typeof snack.sev = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TurmaForm>({ defaultValues: { nome: "", ano: "" } });

  const watchNome = watch("nome");
  const watchAno = watch("ano");

  async function fetchTurmas() {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/classes?email=${encodeURIComponent(session.user.email)}`,
        { cache: "no-store" }
      );
      const j = await r.json();
      if (r.ok) setTurmas(j.items ?? []);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    fetchTurmas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  const onSubmit = async (data: TurmaForm) => {
    if (!session?.user?.email) return;
    if (!data.nome || !data.ano) return;

    setBusy(true);
    try {
      if (editId !== null) {
        const r = await fetch("/api/classes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            id: editId,
            name: data.nome,
            school_year: data.ano,
          }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Erro ao salvar");
        openSnack(
          t("classesPage.form.updated", "Turma atualizada!"),
          "success"
        );
        setEditId(null);
      } else {
        const r = await fetch("/api/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            name: data.nome,
            school_year: data.ano,
          }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Erro ao cadastrar");
        openSnack(
          t("classesPage.form.created", "Turma cadastrada!"),
          "success"
        );
      }
      reset();
      await fetchTurmas();
    } catch (e: any) {
      openSnack(e?.message || "Erro", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (turma: Turma) => {
    setValue("nome", turma.name, { shouldValidate: true, shouldDirty: true });
    setValue("ano", turma.school_year, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setEditId(turma.id);
  };

  const handleDelete = async (id: number) => {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/classes?id=${id}&email=${encodeURIComponent(
          session.user.email
        )}`,
        { method: "DELETE" }
      );
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || "Erro ao excluir");
      openSnack(t("classesPage.form.deleted", "Turma excluída."), "success");
      if (editId === id) {
        reset();
        setEditId(null);
      }
      await fetchTurmas();
    } catch (e: any) {
      openSnack(e?.message || "Erro", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Backdrop
        open={busy}
        sx={{ color: "#fff", zIndex: (t) => t.zIndex.modal + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack}>
        <Alert onClose={closeSnack} severity={snack.sev} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>

      <Typography
        component="h1"
        variant="h4"
        gutterBottom
        className={styles.tituloTurma}
      >
        {t("classesPage.title", "Gerenciar Turmas")}
      </Typography>

      <Paper className={styles.formTurma} elevation={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label={t("classesPage.form.class_name", "Nome da Turma")}
              fullWidth
              InputLabelProps={{
                shrink: !!watchNome || editId !== null,
              }}
              {...register("nome", { required: true })}
            />
            <TextField
              label={t("classesPage.form.school_year", "Ano Letivo")}
              fullWidth
              InputLabelProps={{
                shrink: !!watchAno || editId !== null,
              }}
              {...register("ano", {
                required: true,
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: t(
                    "classesPage.form.year_invalid",
                    "Digite um ano válido (4 dígitos)"
                  ),
                },
              })}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 4 }}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                e.target.value = v;
              }}
            />
            {errors?.ano && (
              <Typography color="error" sx={{ ml: 1, mt: 0.5 }}>
                {errors.ano.message as string}
              </Typography>
            )}
            <Button
              variant="contained"
              type="submit"
              size="large"
              className={styles.botaoCadastrar}
            >
              {editId !== null
                ? t("classesPage.form.submit_save", "Salvar")
                : t("classesPage.form.submit_new", "Cadastrar")}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom className={styles.tituloTurma}>
        {t("classesPage.list_title", "Turmas Cadastradas")}
      </Typography>

      <TableContainer component={Paper} className={styles.tabelaTurma}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("classesPage.table.header_name", "Nome")}</TableCell>
              <TableCell>{t("classesPage.table.header_year", "Ano Letivo")}</TableCell>
              <TableCell align="right">
                {t("classesPage.table.header_actions", "Ações")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turmas.map((turma) => (
              <TableRow key={turma.id}>
                <TableCell>{turma.name}</TableCell>
                <TableCell>{turma.school_year}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEdit(turma)}
                    aria-label={t("classesPage.actions.edit", "Editar")}
                    title={t("classesPage.actions.edit", "Editar")}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(turma.id)}
                    color="error"
                    aria-label={t("classesPage.actions.delete", "Excluir")}
                    title={t("classesPage.actions.delete", "Excluir")}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {turmas.length === 0 && (
        <Typography align="center" sx={{ color: "#bfa77a", mt: 3 }}>
          {t("classesPage.table.empty", "Nenhuma turma cadastrada.")}
        </Typography>
      )}
    </Container>
  );
}
