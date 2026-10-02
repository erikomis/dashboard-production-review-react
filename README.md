<div align="center">

<img src="public/favicon.svg" alt="" width="72" height="72" />

# ReviewStore · Painel admin

**Painel administrativo do catálogo e das avaliações do ecossistema _Production Review_.**
Gerencie o catálogo, importe produtos reais do Open Food Facts, trate denúncias, responda e modere avaliações (uma a uma ou em lote), administre usuários, exporte CSV e acompanhe tudo em gráficos, na trilha de auditoria e em tempo real. Tudo a um <kbd>Ctrl</kbd> <kbd>K</kbd> de distância.

<p>
  <img alt="React 18" src="https://img.shields.io/badge/React-18-3C50E0?style=for-the-badge&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3C50E0?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-3C50E0?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3-3C50E0?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>
<p>
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-7-1C2434?style=flat-square" />
  <img alt="Recharts" src="https://img.shields.io/badge/gráficos-Recharts-1C2434?style=flat-square" />
  <img alt="TanStack Query" src="https://img.shields.io/badge/TanStack_Query-1C2434?style=flat-square" />
  <img alt="Vitest" src="https://img.shields.io/badge/testes-Vitest-1C2434?style=flat-square" />
  <img alt="Playwright" src="https://img.shields.io/badge/E2E-Playwright-1C2434?style=flat-square" />
  <img alt="Modo escuro" src="https://img.shields.io/badge/modo-escuro-24303F?style=flat-square" />
  <img alt="Padrão MVVM" src="https://img.shields.io/badge/arquitetura-MVVM-1C2434?style=flat-square" />
</p>

