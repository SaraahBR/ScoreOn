# 🧮 ScoreOn

ScoreOn é um **Sistema de Controle de Notas** moderno, acessível e multilíngue (pt-BR, en, es) construído com **Next.js (App Router)**, **React 19**, **TypeScript** e **Material UI**.  
Ele centraliza turmas, alunos, avaliações, lançamento de notas, médias, filtros por bimestre e exportações — com autenticação segura e deploy na Vercel.


<p align="center">
  <img src="public/logo.png" alt="Logo ScoreOn" width="300" />
</p>

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
├── public/
│   ├── flags/                   # Bandeiras (br.webp, es.webp, us.webp)
│   └── locales/                 # i18n (pt, en, es)
│       ├── en/common.json
│       ├── es/common.json
│       └── pt/common.json
├── src/
│   └── app/
│       ├── api/
│       │   ├── assessments/route.ts        # CRUD de avaliações
│       │   ├── classes/route.ts            # CRUD de turmas  (listado nas capturas)
│       │   ├── grades/route.ts             # Lançamento/consulta de notas (listado)
│       │   ├── students/route.ts           # CRUD de alunos  (listado)
│       │   ├── user/
│       │   │   ├── avatar/route.ts         # Upload/remoção de foto
│       │   │   └── profile/route.ts        # Dados de perfil
│       │   └── auth/
│       │       ├── [...nextauth]/route.ts  # NextAuth (GET/POST)
│       │       └── register/
│       │           ├── start/route.ts      # Início de cadastro (listado)
│       │           └── confirm/route.ts    # Confirmação por código
│       ├── components/
│       │   ├── features/                   # Cards de funcionalidades
│       │   ├── footer/                     # Rodapé
│       │   ├── header/                     # Cabeçalho
│       │   ├── hero/                       # Hero section
│       │   └── navbar/                     # Navbar + menu de perfil
│       ├── contato/page.tsx                # Página “Fale conosco”
│       ├── documentacao/page.tsx           # Documentação guiada (listado)
│       ├── exemplos/page.tsx               # Exemplos de uso
│       ├── login/
│       │   ├── criar-conta/page.tsx
│       │   ├── esqueci-senha/page.tsx
│       │   ├── meus-alunos/page.tsx
│       │   ├── minhas-turmas/page.tsx
│       │   ├── notas-avaliacoes/page.tsx
│       │   ├── minha-conta/page.tsx
│       │   ├── quem-somos/page.tsx
│       │   └── reset/                       # Fluxo de reset
│       │       ├── page.tsx
│       │       └── reset-form.tsx
│       ├── theme/                           # Tema MUI e helpers de SSR
│       │   ├── theme.ts
│       │   ├── ClientProviders.tsx
│       │   └── NoSSR.tsx
│       ├── i18n/                            # Infra de tradução
│       │   ├── formatters.ts                # Ex.: formatação de datas/números
│       │   ├── i18nProvider.tsx             # Provider de i18n para Client Components
│       │   └── index.ts                     # Inicialização do i18next
│       ├── lib/
│       │   ├── auth.ts                      # `authOptions` do NextAuth
│       │   └── user-repo.ts                 # Regras de cadastro/confirm
│       ├── layout.tsx
│       └── page.tsx
├── .env.local
├── jest.config.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

> Observação: alguns caminhos aparecem nas capturas compartilhadas e podem variar conforme o progresso do projeto.

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
- `i18nProvider.tsx` fornece o contexto para Client Components.
- `formatters.ts` centraliza formatações (datas/números) coerentes por idioma.

---

## 🔐 Autenticação

- **NextAuth** com rotas em `src/app/api/auth/[...nextauth]/route.ts`
- Suporte a **Google OAuth** e credenciais
- Fluxo de **cadastro com código**:
  - `POST /api/auth/register/start` inicia cadastro e emite um código
  - `POST /api/auth/register/confirm` confirma o cadastro com `{ pendingId, code }`
  - Função `pickLang()` infere idioma por `Accept-Language` e define `content-language` na resposta

---

## 🗄️ Banco de dados

- **Vercel Postgres** (via `@vercel/postgres`)
- Tabelas usadas nas rotas listadas (turmas, alunos, avaliações, notas, usuário)
- Exemplo (assessments): campos `id`, `user_email`, `class_id`, `name`, `weight`, `term`, `created_at`

---

## 📡 API principal

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

---

## 🧪 Testes

- **Jest** + **@testing-library/react** + **@testing-library/jest-dom**
- Exemplos de testes em `*.test.tsx` nos componentes (Navbar, Features etc.)
- Scripts:
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

## 🗺️ Traduções em destaque

- **“Bimestre”**
  - pt: *Bimestre*
  - en: *Bimester* (ou *two-month period* em contextos não acadêmicos)
  - es: *Bimestre*
- **“Filtrar por”**
  - pt: *Filtrar por*
  - en: *Filter by*
  - es: *Filtrar por*

As chaves de UI correspondentes já estão definidas em `public/locales/*/common.json`.

---

## 👩‍💻 Autoria

Desenvolvido por **Sarah Hernandes** e colaboradoras/es.  
Projeto educacional, com foco em acessibilidade, usabilidade e impacto na gestão escolar.

---

## 📜 Licença

Distribuído sob a licença MIT. Consulte `LICENSE`.


---

## 📡 Rotas adicionais da API

### 🔑 Autenticação e Cadastro

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

---

### 🎓 Gestão de Turmas

#### `GET /api/classes?email=...`
Lista turmas do usuário.

#### `POST /api/classes`
Cria nova turma:
- **Body**: `{ email, name, school_year }`

#### `PUT /api/classes`
Atualiza turma existente:
- **Body**: `{ email, id, name, school_year }`

#### `DELETE /api/classes?id=...&email=...`
Remove turma.

