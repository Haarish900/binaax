// DYNAMIC HEADER PADDING FIX - FIXES OVERLAP ISSUE
function adjustBodyPadding() {
    const header = document.getElementById('header');
    if (header) {
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }
}

// Run on load and resize
window.addEventListener('load', adjustBodyPadding);
window.addEventListener('resize', adjustBodyPadding);

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    
    // Adjust padding on page load
    adjustBodyPadding();
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Toggle mobile menu logo
        const mobileMenuLogo = document.querySelector('.mobile-menu-logo');
        if (navMenu.classList.contains('active')) {
            mobileMenuLogo.style.left = '0';
        } else {
            mobileMenuLogo.style.left = '-100%';
        }
        
        // Adjust body padding when menu opens/closes
        setTimeout(adjustBodyPadding, 400);
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.querySelector('.mobile-menu-logo').style.left = '-100%';
            // Adjust padding after closing menu
            setTimeout(adjustBodyPadding, 100);
        });
    });
    
    // Add animation delay to menu items
    document.querySelectorAll('.nav-menu li').forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Image Slider Functionality for 6 images
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    const totalSlides = slides.length;
    const slideIntervalTime = 5000; // 5 seconds
    
    // Function to go to a specific slide
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + totalSlides) % totalSlides;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Next slide function
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    // Previous slide function
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // Auto slide every 5 seconds
    function startAutoSlide() {
        // Clear any existing interval first
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }
    
    // Stop auto sliding
    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    // Function to reset auto slide timer
    function resetAutoSlideTimer() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoSlideTimer(); // Reset the 5-second timer after clicking a dot
        });
    });
    
    // Pause auto slide on hover
    const heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
    
    // Start auto sliding on page load
    startAutoSlide();
    
    // Scroll Animation Functionality
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll animations
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('[data-scroll]');
        
        elements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('scroll-visible');
            }
        });
    }
    
    // Initial check on page load
    setTimeout(handleScrollAnimations, 300);
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Check on resize
    window.addEventListener('resize', handleScrollAnimations);
    
    // Pause auto slide when window loses focus
    window.addEventListener('blur', stopAutoSlide);
    window.addEventListener('focus', startAutoSlide);
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    heroSection.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    heroSection.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
            resetAutoSlideTimer(); // Reset timer after swipe
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            prevSlide();
            resetAutoSlideTimer(); // Reset timer after swipe
        }
    }
    
    // Active navigation link on scroll
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Header scroll effect
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Set active nav link on scroll
    window.addEventListener('scroll', setActiveNavLink);
    
    // Initial call
    setActiveNavLink();
    
    // Clean up interval on page unload
    window.addEventListener('beforeunload', function() {
        stopAutoSlide();
    });
});














// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Trigger animations for newly active tab
            setTimeout(() => {
                const newTabElements = document.getElementById(`${targetTab}-tab`).querySelectorAll('[data-scroll]');
                newTabElements.forEach(el => {
                    if (isElementInViewport(el)) {
                        el.classList.add('scroll-visible');
                    }
                });
            }, 100);
        });
    });
    
    // Initialize scroll animation system
    initScrollAnimations();
});

// Scroll animation system - mimics AOS but pure CSS/JS implementation
function initScrollAnimations() {
    // Get all elements with data-scroll attribute
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const offset = 100; // Trigger animation 100px early
        
        return (
            rect.top <= windowHeight - offset &&
            rect.bottom >= 0
        );
    }
    
    // Track which elements have been animated
    const animatedElements = new Set();
    
    // Handle scroll event
    function handleScroll() {
        scrollElements.forEach(el => {
            if (isElementInViewport(el)) {
                // Only animate if not already animated
                if (!animatedElements.has(el)) {
                    el.classList.add('scroll-visible');
                    animatedElements.add(el);
                    
                    // Set data attribute to mark as animated
                    el.setAttribute('data-animated', 'true');
                }
            } else {
                // Only remove class if element doesn't have data-scroll-once="true" 
                // AND hasn't been marked as permanently animated
                if (el.getAttribute('data-scroll-once') !== 'true' && 
                    el.getAttribute('data-animated') !== 'true') {
                    el.classList.remove('scroll-visible');
                    animatedElements.delete(el);
                }
            }
        });
    }
    
    // Initial check
    handleScroll();
    
    // Listen to scroll event
    window.addEventListener('scroll', handleScroll);
    
    // Debounce for performance optimization
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        scrollTimer = setTimeout(function() {
            handleScroll();
        }, 10);
    });
    
    // Listen to window resize
    window.addEventListener('resize', handleScroll);
    
    // Listen to tab switching - recheck animations for active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Recheck animations after short delay
            setTimeout(() => {
                const activeTabId = document.querySelector('.tab-btn.active').getAttribute('data-tab');
                const activeTab = document.getElementById(`${activeTabId}-tab`);
                const activeTabElements = activeTab.querySelectorAll('[data-scroll]');
                
                activeTabElements.forEach(el => {
                    if (isElementInViewport(el)) {
                        if (!animatedElements.has(el)) {
                            el.classList.add('scroll-visible');
                            animatedElements.add(el);
                            el.setAttribute('data-animated', 'true');
                        }
                    }
                });
            }, 300);
        });
    });
}














