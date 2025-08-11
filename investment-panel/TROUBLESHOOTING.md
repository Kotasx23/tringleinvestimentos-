# 🔧 Troubleshooting - Erro 404 no Vercel

## ❌ Problema: 404 NÃO_ENCONTRADO

Se você está recebendo erro 404 no Vercel, siga este guia para resolver:

## 🔍 **Diagnóstico**

### 1. **Verifique a estrutura de arquivos**
Certifique-se de que os arquivos estão na estrutura correta:

```
investment-panel/
├── api/
│   ├── create_payment.js
│   ├── payment_status.js
│   ├── webhook_mercadopago.js
│   └── test.js
├── vercel.json
└── package.json
```

### 2. **Teste o endpoint básico**
Acesse: `https://your-app.vercel.app/api/test`

Deve retornar:
```json
{
  "message": "API funcionando!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "method": "GET",
  "url": "/api/test"
}
```

## 🛠️ **Soluções**

### **Solução 1: Re-deploy**
1. Faça commit das mudanças
2. Push para o repositório
3. Aguarde o re-deploy automático no Vercel

### **Solução 2: Verificar variáveis de ambiente**
No painel do Vercel, confirme que as variáveis estão configuradas:

```env
MP_ACCESS_TOKEN=APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=https://your-app.vercel.app
```

### **Solução 3: Verificar logs do Vercel**
1. Acesse o painel do Vercel
2. Vá em "Functions" 
3. Verifique os logs de erro

### **Solução 4: Formato dos endpoints**
Os endpoints devem usar `module.exports` (não `export default`):

```javascript
// ✅ CORRETO
module.exports = async (req, res) => {
  // código aqui
}

// ❌ INCORRETO
export default async function handler(req, res) {
  // código aqui
}
```

## 🧪 **Testes**

### **Teste 1: Endpoint de teste**
```bash
curl https://your-app.vercel.app/api/test
```

### **Teste 2: Endpoint de pagamento**
```bash
curl -X POST https://your-app.vercel.app/api/create_payment \
  -H "Content-Type: application/json" \
  -d '{
    "transactionAmount": 10.00,
    "description": "Teste",
    "payer": {
      "email": "test@test.com",
      "first_name": "Teste",
      "last_name": "Usuário"
    }
  }'
```

## 🔄 **Re-deploy Manual**

Se o problema persistir:

1. **Force um novo deploy:**
   - Vá no painel do Vercel
   - Clique em "Redeploy"

2. **Ou faça uma mudança mínima:**
   ```bash
   # Adicione um comentário em qualquer arquivo
   echo "// Deploy fix" >> api/test.js
   git add .
   git commit -m "Fix deploy"
   git push
   ```

## 📋 **Checklist de Verificação**

- [ ] Arquivos da API estão na pasta `/api/`
- [ ] `vercel.json` está na raiz do projeto
- [ ] Endpoints usam `module.exports`
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy foi executado com sucesso
- [ ] Logs não mostram erros

## 🆘 **Se ainda não funcionar**

1. **Verifique os logs do Vercel:**
   - Painel do Vercel → Functions → Logs

2. **Teste localmente:**
   ```bash
   npm run dev
   # Acesse http://localhost:3000/api/test
   ```

3. **Crie um novo projeto Vercel:**
   - Delete o projeto atual
   - Crie um novo projeto
   - Re-importe o repositório

## 📞 **Suporte**

Se o problema persistir:
1. Verifique os logs completos do Vercel
2. Teste com o endpoint `/api/test`
3. Confirme que todas as variáveis estão configuradas
4. Tente um re-deploy manual

---

## ✅ **Solução Rápida**

1. **Faça commit das mudanças atuais**
2. **Push para o repositório**
3. **Aguarde o re-deploy**
4. **Teste: `https://your-app.vercel.app/api/test`**

Se o endpoint de teste funcionar, os outros endpoints também devem funcionar.