**Erros comuns**: `missing_fields` (400), `not_found` (404)

---

### 🧑‍🎓 Gestão de Alunos

#### `GET /api/students?email=...&classId=optional`
Lista alunos do usuário, podendo filtrar por turma.

#### `POST /api/students`
Adiciona aluno a uma turma:
- **Body**: `{ email, name, registration, class_id }`
- **Erros**: `class_not_found` (404)

#### `PUT /api/students`
Atualiza dados do aluno.

#### `DELETE /api/students?id=...&email=...`
Remove aluno.

---

### 📝 Notas e Avaliações

#### `GET /api/grades?email=...&classId=...`
Lista notas por avaliação/aluno.

#### `POST /api/grades`
Adiciona ou atualiza nota:
- **Body**: `{ email, assessment_id, student_id, value }`
- **Valida**: existência de avaliação/aluno, correspondência de turma.

#### `DELETE /api/grades?email=...&assessmentId=...&studentId=...`
Remove nota.

**Erros**: `missing_fields`, `assessment_not_found`, `student_not_found`, `class_mismatch`

---

### 👤 Perfil e Avatar

#### `GET /api/user/profile?email=...`
Retorna dados completos do perfil.

#### `POST /api/user/profile`
Cria/atualiza dados do perfil.

#### `POST /api/user/avatar?cleanup=1`
Define ou remove avatar do usuário:
- **Body**: `{ email, imageDataUrl }`
- Aceita PNG, JPEG, WEBP, GIF
- Limite: 5MB
- Usa **Vercel Blob Storage** e Postgres
- `cleanup=1` remove avatar anterior antes de salvar novo.

**Erros**: `email_required`, `invalid_image_format`, `image_corrupted`, `image_too_large`, `missing_blob_token`, `save_image_error`

---

## 🌐 Idiomas nas APIs
Todas as rotas utilizam a função `pickLang()` para detectar o idioma (`pt`, `en`, `es`) via cabeçalho `Accept-Language` e retornam `content-language` apropriado.

---

## 🔐 Fluxos de Autenticação & Cadastro

### Registro com código (2 etapas)

- **POST `/api/auth/register/start`**  
  Inicia o cadastro, validando se o e‑mail já existe e retornando um identificador temporário e **código de confirmação**.  
  Body:
  ```json
  { "name": "Alice", "email": "alice@school.edu", "password": "Str0ng!Pass" }
  ```
  Resposta `200`:
  ```json
  { "ok": true, "pendingId": "uuid", "code": "123456", "expiresIn": 900, "lang": "pt" }
  ```
  Erros: `invalid_data (400)`, `email_in_use (409)`.

- **POST `/api/auth/register/confirm`**  
  Confirma o cadastro usando `{ pendingId, code }`. Define `content-language` conforme `Accept-Language` via `pickLang()`.
  Erros tratados com mapeamento de status: `invalid_data (400)`, `not_found (404)`, `expired (410)`, `mismatch (400)`, `too_many_attempts (429)`.

### Reset de senha por código

- **POST `/api/auth/reset/by-code`**  
  Redefine a senha com `{ email, code, password }`. A senha é armazenada com **bcryptjs (salt 10)**.  
  Erros: `invalid_data (400)`, `not_found (404)`, `mismatch (400)`.

> Todas as respostas das rotas acima incluem `content-language` coerente (`pt|en|es`).

---

## 👩‍🏫 Gestão Acadêmica — REST API

### Turmas
- **GET `/api/classes?email=`** → Lista turmas do usuário, ordenadas por criação.
- **POST `/api/classes`** Body `{ email, name, school_year }` → Cria turma.
- **PUT `/api/classes`** Body `{ email, id, name, school_year }` → Atualiza.
- **DELETE `/api/classes?id=&email=`** → Remove turma do usuário.

### Alunos
- **GET `/api/students?email=&classId=optional`** → Lista alunos, globalmente ou filtrado por turma.
- **POST `/api/students`** Body `{ email, name, registration, class_id }` → Cria aluno (valida existência da turma do usuário).
- **PUT `/api/students`** Body `{ email, id, name, registration }` → Atualiza aluno.
- **DELETE `/api/students?id=&email=`** → Remove aluno.

### Avaliações & Notas
- **GET `/api/assessments?email=&classId=`** → Lista avaliações (inclui `term`: *Geral* ou bimestre).  
- **POST `/api/assessments`** Body `{ email, class_id, name, weight?, term? }` → Cria avaliação.  
  - `weight` normalizado e **> 0** (default `1`).  
  - Garante propriedade da turma pelo `user_email`.
- **PUT `/api/assessments`** Body `{ email, id, name?, weight?, term? }` → Atualiza somente campos informados (suporta vírgula/ponto em `weight`).  
- **DELETE `/api/assessments?id=&email=`** → Exclui avaliação do usuário.

- **GET `/api/grades?email=&classId=`** → Retorna grades como `{ assessment_id, student_id, value }` (string).
- **POST `/api/grades`** Body `{ email, assessment_id, student_id, value }` → *Upsert* da nota.  
  - Valida que **avaliação** e **aluno** pertencem à **mesma turma** do usuário.  
  - Conflitos resolvidos com `on conflict (...) do update`.
- **DELETE `/api/grades?email=&assessmentId=&studentId=`** → Remove nota específica.

---

## 🖼️ Avatar do Usuário (Vercel Blob + Postgres)

**POST `/api/user/avatar?cleanup=1`**  
Gerencia a foto de perfil com upload público no **Vercel Blob** e `avatar_url` no Postgres.

- Body para salvar:
  ```json
  { "email": "user@school.edu", "imageDataUrl": "data:image/png;base64,..." }
  ```
- Body para remover (sem imagem):  
  ```json
  { "email": "user@school.edu", "imageDataUrl": null }
  ```

