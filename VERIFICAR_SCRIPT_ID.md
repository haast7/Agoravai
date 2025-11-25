# 🔍 Verificar Script ID - Passo a Passo

## 🐛 Problema Atual

O script gerado é:
```html
<script src="http://localhost:3000/api/tracking/ad75cfdc-cba2-4d70-a5ab-c94881f76c39.js"></script>
```

Mas retorna **404** ao carregar.

---

## ✅ O que Fazer Agora

### **Passo 1: Verificar Terminal do Next.js**

Quando você carrega a página, o terminal do Next.js deve mostrar:

```
[Tracking Script] Buscando funil com scriptId: "ad75cfdc-cba2-4d70-a5ab-c94881f76c39"
Funil não encontrado para scriptId: ad75cfdc-cba2-4d70-a5ab-c94881f76c39
Funis disponíveis no banco: [
  { name: 'Nome do Funil', trackingScriptId: 'SCRIPT_ID_REAL_AQUI' }
]
```

**Isso mostra qual Script ID está realmente no banco!**

---

### **Passo 2: Comparar Script IDs**

1. **Script ID que você está usando:** `ad75cfdc-cba2-4d70-a5ab-c94881f76c39`
2. **Script ID que aparece no terminal:** (veja na lista de "Funis disponíveis")

**Se forem diferentes:** Use o Script ID que aparece no terminal!

---

### **Passo 3: Possíveis Causas**

#### **Causa 1: Funil foi recriado**
- Se você deletou e recriou o funil, o Script ID mudou
- **Solução:** Pegue o Script ID novo do Tutorial

#### **Causa 2: Banco de dados diferente**
- Se você está usando banco local e o sistema mostra outro
- **Solução:** Verifique se está usando o mesmo banco

#### **Causa 3: Cache do navegador**
- O navegador pode estar usando script antigo em cache
- **Solução:** Limpe o cache (Ctrl+Shift+Delete) ou use modo anônimo

---

## 🔧 Solução Rápida

### **Opção 1: Pegar Script ID Correto do Terminal**

1. Carregue a página com o script
2. Veja o terminal do Next.js
3. Copie o Script ID que aparece em "Funis disponíveis"
4. Use esse Script ID no HTML

### **Opção 2: Pegar Script ID Correto do Tutorial**

1. Vá em **Funis** → Clique no seu funil
2. Clique em **"Tutorial"**
3. **Copie o script completo** novamente
4. Cole no HTML

### **Opção 3: Recriar o Funil**

Se nada funcionar:
1. Delete o funil atual
2. Crie um novo funil
3. Pegue o Script ID novo do Tutorial
4. Use no HTML

---

## 📋 Checklist

- [ ] Terminal mostra lista de "Funis disponíveis"?
- [ ] Script ID do terminal é diferente do que você está usando?
- [ ] Pegou o script do Tutorial novamente?
- [ ] Limpou cache do navegador?
- [ ] Testou em modo anônimo?

---

## 🆘 Me Envie

Para eu ajudar melhor, preciso de:

1. ✅ **O que aparece no terminal do Next.js** quando você carrega a página
   - Deve mostrar: `[Tracking Script] Buscando funil...`
   - Deve mostrar: `Funis disponíveis no banco: [...]`

2. ✅ **Qual Script ID aparece na lista** de "Funis disponíveis"

3. ✅ **Se você recriou o funil** recentemente

---

**Verifique o terminal do Next.js e me envie o que aparecer! 🎯**



