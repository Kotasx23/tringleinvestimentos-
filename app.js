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
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install prompt after 3 seconds
            setTimeout(() => {
                if (deferredPrompt) {
                    installPrompt.style.display = 'block';
                }
            }, 3000);
        });
        
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                deferredPrompt = null;
                installPrompt.style.display = 'none';
            }
        });
        
        dismissBtn.addEventListener('click', () => {
            installPrompt.style.display = 'none';
        });
        
        // App installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            installPrompt.style.display = 'none';
        });
        
        // Online/Offline status
        const connectionStatus = document.getElementById('connection-status');
        
        window.addEventListener('online', () => {
            connectionStatus.textContent = 'Online';
            connectionStatus.classList.remove('offline');
        });
        
        window.addEventListener('offline', () => {
            connectionStatus.textContent = 'Offline';
            connectionStatus.classList.add('offline');
        });
        
        // Check initial connection status
        if (!navigator.onLine) {
            connectionStatus.textContent = 'Offline';
            connectionStatus.classList.add('offline');
        }
        
        // Add to home screen for iOS
        if (navigator.standalone) {
            document.body.classList.add('standalone');
        }
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