Regras e proteções:
- Suporta **PNG/JPEG/WEBP/GIF** e verifica integridade do *data URL*.
- **Limite 5 MB** (`image_too_large` → 413).
- Exige `BLOB_READ_WRITE_TOKEN` configurado; com `?cleanup=1`, apaga o blob antigo com `@vercel/blob/del`.
- Erros padronizados com `content-language` e cache desabilitado.

---

## 👤 Perfil do Usuário

- **GET `/api/user/profile?email=`** → Retorna dados do perfil. Se inexistente, devolve *shape* padrão com campos nulos e `sex: "Não Informar"`.
- **POST `/api/user/profile`** → *Upsert* completo de:
  `name, cpf, sex, birthdate, address, neighborhood, city, state, cep, phone`.  
  Conflitos são resolvidos com `on conflict (email) do update`.

---

## ✅ Convenções de API

- Todas as rotas retornam `application/json; charset=utf-8` e `cache-control: no-store`.
- Erros são **semânticos** e internacionalizados (ver chaves em `public/locales/*/common.json`).
- Consultas sempre garantem o escopo do **usuário atual** via `user_email` nas tabelas.



## Componentes de Interface

### Features
O componente `Features` exibe uma seção com cartões que apresentam os principais recursos da aplicação.  
Cada card contém:
- Ícone representativo
- Título
- Descrição

O conteúdo é definido em um array `items` com chaves de tradução, utilizando `react-i18next` para internacionalização.
O estilo é aplicado via `Features.module.css`, com foco em responsividade e consistência visual.

#### Testes
O arquivo `Features.test.tsx` valida:
- Renderização correta dos títulos e descrições.
- Quantidade de cartões.
- Presença dos ícones (`svg`).
O cenário de teste documentado em `explicaTesteCen.md` descreve requisitos, incrementos e observações.

---

### Footer
O componente `Footer` renderiza:
- Logo e nome da aplicação
- Links de navegação (Home, Quem Somos, Contato)
- Ícones sociais (Instagram, Facebook, LinkedIn)
- Texto de direitos autorais dinâmico com o ano atual.

Estilizado com `Footer.module.css`, garantindo responsividade para mobile e desktop.

---

### Header
O componente `Header` apresenta um título principal e subtítulo opcional, usando chaves de tradução.
Estilos em `Header.module.css` garantem tipografia adaptada ao tamanho da tela.

---

### Hero
O componente `Hero` exibe uma área de destaque inicial com:
- Título
- Subtítulo
- Botões de ação ("Minhas Turmas" e "Exemplos")
- Área visual decorativa.

Estilos definidos em `Hero.module.css` para manter apelo visual e consistência.

---

### Navbar
A `NavBar` oferece navegação principal com:
- Logo e nome
- Links principais
- Menu de perfil (`ProfileMenu`)
- Troca de idioma com bandeiras (pt, en, es)
- Versão mobile com `Drawer` para menu lateral.

Estilos em `NavBar.module.css` e suporte a acessibilidade via `aria-labels`.

#### Testes
`NavBar.test.tsx` cobre o fluxo de troca de idioma, garantindo que o texto "Quem Somos" é atualizado conforme o idioma escolhido.  
O cenário está descrito em `explicaTesteCen.md`.


---

## 🎛️ Componentes de UI

### `Features` (cards de funcionalidades)
Arquivos:  
- `src/app/components/features/Features.tsx`  
- `src/app/components/features/Features.module.css`  
- `src/app/components/features/Features.test.tsx`  
- `src/app/components/features/explicaTesteCen.md`

**O que faz**  
Renderiza 3 cards com ícone, título (`h3`) e descrição traduzidos via i18n:
- `features.students.*` — Turmas e alunos
- `features.grades.*` — Avaliações e médias
- `features.trust.*` — Confiável

**Pontos de implementação**  
- Ícones MUI (`Group`, `Assessment`, `Security`) passados como `ReactNode`.
- Estilo com `.card` (hover, sombra, borda), `.titleRow` e `.iconWrap`.
- Textos via `t(key)` de `react-i18next`.

**Teste** (`Features.test.tsx`)  
- Garante presença de títulos e descrições.  
- Verifica **quantidade de cards** (`getAllByRole('heading', { level: 3 })`).  
- Confere que **ícones (SVG)** estão renderizados (`getAllByTestId(/Icon$/)`).  
- O arquivo `explicaTesteCen.md` descreve o **cenário**, incrementos e manutenção dos testes.

---

### `Footer`
Arquivos:  
- `src/app/components/footer/Footer.tsx`  
- `src/app/components/footer/Footer.module.css`

**O que faz**  
- Logo + links de navegação (Home, Quem Somos, Contato).  
- Botões sociais (Instagram, Facebook, LinkedIn).  
- Texto de copyright com o ano atual (`{{year}}`).  
- Totalmente traduzido com `t('footer.*')`.

**Estilo**  
- Gradiente claro, responsivo, foco em acessibilidade (`aria-label` nos botões sociais).  
- Classes `.footerLinks`, `.iconButton`, e ajustes por *breakpoints* (tablet/mobile).

---

### `Header`
Arquivos:  
- `src/app/components/header/Header.tsx`  
- `src/app/components/header/Header.module.css`

**O que faz**  
- Cabeçalho semântico com `h1` (título) e subtítulo opcionais.  
- Tradução por **chave** (`titleKey` e `subtitleKey`).

**Estilo**  
- Usa tokens do tema MUI (cores de `paper`/`divider`).  
- Responsivo: muda o tamanho da fonte do título em `@media (min-width: 768px)`.

---

### `Hero`
Arquivos:  
- `src/app/components/hero/Hero.tsx`  
- `src/app/components/hero/Hero.module.css`

