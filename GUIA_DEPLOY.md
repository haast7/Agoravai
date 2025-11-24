# 🚀 Guia de Deploy - Track4You

Este guia mostra como deixar seu projeto online para testar em produção.

---

## 🎯 Opções de Deploy

### **Opção 1: Vercel (Mais Fácil - Recomendado)**
- ✅ Grátis
- ✅ Deploy automático do GitHub
- ✅ HTTPS automático
- ✅ Banco de dados PostgreSQL (usar Supabase ou Railway)

### **Opção 2: Railway**
- ✅ Grátis (com limites)
- ✅ Deploy fácil
- ✅ PostgreSQL incluso
- ✅ HTTPS automático

### **Opção 3: Render**
- ✅ Grátis (com limites)
- ✅ PostgreSQL incluso
- ✅ HTTPS automático

### **Opção 4: DigitalOcean / AWS / Outros**
- ⚠️ Mais complexo
- 💰 Pode ter custos
- ✅ Mais controle

---

## 🚀 Deploy na Vercel (Recomendado)

### **Passo 1: Preparar o Projeto**

1. **Criar arquivo `.vercelignore`** (opcional):
```
node_modules
.next
.env.local
```

2. **Verificar se o `.env` está no `.gitignore`** (importante para segurança!)

### **Passo 2: Criar Repositório no GitHub**

1. Crie uma conta no GitHub (se não tiver): https://github.com
2. Crie um novo repositório
3. Faça upload do código:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

### **Passo 3: Configurar Banco de Dados Online**

Você precisa de um PostgreSQL online. Opções:

**Opção A: Supabase (Grátis e Fácil)**
1. Acesse: https://supabase.com
2. Crie uma conta
3. Crie um novo projeto
4. Vá em "Settings" → "Database"
5. Copie a "Connection String" (URI)
6. Formato: `postgresql://postgres:[SENHA]@[HOST]:5432/postgres`

**Opção B: Railway (Grátis)**
1. Acesse: https://railway.app
2. Crie uma conta
3. Crie novo projeto → "Provision PostgreSQL"
4. Copie a "DATABASE_URL"

**Opção C: Render (Grátis)**
1. Acesse: https://render.com
2. Crie uma conta
3. Crie novo "PostgreSQL"
4. Copie a "Internal Database URL"

### **Passo 4: Deploy na Vercel**

1. **Acesse:** https://vercel.com
2. **Faça login** com GitHub
3. **Clique em "Add New Project"**
4. **Importe seu repositório** do GitHub
5. **Configure as variáveis de ambiente:**

   Clique em "Environment Variables" e adicione:

   ```
   DATABASE_URL = postgresql://... (do Supabase/Railway/Render)
   JWT_SECRET = sua-chave-secreta-super-longa-e-aleatoria
   APP_URL = https://seu-projeto.vercel.app
   META_API_VERSION = v21.0
   ```

6. **Configure o Build:**

   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (já vem configurado)
   - Output Directory: `.next` (já vem configurado)
   - Install Command: `npm install`

7. **Clique em "Deploy"**

8. **Aguarde o deploy terminar** (pode demorar alguns minutos)

9. **Configure o Banco de Dados:**

   Após o deploy, você precisa rodar as migrations:

   **Opção 1: Via Vercel CLI (Recomendado)**
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   vercel env pull .env.local
   npx prisma generate
   npx prisma db push
   ```

   **Opção 2: Via Terminal do Vercel (Dashboard)**
   - Vá em "Settings" → "Functions"
   - Use o terminal integrado

   **Opção 3: Criar uma API Route temporária:**
   Crie `app/api/setup/route.ts` (vou criar isso abaixo)

### **Passo 5: Configurar Webhook do Telegram**

1. **Pegue a URL do seu projeto:** `https://seu-projeto.vercel.app`
2. **Configure o webhook:**

   Abra no navegador (substitua pelos seus valores):
   ```
   https://api.telegram.org/botSEU_TOKEN/setWebhook?url=https://seu-projeto.vercel.app/api/telegram/webhook
   ```

3. **Se aparecer `{"ok":true}`, está funcionando!** ✅

### **Passo 6: Atualizar APP_URL**

1. No Vercel, vá em "Settings" → "Environment Variables"
2. Atualize `APP_URL` para: `https://seu-projeto.vercel.app`
3. Faça um novo deploy (ou aguarde o redeploy automático)

---

