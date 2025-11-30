# 🔍 Diagnóstico de Problemas com Banco de Dados

Este guia vai te ajudar a resolver problemas de conexão com o banco de dados PostgreSQL.

## ❌ Erro: "Erro ao conectar ao banco de dados"

Este erro geralmente acontece quando o sistema não consegue se conectar ao PostgreSQL. Siga os passos abaixo:

---

## ✅ Passo 1: Verificar se o PostgreSQL está rodando

### Windows:
1. Abra o **Gerenciador de Tarefas** (Ctrl + Shift + Esc)
2. Vá na aba **"Serviços"**
3. Procure por **"postgresql"** ou **"PostgreSQL"**
4. Se não estiver rodando, clique com botão direito → **"Iniciar"**

**OU** pelo PowerShell:
```powershell
Get-Service -Name "*postgresql*"
```

Se não estiver rodando:
```powershell
Start-Service -Name "postgresql-x64-18"  # Substitua pela versão correta
```

### Mac/Linux:
```bash
# Verificar status
brew services list | grep postgresql  # Mac
sudo systemctl status postgresql      # Linux

# Iniciar se não estiver rodando
brew services start postgresql@14      # Mac
sudo systemctl start postgresql        # Linux
```

---

## ✅ Passo 2: Verificar o arquivo .env

1. Abra o arquivo `.env` na raiz do projeto
2. Verifique se a linha `DATABASE_URL` está correta:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/track4you?schema=public"
```

**Importante:**
- Substitua `SUA_SENHA` pela senha real do PostgreSQL
- A porta deve ser `5432` (padrão)
- O nome do banco deve ser `track4you`

**Exemplo correto:**
```env
DATABASE_URL="postgresql://postgres:minhasenha123@localhost:5432/track4you?schema=public"
```

---

## ✅ Passo 3: Testar conexão manualmente

No PowerShell (Windows) ou Terminal (Mac/Linux):

```bash
# Windows
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d track4you

# Mac/Linux
psql -U postgres -d track4you
```

Se conseguir conectar, o banco está OK. Se não conseguir, verifique:
- A senha está correta?
- O banco `track4you` existe? (veja Passo 4)

---

## ✅ Passo 4: Verificar se o banco existe

Conecte ao PostgreSQL:

```bash
# Windows
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres

# Mac/Linux
psql -U postgres
```

Depois digite:
```sql
\l
```

Procure por `track4you` na lista. Se não existir, crie:

```sql
CREATE DATABASE track4you;
\q
```

---

## ✅ Passo 5: Gerar Prisma Client e criar tabelas

No terminal, na pasta do projeto, execute:

```bash
# 1. Gerar o Prisma Client
npx prisma generate

# 2. Criar as tabelas no banco
npx prisma db push
```

**Se aparecer algum erro:**
- Verifique se o PostgreSQL está rodando (Passo 1)
- Verifique se o `.env` está correto (Passo 2)
- Verifique se o banco existe (Passo 4)

---

## ✅ Passo 6: Reiniciar o servidor

Depois de fazer todas as correções:

1. Pare o servidor (Ctrl + C no terminal)
2. Inicie novamente:
```bash
npm run dev
```

---

## 🔧 Erros Comuns e Soluções

### Erro: "P1001 - Can't reach database server"
**Causa:** PostgreSQL não está rodando ou porta incorreta
**Solução:** Siga o Passo 1

### Erro: "P1000 - Authentication failed"
**Causa:** Senha incorreta no DATABASE_URL
**Solução:** Verifique o Passo 2

### Erro: "P1003 - Database does not exist"
**Causa:** Banco `track4you` não foi criado
**Solução:** Siga o Passo 4

### Erro: "ECONNREFUSED"
**Causa:** PostgreSQL não está rodando ou porta incorreta
**Solução:** Siga o Passo 1

---

## 📋 Checklist Rápido

- [ ] PostgreSQL está rodando?
- [ ] Arquivo `.env` existe e tem `DATABASE_URL` correto?
- [ ] Senha no `.env` está correta?
- [ ] Banco `track4you` existe?
- [ ] Executei `npx prisma generate`?
- [ ] Executei `npx prisma db push`?
- [ ] Reiniciei o servidor (`npm run dev`)?

---

## 🆘 Ainda com problemas?

1. Verifique os logs do servidor no terminal onde está rodando `npm run dev`
2. Procure por mensagens de erro que começam com `❌`
3. Verifique o console do navegador (F12) para ver erros detalhados
4. Os erros agora mostram mais detalhes em modo desenvolvimento

---

## 💡 Dica

Se você está em **produção** (servidor online), certifique-se de que:
- O PostgreSQL está acessível do servidor
- As variáveis de ambiente estão configuradas no servidor
- O firewall permite conexões na porta 5432