**O que faz**  
- Seção de destaque com título, subtítulo e CTAs:  
  - **Criar turma** → `/login/minhas-turmas`  
  - **Ver exemplos** → `/exemplos`  
- Traduções em `common.hero.*`.

**Estilo**  
- `Paper` com gradiente e bordas arredondadas.  
- Grid responsivo (`.row`) e área visual decorativa (`.visual`).  
- Botões com `border-radius: 999px` e pesos distintos (`.ctaPrimary`, `.ctaGhost`).

---

### `NavBar`
Arquivos:  
- `src/app/components/navbar/NavBar.tsx`  
- `src/app/components/navbar/NavBar.module.css`  
- `src/app/components/navbar/NavBar.test.tsx`  
- `src/app/components/navbar/explicaTesteCen.md`

**O que faz**  
- AppBar com: logo + nome, links (“Início”, “Quem Somos”), **ProfileMenu**, seletor de **idioma por bandeiras** (pt, en, es) e **Drawer** para navegação móvel.  
- Persistência do idioma em `localStorage` e *cookie* `i18next`.  
- Ajuste do atributo `lang` no `documentElement`.

**Acessibilidade**  
- `aria-label` nos botões de idioma (ex.: “Mudar idioma para English (US)”).  
- Navegação principal com `role="navigation"` e `ListItemButton` semântico no Drawer.

**Teste** (`NavBar.test.tsx`)  
- Mock de `ProfileMenu` e `next/image` para isolar dependências.  
- Inicializa i18n **em memória** (pt/en/es).  
- Clica na bandeira → `i18n.language` vira `"en"` e o texto **About** aparece.  
- O arquivo `explicaTesteCen.md` documenta o **cenário de troca de idioma**.

---

## 🧪 Estratégia de Testes (Resumo)

- **Unitário/integração** com Testing Library.  
- Queries **acessíveis** (roles, `aria-label`, `getByText`) para robustez.  
- Mock de dependências pesadas (auth, imagens, media queries).  
- Manutenção guiada por *docs* (`explicaTesteCen.md` em features e navbar).


---

## 📄 Páginas de Conteúdo

### Contato (`/contato`)
Arquivos:  
- `src/app/contato/page.tsx`  
- `src/app/contato/FaleConosco.module.css`

**O que faz**  
Página de contato com layout **2 colunas** (MUI `Paper`):  
1. **Sidebar** com título, endereço (HTML), e-mail, telefone e mapa embed do Google Maps.  
2. **Formulário** com campos de nome, e-mail e mensagem, botão de envio.  

**Tradução**  
- Chaves `contactPage.sidebar.*` e `contactPage.form.*` para textos e placeholders.

**Estilo**  
- `.formulario` define largura total, tipografia coerente, e botão destacado.  
- Uso de ícones (`RoomIcon`, `EmailIcon`, `PhoneIcon`) para reforço visual.

---

### Documentação (`/documentacao`)
Arquivos:  
- `src/app/documentacao/page.tsx`  
- `src/app/documentacao/Documentacao.module.css`

**O que faz**  
- Renderiza um guia com **título, introdução, passos numerados e FAQ**.  
- Passos e respostas podem conter HTML (`dangerouslySetInnerHTML`) para formatação.  
- Todo o conteúdo é internacionalizado (`docs.*`).

**Estilo**  
- `Paper` com gradiente dourado-claro e cantos arredondados.  
- Classes para títulos (`.docTitle`, `.docSectionTitle`) e caixas (`.docStep`, `.docFaqItem`).

---

### Exemplos (`/exemplos`)
Arquivos:  
- `src/app/exemplos/page.tsx`  
- `src/app/exemplos/Exemplos.module.css`

**O que faz**  
- Apresenta uma **introdução HTML**, lista de passos e seção de dicas (`<ul>`).  
- Conteúdo internacionalizado (`exemplos.*`).

**Estilo**  
- Similar ao `/documentacao` com cores e sombras suaves.  
- `.dicasList` com cor e peso de fonte diferenciados.

---

## 🌍 Internacionalização (i18n)

- Todas as páginas usam `useTranslation("common")`.  
- Textos dinâmicos com `dangerouslySetInnerHTML` vêm do i18n, permitindo HTML seguro nas traduções.  
- Chaves são organizadas por página: `contactPage.*`, `docs.*`, `exemplos.*`, `navbar.*`, etc.


---

## 📄 Páginas de Conteúdo

### Contato (`/contato`)
Arquivos:
- `src/app/contato/page.tsx`
- `src/app/contato/FaleConosco.module.css`

**O que faz**
- Card lateral com **endereço**, **e-mail**, **telefone** e seção “**Encontre-nos aqui**” (tudo traduzido via `contactPage.sidebar.*`).
- **Mapa incorporado** via `iframe` do Google Maps dentro de um container com `borderRadius`, `boxShadow` e `lazy` loading.
- **Formulário** com `TextField`s (`nome`, `email`, `mensagem`) e botão **Enviar**; rótulos e CTA vindos de `contactPage.form.*`.

**Acessibilidade & UX**
- Ícones semânticos (Room, Email, Phone) ao lado dos textos.
- `dangerouslySetInnerHTML` somente para `address_html`, vindo do i18n.
- CSS: `.formulario` padroniza tipografia dos inputs e o botão tem **peso 600**.

---

### Documentação (`/documentacao`)
Arquivos:
- `src/app/documentacao/page.tsx`
- `src/app/documentacao/Documentacao.module.css`

**O que faz**
- Página de **onboarding** com título, introdução, seção “Como usar o sistema” em **5 passos** e **FAQ** — todos os textos vêm de `docs.*` no i18n.
- Passos renderizados com `Typography` e conteúdo em HTML controlado (`dangerouslySetInnerHTML`) para listas/linhas.

