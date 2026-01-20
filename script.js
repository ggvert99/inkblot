/**
 * Inkblot Crew - Landing Page JavaScript
 * Handles form interactions, FAQ accordion, mobile menu, login modal, and analytics
 */

// ==========================================================================
// DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initFAQ();
    initForm();
    initScrollReveal();
    initAnalytics();
    captureUTMParams();
    initHeroParallax();
    initLoginModal();
    initHeroCarousel();
});

// ==========================================================================
// Header Scroll Effect
// ==========================================================================
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================================================
// Mobile Menu
// ==========================================================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ==========================================================================
// Login Modal
// ==========================================================================
function initLoginModal() {
    const loginBtn = document.getElementById('loginBtn');
    const cartBtn = document.getElementById('cartBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeLoginModal');
    const emailForm = document.getElementById('loginEmailForm');
    const codeForm = document.getElementById('loginCodeForm');
    const resendBtn = document.getElementById('resendCode');
    const codeInputs = document.querySelectorAll('.code-input');
    
    const stepEmail = document.getElementById('loginStepEmail');
    const stepCode = document.getElementById('loginStepCode');
    const stepSuccess = document.getElementById('loginStepSuccess');
    const emailDisplay = document.getElementById('loginEmailDisplay');
    
    // Check if modal exists
    if (!loginModal) {
        console.warn('Login modal not found');
        return;
    }
    
    let userEmail = '';
    
    function openLoginModal() {
        loginModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        // Reset to email step
        showStep('email');
        // Focus email input
        setTimeout(() => {
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) emailInput.focus();
        }, 100);
    }
    
    // Open modal from login button
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            trackEvent('login_click');
            openLoginModal();
        });
    }
    
    // Open modal from cart button
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            trackEvent('cart_click');
            openLoginModal();
        });
    }
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal();
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    function closeModal() {
        loginModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    function showStep(step) {
        stepEmail.classList.add('hidden');
        stepCode.classList.add('hidden');
        stepSuccess.classList.add('hidden');
        
        if (step === 'email') {
            stepEmail.classList.remove('hidden');
        } else if (step === 'code') {
            stepCode.classList.remove('hidden');
            // Focus first code input
            setTimeout(() => codeInputs[0].focus(), 100);
        } else if (step === 'success') {
            stepSuccess.classList.remove('hidden');
            // Auto close after success
            setTimeout(closeModal, 2000);
        }
    }
    
    // Email form submission
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const submitBtn = emailForm.querySelector('button[type="submit"]');
        
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            userEmail = email;
            emailDisplay.textContent = email;
            showStep('code');
            
            trackEvent('login_email_sent');
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Code input handling
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Move to next input
            if (value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            // Check if all filled
            const code = Array.from(codeInputs).map(i => i.value).join('');
            if (code.length === 6) {
                codeForm.dispatchEvent(new Event('submit'));
            }
        });
        
        input.addEventListener('keydown', (e) => {
            // Handle backspace
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            
            if (/^\d+$/.test(pastedData)) {
                pastedData.split('').forEach((char, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = char;
                    }
                });
                
                const nextIndex = Math.min(pastedData.length, codeInputs.length - 1);
                codeInputs[nextIndex].focus();
                
                if (pastedData.length === 6) {
                    codeForm.dispatchEvent(new Event('submit'));
                }
            }
        });
    });
    
    // Code form submission
    codeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = Array.from(codeInputs).map(i => i.value).join('');
        
        if (code.length !== 6) return;
        
        const submitBtn = codeForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API verification
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showStep('success');
            trackEvent('login_success');
        } catch (error) {
            console.error('Verification error:', error);
            // Clear inputs on error
            codeInputs.forEach(input => input.value = '');
            codeInputs[0].focus();
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Resend code
    resendBtn.addEventListener('click', async () => {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            resendBtn.textContent = 'Code sent!';
            
            setTimeout(() => {
                resendBtn.textContent = 'Resend code';
                resendBtn.disabled = false;
            }, 3000);
            
            trackEvent('login_code_resent');
        } catch (error) {
            resendBtn.textContent = 'Resend code';
            resendBtn.disabled = false;
        }
    });
}

