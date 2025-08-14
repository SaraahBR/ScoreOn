# Cenário de Teste: Criação de Conta (criar-conta)

## Objetivo
Garantir que o fluxo de criação de conta funcione corretamente, validando campos obrigatórios, regras de senha, integração com API, feedback de erro, loading e navegação entre etapas.

## Cenários Cobertos

### 1. Não permite cadastro com campos obrigatórios vazios
- Dado que o usuário não preenche nenhum campo
- Quando clica em "Continuar"
- Então o formulário permanece na tela inicial
- E os campos Nome, E-mail e Senha são obrigatórios
- E não avança para o passo do código

### 2. Exibe erro para e-mail inválido
- Dado que o usuário preenche um e-mail inválido
- Quando clica em "Continuar"
- Então o formulário não avança para o passo do código
- E o campo E-mail permanece com tipo "email"

### 3. Botão fica desabilitado enquanto loading é true
- Dado que o usuário preenche todos os campos corretamente
- Quando clica em "Continuar" e a requisição está em andamento
- Então o botão exibe "Gerando código..." e fica desabilitado
- E só habilita novamente após a resposta

### 4. Exibe erro ao tentar cadastrar com senha fraca
- Dado que o usuário preenche uma senha fraca (ex: menos de 8 caracteres)
- Quando clica em "Continuar"
- Então é exibida a mensagem: "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial."

### 5. Avança para o passo do código ao cadastrar com dados válidos
- Dado que o usuário preenche todos os campos corretamente
- Quando clica em "Continuar"
- Então avança para o passo do código de confirmação
- E exibe o código retornado pela API

### 6. Exibe erro se código de confirmação for inválido
- Dado que o usuário está no passo do código
- Quando preenche um código inválido e clica em "Confirmar cadastro"
- Então é exibida a mensagem de erro retornada pela API (ex: "Código inválido")

### 7. Volta para o formulário inicial ao clicar em Voltar
- Dado que o usuário está no passo do código
- Quando clica em "Voltar"
- Então retorna para o formulário inicial de cadastro

## Observações
- Todos os campos do formulário inicial são obrigatórios.
- O botão de submit exibe loading e fica desabilitado durante requisições.
- As mensagens de erro são exibidas usando o componente Alert do MUI.
- O fluxo cobre tanto validações de frontend quanto respostas de erro do backend.
