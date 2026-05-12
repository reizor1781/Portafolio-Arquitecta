// ========== PRELOAD HERO IMAGES ==========
async function preloadHeroImages() {
    const images = document.querySelectorAll('.hero-slide img');
    const promises = Array.from(images).map(img => {
        return new Promise(resolve => {
            if (img.complete) { resolve(); return; }
            img.onload = resolve;
            img.onerror = resolve;
        });
    });
    await Promise.all(promises);
}

// ========== LOADER ==========
window.addEventListener('load', async () => {
    await preloadHeroImages();
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.querySelector('.hero').classList.add('visible');
        animateHeroWords();
        initHeroSlideshow();
    }, 2200);
});

// ========== CINEMATIC HERO SLIDESHOW ==========
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const progressFill = document.getElementById('hero-progress-fill');
    const slideCounter = document.getElementById('hero-slide-current');
    const SLIDE_DURATION = 6000;
    const FADE_DURATION = 1500;
    let currentSlide = 0;
    let slideStartTime = performance.now();
    let rafId;

    // Ken Burns transform definitions per direction
    const kenBurns = {
        'zoom-in':   { from: 'scale(1.02)',                       to: 'scale(1.25)' },
        'zoom-out':  { from: 'scale(1.25)',                       to: 'scale(1.02)' },
        'pan-left':  { from: 'scale(1.15) translateX(5%)',        to: 'scale(1.15) translateX(-5%)' },
        'pan-right': { from: 'scale(1.15) translateX(-5%)',       to: 'scale(1.15) translateX(5%)' },
    };

    // Set a slide's img to its starting transform (no transition)
    function resetSlideTransform(slide) {
        const img = slide.querySelector('img');
        const dir = slide.dataset.direction;
        const kb = kenBurns[dir];
        if (!img || !kb) return;
        img.style.transition = 'none';
        img.style.transform = kb.from;
    }

    // Activate a slide's Ken Burns: set 'from' instantly, then transition to 'to'
    function activateKenBurns(slide) {
        const img = slide.querySelector('img');
        const dir = slide.dataset.direction;
        const kb = kenBurns[dir];
        if (!img || !kb) return;

        // 1. Instantly set starting position (no transition)
        img.style.transition = 'none';
        img.style.transform = kb.from;

        // 2. Force reflow so the browser registers the 'from' position
        img.offsetHeight;

        // 3. Enable transition and set target — smooth Ken Burns begins
        img.style.transition = 'transform 6s ease-in-out';
        img.style.transform = kb.to;
    }

    // Initialize: set all slides to their starting transform
    slides.forEach(s => resetSlideTransform(s));

    // Start Ken Burns on the first active slide
    activateKenBurns(slides[currentSlide]);

    function advanceSlide() {
        const oldSlide = slides[currentSlide];

        // Fade out old slide
        oldSlide.classList.remove('active');

        // After fade-out completes, reset old slide's transform
        setTimeout(() => resetSlideTransform(oldSlide), FADE_DURATION);

        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        const newSlide = slides[currentSlide];

        // Activate new slide
        newSlide.classList.add('active');
        activateKenBurns(newSlide);

        // Update counter
        if (slideCounter) {
            slideCounter.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        slideStartTime = performance.now();
    }

    function updateProgress(now) {
        const elapsed = now - slideStartTime;
        const progress = Math.min(elapsed / SLIDE_DURATION, 1);

        if (progressFill) {
            progressFill.style.height = (progress * 100) + '%';
        }

        if (progress >= 1) {
            advanceSlide();
        }

        rafId = requestAnimationFrame(updateProgress);
    }

    rafId = requestAnimationFrame(updateProgress);

    // Pause on hover
    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => cancelAnimationFrame(rafId));
    hero.addEventListener('mouseleave', () => {
        slideStartTime = performance.now() - (parseFloat(progressFill.style.height) / 100 * SLIDE_DURATION);
        rafId = requestAnimationFrame(updateProgress);
    });
}

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .project-card, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '16px';
        cursor.style.height = '16px';
        cursor.style.background = 'transparent';
        cursor.style.border = '2px solid var(--accent)';
        follower.style.width = '50px';
        follower.style.height = '50px';
        follower.style.borderColor = 'transparent';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.background = 'var(--accent)';
        cursor.style.border = 'none';
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.borderColor = 'var(--accent)';
    });
});

// ========== HERO WORDS ANIMATION ==========
function animateHeroWords() {
    const words = document.querySelectorAll('.anim-reveal-word');
    words.forEach((word, i) => {
        setTimeout(() => word.classList.add('visible'), 300 + i * 120);
    });
    // Also animate subtitle and CTA
    setTimeout(() => {
        document.querySelectorAll('.hero-content .anim-reveal').forEach(el => el.classList.add('visible'));
    }, 300 + words.length * 120 + 200);
}

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
});

// ========== MOBILE MENU ==========
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ========== SCROLL ANIMATIONS (Intersection Observer) ==========
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Stagger animations for sibling elements
            const parent = entry.target.parentElement;
            const siblings = parent.querySelectorAll('.anim-slide-up, .anim-scale-in, .anim-reveal');
            let delay = 0;
            siblings.forEach(sib => {
                if (sib === entry.target || !sib.classList.contains('visible')) {
                    setTimeout(() => sib.classList.add('visible'), delay);
                    delay += 150;
                }
            });
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.anim-slide-up, .anim-scale-in, .anim-reveal').forEach(el => {
    observer.observe(el);
});

// ========== COUNTER ANIMATION ==========
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const start = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(target * eased) + '+';
                    if (progress < 1) requestAnimationFrame(updateCounter);
                }
                requestAnimationFrame(updateCounter);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

// ========== PARALLAX EFFECT ==========
const parallaxImg = document.querySelector('.parallax-img');
if (parallaxImg) {
    window.addEventListener('scroll', () => {
        const section = document.querySelector('.philosophy');
        const rect = section.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
            const progress = (windowH - rect.top) / (windowH + rect.height);
            const translate = (progress - 0.5) * 100;
            parallaxImg.style.transform = `translateY(${translate}px)`;
        }
    }, { passive: true });
}

// ========== SMOOTH SCROLL for nav links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.innerHTML = '<span>¡Mensaje Enviado!</span> ✓';
        btn.style.background = '#4caf50';
        setTimeout(() => {
            btn.innerHTML = '<span>Enviar Mensaje</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}
