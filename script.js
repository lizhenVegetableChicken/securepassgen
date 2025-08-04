// Password generator functionality
class PasswordGenerator {
    constructor() {
        this.characters = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
        
        this.similarCharacters = 'il1Lo0O';
        this.initializeElements();
        this.addEventListeners();
        this.generatePassword(); // Generate initial password
    }

    initializeElements() {
        // Generator elements
        this.passwordInput = document.getElementById('generatedPassword');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        this.lengthSlider = document.getElementById('passwordLength');
        this.lengthDisplay = document.getElementById('lengthDisplay');
        
        // Checkboxes
        this.uppercaseCheck = document.getElementById('includeUppercase');
        this.lowercaseCheck = document.getElementById('includeLowercase');
        this.numbersCheck = document.getElementById('includeNumbers');
        this.symbolsCheck = document.getElementById('includeSymbols');
        this.excludeSimilarCheck = document.getElementById('excludeSimilar');
        
        // Checker elements
        this.passwordToCheck = document.getElementById('passwordToCheck');
        this.meterFill = document.getElementById('meterFill');
        this.meterText = document.getElementById('meterText');
        this.criteriaList = document.getElementById('criteriaList');
        this.eyeIcon = document.getElementById('eyeIcon');
    }

    addEventListeners() {
        // Length slider
        this.lengthSlider.addEventListener('input', () => {
            this.lengthDisplay.textContent = this.lengthSlider.value;
            this.generatePassword();
        });

        // Checkboxes
        [this.uppercaseCheck, this.lowercaseCheck, this.numbersCheck, 
         this.symbolsCheck, this.excludeSimilarCheck].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.generatePassword());
        });

        // Password checker
        this.passwordToCheck.addEventListener('input', () => {
            this.checkPasswordStrength();
        });
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const includeUppercase = this.uppercaseCheck.checked;
        const includeLowercase = this.lowercaseCheck.checked;
        const includeNumbers = this.numbersCheck.checked;
        const includeSymbols = this.symbolsCheck.checked;
        const excludeSimilar = this.excludeSimilarCheck.checked;

        // Build character set
        let charset = '';
        if (includeLowercase) charset += this.characters.lowercase;
        if (includeUppercase) charset += this.characters.uppercase;
        if (includeNumbers) charset += this.characters.numbers;
        if (includeSymbols) charset += this.characters.symbols;

        // Remove similar characters if requested
        if (excludeSimilar) {
            charset = charset.split('').filter(char => 
                !this.similarCharacters.includes(char)
            ).join('');
        }

        // Generate password
        if (charset === '') {
            this.passwordInput.value = 'Please select at least one character type';
            this.updateStrengthMeter(0, 'Invalid');
            return;
        }

        let password = '';
        
        // Ensure at least one character from each selected type
        const guaranteedChars = [];
        if (includeLowercase) guaranteedChars.push(this.getRandomChar(this.characters.lowercase, excludeSimilar));
        if (includeUppercase) guaranteedChars.push(this.getRandomChar(this.characters.uppercase, excludeSimilar));
        if (includeNumbers) guaranteedChars.push(this.getRandomChar(this.characters.numbers, excludeSimilar));
        if (includeSymbols) guaranteedChars.push(this.getRandomChar(this.characters.symbols, excludeSimilar));

        // Add guaranteed characters
        guaranteedChars.forEach(char => password += char);

        // Fill remaining length
        for (let i = password.length; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        // Shuffle the password
        password = this.shuffleString(password);
        
        this.passwordInput.value = password;
        
        // Calculate and display strength
        const strength = this.calculatePasswordStrength(password);
        this.updateStrengthMeter(strength.score, strength.level);
    }

    getRandomChar(charset, excludeSimilar) {
        if (excludeSimilar) {
            charset = charset.split('').filter(char => 
                !this.similarCharacters.includes(char)
            ).join('');
        }
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }

    shuffleString(str) {
        return str.split('').sort(() => Math.random() - 0.5).join('');
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let level = 'Weak';

        if (password.length === 0) {
            return { score: 0, level: 'No Password' };
        }

        // Length scoring
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 15;
        if (password.length >= 16) score += 10;

        // Character variety scoring
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;

        // Additional scoring for complexity
        if (password.length > 20) score += 5;
        if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) score += 5;

        // Determine level
        if (score >= 80) level = 'Very Strong';
        else if (score >= 60) level = 'Strong';
        else if (score >= 40) level = 'Fair';
        else if (score >= 20) level = 'Weak';
        else level = 'Very Weak';

        return { score: Math.min(100, score), level };
    }

    updateStrengthMeter(score, level) {
        this.strengthFill.style.width = `${score}%`;
        this.strengthText.textContent = level;

        // Remove existing strength classes
        this.strengthFill.className = 'strength-fill';
        
        // Add appropriate strength class
        if (score < 25) this.strengthFill.classList.add('strength-weak');
        else if (score < 50) this.strengthFill.classList.add('strength-fair');
        else if (score < 75) this.strengthFill.classList.add('strength-good');
        else this.strengthFill.classList.add('strength-strong');
    }

    checkPasswordStrength() {
        const password = this.passwordToCheck.value;
        const strength = this.calculatePasswordStrength(password);
        
        // Update meter
        this.meterFill.style.width = `${strength.score}%`;
        this.meterText.textContent = strength.level;
        
        // Remove existing strength classes
        this.meterFill.className = 'meter-fill';
        
        // Add appropriate strength class
        if (strength.score < 25) this.meterFill.classList.add('strength-weak');
        else if (strength.score < 50) this.meterFill.classList.add('strength-fair');
        else if (strength.score < 75) this.meterFill.classList.add('strength-good');
        else this.meterFill.classList.add('strength-strong');

        // Update criteria
        this.updateCriteria(password);
    }

    updateCriteria(password) {
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };

        Object.keys(criteria).forEach(type => {
            const element = document.querySelector(`[data-type="${type}"]`);
            if (element) {
                if (criteria[type]) {
                    element.classList.add('met');
                    element.querySelector('i').className = 'fas fa-check';
                } else {
                    element.classList.remove('met');
                    element.querySelector('i').className = 'fas fa-times';
                }
            }
        });
    }
}

