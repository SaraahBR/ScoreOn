"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
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
  Box,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

// Recharts (client-only, com tipos compatíveis com next/dynamic)
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const TooltipC = dynamic(
  () => import("recharts").then((m: any) => m.Tooltip as any),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);
const LegendC = dynamic(
  () => import("recharts").then((m: any) => m.Legend as any),
  { ssr: false }
);

// Tipos
interface Turma {
  id: number;
  name: string;
  school_year: string;
}
interface Aluno {
  id: number;
  name: string;
  registration: string;
  class_id: number;
}
interface Avaliacao {
  id: number;
  name: string;
  class_id: number;
  weight: number;
  term: string;
}
interface Nota {
  assessment_id: number;
  student_id: number;
  value: string;
}

const GRADE_MIN = 0;
const GRADE_MAX = 10;
const PASSING_GRADE = 7.0;
const DECIMALS = 2;
const TERMS = [
  "Todas",
  "Geral",
  "1º Bimestre",
  "2º Bimestre",
  "3º Bimestre",
  "4º Bimestre",
];

type Snack = {
  open: boolean;
  msg: string;
  sev: "success" | "error" | "info" | "warning";
};

export default function NotasAvaliacoesPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [grades, setGrades] = useState<Nota[]>([]);

  const [termFilter, setTermFilter] = useState<string>("Todas");

  const [formAvaliacao, setFormAvaliacao] = useState({
    nome: "",
    peso: "1",
    term: "Geral",
  });
  const [formNota, setFormNota] = useState<Record<string, string>>({});

  const [editRow, setEditRow] = useState<{
    id: number;
    nome: string;
    peso: string;
    term: string;
  } | null>(null);

  const debounceTimers = useRef<Map<string, any>>(new Map());

  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    msg: "",
    sev: "success",
  });
  const openSnack = (msg: string, sev: Snack["sev"] = "success") =>
    setSnack({ open: true, msg, sev });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // ---------- Carregamentos ----------
  async function loadTurmas() {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/classes?email=${encodeURIComponent(session.user.email)}`,
        { cache: "no-store" }
      );
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
  async function loadAlunos(classId: number) {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/students?email=${encodeURIComponent(
          session.user.email
        )}&classId=${classId}`,
        { cache: "no-store" }
      );
      const j = await r.json();
      if (r.ok) setAlunos(j.items ?? []);
    } finally {
      setBusy(false);
    }
  }
  async function loadAvaliacoes(classId: number) {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/assessments?email=${encodeURIComponent(
          session.user.email
        )}&classId=${classId}`,
        { cache: "no-store" }
      );
      const j = await r.json();
      if (r.ok) setAvaliacoes(j.items ?? []);
    } finally {
      setBusy(false);
    }
  }
  async function loadGrades(classId: number) {
    if (!session?.user?.email) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/grades?email=${encodeURIComponent(
          session.user.email
        )}&classId=${classId}`,
        { cache: "no-store" }
      );
      const j = await r.json();
      if (r.ok) setGrades(j.items ?? []);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadTurmas();
  }, [session?.user?.email]);

  useEffect(() => {
    if (!turmaSelecionada) return;
    loadAlunos(turmaSelecionada);
    loadAvaliacoes(turmaSelecionada);
    loadGrades(turmaSelecionada);
    setFormNota({});
    setEditRow(null);
  }, [turmaSelecionada]);

  // ---------- Filtro ----------
  const avaliacoesFiltradas = useMemo(() => {
    const base = (avaliacoes || []).filter(
      (a) => a.class_id === turmaSelecionada
    );
    if (termFilter === "Todas") return base;
    return base.filter((a) => (a.term ?? "Geral") === termFilter);
  }, [avaliacoes, turmaSelecionada, termFilter]);

  // ---------- CRUD Avaliações ----------
  const handleAvaliacaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !turmaSelecionada) return;
    const nome = formAvaliacao.nome.trim();
    if (!nome) return;

    const w = Number((formAvaliacao.peso || "1").replace(",", "."));
    if (!Number.isFinite(w) || w <= 0) {
      openSnack(
        t("gradesPage.assessments.invalid_weight", "Peso inválido"),
        "error"
      );
      return;
    }
    const term = formAvaliacao.term || "Geral";

    setBusy(true);
    try {
      const r = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          class_id: turmaSelecionada,
          name: nome,
          weight: w,
          term,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Erro");
      setFormAvaliacao({ nome: "", peso: "1", term: "Geral" });
      openSnack(
        t("gradesPage.assessments.created", "Avaliação criada!"),
        "success"
      );
      await loadAvaliacoes(turmaSelecionada);
    } catch (e: any) {
      openSnack(e?.message || "Erro", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAvaliacao = async (id: number) => {
    if (!session?.user?.email || !turmaSelecionada) return;
    setBusy(true);
    try {
      const r = await fetch(
        `/api/assessments?id=${id}&email=${encodeURIComponent(
          session.user.email
        )}`,
        { method: "DELETE" }
      );
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || "Erro");
      openSnack(
        t("gradesPage.assessments.deleted", "Avaliação excluída."),
        "success"
      );
      await loadAvaliacoes(turmaSelecionada);
      await loadGrades(turmaSelecionada);
    } catch (e: any) {
      openSnack(e?.message || "Erro", "error");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (av: Avaliacao) => {
    setEditRow({
      id: av.id,
      nome: av.name,
      peso: String(av.weight ?? 1),
      term: av.term ?? "Geral",
    });
  };
  const cancelEdit = () => setEditRow(null);

  const saveEdit = async () => {
    if (!editRow || !session?.user?.email) return;
    const id = editRow.id;
    const nome = editRow.nome.trim();
    const w = Number((editRow.peso || "1").replace(",", "."));
    const term = editRow.term || "Geral";
    if (!nome || !Number.isFinite(w) || w <= 0) {
      openSnack(
        t(
          "gradesPage.assessments.invalid_fields",
          "Preencha nome e um peso válido"
        ),
        "error"
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/assessments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          id,
          name: nome,
          weight: w,
          term,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Erro ao atualizar avaliação");
      openSnack(
        t("gradesPage.assessments.updated", "Avaliação atualizada!"),
        "success"
      );
      setEditRow(null);
      if (turmaSelecionada) await loadAvaliacoes(turmaSelecionada);
    } catch (e: any) {
      openSnack(e?.message || "Erro", "error");
    } finally {
      setBusy(false);
    }
  };

  // ---------- Notas (inline + debounce + enter + blur) ----------
  const saveGrade = async (
  alunoId: number,
  avaliacaoId: number,
  rawValue: string
) => {
  if (!session?.user?.email || !turmaSelecionada) return;

  // 1) Normaliza vírgula -> ponto e remove lixo
  const cleaned = (rawValue || "").replace(/[^\d.,]/g, "").replaceAll(",", ".");
  // 2) Garante no máximo um ponto decimal
  const normalized = cleaned.split(".").slice(0, 2).join(".");
  let num = Number(normalized);

  if (!Number.isFinite(num)) {
    openSnack("Nota inválida", "error");
    return;
  }

  // 3) Limita faixa e ARREDONDA só aqui
  if (num > GRADE_MAX) num = GRADE_MAX;
  if (num < GRADE_MIN) num = GRADE_MIN;
  num = Number(num.toFixed(DECIMALS)); // ex.: 10 -> 10.00 -> 10 (para armazenar como número)

  try {
    const r = await fetch("/api/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        assessment_id: avaliacaoId,
        student_id: alunoId,
        value: num, // envia número já validado
      }),
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error || "Erro ao salvar nota");
    await loadGrades(turmaSelecionada);
  } catch (e: any) {
    openSnack(e?.message || "Erro", "error");
  }
};

const handleNotaChange = (
  alunoId: number,
  avaliacaoId: number,
  valor: string
) => {
  const key = `${alunoId}-${avaliacaoId}`;

  // 1) Aceita digitação livre (só números, vírgula e ponto)
  const cleaned = valor.replace(/[^\d.,]/g, "").replaceAll(",", ".");
  // 2) Mantém apenas um separador decimal
  const normalized = cleaned.split(".").slice(0, 2).join(".");

  // 3) NÃO arredonda nem corta aqui; deixa o usuário digitar
  setFormNota((s) => ({ ...s, [key]: normalized }));

  // 4) Se o usuário só digitou "." ou vazio, não dispara nada agora
  if (normalized === "" || normalized === ".") return;

  const timers = debounceTimers.current;
  if (timers.has(key)) clearTimeout(timers.get(key));
  const t = setTimeout(() => {
    saveGrade(alunoId, avaliacaoId, normalized);
    timers.delete(key);
  }, 800);
  timers.set(key, t);
};

const handleNotaKeyDown = (
  alunoId: number,
  avaliacaoId: number,
  e: React.KeyboardEvent
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const key = `${alunoId}-${avaliacaoId}`;
    const timers = debounceTimers.current;
    if (timers.has(key)) {
      clearTimeout(timers.get(key));
      timers.delete(key);
    }
    const val =
      formNota[key] ??
      grades.find(
        (g) => g.student_id === alunoId && g.assessment_id === avaliacaoId
      )?.value ??
      "";
    // Arredonda/valida só no salvar
    saveGrade(alunoId, avaliacaoId, String(val));
  }
};

const handleNotaBlur = (alunoId: number, avaliacaoId: number) => {
  const key = `${alunoId}-${avaliacaoId}`;
  const timers = debounceTimers.current;
  if (timers.has(key)) {
    clearTimeout(timers.get(key));
    timers.delete(key);
  }
  const val =
    formNota[key] ??
    grades.find(
      (g) => g.student_id === alunoId && g.assessment_id === avaliacaoId
    )?.value ??
    "";
  if (val !== "" && val !== ".") {
    saveGrade(alunoId, avaliacaoId, String(val));
  }
};

  const getValor = (alunoId: number, avaliacaoId: number) => {
    const key = `${alunoId}-${avaliacaoId}`;
    return (
      formNota[key] ??
      grades.find(
        (g) => g.student_id === alunoId && g.assessment_id === avaliacaoId
      )?.value ??
      ""
    );
  };

  const turmaNome = turmas.find((t) => t.id === turmaSelecionada)?.name || "";

  // ---------- Médias ----------
  const mediasAluno = useMemo(() => {
    const map: Record<number, { soma: number; pesos: number }> = {};
    for (const a of alunos) map[a.id] = { soma: 0, pesos: 0 };

    const wByAssessment: Record<number, number> = {};
    for (const av of avaliacoesFiltradas)
      wByAssessment[av.id] = Number(av.weight ?? 1);

    for (const g of grades) {
      if (!wByAssessment[g.assessment_id]) continue;
      const v = Number(g.value);
      if (!Number.isFinite(v)) continue;
      const w = wByAssessment[g.assessment_id];
      if (!map[g.student_id]) map[g.student_id] = { soma: 0, pesos: 0 };
      map[g.student_id].soma += v * w;
      map[g.student_id].pesos += w;
    }

    const out: Record<number, number | null> = {};
    for (const a of alunos) {
      const { soma, pesos } = map[a.id] || { soma: 0, pesos: 0 };
      out[a.id] = pesos ? Number((soma / pesos).toFixed(DECIMALS)) : null;
    }
    return out;
  }, [alunos, grades, avaliacoesFiltradas]);

  const mediasAvaliacao = useMemo(() => {
    const map: Record<number, { soma: number; count: number }> = {};
    for (const av of avaliacoesFiltradas) map[av.id] = { soma: 0, count: 0 };
    for (const g of grades) {
      if (!map[g.assessment_id]) continue;
      const v = Number(g.value);
      if (!Number.isFinite(v)) continue;
      map[g.assessment_id].soma += v;
      map[g.assessment_id].count += 1;
    }
    const out: Record<number, number | null> = {};
    for (const av of avaliacoesFiltradas) {
      const { soma, count } = map[av.id] || { soma: 0, count: 0 };
      out[av.id] = count ? Number((soma / count).toFixed(DECIMALS)) : null;
    }
    return out;
  }, [avaliacoesFiltradas, grades]);

  // ---------- Exportações CSV ----------
  function toCSV(lines: string[][]) {
    const escape = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
    return lines
      .map((row) => row.map((col) => escape(col)).join(";"))
      .join("\n");
  }
  function downloadCSV(filename: string, csv: string) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const exportMatrixCSV = () => {
    const header = [
      "Aluno",
      ...avaliacoesFiltradas.map(
        (a) => `${a.name} (w=${Number(a.weight ?? 1)}|${a.term || "Geral"})`
      ),
      "Média (ponderada)",
    ];
    const lines: string[][] = [header];
    for (const a of alunos) {
      const row = [a.name];
      for (const av of avaliacoesFiltradas) {
        const v =
          grades.find((g) => g.student_id === a.id && g.assessment_id === av.id)
            ?.value ?? "";
        row.push(String(v));
      }
      row.push(mediasAluno[a.id] != null ? String(mediasAluno[a.id]) : "");
      lines.push(row);
    }
    downloadCSV(
      `notas_${turmaNome || "turma"}_${termFilter}.csv`,
      toCSV(lines)
    );
  };

  const exportSummaryCSV = () => {
    const lines: string[][] = [];
    lines.push([`Resumo por aluno (média ponderada) — Termo: ${termFilter}`]);
    lines.push(["Aluno", "Média", "Situação"]);
    for (const a of alunos) {
      const m = mediasAluno[a.id];
      const sit =
        m == null ? "-" : m >= PASSING_GRADE ? "Aprovado" : "Reprovado";
      lines.push([a.name, m == null ? "" : String(m), sit]);
    }
    lines.push([]);
    lines.push(["Médias por avaliação (média simples)"]);
    lines.push(["Avaliação", "Peso", "Termo", "Média"]);
    for (const av of avaliacoesFiltradas) {
      const m = mediasAvaliacao[av.id];
      lines.push([
        av.name,
        String(av.weight ?? 1),
        av.term || "Geral",
        m == null ? "" : String(m),
      ]);
    }
    downloadCSV(
      `resumo_${turmaNome || "turma"}_${termFilter}.csv`,
      toCSV(lines)
    );
  };

  // ---------- Dados para gráficos ----------
  const chartAlunos = useMemo(
    () => alunos.map((a) => ({ name: a.name, media: mediasAluno[a.id] ?? 0 })),
    [alunos, mediasAluno]
  );
  const chartAvaliacoes = useMemo(
    () =>
      avaliacoesFiltradas.map((av) => ({
        name: `${av.name} (w=${Number(av.weight ?? 1)})`,
        media: mediasAvaliacao[av.id] ?? 0,
      })),
    [avaliacoesFiltradas, mediasAvaliacao]
  );

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
        sx={{ fontWeight: 700, color: "#2f2e2b" }}
      >
        {t("gradesPage.title", "Notas e Avaliações")}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #fff 0%, #f4ebdd 60%, #efe6d8 100%)",
        }}
      >
        {/* Seleção da turma + filtro por período */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>{t("gradesPage.form.class_label", "Turma")}</InputLabel>
            <Select
              value={turmaSelecionada ?? ""}
              label={t("gradesPage.form.class_label", "Turma")}
              onChange={(e) => setTurmaSelecionada(Number(e.target.value))}
            >
              {turmas.map((turma) => (
                <MenuItem key={turma.id} value={turma.id}>
                  {turma.name}{" "}
                  {turma.school_year ? `(${turma.school_year})` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Período/Etapa</InputLabel>
            <Select
              value={termFilter}
              label="Período/Etapa"
              onChange={(e) => setTermFilter(String(e.target.value))}
            >
              {TERMS.map((term) => (
                <MenuItem key={term} value={term}>
                  {term}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {termFilter !== "Todas" && (
            <Chip
              label={`Filtrando: ${termFilter}`}
              sx={{ alignSelf: "center" }}
            />
          )}
        </Stack>

        {/* Criar avaliação */}
        <form onSubmit={handleAvaliacaoSubmit} style={{ marginBottom: 24 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label={t("gradesPage.form.assessment_name", "Nome da avaliação")}
              value={formAvaliacao.nome}
              onChange={(e) =>
                setFormAvaliacao((s) => ({ ...s, nome: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label={t("gradesPage.form.weight", "Peso")}
              value={formAvaliacao.peso}
              onChange={(e) => {
                const clean = e.target.value
                  .replace(/[^0-9.,]/g, "")
                  .replace(",", ".");
                setFormAvaliacao((s) => ({ ...s, peso: clean }));
              }}
              inputProps={{ inputMode: "decimal", pattern: "[0-9.,]*" }}
              sx={{ width: 120 }}
              required
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Período/Etapa</InputLabel>
              <Select
                value={formAvaliacao.term}
                label="Período/Etapa"
                onChange={(e) =>
                  setFormAvaliacao((s) => ({
                    ...s,
                    term: String(e.target.value),
                  }))
                }
              >
                {TERMS.filter((x) => x !== "Todas").map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" type="submit" size="large">
              {t("gradesPage.form.create_assessment", "Criar avaliação")}
            </Button>
          </Stack>
        </form>

        {/* Lista de avaliações (edição inline) */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: "#2f2e2b" }}
        >
          {t("gradesPage.assessments.title", "Avaliações")}
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 4, mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {t("gradesPage.assessments.header_name", "Nome")}
                </TableCell>
                <TableCell sx={{ width: 120 }}>
                  {t("gradesPage.assessments.weight", "Peso")}
                </TableCell>
                <TableCell sx={{ width: 200 }}>Período/Etapa</TableCell>
                <TableCell align="right">
                  {t("gradesPage.assessments.header_actions", "Ações")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {avaliacoesFiltradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Box sx={{ color: "#bfa77a", py: 2 }}>
                      {t("gradesPage.assessments.empty", "Nenhuma avaliação.")}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {avaliacoesFiltradas.map((av) => {
                const isEdit = editRow?.id === av.id;
                return (
                  <TableRow key={av.id}>
                    <TableCell>
                      {isEdit ? (
                        <TextField
                          value={editRow!.nome}
                          onChange={(e) =>
                            setEditRow((r) =>
                              r ? { ...r, nome: e.target.value } : r
                            )
                          }
                          size="small"
                          fullWidth
                        />
                      ) : (
                        av.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEdit ? (
                        <TextField
                          value={editRow!.peso}
                          onChange={(e) => {
                            const clean = e.target.value
                              .replace(/[^0-9.,]/g, "")
                              .replace(",", ".");
                            setEditRow((r) => (r ? { ...r, peso: clean } : r));
                          }}
                          inputProps={{
                            inputMode: "decimal",
                            pattern: "[0-9.,]*",
                          }}
                          size="small"
                        />
                      ) : (
                        Number(av.weight ?? 1).toString()
                      )}
                    </TableCell>
                    <TableCell>
                      {isEdit ? (
                        <FormControl fullWidth size="small">
                          <Select
                            value={editRow!.term}
                            onChange={(e) =>
                              setEditRow((r) =>
                                r ? { ...r, term: String(e.target.value) } : r
                              )
                            }
                          >
                            {TERMS.filter((x) => x !== "Todas").map((term) => (
                              <MenuItem key={term} value={term}>
                                {term}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        av.term || "Geral"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {isEdit ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            color="primary"
                            onClick={saveEdit}
                            aria-label="Salvar"
                            title="Salvar"
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            onClick={cancelEdit}
                            aria-label="Cancelar"
                            title="Cancelar"
                          >
                            <CloseIcon />
                          </IconButton>
                        </Stack>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            onClick={() => startEdit(av)}
                            aria-label="Editar"
                            title="Editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteAvaliacao(av.id)}
                            color="error"
                            aria-label={t(
                              "gradesPage.actions.delete",
                              "Excluir"
                            )}
                            title={t("gradesPage.actions.delete", "Excluir")}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Lançar notas */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 600, color: "#2f2e2b" }}
        >
          {t("gradesPage.grades.title", "Lançar notas")}
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {t("gradesPage.grades.header_student", "Aluno")}
                </TableCell>
                {avaliacoesFiltradas.map((avaliacao) => (
                  <TableCell key={avaliacao.id}>{avaliacao.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.name}</TableCell>
                  {avaliacoesFiltradas.map((avaliacao) => {
                    const current = getValor(aluno.id, avaliacao.id);
                    return (
                      <TableCell key={avaliacao.id}>
                        <TextField
                          value={current}
                          onChange={(e) =>
                            handleNotaChange(
                              aluno.id,
                              avaliacao.id,
                              e.target.value
                            )
                          }
                          onKeyDown={(e) =>
                            handleNotaKeyDown(aluno.id, avaliacao.id, e)
                          }
                          onBlur={() => handleNotaBlur(aluno.id, avaliacao.id)}
                          inputProps={{
                            maxLength: 5,
                            inputMode: "decimal",
                            pattern: "[0-9.,]*",
                          }}
                          size="small"
                          sx={{ width: 90 }}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Médias / exportações / gráficos */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mt: 4, borderRadius: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#2f2e2b" }}>
            {t("gradesPage.summary.title", "Médias e Situação")}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={exportMatrixCSV}>
              {t("gradesPage.export.matrix", "Exportar CSV (Matriz)")}
            </Button>
            <Button variant="outlined" onClick={exportSummaryCSV}>
              {t("gradesPage.export.summary", "Exportar CSV (Resumo)")}
            </Button>
          </Stack>
        </Stack>

        {/* Tabela de médias por aluno */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {t("gradesPage.summary.header_student", "Aluno")}
                </TableCell>
                <TableCell>
                  {t("gradesPage.summary.header_avg", "Média")}
                </TableCell>
                <TableCell>
                  {t("gradesPage.summary.header_status", "Situação")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((a) => {
                const m = mediasAluno[a.id];
                const sit =
                  m == null
                    ? "-"
                    : m >= PASSING_GRADE
                    ? t("gradesPage.summary.approved", "Aprovado")
                    : t("gradesPage.summary.failed", "Reprovado");
                return (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>
                      {m == null ? "-" : m.toFixed(DECIMALS)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          m == null
                            ? "text.secondary"
                            : m >= PASSING_GRADE
                            ? "success.main"
                            : "error.main",
                        fontWeight: 600,
                      }}
                    >
                      {sit}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Gráfico: médias por aluno */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#2f2e2b", mb: 1 }}
        >
          {t("gradesPage.charts.by_student", "Gráfico: média por aluno")}
        </Typography>
        <Box sx={{ width: "100%", height: 300, mb: 4 }}>
          <ResponsiveContainer>
            <BarChart data={chartAlunos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <TooltipC />
              <LegendC />
              <Bar
                dataKey="media"
                name={t("gradesPage.summary.header_avg", "Média")}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Tabela: média por avaliação */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "#2f2e2b", mb: 1 }}
        >
          {t("gradesPage.summary.per_assessment", "Médias por avaliação")}
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  {t("gradesPage.assessments.header_name", "Avaliação")}
                </TableCell>
                <TableCell>
                  {t("gradesPage.assessments.weight", "Peso")}
                </TableCell>
                <TableCell>Período/Etapa</TableCell>
                <TableCell>
                  {t("gradesPage.summary.header_avg", "Média")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {avaliacoesFiltradas.map((av) => {
                const m = mediasAvaliacao[av.id];
                return (
                  <TableRow key={av.id}>
                    <TableCell>{av.name}</TableCell>
                    <TableCell>{Number(av.weight ?? 1).toString()}</TableCell>
                    <TableCell>{av.term || "Geral"}</TableCell>
                    <TableCell>
                      {m == null ? "-" : m.toFixed(DECIMALS)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Gráfico: médias por avaliação */}
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartAvaliacoes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <TooltipC />
              <LegendC />
              <Bar
                dataKey="media"
                name={t("gradesPage.summary.header_avg", "Média")}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Container>
  );
}
