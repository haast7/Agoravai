# 🧪 Guia de Teste de Tracking Local - Track4You

Este guia vai te ajudar a testar **TUDO** do tracking localmente antes de ir para produção.

> 💡 **Quer um guia mais rápido e direto?** Consulte `TESTE_PASSO_A_PASSO.md` para um guia passo a passo prático!

---

## ✅ O que você já fez

- ✅ Criou Domínio
- ✅ Criou Pixel
- ✅ Criou Canal
- ✅ Criou Postback
- ✅ Criou Funil

**Agora vamos testar se está funcionando!**

---

## 📄 Sobre Página Local vs Online

### **Página Local (localhost) - OK para Testar! ✅**

Você pode usar uma página HTML local para testar, mas precisa:

1. **Usar `http://localhost:3000` no script** (não `file://`)
2. **Servir a página via servidor local** (não abrir direto no navegador)

**Como fazer:**
- Opção 1: Criar uma página HTML e servir com Python:
  ```bash
  # Na pasta da sua página HTML
  python -m http.server 8000
  # Acesse: http://localhost:8000/sua-pagina.html
  ```

- Opção 2: Usar o próprio Next.js (criar uma rota de teste)

- Opção 3: Usar ngrok para expor localhost (recomendado para webhook)

### **Página Online - Necessária para Meta Pixel Real**

Para enviar eventos reais para o Meta Pixel, você precisa:
- ✅ Domínio real e acessível
- ✅ Script no `<head>` da página online
- ✅ Meta Pixel verificado no domínio

**Mas para testar localmente, página local está OK!**

---

## 🚀 Passo 1: Verificar Script do Funil

1. Vá em **Funis** → Clique no seu funil
2. Copie o **script** que aparece
3. Verifique se o script aponta para `http://localhost:3000` (se estiver testando localmente)

**Exemplo de script:**
```html
<script>
  (function() {
    var scriptId = 'SEU_SCRIPT_ID';
    var s = document.createElement('script');
    s.src = 'http://localhost:3000/api/tracking/' + scriptId + '.js';
    s.async = true;
    document.head.appendChild(s);
  })();
</script>
```

---

## 🧪 Passo 2: Criar Página de Teste

Crie um arquivo `teste.html` na pasta do projeto:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste Tracking</title>
    
    <!-- COLE O SCRIPT DO FUNIL AQUI -->
    <script>
      (function() {
        var scriptId = 'SEU_SCRIPT_ID_AQUI';
        var s = document.createElement('script');
        s.src = 'http://localhost:3000/api/tracking/' + scriptId + '.js';
        s.async = true;
        document.head.appendChild(s);
      })();
    </script>
</head>
<body>
    <h1>Página de Teste</h1>
    <p>Esta é uma página de teste para o tracking.</p>
    
    <!-- BOTÃO COM LINK DO TELEGRAM -->
    <a href="LINK_DO_TELEGRAM_AQUI" 
       id="telegram-link" 
       style="display: inline-block; padding: 10px 20px; background: #0088cc; color: white; text-decoration: none; border-radius: 5px;">
        Entrar no Grupo
    </a>
    
    <script>
        // O script de tracking vai adicionar o event listener automaticamente
        console.log('Página carregada!');
    </script>
</body>
</html>
```

**Substitua:**
- `SEU_SCRIPT_ID_AQUI` → ID do script do funil
- `LINK_DO_TELEGRAM_AQUI` → Link do Telegram do funil

---

## 🌐 Passo 3: Servir a Página Localmente

### Opção A: Python (Mais Fácil)

```bash
# Na pasta onde está o teste.html
python -m http.server 8000
```

Acesse: **http://localhost:8000/teste.html**

### Opção B: Node.js

```bash
# Instalar http-server globalmente
npm install -g http-server

# Na pasta onde está o teste.html
http-server -p 8000
```

Acesse: **http://localhost:8000/teste.html**

---

## 📊 Passo 4: Testar Eventos

### 4.1 Testar PageView

1. Abra a página: `http://localhost:8000/teste.html`
2. Abra o **Console do Navegador** (F12)
3. Deve aparecer: `PageView registrado` ou similar
4. Vá no **Dashboard** → Deve aparecer +1 PageView ✅

### 4.2 Testar Clique

1. Na mesma página, **clique no botão** "Entrar no Grupo"
2. No console deve aparecer: `Click registrado`
3. Vá no **Dashboard** → Deve aparecer +1 Clique ✅

### 4.3 Testar Postback

1. Vá em **Postbacks** → Clique em **"Testar"**
2. Deve aparecer sucesso ou erro específico
3. Se usar webhook.site, verifique se recebeu a requisição ✅

