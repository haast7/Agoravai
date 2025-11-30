# 🔧 Resolver Erro 404 no Script

## 🐛 Problema

O script está retornando **404**, então não está carregando. Se não carrega, não envia eventos, e o Dashboard não mostra nada.

---

## ✅ Solução Passo a Passo

### **Passo 1: Verificar Script ID Correto**

1. **No sistema**, vá em **Funis**
2. **Clique no seu funil**
3. **Clique em "Tutorial"**
4. **Copie o script completo** que aparece

O script deve ser assim:
```html
<script src="http://localhost:3000/api/tracking/SEU_SCRIPT_ID_AQUI.js"></script>
```

**⚠️ IMPORTANTE:** Use o script do "Tutorial", não um script antigo!

---

### **Passo 2: Verificar no Terminal do Next.js**

Quando você carregar a página, o terminal do Next.js deve mostrar:

**Se o Script ID estiver errado:**
```
[Tracking Script] Buscando funil com scriptId: "ad75cfdc-cba2-4d70-a5ab-c94881f76c39"
Funil não encontrado para scriptId: ad75cfdc-cba2-4d70-a5ab-c94881f76c39
Funis disponíveis no banco: [
  { name: 'Meu Funil', trackingScriptId: 'OUTRO_ID_DIFERENTE' }
]
```

**Isso mostra qual Script ID está correto!**

---

### **Passo 3: Atualizar o HTML**

1. Pegue o **Script ID correto** do terminal ou do Tutorial
2. Atualize seu HTML com o script correto:
```html
<script src="http://localhost:3000/api/tracking/SCRIPT_ID_CORRETO.js"></script>
```

---

### **Passo 4: Testar Novamente**

1. **Carregue a página** com o script correto
2. **Verifique o terminal do Next.js:**
   - Deve aparecer: `GET /api/tracking/...js 200` (não 404!)
   - Deve aparecer: `[Tracking Event] Recebido evento: PageView`
   - Deve aparecer: `[Tracking Event] Evento salvo com sucesso`

3. **Vá no Dashboard**
4. **Atualize a página** (F5)
5. **Deve aparecer +1 PageView** ✅

---

## 🔍 Como Saber se Está Funcionando

### **No Terminal do Next.js, você deve ver:**

✅ **Script carregando:**
```
GET /api/tracking/SEU_SCRIPT_ID.js 200 in 50ms
```

✅ **Evento sendo recebido:**
```
[Tracking Event] Recebido evento: { scriptId: '...', type: 'PageView' }
[Tracking Event] Funil encontrado: Nome do Funil, salvando evento PageView
[Tracking Event] Evento salvo com sucesso: { id: '...', type: 'PageView' }
POST /api/tracking/event 200 in 30ms
```

❌ **Se aparecer 404:**
```
GET /api/tracking/SEU_SCRIPT_ID.js 404 in 50ms
Funil não encontrado para scriptId: ...
```

---

## ✅ Checklist

- [ ] Script ID está correto? (Copiado do Tutorial)
- [ ] Script no HTML está no formato correto? (`<script src="...">`)
- [ ] Terminal mostra `200` ao invés de `404`?
- [ ] Terminal mostra eventos sendo salvos?
- [ ] Dashboard mostra os dados após atualizar?

---

## 🆘 Ainda com Problema?

**Me envie:**
1. ✅ O que aparece no terminal quando você carrega a página
2. ✅ O Script ID que você está usando no HTML
3. ✅ Se você copiou do "Tutorial" ou está usando script antigo

---

**Agora o código mostra logs detalhados! Verifique o terminal do Next.js e me envie o que aparecer! 🎯**







