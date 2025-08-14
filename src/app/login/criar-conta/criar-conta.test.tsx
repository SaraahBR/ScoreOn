import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "./page";

// Mock global fetch corretamente tipado
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

describe("Criação de Conta - Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não permite cadastro com campos obrigatórios vazios", async () => {
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /Continuar/i }));
    // O formulário deve permanecer na tela inicial (step form)
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    // Não deve avançar para o step do código
    expect(screen.queryByText(/código de confirmação/i)).not.toBeInTheDocument();
    // Os campos devem ser required
    expect(screen.getByLabelText(/Nome/i)).toBeRequired();
    expect(screen.getByLabelText(/E-mail/i)).toBeRequired();
    expect(screen.getByLabelText(/Senha/i)).toBeRequired();
  });

  it("exibe erro para e-mail inválido", async () => {
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "emailinvalido" } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Continuar/i }));
    // O próprio TextField do MUI exibe erro de validação nativa do input type=email
    expect(screen.getByLabelText(/E-mail/i)).toHaveAttribute("type", "email");
    // O formulário não deve avançar para o step "code"
    expect(screen.queryByText(/código de confirmação/i)).not.toBeInTheDocument();
  });

  it("botão fica desabilitado enquanto loading é true", async () => {
    // Mock para simular atraso na resposta
    const mockFetch = fetch as jest.Mock;
    let resolveFetch: any;
    mockFetch.mockImplementationOnce(() => new Promise((resolve) => { resolveFetch = resolve; }));

    render(<Page />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Continuar/i }));

    // Botão deve estar desabilitado enquanto loading
    expect(screen.getByRole("button", { name: /Gerando código/i })).toBeDisabled();

    // Finaliza o fetch
    resolveFetch({ ok: true, json: async () => ({ pendingId: "abc123", code: "654321" }) });
    // Aguarda o step mudar
    expect(await screen.findByText(/código de confirmação/i)).toBeInTheDocument();
  });

  it("exibe erro ao tentar cadastrar com senha fraca", async () => {
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: /Continuar/i }));
    expect(await screen.findByText(/A senha deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
  });

  it("avança para o passo do código ao cadastrar com dados válidos", async () => {
    // Mock da resposta do backend
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pendingId: "abc123", code: "654321" }),
    });

    render(<Page />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Continuar/i }));

    expect(await screen.findByText(/código de confirmação/i)).toBeInTheDocument();
    expect(screen.getByText("654321")).toBeInTheDocument();
  });

  it("exibe erro se código de confirmação for inválido", async () => {
    // Mock do cadastro válido
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pendingId: "abc123", code: "654321" }),
    });
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Continuar/i }));

    // Mock do código inválido
    await waitFor(() => expect(screen.getByText("654321")).toBeInTheDocument());
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Código inválido" }),
    });
    fireEvent.change(screen.getByLabelText(/Código/i), { target: { value: "000000" } });
    fireEvent.click(screen.getByRole("button", { name: /Confirmar cadastro/i }));
    expect(await screen.findByText(/Código inválido/i)).toBeInTheDocument();
  });

  it("volta para o formulário inicial ao clicar em Voltar", async () => {
    // Mock do cadastro válido
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pendingId: "abc123", code: "654321" }),
    }); 
    render(<Page />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "Sara" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "sara@email.com" } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: /Continuar/i }));

    await waitFor(() => expect(screen.getByText("654321")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: /Voltar/i }));
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  });
});