// ==========================================================================
// FAQ Accordion
// ==========================================================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Open clicked item (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ==========================================================================
// Form Handling
// ==========================================================================
function initForm() {
    const form = document.getElementById('signupForm');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const publisherFields = document.getElementById('publisherFields');
    const formSuccess = document.getElementById('formSuccess');
    const formModeInput = document.getElementById('formMode');
    
    let currentMode = 'reader';
    
    // Mode switching
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            
            if (mode === currentMode) return;
            
            currentMode = mode;
            formModeInput.value = mode;
            
            // Update button states
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle field visibility
            if (mode === 'reader') {
                publisherFields.classList.add('hidden');
            } else {
                publisherFields.classList.remove('hidden');
            }
            
            // Track mode selection
            trackEvent('form_mode_selected', { mode });
        });
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(currentMode)) {
            return;
        }
        
        // Check honeypot
        const honeypot = form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) {
            // Bot detected, silently fail
            showSuccess();
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = collectFormData(currentMode);
        
        // Track form start
        trackEvent('form_start');
        
        try {
            // Simulate API call (replace with actual endpoint)
            await submitFormData(formData);
            
            // Success
            trackEvent('form_submit_success', { mode: currentMode });
            showSuccess();
            
        } catch (error) {
            console.error('Form submission error:', error);
            trackEvent('form_submit_error', { error: error.message });
            
            // Show error message
            alert('Oops! Something went wrong. Please try again in a moment.');
            
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        validateField(emailInput);
    });
    
    emailInput.addEventListener('input', () => {
        const group = emailInput.closest('.form-group');
        if (group) {
            group.classList.remove('error');
        }
    });
    
    // Initialize share buttons
    initShareButtons();
}

function validateForm(mode) {
    let isValid = true;
    
    // Email is required
    const email = document.getElementById('email');
    if (!validateField(email)) isValid = false;
    
    // Publisher-specific fields
    if (mode === 'publisher') {
        const company = document.getElementById('company');
        if (company && company.value.trim() === '') {
            const group = company.closest('.form-group');
            if (group) group.classList.add('error');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;
    
    let isValid = true;
    
    if (field.required) {
        if (field.type === 'email') {
            isValid = field.value && isValidEmail(field.value);
        } else {
            isValid = field.value.trim() !== '';
        }
    }
    
    if (isValid) {
        group.classList.remove('error');
    } else {
        group.classList.add('error');
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function collectFormData(mode) {
    const form = document.getElementById('signupForm');
    const formData = new FormData(form);
    
    const data = {
        mode,
        email: formData.get('email'),
        utm_source: formData.get('utm_source'),
        utm_medium: formData.get('utm_medium'),
        utm_campaign: formData.get('utm_campaign'),
        referrer: formData.get('referrer'),
        submitted_at: new Date().toISOString()
    };
    
    if (mode === 'publisher') {
        data.company = formData.get('company');
        data.message = formData.get('message');
    }
    
    return data;
}

async function submitFormData(data) {
    // Replace this with your actual API endpoint
    // For now, we'll simulate a successful submission
    
    return new Promise((resolve, reject) => {
        console.log('Form data to submit:', data);
        
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
}

function showSuccess() {
    const form = document.getElementById('signupForm');
    const formSuccess = document.getElementById('formSuccess');
    
    form.classList.add('hidden');
    formSuccess.classList.remove('hidden');
    
    // Scroll to success message
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function initShareButtons() {
    const shareTwitter = document.getElementById('shareTwitter');
    const shareCopy = document.getElementById('shareCopy');
    
    const shareText = "I just joined the Inkblot Crew! Curated indie romance boxes coming soon. Join me:";
    const shareUrl = window.location.origin;
    
    if (shareTwitter) {
        shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        shareTwitter.target = '_blank';
    }
    
    if (shareCopy) {
        shareCopy.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                await navigator.clipboard.writeText(shareUrl);
                shareCopy.textContent = 'Copied!';
                setTimeout(() => {
                    shareCopy.textContent = 'Copy link';
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                prompt('Copy this link:', shareUrl);
            }
        });
    }
}

// Helper function to select publisher mode (called from partner buttons)
window.selectPublisherMode = function() {
    const publisherBtn = document.querySelector('.mode-btn[data-mode="publisher"]');
    if (publisherBtn) {
        publisherBtn.click();
    }
};

// ==========================================================================
// Scroll Reveal Animations
// ==========================================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-header, .feature-card, .step-card, .box-card, .audience-card, .partnership-card, .pricing-card, .faq-item');
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
}

// ==========================================================================
// Analytics
// ==========================================================================
function initAnalytics() {
    // Track page view
    trackEvent('view_landing');
    
    // Track CTA clicks
    document.querySelectorAll('[href="#join"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const isHero = btn.closest('.hero');
            trackEvent('cta_click_waitlist', {
                location: isHero ? 'hero' : 'page'
            });
        });
    });
    
    // Track partner CTA clicks
    document.querySelectorAll('[onclick*="selectPublisherMode"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('cta_click_partner');
        });
    });
    
    // Track outbound clicks
    document.querySelectorAll('a[data-event]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent(link.dataset.event);
        });
    });
    
}

