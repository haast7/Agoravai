# 🧪 Guia de Teste Local - Track4You

Este guia explica o que você pode testar localmente e o que precisa de configuração real.

---

## ✅ O que FUNCIONA localmente (sem domínio real)

### 1. **Dashboard e Interface**
- ✅ Todas as páginas do sistema
- ✅ Criação de Domínios, Pixels, Canais, Funis, Postbacks
- ✅ Visualização de métricas (mesmo sem dados reais)
- ✅ Gráficos e tabelas

### 2. **Criação de Recursos**
- ✅ Criar Pixel (validação básica)
- ✅ Criar Canal/Bot
- ✅ Criar Funil
- ✅ Criar Postbacks
- ✅ Ver instruções de configuração (script e link)

### 3. **Sistema de Tracking (parcial)**
- ✅ O script pode ser testado localmente usando `localhost` ou `127.0.0.1`
- ✅ Pageviews podem ser registrados localmente
- ✅ Cliques podem ser registrados localmente

---

## ⚠️ O que PRECISA de domínio real

### 1. **Meta Pixel - Envio de Eventos**
- ❌ **Não funciona completamente localmente**
- O Meta Pixel precisa receber eventos de um domínio válido
- Para testar eventos reais, você precisa:
  - Ter o script no `<head>` de uma página real
  - A página precisa estar acessível publicamente
  - O Meta Pixel só aceita eventos de domínios verificados

### 2. **Telegram Bot - Webhook**
- ❌ **Não funciona completamente localmente**
- O Telegram precisa enviar webhooks para uma URL pública
- Para testar:
  - Use **ngrok** para expor seu localhost
  - Configure o webhook apontando para o ngrok
  - Ou use um servidor real

### 3. **Rastreamento de Entradas/Saídas**
- ❌ **Não funciona sem webhook configurado**
- Precisa do bot recebendo notificações do Telegram
- Precisa do webhook apontando para uma URL pública

---

## 🧪 Como Testar Localmente

### **Opção 1: Teste Completo com ngrok (Recomendado)**

1. **Instale o ngrok:**
   ```bash
   # Baixe em: https://ngrok.com/download
   # Ou use: npm install -g ngrok
   ```

2. **Inicie o servidor Next.js:**
   ```bash
   npm run dev
   # Servidor roda em http://localhost:3000
   ```

3. **Exponha com ngrok:**
   ```bash
   ngrok http 3000
   # Vai gerar uma URL tipo: https://abc123.ngrok.io
   ```

4. **Use a URL do ngrok:**
   - Configure o webhook do Telegram apontando para: `https://abc123.ngrok.io/api/telegram/webhook`
   - Use a URL do ngrok no script de tracking
   - Agora tudo funciona como se fosse um domínio real!

### **Opção 2: Teste Parcial (Sem Webhook)**

Você pode testar:
- ✅ Criar todos os recursos
- ✅ Ver o script gerado
- ✅ Ver o link do Telegram gerado
- ✅ Testar a interface completa
- ❌ Não vai rastrear entradas/saídas do Telegram (precisa webhook)
- ❌ Não vai enviar eventos para Meta Pixel (precisa domínio real)

---

## 📋 Checklist de Teste

### **Teste Básico (Localhost)**
- [ ] Criar conta e fazer login
- [ ] Criar Domínio
- [ ] Criar Pixel
- [ ] Criar Canal/Bot
- [ ] Criar Funil
- [ ] Ver instruções (script e link)
- [ ] Criar Postbacks

### **Teste Completo (Com ngrok ou domínio real)**
- [ ] Configurar webhook do Telegram
- [ ] Adicionar script no `<head>` de uma página
- [ ] Testar pageview (visitar a página)
- [ ] Testar clique (clicar no link do Telegram)
- [ ] Testar entrada no grupo (entrar via link)
- [ ] Verificar eventos no Dashboard
- [ ] Verificar eventos no Meta Pixel

---

## 🎯 Resumo

**Para testar COMPLETAMENTE:**
- ✅ Use **ngrok** para expor seu localhost
- ✅ Configure webhook do Telegram apontando para ngrok
- ✅ Use a URL do ngrok no script
- ✅ Agora tudo funciona como produção!

**Para testar PARCIALMENTE:**
- ✅ Teste toda a interface localmente
- ✅ Crie todos os recursos
- ✅ Veja as instruções geradas
- ❌ Não vai rastrear eventos reais (precisa webhook público)

---

## 💡 Dica

**A forma mais fácil de testar tudo:**
1. Use ngrok para expor o localhost
2. Configure o webhook do Telegram com a URL do ngrok
3. Use a URL do ngrok no script
4. Agora você tem um ambiente completo funcionando!

**Exemplo:**
- Seu localhost: `http://localhost:3000`
- ngrok gera: `https://abc123.ngrok.io`
- Use `https://abc123.ngrok.io` em tudo
- Funciona igual a produção! 🎉