[Funcionalidades](#-funcionalidades) ·
[Telas](#-telas) ·
[Como rodar](#-como-rodar) ·
[Testes](#-testes) ·
[Arquitetura](#-arquitetura) ·
[Acessibilidade](#-acessibilidade) ·
[Design system](#-design-system)

</div>

<br />

<p align="center">
  <img src="docs/screenshots/visao-geral.png" alt="Visão geral do painel com totais, gráfico de avaliações por dia, nota média por dia e distribuição de notas" width="100%" />
</p>

---

## ✨ Funcionalidades

| | |
|---|---|
| 📊 **Visão geral com gráficos** | **Pendências** no topo (denúncias abertas e avaliações ocultadas por último), totais (produtos, categorias, subcategorias, avaliações visíveis e ocultas, usuários), avaliações por dia com a nota média de cada dia, distribuição de notas, top 5 produtos e categorias e novos usuários por dia, com período de **7, 30 ou 90 dias**. |
| 📦 **Catálogo completo** | CRUD de categorias, subcategorias e produtos, com slug gerado automaticamente a partir do nome (e editável). Produtos com **miniatura, nota média**, filtros por categoria/subcategoria e ordenação (recentes, nome, melhor avaliados, mais avaliados). |
| 🖼 **Imagens de produto** | Galeria na edição do produto, com capa, origem (ex.: Open Food Facts) e **exclusão**; upload com validação de tipo e tamanho. |
| 📥 **Importar catálogo** | Importação do **Open Food Facts** (dados abertos, ODbL) com **progresso ao vivo**: barra, passo atual, contadores, erros e resumo com links. Idempotente: nada é duplicado. **Remover duplicados** com confirmação e resumo (grupos, removidos e links para os mantidos). |
| 🛡 **Moderação de avaliações** | Abas *Todas · Visíveis · Ocultas · Denunciadas* com contadores, filtros por produto, nota e texto, **ocultar com motivo obrigatório** (com motivos rápidos), restaurar e quem moderou e quando. |
| 🚩 **Denúncias** | Selo com o número de denúncias em cada linha e painel lateral com motivo, detalhes, quem denunciou e quando. **Descartar** mantém a avaliação; **Ocultar** já sugere o motivo a partir das denúncias e as resolve. |
| 💬 **Resposta oficial** | Escrever, editar e remover a “Resposta da equipe ReviewStore” (até 1000 caracteres, com contador), visível na linha e no painel da avaliação. |
| 🖼 **Fotos das avaliações** | Miniaturas na moderação, visualizador acessível (setas, <kbd>Esc</kbd>, “Foto 2 de 3”) e remoção pelo admin. |
| ☑️ **Moderação em lote** | Checkboxes com “selecionar página”, barra fixa com **Ocultar selecionadas** (motivo obrigatório) e **Restaurar selecionadas**, contando só as avaliações em que a ação faz sentido. |
| 📄 **Exportar CSV** | Avaliações (com os filtros atuais), usuários e atividade, com o nome de arquivo do `Content-Disposition` (UTF-8 com BOM e `;`, prontos para o Excel). |
| ⌨️ **Busca rápida** | <kbd>Ctrl</kbd> <kbd>K</kbd> / <kbd>⌘</kbd> <kbd>K</kbd> ou o botão do header: vai para qualquer tela ou ação e busca produtos pelo autocompletar da API. |
| 👥 **Usuários** | Busca, filtros por perfil e situação, **tornar/remover administrador** e **desativar/reativar** com confirmação. As ações sobre a própria conta ficam bloqueadas, com explicação. |
| 🕵️ **Atividade (auditoria)** | Linha do tempo de todos os eventos (cadastros, logins, catálogo, avaliações, moderação, importações) com ícone e cor por tipo, filtros por tipo, entidade, período e busca, resumo por tipo e por dia e links para a entidade. |
| 🔔 **Notificações em tempo real** | Cada nova avaliação chega via **SSE** com tipo do evento, data em que ocorreu e link direto, além de atualizar listas e gráficos. |
| 🔐 **Sessão segura** | Cookies `httpOnly`, renovação automática pelo refresh token, tela de **acesso restrito** para quem não é administrador, política de senha da API (8 a 72 caracteres, letras e números) e **contagem regressiva** quando o rate limit (429) pede uma pausa. |
| 🌗 **Modo escuro** | Tema claro e escuro sincronizados em todo o painel, preferência salva no navegador. |
| 📏 **Tabelas confortáveis** | Densidade confortável ou compacta (salva no navegador), cabeçalho fixo e ações agrupadas no menu “Mais ações”. |
| 📱 **Responsivo** | Menu lateral recolhível no desktop e em gaveta no celular. |

## 🖼 Telas

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/denuncias.png" alt="Painel lateral com as denúncias de uma avaliação, motivos, detalhes e as ações descartar e ocultar" /></td>
    <td width="50%"><img src="docs/screenshots/resposta.png" alt="Painel da avaliação com foto e a resposta oficial da equipe, com editar e remover" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Denúncias</b>: motivos, detalhes, descartar ou ocultar</sub></td>
    <td align="center"><sub><b>Resposta oficial</b> e fotos da avaliação</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/lote.png" alt="Avaliações selecionadas com a barra de ações em lote para ocultar ou restaurar" /></td>
    <td width="50%"><img src="docs/screenshots/busca-rapida.png" alt="Busca rápida aberta com Ctrl+K mostrando produtos encontrados e atalhos de teclado" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Moderação em lote</b>: selecionar página e barra fixa</sub></td>
    <td align="center"><sub><b>Busca rápida</b> (<kbd>Ctrl</kbd> <kbd>K</kbd>): telas, ações e produtos</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/produtos.png" alt="Tabela de produtos com miniatura, categoria, nota média, filtros e ordenação" /></td>
    <td width="50%"><img src="docs/screenshots/importar.png" alt="Importação do Open Food Facts com explicação da fonte, licença e taxonomia" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Produtos</b>: miniatura, nota, filtros e ordenação</sub></td>
    <td align="center"><sub><b>Importar catálogo</b>: progresso ao vivo e remover duplicados</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/avaliacoes.png" alt="Lista de avaliações com abas de status, filtros e ações de moderação" /></td>
    <td width="50%"><img src="docs/screenshots/moderacao.png" alt="Modal de ocultar avaliação com motivo obrigatório" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Avaliações</b>: abas, denúncias, fotos, resposta e exportação</sub></td>
    <td align="center"><sub><b>Moderação</b>: ocultar exige motivo</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/usuarios.png" alt="Tabela de usuários com perfis, situação e ações de administrador" /></td>
    <td width="50%"><img src="docs/screenshots/atividade.png" alt="Trilha de auditoria com resumo por tipo, eventos por dia e linha do tempo" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Usuários</b>: perfis, situação e ações</sub></td>
    <td align="center"><sub><b>Atividade</b>: resumo e linha do tempo</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/screenshots/novo-produto.png" alt="Formulário de novo produto agrupado em seções" /></td>
    <td width="50%"><img src="docs/screenshots/modo-escuro.png" alt="Visão geral com gráficos no modo escuro" /></td>
  </tr>
  <tr>
    <td align="center"><sub><b>Formulário</b>: seções, slug automático e validação</sub></td>
    <td align="center"><sub><b>Modo escuro</b>, inclusive nos gráficos</sub></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/login.png" alt="Tela de login do painel" width="70%" />
</p>

## 🚀 Como rodar

### Pré-requisitos

- **Node.js 20+** e npm
- A API [`production-review-api`](https://github.com/erikomis/production-review-api) rodando (por padrão em `http://localhost:8084`)
- Um usuário com o perfil **ADMIN**

### Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. Aponte para a API
echo "VITE_API_URL=http://localhost:8084/api/v1" > .env.local

# 3. Suba em modo de desenvolvimento (http://localhost:5173)
npm run dev
```

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR na porta **5173** |
| `npm run build` | Checagem de tipos (`tsc -b`) + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint em todo o projeto |
| `npm test` | Testes unitários e de componente (Vitest + Testing Library) |
| `npm run test:watch` | Vitest em modo observação |
| `npm run test:e2e` | E2E com Playwright e a API **mockada** (sobe o `npm run dev` se ele não estiver rodando) |
| `npm run test:e2e:ui` | E2E no modo interativo do Playwright |
| `npm run test:e2e:real` | E2E contra a API real (`E2E_REAL_API=1`), pulando os testes que alteram dados |

### Variáveis de ambiente

| Variável | Exemplo | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8084/api/v1` | URL base da API, incluindo `/api/v1` |

## 🧪 Testes

**Unitários e de componente** (Vitest + Testing Library, `src/**/*.test.ts(x)`): lógica pura (datas UTC, política de senha, rate limit, CSV, denúncias, eventos, status, seleção) e os componentes-chave, testados como o usuário os usa (papéis ARIA, teclado e foco): busca rápida, barra de lote, modal de motivo, formulário de resposta, exportação CSV e visualizador de fotos.

**E2E** (Playwright, `test/e2e`): a API é mockada com `page.route` por uma API falsa **com estado** (`support/mock-api.ts`) e fixtures no formato do contrato (`fixtures/data.ts`), então os testes rodam sem backend e conferem o corpo de cada chamada. Qualquer erro de JavaScript na página reprova o teste.

| Fluxo | Arquivo |
|---|---|
| Login admin → visão geral com pendências · usuário comum vê “acesso restrito” · 429 com contagem regressiva | `auth.e2e-spec.ts` |
| Filtrar denunciadas → ocultar (resolve as denúncias) e descartar | `reports.e2e-spec.ts` |
| Responder, editar e remover a resposta · fotos no visualizador e remoção | `reply.e2e-spec.ts` |
| Moderação em lote: selecionar página, ocultar com motivo e restaurar | `bulk.e2e-spec.ts` |
| Exportar CSV de avaliações (filtros atuais), usuários e atividade | `export.e2e-spec.ts` |
| Remover duplicados com confirmação e resumo | `dedupe.e2e-spec.ts` |
| Busca rápida: <kbd>Ctrl</kbd> <kbd>K</kbd>, setas, <kbd>Enter</kbd>, <kbd>Esc</kbd> e foco | `command-palette.e2e-spec.ts` |

> [!TIP]
> Localmente o Playwright usa o **Chrome instalado** (`channel: "chrome"`) e reaproveita o `npm run dev`. Com `E2E_REAL_API=1`, o global-setup faz login uma vez e guarda a sessão em `test/.auth/` (a API aceita só 5 logins por minuto); os testes que alteram dados são pulados.

No CI (`testings.yml`) rodam lint, tipos dos E2E, testes, build e os E2E (com o Chromium do Playwright, contra o build servido pelo `vite preview`); o relatório do Playwright fica como artefato. O **Dependabot** abre uma PR semanal agrupada para o npm e uma mensal para as actions.

## 🐳 Docker e deploy

As imagens são publicadas **privadas** no GitHub Container Registry: `ghcr.io/erikomis/dashboard-production-review-react`. A URL da API entra como `--build-arg VITE_API_URL`, porque o Vite embute o valor no bundle durante o build.

```bash
docker build --build-arg VITE_API_URL=http://localhost:8084/api/v1 -t dashboard-production-review-react .
docker run -p 5173:5173 dashboard-production-review-react   # http://localhost:5173
```

```mermaid
flowchart LR
    T["testings<br/>lint + vitest + build + E2E<br/>push na main"] -->|sucesso| P["publish<br/>build do commit testado"]
    P --> GHCR[("ghcr.io (privado)<br/>latest · sha-commit")]
    GHCR --> D["deploy<br/>login temporário + pull + up"]
    D --> VPS["VPS<br/>docker compose"]
```

- **publish**: só roda depois que os testes do push na `main` passam; builda exatamente o commit testado e publica as tags `latest` e `sha-<commit>`, autenticando com o `GITHUB_TOKEN` do próprio workflow.
- **deploy**: entra na VPS por SSH, faz login no GHCR com o token temporário do job, sobe a imagem daquele commit e faz logout. **Nenhuma credencial fica salva na VPS.**

| Tipo | Nome | Para quê |
|---|---|---|
| Secret | `HOST`, `USERNAME`, `SSH_KEY` | Acesso SSH à VPS |
| Variável | `VITE_API_URL` | URL da API embutida no build (ex.: `https://api.seudominio.com/api/v1`). Sem ela, o publish falha com uma mensagem clara |
| Variável (opcional) | `DEPLOY_DIR` | Pasta do `docker-compose.yml` na VPS (padrão: `dashboard-frontend`) |

> [!IMPORTANT]
> Antes do primeiro deploy, copie o `docker-compose.yml` deste repositório para a pasta da VPS. Depois do primeiro publish, confira em **Perfil → Packages → dashboard-production-review-react → Package settings** que a visibilidade está **Private**.

## 🏛 Arquitetura

Cada tela segue **MVVM**: a view é puramente visual e toda a lógica fica no _view-model_ (um hook), que usa hooks do React Query e services para falar com a API.

```mermaid
flowchart LR
    Page["XxxPage.tsx<br/><i>compõe</i>"] --> Model["xxx.model.tsx<br/><i>view-model (hook)</i>"]
    Page --> View["xxx.view.tsx<br/><i>apresentação</i>"]
    Model --> Schema["xxx.schema.ts<br/><i>validação zod</i>"]
    Model --> Hooks["hooks/useQuery* · useMutation*<br/><i>TanStack Query</i>"]
    Hooks --> Services["services/*.service.ts<br/><i>axios</i>"]
    Services --> API[("production-review-api")]
    API -.->|SSE /notification/sse| Hooks
```

```tsx
// Toda tela segue o mesmo formato
const EditCategoryPage = () => {
  const methods = useEditCategoryModel(); // lógica, estado, queries e handlers
  return <EditCategoryView {...methods} />; // só apresentação
};
```

<details>
<summary><b>📁 Estrutura de pastas</b></summary>

```text
src/
├── environment/            # configuração por ambiente (URL da API)
├── modules/
│   ├── auth/               # login, cadastro, ativação, esqueci/redefinir senha
│   └── dashboard/
│       ├── components/     # Sidebar, Header, busca rápida, PageHeader, StatCard, tabelas, gráficos, moderação, exportação
│       ├── hooks/          # queries, mutations, SSE de notificações, slug...
│       ├── schemas/        # schemas zod compartilhados do catálogo
│       ├── services/       # chamadas /category, /sub-categorie, /production, /review e /admin/*
│       ├── utils/          # lógica pura testada: eventos, status, progresso, gráficos, datas relativas
│       └── view/           # uma pasta por tela: home, *-list, create-*, edit-*, import-catalog,
│                           # users, activity, profile, settings
├── shared/                 # componentes (modal, painel lateral, visualizador), hooks, tipos, utilitários e preferências
├── ProtectedRouter.tsx     # guarda de rota: sessão + perfil ADMIN
└── routes.tsx
test/e2e/                   # Playwright: specs, fixtures e a API mockada
```

</details>

### Integração com a API

| Recurso | Endpoints |
|---|---|
| Categorias | `GET /category/list` · `GET/PUT/DELETE /category/{id}` · `POST /category/` |
| Subcategorias | `GET /sub-categorie/list` · `GET/PUT/DELETE /sub-categorie/{id}` · `POST /sub-categorie/create` |
| Produtos | `GET /production/list?search&categoryId&subCategorieId&onlyRated&property&sort` · `GET /production/{id}` · `POST /production/add` · `PUT /production/update/{id}` · `DELETE /production/delete/{id}` |
| Imagens | `POST /production/file` (multipart) · `DELETE /production/file/{id}` |
| Avaliações | `GET /review/list` · `GET/PUT/DELETE /review/{id}` · `POST /review/` |
| Moderação | `GET /admin/reviews?status&note&productId&search&reported` · `PATCH /admin/reviews/{id}/moderation` · `PATCH /admin/reviews/moderation` (lote) |
| Denúncias | `GET /admin/reviews/{id}/reports` · `DELETE /admin/reviews/{id}/reports` |
| Resposta e fotos | `PUT/DELETE /admin/reviews/{id}/reply` · `DELETE /review/{id}/images/{imageId}` · `GET /files/**` |
| Exportação | `GET /admin/reviews/export.csv` · `GET /admin/users/export.csv` · `GET /admin/activity/export.csv` |
| Catálogo | `POST /admin/catalog/deduplicate` · `GET /production/suggest?q&limit` (busca rápida) |
| Usuários | `GET /admin/users?search&role&active` · `PATCH /admin/users/{id}/admin` · `PATCH /admin/users/{id}/active` |
| Estatísticas | `GET /admin/stats?days=7\|30\|90` |
| Importação | `POST /admin/import/open-food-facts` · `GET /admin/import/jobs/{id}` (polling a cada 2 s) · `GET /admin/import/jobs/latest` |
| Auditoria | `GET /admin/activity?type&entityType&search&from&to` · `GET /admin/activity/summary?from&to` |
| Tempo real | `GET /notification/sse` |
| Sessão | `POST /auth/sign-in` · `POST /auth/refresh-token` · `POST /auth/logout` · `GET /user/me` |

> [!NOTE]
> As rotas `/admin/*` exigem o perfil **ADMIN**. A auditoria passa pela API, que repassa para o serviço de logs; se ele estiver fora do ar, a tela mostra **“Serviço de auditoria indisponível”** com a opção de tentar novamente.

### Decisões de UX

- **Moderação dentro de Avaliações**, como abas *Todas · Visíveis · Ocultas*: é a mesma entidade e o administrador modera a partir da lista que já usa, sem alternar entre telas. `/dashboard/moderation` abre direto a aba *Ocultas*.
- **Nota média em gráfico separado**, alinhado pelo mesmo eixo de datas e com tooltips sincronizados: contagem e nota têm escalas diferentes, e dois eixos Y no mesmo gráfico sugeririam correlações que não existem.
- **Filtros na URL** (produtos, avaliações, usuários, atividade e período da visão geral): dá para compartilhar e voltar com o navegador sem perder o contexto.
- **Denúncias como aba** (*Denunciadas*): é o mesmo fluxo de moderação. O selo da linha abre um **painel lateral** com a avaliação inteira, as denúncias e a resposta, para decidir sem sair da lista. **Ocultar** a partir das denúncias já vem com um motivo sugerido (ex.: “Ocultada após 3 denúncias (spam).”), editável.
- **Lote só onde faz sentido**: “Ocultar selecionadas” conta só as visíveis e “Restaurar selecionadas” só as ocultas; a seleção vale para a página e zera ao trocar filtros ou página.
- **Busca rápida** em vez da busca de produtos no header: um único lugar para ir a qualquer tela, executar ações comuns e achar produtos (a partir de 2 letras, com debounce).
- **Datas**: a API devolve ISO-8601 em UTC (`Z`) e o painel mostra no fuso do navegador; datas sem hora (`AAAA-MM-DD`, dos gráficos) são dias do calendário, sem voltar um dia no Brasil.
- **Avisos no topo**: os toasts ficam no canto superior direito para não cobrir a barra de ações em lote.

## ♿ Acessibilidade

- **Formulários**: labels associados com indicação de obrigatório, erros ligados por `aria-describedby` + `aria-invalid` e foco automático no primeiro campo inválido.
- **Teclado**: foco sempre visível, link **"Pular para o conteúdo"**, menus com setas e <kbd>Esc</kbd>, e gaveta mobile que fecha com <kbd>Esc</kbd>.
- **Modal de confirmação**: `role="alertdialog"`, foco preso dentro do modal, <kbd>Esc</kbd> fecha e o foco volta para quem abriu. Diálogos empilhados (ex.: confirmar dentro do painel lateral) respondem ao teclado só o de cima.
- **Busca rápida**: combobox ARIA completo (`aria-expanded`, `aria-controls`, `aria-activedescendant`, grupos nomeados), foco preso, setas, <kbd>Enter</kbd>, <kbd>Esc</kbd> e atalhos visíveis no rodapé.
- **Seleção em lote**: checkboxes nativos com rótulo por linha, “selecionar página” com estado misto (`aria-checked="mixed"`) e a barra como região nomeada com a contagem em `aria-live`.
- **Visualizador de fotos**: diálogo modal com setas ← →, miniaturas, posição anunciada (“Foto 2 de 3”) e texto alternativo.
- **Tabelas**: `<caption>` e `<th scope="col">`; botões só com ícone têm `aria-label` e tooltip.
- **Navegação**: `aria-current` no menu, breadcrumb e paginação; foco vai para o conteúdo a cada troca de rota.
- **Feedback**: `aria-live` em contadores, paginação e notificações; nota em estrelas como grupo de rádios.
- **Gráficos**: título, descrição, resumo em texto, `<title>`/`<desc>` no SVG e a tabela de dados em “Ver dados em tabela”; cores validadas para contraste e daltonismo nos dois temas.
- **Progresso e ações**: barra com `role="progressbar"` e `aria-valuetext`, e regiões `aria-live` para o passo da importação, a moderação e as ações em usuários.
- **Ações bloqueadas**: continuam focáveis (`aria-disabled`) para o tooltip explicar por que não estão disponíveis.
- **Contraste**: tokens dedicados para manter AA também no modo escuro, e `prefers-reduced-motion` respeitado.

## 🎨 Design system

Mesma identidade visual do [site ReviewStore](https://github.com/erikomis/dashboard-production-review-site): mesma marca, paleta e tipografia.

| Token | Cor | Uso |
|---|---|---|
| `primary` | ![#3C50E0](https://img.shields.io/badge/%233C50E0-3C50E0?style=flat-square) | Botões, links, item ativo e marca |
| `black` | ![#1C2434](https://img.shields.io/badge/%231C2434-1C2434?style=flat-square) | Menu lateral e títulos |
| `body` | ![#64748B](https://img.shields.io/badge/%2364748B-64748B?style=flat-square) | Texto auxiliar |
| `whiten` | ![#F1F5F9](https://img.shields.io/badge/%23F1F5F9-F1F5F9?style=flat-square) | Fundo da página |
| `boxdark` | ![#24303F](https://img.shields.io/badge/%2324303F-24303F?style=flat-square) | Superfícies no modo escuro |
| `star` | ![#D97706](https://img.shields.io/badge/%23D97706-D97706?style=flat-square) | Estrelas das avaliações e linha da nota média |

Nos gráficos, as barras usam `primary` no tema claro e `#6577F3` no escuro (o `primary` puro perde contraste sobre `boxdark`).

**Tipografia:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) nos títulos e [Inter](https://fonts.google.com/specimen/Inter) no texto.

## 🧩 Ecossistema Production Review

| Projeto | Descrição |
|---|---|
| [**production-review-api**](https://github.com/erikomis/production-review-api) | API REST em Spring Boot: autenticação, catálogo e avaliações |
| **production-review-api-logs** | Serviço de auditoria: consome os eventos do Kafka e grava no MongoDB (lido pela tela Atividade via API) |
| [**dashboard-production-review-site**](https://github.com/erikomis/dashboard-production-review-site) | Site público onde as pessoas avaliam produtos |
| [**dashboard-production-review-react**](https://github.com/erikomis/dashboard-production-review-react) | Este repositório: painel administrativo |

<div align="center">
<br />
<sub>Feito com ☕ e TypeScript.</sub>
</div>
