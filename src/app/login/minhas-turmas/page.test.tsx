import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TurmasPage from "./page";

describe("TurmasPage (Cadastro de Turma)", () => {
  it("permite cadastrar uma nova turma e exibe na tabela", async () => {
    render(<TurmasPage />);
    
    // Preenche o formulário
    await userEvent.type(screen.getByLabelText(/Nome da Turma/i), "Turma Teste");
    await userEvent.type(screen.getByLabelText(/Ano Letivo/i), "2025");

    // Submete o formulário
    await userEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    // Aguarda a turma aparecer na tabela
    expect(await screen.findByText("Turma Teste")).toBeInTheDocument();
    expect(await screen.findByText("2025")).toBeInTheDocument();

    // Verifica se o formulário foi resetado
    expect(screen.getByLabelText(/Nome da Turma/i)).toHaveValue("");
    expect(screen.getByLabelText(/Ano Letivo/i)).toHaveValue("");
  });

  it("não cadastra turma se campos estiverem vazios", async () => {
    render(<TurmasPage />);
    
    await userEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    
    expect(screen.queryByText("Nenhuma turma cadastrada.")).toBeInTheDocument();
  });

  it("permite editar uma turma existente", async () => {
    render(<TurmasPage />);
    // Cadastra turma
    await userEvent.type(screen.getByLabelText(/Nome da Turma/i), "Turma Editar");
    await userEvent.type(screen.getByLabelText(/Ano Letivo/i), "2024");
    await userEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    // Clica no botão de editar
    await userEvent.click(screen.getByRole("button", { name: /editar/i }));
    // Altera os campos
    await userEvent.clear(screen.getByLabelText(/Nome da Turma/i));
    await userEvent.type(screen.getByLabelText(/Nome da Turma/i), "Turma Editada");
    await userEvent.clear(screen.getByLabelText(/Ano Letivo/i));
    await userEvent.type(screen.getByLabelText(/Ano Letivo/i), "2025");
    // Salva edição
    await userEvent.click(screen.getByRole("button", { name: /Salvar/i }));
    // Verifica se a edição foi aplicada
    expect(await screen.findByText("Turma Editada")).toBeInTheDocument();
    expect(await screen.findByText("2025")).toBeInTheDocument();
    expect(screen.queryByText("Turma Editar")).not.toBeInTheDocument();
  });

  it("permite excluir uma turma existente", async () => {
    render(<TurmasPage />);
    // Cadastra turma
    await userEvent.type(screen.getByLabelText(/Nome da Turma/i), "Turma Excluir");
    await userEvent.type(screen.getByLabelText(/Ano Letivo/i), "2023");
    await userEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    // Clica no botão de excluir
    await userEvent.click(screen.getByRole("button", { name: /excluir/i }));
    // Verifica se a turma foi removida
    expect(screen.queryByText("Turma Excluir")).not.toBeInTheDocument();
    expect(screen.queryByText("2023")).not.toBeInTheDocument();
    expect(screen.getByText("Nenhuma turma cadastrada.")).toBeInTheDocument();
  });

  it("valida o formato do ano e exibe feedback de erro", async () => {
    render(<TurmasPage />);
    await userEvent.type(screen.getByLabelText(/Nome da Turma/i), "Turma Inválida");
    await userEvent.type(screen.getByLabelText(/Ano Letivo/i), "20"); // Menos de 4 dígitos
    await userEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    // Espera feedback visual de erro
    expect(screen.getByText(/Digite um ano válido/)).toBeInTheDocument();
    // Não deve cadastrar
    expect(screen.queryByText("Turma Inválida")).not.toBeInTheDocument();
  });
});
