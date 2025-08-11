#!/bin/bash

# Script de Deploy para InvestPanel
echo "🚀 Iniciando deploy do InvestPanel..."

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se o .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    echo "📝 Configure as variáveis no arquivo .env"
fi

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi

# Verificar se os arquivos da API existem
echo "🔍 Verificando arquivos da API..."
if [ -f "api/create_payment.js" ] && [ -f "api/payment_status.js" ] && [ -f "api/webhook_mercadopago.js" ]; then
    echo "✅ Arquivos da API encontrados"
else
    echo "❌ Arquivos da API não encontrados"
    exit 1
fi

# Verificar se vercel.json existe
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json encontrado"
else
    echo "❌ vercel.json não encontrado"
    exit 1
fi

echo ""
echo "🎉 Projeto pronto para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça commit das mudanças:"
echo "   git add ."
echo "   git commit -m 'Fix deploy'"
echo "   git push"
echo ""
echo "2. No Vercel, configure as variáveis de ambiente:"
echo "   MP_ACCESS_TOKEN=APP_USR-8710234293112553-080912-777211fa3e9fef6e71f3a329ea20b02a-500234387"
echo "   VITE_SUPABASE_URL=your_supabase_url"
echo "   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "   VITE_APP_URL=https://your-app.vercel.app"
echo ""
echo "3. Teste os endpoints:"
echo "   https://your-app.vercel.app/api/test"
echo "   https://your-app.vercel.app/api/create_payment"
echo ""
echo "📖 Para mais informações, consulte o arquivo TROUBLESHOOTING.md"