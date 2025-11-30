# 🚀 Configurar Banco de Dados na Vercel

Este guia vai te ajudar a configurar o banco de dados PostgreSQL na Vercel para que o projeto funcione em produção.

---

## 📋 Passo 1: Verificar Variáveis de Ambiente na Vercel

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto (`blogo.com.br`)
3. Vá em **Settings** → **Environment Variables**
4. Verifique se as seguintes variáveis estão configuradas:

### Variáveis Obrigatórias:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/track4you?schema=public
JWT_SECRET=sua-chave-secreta-aqui
APP_URL=https://www.blogo.com.br
META_API_VERSION=v21.0
```

---

## 🔍 Passo 2: Verificar Status do Banco

Acesse esta URL no navegador para verificar o status do banco:

```
https://www.blogo.com.br/api/health/db
```

**O que você deve ver se estiver OK:**
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "urlConfigured": true,
    "tablesFound": 7,
    "tables": ["User", "Domain", "Pixel", "Channel", "Funnel", "Postback", "Event"]
  }
}
```

**Se houver erro, você verá:**
```json
{
  "status": "error",
  "database": {
    "connected": false,
    "error": {
      "code": "P1001",
      "message": "..."
    }
  },
  "troubleshooting": {
    "steps": [...]
  }
}
```

---

## ❌ Problemas Comuns

### Erro P1001: "Can't reach database server"

**Causa:** O PostgreSQL não está acessível do servidor da Vercel

**Soluções:**
1. Se você está usando um banco local/hospedado localmente:
   - ❌ Não vai funcionar! A Vercel precisa acessar um banco público
   - ✅ Use um serviço de banco hospedado (Supabase, Railway, Neon, etc.)

2. Se você está usando um banco hospedado:
   - Verifique se o firewall permite conexões do IP da Vercel
   - Alguns serviços permitem conexões de qualquer IP (0.0.0.0/0)
   - Verifique as configurações de segurança do seu banco

### Erro P1000: "Authentication failed"

**Causa:** Senha incorreta no DATABASE_URL

**Solução:**
1. Vá em **Settings** → **Environment Variables** na Vercel
2. Verifique se o `DATABASE_URL` tem a senha correta
3. Formato correto: `postgresql://usuario:senha@host:porta/banco?schema=public`
4. **Importante:** Não use espaços ou caracteres especiais sem codificar na URL

### Erro P1003: "Database does not exist"

**Causa:** O banco `track4you` não foi criado

**Solução:**
1. Conecte ao seu PostgreSQL (via cliente ou terminal)
2. Execute: `CREATE DATABASE track4you;`
3. Depois execute: `npx prisma db push` (localmente ou via Vercel CLI)

---

## 🔧 Passo 3: Criar Tabelas no Banco de Produção

### Opção A: Via Vercel CLI (Recomendado)

1. Instale a Vercel CLI:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Execute o Prisma:
```bash
vercel env pull .env.local  # Baixar variáveis de ambiente
npx prisma generate
npx prisma db push
```

### Opção B: Via Script de Build na Vercel

Adicione no `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma db push && next build"
  }
}
```

Isso vai criar as tabelas automaticamente a cada deploy.

---

## 📊 Passo 4: Verificar Logs da Vercel

1. Vá em **Deployments** → Selecione o último deploy
2. Clique em **Functions** → Selecione uma função
3. Veja os logs - agora eles mostram detalhes sobre erros de banco

Procure por mensagens que começam com:
- `❌ [Middleware]` - Erros de conexão no middleware
- `❌ [Dashboard API]` - Erros nas APIs de analytics
- `❌ [Health Check]` - Erros na verificação de saúde

---

## ✅ Checklist Final

- [ ] `DATABASE_URL` está configurado na Vercel?
- [ ] `JWT_SECRET` está configurado?
- [ ] `APP_URL` está como `https://www.blogo.com.br`?
- [ ] O banco PostgreSQL está acessível publicamente?
- [ ] O banco `track4you` foi criado?
- [ ] As tabelas foram criadas (`npx prisma db push`)?
- [ ] Acessei `/api/health/db` e está retornando `status: "ok"`?

---

## 🆘 Ainda com Problemas?

1. **Acesse `/api/health/db`** e veja o erro específico
2. **Verifique os logs da Vercel** para ver detalhes do erro
3. **Verifique se o banco está acessível** - tente conectar de outro lugar
4. **Verifique o firewall** - alguns serviços bloqueiam conexões externas por padrão

---

## 💡 Serviços Recomendados de PostgreSQL

Se você ainda não tem um banco hospedado, aqui estão opções:

1. **Supabase** (Grátis até certo limite)
   - https://supabase.com
   - Cria banco PostgreSQL automaticamente
   - Interface fácil de usar

2. **Railway** (Grátis com créditos)
   - https://railway.app
   - Deploy fácil de PostgreSQL

3. **Neon** (Grátis até certo limite)
   - https://neon.tech
   - PostgreSQL serverless

4. **Render** (Grátis com limitações)
   - https://render.com
   - PostgreSQL gratuito disponível

Todos esses serviços fornecem uma `DATABASE_URL` pronta para usar na Vercel!

