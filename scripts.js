// Modern ES6+ JavaScript for CV Website - Formspree Version
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitButton = document.querySelector('.submit-button');
        this.isSubmitting = false;

        if (this.form) {
            this.init();
        }
    }

    init() {
        // Add event listeners
        this.addEventListeners();

        // Add real-time validation
        this.addRealTimeValidation();

        console.log("Contact form initialized successfully");
    }

    addEventListeners() {
        // Form submission enhancement
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input focus effects
        this.addInputFocusEffects();

        // Submit button hover effects
        this.addButtonEffects();
    }

    addInputFocusEffects() {
        const inputs = this.form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                this.validateField(input);
            });
        });
    }

    addButtonEffects() {
        if (this.submitButton) {
            this.submitButton.addEventListener('mouseenter', () => {
                if (!this.isSubmitting) {
                    this.submitButton.style.transform = 'translateY(-2px)';
                }
            });

            this.submitButton.addEventListener('mouseleave', () => {
                if (!this.isSubmitting) {
                    this.submitButton.style.transform = 'translateY(0)';
                }
            });
        }
    }

    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                if (input.value.trim()) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();

        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        // Field-specific validation
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name muss mindestens 2 Zeichen lang sein';
                } else if (value.length > 100) {
                    isValid = false;
                    errorMessage = 'Name darf maximal 100 Zeichen lang sein';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
                }
                break;

            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Betreff muss mindestens 3 Zeichen lang sein';
                } else if (value.length > 200) {
                    isValid = false;
                    errorMessage = 'Betreff darf maximal 200 Zeichen lang sein';
                }
                break;

            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Nachricht muss mindestens 10 Zeichen lang sein';
                } else if (value.length > 2000) {
                    isValid = false;
                    errorMessage = 'Nachricht darf maximal 2000 Zeichen lang sein';
                }
                break;
        }

        // Display error if invalid
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        // Create error element if it doesn't exist
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.color = '#ff6b35';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '0.25rem';
            errorElement.style.display = 'block';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('error');
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    handleSubmit(e) {
        // Only validate, Formspree handles the actual submission
        if (!this.validateForm()) {
            e.preventDefault();
            this.showStatus('Bitte korrigieren Sie die Fehler im Formular.', 'error');
            return false;
        }

        // Let Formspree handle the submission
        this.isSubmitting = true;
        this.setSubmittingState(true);
        
        // Show success message after a delay (since Formspree redirects)
        setTimeout(() => {
            this.showStatus('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
        }, 100);
    }

    setSubmittingState(isSubmitting) {
        if (this.submitButton) {
            if (isSubmitting) {
                this.submitButton.disabled = true;
                this.submitButton.textContent = 'Wird gesendet...';
            } else {
                this.submitButton.disabled = false;
                this.submitButton.textContent = 'Nachricht senden';
            }
        }
    }

    showStatus(message, type) {
        // Create status element if it doesn't exist
        let statusElement = document.querySelector('.submit-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.className = 'submit-status';
            statusElement.style.marginTop = '1rem';
            statusElement.style.padding = '0.75rem';
            statusElement.style.borderRadius = '8px';
            statusElement.style.textAlign = 'center';
            this.form.appendChild(statusElement);
        }

        statusElement.textContent = message;
        statusElement.style.display = 'block';
        
        if (type === 'success') {
            statusElement.style.backgroundColor = '#48bb78';
            statusElement.style.color = 'white';
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        } else {
            statusElement.style.backgroundColor = '#ff6b35';
            statusElement.style.color = 'white';
        }
    }
}

// Performance monitoring - Mobile Optimized
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        // Monitor page load performance
        this.measurePageLoad();

        // Monitor form interactions only on desktop
        if (!this.isMobile) {
            this.measureFormPerformance();
        }
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;

                    // Mobile-specific logging
                    if (this.isMobile) {
                        console.log('Mobile Performance metrics:', this.metrics);
                    } else {
                        console.log('Desktop Performance metrics:', this.metrics);
                    }
                }
            }
        });
    }

    measureFormPerformance() {
        const form = document.querySelector('.contact-form');
        if (form && !this.isMobile) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('form')) {
                        console.log('Form interaction:', entry);
                    }
                }
            });

            try {
                observer.observe({ entryTypes: ['measure'] });
            } catch (error) {
                console.log('PerformanceObserver not supported:', error);
            }
        }
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addKeyboardNavigation();
        this.addScreenReaderSupport();
        this.addFocusManagement();
    }

    addKeyboardNavigation() {
        // Add keyboard navigation for form
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    const nextField = this.getNextField(e.target);
                    if (nextField) {
                        nextField.focus();
                    }
                }
            });
        }
    }

    getNextField(currentField) {
        const form = document.querySelector('.contact-form');
        if (!form) return null;
        
        const fields = Array.from(form.querySelectorAll('input, textarea, button'));
        const currentIndex = fields.indexOf(currentField);
        return fields[currentIndex + 1] || null;
    }

    addScreenReaderSupport() {
        // Add ARIA live regions for dynamic content
        const liveRegions = document.querySelectorAll('[aria-live]');
        liveRegions.forEach(region => {
            region.setAttribute('aria-atomic', 'true');
        });
    }

    addFocusManagement() {
        // Manage focus for better accessibility
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, textarea, button')) {
                e.target.setAttribute('data-focused', 'true');
            }
        });

        document.addEventListener('focusout', (e) => {
            if (e.target.matches('input, textarea, button')) {
                e.target.removeAttribute('data-focused');
            }
        });
    }
}

// Smooth scrolling utility
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Skill bars animation utility - Mobile Optimized
class SkillBarsAnimator {
    constructor() {
        this.init();
    }

    init() {
        this.observeSkillBars();
    }

    observeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar-fill');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Trigger animation by adding a class
                        entry.target.style.animation = 'fillBar 1s ease-out forwards';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '0px 0px -30px 0px'
            });

            skillBars.forEach(bar => {
                // Initially set width to 0
                const targetWidth = bar.style.getPropertyValue('--skill-width') || bar.style.width;
                bar.setAttribute('data-width', targetWidth);
                bar.style.width = '0';
                observer.observe(bar);
            });

            // Add animation keyframes if not exists
            if (!document.querySelector('#skill-bar-animation')) {
                const style = document.createElement('style');
                style.id = 'skill-bar-animation';
                style.textContent = `
                    @keyframes fillBar {
                        from { width: 0; }
                        to { width: var(--skill-width); }
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            // Fallback for older browsers
            skillBars.forEach(bar => {
                setTimeout(() => {
                    bar.style.width = bar.style.getPropertyValue('--skill-width');
                }, 300);
            });
        }
    }
}

// Main application class
class CVWebsite {
    constructor() {
        this.contactForm = null;
        this.performanceMonitor = null;
        this.accessibilityEnhancer = null;
        this.smoothScroller = null;
        this.skillBarsAnimator = null;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            // Initialize all components
            this.contactForm = new ContactForm();
            this.performanceMonitor = new PerformanceMonitor();
            this.accessibilityEnhancer = new AccessibilityEnhancer();
            this.smoothScroller = new SmoothScroller();
            this.skillBarsAnimator = new SkillBarsAnimator();

            // Add global error handling
            this.addGlobalErrorHandling();

            // Add service worker registration for PWA capabilities
            this.registerServiceWorker();

            console.log('CV Website initialized successfully');
        } catch (error) {
            console.error('Failed to initialize CV Website:', error);
        }
    }

    addGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize the application
const cvWebsite = new CVWebsite();

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContactForm, CVWebsite };
}