# 🔍 Diagnosticar Erro 404 no Script

## 🐛 Problema Atual

- ❌ Script retorna **404** ao carregar
- ✅ Dashboard mostra "page view 200" (mas isso é só a requisição HTTP, não um evento!)
- ❌ Gráfico não muda (porque não há eventos sendo salvos)

---

## ✅ O Que Fazer Agora

### **Passo 1: Verificar Terminal do Next.js**

Quando você carregar a página com o script, o terminal deve mostrar:

```
❌ [Tracking Script] Funil NÃO encontrado para scriptId: "ad75cfdc-cba2-4d70-a5ab-c94881f76c39"
📋 [Tracking Script] Funis disponíveis no banco:
   - Nome: "Nome do Funil" | Script ID: "SCRIPT_ID_CORRETO_AQUI"
     URL: http://localhost:3000/api/tracking/SCRIPT_ID_CORRETO_AQUI.js
```

**Isso mostra qual Script ID está realmente no banco!**

---

### **Passo 2: Verificar Eventos Salvos**

Acesse no navegador (depois de fazer login):

```
http://localhost:3000/api/debug/events
```

Isso mostra:
- ✅ Todos os funis do usuário
- ✅ Total de eventos por tipo
- ✅ Eventos recentes salvos

**Se não aparecer nenhum evento PageView, significa que o script não está funcionando!**

---

### **Passo 3: Pegar Script ID Correto**

#### **Opção A: Via Terminal**
1. Carregue a página com o script
2. Veja o terminal do Next.js
3. Copie o Script ID que aparece em "Funis disponíveis"
4. Use esse Script ID no HTML

#### **Opção B: Via Debug API**
1. Acesse: `http://localhost:3000/api/debug/funnels`
2. Veja qual Script ID está correto
3. Use esse Script ID no HTML

#### **Opção C: Via Tutorial**
1. Vá em **Funis** → Clique no seu funil
2. Clique em **"Tutorial"**
3. **Copie o script completo** novamente
4. Cole no HTML

---

## 🔧 Solução Rápida

### **1. Verificar Script ID Correto**

Acesse:
```
http://localhost:3000/api/debug/funnels
```

Veja qual Script ID está correto e use no HTML.

---

### **2. Atualizar HTML com Script Correto**

Substitua o script antigo pelo novo:

```html
<!-- ANTES (errado) -->
<script src="http://localhost:3000/api/tracking/ad75cfdc-cba2-4d70-a5ab-c94881f76c39.js"></script>

<!-- DEPOIS (correto - use o Script ID que aparecer no debug) -->
<script src="http://localhost:3000/api/tracking/SCRIPT_ID_CORRETO_AQUI.js"></script>
```

---

### **3. Testar Novamente**

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Ou use modo anônimo** (Ctrl+Shift+N)
3. **Carregue a página** com o script correto
4. **Verifique o terminal** - deve aparecer:
   ```
   [Tracking Script] Buscando funil com scriptId: "SCRIPT_ID_CORRETO"
   ```
   (SEM erro 404!)

5. **Verifique eventos salvos**:
   ```
   http://localhost:3000/api/debug/events
   ```
   Deve aparecer eventos PageView!

6. **Atualize o dashboard** - deve aparecer PageView no gráfico!

---

## 📋 Checklist

- [ ] Terminal mostra lista de "Funis disponíveis"?
- [ ] Script ID do terminal é diferente do que você está usando?
- [ ] Pegou o script do Tutorial novamente?
- [ ] Limpou cache do navegador?
- [ ] Testou em modo anônimo?
- [ ] Script carrega sem erro 404?
- [ ] Eventos aparecem em `/api/debug/events`?
- [ ] Dashboard mostra PageView no gráfico?

---

## 🆘 Me Envie

Para eu ajudar melhor, preciso de:

1. ✅ **O que aparece no terminal do Next.js** quando você carrega a página
   - Deve mostrar: `❌ [Tracking Script] Funil NÃO encontrado...`
   - Deve mostrar: `📋 [Tracking Script] Funis disponíveis...`

2. ✅ **O que aparece em** `http://localhost:3000/api/debug/funnels`
   - Deve mostrar todos os seus funis e Script IDs

3. ✅ **O que aparece em** `http://localhost:3000/api/debug/events`
   - Deve mostrar se há eventos salvos ou não

---

## 🎯 Resumo

**O problema é simples:**
- O Script ID que você está usando não existe no banco
- Por isso retorna 404
- Sem o script carregar, nenhum evento é salvo
- Por isso o gráfico não muda

**A solução é simples:**
1. Pegue o Script ID correto (via terminal ou debug API)
2. Use esse Script ID no HTML
3. Teste novamente

**Verifique o terminal do Next.js e me envie o que aparecer! 🎯**



