# 🧪 Guia Completo de Teste Local - Track4You

Este guia vai te ajudar a testar **TUDO** localmente antes de fazer deploy. Siga na ordem!

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Node.js 18+ instalado
- ✅ PostgreSQL instalado e rodando
- ✅ Arquivo `.env` configurado corretamente

---

## 🚀 Passo 1: Verificar Configuração Local

### 1.1 Verificar se o PostgreSQL está rodando

**Windows:**
- Abra o "Services" (Serviços)
- Procure por "PostgreSQL"
- Certifique-se de que está "Running" (Em execução)

**Mac/Linux:**
```bash
# Verificar se está rodando
pg_isready

# Ou iniciar se necessário
brew services start postgresql@14  # Mac
sudo systemctl start postgresql    # Linux
```

### 1.2 Verificar arquivo `.env`

Certifique-se de que seu `.env` tem:

```env
# Banco de Dados LOCAL
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/track4you?schema=public"

# JWT Secret (qualquer string longa)
JWT_SECRET="minha-chave-secreta-local-123456789"

# URL local
APP_URL="http://localhost:3000"

# Versão da API do Meta
META_API_VERSION="v21.0"
```

**Importante:** Use `localhost` no `APP_URL` para desenvolvimento local!

---

## 🗄️ Passo 2: Configurar Banco de Dados Local

### 2.1 Criar banco de dados (se ainda não criou)

Abra o terminal e execute:

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE track4you;

# Sair do psql
\q
```

### 2.2 Configurar Prisma

No terminal, na pasta do projeto:

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma db push
```

**Se aparecer sucesso, está tudo certo! ✅**

### 2.3 (Opcional) Verificar tabelas criadas

```bash
# Abrir Prisma Studio (interface visual do banco)
npx prisma studio
```

Isso vai abrir uma interface web em `http://localhost:5555` onde você pode ver todas as tabelas.

---

## 🏃 Passo 3: Iniciar o Servidor

### 3.1 Iniciar em modo desenvolvimento

```bash
npm run dev
```

Você deve ver:
```
✓ Ready on http://localhost:3000
```

### 3.2 Acessar a aplicação

Abra no navegador: **http://localhost:3000**

---

## 👤 Passo 4: Criar Conta e Testar Login

### 4.1 Criar conta

1. Na tela de login, clique em **"Não tem conta? Registre-se"**
2. Preencha:
   - **Nome**: Seu nome
   - **Email**: seu-email@exemplo.com
   - **Senha**: uma senha segura
3. Clique em **"Registrar"**
4. Você deve ser redirecionado para o Dashboard! ✅

### 4.2 Fazer logout e login novamente

1. Clique em **"Sair"** no menu
2. Faça login com o email e senha criados
3. Deve funcionar perfeitamente! ✅

---

## 🎯 Passo 5: Testar Funcionalidades Básicas

### 5.1 Criar Domínio

1. No Dashboard, vá em **"Domínios"**
2. Clique em **"Novo Domínio"**
3. Adicione: `http://localhost:3000` ou `https://meusite.com.br`
4. Clique em **"Salvar"**
5. Deve aparecer na lista! ✅

### 5.2 Criar Pixel

1. Vá em **"Pixels"**
2. Clique em **"Novo"**
3. Preencha:
   - **Nome**: Meu Pixel Teste
   - **ID do Pixel**: Seu ID do Meta Pixel (pode usar um de teste)
   - **Token de Integração**: Seu token do Meta (pode usar um de teste)
4. Clique em **"Salvar"**
5. Deve aparecer na lista! ✅

**Nota:** Para testar completamente, você precisa de um Pixel real do Meta. Mas para testar a interface, pode usar valores de teste.

### 5.3 Criar Canal/Bot

1. Vá em **"Canais"**
2. Clique em **"Novo"**
3. Preencha:
   - **Nome**: Meu Canal Teste
   - **Nome do Bot**: nome_do_seu_bot
   - **Token do Bot**: Token do seu bot do Telegram (obtenha com @BotFather)
   - **ID do Canal**: ID do seu grupo/canal (obtenha com @userinfobot)
   - **Tipo**: Privado ou Público
4. Clique em **"Salvar"**
5. Deve aparecer na lista! ✅

**Como obter Token do Bot:**
1. Abra o Telegram
2. Procure por `@BotFather`
3. Envie `/newbot`
4. Siga as instruções
5. Copie o token fornecido

**Como obter ID do Canal:**
1. Adicione o bot `@userinfobot` no seu grupo/canal
2. Ele vai mostrar o ID (número negativo para grupos)

### 5.4 Criar Funil

1. Vá em **"Funis"**
2. Clique em **"Criar Funil"**
3. Preencha:
   - **Nome**: Meu Funil Teste
   - **Pixel**: Selecione o pixel criado
   - **Domínio**: Selecione o domínio criado
   - **Canal**: Selecione o canal criado
   - **URLs**: Adicione pelo menos 1 URL (ex: `/landing`)
4. Clique em **"Salvar"**
5. Deve aparecer na lista! ✅

