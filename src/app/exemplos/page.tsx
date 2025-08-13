"use client";

import { Container, Typography, Paper, Stack, Box } from "@mui/material";
import styles from "./Exemplos.module.css";

export default function ExemplosPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper className={styles.exemploPaper} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom className={styles.exemploTitle}>
          Exemplos de Uso do ScoreOn
        </Typography>
        <Typography variant="body1" paragraph>
          Veja na prática como cadastrar turmas, alunos e lançar notas no ScoreOn. Siga o passo a passo abaixo para entender o fluxo completo:
        </Typography>
        <Stack spacing={3}>
          <Box className={styles.exemploStep}>
            <Typography variant="h5">1. Cadastrando uma Turma</Typography>
            <Typography variant="body2">
              - Acesse o menu ou clique em "Cadastrar turma" na tela inicial.<br />
              - Preencha o nome da turma (ex: 3º Ano A) e o ano letivo (ex: 2025).<br />
              - Clique em "Cadastrar". Sua turma aparecerá na lista de turmas.
            </Typography>
          </Box>
          <Box className={styles.exemploStep}>
            <Typography variant="h5">2. Adicionando Alunos</Typography>
            <Typography variant="body2">
              - Entre na turma desejada e clique em "Adicionar aluno".<br />
              - Informe nome, e-mail e outros dados do aluno.<br />
              - Salve para vincular o aluno à turma.
            </Typography>
          </Box>
          <Box className={styles.exemploStep}>
            <Typography variant="h5">3. Lançando Notas</Typography>
            <Typography variant="body2">
              - Selecione a turma e o aluno.<br />
              - Clique em "Lançar nota" e preencha os campos da avaliação.<br />
              - Salve para registrar a nota. O sistema calcula a média automaticamente.
            </Typography>
          </Box>
          <Box className={styles.exemploStep}>
            <Typography variant="h5">4. Gerando Relatórios</Typography>
            <Typography variant="body2">
              - Acesse a seção de relatórios.<br />
              - Escolha o tipo de relatório (por aluno, turma ou disciplina).<br />
              - Exporte em PDF ou Excel, se desejar.
            </Typography>
          </Box>
        </Stack>
        <Typography variant="h5" gutterBottom className={styles.exemploSectionTitle} sx={{ mt: 4 }}>
          Dicas Rápidas
        </Typography>
        <ul className={styles.dicasList}>
          <li>Use a busca para encontrar turmas ou alunos rapidamente.</li>
          <li>Edite ou exclua registros clicando nos ícones de ação ao lado de cada item.</li>
          <li>Todos os dados são salvos automaticamente e podem ser acessados de qualquer dispositivo.</li>
        </ul>
      </Paper>
    </Container>
  );
}
