# 🧪 Teste Passo a Passo - Track4You

Guia prático para testar tudo agora que o ngrok está configurado!

---

## ✅ Pré-requisitos (Verificar)

Antes de começar, certifique-se de ter:

- [x] ngrok configurado e rodando (`ngrok http 3000`)
- [x] Servidor Next.js rodando (`npm run dev`)
- [x] Conta criada no sistema
- [x] Domínio criado
- [x] Pixel criado
- [x] Canal criado (com bot token e channel ID)
- [x] Funil criado
- [x] Postback criado (opcional, mas recomendado)

---

## 🚀 Passo 1: Pegar URL do ngrok

No terminal onde o ngrok está rodando, você vai ver algo como:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copie essa URL:** `https://abc123.ngrok.io` (a sua será diferente!)

**Anote essa URL!** Você vai usar em vários lugares.

---

## 🔗 Passo 2: Configurar Webhook do Telegram

### 2.1 Pegar Token do Bot

1. Abra o Telegram
2. Procure por `@BotFather`
3. Envie `/mybots`
4. Escolha seu bot
5. Vá em "API Token"
6. **Copie o token**

### 2.2 Configurar Webhook

Abra no navegador (substitua `SEU_TOKEN` e `SUA_URL_NGROK`):

```
https://api.telegram.org/botSEU_TOKEN/setWebhook?url=https://SUA_URL_NGROK/api/telegram/webhook
```

**Exemplo:**
```
https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://abc123.ngrok.io/api/telegram/webhook
```

**Se aparecer `{"ok":true}`, está funcionando! ✅**

### 2.3 Verificar Webhook (Opcional)

Para verificar se está configurado:

```
https://api.telegram.org/botSEU_TOKEN/getWebhookInfo
```

Deve mostrar a URL do ngrok configurada.

---

## 📄 Passo 3: Criar Página de Teste

### 3.1 Criar arquivo HTML

Crie um arquivo `teste.html` na pasta do projeto:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste Tracking Track4You</title>
    
    <!-- COLE O SCRIPT DO FUNIL AQUI -->
    <!-- Vá em Funis → Clique no seu funil → Copie o script -->
    <script>
      (function() {
        var scriptId = 'COLE_O_SCRIPT_ID_AQUI';
        var s = document.createElement('script');
        s.src = 'http://localhost:3000/api/tracking/' + scriptId + '.js';
        s.async = true;
        document.head.appendChild(s);
      })();
    </script>
</head>
<body style="font-family: Arial; padding: 40px; max-width: 800px; margin: 0 auto;">
    <h1>🧪 Página de Teste - Track4You</h1>
    <p>Esta página está sendo rastreada pelo sistema.</p>
    
    <div style="margin: 30px 0;">
        <h2>Teste de Clique</h2>
        <p>Clique no botão abaixo para testar o tracking de cliques:</p>
        
        <!-- COLE O LINK DO TELEGRAM AQUI -->
        <!-- Vá em Funis → Clique no seu funil → Copie o link do Telegram -->
        <a href="COLE_O_LINK_DO_TELEGRAM_AQUI" 
           id="telegram-link" 
           style="display: inline-block; padding: 15px 30px; background: #0088cc; color: white; text-decoration: none; border-radius: 5px; font-size: 18px;">
            🚀 Entrar no Grupo do Telegram
        </a>
    </div>
    
    <div style="margin: 30px 0; padding: 20px; background: #f0f0f0; border-radius: 5px;">
        <h3>📊 O que testar:</h3>
        <ul>
            <li>✅ PageView: Ao carregar esta página</li>
            <li>✅ Clique: Ao clicar no botão acima</li>
            <li>✅ Entrada no Grupo: Ao entrar no grupo via link</li>
        </ul>
    </div>
    
    <div style="margin: 30px 0; padding: 20px; background: #fff3cd; border-radius: 5px;">
        <h3>💡 Dica:</h3>
        <p>Abra o <strong>Console do Navegador</strong> (F12) para ver os logs do tracking.</p>
    </div>
</body>
</html>
```

### 3.2 Substituir Valores

No arquivo `teste.html`, substitua:

1. **`COLE_O_SCRIPT_ID_AQUI`** → 
   - Vá em **Funis** → Clique no seu funil
   - Copie o **Script ID** que aparece
   - Cole no lugar de `COLE_O_SCRIPT_ID_AQUI`

2. **`COLE_O_LINK_DO_TELEGRAM_AQUI`** →
   - No mesmo lugar (Funis → seu funil)
   - Copie o **Link do Telegram** que aparece
   - Cole no lugar de `COLE_O_LINK_DO_TELEGRAM_AQUI`

### 3.3 Servir a Página

Abra um **novo terminal** (deixe o ngrok e o npm run dev rodando):

```powershell
# Navegue até a pasta do projeto
cd C:\Users\erick\Downloads\pixel

# Use Python para servir (se tiver Python instalado)
python -m http.server 8000