## 🔧 Setup do Banco de Dados Após Deploy

Após fazer o deploy, você precisa criar as tabelas no banco. Temos 3 opções:

### **Opção 1: Via API Route Temporária (Mais Fácil)**

1. **Após o deploy, acesse:**
   ```
   https://seu-projeto.vercel.app/api/setup
   ```

2. **Se aparecer sucesso, está configurado!** ✅

3. **IMPORTANTE: Delete o arquivo `app/api/setup/route.ts` após configurar!**

### **Opção 2: Via Vercel CLI**

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

### **Opção 3: Via Terminal do Vercel**

1. No dashboard do Vercel, vá em "Settings" → "Functions"
2. Use o terminal integrado
3. Execute:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## 📝 Checklist de Deploy

### **Antes do Deploy:**
- [ ] Código no GitHub
- [ ] `.env` está no `.gitignore` (segurança!)
- [ ] Banco de dados PostgreSQL criado (Supabase/Railway/Render)
- [ ] Variáveis de ambiente anotadas

### **Durante o Deploy:**
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `APP_URL` (será preenchido automaticamente)
- [ ] Deploy iniciado

### **Após o Deploy:**
- [ ] Acessar `/api/setup` para configurar banco
- [ ] Criar conta no sistema (`/login`)
- [ ] Configurar webhook do Telegram
- [ ] Testar criação de Pixel, Canal, Funil
- [ ] **Deletar rota `/api/setup`** (segurança!)

---

## 🎯 Próximos Passos Após Deploy

1. **Criar sua conta:**
   - Acesse: `https://seu-projeto.vercel.app/login`
   - Clique em "Criar conta"
   - Faça login

2. **Configurar Pixel:**
   - Vá em "Pixels" → "Novo"
   - Adicione ID do Pixel e Token

3. **Configurar Canal:**
   - Vá em "Canais" → "Novo"
   - Adicione nome, bot e token

4. **Criar Funil:**
   - Vá em "Funis" → "Criar Funil"
   - Conecte Pixel + Domínio + Canal
   - Copie o script e o link

5. **Configurar Webhook:**
   - Acesse: `https://api.telegram.org/botSEU_TOKEN/setWebhook?url=https://seu-projeto.vercel.app/api/telegram/webhook`
   - Se aparecer `{"ok":true}`, está funcionando!

6. **Adicionar Script no Site:**
   - Cole o script no `<head>` da sua página
   - Use o link gerado no botão do Telegram

7. **Testar:**
   - Visite a página → PageView registrado ✅
   - Clique no link → Clique registrado ✅
   - Entre no grupo → Enter Channel registrado ✅

---

## 🔒 Segurança

### **Importante:**
- ✅ Nunca commite o `.env` no Git
- ✅ Use `JWT_SECRET` forte e aleatório
- ✅ Delete a rota `/api/setup` após configurar
- ✅ Use HTTPS sempre (Vercel já fornece)

### **Variáveis Sensíveis:**
- `DATABASE_URL` - Contém senha do banco
- `JWT_SECRET` - Usado para autenticação
- Tokens do Telegram e Meta - Não compartilhe!

---

## 🆘 Troubleshooting

### **Erro: "Database connection failed"**
- Verifique se `DATABASE_URL` está correto no Vercel
- Verifique se o banco permite conexões externas
- No Supabase: Settings → Database → Connection Pooling

### **Erro: "Prisma Client not generated"**
- Execute: `npx prisma generate` localmente
- Faça commit e push novamente

### **Webhook não funciona**
- Verifique se a URL está correta
- Verifique se o bot token está correto
- Teste acessando: `https://api.telegram.org/botSEU_TOKEN/getWebhookInfo`

### **Script não carrega**
- Verifique se o `APP_URL` está correto no Vercel
- Verifique se o script ID está correto
- Abra o console do navegador para ver erros

---

## 💡 Dicas

1. **Use Supabase** - É grátis e muito fácil de configurar
2. **Deploy automático** - Conecte GitHub ao Vercel para deploy automático
3. **Monitore logs** - Vercel mostra logs em tempo real
4. **Teste antes** - Teste localmente primeiro com ngrok

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no Vercel
2. Verifique o console do navegador
3. Verifique se todas as variáveis estão configuradas
4. Consulte `GUIA_CONFIGURACAO.md` para detalhes

---

**Pronto! Agora você tem seu sistema online e funcionando! 🎉**

