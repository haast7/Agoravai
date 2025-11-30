# 🔧 Troubleshooting - Erro 500 ao Carregar Script

## 🐛 Problema: Erro 500 ao Carregar Script

Se você está vendo:
```
GET http://localhost:3000/api/tracking/SEU_SCRIPT_ID.js
net::ERR_ABORTED 500 (Internal Server Error)
```

---

## ✅ Soluções Passo a Passo

### **1. Verificar se o Funil Existe**

O erro pode acontecer se o Script ID não existe no banco.

**Como verificar:**
1. Vá no sistema → **Funis**
2. Clique no seu funil
3. Copie o **Script ID** novamente
4. Certifique-se de que está correto (sem espaços, sem caracteres extras)

---

### **2. Verificar Terminal do Servidor**

O erro real aparece no terminal onde roda `npm run dev`.

**O que fazer:**
1. Olhe o terminal onde está rodando `npm run dev`
2. Procure por mensagens de erro
3. Deve aparecer algo como:
   ```
   Erro ao gerar script: [detalhes do erro]
   ```

**Me envie essa mensagem de erro!** Assim posso ajudar melhor.

---

### **3. Verificar se Pixel, Domínio e Canal Estão Configurados**

O script precisa que o funil tenha:
- ✅ Pixel configurado
- ✅ Domínio configurado  
- ✅ Canal configurado

**Como verificar:**
1. Vá em **Funis** → Clique no seu funil
2. Verifique se mostra:
   - Pixel: [Nome do Pixel]
   - Domínio: [URL do Domínio]
   - Canal: [Nome do Canal]

**Se algum estiver faltando:**
- Edite o funil e adicione o que está faltando

---

### **4. Verificar Script ID no HTML**

**Erro comum:** Script ID incorreto no HTML

**Como corrigir:**
1. Vá em **Funis** → Clique no seu funil
2. Copie o **Script ID** completo
3. Cole no seu HTML exatamente como está

**Exemplo correto:**
```html
<script>
  (function() {
    var scriptId = 'ad75cfdc-cba2-4d70-a5ab-c94881f76c39'; // SEM .js aqui!
    var s = document.createElement('script');
    s.src = 'http://localhost:3000/api/tracking/' + scriptId + '.js'; // .js só aqui
    s.async = true;
    document.head.appendChild(s);
  })();
</script>
```

---

### **5. Verificar se o Servidor Está Rodando**

**Como verificar:**
1. Certifique-se de que `npm run dev` está rodando
2. Acesse: `http://localhost:3000`
3. Deve aparecer a página de login

**Se não estiver rodando:**
```bash
npm run dev
```

---

### **6. Testar URL do Script Diretamente**

Abra no navegador (substitua `SEU_SCRIPT_ID`):

```
http://localhost:3000/api/tracking/SEU_SCRIPT_ID.js
```

**O que deve aparecer:**
- ✅ Código JavaScript → Está funcionando!
- ❌ Erro 404 → Script ID incorreto
- ❌ Erro 500 → Problema no servidor (veja terminal)

---

## 🔍 Verificar Logs Detalhados

Agora o código mostra mais detalhes do erro. Verifique:

1. **Terminal do servidor** (`npm run dev`)
2. Procure por:
   ```
   Erro ao gerar script: [mensagem]
   Detalhes do erro: [detalhes]
   ```

**Me envie essas mensagens!**

---

## ✅ Checklist Rápido

- [ ] Funil existe no sistema?
- [ ] Script ID está correto no HTML?
- [ ] Pixel está configurado no funil?
- [ ] Domínio está configurado no funil?
- [ ] Canal está configurado no funil?
- [ ] Servidor está rodando (`npm run dev`)?
- [ ] URL do script funciona no navegador?

---

## 🆘 Ainda com Problema?

**Me envie:**
1. ✅ Mensagem de erro do terminal do servidor
2. ✅ Script ID que você está usando
3. ✅ Se o funil tem Pixel, Domínio e Canal configurados

Assim posso ajudar melhor! 🎯







