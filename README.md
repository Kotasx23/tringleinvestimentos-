# InvestPanel - Painel de Investimentos

Um PWA completo de painel de investimentos construído com React, Vite, Tailwind CSS, Supabase e integração Mercado Pago.

## 🚀 Características

- **PWA Completo**: Instalável como app nativo
- **Tema Claro/Escuro**: Interface responsiva e moderna
- **Autenticação**: Sistema completo com Supabase
- **Pagamentos PIX**: Integração Mercado Pago
- **Painel Admin**: Modo administrador completo
- **Gráficos**: Visualizações com Recharts
- **Responsivo**: Mobile-first design

## 🛠️ Tecnologias

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **Pagamentos**: Mercado Pago (PIX)
- **Gráficos**: Recharts
- **PWA**: Vite PWA Plugin
- **Ícones**: Lucide React

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd investment-panel
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Mercado Pago Configuration
VITE_MP_PUBLIC_KEY=APP_USR-efc7192b-9dea-43d3-a388-1a8ec43b43f5

# App Configuration
VITE_APP_URL=http://localhost:3000
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🗄️ Configuração do Supabase

### 1. Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL e a chave anônima

### 2. Configure as tabelas

Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Tabela de usuários (extensão da auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  balance DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tipos de investimento
CREATE TABLE public.investment_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  daily_return_percent DECIMAL(5,2) NOT NULL,
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de investimentos
CREATE TABLE public.investments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type_id INTEGER REFERENCES public.investment_types(id),
  amount DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  current_value DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pagamentos
CREATE TABLE public.payments (
  id SERIAL PRIMARY KEY,
  mp_payment_id TEXT UNIQUE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT DEFAULT 'pix',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  qr_code TEXT,
  ticket_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE public.transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'profit', 'investment')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_types ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para investimentos
CREATE POLICY "Users can view own investments" ON public.investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own investments" ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all investments" ON public.investments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para pagamentos
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para transações
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas para tipos de investimento
CREATE POLICY "Everyone can view active investment types" ON public.investment_types FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage investment types" ON public.investment_types FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
```

### 3. Configure o trigger para criar usuário

```sql
-- Função para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 💳 Configuração do Mercado Pago

### 1. Configure as credenciais

As credenciais já estão configuradas no código:
- **Public Key**: `APP_USR-efc7192b-9dea-43d3-a388-1a8ec43b43f5`
- **Access Token**: `APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387`

### 2. Configure o webhook (opcional)

1. Acesse o [painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Vá em "Notificações" > "Webhooks"
3. Adicione a URL: `https://your-app-domain.com/api/webhook_mercadopago`
4. Selecione os eventos: `payment.created`, `payment.updated`

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório ao Vercel**
2. **Configure as variáveis de ambiente**:
   ```
   MP_ACCESS_TOKEN=APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387
   MP_PUBLIC_KEY=APP_USR-efc7192b-9dea-43d3-a388-1a8ec43b43f5
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_URL=https://your-app.vercel.app
   ```

3. **Deploy**: O Vercel detectará automaticamente o Vite e fará o deploy

### Netlify

1. **Conecte seu repositório ao Netlify**
2. **Configure as variáveis de ambiente** (mesmas do Vercel)
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Outros

Para outros provedores, certifique-se de:
1. Configurar as variáveis de ambiente
2. Configurar o build command: `npm run build`
3. Configurar o diretório de publicação: `dist`

## 📱 PWA

O app é um PWA completo com:
- Manifest.json configurado
- Service Worker com cache offline
- Instalável como app nativo
- Ícones responsivos

## 🔐 Segurança

- **ACCESS_TOKEN**: Nunca exponha no frontend
- **Row Level Security**: Configurado no Supabase
- **CORS**: Configurado nos endpoints
- **Validação**: Dados validados no backend

## 🧪 Testando

1. **Crie uma conta de usuário**
2. **Faça login**
3. **Teste o depósito PIX** (use valores pequenos)
4. **Acesse o painel admin** (role = 'admin')

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Lint do código
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## ⚠️ Importante

- **Credenciais de teste**: As credenciais fornecidas são para teste
- **Produção**: Gere novas credenciais para produção
- **Webhook**: Configure o webhook para atualizações automáticas
- **Backup**: Faça backup regular dos dados

## 🆘 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.