# 🔍 Como Verificar o Erro do Script

## ⚠️ Importante: Terminal Correto!

Os logs que você mostrou são do **terminal da página HTML** (onde roda `python -m http.server` ou `http-server`).

**Mas o erro real aparece no terminal do Next.js!**

---

## 📍 Onde Procurar o Erro

### **Terminal do Next.js** (Onde roda `npm run dev`)

Este é o terminal que mostra os erros reais!

**O que você deve ver:**
```
✓ Ready on http://localhost:3000
```

**Quando o script tenta carregar, deve aparecer:**
```
GET /api/tracking/ad75cfdc-cba2-4d70-a5ab-c94881f76c39.js
```

**Se houver erro, vai aparecer:**
```
Erro ao gerar script: [mensagem do erro]
Funil não encontrado para scriptId: [id]
OU
Relações faltando para funil [id]: {...}
```

---

## 🧪 Teste Rápido

### **1. Abrir URL do Script Diretamente**

Abra no navegador (substitua pelo seu Script ID):
```
http://localhost:3000/api/tracking/ad75cfdc-cba2-4d70-a5ab-c94881f76c39.js
```

**O que deve aparecer:**

✅ **Código JavaScript** → Está funcionando!
```
(function() {
  const scriptId = 'ad75cfdc-cba2-4d70-a5ab-c94881f76c39';
  ...
```

❌ **"Funil não encontrado"** → Script ID incorreto

❌ **"Configuração do funil incompleta"** → Falta Pixel, Domínio ou Canal

❌ **Erro 500** → Veja o terminal do Next.js para detalhes

---

### **2. Verificar Console do Navegador**

Na página onde você colocou o script:

1. Abra o **Console** (F12 → Console)
2. Procure por erros em vermelho
3. Deve aparecer algo como:
   ```
   Failed to load resource: .../tracking/...js net::ERR_ABORTED 500
   ```

---

### **3. Verificar Terminal do Next.js**

No terminal onde roda `npm run dev`:

**Procure por:**
- `GET /api/tracking/...` → Requisição chegou
- `Erro ao gerar script:` → Erro específico
- `Funil não encontrado` → Script ID incorreto
- `Relações faltando` → Falta Pixel/Domínio/Canal

---

## ✅ Checklist de Verificação

- [ ] **Script ID está correto?**
  - Vá em Funis → Clique no funil → Copie Script ID
  - Certifique-se de que está exatamente igual

- [ ] **Funil tem Pixel configurado?**
  - Vá em Funis → Clique no funil
  - Deve mostrar: Pixel: [Nome]

- [ ] **Funil tem Domínio configurado?**
  - Deve mostrar: Domínio: [URL]

- [ ] **Funil tem Canal configurado?**
  - Deve mostrar: Canal: [Nome]

- [ ] **Servidor Next.js está rodando?**
  - Terminal deve mostrar: `✓ Ready on http://localhost:3000`

- [ ] **URL do script funciona no navegador?**
  - Abra: `http://localhost:3000/api/tracking/SEU_SCRIPT_ID.js`
  - Deve mostrar código JavaScript

---

## 🆘 Me Envie Estas Informações

Para eu ajudar melhor, preciso de:

1. ✅ **O que aparece quando você abre a URL do script diretamente?**
   ```
   http://localhost:3000/api/tracking/SEU_SCRIPT_ID.js
   ```

2. ✅ **O que aparece no terminal do Next.js** quando você tenta carregar a página?

3. ✅ **O Script ID que você está usando** (pode copiar aqui)

4. ✅ **O funil tem Pixel, Domínio e Canal configurados?**

---

## 💡 Dica

**Teste a URL do script diretamente primeiro!**

Se a URL funcionar no navegador, o problema está no HTML.
Se a URL não funcionar, o problema está no servidor (veja terminal do Next.js).

---

**Me envie essas informações e eu ajudo a resolver! 🎯**







