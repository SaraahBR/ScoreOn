# Cenário de Teste: Recuperação de Senha

## Objetivo
Garantir que o fluxo de recuperação de senha funcione corretamente, validando campos obrigatórios, integração com API, feedback de erro, loading e sucesso.

## Cenários Cobertos

### 1. Não permite submit com campos obrigatórios vazios
- Dado que o usuário não preenche nenhum campo
- Quando clica em "Salvar nova senha"
- Então o formulário permanece na tela
- E os campos E-mail, Código de recuperação e Nova senha são obrigatórios
- E não exibe mensagem de sucesso

### 2. Exibe erro para e-mail inválido
- Dado que o usuário preenche um e-mail inválido
- Quando clica em "Salvar nova senha"
- Então o campo E-mail permanece com tipo "email"
- E não exibe mensagem de sucesso

### 3. Exibe erro do backend (ex: código incorreto)
- Dado que o usuário preenche todos os campos corretamente, mas o código está incorreto
- Quando clica em "Salvar nova senha"
- Então é exibida a mensagem de erro retornada pela API (ex: "Código incorreto")

### 4. Exibe mensagem de sucesso ao redefinir senha
- Dado que o usuário preenche todos os campos corretamente
- Quando clica em "Salvar nova senha" e a API retorna sucesso
- Então é exibida a mensagem: "Senha atualizada com sucesso! Já pode fazer login."

### 5. Botão fica desabilitado enquanto loading
- Dado que o usuário preenche todos os campos corretamente
- Quando clica em "Salvar nova senha" e a requisição está em andamento
- Então o botão exibe "Salvando..." e fica desabilitado
- E só habilita novamente após a resposta

## Observações
- Todos os campos do formulário são obrigatórios.
- O botão de submit exibe loading e fica desabilitado durante requisições.
- As mensagens de erro e sucesso são exibidas usando o componente Alert do MUI.
- O fluxo cobre tanto validações de frontend quanto respostas de erro do backend.