function trackEvent(eventName, params = {}) {
    // Log to console in development
    console.log('Analytics Event:', eventName, params);
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    }
    
    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
        plausible(eventName, { props: params });
    }
}

// ==========================================================================
// UTM Parameter Capture
// ==========================================================================
function captureUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const utmSource = document.getElementById('utmSource');
    const utmMedium = document.getElementById('utmMedium');
    const utmCampaign = document.getElementById('utmCampaign');
    const referrerField = document.getElementById('referrer');
    
    if (utmSource) utmSource.value = urlParams.get('utm_source') || '';
    if (utmMedium) utmMedium.value = urlParams.get('utm_medium') || '';
    if (utmCampaign) utmCampaign.value = urlParams.get('utm_campaign') || '';
    if (referrerField) referrerField.value = document.referrer || '';
}

// ==========================================================================
// Hero Parallax Effect
// ==========================================================================
function initHeroParallax() {
    const heroVisual = document.getElementById('heroVisual');
    if (!heroVisual) return;
    
    const cards = heroVisual.querySelectorAll('.hero-card');
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    
    // Smooth interpolation
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Handle mouse movement
    heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
        mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
        isHovering = true;
    });
    
    heroVisual.addEventListener('mouseleave', () => {
        isHovering = false;
    });
    
    // Animation loop for smooth parallax
    function animate() {
        // Smooth transition
        const factor = isHovering ? 0.08 : 0.05;
        currentX = lerp(currentX, isHovering ? mouseX : 0, factor);
        currentY = lerp(currentY, isHovering ? mouseY : 0, factor);
        
        // Apply parallax to cards
        cards.forEach(card => {
            const depth = parseFloat(card.dataset.depth) || 0.3;
            const moveX = currentX * 40 * depth;
            const moveY = currentY * 30 * depth;
            const rotateX = currentY * 10 * depth;
            const rotateY = -currentX * 10 * depth;
            
            card.style.transform = `
                translate(${moveX}px, ${moveY}px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
            `;
        });
        
        requestAnimationFrame(animate);
    }
    
    // Start animation loop
    animate();
    
    // Add magnetic effect to cards on hover
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '';
        });
    });
}

// ==========================================================================
// Hero Carousel
// ==========================================================================
function initHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    const track = document.getElementById('heroCarouselTrack');
    const slides = track.querySelectorAll('.hero-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dots = document.querySelectorAll('.hero-carousel-dot');
    const currentSlideEl = document.getElementById('currentSlide');
    const totalSlidesEl = document.getElementById('totalSlides');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isTransitioning = false;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Update total slides display
    if (totalSlidesEl) {
        totalSlidesEl.textContent = String(totalSlides).padStart(2, '0');
    }
    
    function goToSlide(index, animate = true) {
        if (isTransitioning) return;
        
        // Wrap around
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        isTransitioning = true;
        currentSlide = index;
        
        // Move track
        track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
        
        // Update counter
        if (currentSlideEl) {
            currentSlideEl.textContent = String(currentSlide + 1).padStart(2, '0');
        }
        
        // Reset transition lock
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
        
        // Track analytics
        trackEvent('carousel_slide_view', { slide: currentSlide + 1 });
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Button events
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }
    
    // Dot events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isCarouselInView()) return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });
    
    // Touch/Swipe support
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        resetAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Check if carousel is in view
    function isCarouselInView() {
        const rect = carousel.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (isCarouselInView()) {
                nextSlide();
            }
        }, 6000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Initialize
    goToSlide(0, false);
    startAutoplay();
    
    // Pause videos on inactive slides for performance
    function updateVideoPlayback() {
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video) {
                if (index === currentSlide) {
                    video.play().catch(() => {});
                } else {
                    // Keep playing but mute for smoother transitions
                }
            }
        });
    }
    
    // Update video playback when slide changes
    track.addEventListener('transitionend', updateVideoPlayback);
}

// ==========================================================================
// Smooth Scroll for Anchor Links
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
