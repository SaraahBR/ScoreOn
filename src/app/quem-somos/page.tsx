"use client";
import { Container, Typography, Box, Paper, Avatar, Stack } from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import GroupsIcon from "@mui/icons-material/Groups";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { useEffect } from "react";

const equipe = [
  {
    nome: "Gabriela Anjos",
    cargo: "Dev Backend",
    foto: "/Gabriela.webp",
    descricao: "Arquiteta de soluções backend, garantindo desempenho, segurança e escalabilidade no ambiente escolar."
  },
  {
    nome: "Sara Sales",
    cargo: "UX/UI Designer",
    foto: "/Sara.webp",
    descricao: "Líder de UX/UI que combina estética e funcionalidade para criar jornadas digitais intuitivas e marcantes."
  },
  {
    nome: "Sarah Hernandes",
    cargo: "Fundadora & Dev Frontend",
    foto: "/Sarah.webp",
    descricao: "Fundadora visionária que une inovação e código para transformar a experiência digital no ScoreOn."
  }
];

export default function QuemSomosPage() {
  useEffect(() => {
    const cards = document.querySelectorAll('.card-anim');
    cards.forEach((card, i) => {
      card.animate([
        { opacity: 0, transform: 'translateY(40px) scale(0.95)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ], {
        duration: 700 + i * 200,
        fill: 'forwards',
        easing: 'ease-out',
      });
    });
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, background: "linear-gradient(135deg, #fff 0%, #f4ebdd 60%, #efe6d8 100%)", boxShadow: "0 4px 32px rgba(47,46,43,0.08)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
          <Avatar src="/logo.png" alt="ScoreOn" sx={{ width: 100, height: 100, boxShadow: 2 }} />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#2f2e2b" }}>
              Quem Somos
            </Typography>
            <Typography variant="body1" sx={{ color: "#5a5956", fontSize: "1.15rem", mb: 2 }}>
              O ScoreOn é um sistema moderno para gestão de notas, turmas e avaliações escolares. Nosso objetivo é facilitar o trabalho de professores e gestores, trazendo praticidade, segurança e tecnologia para o ambiente educacional.
            </Typography>
          </Box>
        </Stack>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <SchoolIcon sx={{ fontSize: 40, color: "#bfa77a" }} />
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>Missão</Typography>
              <Typography variant="body2" sx={{ color: "#5a5956" }}>
                Democratizar o acesso à tecnologia na educação, tornando a gestão escolar mais eficiente e humana.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <EmojiObjectsIcon sx={{ fontSize: 40, color: "#bfa77a" }} />
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>Valores</Typography>
              <Typography variant="body2" sx={{ color: "#5a5956" }}>
                Inovação, transparência, respeito e compromisso com o aprendizado de todos.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <GroupsIcon sx={{ fontSize: 40, color: "#bfa77a" }} />
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>Equipe</Typography>
              <Typography variant="body2" sx={{ color: "#5a5956" }}>
                Profissionais apaixonados por educação e tecnologia, focados em entregar o melhor.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#2f2e2b", textAlign: 'center' }}>Conheça nosso time</Typography>
        <Grid container spacing={3}>
          {equipe.map((membro, idx) => (
            <Grid item xs={12} md={4} key={membro.nome}>
              <Card
                elevation={0}
                className="card-anim"
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(47,46,43,0.07)",
                  background: "#fff",
                  transition: 'transform 0.5s cubic-bezier(.22,1,.36,1), box-shadow 0.5s, filter 0.5s',
                  '&:hover': {
                    transform: 'translateY(-20px) scale(1.07)',
                    boxShadow: '0 16px 40px 0 rgba(47,46,43,0.18)',
                    filter: 'brightness(1.04)',
                  },
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Avatar src={membro.foto} alt={membro.nome} sx={{ width: 70, height: 70, mb: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{membro.nome}</Typography>
                  <Typography variant="body2" sx={{ color: "#bfa77a", mb: 1 }}>{membro.cargo}</Typography>
                  <Typography variant="body2" sx={{ color: "#5a5956", textAlign: "center" }}>{membro.descricao}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}