// Utility functions
function copyPassword() {
    const passwordInput = document.getElementById('generatedPassword');
    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(passwordInput.value).then(() => {
        showCopyFeedback();
    }).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
        showCopyFeedback();
    });
}

function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalHTML = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    copyBtn.style.background = 'var(--gradient-secondary)';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.background = 'var(--gradient-primary)';
    }, 2000);
}

function setQuickOption(length, uppercase, lowercase, numbers, symbols) {
    const generator = window.passwordGenerator;
    
    // Set length
    generator.lengthSlider.value = length;
    generator.lengthDisplay.textContent = length;
    
    // Set checkboxes
    generator.uppercaseCheck.checked = uppercase;
    generator.lowercaseCheck.checked = lowercase;
    generator.numbersCheck.checked = numbers;
    generator.symbolsCheck.checked = symbols;
    
    // Generate new password
    generator.generatePassword();
    
    // Add visual feedback
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => btn.style.transform = 'scale(1)');
    
    event.target.closest('.quick-btn').style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.target.closest('.quick-btn').style.transform = 'scale(1)';
    }, 150);
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordToCheck');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function toggleLanguage() {
    const langBtn = document.querySelector('.language-btn span');
    const currentLang = langBtn.textContent;
    
    // This is a placeholder for future language switching functionality
    if (currentLang === 'EN') {
        langBtn.textContent = 'CN';
        // Here you would implement actual language switching
        showNotification('Language switching coming soon!');
    } else {
        langBtn.textContent = 'EN';
        showNotification('Language switching coming soon!');
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.tip-card, .feature, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Add particle effect to hero section
function initParticleEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        hero.appendChild(particle);
    }

    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Handle scroll events here if needed
        }, 10);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password generator
    window.passwordGenerator = new PasswordGenerator();
    
    // Initialize other features
    initSmoothScrolling();
    initScrollAnimations();
    initParticleEffect();
    initPerformanceOptimizations();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate password
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            window.passwordGenerator.generatePassword();
            e.preventDefault();
        }
        
        // Ctrl/Cmd + C when password input is focused to copy
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && 
            document.activeElement === document.getElementById('generatedPassword')) {
            copyPassword();
            e.preventDefault();
        }
    });
    
    // Add focus management for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    console.log('SecurePassGen initialized successfully! 🔐');
}); 