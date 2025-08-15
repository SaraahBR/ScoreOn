# 🧮 ScoreOn

ScoreOn é um **Sistema de Controle de Notas** moderno, acessível e multilíngue (pt-BR, en, es) construído com **Next.js (App Router)**, **React 19**, **TypeScript** e **Material UI**.  
Ele centraliza turmas, alunos, avaliações, lançamento de notas, médias, filtros por bimestre e exportações — com autenticação segura e deploy na Vercel.


<p align="center">
  <img src="public/logo.png" alt="Logo ScoreOn" width="500" />
</p>


---

## 📚 Sumário
- [🚀 Tecnologias](#-tecnologias)
- [🧩 Principais Recursos](#-principais-recursos)
- [🧱 Estrutura de Pastas](#-estrutura-de-pastas)
- [🌍 Internacionalização (i18n)](#-internacionalização-i18n)
- [🔐 Autenticação](#-autenticação)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [📡 API — Visão Geral](#-api--visão-geral)
  - [🔑 API — Autenticação & Cadastro](#-api--autenticação--cadastro)
  - [🎓 API — Gestão Acadêmica](#-api--gestão-acadêmica)
  - [👤 API — Perfil & Avatar](#-api--perfil--avatar)
  - [✅ Convenções de API](#-convenções-de-api)
- [🖼️ UI — Componentes](#️-ui--componentes)
- [📄 Páginas](#-páginas)
- [🎨 Tema, Providers, Globais & Home](#-tema-providers-globais--home)
- [🧪 Testes](#-testes)
- [⚙️ Variáveis de Ambiente](#️-variáveis-de-ambiente)
- [💻 Como Rodar Localmente](#-como-rodar-localmente)
- [☁️ Deploy](#️-deploy)
- [🗺️ Mapeamento Rápido: Páginas ↔ API](#️-mapeamento-rápido-páginas--api)
- [🗣️ Traduções em Destaque](#️-traduções-em-destaque)
- [🛡️ Segurança & Produção](#️-segurança--produção)
- [👩‍💻 Autoria](#-autoria)
- [📜 Licença](#-licença)

---

## 🚀 Tecnologias

- **Next.js 15 (App Router)** e **React 19**
- **TypeScript**
- **Material UI (MUI)** para UI
- **i18next** + **react-i18next** para internacionalização (pt, en, es)
- **NextAuth.js** (Login com Google e credenciais)
- **Vercel Postgres** para persistência
- **Recharts** para gráficos (SSR-safe com `next/dynamic`)
- **Jest** + **Testing Library** para testes
- **Vercel** para deploy contínuo

---

## 🧩 Principais recursos

- Cadastro e gestão de **turmas** e **alunos**
- **Avaliações** com peso, **bimestre/termo** e cálculo automático de **médias**
- **Lançamento de notas** com validações e feedback visual
- **Relatórios** e **exportação CSV** (matriz e resumo)
- **Gráficos** de desempenho por aluno
- **Filtros por período**: Geral, Todos e 1º–4º Bimestres
- **Perfil do usuário** com upload/remoção de avatar
- **Traduções** completas (pt, en, es) e textos de UI/erros/sucessos
- **Autenticação** via NextAuth (inclui Google OAuth)
- **API Routes** tipadas e seguras

---

## 🧱 Estrutura de pastas

```bash
scoreon/
├── public/                                 # Arquivos estáticos acessíveis publicamente
│   ├── favicon.ico                         # Ícone exibido na aba do navegador
│   ├── logo.png                            # Logo principal do sistema
│   ├── Gabriela.webp                       # Imagem de membro da equipe
│   ├── Sara.webp                           # Imagem de membro da equipe
│   ├── Sarah.webp                          # Imagem de membro da equipe
│   ├── flags/                              # Bandeiras usadas na troca de idioma 
│   └── locales/                            # Arquivos de tradução i18n
│       ├── en/common.json                  # Traduções para inglês
│       ├── es/common.json                  # Traduções para espanhol
│       └── pt/common.json                  # Traduções para português
├── src/                                    # Código-fonte da aplicação
│   ├── app/                                # Rotas e componentes do App Router do Next.js
│   │   ├── globals.css                     # Estilos globais aplicados em toda a aplicação
│   │   ├── layout.tsx                      # Layout base compartilhado entre páginas
│   │   ├── NoSSR.tsx                       # Componente que desabilita renderização no servidor
│   │   ├── ClientProviders.tsx             # Fornece contexto global (ex.: autenticação, tema)
│   │   ├── page.tsx                        # Página inicial (Home)
│   │   ├── components/                     # Componentes reutilizáveis
│   │   │   ├── features/                   # Sessão de destaques/funcionalidades (Features.tsx)
│   │   │   ├── footer/                     # Rodapé da aplicação (Footer.tsx)
│   │   │   ├── hero/                       # Sessão de destaque inicial (Hero.tsx)
│   │   │   └── navbar/                     # Barra de navegação (NavBar.tsx)
│   │   ├── contato/                        # Página "Fale Conosco"
│   │   │   ├── page.tsx                    # Página de contato
│   │   │   └── FaleConosco.module.css      # Estilo exclusivo da página de contato
│   │   ├── documentacao/                   # Página de documentação
│   │   │   ├── page.tsx                    # Conteúdo da documentação
│   │   │   └── Documentacao.module.css     # Estilo exclusivo da documentação
│   │   ├── exemplos/                       # Página de exemplos de uso
│   │   │   ├── page.tsx                    # Página de exemplos
│   │   │   └── Exemplos.module.css         # Estilo exclusivo da página de exemplos
│   │   ├── quem-somos/                     # Página "Quem Somos"
│   │   │   └── page.tsx                    # Conteúdo sobre a equipe/projeto
│   │   ├── login/                          # Páginas e componentes de autenticação
│   │   │   ├── page.tsx                    # Tela principal de login
│   │   │   ├── LanguageMenu.tsx            # Menu de seleção de idioma
│   │   │   ├── profilemenu.tsx             # Menu do perfil do usuário
│   │   │   ├── criar-conta/                # Fluxo de criação de conta
│   │   │   │   ├── page.tsx                # Formulário de cadastro
│   │   │   │   ├── criar-conta.test.tsx    # Testes da página de cadastro
│   │   │   │   └── explicaTesteCen.md      # Explicação sobre os testes
│   │   │   ├── esqueci-senha/              # Fluxo de recuperação de senha
│   │   │   │   ├── page.tsx                # Página de "Esqueci minha senha"
│   │   │   │   ├── esqueci-senha.test.tsx  # Testes da página de recuperação
│   │   │   │   └── explicaTesteCen.md      # Explicação sobre os testes
│   │   │   ├── minhas-turmas/              # Gestão de turmas do professor
│   │   │   │   ├── page.tsx                # Página principal de turmas
│   │   │   │   ├── page.test.tsx           # Testes da página de turmas
│   │   │   │   ├── Turmas.module.css       # Estilo exclusivo da página
│   │   │   │   └── explicaTesteCen.md      # Explicação sobre os testes
│   │   │   ├── meus-alunos/                # Lista e gestão de alunos
│   │   │   │   ├── page.tsx                # Página de alunos
│   │   │   │   └── MeusAlunos.module.css   # Estilo exclusivo da página
│   │   │   ├── minha-conta/                # Configurações de conta
│   │   │   │   └── page.tsx                # Página de perfil e ajustes
│   │   │   ├── notas-avaliacoes/           # Lançamento e visualização de notas
│   │   │   │   └── page.tsx                # Página de gestão de avaliações
│   │   │   └── reset/                      # Fluxo de redefinição de senha
│   │   │       ├── page.tsx                # Página principal de redefinição
│   │   │       └── reset-form.tsx          # Formulário de redefinição
│   │   ├── api/                            # Rotas de API do Next.js (Back-end)
│   │   │   ├── assessments/route.ts        # API para avaliações
│   │   │   ├── classes/route.ts            # API para turmas
│   │   │   ├── grades/route.ts             # API para notas
│   │   │   ├── students/route.ts           # API para alunos
│   │   │   ├── user/                       # APIs relacionadas ao usuário
│   │   │   │   ├── avatar/route.ts         # Upload e atualização de avatar
│   │   │   │   └── profile/route.ts        # Gestão de dados do perfil
│   │   │   └── auth/                       # APIs de autenticação
│   │   │       ├── [...nextauth]/route.ts  # Configuração do NextAuth
│   │   │       ├── register/               # Registro de usuário
│   │   │       │   ├── start/route.ts      # Início do registro
│   │   │       │   └── confirm/route.ts    # Confirmação de registro
│   │   │       └── reset/                  # Redefinição de senha
│   │   │           ├── by-code/route.ts    # Redefinição via código
│   │   │           └── confirm/route.ts    # Confirmação de nova senha
│   │   ├── theme/                          # Tema do Material UI
│   │   │   └── theme.ts                    # Configuração de cores e estilos
│   ├── i18n/                               # Configuração de internacionalização
│   │   ├── formatters.ts                   # Formatações de datas, números, etc.
│   │   ├── I18nProvider.tsx                # Provider que carrega o i18n
│   │   └── index.ts                        # Inicialização do i18n
│   └── lib/                                # Funções utilitárias e serviços
│       ├── auth.ts                         # Funções de autenticação
│       └── user-repo.ts                    # Operações de banco para usuários
├── .env.local                              # Variáveis de ambiente locais
├── jest.config.ts                          # Configuração de testes com Jest
├── next.config.ts                          # Configurações do Next.js
├── package.json                            # Dependências e scripts do projeto
├── postcss.config.mjs                      # Configuração do PostCSS
├── tsconfig.json                           # Configuração do TypeScript
└── README.md                               # Documentação inicial do projeto
```

---

## 🌍 Internacionalização (i18n)

- Arquivos de tradução: `public/locales/{pt|en|es}/common.json`
- Chaves cobrem toda a UI, inclusive página de **Notas e Avaliações**:
  - `gradesPage.term.label` → “Período/Etapa”
  - `gradesPage.term.filter` → “Filtrar por”  
  - Bimestres:  
    - **pt**: `"1º Bimestre"`, `"2º"`, `"3º"`, `"4º"`  
    - **en**: `"1st Bimester"`, `"2nd"`, `"3rd"`, `"4th"`  
    - **es**: `"1.º Bimestre"`, `"2.º"`, `"3.º"`, `"4.º"`  
- Exemplo de uso no código:
  ```tsx
  const { t } = useTranslation("common");
  <InputLabel>{t("gradesPage.term.filter")}</InputLabel>
  ```
- `I18nProvider.tsx` fornece o contexto para Client Components.
- `formatters.ts` centraliza formatações (datas/números) coerentes por idioma.
- **Componente LanguageMenu (`src/app/login/LanguageMenu.tsx`)**  
  Alterna `pt`, `en` e `es` usando i18n, persiste em `localStorage`/cookie `i18next` e atualiza `document.documentElement.lang` (`pt-BR` para PT).  
  **Teste sugerido:** clicar em EN altera `i18n.language==="en"` e `documentElement.lang==="en"`.

---

## 🔐 Autenticação

- **NextAuth** com rotas em `src/app/api/auth/[...nextauth]/route.ts`
- Suporte a **Google OAuth** e credenciais
- Fluxo de **cadastro com código**:
  - `POST /api/auth/register/start` inicia cadastro e emite um código
  - `POST /api/auth/register/confirm` confirma o cadastro com `{ pendingId, code }`
  - Função `pickLang()` infere idioma por `Accept-Language` e define `content-language` na resposta
- **Página de Login (`src/app/login/page.tsx`)**  
  Usa `signIn('credentials')`, possui botão Google, link para **Esqueci a senha**, CTA **Criar conta**, rótulos traduzidos, bloqueio durante `loading`.  
- **Menu de Perfil (`src/app/login/profilemenu.tsx`)**  
  Mostra avatar/nome quando autenticado, com opções (Minha Conta, Minhas Turmas, etc.) e **Sair/Entrar**. Usa `aria-*` e `Tooltip`.  
  **Testes sugeridos:** itens por estado da sessão, abrir/fechar menu, chamar `signOut`.

---

## 🗄️ Banco de dados

- **Vercel Postgres** (via `@vercel/postgres`)
- Tabelas usadas nas rotas listadas (turmas, alunos, avaliações, notas, usuário)
- Exemplo (assessments): campos `id`, `user_email`, `class_id`, `name`, `weight`, `term`, `created_at`

---

## 📦 Vercel Blob Storage

O **Vercel Blob Storage** é um serviço de armazenamento de objetos oferecido pela **Vercel**, utilizado para armazenar arquivos binários e conteúdos não estruturados como imagens, documentos e vídeos. Ele oferece alta disponibilidade, URLs públicas e assinadas, além de integração nativa com aplicações hospedadas na Vercel.

### 🔹 Por que foi usado no projeto
No **ScoreOn**, o Vercel Blob Storage foi adotado para:
- Armazenar **imagens de perfil** dos usuários de forma segura e escalável.
- Permitir **uploads** de documentos e materiais de apoio (ex.: PDFs, slides, trabalhos escolares).
- Garantir alta performance no acesso aos arquivos, com distribuição global e URLs públicas/privadas.
- Evitar a necessidade de configurar e manter um serviço de storage separado (como AWS S3 ou Google Cloud Storage).

Essa abordagem reduziu a complexidade de configuração e manteve a aplicação mais enxuta, integrando o armazenamento de arquivos diretamente no ambiente da Vercel.

---

## 📡 API — Visão Geral

### `GET /api/assessments?email=&classId=`
Retorna avaliações da turma do usuário, incluindo `term` (bimestre/geral).  
**200** `{ ok:true, items:[{ id, name, class_id, weight, term }] }`

### `POST /api/assessments`
Body: `{ email, class_id, name, weight?, term? }`  
Valida peso `> 0`, padrão `term="Geral"`.  
**200** `{ ok:true, item }` • **404** `class_not_found` • **400** `invalid_weight|missing_fields`

### `PUT /api/assessments`
Body: `{ email, id, name?, weight?, term? }`  
Atualiza campos informados; normaliza `weight` com vírgula ou ponto.  
**200** `{ ok:true, item }` • **404** `not_found`

### `DELETE /api/assessments?id=&email=`
Remove avaliação do usuário.  
**200** `{ ok:true }` • **404** `not_found`

> Outras rotas visíveis nas capturas: **classes**, **students**, **grades**, **user/avatar**, **user/profile**, **auth**.

### 🔑 API — Autenticação & Cadastro

#### `POST /api/auth/register/start`
Inicia o processo de cadastro de usuário:
- **Body**: `{ name, email, password }`
- Valida campos obrigatórios e verifica se o e-mail já existe.
- Cria um registro pendente com `pendingId`, `code` e `expiresIn`.
- **Erros**: `invalid_data` (400), `email_in_use` (409)

#### `POST /api/auth/register/confirm`
Confirma o cadastro pendente com código:
- **Body**: `{ pendingId, code }`
- Valida existência, expiração e tentativa de confirmação.
- **Erros**: `invalid_data` (400), `not_found` (404), `expired` (410), `mismatch` (400), `too_many_attempts` (429)

#### `POST /api/auth/reset/by-code`
Redefine senha usando código de recuperação:
- **Body**: `{ email, code, password }`
- **Erros**: `invalid_data` (400), `not_found` (404), `mismatch` (400)

> **Reset por token (UI):**  
> `src/app/login/reset/page.tsx` e `reset-form.tsx` consomem `POST /api/auth/reset/confirm` com `{ token, password }`.  
> Estados: `loading` desabilita botão; feedback por alert (sugestão: `<Alert/>`).  
> **Boas práticas:** validar força da senha; token com expiração curta; evitar logs do token.

### 🎓 API — Gestão Acadêmica

#### Turmas
- **GET** `/api/classes?email=` → Lista turmas do usuário.
- **POST** `/api/classes` Body `{ email, name, school_year }` → Cria turma.
- **PUT** `/api/classes` Body `{ email, id, name, school_year }` → Atualiza.
- **DELETE** `/api/classes?id=&email=` → Remove turma do usuário.  
**Erros comuns**: `missing_fields` (400), `not_found` (404)

#### Alunos
- **GET** `/api/students?email=&classId=optional` → Lista alunos, globalmente ou filtrado por turma.
- **POST** `/api/students` Body `{ email, name, registration, class_id }` → Cria aluno (valida turma).
- **PUT** `/api/students` Body `{ email, id, name, registration }` → Atualiza.
- **DELETE** `/api/students?id=&email=` → Remove aluno.

#### Avaliações & Notas
- **GET** `/api/assessments?email=&classId=` → Lista avaliações (inclui `term`: *Geral* ou bimestre).  
- **POST** `/api/assessments` Body `{ email, class_id, name, weight?, term? }` → Cria avaliação (peso > 0, normalização vírgula/ponto).  
- **PUT** `/api/assessments` Body `{ email, id, name?, weight?, term? }` → Atualiza campos informados.  
- **DELETE** `/api/assessments?id=&email=` → Exclui avaliação.  
- **GET** `/api/grades?email=&classId=` → `{ assessment_id, student_id, value }`.  
- **POST** `/api/grades` Body `{ email, assessment_id, student_id, value }` → *Upsert* (valida turma comum).  
- **DELETE** `/api/grades?email=&assessmentId=&studentId=` → Remove nota.

### 👤 API — Perfil & Avatar

#### Perfil
- **GET** `/api/user/profile?email=` → Retorna dados do perfil (ou shape padrão).
- **POST** `/api/user/profile` → *Upsert* completo de `name, cpf, sex, birthdate, address, neighborhood, city, state, cep, phone` (conflitos resolvidos com `on conflict`).

#### Avatar (Vercel Blob + Postgres)
- **POST** `/api/user/avatar?cleanup=1`
  - Salvar: `{ email, imageDataUrl }`
  - Remover: `{ email, imageDataUrl: null }`
- Regras: PNG/JPEG/WEBP/GIF; **até 5MB**; exige `BLOB_READ_WRITE_TOKEN`; `cleanup=1` apaga o blob antigo.
- Erros: `email_required`, `invalid_image_format`, `image_corrupted`, `image_too_large`, `missing_blob_token`, `save_image_error`.

### ✅ Convenções de API

- `content-type: application/json; charset=utf-8`, `cache-control: no-store`.
- Erros **semânticos** e internacionalizados (ver `public/locales/*/common.json`).
- Consultas garantem escopo do **usuário atual** via `user_email` nas tabelas.
- **Idiomas nas APIs:** função `pickLang()` detecta `pt|en|es` via `Accept-Language` e retorna `content-language` apropriado.

---

## 🖼️ UI — Componentes

### Features
Renderiza cards com ícone, título e descrição (i18n).  
Arquivos: `Features.tsx`, `Features.module.css`, `Features.test.tsx`, `explicaTesteCen.md`.  
**Testes:** títulos/descrições, quantidade de cards, ícones SVG.

### Footer
Logo + links + redes sociais + copyright dinâmico.  
Arquivos: `Footer.tsx`, `Footer.module.css`.

### Header
Cabeçalho semântico com `h1` e subtítulo por chaves.  
Arquivos: `Header.tsx`, `Header.module.css`.

### Hero
Seção de destaque com CTAs (Criar turma / Ver exemplos).  
Arquivos: `Hero.tsx`, `Hero.module.css`.

### NavBar
AppBar com ProfileMenu, seletor de idioma (bandeiras) e Drawer mobile.  
Arquivos: `NavBar.tsx`, `NavBar.module.css`, `NavBar.test.tsx`, `explicaTesteCen.md`.  
**A11y:** `aria-label` em botões; navegação com roles adequados.  
**Teste:** troca de idioma altera textos (i18n em memória).

---

## 📄 Páginas

### Contato (`/contato`)
Layout 2 colunas (sidebar + formulário). Mapa via `iframe`.  
i18n: `contactPage.sidebar.*`, `contactPage.form.*`.  
Arquivos: `src/app/contato/page.tsx`, `FaleConosco.module.css`.

### Documentação (`/documentacao`)
Guia com título, introdução, 5 passos e FAQ; conteúdo via i18n com HTML controlado.  
Arquivos: `src/app/documentacao/page.tsx`, `Documentacao.module.css`.

### Exemplos (`/exemplos`)
Introdução + 4 passos (Cadastrar Turma, Adicionar Alunos, Lançar Notas, Gerar Relatórios) + dicas rápidas.  
Arquivos: `src/app/exemplos/page.tsx`, `Exemplos.module.css`.

### Quem Somos (`/quem-somos`)
Páginas institucional com cards de missão/valores/equipe e animações de entrada.  
Traduções esperadas:  
```
common.about.title, intro, sections.mission.*, sections.values.*, sections.team.*,
team.{gabriela|sara|sarah}.{name,role,desc}, team_title
```

### Minha Conta (`/login/minha-conta`)
Perfil e avatar (preview, salvar, remover). Feedback com `Backdrop + Snackbar`.  
APIs: `/api/user/profile` (GET/POST), `/api/user/avatar` (POST).

### Minhas Turmas (`/login/minhas-turmas`)
CRUD de turmas (form + tabela). Valida ano letivo (4 dígitos).  
APIs: `/api/classes` (GET/POST/PUT/DELETE).  
**Teste:** fluxo criar/editar/excluir, validação de ano.

### Meus Alunos (`/login/meus-alunos`)
Seleciona turma, lista e CRUD de alunos; máscara de matrícula (só dígitos, máx. 9).  
APIs: `/api/students` (GET/POST/PUT/DELETE), `/api/classes` (GET).

### Notas e Avaliações (`/login/notas-avaliacoes`)
Cria avaliações, lança notas, calcula médias ponderadas, filtra por período, exporta CSV e exibe gráficos (Recharts com `next/dynamic`).  
APIs: `classes`, `students`, `assessments`, `grades`.  
Destaques: normalização vírgula/ponto; debounce 800ms; clamping `[0,10]`; exports **Matriz/Resumo**.

### Login (`/login`)
Credenciais + Google OAuth; loading e mensagens traduzidas.  
Arquivo: `src/app/login/page.tsx`.

### Reset por Token (`/login/reset`)
Lê `token` via `useSearchParams` (ou prop de `ResetForm`), envia para `/api/auth/reset/confirm`.  
Arquivos: `src/app/login/reset/page.tsx`, `reset-form.tsx`.  
Boas práticas: validação de força da senha; token assinado com expiração.

---

## 🎨 Tema, Providers, Globais & Home

### Tema MUI (`src/app/theme/theme.ts`)
Paleta dourado/pérola; overrides para `MuiButton`, `MuiTextField`, `MuiLink` (cores de foco/hover, bordas, transições).

### Client Providers (`src/app/ClientProviders.tsx`)
Empacota `SessionProvider` (NextAuth), `I18nProvider` e `ThemeProvider` (MUI) + `CssBaseline`.

### Globais & Layout
- `globals.css`: variáveis (sand/graphite), layout `100vh` com footer colado.
- `layout.tsx`: lê cookie `i18next` para `<html lang>`, envolve com `<NoSSR>` e rende **Navbar**, `<main id="site-main">`, **Footer**.
- `NoSSR.tsx`: wrapper via `next/dynamic` (`ssr:false`).

### Home (`src/app/page.tsx`)
Hero + Features, benefícios, bloco institucional e carrossel de depoimentos com animação contínua e paleta dinâmica. i18n: `landing.*`, `homePage.*`.

---

## 🧪 Testes

- **Jest** + **@testing-library/react** + **@testing-library/jest-dom**
- Exemplos em `*.test.tsx` (Navbar, Features, páginas de login/cadastro/esqueci-senha/turmas)
- **Estratégia (resumo):**
  - Queries acessíveis (`getByRole`, `getByLabelText`, `getByText`)
  - Mock de dependências pesadas (auth, imagens, media queries)
  - Given/When/Then documentado em `explicaTesteCen.md` nos módulos
- **Scripts:**
  ```bash
  npm test
  ```

---

## ⚙️ Variáveis de ambiente

Crie `.env.local`:

```ini
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uma_chave_secreta_bem_grande

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Vercel Postgres
POSTGRES_URL=postgres://user:pass@host:5432/db
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...

# Vercel Blob (avatar)
BLOB_READ_WRITE_TOKEN=...
```

> Em produção, configure os mesmos valores no painel da Vercel.

---

## 💻 Como rodar localmente

```bash
# 1) Instalar dependências
npm install

# 2) Variáveis de ambiente
# crie e preencha .env.local (ver seção acima)

# 3) Rodar em desenvolvimento
npm run dev

# 4) Acessar
http://localhost:3000
```

---

## ☁️ Deploy

- Deploy automático na **Vercel**.
- Cada push na `main` dispara build e preview/produção conforme configuração.
- Banco de dados recomendado: **Vercel Postgres**.

---

## 🗺️ Mapeamento Rápido: Páginas ↔ API

| Página | Rotas |
|---|---|
| Minha Conta | `/api/user/profile` (GET/POST), `/api/user/avatar` (POST) |
| Minhas Turmas | `/api/classes` (GET/POST/PUT/DELETE) |
| Meus Alunos | `/api/students` (GET/POST/PUT/DELETE) |
| Notas e Avaliações | `/api/assessments` (GET/POST/PUT/DELETE), `/api/grades` (GET/POST) |
| Autenticação | `/api/auth/register/start`, `/api/auth/register/confirm`, `/api/auth/reset/by-code` |

---

## 🛡️ Segurança & Produção

- **Tokens de reset:** trafegam apenas no corpo do POST; evite logs do token; expiração curta e uso one‑time.
- **Cookies/LocalStorage:** `i18nextLng` é público; não salve dados sensíveis no `localStorage`.
- **Alertas vs toasts:** prefira `<Alert/>`/Snackbar a `alert()` bloqueante.
- **Atributo `lang`:** aplicado em NavBar/LanguageMenu; importante para leitores de tela/SEO.
- **Checklist rápido:**
  - [ ] Hash de senhas e **códigos** (recovery) com expiração
  - [ ] Rate‑limit e logs em rotas de auth
  - [ ] CSRF em operações sensíveis (se aplicável)
  - [ ] Headers de segurança (CSP mínima, `X-Frame-Options`, etc.)
  - [ ] Sanitização onde há `dangerouslySetInnerHTML`
  - [ ] i18n preloaded no servidor (se migrar para SSR) para evitar FOUC

---

## 👩‍💻 Autoria

Desenvolvido por **Sarah Hernandes, Gabriela Anjos e Sara Sales**.  
Projeto educacional, com foco em acessibilidade, usabilidade e impacto na gestão escolar.

<p align="center">
  <img src="public/quem-somos.png" alt="Quem Somos" width="700" />
</p>


---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte `LICENSE`.
