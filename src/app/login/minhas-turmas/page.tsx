"use client";

import React from "react";
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
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TurmaForm>({
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
        Gerenciar Turmas
      </Typography>
      <Paper className={styles.formTurma} elevation={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <TextField
              label="Nome da Turma"
              fullWidth
              {...register("nome", { required: true })}
            />
            <TextField
              label="Ano Letivo"
              fullWidth
              {...register("ano", { 
                required: true, 
                pattern: {
                  value: /^[0-9]{4}$/,
                  message: "Digite um ano válido (4 dígitos)"
                }
              })}
              inputProps={{ 
                inputMode: "numeric", 
                pattern: "[0-9]*", 
                maxLength: 4 
              }}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                e.target.value = onlyNums;
                setValue("ano", onlyNums);
              }}
            />
            {/* Exibe mensagem de erro de validação do ano */}
            {typeof errors !== 'undefined' && errors.ano && (
              <Typography color="error" sx={{ ml: 1, mt: 0.5 }}>
                {errors.ano.message}
              </Typography>
            )}
            <Button
              variant="contained"
              type="submit"
              size="large"
              className={styles.botaoCadastrar}
            >
              {editId !== null ? "Salvar" : "Cadastrar"}
            </Button>
          </Stack>
        </form>
      </Paper>
      <Typography variant="h6" gutterBottom className={styles.tituloTurma}>
        Turmas Cadastradas
      </Typography>
      <TableContainer component={Paper} className={styles.tabelaTurma}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ano Letivo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turmas.map((turma) => (
              <TableRow key={turma.id}>
                <TableCell>{turma.nome}</TableCell>
                <TableCell>{turma.ano}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="editar" onClick={() => handleEdit(turma)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="excluir" onClick={() => handleDelete(turma.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {turmas.length === 0 && (
        <Box sx={{ textAlign: 'center', color: '#bfa77a', mt: 3 }}>
          Nenhuma turma cadastrada.
        </Box>
      )}
    </Container>
  );
}