**Estilo**
- Papel com **gradiente** e **radius 18px** (`.docPaper`).
- Cores temáticas (`#C9A227`, `#B38E1E`) para títulos e seções.
- Blocos de passo e FAQ com sombras leves (`.docStep`, `.docFaqItem`).

---

### Exemplos de Uso (`/exemplos`)
Arquivos:
- `src/app/exemplos/page.tsx`
- `src/app/exemplos/Exemplos.module.css`

**O que faz**
- Página didática com **introdução** + **4 passos** (Cadastrar Turma, Adicionar Alunos, Lançar Notas, Gerar Relatórios).  
- Conteúdos vindos de `exemplos.*` (pt/en/es), alguns com HTML controlado para listas e quebras de linha.
- Seção final **Dicas rápidas** em lista (`ul`).

**Estilo**
- Mesmo visual temático da documentação (`gradiente`, radius, sombra).
- Blocos `.exemploStep` para cada passo e `.dicasList` para bullets com cor temática.

---

## 🌐 i18n aplicado às páginas
- **Contato:** `contactPage.sidebar.*`, `contactPage.form.*`, `contactPage.map.loading`.
- **Documentação:** `docs.title|intro|howToUse|steps.*|faq*`.
- **Exemplos:** `exemplos.titulo|introducao|passo*.titulo|passo*.texto|dicas.*`.

> Observação de segurança: onde é usado `dangerouslySetInnerHTML`, o conteúdo vem **exclusivamente** dos arquivos de tradução controlados pelo projeto.


---

## 🔐 Fluxos de Autenticação

### Criar Conta (`/login/criar-conta`)
Arquivos:
- `src/app/login/criar-conta/page.tsx`
- `src/app/login/criar-conta/criar-conta.test.tsx`
- `src/app/login/criar-conta/explicaTesteCen.md`

**O que faz**
- **Etapa 1 (form)**: Nome, E-mail, Senha. Validações:
  - Campos obrigatórios (`required`).
  - E-mail com `type="email"`.
  - Senha forte via regex (mín. 8 caracteres, maiúscula, minúscula, número, especial).
- **Etapa 2 (code)**: Exibe `serverCode` retornado pela API `/register/start` e campo para inserir código de confirmação.
- Envia `/register/confirm` ao confirmar.
- Mensagens de erro via **Alert** MUI, traduzidas (`api.errors.*` ou `register.errors.*`).

**Testes**
- Cobrem validação de campos, e-mail inválido, senha fraca, loading no botão, fluxo de avanço/retrocesso, e erro de código inválido.
- Uso de `mockFetch` para simular respostas de API.
- Documentado em `explicaTesteCen.md` com passos Given/When/Then.

---

### Esqueci Senha (`/login/esqueci-senha`)
Arquivos:
- `src/app/login/esqueci-senha/page.tsx`
- `src/app/login/esqueci-senha/esqueci-senha.test.tsx`
- `src/app/login/esqueci-senha/explicaTesteCen.md`

**O que faz**
- Formulário: E-mail, Código de recuperação, Nova senha.
- Envia `/reset/by-code` para redefinir senha.
- Mensagens de sucesso/erro com **Alert** MUI (`reset.success`, `reset.errors.*`).
- Desabilita botão durante `loading`.

**Testes**
- Validam campos obrigatórios, e-mail inválido, erro vindo do backend, mensagem de sucesso, e estado de loading no botão.
- Documentado em `explicaTesteCen.md` com cenários claros e objetivos.

---

## 👩‍🎓 Gestão de Alunos

### Meus Alunos (`/login/meus-alunos`)
Arquivos:
- `src/app/login/meus-alunos/page.tsx`
- `src/app/login/meus-alunos/MeusAlunos.module.css`

**O que faz**
- Lista turmas e alunos do usuário autenticado (via `useSession`).
- Permite **selecionar turma**, **adicionar**, **editar** e **remover** alunos.
- Inputs com máscaras: matrícula só aceita números, máx. 9 dígitos.
- Feedback via **Snackbar** + **Alert**.
- Estado de carregamento com **Backdrop** + **CircularProgress**.

**Fluxo de API**
- GET `/api/classes?email=...` → lista turmas.
- GET `/api/students?email=...&classId=...` → lista alunos.
- POST/PUT `/api/students` → cria/edita aluno.
- DELETE `/api/students?id=...&email=...` → exclui aluno.

**Estilo**
- Botão `.botaoCadastrar` grande e chamativo.
- Formulário `.formAluno` com gradiente e sombra suave.
- Tabela `.tabelaAluno` com bordas arredondadas.

---

## 📌 Observações Gerais de Testes
- Uso consistente de **Testing Library** para queries acessíveis (`getByRole`, `getByLabelText`).
- Mocks de `fetch` para controle total de cenários.
- Estratégia Given/When/Then documentada em `explicaTesteCen.md`.
- Cobertura de:
  - Validações front-end
  - Respostas de erro do back-end
  - Estados de loading
  - Navegação entre passos (quando aplicável)


---

## 🔐 Autenticação — Fluxos de Cadastro e Recuperação

### Criar Conta (`/login/criar-conta`)
Arquivos:
- `src/app/login/criar-conta/page.tsx`
- `src/app/login/criar-conta/criar-conta.test.tsx`
- `src/app/login/criar-conta/explicaTesteCen.md`

**Fluxo em 2 etapas**
1) **Formulário** com Nome, E-mail e Senha.  
2) **Confirmação por código** (serverCode exibido em destaque).

**Validações & UX**
- Regras de senha (regex): **min. 8** + maiúscula + minúscula + número + caractere especial.  
- Botões exibem **loading** e ficam **desabilitados** durante requests.  
- Erros da API são traduzidos via `api.errors.*`; fallback para mensagens locais (`register.errors.*`).  
- Persistência usa `fetch` contra:
  - `POST /api/auth/register/start` → `{ pendingId, code, expiresIn }`
  - `POST /api/auth/register/confirm` → `200 OK`

