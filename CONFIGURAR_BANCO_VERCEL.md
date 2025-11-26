# 🗄️ Como Configurar Banco PostgreSQL no Vercel

## ⚠️ Problema

O erro "configuração do banco de dados não encontrada" acontece porque:
- O Vercel **NÃO consegue acessar** `localhost` ou `127.0.0.1`
- Você precisa de um **banco PostgreSQL na nuvem**

---

## 🚀 Solução Rápida: Supabase (Recomendado - Grátis)

### Passo 1: Criar Conta no Supabase

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Faça login com GitHub (mais rápido)

---

### Passo 2: Criar Novo Projeto

1. Clique em **"New Project"**
2. Preencha:
   - **Name**: `trackpixel` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte (ANOTE ELA!)
   - **Region**: Escolha a mais próxima (ex: `South America`)
3. Clique em **"Create new project"**
4. Aguarde alguns minutos (criação do banco)

---

### Passo 3: Obter Connection String

⚠️ **IMPORTANTE:** Use **Session Pooler** ao invés de Direct Connection para o Vercel!

1. No projeto criado, vá em **"Settings"** (ícone de engrenagem)
2. Clique em **"Database"** no menu lateral
3. Role até **"Connection string"**
4. Configure os dropdowns:
   - **Type:** `URI` ✅
   - **Source:** `Primary Database` (única opção disponível) ✅
   - **Method:** `Session pooler` ⭐ (NÃO use "Direct connection")
5. **COPIE a string completa** que aparece (parece: `postgresql://postgres.abc123:SUA_SENHA@[HOST].pooler.supabase.com:6543/postgres`)

**Exemplo:**
```
postgresql://postgres.abcdefghijklmnop:SUA_SENHA_AQUI@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

**Por que Session Pooler?**
- ✅ Compatível com IPv4 (Vercel usa IPv4)
- ✅ Recomendado pelo Supabase para redes IPv4
- ✅ Funciona perfeitamente com Vercel Functions (serverless)
- ✅ Alternativa ao Direct Connection quando precisa de IPv4

**Opções de Method:**
- ✅ **Session pooler** - Recomendado para Vercel (IPv4)
- ✅ **Transaction pooler** - Também funciona, mas Session é melhor para IPv4
- ❌ **Direct connection** - NÃO funciona no Vercel (usa IPv6)

---

### Passo 4: Configurar no Vercel

1. Acesse o **dashboard do Vercel**: https://vercel.com
2. Vá no seu projeto
3. Clique em **"Settings"** → **"Environment Variables"**
4. Adicione/Edite a variável:

   **Key:** `DATABASE_URL`
   
   **Value:** Cole a Connection String que você copiou do Supabase
   
   **Environment:** Marque todas (Production, Preview, Development)
   
5. Clique em **"Save"**

---

### Passo 5: Configurar Outras Variáveis (Se ainda não fez)

Adicione também:

- **`JWT_SECRET`**: Qualquer string longa e aleatória (ex: `minha-chave-super-secreta-123456789`)
- **`APP_URL`**: `https://seu-projeto.vercel.app` (substitua pelo seu domínio)
- **`META_API_VERSION`**: `v21.0`

---

### Passo 6: Criar Tabelas no Banco

Após configurar a `DATABASE_URL`, você precisa criar as tabelas:

**Opção A: Via API Route (Mais Fácil)**

1. Acesse: `https://seu-projeto.vercel.app/api/setup`
2. Se aparecer sucesso, está configurado! ✅
3. **IMPORTANTE:** Delete a rota `/api/setup` após configurar (segurança)

**Opção B: Via Vercel CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Linkar projeto
vercel link

# Baixar variáveis de ambiente
vercel env pull .env.local

# Configurar banco
npx prisma generate
npx prisma db push
```

---

## 🔄 Fazer Novo Deploy

Após adicionar a `DATABASE_URL`:

1. No Vercel, vá em **"Deployments"**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o deploy terminar

---

## ✅ Testar

1. Acesse: `https://seu-projeto.vercel.app/login`
2. Tente fazer login (ou criar conta)
3. Se funcionar, está tudo certo! 🎉

---

## 🆘 Problemas Comuns

### Erro: "Can't reach database server" ou "Não foi possível acessar o servidor"

**Causa:** Usando Direct Connection ao invés de Session Pooler

**Solução:**
- ⚠️ **USE SESSION POOLER!** Não use "Direct connection"
- No Supabase, vá em **Settings** → **Database** → **Connection string**
- Configure:
  - **Source:** `Connection Pooling` (NÃO "Primary Database")
  - **Method:** `Session mode`
- Copie a nova Connection String (deve ter `.pooler.supabase.com` na URL)
- Atualize no Vercel e faça novo deploy

---

### Erro: "password authentication failed"

**Causa:** Senha errada na Connection String

**Solução:**
- No Supabase, vá em **Settings** → **Database**
- Clique em **"Reset database password"**
- Copie a nova Connection String
- Atualize no Vercel

---

### Erro: "relation does not exist"

**Causa:** Tabelas não foram criadas

**Solução:**
- Acesse `/api/setup` para criar as tabelas
- Ou rode `npx prisma db push` via CLI

---

## 📝 Checklist

- [ ] Conta criada no Supabase
- [ ] Projeto criado no Supabase
- [ ] Connection String copiada (opção URI)
- [ ] `DATABASE_URL` configurada no Vercel
- [ ] `JWT_SECRET` configurada no Vercel
- [ ] `APP_URL` configurada no Vercel
- [ ] `META_API_VERSION` configurada no Vercel
- [ ] Novo deploy feito no Vercel
- [ ] Tabelas criadas via `/api/setup`
- [ ] Login funcionando ✅

---

## 💡 Alternativas ao Supabase

Se preferir outras opções:

### Railway (Grátis)
1. Acesse: https://railway.app
2. Crie conta → Novo projeto → "Provision PostgreSQL"
3. Copie a `DATABASE_URL`
4. Configure no Vercel

### Render (Grátis)
1. Acesse: https://render.com
2. Crie conta → Novo "PostgreSQL"
3. Copie a "Internal Database URL"
4. Configure no Vercel

---

## 🎯 Próximos Passos

Após configurar o banco:

1. ✅ Criar sua conta no sistema
2. ✅ Configurar Pixel
3. ✅ Configurar Canal
4. ✅ Criar Funil
5. ✅ Configurar Webhook do Telegram

---

**Dica:** O Supabase é a opção mais fácil e rápida! 🚀

