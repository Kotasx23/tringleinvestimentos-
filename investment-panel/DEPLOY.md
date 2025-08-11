# 🚀 Guia de Deploy - InvestPanel

## Deploy no Vercel (Recomendado)

### 1. Preparação
1. Faça push do código para um repositório Git (GitHub, GitLab, etc.)
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em "New Project"

### 2. Configuração do Projeto
1. **Importe o repositório** do Git
2. **Framework Preset**: Vite
3. **Root Directory**: `./` (padrão)
4. **Build Command**: `npm run build` (padrão)
5. **Output Directory**: `dist` (padrão)
6. **Install Command**: `npm install` (padrão)

### 3. Variáveis de Ambiente
Configure as seguintes variáveis no painel do Vercel:

```env
# Mercado Pago (OBRIGATÓRIO)
MP_ACCESS_TOKEN=APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387

# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_URL=https://your-app.vercel.app
```

### 4. Deploy
1. Clique em "Deploy"
2. Aguarde o build completar
3. Acesse a URL fornecida

## Deploy no Netlify

### 1. Preparação
1. Faça push do código para um repositório Git
2. Acesse [netlify.com](https://netlify.com) e faça login
3. Clique em "New site from Git"

### 2. Configuração
1. **Repository**: Selecione seu repositório
2. **Branch**: `main` ou `master`
3. **Base directory**: Deixe vazio
4. **Build command**: `npm run build`
5. **Publish directory**: `dist`

### 3. Variáveis de Ambiente
Configure as mesmas variáveis do Vercel no painel do Netlify.

## Deploy no Render

### 1. Preparação
1. Faça push do código para um repositório Git
2. Acesse [render.com](https://render.com) e faça login
3. Clique em "New +" > "Static Site"

### 2. Configuração
1. **Repository**: Conecte seu repositório
2. **Name**: `investment-panel`
3. **Branch**: `main`
4. **Build Command**: `npm install && npm run build`
5. **Publish Directory**: `dist`

### 3. Variáveis de Ambiente
Configure as mesmas variáveis nos Settings > Environment.

## Configuração do Supabase

### 1. Crie um Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha um nome e senha para o banco
5. Aguarde a criação (pode demorar alguns minutos)

### 2. Configure as Tabelas
1. Vá para "SQL Editor" no painel do Supabase
2. Execute o script SQL fornecido no README.md
3. Copie a URL e a chave anônima das configurações

### 3. Configure as Variáveis
Atualize as variáveis de ambiente com os dados do Supabase:
- `VITE_SUPABASE_URL`: URL do projeto
- `VITE_SUPABASE_ANON_KEY`: Chave anônima

## Configuração do Mercado Pago

### 1. Credenciais
As credenciais já estão configuradas no código:
- **Public Key**: `APP_USR-efc7192b-9dea-43d3-a388-1a8ec43b43f5`
- **Access Token**: `APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387`

### 2. Webhook (Opcional)
1. Acesse o [painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Vá em "Notificações" > "Webhooks"
3. Adicione a URL: `https://your-app-domain.com/api/webhook_mercadopago`
4. Selecione os eventos: `payment.created`, `payment.updated`

## Testando o Deploy

### 1. Verificação Inicial
1. Acesse a URL do seu app
2. Verifique se a página carrega corretamente
3. Teste o registro de usuário
4. Teste o login

### 2. Teste de Pagamento
1. Faça login com uma conta
2. Vá para o dashboard
3. Clique em "Fazer depósito"
4. Teste com um valor pequeno (R$ 1,00)
5. Verifique se o QR Code é gerado

### 3. Teste do Painel Admin
1. Crie um usuário admin no Supabase:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'seu-email@exemplo.com';
```
2. Faça login com esse usuário
3. Acesse `/admin` para ver o painel administrativo

## Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão instaladas
- Confirme se o Node.js está na versão 16+
- Verifique os logs de build no painel do provedor

### Erro de CORS
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o Supabase está configurado corretamente
- Verifique se os endpoints estão funcionando

### Erro de Pagamento
- Confirme se as credenciais do Mercado Pago estão corretas
- Verifique se o webhook está configurado (se aplicável)
- Teste com valores pequenos primeiro

### PWA não funciona
- Verifique se o HTTPS está habilitado
- Confirme se o manifest.json está acessível
- Teste em diferentes navegadores

## URLs Importantes

- **App**: `https://your-app-domain.com`
- **Admin**: `https://your-app-domain.com/admin`
- **Login**: `https://your-app-domain.com/login`
- **Register**: `https://your-app-domain.com/register`
- **Webhook MP**: `https://your-app-domain.com/api/webhook_mercadopago`

## Suporte

Se encontrar problemas:
1. Verifique os logs no painel do provedor
2. Confirme se todas as variáveis estão configuradas
3. Teste localmente primeiro
4. Abra uma issue no repositório