**Teste** (`criar-conta.test.tsx`)
- Campos obrigatórios (não avança sem preenchimento).
- E-mail inválido (input type=email).
- **Loading**: botão mostra “Gerando código…” e fica `disabled` enquanto aguarda o `fetch`.
- Senha fraca → mensagem com regra mínima.
- Fluxo feliz: avança ao passo do código e renderiza o **`654321`** simulado.
- Código inválido → exibe erro retornado.
- **Voltar**: retorna ao formulário inicial.  
> Detalhes do cenário: ver `explicaTesteCen.md`.

---

### Esqueci a Senha (`/login/esqueci-senha`)
Arquivos:
- `src/app/login/esqueci-senha/page.tsx`
- `src/app/login/esqueci-senha/esqueci-senha.test.tsx`
- `src/app/login/esqueci-senha/explicaTesteCen.md`

**Fluxo**
- Alerta explicativo com `reset.info`.  
- Form com **E-mail**, **Código de recuperação** (numérico, máx. 6) e **Nova senha**.  
- Integração: `POST /api/auth/reset/by-code` → mensagens traduzidas (`api.errors.*`), sucesso em `reset.success`.

**Teste**
- Campos obrigatórios (sem submit).  
- E-mail inválido (type=email).  
- Erro do backend (ex.: “Código incorreto”).  
- Sucesso exibe toast “Senha atualizada…”.  
- **Loading**: botão mostra “Salvando…” e fica `disabled`.

---

## 👩‍🎓 Gestão de Alunos — “Meus Alunos” (`/login/meus-alunos`)
Arquivos:
- `src/app/login/meus-alunos/page.tsx`
- `src/app/login/meus-alunos/MeusAlunos.module.css`

**O que faz**
- Carrega **Turmas** do usuário autenticado (NextAuth) via `GET /api/classes?email=…` e seleciona a primeira automaticamente.  
- Para a turma selecionada, carrega **Alunos** com `GET /api/students?email=…&classId=…`.  
- **CRUD** de Alunos:
  - **Create** `POST /api/students` (email, class_id, name, registration)  
  - **Update** `PUT /api/students` (email, id, name, registration)  
  - **Delete** `DELETE /api/students?id=…&email=…`
- Feedback visual com **Snackbar/Alert** e **Backdrop** durante operações.

**Experiência & Acessibilidade**
- Form com `FormControl + Select` para **Turma** e `TextField` para **Nome** e **Matrícula**.  
- **Máscara leve** de matrícula (apenas dígitos, máx. 9).  
- Tabela (`Table*`) com ações **Editar** e **Excluir** (ícones com `aria-label`/`title`).  
- Textos internacionalizados: `studentsPage.*` (títulos, labels, ações e mensagens).  
- Estados de vazio: mensagem centralizada quando não há alunos na turma.

**Estilo (CSS)**
- `.formAluno` com gradiente, borda arredondada e sombra suave.  
- `.tabelaAluno` e `.tituloAluno` para hierarquia visual.  
- `.botaoCadastrar` padroniza tamanho e tipografia do CTA.

**Notas de implementação**
- Sanitização de `registration` no `onChange`.  
- Resiliência a falhas: captura `error` do backend e mostra no Snackbar.  
- Atualização de lista pós-CRUD com `fetchAlunos`.

---

## 🗺️ Mapa de Rotas Relevantes (Resumo)
- `POST /api/auth/register/start` → inicia cadastro e retorna `pendingId` + `code`.
- `POST /api/auth/register/confirm` → confirma cadastro com `pendingId` + `code`.
- `POST /api/auth/reset/by-code` → troca de senha com `email` + `code` + `password`.
- `GET/POST/PUT/DELETE /api/students` → CRUD de alunos (escopo por `user_email`).
- `GET /api/classes` → lista de turmas do usuário autenticado.

---

## Página **Minha Conta** (`/login/minha-conta`)

Gerencia **dados do perfil** e **avatar** do usuário autenticado (NextAuth). Implementada como _client component_ com MUI e i18next.

### Funcionalidades
- Busca inicial do perfil via **GET** `/api/user/profile?email=...` e preenche:
  - Dados básicos: `name`, `cpf`, `sex`, `birthdate`
  - Endereço: `address`, `neighborhood`, `city`, `state`, `cep`
  - Contato: `phone`
  - `avatar_url` para pré-visualização
- Edição e **persistência** do perfil via **POST** `/api/user/profile` (upsert).
- **Avatar**
  - Pré-visualização local (FileReader → data URL)
  - **Salvar**: **POST** `/api/user/avatar` com `{ email, imageDataUrl }` (Vercel Blob + Postgres)
  - **Remover**: **POST** `/api/user/avatar` com `{ email, imageDataUrl: null }`
  - Estados de carregamento com `Backdrop + CircularProgress` e `Snackbar` para feedback.
- Internacionalização: mensagens `accountPage.*` e `api.*` (erros e sucessos).

### UX e Acessibilidade
- Botões com rótulos claros e `aria` implícito via MUI.
- Campos de data com `InputLabelProps.shrink` e _placeholders_ traduzidos.
- **Estados** unificados: `busy = savingAvatar || loadingProfile || savingProfile` exibem _overlay_.

### Integrações
- `useSession().update()` e `router.refresh()` após operações (garantindo sincronia do avatar/dados).
- Validação leve no client (e.g., CPF livre, CEP/Telefone livres; regras adicionais podem ser adicionadas).

---

## **Minhas Turmas** (`/login/minhas-turmas`)

CRUD de turmas com React Hook Form + MUI e i18n. Comunicação com `/api/classes`.

