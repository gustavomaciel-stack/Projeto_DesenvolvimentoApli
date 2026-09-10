# MatchPoint

Sistema web para organizar partidas esportivas entre amigos. Usuários podem criar partidas, acompanhar vagas, entrar ou sair de uma partida e consultar participantes.

## Status

MVP implementado. O backend está preparado para execução local e publicação no Render. O frontend está preparado para build com Vite e publicação na Vercel, após configurar a URL de produção da API.

## Tecnologias

- Frontend: React, TypeScript e Vite
- Backend: Node.js, Express e TypeScript
- ORM: Prisma
- Banco: PostgreSQL, com suporte ao Neon
- Deploy planejado: Vercel, Render e Neon

## Arquitetura

O backend usa arquitetura em camadas:

- `routes`: definição dos endpoints
- `controllers`: entrada e resposta HTTP
- `services`: regras de negócio
- `repositories`: acesso ao banco via Prisma
- `middlewares`: CORS, erros e rota não encontrada
- `config`: ambiente e cliente Prisma
- `prisma`: schema e migrations

O frontend permanece na raiz do projeto e é organizado em componentes, contexto e serviço HTTP.

## Estrutura principal

```text
src/
  components/
  context/
  services/
  App.tsx
backend/
  prisma/
    migrations/
    schema.prisma
  src/
    config/
    controllers/
    errors/
    middlewares/
    repositories/
    routes/
    services/
    server.ts
```

## Executar localmente

### Backend

Crie `backend/.env` a partir de `backend/.env.example`:

```env
DATABASE_URL="sua_url_do_postgresql"
PORT=3001
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

Depois execute:

```bash
cd backend
npm install
npm run prisma:generate
npm run build
npm run dev
```

Backend local: `http://localhost:3001`

### Frontend

Crie `.env` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

Depois execute na raiz:

```bash
npm install
npm run build
npm run dev
```

Frontend local: `http://localhost:5173`

## Endpoints principais

- `GET /health`
- `POST /users`
- `GET /users`
- `GET /users/:id`
- `POST /matches`
- `GET /matches`
- `GET /matches/:id`
- `PUT /matches/:id`
- `PATCH /matches/:id/cancel`
- `POST /matches/:id/join`
- `POST /matches/:id/leave`
- `GET /matches/:id/participants`

## Variáveis de produção

### Render

Configure no serviço do backend:

```env
DATABASE_URL=sua_url_do_neon
PORT=10000
CORS_ORIGIN=https://sua-url-da-vercel
NODE_ENV=production
```

Build command:

```bash
npm install && npm run prisma:generate && npm run build
```

Start command:

```bash
npm start
```

Para aceitar desenvolvimento local e produção, `CORS_ORIGIN` pode receber origens separadas por vírgula:

```env
CORS_ORIGIN=http://localhost:5173,https://sua-url-da-vercel
```

### Vercel

Configure:

```env
VITE_API_URL=https://sua-url-do-backend-no-render
```

O build gera a pasta `dist`.

## Links da entrega

- GitHub: https://github.com/gustavomaciel-stack/Projeto_DesenvolvimentoApli
- Frontend Vercel: `[PENDENTE: adicionar URL após publicação]`
- Backend Render: https://matchpoint-backend-2zsu.onrender.com
- Banco Neon: `[PENDENTE: referência do projeto/banco]`

## Integrantes

- `[PENDENTE: informar nomes dos integrantes]`

## Segurança

Não versione `.env`, senhas, tokens ou URLs completas de conexão. Use os arquivos `.env.example` apenas como documentação das variáveis necessárias.
