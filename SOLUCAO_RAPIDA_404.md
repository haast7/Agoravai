# 🚀 Solução Rápida para Erro 404 no Script

## 🎯 Problema

O Script ID que você está usando não existe no banco, por isso retorna **404**.

---

## ✅ Solução em 3 Passos

### **Passo 1: Acessar Página de Debug**

Depois de fazer login, acesse:

```
http://localhost:3000/debug
```

**OU** acesse diretamente a API:

```
http://localhost:3000/api/debug/funnels
```

---

### **Passo 2: Copiar Script ID Correto**

Na página de debug, você verá:

```
📋 Funis e Script IDs
   ✅ Nome: "Nome do Funil"
      Script ID: "SCRIPT_ID_CORRETO_AQUI"
      URL: http://localhost:3000/api/tracking/SCRIPT_ID_CORRETO_AQUI.js
```

**Copie o Script ID que aparece lá!**

---

### **Passo 3: Atualizar HTML**

Substitua o script antigo pelo novo:

```html
<!-- ANTES (errado) -->
<script src="http://localhost:3000/api/tracking/ad75cfdc-cba2-4d70-a5ab-c94881f76c39.js"></script>

<!-- DEPOIS (correto - use o Script ID que aparecer no debug) -->
<script src="http://localhost:3000/api/tracking/SCRIPT_ID_CORRETO_AQUI.js"></script>
```

---

## 🔍 Verificar Terminal do Next.js

Quando você carregar a página com o script, o terminal deve mostrar:

```
🔍 [Tracking Script] Buscando funil com scriptId: "SCRIPT_ID_CORRETO"
✅ [Tracking Script] Funil encontrado: "Nome do Funil" (ID: ...)
```

**Se aparecer isso, está funcionando! ✅**

Se aparecer:

```
❌ [Tracking Script] Funil NÃO encontrado para scriptId: "..."
📋 [Tracking Script] Funis disponíveis no banco:
   ✅ Nome: "..."
      Script ID: "..."
```

**Use o Script ID que aparece na lista!**

---

## 📊 Verificar Eventos Salvos

Acesse:

```
http://localhost:3000/debug
```

Ou:

```
http://localhost:3000/api/debug/events
```

Isso mostra se há eventos sendo salvos.

**Se não aparecer nenhum evento PageView, o script não está funcionando!**

---

## 🎯 Checklist

- [ ] Acessei `/debug` ou `/api/debug/funnels`
- [ ] Copiei o Script ID correto
- [ ] Atualizei o HTML com o Script ID correto
- [ ] Limpei o cache do navegador (Ctrl+Shift+Delete)
- [ ] Testei em modo anônimo (Ctrl+Shift+N)
- [ ] Terminal mostra "✅ Funil encontrado"
- [ ] Eventos aparecem em `/debug`

---

## 🆘 Ainda Não Funciona?

1. **Verifique o terminal do Next.js** quando carregar a página
2. **Me envie o que aparece** no terminal (deve mostrar a lista de funis)
3. **Acesse `/debug`** e me envie o que aparece lá

---

**Acesse `/debug` agora e me diga qual Script ID aparece lá! 🎯**







