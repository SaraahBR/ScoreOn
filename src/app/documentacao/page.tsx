"use client";

import { Container, Typography, Paper, Stack } from "@mui/material";
import styles from "./Documentacao.module.css";

export default function DocumentacaoPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper className={styles.docPaper} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom className={styles.docTitle}>
          Documentação do ScoreOn
        </Typography>
        <Typography variant="body1" paragraph>
          O ScoreOn é um sistema para gestão de notas, turmas e alunos, pensado para facilitar o controle acadêmico de escolas e professores.
        </Typography>
        <Typography variant="h5" gutterBottom className={styles.docSectionTitle}>
          Como usar o sistema
        </Typography>
        <Stack spacing={2}>
          <div className={styles.docStep}>
            <Typography variant="h6">1. Cadastro e Login</Typography>
            <Typography variant="body2">
              - Clique em "Começar agora" e crie sua conta usando Google ou e-mail.<br />
              - Após o login, você terá acesso ao painel principal.
            </Typography>
          </div>
          <div className={styles.docStep}>
            <Typography variant="h6">2. Gerenciar Turmas</Typography>
            <Typography variant="body2">
              - No menu ou na tela inicial, clique em "Cadastrar turma".<br />
              - Preencha o nome da turma e o ano letivo.<br />
              - As turmas cadastradas aparecerão em uma lista, onde você pode editar ou excluir.
            </Typography>
          </div>
          <div className={styles.docStep}>
            <Typography variant="h6">3. Gerenciar Alunos</Typography>
            <Typography variant="body2">
              - Acesse a seção "Meus Alunos".<br />
              - Cadastre novos alunos vinculando-os a uma turma.<br />
              - Edite ou remova alunos conforme necessário.
            </Typography>
          </div>
          <div className={styles.docStep}>
            <Typography variant="h6">4. Lançar Notas e Avaliações</Typography>
            <Typography variant="body2">
              - Vá até "Notas e Avaliações".<br />
              - Selecione a turma e o aluno desejado.<br />
              - Registre as notas das avaliações e salve.<br />
              - O sistema calcula médias automaticamente.
            </Typography>
          </div>
          <div className={styles.docStep}>
            <Typography variant="h6">5. Consultar Relatórios</Typography>
            <Typography variant="body2">
              - Gere relatórios de desempenho por aluno, turma ou disciplina.<br />
              - Exporte relatórios em PDF ou Excel, se necessário.
            </Typography>
          </div>
        </Stack>
        <Typography variant="h5" gutterBottom className={styles.docSectionTitle} sx={{ mt: 4 }}>
          Dúvidas Frequentes
        </Typography>
        <Stack spacing={1}>
          <div className={styles.docFaqItem}>
            <Typography variant="subtitle1" className={styles.docFaqTitle}>Preciso pagar para usar?</Typography>
            <Typography variant="body2">Não, o ScoreOn é gratuito para uso escolar.</Typography>
          </div>
          <div className={styles.docFaqItem}>
            <Typography variant="subtitle1" className={styles.docFaqTitle}>Posso cadastrar várias turmas?</Typography>
            <Typography variant="body2">Sim, não há limite de turmas ou alunos.</Typography>
          </div>
          <div className={styles.docFaqItem}>
            <Typography variant="subtitle1" className={styles.docFaqTitle}>Meus dados estão seguros?</Typography>
            <Typography variant="body2">Sim, usamos autenticação segura e seus dados não são compartilhados.</Typography>
          </div>
        </Stack>
      </Paper>
    </Container>
  );
}