# OU use Node.js (se tiver http-server instalado)
# npm install -g http-server
# http-server -p 8000
```

Acesse: **http://localhost:8000/teste.html**

---

## 📊 Passo 4: Testar PageView

1. Abra: **http://localhost:8000/teste.html**
2. Abra o **Console do Navegador** (F12 → Console)
3. Deve aparecer algo como: `PageView registrado` ou logs do script
4. Vá no **Dashboard** do sistema
5. **Atualize a página** (F5)
6. Deve aparecer **+1 PageView** ✅

**Se aparecer, está funcionando!**

---

## 🖱️ Passo 5: Testar Clique

1. Na mesma página (`teste.html`)
2. **Clique no botão** "Entrar no Grupo do Telegram"
3. No console deve aparecer: `Click registrado` ou similar
4. Vá no **Dashboard**
5. **Atualize a página** (F5)
6. Deve aparecer **+1 Clique** ✅

**Se aparecer, está funcionando!**

---

## 🔗 Passo 6: Testar Entrada no Grupo

### 6.1 Entrar no Grupo

1. Clique no botão "Entrar no Grupo do Telegram"
2. Você será redirecionado para o Telegram
3. **Entre no grupo** via link

### 6.2 Verificar no Dashboard

1. Volte para o **Dashboard** do sistema
2. **Atualize a página** (F5)
3. Deve aparecer **+1 Entrada** ✅

### 6.3 Verificar Logs

No terminal onde roda `npm run dev`, você deve ver:
```
POST /api/telegram/webhook 200 in 50ms
POST /api/tracking/event 200 in 30ms
```

**Se aparecer, está funcionando!**

---

## 📤 Passo 7: Testar Postback (Opcional)

### 7.1 Criar URL de Teste

1. Acesse: **https://webhook.site**
2. Copie a **URL única** que aparece (ex: `https://webhook.site/abc123...`)

### 7.2 Configurar Postback

1. No sistema, vá em **Postbacks**
2. Edite ou crie um postback
3. Cole a URL do webhook.site
4. Escolha o tipo (ex: "Cliques no botão")
5. Salve

### 7.3 Testar

1. Clique em **"Testar"** no postback
2. Volte para o **webhook.site**
3. Deve aparecer uma requisição recebida ✅

**Ou:**

1. Faça um clique na página de teste
2. Volte para o **webhook.site**
3. Deve aparecer uma requisição com os dados do evento ✅

---

## ✅ Checklist Completo

### Funcionalidades Básicas
- [ ] PageView registrado no Dashboard
- [ ] Clique registrado no Dashboard
- [ ] Entrada no grupo registrada no Dashboard
- [ ] Postback recebe requisição (se configurado)

### Verificações Técnicas
- [ ] Console do navegador mostra logs do tracking
- [ ] Terminal do servidor mostra requisições (`POST /api/tracking/event`)
- [ ] Terminal mostra webhook do Telegram (`POST /api/telegram/webhook`)
- [ ] Dashboard atualiza em tempo real

### Próximos Passos
- [ ] Tudo funcionando localmente ✅
- [ ] Pronto para deploy no Vercel 🚀
- [ ] Configurar webhook real em produção
- [ ] Enviar evento EnterChannel para Meta Pixel

---

## 🐛 Problemas Comuns

### PageView não aparece no Dashboard
- **Verifique:** Console do navegador (F12) tem erros?
- **Verifique:** Terminal do servidor mostra requisição?
- **Solução:** Certifique-se de que o Script ID está correto

### Clique não registra
- **Verifique:** O link do Telegram está correto?
- **Verifique:** O script está carregado? (Console → Network)
- **Solução:** Verifique se o script está no `<head>` da página

### Entrada no grupo não registra
- **Verifique:** Webhook está configurado? (`getWebhookInfo`)
- **Verifique:** ngrok ainda está rodando?
- **Verifique:** Terminal mostra `POST /api/telegram/webhook`?
- **Solução:** Reconfigure o webhook se necessário

### Dashboard não atualiza
- **Solução:** Atualize a página (F5) ou aguarde alguns segundos

---

## 🎯 Próximos Passos Após Testar

Quando tudo estiver funcionando localmente:

1. ✅ **Confirmar:** Dashboard está contabilizando tudo corretamente
2. 🚀 **Deploy:** Fazer deploy no Vercel
3. 🔗 **Webhook Real:** Configurar webhook com URL real (não ngrok)
4. 📊 **Meta Pixel:** Testar envio de evento EnterChannel em produção

---

## 💡 Dicas

- **Mantenha o Console aberto** (F12) para ver erros
- **Mantenha o Terminal aberto** para ver logs do servidor
- **Atualize o Dashboard** após cada teste para ver os resultados
- **Use webhook.site** para testar postbacks facilmente
- **Teste um evento por vez** para identificar problemas

---

**Agora você tem tudo para testar completamente! 🎉**

Se tiver dúvidas ou problemas, me avise!



