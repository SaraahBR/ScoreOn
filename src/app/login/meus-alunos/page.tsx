"use client";

import { useEffect, useState } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import styles from "./MeusAlunos.module.css";
import { useSession } from "next-auth/react";

interface Turma { id: number; name: string; school_year: string; }
interface Aluno { id: number; name: string; registration: string; class_id: number; }

export default function MeusAlunosPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", registration: "" });
  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState<{open:boolean; msg:string; sev:"success"|"error"|"info"|"warning"}>({open:false,msg:"",sev:"success"});
  const openSnack = (msg:string, sev:typeof snack.sev="success") => setSnack({open:true,msg,sev});
  const closeSnack = () => setSnack(s => ({...s, open:false}));

  async function fetchTurmas() {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/classes?email=${encodeURIComponent(session.user.email)}`, { cache: "no-store" });
      const j = await r.json();
      if (r.ok) {
        setTurmas(j.items ?? []);
        if ((j.items ?? []).length && turmaSelecionada === null) {
          setTurmaSelecionada(j.items[0].id);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function fetchAlunos(classId: number) {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/students?email=${encodeURIComponent(session.user.email)}&classId=${classId}`, { cache: "no-store" });
      const j = await r.json();
      if (r.ok) setAlunos(j.items ?? []);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { fetchTurmas(); }, [session?.user?.email]);
  useEffect(() => { if (turmaSelecionada) fetchAlunos(turmaSelecionada); }, [turmaSelecionada]);

  const handleTurmaChange = (e: any) => {
    setTurmaSelecionada(Number(e.target.value));
    setEditId(null);
    setForm({ name: "", registration: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "registration") {
      const onlyNums = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
      setForm({ ...form, registration: onlyNums });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !turmaSelecionada) return;
    if (!form.name || !form.registration) return;

    setBusy(true);
    try {
      if (editId !== null) {
        const r = await fetch("/api/students", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            id: editId,
            name: form.name,
            registration: form.registration,
          }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Erro ao salvar aluno");
        openSnack(t("studentsPage.form.updated", "Aluno atualizado!"), "success");
        setEditId(null);
      } else {
        const r = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            class_id: turmaSelecionada,
            name: form.name,
            registration: form.registration,
          }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Erro ao cadastrar aluno");
        openSnack(t("studentsPage.form.created", "Aluno cadastrado!"), "success");
      }
      setForm({ name: "", registration: "" });
      await fetchAlunos(turmaSelecionada);
    } catch (e:any) {
      openSnack(e?.message || "Erro", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setForm({ name: aluno.name, registration: aluno.registration });
    setEditId(aluno.id);
  };

  const handleDelete = async (id: number) => {
    if (!session?.user?.email || !turmaSelecionada) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/students?id=${id}&email=${encodeURIComponent(session.user.email)}`, { method: "DELETE" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || "Erro ao excluir");
      openSnack(t("studentsPage.form.deleted", "Aluno excluído."), "success");
      setEditId(null);
      setForm({ name: "", registration: "" });
      await fetchAlunos(turmaSelecionada);
    } catch (e:any) {
      openSnack(e?.message || "Erro", "error");
    } finally {
      setBusy(false);
    }
  };

  const turmaNomeAtual = turmas.find((t) => t.id === turmaSelecionada)?.name || "";

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Backdrop open={busy} sx={{ color:"#fff", zIndex:(t)=>t.zIndex.modal+1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack}>
        <Alert onClose={closeSnack} severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>

      <Typography component="h1" variant="h4" gutterBottom className={styles.tituloAluno}>
        {t("studentsPage.title", "Meus Alunos")}
      </Typography>

      <Paper className={styles.formAluno} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>{t("studentsPage.form.class_label", "Turma")}</InputLabel>
              <Select
                value={turmaSelecionada ?? ""}
                label={t("studentsPage.form.class_label", "Turma")}
                onChange={handleTurmaChange}
              >
                {turmas.map((turma) => (
                  <MenuItem key={turma.id} value={turma.id}>
                    {turma.name} {turma.school_year ? `(${turma.school_year})` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label={t("studentsPage.form.student_name", "Nome do Aluno")}
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label={t("studentsPage.form.registration", "Matrícula")}
              name="registration"
              value={form.registration}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 9, inputMode: "numeric", pattern: "[0-9]*" }}
            />

            <Button variant="contained" type="submit" size="large" className={styles.botaoCadastrar}>
              {editId !== null ? t("studentsPage.form.submit_save", "Salvar") : t("studentsPage.form.submit_new", "Cadastrar")}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Typography variant="h6" gutterBottom className={styles.tituloAluno}>
        {turmaSelecionada
          ? t("studentsPage.section_title_for_class", { className: turmaNomeAtual })
          : t("studentsPage.select_class_first", "Selecione uma turma")}
      </Typography>

      <TableContainer component={Paper} className={styles.tabelaAluno}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("studentsPage.table.header_name", "Nome")}</TableCell>
              <TableCell>{t("studentsPage.table.header_registration", "Matrícula")}</TableCell>
              <TableCell align="right">{t("studentsPage.table.header_actions", "Ações")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunos.map((aluno) => (
              <TableRow key={aluno.id}>
                <TableCell>{aluno.name}</TableCell>
                <TableCell>{aluno.registration}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(aluno)} aria-label={t("studentsPage.actions.edit", "Editar")} title={t("studentsPage.actions.edit", "Editar")}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(aluno.id)} color="error" aria-label={t("studentsPage.actions.delete", "Excluir")} title={t("studentsPage.actions.delete", "Excluir")}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {turmaSelecionada && alunos.length === 0 && (
        <Typography align="center" sx={{ color: "#bfa77a", mt: 3 }}>
          {t("studentsPage.table.empty_for_class", "Nenhum aluno nessa turma.")}
        </Typography>
      )}
    </Container>
  );
}
