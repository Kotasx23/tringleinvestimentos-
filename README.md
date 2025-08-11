# Calculadora PWA

Uma calculadora simples e funcional desenvolvida como Progressive Web App (PWA) com design moderno e funcionalidades offline.

## 🚀 Características

- **Design Moderno**: Interface limpa e responsiva com tema escuro
- **Menu Lateral**: Menu completo com opções de instalação, configurações e ajuda
- **Funcionalidades PWA**: 
  - Instalável como app nativo
  - Funciona offline
  - Cache inteligente
  - Notificações push
  - Instruções de instalação específicas por plataforma
- **Calculadora Completa**: 
  - Operações básicas (+, -, ×, ÷)
  - Operação de módulo (%)
  - Suporte a decimais
  - Histórico de operações
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Acessibilidade**: Suporte a teclado e navegação por voz
- **Performance**: Carregamento rápido e animações suaves
- **Notificações**: Sistema de notificações em tempo real

## 📱 Como Instalar

### Método 1 - Menu da Aplicação:
1. Abra a calculadora no navegador
2. Toque no ícone de menu (☰) no canto superior direito
3. Selecione "Baixar App"
4. Siga as instruções específicas para sua plataforma

### Método 2 - Instalação Automática:
- **Desktop (Chrome/Edge)**: Clique no ícone de instalação na barra de endereços
- **Mobile (Android)**: Toque no menu (3 pontos) → "Adicionar à tela inicial"
- **iOS (Safari)**: Toque no botão de compartilhar → "Adicionar à Tela Inicial"

### Instruções Detalhadas por Plataforma:

#### Android:
1. Toque no menu (3 pontos) ⋮
2. Selecione "Adicionar à tela inicial"
3. Toque em "Adicionar"

#### iOS:
1. Toque no botão de compartilhar ⎋
2. Selecione "Adicionar à Tela Inicial"
3. Toque em "Adicionar"

#### Desktop:
1. Clique no ícone de instalação na barra de endereços
2. Ou use o menu do navegador → "Instalar aplicativo"

## 🎯 Como Usar

### Operações Básicas:
- **Números**: Clique nos botões numéricos ou use o teclado
- **Operadores**: +, -, ×, ÷, %
- **Igual**: = ou Enter para calcular
- **Limpar**: AC para limpar tudo
- **Apagar**: DEL para apagar o último dígito

### Atalhos de Teclado:
- `0-9`: Números
- `+`, `-`, `*`, `/`: Operadores
- `Enter` ou `=`: Calcular
- `Escape`: Limpar
- `Backspace`: Apagar

### Funcionalidades Especiais:
- **Histórico**: A operação anterior é mostrada no topo
- **Formatação**: Números são formatados automaticamente
- **Validação**: Prevenção de divisão por zero
- **Offline**: Funciona sem conexão com a internet
- **Menu Lateral**: Acesso rápido a configurações e ajuda
- **Notificações**: Feedback visual para ações importantes

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo com CSS Grid e Flexbox
- **JavaScript ES6+**: Lógica da calculadora e funcionalidades PWA
- **Service Worker**: Cache offline e funcionalidades PWA
- **Web App Manifest**: Configuração para instalação

## 📁 Estrutura do Projeto

```
calculadora-pwa/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js              # Lógica da calculadora
├── sw.js               # Service Worker
├── manifest.json       # Manifest PWA
├── icons/              # Ícones em diferentes tamanhos
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── README.md           # Este arquivo
```

## 🌐 Como Executar

### Servidor Local:
```bash
# Python 3
python -m http.server 8000

# Node.js (se tiver http-server instalado)
npx http-server

# PHP
php -S localhost:8000
```

### Acessar:
Abra `http://localhost:8000` no navegador

## 🔧 Personalização

### Cores:
As cores podem ser alteradas editando as variáveis CSS em `styles.css`:

```css
:root {
    --primary-color: #2196F3;
    --background-color: #121212;
    --surface-color: #1E1E1E;
    /* ... outras variáveis */
}
```

### Funcionalidades:
- Adicione novas operações em `app.js`
- Modifique o cache no `sw.js`
- Atualize o manifest em `manifest.json`

## 📊 Compatibilidade

- ✅ Chrome 67+
- ✅ Firefox 67+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- Ícones criados com SVG e convertidos com ImageMagick
- Design inspirado em calculadoras modernas
- Funcionalidades PWA baseadas nas melhores práticas da web

---

**Desenvolvido com ❤️ para demonstrar o poder das Progressive Web Apps**