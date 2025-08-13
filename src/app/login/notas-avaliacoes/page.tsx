"use client";
import { useState } from "react";
import { Container, Typography, Paper, Stack, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Turma {
  id: number;
  nome: string;
}
interface Aluno {
  id: number;
  nome: string;
}
interface Avaliacao {
  id: number;
  nome: string;
  turmaId: number;
}
interface Nota {
  id: number;
  alunoId: number;
  avaliacaoId: number;
  valor: string;
}

const turmasExemplo: Turma[] = [
  { id: 1, nome: "Turma A" },
  { id: 2, nome: "Turma B" },
];
const alunosExemplo: Aluno[] = [
  { id: 1, nome: "Gabriela" },
  { id: 2, nome: "Sara" },
  { id: 3, nome: "Sarah" },
];

export default function NotasAvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number>(turmasExemplo[0].id);
  const [formAvaliacao, setFormAvaliacao] = useState({ nome: "" });
  const [formNota, setFormNota] = useState<{ [key: string]: string }>({});

  // Criação de avaliação
  const handleAvaliacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormAvaliacao({ ...formAvaliacao, nome: e.target.value });
  };
  const handleAvaliacaoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAvaliacao.nome) return;
    setAvaliacoes((prev) => [
      ...prev,
      { id: Date.now(), nome: formAvaliacao.nome, turmaId: turmaSelecionada },
    ]);
    setFormAvaliacao({ nome: "" });
  };
  const handleDeleteAvaliacao = (id: number) => {
    setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
    setNotas((prev) => prev.filter((n) => n.avaliacaoId !== id));
  };

  // Registro de notas
  const handleNotaChange = (alunoId: number, avaliacaoId: number, valor: string) => {
    setFormNota({ ...formNota, [`${alunoId}-${avaliacaoId}`]: valor.replace(/[^0-9.]/g, "").slice(0, 4) });
  };
  const handleNotaSubmit = (alunoId: number, avaliacaoId: number) => {
    const valor = formNota[`${alunoId}-${avaliacaoId}`] || "";
    if (!valor) return;
    setNotas((prev) => {
      const jaExiste = prev.find((n) => n.alunoId === alunoId && n.avaliacaoId === avaliacaoId);
      if (jaExiste) {
        return prev.map((n) =>
          n.alunoId === alunoId && n.avaliacaoId === avaliacaoId ? { ...n, valor } : n
        );
      }
      return [...prev, { id: Date.now(), alunoId, avaliacaoId, valor }];
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, color: "#2f2e2b" }}>
        Gestão de Notas e Avaliações
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4, background: "linear-gradient(135deg, #fff 0%, #f4ebdd 60%, #efe6d8 100%)" }}>
        <FormControl sx={{ minWidth: 140, mb: 2 }}>
          <InputLabel>Turma</InputLabel>
          <Select value={turmaSelecionada} label="Turma" onChange={e => setTurmaSelecionada(Number(e.target.value))}>
            {turmasExemplo.map((turma) => (
              <MenuItem key={turma.id} value={turma.id}>{turma.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <form onSubmit={handleAvaliacaoSubmit} style={{ marginBottom: 24 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <TextField
              label="Nome da Avaliação"
              value={formAvaliacao.nome}
              onChange={handleAvaliacaoChange}
              fullWidth
              required
            />
            <Button variant="contained" type="submit" size="large">
              Criar Avaliação
            </Button>
          </Stack>
        </form>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#2f2e2b" }}>
          Avaliações da Turma
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 4, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {avaliacoes.filter(a => a.turmaId === turmaSelecionada).map((avaliacao) => (
                <TableRow key={avaliacao.id}>
                  <TableCell>{avaliacao.nome}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDeleteAvaliacao(avaliacao.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#2f2e2b" }}>
          Registro de Notas
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Aluno</TableCell>
                {avaliacoes.filter(a => a.turmaId === turmaSelecionada).map((avaliacao) => (
                  <TableCell key={avaliacao.id}>{avaliacao.nome}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {alunosExemplo.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.nome}</TableCell>
                  {avaliacoes.filter(a => a.turmaId === turmaSelecionada).map((avaliacao) => (
                    <TableCell key={avaliacao.id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                          value={formNota[`${aluno.id}-${avaliacao.id}`] || notas.find(n => n.alunoId === aluno.id && n.avaliacaoId === avaliacao.id)?.valor || ""}
                          onChange={e => handleNotaChange(aluno.id, avaliacao.id, e.target.value)}
                          inputProps={{ maxLength: 4, inputMode: "decimal", pattern: "[0-9.]*" }}
                          size="small"
                          sx={{ width: 80 }}
                        />
                        <Button variant="outlined" size="small" onClick={() => handleNotaSubmit(aluno.id, avaliacao.id)}>
                          Salvar
                        </Button>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#2f2e2b" }}>
        Visualização de Notas
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aluno</TableCell>
              {avaliacoes.filter(a => a.turmaId === turmaSelecionada).map((avaliacao) => (
                <TableCell key={avaliacao.id}>{avaliacao.nome}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {alunosExemplo.map((aluno) => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.nome}</TableCell>
                {avaliacoes.filter(a => a.turmaId === turmaSelecionada).map((avaliacao) => (
                  <TableCell key={avaliacao.id}>
                    {notas.find(n => n.alunoId === aluno.id && n.avaliacaoId === avaliacao.id)?.valor || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
