"use client";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./Turmas.module.css";

import { useState, useEffect } from "react";
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

function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<TurmaForm>({
    defaultValues: { nome: "", ano: "" },
  });

  const onSubmit = (data: TurmaForm) => {
    if (!data.nome || !data.ano) return;
    if (editId !== null) {
      setTurmas((prev) =>
        prev.map((t) => (t.id === editId ? { ...t, nome: data.nome, ano: data.ano } : t))
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
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciar Turmas
      </Typography>
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Nome da Turma"
              fullWidth
              {...register("nome", { required: true })}
            />
            <TextField
              label="Ano Letivo"
              fullWidth
              {...register("ano", { required: true })}
            />
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
      <Typography variant="h6" gutterBottom>
        Turmas Cadastradas
      </Typography>
      <TableContainer component={Paper}>
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
                  <IconButton onClick={() => handleEdit(turma)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(turma.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TurmasPage;