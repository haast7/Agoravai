# Track4You - Sistema de Tracking para Conversões no Telegram

Sistema completo de tracking de conversões integrado com Meta Pixel e Telegram Bot.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para PostgreSQL
- **Tailwind CSS** - Estilização
- **Telegram Bot API** - Integração com Telegram
- **Meta Conversions API** - Integração com Meta Pixel

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- Conta no Telegram (para criar bot)
- Conta no Meta Business (para Pixel)

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` (copie do `.env.example`)

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma db push
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📚 Documentação

- **`GUIA_CONFIGURACAO.md`** - Guia completo de configuração passo a passo
- **`GUIA_TESTE_COMPLETO_LOCAL.md`** ⭐ - **Guia completo para testar TUDO localmente primeiro**
- **`GUIA_TESTE_LOCAL.md`** - Resumo rápido de teste local
- **`GUIA_DEPLOY.md`** - Como fazer deploy online (Vercel, Railway, etc.) - **Use depois de testar localmente**
- **`TROUBLESHOOTING.md`** - Solução de problemas comuns

## 🚀 Deploy Rápido

### Opção 1: Vercel (Recomendado)

1. Faça push do código para GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Configure as variáveis de ambiente:
   - `DATABASE_URL` (use Supabase, Railway ou Render)
   - `JWT_SECRET` (qualquer string longa e aleatória)
   - `APP_URL` (será preenchido automaticamente após deploy)
4. Após o deploy, acesse `/api/setup` para configurar o banco
5. Delete a rota `/api/setup` após configurar

### Opção 2: Railway

1. Acesse [railway.app](https://railway.app)
2. Crie novo projeto → "Deploy from GitHub"
3. Adicione serviço PostgreSQL
4. Configure variáveis de ambiente
5. Deploy automático!

Consulte `GUIA_DEPLOY.md` para instruções detalhadas.



