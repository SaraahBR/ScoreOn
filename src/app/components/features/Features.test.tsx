import React from "react";
import { render, screen } from "@testing-library/react";
import Features from "./Features";

describe("Features component", () => {
  it("renders all feature cards with correct titles, descriptions, and icons", () => {
    render(<Features />);
    // Verifica os textos
    expect(screen.getByText("Turmas e alunos")).toBeInTheDocument();
    expect(screen.getByText("Gerencie turmas e perfis de alunos com facilidade.")).toBeInTheDocument();
    expect(screen.getByText("Avaliações e médias")).toBeInTheDocument();
    expect(screen.getByText("Registre notas, calcule médias e acompanhe evolução.")).toBeInTheDocument();
    expect(screen.getByText("Confiável")).toBeInTheDocument();
    expect(screen.getByText("Padrões de acessibilidade e boas práticas.")).toBeInTheDocument();

    // Verifica a quantidade de cards (h3)
    const cards = screen.getAllByRole('heading', { level: 3 });
    expect(cards.length).toBe(3);

    // Verifica se os ícones estão presentes
    // Os ícones do MUI são renderizados como svg
    const icons = screen.getAllByTestId(/Icon$/);
    expect(icons.length).toBeGreaterThanOrEqual(3);
  });
});
