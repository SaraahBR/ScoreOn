"use client";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./Turmas.module.css";

import { useState } from "react";
import Box from "@mui/material/Box";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Turma {
  id: number;
  nome: string;
  ano: string;
}
interface TurmaForm {
  nome: string;
  ano: string;
}

export default function TurmasPage() {
  const { t } = useTranslation();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<TurmaForm>({
    defaultValues: { nome: "", ano: "" },
  });

  const onSubmit = (data: TurmaForm) => {
    if (!data.nome || !data.ano) return;
    if (editId !== null) {
      setTurmas((prev) =>
        prev.map((t) =>
          t.id === editId ? { ...t, nome: data.nome, ano: data.ano } : t
        )
      );
      setEditId(null);
    } else {
      setTurmas((prev) => [
        ...prev,
        { id: Date.now(), nome: data.nome, ano: data.ano },
      ]);
    }
    reset();
  };

  const handleEdit = (turma: Turma) => {
    setValue("nome", turma.nome);
    setValue("ano", turma.ano);
    setEditId(turma.id);
  };

  const handleDelete = (id: number) => {
    setTurmas((prev) => prev.filter((t) => t.id !== id));
    if (editId === id) {
      reset();
      setEditId(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography component="h1" variant="h4" gutterBottom className={styles.tituloTurma}>
        {t("classesPage.title")}
      </Typography>

      <Paper className={styles.formTurma} elevation={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <TextField
              label={t("classesPage.form.class_name")}
              fullWidth
              {...register("nome", { required: true })}
            />
            <TextField
              label={t("classesPage.form.school_year")}
              fullWidth
              {...register("ano", {
                required: true,
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: t("classesPage.form.year_invalid"),
                },
              })}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 4,
              }}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                e.target.value = onlyNums;
                setValue("ano", onlyNums);
              }}
            />
            <Button variant="contained" type="submit" size="large" className={styles.botaoCadastrar}>
              {editId !== null ? t("classesPage.form.submit_save") : t("classesPage.form.submit_new")}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom className={styles.tituloTurma}>
        {t("classesPage.list_title")}
      </Typography>

      <TableContainer component={Paper} className={styles.tabelaTurma}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("classesPage.table.header_name")}</TableCell>
              <TableCell>{t("classesPage.table.header_year")}</TableCell>
              <TableCell align="right">{t("classesPage.table.header_actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turmas.map((turma) => (
              <TableRow key={turma.id}>
                <TableCell>{turma.nome}</TableCell>
                <TableCell>{turma.ano}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEdit(turma)}
                    aria-label={t("classesPage.actions.edit")}
                    title={t("classesPage.actions.edit")}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(turma.id)}
                    color="error"
                    aria-label={t("classesPage.actions.delete")}
                    title={t("classesPage.actions.delete")}
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
        <Box sx={{ textAlign: "center", color: "#bfa77a", mt: 3 }}>
          {t("classesPage.table.empty")}
        </Box>
      )}
    </Container>
  );
}