// Number Counting Animation
document.addEventListener('DOMContentLoaded', function() {
    function animateNumberCounters() {
        // Select all stat numbers with data-count attribute
        const numberElements = document.querySelectorAll('.stat-number[data-count]');
        
        // Check if elements are in viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // Animate a single number
        function animateNumber(element) {
            const target = element.getAttribute('data-count');
            const current = element.textContent;
            
            // Remove the plus sign if present to get the number
            const targetNumber = parseInt(target);
            const currentNumber = current === '0' ? 0 : parseInt(current) || 0;
            
            // Calculate animation duration (faster for smaller numbers)
            const duration = 2000; // 2 seconds
            
            // Start the animation
            let startTime = null;
            
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuad = 1 - Math.pow(1 - progress, 3);
                
                // Calculate current value
                const currentValue = Math.floor(easeOutQuad * targetNumber);
                
                // Update the element text
                element.textContent = target.includes('+') ? currentValue + '+' : currentValue;
                
                // Continue animation if not complete
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }
            
            // Start the animation
            requestAnimationFrame(step);
            
            // Mark as animated
            element.classList.add('animated');
        }
        
        // Check and animate elements in viewport
        function checkAndAnimate() {
            numberElements.forEach(element => {
                if (!element.classList.contains('animated') && isElementInViewport(element)) {
                    animateNumber(element);
                }
            });
        }
        
        // Initial check
        checkAndAnimate();
        
        // Check on scroll
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(checkAndAnimate, 100);
        });
        
        // Also check on resize
        window.addEventListener('resize', checkAndAnimate);
    }
    
    // Initialize the animation
    animateNumberCounters();
    
    // Add CSS for the animation
    const style = document.createElement('style');
    style.textContent = `
        .stat-number.animated {
            animation: pulseNumber 0.5s ease-out;
        }
        
        @keyframes pulseNumber {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        /* Override the previous CSS animation */
        .stat-number[data-count]::after {
            display: none;
        }
    `;
    document.head.appendChild(style);
});




// Simple auto-rotation for images with proper hover handling
document.addEventListener('DOMContentLoaded', function() {
    const rotationContainer = document.querySelector('.cooling-image-rotation');
    if (!rotationContainer) return;
    
    const images = rotationContainer.querySelectorAll('.rotation-image');
    let currentIndex = 0;
    const totalImages = images.length;
    
    // Function to rotate images
    function rotateImages() {
        // Remove active class from all images
        images.forEach(img => img.classList.remove('active'));
        
        // Add active class to current image
        images[currentIndex].classList.add('active');
        
        // Move to next image
        currentIndex = (currentIndex + 1) % totalImages;
    }
    
    // Initialize first image
    rotateImages();
    
    // Start auto-rotation (change every 4 seconds)
    setInterval(rotateImages, 4000);
});

















// Form submission handling with new message design
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const button = form.querySelector('.submit-btn');
    const messageContainer = document.getElementById('form-message');
    const originalBtnText = button.querySelector('.btn-text').textContent;
    
    // Show loading state
    button.classList.add('loading');
    button.querySelector('.btn-text').textContent = 'Sending...';
    button.disabled = true;
    
    // Clear previous messages
    messageContainer.classList.remove('show');
    messageContainer.innerHTML = '';
    
    try {
        // Submit to Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success message
            showMessage(
                'Success!',
                'Message sent successfully! Our team will contact you within 24 hours.',
                'success',
                messageContainer
            );
            form.reset();
        } else {
            // Error message
            showMessage(
                'Error!',
                '❌ Something went wrong. Please try again or contact us directly.',
                'error',
                messageContainer
            );
        }
    } catch (error) {
        // Network error
        showMessage(
            'Connection Error',
            '📡 Network error. Please check your internet connection and try again.',
            'error',
            messageContainer
        );
    } finally {
        // Reset button
        button.classList.remove('loading');
        button.querySelector('.btn-text').textContent = originalBtnText;
        button.disabled = false;
    }
});

function showMessage(title, text, type, container) {
    // Create message box
    const messageBox = document.createElement('div');
    messageBox.className = `message-box message-${type}`;
    
    // Set icon based on type
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    const iconColor = type === 'success' ? '#28a745' : '#dc3545';
    
    // Message HTML
    messageBox.innerHTML = `
        <div class="message-icon">
            <i class="${icon}"></i>
        </div>
        <div class="message-content">
            <h4 class="message-title">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
                ${title}
            </h4>
            <p class="message-text">${text}</p>
        </div>
        <button class="message-close" onclick="this.closest('.message-box').style.display='none'">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Clear and show container
    container.innerHTML = '';
    container.appendChild(messageBox);
    container.classList.add('show');
    
    // Auto-hide after 8 seconds for success, 10 for error
    const hideTime = type === 'success' ? 8000 : 10000;
    setTimeout(() => {
        container.classList.remove('show');
    }, hideTime);
}

// Close message when clicking outside (optional)
document.addEventListener('click', function(e) {
    if (e.target.closest('.message-close')) {
        const messageBox = e.target.closest('.message-box');
        if (messageBox) {
            messageBox.style.opacity = '0';
            messageBox.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                const container = messageBox.closest('.message-container');
                container.classList.remove('show');
                container.innerHTML = '';
            }, 300);
        }
    }
});