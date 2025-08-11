class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.currentOperandElement = document.getElementById('current-operand');
        this.previousOperandElement = document.getElementById('previous-operand');
        
        this.initializeEventListeners();
        this.initializePWA();
        this.initializeMenu();
        this.updateDisplay();
    }
    
    initializeEventListeners() {
        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                const action = e.target.dataset.action;
                const value = e.target.dataset.value;
                
                this.handleButtonClick(action, value);
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        
        // Touch feedback
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('btn')) {
                e.target.style.transform = 'scale(0.95)';
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('btn')) {
                e.target.style.transform = '';
            }
        });
    }
    
    handleButtonClick(action, value) {
        switch (action) {
            case 'number':
                this.appendNumber(value);
                break;
            case 'operator':
                this.chooseOperation(value);
                break;
            case 'equals':
                this.compute();
                break;
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
        }
        
        this.updateDisplay();
        this.addVisualFeedback();
    }
    
    handleKeyboardInput(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9' || key === '.') {
            this.appendNumber(key);
        } else if (key === '+' || key === '-') {
            this.chooseOperation(key);
        } else if (key === '*') {
            this.chooseOperation('*');
        } else if (key === '/') {
            e.preventDefault();
            this.chooseOperation('/');
        } else if (key === 'Enter' || key === '=') {
            this.compute();
        } else if (key === 'Backspace') {
            this.delete();
        } else if (key === 'Escape') {
            this.clear();
        }
        
        this.updateDisplay();
    }
    
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError('Divisão por zero!');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    delete() {
        if (this.shouldResetScreen) return;
        
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }
    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('pt-BR', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
    
    getOperationSymbol(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '-';
            case '*': return '×';
            case '/': return '÷';
            case '%': return '%';
            default: return '';
        }
    }
    
    addVisualFeedback() {
        this.currentOperandElement.classList.add('changed');
        setTimeout(() => {
            this.currentOperandElement.classList.remove('changed');
        }, 200);
    }
    
    showError(message) {
        const originalText = this.currentOperandElement.innerText;
        this.currentOperandElement.innerText = message;
        this.currentOperandElement.classList.add('error');
        
        setTimeout(() => {
            this.currentOperandElement.innerText = originalText;
            this.currentOperandElement.classList.remove('error');
        }, 2000);
    }
    
    initializePWA() {
        // Install prompt
        let deferredPrompt;
        const installPrompt = document.getElementById('install-prompt');
        const installBtn = document.getElementById('install-btn');
        const dismissBtn = document.getElementById('dismiss-btn');
        const installMenuBtn = document.getElementById('install-menu-btn');
        const installBadge = document.getElementById('install-badge');
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install badge in menu
            if (installBadge) {
                installBadge.style.display = 'inline-block';
            }
            
            // Show install prompt after 3 seconds
            setTimeout(() => {
                if (deferredPrompt && installPrompt) {
                    installPrompt.style.display = 'block';
                }
            }, 3000);
        });
        
        // Install button in prompt
        if (installBtn) {
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                        this.showNotification('App instalado com sucesso!', 'success');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    
                    deferredPrompt = null;
                    if (installPrompt) installPrompt.style.display = 'none';
                    if (installBadge) installBadge.style.display = 'none';
                }
            });
        }
        
        // Dismiss button in prompt
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                if (installPrompt) installPrompt.style.display = 'none';
            });
        }
        
        // Install button in menu
        if (installMenuBtn) {
            installMenuBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (outcome === 'accepted') {
                        console.log('User accepted the install prompt from menu');
                        this.showNotification('App instalado com sucesso!', 'success');
                    } else {
                        console.log('User dismissed the install prompt from menu');
                    }
                    
                    deferredPrompt = null;
                    if (installBadge) installBadge.style.display = 'none';
                } else {
                    // Show instructions for manual installation
                    this.showInstallInstructions();
                }
            });
        }
        
        // App installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            if (installPrompt) installPrompt.style.display = 'none';
            if (installBadge) installBadge.style.display = 'none';
            this.showNotification('App instalado com sucesso!', 'success');
        });
        
        // Online/Offline status
        const connectionStatus = document.getElementById('connection-status');
        const appStatus = document.getElementById('app-status');
        
        window.addEventListener('online', () => {
            if (connectionStatus) {
                connectionStatus.textContent = 'Online';
                connectionStatus.classList.remove('offline');
            }
            if (appStatus) {
                appStatus.textContent = 'Online';
                appStatus.classList.remove('offline');
            }
        });
        
        window.addEventListener('offline', () => {
            if (connectionStatus) {
                connectionStatus.textContent = 'Offline';
                connectionStatus.classList.add('offline');
            }
            if (appStatus) {
                appStatus.textContent = 'Offline';
                appStatus.classList.add('offline');
            }
        });
        
        // Check initial connection status
        if (!navigator.onLine) {
            if (connectionStatus) {
                connectionStatus.textContent = 'Offline';
                connectionStatus.classList.add('offline');
            }
            if (appStatus) {
                appStatus.textContent = 'Offline';
                appStatus.classList.add('offline');
            }
        }
        
        // Add to home screen for iOS
        if (navigator.standalone) {
            document.body.classList.add('standalone');
        }
    }
    
    initializeMenu() {
        const menuBtn = document.getElementById('menu-btn');
        const closeMenuBtn = document.getElementById('close-menu-btn');
        const menuOverlay = document.getElementById('menu-overlay');
        const sideMenu = document.getElementById('side-menu');
        const aboutBtn = document.getElementById('about-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const helpBtn = document.getElementById('help-btn');
        
        // Open menu
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.openMenu();
            });
        }
        
        // Close menu
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Close menu on overlay click
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
        
        // Menu items
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                this.showAbout();
                this.closeMenu();
            });
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
                this.closeMenu();
            });
        }
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelp();
                this.closeMenu();
            });
        }
    }
    
    openMenu() {
        const menuOverlay = document.getElementById('menu-overlay');
        const sideMenu = document.getElementById('side-menu');
        
        if (menuOverlay && sideMenu) {
            menuOverlay.classList.add('active');
            sideMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeMenu() {
        const menuOverlay = document.getElementById('menu-overlay');
        const sideMenu = document.getElementById('side-menu');
        
        if (menuOverlay && sideMenu) {
            menuOverlay.classList.remove('active');
            sideMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.removeNotification(notification);
            });
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }
    
    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    showInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        
        if (isIOS) {
            instructions = `
                <h3>Como instalar no iOS:</h3>
                <ol>
                    <li>Toque no botão de compartilhar <span style="color: #2196F3;">⎋</span></li>
                    <li>Selecione "Adicionar à Tela Inicial"</li>
                    <li>Toque em "Adicionar"</li>
                </ol>
            `;
        } else if (isAndroid) {
            instructions = `
                <h3>Como instalar no Android:</h3>
                <ol>
                    <li>Toque no menu (3 pontos) <span style="color: #2196F3;">⋮</span></li>
                    <li>Selecione "Adicionar à tela inicial"</li>
                    <li>Toque em "Adicionar"</li>
                </ol>
            `;
        } else {
            instructions = `
                <h3>Como instalar no Desktop:</h3>
                <ol>
                    <li>Clique no ícone de instalação na barra de endereços</li>
                    <li>Ou use o menu do navegador → "Instalar aplicativo"</li>
                </ol>
            `;
        }
        
        this.showModal('Instalar App', instructions);
    }
    
    showAbout() {
        const content = `
            <h3>Sobre a Calculadora PWA</h3>
            <p>Uma calculadora moderna e funcional desenvolvida como Progressive Web App.</p>
            
            <h4>Características:</h4>
            <ul>
                <li>✅ Design responsivo e moderno</li>
                <li>✅ Funciona offline</li>
                <li>✅ Instalável como app nativo</li>
                <li>✅ Operações matemáticas completas</li>
                <li>✅ Suporte a teclado</li>
            </ul>
            
            <h4>Versão:</h4>
            <p>v1.0.0</p>
            
            <h4>Desenvolvido com:</h4>
            <p>HTML5, CSS3, JavaScript ES6+, Service Workers</p>
        `;
        
        this.showModal('Sobre', content);
    }
    
    showSettings() {
        const content = `
            <h3>Configurações</h3>
            <p>Configurações em desenvolvimento...</p>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="sound-toggle" checked>
                    Som de teclas
                </label>
            </div>
            
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="vibration-toggle" checked>
                    Vibração (mobile)
                </label>
            </div>
        `;
        
        this.showModal('Configurações', content);
    }
    
    showHelp() {
        const content = `
            <h3>Ajuda</h3>
            
            <h4>Operações Básicas:</h4>
            <ul>
                <li><strong>Números:</strong> Clique nos botões ou use o teclado</li>
                <li><strong>Operadores:</strong> +, -, ×, ÷, %</li>
                <li><strong>Igual:</strong> = ou Enter</li>
                <li><strong>Limpar:</strong> AC</li>
                <li><strong>Apagar:</strong> DEL</li>
            </ul>
            
            <h4>Atalhos de Teclado:</h4>
            <ul>
                <li><strong>0-9:</strong> Números</li>
                <li><strong>+ - * /:</strong> Operadores</li>
                <li><strong>Enter ou =:</strong> Calcular</li>
                <li><strong>Escape:</strong> Limpar</li>
                <li><strong>Backspace:</strong> Apagar</li>
            </ul>
            
            <h4>Funcionalidades PWA:</h4>
            <ul>
                <li>✅ Funciona offline</li>
                <li>✅ Instalável como app</li>
                <li>✅ Notificações</li>
                <li>✅ Cache inteligente</li>
            </ul>
        `;
        
        this.showModal('Ajuda', content);
    }
    
    showModal(title, content) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal');
        modalContent.style.cssText = `
            background: var(--surface-color);
            border-radius: 12px;
            max-width: 90%;
            max-height: 80%;
            overflow-y: auto;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 100);
        
        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal(modal);
            });
        }
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }
    
    closeModal(modal) {
        const modalContent = modal.querySelector('.modal');
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent context menu on long press
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add loading state
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
});

// Add loading class initially
document.body.classList.add('loading');