// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileNav();
    initSmoothScrolling();
    initFormValidation();
    initScrollEffects();
    initNewsletterForm();
    initModal();
    initFormSubmission();
    initAnimations();
});

// Mobile Navigation
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('admissionForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required.`;
    }

    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Phone validation
    if ((fieldName === 'phone' || fieldName === 'parentPhone') && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }

    // Date validation
    if (fieldName === 'dob' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        
        if (age < 3 || age > 100) {
            isValid = false;
            errorMessage = 'Please enter a valid date of birth.';
        }
    }

    // Percentage validation
    if (fieldName === 'percentage' && value) {
        const percentage = parseFloat(value);
        if (percentage < 0 || percentage > 100) {
            isValid = false;
            errorMessage = 'Percentage must be between 0 and 100.';
        }
    }

    // Course selection validation
    if (fieldName === 'courses') {
        const selectedCourses = form.querySelectorAll('input[name="courses"]:checked');
        if (selectedCourses.length === 0) {
            isValid = false;
            errorMessage = 'Please select at least one course.';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function getFieldLabel(field) {
    const label = field.previousElementSibling;
    return label ? label.textContent.replace(' *', '') : field.name;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e5e7eb';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Form Submission
function initFormSubmission() {
    const form = document.getElementById('admissionForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateForm() {
    const form = document.getElementById('admissionForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function submitForm() {
    const form = document.getElementById('admissionForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Generate application ID
        const applicationId = 'NAV' + Date.now().toString().slice(-6);
        
        // Show success modal
        showSuccessModal(applicationId);
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Modal Functions
function initModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showSuccessModal(applicationId) {
    const modal = document.getElementById('successModal');
    const applicationIdSpan = document.getElementById('applicationId');
    
    applicationIdSpan.textContent = applicationId;
    modal.style.display = 'block';
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            const originalHTML = button.innerHTML;
            
            if (email && isValidEmail(email)) {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '#2563eb';
                    this.reset();
                }, 2000);
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll Effects
function initScrollEffects() {
    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.course-card, .stat-item, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

// Animations
function initAnimations() {
    // Add animation classes to CSS
    const style = document.createElement('style');
    style.textContent = `
        .course-card, .stat-item, .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hero-title, .hero-subtitle, .hero-description {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease forwards;
        }
        
        .hero-subtitle {
            animation-delay: 0.2s;
        }
        
        .hero-description {
            animation-delay: 0.4s;
        }
        
        .hero-buttons {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease forwards;
            animation-delay: 0.6s;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Utility Functions
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    input.value = value;
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

// Auto-resize textareas
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
});

// Form progress indicator
function updateFormProgress() {
    const form = document.getElementById('admissionForm');
    const requiredFields = form.querySelectorAll('[required]');
    const filledFields = form.querySelectorAll('[required]:valid');
    const progress = (filledFields.length / requiredFields.length) * 100;
    
    // You can add a progress bar here if needed
    console.log(`Form progress: ${progress.toFixed(1)}%`);
}

// Add progress tracking to form fields
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admissionForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('input', updateFormProgress);
        field.addEventListener('change', updateFormProgress);
    });
});

// Keyboard navigation for form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admissionForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && index < inputs.length - 1) {
                e.preventDefault();
                inputs[index + 1].focus();
            }
        });
    });
});

// Print application form
function printForm() {
    window.print();
}

// Export form data as PDF (placeholder)
function exportAsPDF() {
    alert('PDF export functionality would be implemented here with a library like jsPDF.');
}

// Save form data to localStorage
function saveFormData() {
    const form = document.getElementById('admissionForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('admissionFormData', JSON.stringify(data));
    alert('Form data saved locally!');
}

// Load form data from localStorage
function loadFormData() {
    const savedData = localStorage.getItem('admissionFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        const form = document.getElementById('admissionForm');
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key] === 'on';
                } else {
                    field.value = data[key];
                }
            }
        });
        
        alert('Form data loaded from local storage!');
    }
}

// Add utility buttons to form (optional)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('admissionForm');
    const formButtons = form.querySelector('.form-buttons');
    
    // Add utility buttons
    const utilityDiv = document.createElement('div');
    utilityDiv.style.marginTop = '1rem';
    utilityDiv.style.textAlign = 'center';
    utilityDiv.innerHTML = `
        <button type="button" onclick="saveFormData()" class="btn btn-secondary" style="margin: 0.25rem;">Save Draft</button>
        <button type="button" onclick="loadFormData()" class="btn btn-secondary" style="margin: 0.25rem;">Load Draft</button>
        <button type="button" onclick="printForm()" class="btn btn-secondary" style="margin: 0.25rem;">Print Form</button>
    `;
    
    formButtons.appendChild(utilityDiv);
}); 