/* ============================================
   AMALFI - INTERACTIVE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================

    const header = document.querySelector('.header');

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ============================================
    // MOBILE MENU
    // ============================================

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';

        const spans = mobileMenuBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';

            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================

    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dots = document.querySelectorAll('.dot');

    let currentSlide = 0;
    let slidesPerView = 3;
    const totalSlides = testimonialCards.length;

    function updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }

    function updateSlider() {
        if (!testimonialCards.length) return;

        const cardWidth = testimonialCards[0].offsetWidth;
        const gap = 24;
        const offset = currentSlide * (cardWidth + gap);
        testimonialTrack.style.transform = `translateX(-${offset}px)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        const maxSlide = Math.max(0, totalSlides - slidesPerView);
        currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
        updateSlider();
    }

    function prevSlide() {
        const maxSlide = Math.max(0, totalSlides - slidesPerView);
        currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
        updateSlider();
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    let sliderInterval = setInterval(nextSlide, 5000);

    if (testimonialTrack) {
        testimonialTrack.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });

        testimonialTrack.addEventListener('mouseleave', () => {
            sliderInterval = setInterval(nextSlide, 5000);
        });
    }

    window.addEventListener('resize', () => {
        updateSlidesPerView();
        updateSlider();
    });

    updateSlidesPerView();

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    const animatedElements = document.querySelectorAll('.section-header, .benefit-card, .experience-card, .type-card, .gallery-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // FORM HANDLING
    // ============================================

    const applicationForm = document.getElementById('applicationForm');

    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                this.reset();
                submitBtn.textContent = 'Application Submitted!';
                submitBtn.style.background = '#4ade80';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ============================================
    // VIDEO BACKGROUND FALLBACK
    // ============================================

    const heroVideo = document.querySelector('.hero-video video');

    if (heroVideo) {
        heroVideo.addEventListener('error', function() {
            // Fallback to static image if video fails
            const heroSection = document.querySelector('.hero');
            heroSection.style.background = `
                linear-gradient(to bottom, rgba(10, 10, 10, 0.7) 0%, rgba(10, 10, 10, 0.5) 50%, rgba(10, 10, 10, 0.8) 100%),
                url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=2000&q=80')
            `;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        });
    }

    // ============================================
    // EXPERIENCE CARDS HOVER EFFECT
    // ============================================

    const experienceCards = document.querySelectorAll('.experience-card');

    experienceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ============================================
    // GALLERY LIGHTBOX EFFECT (Optional)
    // ============================================

    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Could implement lightbox here
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

});

// Page load animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
