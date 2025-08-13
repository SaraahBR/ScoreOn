"use client";

import { Box, Container, Typography } from "@mui/material";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ py: 6, bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
      <Container maxWidth="lg">
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 26, md: 34 } }} gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}