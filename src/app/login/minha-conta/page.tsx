"use client";

import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function MinhaConta() {
  const { data: session } = useSession();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Informações da conta
      </Typography>

      {/* Meus dados */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Meus dados
      </Typography>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <TextField
          label="E-mail"
          fullWidth
          value={session?.user?.email || ""}
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Nome"
          fullWidth
          value={session?.user?.name || ""}
          margin="normal"
        />
        <TextField
          label="CPF"
          fullWidth
          placeholder="Digite seu CPF"
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Sexo</InputLabel>
          <Select defaultValue="">
            <MenuItem value="Feminino">Feminino</MenuItem>
            <MenuItem value="Masculino">Masculino</MenuItem>
            <MenuItem value="Não Informar">Não Informar</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Data de nascimento"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button variant="outlined" color="primary">
            Salvar alterações
          </Button>
          <Button variant="outlined" color="primary">
            Mudar senha
          </Button>
        </Box>
      </Paper>

      {/* Endereço */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Endereço
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <TextField
              label="Endereço"
              fullWidth
              placeholder="Digite seu endereço"
              margin="normal"
            />
            <TextField
              label="Cidade"
              fullWidth
              placeholder="Digite sua cidade"
              margin="normal"
            />
            <TextField
              label="CEP"
              fullWidth
              placeholder="Digite seu CEP"
              margin="normal"
            />
            <TextField
              label="Telefone"
              fullWidth
              placeholder="Digite seu telefone"
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" color="primary">
                Salvar endereço
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