### 5.5 Ver Instruções do Funil

1. Na lista de funis, clique no funil criado
2. Deve aparecer:
   - **Script para adicionar no `<head>`**
   - **Link do Telegram para usar no botão**
3. Copie e guarde essas informações! ✅

### 5.6 Criar Postback

1. Vá em **"Postbacks"**
2. Clique em **"Novo"**
3. Preencha:
   - **Tipo**: Selecione (PageView, Cliques, Entrada, Saída)
   - **Nome**: Meu Postback Teste
   - **URL**: `https://webhook.site/unique-id` (use webhook.site para testar)
4. Clique em **"Salvar"**
5. Deve aparecer na lista! ✅

**Para testar postbacks:**
- Use https://webhook.site para criar URLs de teste
- Quando um evento acontecer, você verá a requisição no webhook.site

---

## 📊 Passo 6: Testar Dashboard e Métricas

### 6.1 Visualizar Dashboard

1. Vá em **"Dashboard"**
2. Deve aparecer:
   - Métricas gerais (PageViews, Cliques, Entradas, Saídas)
   - Gráficos (mesmo sem dados ainda)
   - Filtros por Funil e Pixel
3. Tudo deve carregar sem erros! ✅

### 6.2 Testar Filtros

1. No Dashboard, tente filtrar por:
   - Funil específico
   - Pixel específico
   - Período de datas
2. Deve funcionar! ✅

---

## 🔗 Passo 7: Testar Tracking (Com ngrok - Opcional)

Para testar o tracking completo, você precisa expor seu localhost:

### 7.1 Instalar ngrok

**Windows:**
- Baixe em: https://ngrok.com/download
- Extraia e adicione ao PATH

**Mac:**
```bash
brew install ngrok
```

**Ou via npm:**
```bash
npm install -g ngrok
```

### 7.2 Expor localhost

Em um **novo terminal** (deixe o `npm run dev` rodando):

```bash
ngrok http 3000
```

Você vai ver algo como:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 7.3 Atualizar APP_URL temporariamente

No `.env`, mude temporariamente:

```env
APP_URL="https://abc123.ngrok.io"
```

**Importante:** Depois de testar, volte para `http://localhost:3000`!

### 7.4 Configurar Webhook do Telegram

1. Pegue a URL do ngrok: `https://abc123.ngrok.io`
2. Configure o webhook:

Abra no navegador (substitua `SEU_TOKEN` pelo token do seu bot):
```
https://api.telegram.org/botSEU_TOKEN/setWebhook?url=https://abc123.ngrok.io/api/telegram/webhook
```

Se aparecer `{"ok":true}`, está funcionando! ✅

### 7.5 Testar Tracking Completo

1. Crie uma página HTML simples com o script do funil
2. Adicione o script no `<head>`
3. Adicione um botão com o link do Telegram
4. Visite a página → PageView registrado ✅
5. Clique no botão → Clique registrado ✅
6. Entre no grupo via link → Entrada registrada ✅

---

## ✅ Checklist de Teste Completo

### Funcionalidades Básicas
- [ ] Criar conta e fazer login
- [ ] Criar Domínio
- [ ] Criar Pixel
- [ ] Criar Canal/Bot
- [ ] Criar Funil
- [ ] Ver instruções (script e link)
- [ ] Criar Postback

### Dashboard e Métricas
- [ ] Visualizar Dashboard
- [ ] Filtrar por Funil
- [ ] Filtrar por Pixel
- [ ] Filtrar por período

### Tracking (Com ngrok)
- [ ] Configurar webhook do Telegram
- [ ] Testar PageView
- [ ] Testar Clique
- [ ] Testar Entrada no grupo
- [ ] Ver eventos no Dashboard

---

## 🐛 Problemas Comuns

### Erro: "Can't reach database server"
- **Solução:** Verifique se o PostgreSQL está rodando

### Erro: "Table 'User' does not exist"
- **Solução:** Execute `npx prisma db push`

### Erro: "Port 3000 already in use"
- **Solução:** Pare outros processos na porta 3000 ou use outra porta:
  ```bash
  PORT=3001 npm run dev
  ```

### Erro no login: "Credenciais inválidas"
- **Solução:** Crie uma nova conta em "Registre-se"

---

## 🎉 Próximos Passos

Após testar tudo localmente e garantir que está funcionando:

1. ✅ Tudo funcionando localmente
2. 📝 Anotar todas as configurações que funcionaram
3. 🚀 Fazer deploy no Vercel (consulte `GUIA_DEPLOY.md`)
4. 🔧 Configurar variáveis de ambiente no Vercel
5. ✅ Testar em produção

---

## 💡 Dicas

- **Use Prisma Studio** para ver os dados no banco: `npx prisma studio`
- **Use webhook.site** para testar postbacks sem criar servidor próprio
- **Use ngrok** apenas quando precisar testar webhooks do Telegram
- **Mantenha o `.env` local** separado do `.env` de produção

---

**Agora você tem tudo pronto para testar localmente! 🎉**