### Fluxo
- **Listagem** inicial: `GET /api/classes?email=...`
- **Criar**: `POST /api/classes` com `{ email, name, school_year }`
- **Editar**: `PUT /api/classes` com `{ email, id, name, school_year }`
- **Excluir**: `DELETE /api/classes?id=...&email=...`

### UI/Validações
- Formulário: **Nome da Turma** e **Ano Letivo** (somente 4 dígitos, máscara simples + `pattern`).
- Botão alterna **Cadastrar/Salvar** conforme `editId`.
- Feedback com `Snackbar` (sucesso/erro) e `Backdrop` durante operações.
- Tabela com ações (_editar/excluir_) e mensagem de vazio traduzida.

### Testes Automatizados
Cobrem fluxo de cadastro, inválidos, edição, exclusão e **validação do ano**:
- `page.test.tsx` (RTL + user-event) verifica reset de formulário, mensagens e mutações na tabela.

---

## **Notas e Avaliações** (`/login/notas-avaliacoes`)

Tela completa para **criar avaliações**, **lançar notas**, **calcular médias ponderadas**, **filtrar por período** e **exportar CSV**, com gráficos Recharts (SSR-safe via `next/dynamic`).

### Entidades e APIs
- **Turmas**: `GET /api/classes?email=...`
- **Alunos**: `GET /api/students?email=...&classId=...`
- **Avaliações**: 
  - `GET /api/assessments?email=...&classId=...`
  - `POST /api/assessments` (`{ email, class_id, name, weight, term }`)
  - `PUT /api/assessments` (`{ email, id, name, weight, term }`)
  - `DELETE /api/assessments?id=...&email=...`
- **Notas**:
  - `GET /api/grades?email=...&classId=...`
  - `POST /api/grades` (`{ email, assessment_id, student_id, value }`) — _upsert_ por conflito

> **Obs.:** As rotas `/api/assessments` estão referenciadas nesta página; certifique-se de incluí-las no backend (o restante já está neste repositório).

### Destaques de Implementação
- **Filtro por período/etapa**: “Todas”, “Geral” e 1º–4º bimestre (i18n). Internamente o filtro compara **texto traduzido**; manter chaves estáveis (`gradesPage.term.*`).
- **Criação/Edição de Avaliações**
  - Peso numérico com normalização de vírgula/ponto.
  - Edição **inline** com `Save/Cancel` (PUT).
- **Lançamento de Notas**
  - Campo por aluno × avaliação, aceita `0–10` com `DECIMALS=2`.
  - **Debounce** de 800ms por célula (com salvamento antecipado em `Enter`/`blur`).
  - Sanitização: remove caracteres não numéricos, normaliza vírgula para ponto, _clampa_ em `[0,10]`.
- **Cálculos**
  - Média **ponderada por aluno** usando `weight` de cada avaliação ativa no filtro.
  - Média **por avaliação** (simples) no período filtrado.
- **Exportações CSV**
  - **Matriz**: aluno × avaliações + média ponderada (separador `;` e _escaping_ de aspas).
  - **Resumo**: médias por aluno (com situação **Aprovado/Reprovado** a partir de `PASSING_GRADE=7.0`) e médias por avaliação.
- **Gráficos**
  - `BarChart` de médias por aluno e por avaliação (eixos/legendas/tooltips traduzidos).
  - `Intl.NumberFormat` por idioma ativo.

### UX/Estado
- `Backdrop` global durante carga/CRUD.
- `Snackbar` para feedback.
- Reset de estados ao trocar de turma (limpa edição/inputs de notas).

---

## **Contato / Documentação / Exemplos**

- **Contato** (`/contato`): _sidebar_ com endereço/contatos + mapa (iframe) e formulário básico. Estilos em `FaleConosco.module.css`.
- **Documentação** (`/documentacao`): _landing_ com passos e FAQ estilizados (cores temáticas). Conteúdo via `t("docs.*")` com HTML controlado no i18n.
- **Exemplos** (`/exemplos`): página guiada com passos e dicas (`exemplos.*`), usando `dangerouslySetInnerHTML` para conteúdo rico do i18n.

---

## Mapeamento Rápido: Páginas ↔ Rotas de API

| Página | Rotas |
|---|---|
| Minha Conta | `/api/user/profile` (GET/POST), `/api/user/avatar` (POST) |
| Minhas Turmas | `/api/classes` (GET/POST/PUT/DELETE) |
| Meus Alunos | `/api/students` (GET/POST/PUT/DELETE) |
| Notas e Avaliações | `/api/assessments` (GET/POST/PUT/DELETE), `/api/grades` (GET/POST) |
| Autenticação | `/api/auth/register/start`, `/api/auth/register/confirm`, `/api/auth/reset/by-code` |

---

## Boas Práticas e Pontos de Atenção

- **i18n**: sempre usar chaves (`common`, `gradesPage`, `classesPage`, `accountPage`, `api.errors/success`) e evitar comparar textos literais no código.
- **A11y**: botões com `aria-label` (bandeiras/ações), inputs com `label` claro, estados de foco/hover configurados.
- **UX de rede**: evitar _double submit_ com `disabled` durante `loading/busy` e indicar progresso com `Backdrop`.
- **Consistência**: componentes seguem _look & feel_ comum (gradientes suaves, _cards_ arredondados, tipografia forte, sombras leves).

<sub>_Atualizado em 2025-08-14T23:13:50Z_</sub>


---

## Login › Reset por Token (`src/app/login/reset/page.tsx` e `reset-form.tsx`)

**Fluxo:** ambos os componentes confirmam redefinição de senha usando um **token** presente na URL (`useSearchParams`) ou recebido via prop (`ResetForm`).  
- Envio: `POST /api/auth/reset/confirm` com `{ token, password }`.  
- Estados: `loading` desabilita o botão e alterna rótulos (`saving` vs `save`).  
- Feedback: alertas simples (i18n no `page.tsx`; texto fixo no `reset-form.tsx`).  
- A11y: campos `required`, tipo `password` e foco mantido no formulário.

