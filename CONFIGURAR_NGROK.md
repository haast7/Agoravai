# 🔧 Como Configurar ngrok - Passo a Passo

O ngrok agora requer autenticação. Siga estes passos:

---

## 📝 Passo 1: Criar Conta no ngrok

1. Acesse: **https://dashboard.ngrok.com/signup**
2. Crie uma conta (é **grátis**!)
3. Confirme seu email se necessário

---

## 🔑 Passo 2: Obter Authtoken

1. Após fazer login, acesse: **https://dashboard.ngrok.com/get-started/your-authtoken**
2. Você verá um token longo, tipo:
   ```
   2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
   ```
3. **Copie esse token** (você vai precisar dele)

---

## ⚙️ Passo 3: Instalar ngrok (Se ainda não instalou)

### Windows:
1. Baixe em: **https://ngrok.com/download**
2. Extraia o arquivo
3. Adicione ao PATH ou coloque na pasta do projeto

### Mac:
```bash
brew install ngrok
```

### Via npm (qualquer sistema):
```bash
npm install -g ngrok
```

---

## 🔐 Passo 4: Configurar Authtoken

Abra o terminal e execute (substitua `SEU_TOKEN` pelo token que você copiou):

```bash
ngrok config add-authtoken SEU_TOKEN
```

**Exemplo:**
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

Se aparecer uma mensagem de sucesso, está configurado! ✅

---

## 🚀 Passo 5: Usar ngrok

Agora você pode usar normalmente:

```bash
# Expor localhost na porta 3000
ngrok http 3000
```

Você vai ver algo como:
```
Session Status                online
Account                       seu-email@exemplo.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**Copie a URL:** `https://abc123.ngrok.io` (sua URL será diferente)

---

## ✅ Pronto!

Agora você pode:
- ✅ Usar a URL do ngrok no webhook do Telegram
- ✅ Testar entrada/saída do grupo
- ✅ Testar tracking completo localmente

---

## 🐛 Problemas Comuns

### Erro: "authentication failed"
- **Causa:** Authtoken não configurado ou incorreto
- **Solução:** Execute `ngrok config add-authtoken SEU_TOKEN` novamente

### Erro: "command not found"
- **Causa:** ngrok não está no PATH
- **Solução:** 
  - Windows: Adicione ao PATH ou use caminho completo
  - Mac/Linux: Use `brew install ngrok` ou `npm install -g ngrok`

### Erro: "tunnel session failed"
- **Causa:** Servidor não está rodando na porta 3000
- **Solução:** Certifique-se de que `npm run dev` está rodando

---

## 💡 Dica

**Mantenha o ngrok rodando** enquanto testa. Se fechar o terminal, o túnel fecha também.

Para usar em background (opcional):
- Windows PowerShell: `Start-Process ngrok -ArgumentList "http 3000"`
- Mac/Linux: `ngrok http 3000 &`

---

**Agora você está pronto para testar com ngrok! 🎉**



