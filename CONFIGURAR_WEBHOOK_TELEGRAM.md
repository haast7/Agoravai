# 🔔 Como Configurar o Webhook do Telegram

## ⚠️ Por que é importante?

O webhook é necessário para que o sistema receba notificações quando alguém **entra** ou **sai** do grupo do Telegram. Sem ele, os eventos `EnterChannel` e `ExitChannel` não serão registrados.

---

## 📋 Passo a Passo

### 1. Obter URL do Webhook

**Se você está testando localmente:**

1. Use o **ngrok** para expor seu localhost:
   ```bash
   ngrok http 3000
   ```
2. Copie a URL que aparecer (ex: `https://abc123.ngrok.io`)
3. A URL do webhook será: `https://abc123.ngrok.io/api/telegram/webhook`

**Se você já está em produção:**

1. Use a URL do seu servidor (ex: `https://seu-projeto.vercel.app`)
2. A URL do webhook será: `https://seu-projeto.vercel.app/api/telegram/webhook`

---

### 2. Obter o Token do Bot

1. No Track4You, vá em **"Canais"**
2. Clique no canal que você quer configurar
3. Copie o **Token do Bot** (parece: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

---

### 3. Configurar o Webhook

Abra no navegador (substitua pelos seus valores):

```
https://api.telegram.org/botSEU_TOKEN_AQUI/setWebhook?url=https://SUA_URL_NGROK_OU_SERVIDOR/api/telegram/webhook
```

**Exemplo:**
```
https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://abc123.ngrok.io/api/telegram/webhook
```

---

### 4. Verificar se Funcionou

Se aparecer esta resposta, está funcionando! ✅

```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

Se aparecer erro, verifique:
- ✅ O token do bot está correto?
- ✅ A URL do webhook está acessível?
- ✅ O servidor está rodando?

---

### 5. Verificar Webhook Atual

Para ver qual webhook está configurado atualmente:

```
https://api.telegram.org/botSEU_TOKEN_AQUI/getWebhookInfo
```

---

## 🔍 Testar o Webhook

1. Configure o webhook conforme acima
2. Entre no grupo do Telegram usando o link do funil
3. Verifique no terminal do Next.js se aparece:
   ```
   🔔 [Telegram Webhook] Recebido update: {...}
   ```
4. Verifique no Dashboard se o evento `EnterChannel` foi registrado

---

## ⚠️ Problemas Comuns

### Webhook não recebe eventos

1. **Verifique se o bot é administrador do grupo**
   - O bot precisa ter permissões para ver mensagens
   - Vá no grupo → Administradores → Verifique se o bot está lá

2. **Verifique se o channelId está correto**
   - No Track4You, vá em Canais → Clique no canal
   - Verifique se o ID do Canal está correto (deve ser um número negativo, ex: `-1001234567890`)

3. **Verifique se o webhook está configurado**
   - Use o comando `getWebhookInfo` acima
   - Se não estiver configurado, configure novamente

### Webhook recebe eventos mas não salva

1. Verifique o terminal do Next.js para ver erros
2. Verifique se o canal está associado ao funil correto
3. Verifique se o `channelId` no banco corresponde ao ID real do grupo

---

## 📝 Notas Importantes

- ⚠️ **Cada bot precisa de um webhook único**
- ⚠️ **Se você mudar a URL do servidor, precisa reconfigurar o webhook**
- ⚠️ **O webhook precisa estar acessível publicamente (não funciona com localhost direto)**

---

## 🚀 Próximos Passos

Após configurar o webhook:
1. Teste entrando no grupo via link do funil
2. Verifique se o evento aparece no Dashboard
3. Teste saindo do grupo e verifique se o evento `ExitChannel` é registrado