**Boas práticas e notas:**
- _UX:_ considerar validação de força da senha (reaproveitar regex da criação de conta) e mensagens inline (`<Alert>`).  
- _Segurança:_ token nunca vai ao log; preferir `credentials: "include"` se o backend usar cookie anti‑CSRF.  
- _I18n:_ `reset-form.tsx` pode seguir o mesmo namespace do resto (ex.: `common.resetConfirm.*`).

**Teste sugerido (RTL):**
```tsx
it('salva nova senha quando token válido', async () => { /* mock fetch 200, digita senha, submete e verifica redirecionamento */ });
it('mostra erro quando link é inválido', async () => { /* mock fetch 400 e espera alerta de erro */ });
```

---

## Componente de Idioma Minimalista (`src/app/login/LanguageMenu.tsx`)

**O que faz:** alterna entre `pt`, `en` e `es` usando `i18next`, persistindo em `localStorage` e `cookie i18next`, e **atualiza o atributo `lang`** do `<html>` para melhor acessibilidade/SEO.

**Detalhes:**
- `active` é derivado de `i18n.resolvedLanguage || i18n.language`.  
- `change(code)` evita trabalho se o idioma já estiver ativo; persiste escolha; define `lang="pt-BR"` para PT.  
- Botões têm `aria-label` e usam os emojis 🇧🇷 🇺🇸 🇪🇸.

**Teste sugerido:**
```tsx
// clica no botão EN e valida i18n.language === 'en' e documentElement.lang === 'en'
```

---

## Página de Login (`src/app/login/page.tsx`)

**Stack:** NextAuth (`signIn('credentials')`) + i18n + MUI.  
**Recursos:**
- Campos controlados (`email`, `password`) + `loading` para travar inputs/botão.  
- Ação "Esqueci a senha" ➜ `/login/esqueci-senha`.  
- Botão principal circular com `LoginIcon`.  
- Botão “Criar conta” ➜ `/login/criar-conta`.  
- Login social Google: `signIn('google', { callbackUrl: '/' })`.  
- Mensagens e rótulos traduzidos (`common.loginPage.*`).

**A11y & UX:**
- `aria-label`/`title` no botão principal; `autoComplete` configurado.  
- Em erro de credenciais, exibe `alert(res.error)`. Pode-se trocar por `<Alert/>` para consistência.

**Testes sugeridos:**
- Bloqueio enquanto `loading` é `true`.  
- Erro de credenciais mockado pela NextAuth.  
- Redirecionamento ao sucesso (`router.push('/')`).

---

## Menu de Perfil (`src/app/login/profilemenu.tsx`)

**Comportamento:** exibe avatar/ícone e um menu contextual dependente do estado da sessão (`useSession`).  
**Itens:** Minha Conta, Criar Conta, Minhas Turmas, Meus Alunos, Notas e Avaliações, e **Sair/Entrar** conforme autenticado.

**Acessibilidade & Estados:**
- Usa `aria-controls`, `aria-haspopup`, `aria-expanded`, `aria-disabled` e `Tooltip`.  
- Quando `status === "loading"`, o botão reduz opacidade, é não focável e ignora clique (`onMouseDownCapture`).  
- Avatar respeita `referrerPolicy="no-referrer"`.

**Integração:** `signOut({ callbackUrl: "/login" })` garante retorno amigável ao logout.

**Testes sugeridos:**
- Renderização condicional dos itens conforme `status`.  
- Abertura/fechamento do menu e foco.  
- Chamada de `signOut` ao clicar em “Sair”.

---

## Página “Quem Somos” (`src/app/quem-somos/page.tsx`)

**Descrição:** página institucional com i18n (prefixo `common.about.*`), cartões de missão/valores/equipe e **animação progressiva** dos cards via `element.animate` no `useEffect`.

**Highlights técnicos:**
- Composição MUI (`Paper`, `Grid`, `Card`, `Avatar`) com tema visual do app.  
- Lista `TEAM` mapeia chaves de tradução para nome/cargo/descrição (fallbacks por `defaultValue`).  
- Efeitos de _hover_ nos cards e `box-shadow`/`transform` suaves.

**I18n esperado:**
```
common.about.title, intro, sections.mission.*, sections.values.*, sections.team.*,
team.{gabriela|sara|sarah}.{name,role,desc}, team_title
```

**Testes sugeridos:**
- Verificar presença de seções principais e dos 3 cards do time.  
- Checar uso de traduções por `keyPrefix`.  
- (Opcional) `IntersectionObserver` para só animar quando visível.

---

## Considerações de Segurança e Privacidade (módulos desta leva)

- **Tokens de reset**: trafegam apenas no corpo do POST; evite logs do token. Considere expiração curta e uso _one‑time_.  
- **Cookies/LocalStorage**: `i18nextLng` é público e inofensivo; evite salvar dados sensíveis no `localStorage`.  
- **Alertas vs toasts**: consolidar feedback em `<Alert>`/Snackbar onde possível para evitar `alert()` bloqueante.  
- **Atributo `lang`**: já aplicado em NavBar e LanguageMenu; importante para leitores de tela e SEO.

---

### Roteiro rápido (API ↔ Páginas desta seção)

- `POST /api/auth/reset/confirm` ⇄ `login/reset/page.tsx` & `login/reset/reset-form.tsx`  
- NextAuth `credentials`/`google` ⇄ `login/page.tsx`  
- Sessão NextAuth (`useSession`, `signOut`) ⇄ `login/profilemenu.tsx`

> _Atualizado em 2025-08-14 23:24_.
