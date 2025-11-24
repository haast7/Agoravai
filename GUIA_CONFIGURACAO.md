# 🎯 Guia de Configuração - Track4You

Este guia vai te ajudar a configurar tudo que você precisa para usar o Track4You. Siga os passos na ordem!

---

## 📋 Índice

1. [Configurar Banco de Dados PostgreSQL](#1-configurar-banco-de-dados-postgresql)
2. [Configurar Variáveis de Ambiente](#2-configurar-variáveis-de-ambiente)
3. [Instalar e Rodar o Projeto](#3-instalar-e-rodar-o-projeto)
4. [Criar Conta no Sistema](#4-criar-conta-no-sistema)
5. [Configurar Meta Pixel](#5-configurar-meta-pixel)
6. [Configurar Bot do Telegram](#6-configurar-bot-do-telegram)
7. [Configurar Canal do Telegram](#7-configurar-canal-do-telegram)
8. [Criar Funil](#8-criar-funil)
9. [Configurar Webhook do Telegram](#9-configurar-webhook-do-telegram)

---

## 1. Configurar Banco de Dados PostgreSQL

### Passo 1.1: Instalar PostgreSQL

**Windows:**
1. Baixe o PostgreSQL em: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Durante a instalação, anote a senha que você criar para o usuário `postgres`
4. Deixe a porta padrão (5432)

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Passo 1.2: Criar Banco de Dados

Este passo vai criar o banco de dados que o sistema vai usar. Vamos fazer isso pelo terminal!

#### **Passo 1.2.1: Abrir o Terminal**

**Windows:**
- Pressione `Windows + R`
- Digite `powershell` e pressione Enter
- OU clique com botão direito no menu Iniciar → "Windows PowerShell" ou "Terminal"

**Mac/Linux:**
- Abra o Terminal (procure por "Terminal" no Spotlight ou aplicativos)

#### **Passo 1.2.2: Conectar ao PostgreSQL**

**⚠️ IMPORTANTE:** A senha **NÃO aparece na tela** quando você digita (é por segurança!). Mesmo parecendo que não está funcionando, ela está sendo digitada!

**Método 1: Conexão Normal (se conseguir digitar a senha)**

No terminal, digite exatamente isso (e pressione Enter):

```bash
psql -U postgres
```

**O que vai acontecer:**
- O sistema vai pedir a senha do usuário `postgres`
- **IMPORTANTE:** Quando você digitar a senha, ela **NÃO vai aparecer na tela** (é normal por segurança!)
- Digite a senha que você criou durante a instalação e pressione Enter
- **Mesmo sem aparecer, ela está sendo digitada!** Continue digitando normalmente

**O que você deve ver se funcionou:**
```
Password for user postgres: [você digita aqui, mas não aparece]
psql (14.x)
Type "help" for help.

postgres=#
```

Se aparecer `postgres=#`, você está conectado! ✅

---

**Método 2: Usar Variável de Ambiente (Se não conseguir digitar a senha)**

Se você não conseguir digitar a senha (problema comum no Windows), use este método:

**No PowerShell, digite (substitua SUA_SENHA pela senha real):**

```powershell
$env:PGPASSWORD="SUA_SENHA_AQUI"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE track4you;"
```

**Exemplo:** Se sua senha for `minhasenha123`, digite:
```powershell
$env:PGPASSWORD="minhasenha123"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE track4you;"
```

**O que vai acontecer:**
- O banco será criado automaticamente sem pedir senha
- Se aparecer `CREATE DATABASE`, funcionou! ✅
- A variável `$env:PGPASSWORD` só funciona nesta sessão do PowerShell (seguro!)

**Para verificar se funcionou:**
```powershell
$env:PGPASSWORD="SUA_SENHA_AQUI"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "\l"
```

Isso vai listar todos os bancos. Você deve ver `track4you` na lista! ✅

---

**Método 3: Criar Banco Direto em Um Comando (Mais Rápido!)**

Se você só quer criar o banco sem entrar no psql:

```powershell
$env:PGPASSWORD="SUA_SENHA_AQUI"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE track4you;"
```

Pronto! Banco criado em um comando só! 🎯

#### **Passo 1.2.3: Criar o Banco de Dados**

Agora que você está conectado, digite este comando (um por vez):

```sql
CREATE DATABASE track4you;
```

**Atenção:**
- Não esqueça o ponto e vírgula (`;`) no final!
- O nome deve ser exatamente `track4you` (minúsculas)
- Pressione Enter após digitar

**O que você deve ver:**
```
postgres=# CREATE DATABASE track4you;
CREATE DATABASE
postgres=#
```

Se aparecer `CREATE DATABASE`, o banco foi criado com sucesso! ✅

#### **Passo 1.2.4: Sair do PostgreSQL**

Para sair, digite:

```sql
\q
```

E pressione Enter. Você voltará ao terminal normal.

#### **Passo 1.2.5: Verificar se Funcionou (Opcional)**

Para ter certeza que o banco foi criado, você pode verificar:

1. Conecte novamente: `psql -U postgres`
2. Digite a senha
3. Digite: `\l` (lista todos os bancos)
4. Você deve ver `track4you` na lista
5. Digite `\q` para sair

---

#### **❌ Problemas Comuns e Soluções**

**Problema 1: "psql não é reconhecido como comando"**

Este é o problema mais comum! O PostgreSQL não está no PATH do Windows. Aqui estão **3 soluções** (escolha a mais fácil):

---

**🔧 SOLUÇÃO 1: Usar o SQL Shell (Mais Fácil!)**

O PostgreSQL vem com um programa chamado "SQL Shell" que já funciona direto:

1. Pressione `Windows` e digite: `SQL Shell`
2. Clique em **"SQL Shell (psql)"** que aparece nos resultados
3. Vai abrir uma janela preta
4. Ele vai pedir várias coisas - apenas pressione **Enter** em cada uma:
   - Server: **[Enter]** (usa localhost)
   - Database: **[Enter]** (usa postgres)
   - Port: **[Enter]** (usa 5432)
   - Username: **[Enter]** (usa postgres)
   - Password: **Digite sua senha** (não aparece na tela) e **[Enter]**
5. Se aparecer `postgres=#`, você está conectado! ✅
6. Agora digite: `CREATE DATABASE track4you;` e pressione Enter
7. Digite `\q` para sair

**Essa é a forma mais fácil!** 🎯

---

**🔧 SOLUÇÃO 2: Encontrar o Caminho Automaticamente**

No PowerShell, digite este comando para encontrar onde o PostgreSQL está:

```powershell
Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "psql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 FullName
```

**OU** tente estas versões comuns:

```powershell
# Tente versão 18
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres

# Tente versão 17
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres

# Tente versão 16
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres

# Tente versão 15
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres

# Tente versão 14
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

Quando um deles funcionar, você verá a mensagem pedindo a senha!

---

**🔧 SOLUÇÃO 3: Encontrar Manualmente e Usar Caminho Completo**

1. Abra o **Explorador de Arquivos** (Windows + E)
2. Vá para: `C:\Program Files\PostgreSQL\`
3. Você vai ver pastas com números (ex: `14`, `15`, `16`, `17`, `18`)
4. Entre na pasta da versão mais recente que você vê
5. Entre na pasta `bin`
6. Procure por `psql.exe`
7. **Clique com botão direito** em `psql.exe` → **"Copiar como caminho"**
8. Volte ao PowerShell e digite:
   ```powershell
   & "COLE_O_CAMINHO_AQUI" -U postgres
   ```
   (Substitua `COLE_O_CAMINHO_AQUI` pelo caminho que você copiou)

**Exemplo:** Se o caminho for `C:\Program Files\PostgreSQL\18\bin\psql.exe`, digite:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
```

---

**💡 DICA:** Depois que descobrir o caminho, você pode adicionar ao PATH permanentemente:

1. Pressione `Windows` e digite: `variáveis de ambiente`
2. Clique em **"Editar as variáveis de ambiente do sistema"**
3. Clique em **"Variáveis de Ambiente"**
4. Em **"Variáveis do sistema"**, encontre `Path` e clique em **"Editar"**
5. Clique em **"Novo"**
6. Cole o caminho até a pasta `bin` (ex: `C:\Program Files\PostgreSQL\18\bin`)
7. Clique em **"OK"** em todas as janelas
8. **Feche e abra o PowerShell novamente**
9. Agora `psql -U postgres` vai funcionar! ✅

**Mac/Linux:**
- Verifique se o PostgreSQL está rodando: `brew services list` (Mac) ou `sudo systemctl status postgresql` (Linux)
- Se não estiver, inicie: `brew services start postgresql@14` (Mac) ou `sudo systemctl start postgresql` (Linux)

**Problema 2: "Senha incorreta" ou "autenticação falhou"**

- Verifique se está digitando a senha correta (a que você criou na instalação)
- Se esqueceu a senha, você pode redefini-la:
  - **Windows:** Use o pgAdmin (vem com o PostgreSQL) ou reinstale
  - **Mac/Linux:** Veja a documentação do PostgreSQL para resetar senha

**Problema 3: "database track4you already exists"**

- Isso significa que o banco já existe! Não tem problema, pode continuar. ✅
- Se quiser recriar, primeiro delete: `DROP DATABASE track4you;` e depois crie novamente

**Problema 4: "permission denied"**

- Certifique-se de estar usando o usuário `postgres` (`-U postgres`)
- No Windows, pode ser necessário executar o PowerShell como Administrador

---

#### **✅ Confirmação Final**

Se você conseguiu:
- ✅ Conectar ao PostgreSQL (`psql -U postgres`)
- ✅ Ver o prompt `postgres=#`
- ✅ Executar `CREATE DATABASE track4you;` e ver `CREATE DATABASE`
- ✅ Sair com `\q`

**Parabéns! O banco de dados está criado e pronto para uso!** 🎉

---

## 2. Configurar Variáveis de Ambiente

### Passo 2.1: Criar arquivo .env

1. Na pasta do projeto, procure o arquivo `.env.example`
2. Copie ele e renomeie para `.env`
3. Abra o arquivo `.env` com um editor de texto

### Passo 2.2: Preencher as variáveis

Substitua os valores abaixo pelos seus dados:

```env
# Banco de Dados
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/track4you?schema=public"

# JWT Secret (pode ser qualquer texto longo e aleatório)
JWT_SECRET="minha-chave-secreta-super-segura-123456789"

# URL da sua aplicação (para desenvolvimento use localhost)
APP_URL="http://localhost:3000"

# Versão da API do Meta (não precisa mudar)
META_API_VERSION="v21.0"
```

**Exemplo de DATABASE_URL:**
- Se sua senha do PostgreSQL é `minhasenha123`, ficaria:
- `DATABASE_URL="postgresql://postgres:minhasenha123@localhost:5432/track4you?schema=public"`

Salve o arquivo! ✅

---

## 3. Instalar e Rodar o Projeto

### Passo 3.1: Instalar dependências

Abra o terminal na pasta do projeto e digite:

```bash
npm install
```

Aguarde terminar (pode demorar alguns minutos).

### Passo 3.2: Configurar banco de dados

Digite os seguintes comandos (um por vez):

```bash
npx prisma generate
npx prisma db push
```

Se aparecer algum erro, verifique se o PostgreSQL está rodando e se a senha no `.env` está correta.

### Passo 3.3: Iniciar o servidor

Digite:

```bash
npm run dev
```

Se aparecer uma mensagem como "Ready on http://localhost:3000", está funcionando! ✅

Abra seu navegador e acesse: `http://localhost:3000`

---

## 4. Criar Conta no Sistema

1. Na tela de login, clique em "Não tem conta? Registre-se"
2. Preencha:
   - **Nome**: Seu nome (opcional)
   - **Email**: Seu email
   - **Senha**: Uma senha segura
3. Clique em "Registrar"
4. Você será redirecionado para o Dashboard! ✅

---

## 5. Configurar Meta Pixel

### Passo 5.1: Acessar Meta Business Manager

1. Acesse: https://business.facebook.com
2. Faça login com sua conta do Facebook
3. Se não tiver, crie uma conta Business

### Passo 5.2: Criar ou encontrar seu Pixel

1. No menu lateral, clique em **"Eventos"** ou **"Pixels"**
2. Se já tiver um pixel, anote o **ID do Pixel** (número grande)
3. Se não tiver, clique em **"Criar"** e anote o ID que aparecer

### Passo 5.3: Gerar Token de Integração

1. No seu Pixel, clique em **"Configurações"**
2. Role até a seção **"Conversions API"**
3. Clique em **"Gerar Token de Acesso"**
4. **COPIE O TOKEN** (ele só aparece uma vez!)
5. Anote também o **ID do Pixel**

### Passo 5.4: Adicionar Pixel no Track4You

1. No Track4You, vá em **"Pixels"**
2. Clique em **"+ Novo"**
3. Preencha:
   - **Nome**: Um nome para identificar (ex: "Meu Pixel Principal")
   - **ID**: O ID do Pixel que você anotou
   - **Token de Integração**: O token que você copiou
4. Clique em **"Salvar"**
5. Se aparecer erro, verifique se copiou o token corretamente ✅

---

## 6. Configurar Bot do Telegram

### Passo 6.1: Criar Bot no Telegram

1. Abra o Telegram no celular ou computador
2. Procure por **@BotFather** (é um bot oficial do Telegram)
3. Envie a mensagem: `/start`
4. Envie: `/newbot`
5. Digite um nome para seu bot (ex: "Meu Bot Track4You")
6. Digite um username (deve terminar com `_bot`, ex: `meubot_track4you_bot`)
7. **COPIE O TOKEN** que o BotFather vai te enviar (parece: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Passo 6.2: Adicionar Bot no Track4You

1. No Track4You, vá em **"Canal"**
2. Clique em **"+ Novo"**
3. Preencha:
   - **Nome do Canal**: Nome do seu canal/grupo (ex: "Meu Grupo VIP")
   - **Nome do Bot**: O username do bot que você criou (ex: `meubot_track4you_bot`)
   - **Token do Bot**: O token que o BotFather te deu
4. Clique em **"Salvar"** ✅

---

## 7. Configurar Canal do Telegram

### Passo 7.1: Criar Grupo/Canal no Telegram

1. No Telegram, clique no ícone de **"+"** (criar)
2. Escolha **"Novo Grupo"** ou **"Novo Canal"**
3. Dê um nome e crie

### Passo 7.2: Adicionar Bot como Administrador

1. No seu grupo/canal, clique no nome no topo
2. Vá em **"Administradores"** ou **"Editar"**
3. Clique em **"Adicionar Administrador"**
4. Procure pelo seu bot (o username que você criou)
5. Adicione e dê permissões de:
   - ✅ Adicionar membros
   - ✅ Remover membros
   - ✅ Ver mensagens

### Passo 7.3: Obter ID do Canal

1. Adicione o bot **@userinfobot** no seu grupo
2. Ele vai mostrar o ID do grupo (um número negativo, ex: `-1001234567890`)
3. **ANOTE ESSE ID**

### Passo 7.4: Configurar Webhook (Importante!)

Você precisa configurar o webhook para o bot receber notificações quando alguém entrar/sair do grupo.

**Opção A - Se você tem o sistema rodando localmente:**

Você precisa usar um serviço como **ngrok** para expor seu localhost:

1. Baixe o ngrok: https://ngrok.com/download
2. No terminal, digite: `ngrok http 3000`
3. Copie a URL que aparecer (ex: `https://abc123.ngrok.io`)
4. Use essa URL no próximo passo

**Opção B - Se você tem o sistema em um servidor:**

Use a URL do seu servidor diretamente.

**Configurar Webhook:**

1. Abra no navegador (substitua pelos seus valores):
```
https://api.telegram.org/botSEU_TOKEN_AQUI/setWebhook?url=https://SUA_URL_AQUI/api/telegram/webhook
```

**Exemplo:**
```
https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://abc123.ngrok.io/api/telegram/webhook
```

2. Se aparecer `{"ok":true}`, está funcionando! ✅

---

## 8. Criar Funil

### Passo 8.1: Adicionar Domínio

1. No Track4You, vá em **"Domínios"**
2. Clique em **"+ Novo"**
3. Digite apenas o domínio (sem https://), ex: `www.meusite.com`
4. Clique em **"Salvar"** ✅

### Passo 8.2: Criar Funil

1. Vá em **"Funis"**
2. Clique em **"+ Novo"**
3. Preencha:
   - **Nome**: Nome do funil (ex: "Funil Principal")
   - **Pixel**: Selecione o pixel que você criou
   - **Domínio**: Selecione o domínio que você criou
   - **Canal**: Selecione o canal que você criou
   - **Ativar Solicitação de Entrada**: Deixe desmarcado (ou marque se quiser)
4. Em **"Adicionar URLs"**, digite as páginas que você quer rastrear:
   - Exemplo: `/pagina1` ou `pagina2`
   - Você pode adicionar até 5 URLs
   - Clique em **"Adicionar"** para cada uma
5. Clique em **"Salvar"** ✅

### Passo 8.3: Obter Script e Link

1. Na lista de funis, clique em **"Tutorial"** no funil que você criou
2. Você verá duas coisas importantes:
   - **Script para colar no `<head>` do seu site**
   - **Link do Telegram para usar no botão**

3. **Copie o script** e cole no `<head>` de todas as páginas que você quer rastrear
4. **Copie o link do Telegram** e use ele no botão que leva para o grupo

**Exemplo de como usar o link:**
```html
<a href="LINK_DO_TELEGRAM_AQUI">Entrar no Grupo VIP</a>
```

✅ Pronto! Agora quando alguém:
1. Visitar sua página → será contado como PageView
2. Clicar no botão do Telegram → será contado como Click
3. Entrar no grupo via seu link → será contado como EnterChannel e enviado para Meta Pixel!

---

## 9. Configurar Webhook do Telegram (Revisão)

Se você ainda não configurou o webhook, é **ESSENCIAL** fazer isso para rastrear entradas/saídas do grupo!

### Passo 9.1: Verificar se está funcionando

1. Adicione alguém no seu grupo do Telegram (ou entre você mesmo)
2. Vá no Dashboard do Track4You
3. Veja se aparece uma "Entrada" nas métricas

Se não aparecer, o webhook não está configurado corretamente.

### Passo 9.2: Usar ngrok (se estiver em localhost)

1. Instale o ngrok: https://ngrok.com/download
2. No terminal, digite: `ngrok http 3000`
3. Copie a URL HTTPS que aparecer (ex: `https://abc123.ngrok.io`)
4. Configure o webhook usando essa URL (veja Passo 7.4)

### Passo 9.3: Testar

1. Entre no grupo usando o link que você copiou do funil
2. Verifique no Dashboard se apareceu uma entrada
3. Se aparecer, está funcionando! ✅

---

## 🎉 Pronto!

Agora você tem tudo configurado! O sistema vai:
- ✅ Rastrear pageviews nas suas páginas
- ✅ Rastrear cliques no botão do Telegram
- ✅ Rastrear entradas no grupo
- ✅ Enviar eventos "Enter Channel" para o Meta Pixel
- ✅ Mostrar todas as métricas no Dashboard

---

## ❓ Problemas Comuns

### Erro ao conectar no banco de dados
- Verifique se o PostgreSQL está rodando
- Verifique se a senha no `.env` está correta
- Verifique se o banco `track4you` foi criado

### Bot não recebe notificações
- Verifique se o webhook está configurado corretamente
- Verifique se o bot é administrador do grupo
- Se estiver em localhost, use ngrok

### Pixel não envia eventos
- Verifique se o Token de Integração está correto
- Verifique se o ID do Pixel está correto
- Teste o pixel usando o botão "Evento teste"

### Script não funciona
- Verifique se colocou o script no `<head>` da página
- Verifique se a URL da página está nas URLs do funil
- Abra o console do navegador (F12) para ver erros

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas, verifique:
1. Se seguiu todos os passos na ordem
2. Se copiou os tokens corretamente (sem espaços extras)
3. Se o PostgreSQL está rodando
4. Se o servidor está rodando (`npm run dev`)

Boa sorte! 🚀



