// ========== PROJECT PAGE SCRIPT ==========
// Comparte la lógica del index: cursor, navbar, animaciones, parallax

// ========== LOADER ==========
window.addEventListener('load', () => {
    // Trigger Ken Burns on hero image
    const heroImg = document.querySelector('.project-hero-img');
    if (heroImg) {
        document.querySelector('.project-hero').classList.add('loaded');
    }

    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
        animateHeroWords();
        // Trigger back-link and meta animations
        document.querySelectorAll('.project-hero-content .anim-reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), 300 + i * 150);
        });
    }, 1800);
});

// ========== HERO WORDS ANIMATION ==========
function animateHeroWords() {
    const words = document.querySelectorAll('.anim-reveal-word');
    words.forEach((word, i) => {
        setTimeout(() => word.classList.add('visible'), 400 + i * 130);
    });
}

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

if (cursor && follower) {
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

    document.querySelectorAll('a, button, .project-card, .gallery-item, input, select, textarea').forEach(el => {
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
}

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    });
}

// ========== MOBILE MENU ==========
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
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
}

// ========== SCROLL ANIMATIONS ==========
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = parent.querySelectorAll('.anim-slide-up, .anim-scale-in, .anim-reveal');
            let delay = 0;
            siblings.forEach(sib => {
                if (sib === entry.target || !sib.classList.contains('visible')) {
                    setTimeout(() => sib.classList.add('visible'), delay);
                    delay += 130;
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

// ========== PARALLAX EFFECT ==========
const parallaxImg = document.querySelector('.parallax-img');
if (parallaxImg) {
    window.addEventListener('scroll', () => {
        const section = document.querySelector('.project-philosophy');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
            const progress = (windowH - rect.top) / (windowH + rect.height);
            const translate = (progress - 0.5) * 100;
            parallaxImg.style.transform = `translateY(${translate}px)`;
        }
    }, { passive: true });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only intercept pure in-page anchors (not cross-page links like index.html#section)
        if (href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});
