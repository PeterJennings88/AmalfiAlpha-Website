/* ============================================
   AMALFI - INTERACTIVE JAVASCRIPT
   ============================================ */

// Flag the document as JavaScript-enabled so the stylesheet can opt in to
// scroll reveal animations. Without JS the content stays fully visible.
document.documentElement.classList.add('js-enabled');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================

    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.pageYOffset > 50);
        });
    }

    // ============================================
    // MOBILE MENU
    // ============================================

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        if (!mobileMenu.id) {
            mobileMenu.id = 'mobileMenu';
        }
        mobileMenu.setAttribute('role', 'dialog');
        mobileMenu.setAttribute('aria-modal', 'true');
        mobileMenu.setAttribute('aria-label', 'Site menu');
        mobileMenuBtn.setAttribute('aria-controls', mobileMenu.id);
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        const mobileMenuLinks = mobileMenu.querySelectorAll('a');

        function setBurgerState(isOpen) {
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (spans.length < 3) return;
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
            spans[1].style.opacity = isOpen ? '0' : '';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
        }

        function openMenu() {
            mobileMenu.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            setBurgerState(true);
            const first = mobileMenu.querySelector('a');
            if (first) first.focus();
        }

        function closeMenu(returnFocus) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            setBurgerState(false);
            if (returnFocus) mobileMenuBtn.focus();
        }

        mobileMenuBtn.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                closeMenu(true);
            } else {
                openMenu();
            }
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu(false);
            });
        });

        document.addEventListener('keydown', function(e) {
            if (!mobileMenu.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeMenu(true);
                return;
            }

            // Keep focus inside the open menu: the page behind the overlay is
            // still in the tab order.
            if (e.key === 'Tab' && mobileMenuLinks.length) {
                const focusable = [mobileMenuBtn, ...mobileMenuLinks];
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                } else if (!focusable.includes(document.activeElement)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================

    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : [];

    if (testimonialTrack && testimonialCards.length) {
        const GAP = 24;

        let currentSlide = 0;
        let slidesPerView = 1;
        const totalSlides = testimonialCards.length;

        // Measured rather than assumed from a breakpoint, so the dots always
        // match how many cards actually fit at the current width.
        function getSlidesPerView() {
            const cardWidth = testimonialCards[0].getBoundingClientRect().width;
            const viewportWidth = testimonialTrack.parentElement.clientWidth;
            if (!cardWidth || !viewportWidth) return 1;
            // +1px tolerance so sub-pixel card widths still count as fitting.
            const fits = Math.floor((viewportWidth + GAP + 1) / (cardWidth + GAP));
            return Math.min(totalSlides, Math.max(1, fits));
        }

        function getMaxSlide() {
            return Math.max(0, totalSlides - slidesPerView);
        }

        function updateSlidesPerView() {
            slidesPerView = getSlidesPerView();
        }

        // Only the positions that show real content are reachable, so the dots
        // must match that count at the current breakpoint.
        function updateDots() {
            dots.forEach((dot, index) => {
                const reachable = index <= getMaxSlide();
                dot.hidden = !reachable;
                dot.classList.toggle('active', reachable && index === currentSlide);
                if (reachable && index === currentSlide) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        }

        function updateSlider() {
            currentSlide = Math.min(Math.max(currentSlide, 0), getMaxSlide());

            const cardWidth = testimonialCards[0].offsetWidth;
            const offset = currentSlide * (cardWidth + GAP);
            testimonialTrack.style.transform = `translateX(-${offset}px)`;

            updateDots();
        }

        function goToSlide(index) {
            currentSlide = Math.min(Math.max(index, 0), getMaxSlide());
            updateSlider();
        }

        function nextSlide() {
            const maxSlide = getMaxSlide();
            goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide <= 0 ? getMaxSlide() : currentSlide - 1);
        }

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        let sliderInterval = setInterval(nextSlide, 5000);

        testimonialTrack.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });

        testimonialTrack.addEventListener('mouseleave', () => {
            clearInterval(sliderInterval);
            sliderInterval = setInterval(nextSlide, 5000);
        });

        window.addEventListener('resize', () => {
            updateSlidesPerView();
            updateSlider();
        });

        updateSlidesPerView();
        updateSlider();
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    const animatedElements = document.querySelectorAll('.section-header, .experience-card, .type-card, .gallery-item');

    animatedElements.forEach((el) => el.classList.add('reveal'));

    if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                // Also reveal anything already scrolled past, so fast scrolling
                // can never leave content permanently hidden.
                if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        animatedElements.forEach((el) => observer.observe(el));
    } else {
        animatedElements.forEach((el) => el.classList.add('is-visible'));
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
        });
    });

    // ============================================
    // EXPERIENCE CARDS HOVER EFFECT
    // ============================================

    const experienceCards = document.querySelectorAll('.experience-card');

    experienceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            if (prefersReducedMotion.matches) return;

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

});

// Page load animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
