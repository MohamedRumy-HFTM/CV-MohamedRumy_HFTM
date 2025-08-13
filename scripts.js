// Modern ES6+ JavaScript for CV Website
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = document.getElementById('submit-btn');
        this.submitStatus = document.getElementById('submit-status');
        this.isSubmitting = false;

        this.init();
    }

    init() {
        // Initialize EmailJS
        emailjs.init("NptaAAi7rHTV3_kLK");

        // Add event listeners
        this.addEventListeners();

        // Add real-time validation
        this.addRealTimeValidation();

        console.log("Contact form initialized successfully");
    }

    addEventListeners() {
        // Form submission
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
        const fieldId = field.id;
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldId}-error`);

        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        // Field-specific validation
        switch (fieldId) {
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
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.classList.add('error');
        }
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            field.classList.remove('error');
        }
    }

    validateForm() {
        const fields = ['name', 'email', 'subject', 'message'];
        let isValid = true;

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) {
            return;
        }

        // Validate form
        if (!this.validateForm()) {
            this.showStatus('Bitte korrigieren Sie die Fehler im Formular.', 'error');
            return;
        }

        // Start submission
        this.isSubmitting = true;
        this.setSubmittingState(true);

        try {
            await this.sendEmail();
        } catch (error) {
            console.error('Email sending failed:', error);
            this.showStatus('Entschuldigung, es gab einen Fehler beim Senden. Bitte versuchen Sie es später erneut.', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmittingState(false);
        }
    }

    setSubmittingState(isSubmitting) {
        if (isSubmitting) {
            this.submitButton.disabled = true;
            this.submitButton.querySelector('.button-text').textContent = 'Wird gesendet...';
            this.submitButton.querySelector('.loading-spinner').style.display = 'inline-block';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.querySelector('.button-text').textContent = 'Nachricht senden';
            this.submitButton.querySelector('.loading-spinner').style.display = 'none';
        }
    }

    async sendEmail() {
        const formData = {
            from_name: document.getElementById('name').value.trim(),
            from_email: document.getElementById('email').value.trim(),
            message: `${document.getElementById('subject').value.trim()}\n\n${document.getElementById('message').value.trim()}`
        };

        try {
            const response = await emailjs.send('service_2ro0mw5', 'template_do7y9wr', formData);
            console.log('Email sent successfully:', response);
            this.showStatus('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', 'success');
            this.resetForm();
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }
    }

    showStatus(message, type) {
        this.submitStatus.textContent = message;
        this.submitStatus.className = `submit-status ${type}`;
        this.submitStatus.style.display = 'block';

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.submitStatus.style.display = 'none';
            }, 5000);
        }
    }

    resetForm() {
        this.form.reset();

        // Clear all error states
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.clearFieldError(input);
            input.classList.remove('focused');
        });

        // Clear status
        this.submitStatus.style.display = 'none';
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load performance
        this.measurePageLoad();

        // Monitor form interactions
        this.measureFormPerformance();
    }

    measurePageLoad() {
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                this.metrics.pageLoadTime = perfData.loadEventEnd - perfData.loadEventStart;
                this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;

                console.log('Performance metrics:', this.metrics);
            }
        });
    }

    measureFormPerformance() {
        const form = document.getElementById('contact-form');
        if (form) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('form')) {
                        console.log('Form interaction:', entry);
                    }
                }
            });

            observer.observe({ entryTypes: ['measure'] });
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
        const form = document.getElementById('contact-form');
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
        const fields = Array.from(this.form.querySelectorAll('input, textarea'));
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
                const target = document.querySelector(anchor.getAttribute('href'));
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

// Skill bars animation utility
class SkillBarsAnimator {
    constructor() {
        this.init();
    }

    init() {
        this.observeSkillBars();
    }

    observeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.width = entry.target.style.getPropertyValue('--skill-width');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -50px 0px'
            });

            skillBars.forEach(bar => {
                observer.observe(bar);
            });
        } else {
            // Fallback for older browsers
            skillBars.forEach(bar => {
                setTimeout(() => {
                    bar.style.width = bar.style.getPropertyValue('--skill-width');
                }, 500);
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