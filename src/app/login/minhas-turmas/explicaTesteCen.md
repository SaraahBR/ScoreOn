## Cenário de Teste: Cadastro de Turma

### Componente: TurmasPage

O componente `TurmasPage` é responsável por gerenciar o cadastro, edição e exclusão de turmas escolares. Ele apresenta um formulário para inserir o nome e o ano letivo da turma, além de exibir uma tabela com as turmas cadastradas.

#### Estrutura do componente:
- **Formulário de Cadastro:**
  - Campo "Nome da Turma" (input de texto)
  - Campo "Ano Letivo" (input numérico, 4 dígitos)
  - Botão "Cadastrar" (ou "Salvar" ao editar)
- **Tabela de Turmas:**
  - Exibe as turmas cadastradas com colunas para nome, ano letivo e ações (editar/excluir)
  - Mensagem "Nenhuma turma cadastrada." quando não há turmas

### Objetivo dos Testes
Garantir que o fluxo de cadastro de turmas funciona corretamente, cobrindo os seguintes cenários:

#### 1. Cadastro de nova turma
- O usuário preenche o campo "Nome da Turma" e "Ano Letivo" com valores válidos.
- Ao clicar em "Cadastrar", a nova turma deve aparecer na tabela de turmas cadastradas.
- O formulário deve ser limpo após o cadastro.

#### 2. Cadastro inválido (campos vazios)
- Se o usuário tentar cadastrar sem preencher os campos obrigatórios, nenhuma turma deve ser cadastrada.
- A mensagem "Nenhuma turma cadastrada." deve permanecer visível.

### Detalhamento dos Testes Automatizados

#### Teste 1: Cadastro de nova turma
- Renderiza o componente `TurmasPage`.
- Preenche o campo "Nome da Turma" com "Turma Teste".
- Preenche o campo "Ano Letivo" com "2025".
- Clica no botão "Cadastrar".
- Verifica se "Turma Teste" e "2025" aparecem na tabela.
- Garante que o formulário foi limpo (pode ser incrementado).

#### Teste 2: Cadastro inválido
- Renderiza o componente `TurmasPage`.
- Clica no botão "Cadastrar" sem preencher os campos.
- Verifica se a mensagem "Nenhuma turma cadastrada." está visível.

### Observações
- O teste utiliza React Testing Library para simular a interação do usuário.
- O formulário utiliza React Hook Form para controle dos campos.
- O estado das turmas é gerenciado localmente via useState.
- O teste pode ser expandido para cobrir edição e exclusão de turmas, validação de ano letivo, e feedback visual ao usuário.

---

Se novos campos ou regras forem adicionados ao formulário, os testes devem ser atualizados para garantir a cobertura completa do fluxo de cadastro.