---

## 🔗 Passo 5: Testar Entrada no Grupo (Com ngrok)

Para testar entrada/saída do grupo, você precisa expor o localhost:

### 5.1 Instalar e Configurar ngrok

**Passo 1: Criar conta no ngrok (Grátis)**
1. Acesse: https://dashboard.ngrok.com/signup
2. Crie uma conta (é grátis!)
3. Faça login

**Passo 2: Obter Authtoken**
1. Após login, vá em: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copie o token (algo como: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`)

**Passo 3: Configurar ngrok**
```bash
# Instalar ngrok (se ainda não instalou)
# Windows: Baixe em https://ngrok.com/download
# Mac: brew install ngrok

# Configurar authtoken (substitua SEU_TOKEN pelo token copiado)
ngrok config add-authtoken SEU_TOKEN

# Agora pode usar normalmente
ngrok http 3000
```

**Passo 4: Expor localhost**
```bash
ngrok http 3000
```

Você vai ver algo como:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

Você vai ver:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

### 5.2 Configurar Webhook do Telegram

1. Pegue a URL do ngrok: `https://abc123.ngrok.io`
2. Configure o webhook:

Abra no navegador (substitua `SEU_TOKEN`):
```
https://api.telegram.org/botSEU_TOKEN/setWebhook?url=https://abc123.ngrok.io/api/telegram/webhook
```

Se aparecer `{"ok":true}`, está funcionando! ✅

### 5.3 Testar Entrada no Grupo

1. Use o **link do Telegram** do funil
2. Entre no grupo via link
3. O webhook deve receber a notificação
4. Vá no **Dashboard** → Deve aparecer +1 Entrada ✅

---

## ✅ Checklist de Teste Completo

### Funcionalidades Básicas
- [ ] PageView registrado no Dashboard
- [ ] Clique registrado no Dashboard
- [ ] Postback testado com sucesso
- [ ] Status do canal carrega corretamente (sem delay excessivo)

### Tracking Completo (Com ngrok)
- [ ] Webhook do Telegram configurado
- [ ] Entrada no grupo registrada no Dashboard
- [ ] Saída do grupo registrada no Dashboard
- [ ] Evento EnterChannel enviado para Meta Pixel (verificar logs)

### Dashboard
- [ ] Métricas aparecem corretamente
- [ ] Gráficos mostram dados
- [ ] Filtros funcionam (por Funil, Pixel, Data)

---

## 🐛 Problemas Comuns e Soluções

### Erro: "Funil não encontrado"
- **Causa:** Script ID incorreto ou funil não existe
- **Solução:** Verifique o script ID no funil

### Erro: "CORS" ou "Blocked"
- **Causa:** Página aberta via `file://` ao invés de servidor
- **Solução:** Use servidor local (Python, Node.js, etc.)

### Postback não funciona
- **Causa:** URL incorreta ou servidor não acessível
- **Solução:** Use webhook.site para testar primeiro

### Status do canal demora
- **Causa:** Chamadas sequenciais à API do Telegram
- **Solução:** Já corrigido! Agora carrega em paralelo ✅

### Dashboard não mostra eventos
- **Causa:** Eventos não estão sendo salvos
- **Solução:** 
  1. Verifique o console do navegador
  2. Verifique os logs do servidor (`npm run dev`)
  3. Verifique se o funil está correto

---

## 📝 Verificar Logs

### No Navegador (Console)
- Abra F12 → Console
- Deve aparecer mensagens do script de tracking

### No Servidor (Terminal)
- Veja o terminal onde roda `npm run dev`
- Deve aparecer logs de requisições:
  ```
  POST /api/tracking/event 200 in 50ms
  ```

### No Banco de Dados
```bash
# Abrir Prisma Studio
npx prisma studio
```

Vá em **Event** → Veja se os eventos estão sendo salvos ✅

---

## 🎯 Próximos Passos

Após testar tudo localmente:

1. ✅ Confirmar que Dashboard está contabilizando conversões
2. ✅ Confirmar que eventos estão sendo salvos
3. ✅ Confirmar que postbacks funcionam
4. 🚀 Fazer deploy no Vercel
5. 🔗 Configurar webhook com URL real
6. 📊 Enviar evento EnterChannel para Meta Pixel em produção

---

## 💡 Dicas

- **Use webhook.site** para testar postbacks sem criar servidor próprio
- **Use ngrok** apenas quando precisar testar webhooks
- **Mantenha o console aberto** para ver erros
- **Verifique Prisma Studio** para ver dados no banco
- **Teste um evento por vez** para identificar problemas

---

**Agora você tem tudo para testar completamente localmente! 🎉**

