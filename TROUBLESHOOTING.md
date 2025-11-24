# 🔧 Troubleshooting - Erro 500 no Login

Se você está recebendo erro 500 ao tentar fazer login, siga estes passos:

---

## ✅ Checklist Rápido

### 1. **Verificar Variáveis de Ambiente no Vercel**

No dashboard do Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Verifique se estas variáveis estão configuradas:
   - ✅ `DATABASE_URL` - URL de conexão do PostgreSQL
   - ✅ `JWT_SECRET` - Chave secreta para tokens (qualquer string longa)
   - ✅ `APP_URL` - URL do seu projeto (ex: `https://seu-projeto.vercel.app`)
   - ✅ `META_API_VERSION` - `v21.0`

**Se alguma estiver faltando, adicione e faça um novo deploy!**

---

### 2. **Configurar o Banco de Dados**

O banco precisa ter as tabelas criadas. Faça um destes:

**Opção A: Via API Route (Mais Fácil)**
1. Acesse: `https://seu-projeto.vercel.app/api/setup`
2. Se aparecer sucesso, está configurado!
3. **IMPORTANTE:** Delete a rota `/api/setup` após configurar (segurança)

**Opção B: Via Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

**Opção C: Via Terminal do Vercel**
1. No dashboard do Vercel, vá em **Settings** → **Functions**
2. Use o terminal integrado
3. Execute:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

### 3. **Verificar Conexão do Banco**

**Se você está usando Supabase:**
- Verifique se o projeto está ativo
- Use a **Connection String** completa (não a Connection Pooling)
- Formato: `postgresql://postgres:[SENHA]@[HOST]:5432/postgres`

**Se você está usando Railway:**
- Verifique se o serviço PostgreSQL está rodando
- Use a **DATABASE_URL** do serviço

**Se você está usando Render:**
- Verifique se o banco está ativo
- Use a **Internal Database URL**

---

### 4. **Criar Primeira Conta**

Após configurar o banco:
1. Acesse: `https://seu-projeto.vercel.app/login`
2. Clique em **"Não tem conta? Registre-se"**
3. Preencha os dados e crie sua conta
4. Faça login normalmente

---

## 🐛 Erros Comuns

### Erro: "Can't reach database server"
- **Causa:** Banco não está acessível ou `DATABASE_URL` incorreta
- **Solução:** Verifique a `DATABASE_URL` no Vercel e se o banco está ativo

### Erro: "Table 'User' does not exist"
- **Causa:** Tabelas não foram criadas
- **Solução:** Execute `npx prisma db push` ou acesse `/api/setup`

### Erro: "JWT_SECRET não configurada"
- **Causa:** Variável `JWT_SECRET` não está no Vercel
- **Solução:** Adicione no Vercel → Settings → Environment Variables

### Erro: "Credenciais inválidas"
- **Causa:** Email ou senha incorretos, OU usuário não existe
- **Solução:** Crie uma conta primeiro em `/login` → "Registre-se"

---

## 📞 Verificar Logs no Vercel

Para ver erros detalhados:
1. No dashboard do Vercel
2. Vá em **Deployments** → Clique no último deploy
3. Vá em **Functions** → Clique em `/api/auth/login`
4. Veja os logs para identificar o erro específico

---

## ✅ Teste Rápido

1. Acesse: `https://seu-projeto.vercel.app/api/setup`
   - Se aparecer erro de conexão → Problema com `DATABASE_URL`
   - Se aparecer sucesso → Banco configurado ✅

2. Tente criar conta em: `https://seu-projeto.vercel.app/login`
   - Se aparecer erro 500 → Verifique logs no Vercel
   - Se funcionar → Tudo OK! ✅

---

## 🆘 Ainda com Problemas?

1. Verifique os logs no Vercel (Deployments → Functions → Logs)
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Verifique se o banco de dados está ativo e acessível
4. Tente acessar `/api/setup` para verificar a conexão

