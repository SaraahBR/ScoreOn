"use client";
import { useState } from "react";
import { Container, Typography, Paper, Stack, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import styles from "./MeusAlunos.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Turma {
  id: number;
  nome: string;
}
interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  turmaId: number;
}

const turmasExemplo: Turma[] = [
  { id: 1, nome: "Turma A" },
  { id: 2, nome: "Turma B" },
  { id: 3, nome: "Turma C" },
];

export default function MeusAlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number>(turmasExemplo[0].id);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", matricula: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "matricula") {
      // Permite apenas números e máximo 9 dígitos
      const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
      setForm({ ...form, matricula: onlyNums });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleTurmaChange = (e: any) => {
    setTurmaSelecionada(Number(e.target.value));
    setEditId(null);
    setForm({ nome: "", matricula: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.matricula) return;
    if (editId !== null) {
      setAlunos((prev) =>
        prev.map((a) =>
          a.id === editId ? { ...a, nome: form.nome, matricula: form.matricula } : a
        )
      );
      setEditId(null);
    } else {
      setAlunos((prev) => [
        ...prev,
        { id: Date.now(), nome: form.nome, matricula: form.matricula, turmaId: turmaSelecionada },
      ]);
    }
    setForm({ nome: "", matricula: "" });
  };

  const handleEdit = (aluno: Aluno) => {
    setForm({ nome: aluno.nome, matricula: aluno.matricula });
    setEditId(aluno.id);
  };

  const handleDelete = (id: number) => {
    setAlunos((prev) => prev.filter((a) => a.id !== id));
    setEditId(null);
    setForm({ nome: "", matricula: "" });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography component="h1" variant="h4" gutterBottom className={styles.tituloAluno}>
        Gestão de Alunos
      </Typography>
      <Paper className={styles.formAluno} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Turma</InputLabel>
              <Select value={turmaSelecionada} label="Turma" onChange={handleTurmaChange}>
                {turmasExemplo.map((turma) => (
                  <MenuItem key={turma.id} value={turma.id}>{turma.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Nome do Aluno"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Matrícula"
              name="matricula"
              value={form.matricula}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <Button variant="contained" type="submit" size="large" className={styles.botaoCadastrar}>
              {editId !== null ? "Salvar" : "Cadastrar"}
            </Button>
          </Stack>
        </form>
      </Paper>
      <Typography variant="h6" gutterBottom className={styles.tituloAluno}>
        Alunos da Turma {turmasExemplo.find(t => t.id === turmaSelecionada)?.nome}
      </Typography>
      <TableContainer component={Paper} className={styles.tabelaAluno}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Matrícula</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunos.filter(a => a.turmaId === turmaSelecionada).map((aluno) => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.nome}</TableCell>
                <TableCell>{aluno.matricula}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(aluno)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(aluno.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {alunos.filter(a => a.turmaId === turmaSelecionada).length === 0 && (
        <Box sx={{ textAlign: 'center', color: '#bfa77a', mt: 3 }}>
          Nenhum aluno cadastrado nesta turma.
        </Box>
      )}
    </Container>
  );
}
