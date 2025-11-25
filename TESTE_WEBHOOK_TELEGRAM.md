# 🧪 Guia Rápido: Testar Webhook do Telegram

## 📋 Pré-requisitos

✅ Você já tem:
- ngrok rodando (`ngrok http 3000`)
- URL do ngrok: `https://tensional-hurtlingly-eugenie.ngrok-free.dev`
- Bot criado no Telegram
- Canal/Grupo criado no Telegram
- Bot adicionado como administrador do grupo
- Canal cadastrado no Track4You

---

## 🚀 Passo a Passo Rápido

### 1️⃣ Obter Token do Bot

1. Abra o Track4You no navegador (`http://localhost:3000`)
2. Vá em **"Canais"**
3. Clique no canal que você quer testar
4. **Copie o Token do Bot** (parece: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. **Anote o ID do Canal** também (ex: `-1001234567890`)

---

### 2️⃣ Configurar o Webhook

**Com a URL do seu ngrok**, abra no navegador:

```
https://api.telegram.org/botSEU_TOKEN_AQUI/setWebhook?url=https://tensional-hurtlingly-eugenie.ngrok-free.dev/api/telegram/webhook
```

**Substitua `SEU_TOKEN_AQUI` pelo token que você copiou.**

**Exemplo completo:**
```
https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://tensional-hurtlingly-eugenie.ngrok-free.dev/api/telegram/webhook
```

**✅ Se aparecer isso, está funcionando:**
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

---

### 3️⃣ Verificar Webhook Configurado

Para confirmar que o webhook está configurado corretamente:

```
https://api.telegram.org/botSEU_TOKEN_AQUI/getWebhookInfo
```

**Você deve ver:**
```json
{
  "ok": true,
  "result": {
    "url": "https://tensional-hurtlingly-eugenie.ngrok-free.dev/api/telegram/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0
  }
}
```

---

### 4️⃣ Testar Entrada no Grupo

#### Opção A: Entrar pelo Link do Funil (Recomendado)

1. No Track4You, vá em **"Funis"**
2. Clique no funil que está associado ao canal
3. Clique em **"Tutorial"**
4. **Copie o Link do Telegram** (parece: `https://t.me/...`)
5. Abra esse link em outro dispositivo ou conta do Telegram
6. Entre no grupo

#### Opção B: Entrar Manualmente

1. Abra o Telegram
2. Entre no grupo/canal que você configurou
3. (O evento será registrado mesmo assim)

---

### 5️⃣ Verificar se Funcionou

#### ✅ No Terminal do Next.js

Você deve ver logs assim:

```
🔔 [Telegram Webhook] ===== NOVA REQUISIÇÃO =====
🔔 [Telegram Webhook] Nova entrada detectada!
   Chat ID: -1001234567890
   Novos membros: 1
✅ [Telegram Webhook] Canal encontrado: "Meu Grupo VIP"
   Funis associados: 1
   Processando membro: João (@joao_silva)
   📝 Criando evento EnterChannel para funil: "Funil Principal"
   ✅ Evento salvo: ID=abc123, Type=EnterChannel, Funnel=Funil Principal
🔔 [Telegram Webhook] ===== FIM DA REQUISIÇÃO =====
```

#### ✅ No Dashboard

1. Atualize a página do Dashboard (F5)
2. Verifique se o contador de **"Entradas no Canal"** aumentou
3. Ou vá em **"Analytics"** → **"Gráficos"** → Veja se aparece evento `EnterChannel`

#### ✅ No Banco de Dados (Opcional)

Se quiser verificar diretamente no banco:

1. Abra o Prisma Studio: `npx prisma studio`
2. Vá em **"Event"**
3. Procure por eventos com `type: "EnterChannel"`

---

## 🔍 Testar Saída do Grupo

1. Saia do grupo no Telegram
2. Verifique no terminal se aparece:
   ```
   🔔 [Telegram Webhook] Saída detectada!
   ✅ [Telegram Webhook] Canal encontrado: "Meu Grupo VIP"
   📝 Criando evento ExitChannel para funil: "Funil Principal"
   ✅ Evento salvo: ID=xyz789, Type=ExitChannel, Funnel=Funil Principal
   ```
3. Verifique no Dashboard se o contador de **"Saídas do Canal"** aumentou

---

## ⚠️ Problemas Comuns

### ❌ Webhook não recebe eventos

**Causa:** Bot não é administrador do grupo

**Solução:**
1. Vá no grupo do Telegram
2. Clique no nome do grupo (topo)
3. Vá em **"Administradores"**
4. Verifique se o bot está lá
5. Se não estiver, adicione como administrador

---

### ❌ Webhook recebe mas não salva

**Causa:** `channelId` não corresponde ao ID real do grupo

**Solução:**
1. Adicione o bot **@userinfobot** no grupo
2. Ele vai mostrar o ID do grupo (ex: `-1001234567890`)
3. No Track4You, vá em **"Canais"** → Clique no canal
4. Verifique se o **ID do Canal** está correto
5. Se estiver errado, edite e salve novamente

---

### ❌ Erro 404 no webhook

**Causa:** URL do webhook está errada ou servidor não está rodando

**Solução:**
1. Verifique se o Next.js está rodando (`npm run dev`)
2. Verifique se o ngrok está rodando (`ngrok http 3000`)
3. Teste a URL manualmente no navegador:
   ```
   https://tensional-hurtlingly-eugenie.ngrok-free.dev/api/telegram/webhook
   ```
   (Deve retornar erro 405 Method Not Allowed, isso é normal - significa que a rota existe!)

---

### ❌ Eventos não aparecem no Dashboard

**Causa:** Canal não está associado ao funil

**Solução:**
1. No Track4You, vá em **"Funis"**
2. Clique no funil
3. Verifique se o **Canal** está selecionado
4. Se não estiver, edite o funil e selecione o canal

---

## 📝 Checklist Final

Antes de testar, confirme:

- [ ] ngrok está rodando (`ngrok http 3000`)
- [ ] Next.js está rodando (`npm run dev`)
- [ ] Bot é administrador do grupo
- [ ] `channelId` no Track4You corresponde ao ID real do grupo
- [ ] Webhook configurado via `setWebhook`
- [ ] Canal está associado ao funil no Track4You

---

## 🎯 Próximos Passos

Após confirmar que está funcionando:

1. ✅ Teste entrada no grupo → Verifique Dashboard
2. ✅ Teste saída do grupo → Verifique Dashboard
3. ✅ Teste com múltiplos usuários
4. ✅ Verifique se os eventos aparecem nos gráficos

---

## 💡 Dica Extra

Para ver todos os eventos em tempo real, deixe o terminal do Next.js aberto enquanto testa. Todos os eventos aparecerão lá com logs detalhados! 🔍
