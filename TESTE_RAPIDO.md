# ⚡ Teste Rápido - 5 Minutos

Quer testar rapidamente? Siga estes passos:

---

## 1️⃣ Verificar se está tudo pronto

```bash
# Verificar se PostgreSQL está rodando
# Windows: Services → PostgreSQL
# Mac/Linux: pg_isready

# Verificar se .env está configurado
# Deve ter: DATABASE_URL, JWT_SECRET, APP_URL, META_API_VERSION
```

---

## 2️⃣ Configurar banco

```bash
npx prisma generate
npx prisma db push
```

---

## 3️⃣ Iniciar servidor

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 4️⃣ Criar conta

1. Clique em **"Registre-se"**
2. Preencha email e senha
3. Faça login

---

## 5️⃣ Testar funcionalidades

- ✅ Criar Domínio
- ✅ Criar Pixel (pode usar valores de teste)
- ✅ Criar Canal (precisa token real do Telegram)
- ✅ Criar Funil
- ✅ Ver Dashboard

---

## ✅ Pronto!

Se tudo funcionou, você está pronto para testar mais profundamente!

**Próximo passo:** Consulte `GUIA_TESTE_COMPLETO_LOCAL.md` para testes completos.

---

## 🐛 Problema?

- **Erro no banco:** Verifique se PostgreSQL está rodando
- **Erro no login:** Crie uma conta primeiro
- **Erro 500:** Verifique o `.env` e se o banco está configurado

Consulte `TROUBLESHOOTING.md` para mais ajuda.







