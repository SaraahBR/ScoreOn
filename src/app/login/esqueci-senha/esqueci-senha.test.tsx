
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "./page";

describe("Recuperação de Senha - Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
let mockFetch: jest.Mock;
beforeEach(() => {
  global.fetch = jest.fn();
  mockFetch = global.fetch as jest.Mock;
  jest.clearAllMocks();
});

  it("não permite submit com campos obrigatórios vazios", async () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Salvar nova senha/i }));
    // Formulário permanece na tela
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Código de recuperação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nova senha/i)).toBeInTheDocument();
    // Não exibe mensagem de sucesso
    expect(screen.queryByText(/Senha atualizada com sucesso/i)).not.toBeInTheDocument();
    // Campos são required
    expect(screen.getByLabelText(/E-mail/i)).toBeRequired();
    expect(screen.getByLabelText(/Código de recuperação/i)).toBeRequired();
    expect(screen.getByLabelText(/Nova senha/i)).toBeRequired();
  });

  it("exibe erro para e-mail inválido", async () => {
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "emailinvalido" } });
    fireEvent.change(screen.getByLabelText(/Código de recuperação/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Nova senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar nova senha/i }));
    // O campo E-mail permanece com type email
    expect(screen.getByLabelText(/E-mail/i)).toHaveAttribute("type", "email");
    // Não exibe mensagem de sucesso
    expect(screen.queryByText(/Senha atualizada com sucesso/i)).not.toBeInTheDocument();
  });

  it("exibe erro do backend (ex: código incorreto)", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Código incorreto" }),
    });
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Código de recuperação/i), { target: { value: "000000" } });
    fireEvent.change(screen.getByLabelText(/Nova senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar nova senha/i }));
    expect(await screen.findByText(/Código incorreto/i)).toBeInTheDocument();
  });

  it("exibe mensagem de sucesso ao redefinir senha", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Código de recuperação/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Nova senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar nova senha/i }));
    expect(await screen.findByText(/Senha atualizada com sucesso/i)).toBeInTheDocument();
  });

  it("botão fica desabilitado enquanto loading", async () => {
    let resolveFetch: any;
    mockFetch.mockImplementationOnce(() => new Promise((resolve) => { resolveFetch = resolve; }));
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Código de recuperação/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Nova senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Salvar nova senha/i }));
    expect(screen.getByRole("button", { name: /Salvando/i })).toBeDisabled();
    resolveFetch({ ok: true, json: async () => ({}) });
    expect(await screen.findByText(/Senha atualizada com sucesso/i)).toBeInTheDocument();
  });
});
