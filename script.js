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

    const kenBurns = {
        'zoom-in':   { from: 'scale(1.02)',                 to: 'scale(1.25)' },
        'zoom-out':  { from: 'scale(1.25)',                 to: 'scale(1.02)' },
        'pan-left':  { from: 'scale(1.15) translateX(5%)', to: 'scale(1.15) translateX(-5%)' },
        'pan-right': { from: 'scale(1.15) translateX(-5%)',to: 'scale(1.15) translateX(5%)' },
    };

    function resetSlideTransform(slide) {
        const img = slide.querySelector('img');
        const kb  = kenBurns[slide.dataset.direction];
        if (!img || !kb) return;
        img.style.transition = 'none';
        img.style.transform  = kb.from;
    }

    function activateKenBurns(slide) {
        const img = slide.querySelector('img');
        const kb  = kenBurns[slide.dataset.direction];
        if (!img || !kb) return;
        img.style.transition = 'none';
        img.style.transform  = kb.from;
        img.offsetHeight;
        img.style.transition = 'transform 6s ease-in-out';
        img.style.transform  = kb.to;
    }

    slides.forEach(s => resetSlideTransform(s));
    activateKenBurns(slides[currentSlide]);

    function advanceSlide() {
        const oldSlide = slides[currentSlide];
        oldSlide.classList.remove('active');
        setTimeout(() => resetSlideTransform(oldSlide), FADE_DURATION);
        currentSlide = (currentSlide + 1) % slides.length;
        const newSlide = slides[currentSlide];
        newSlide.classList.add('active');
        activateKenBurns(newSlide);
        if (slideCounter) slideCounter.textContent = String(currentSlide + 1).padStart(2, '0');
        slideStartTime = performance.now();
    }

    function updateProgress(now) {
        const elapsed  = now - slideStartTime;
        const progress = Math.min(elapsed / SLIDE_DURATION, 1);
        if (progressFill) progressFill.style.height = (progress * 100) + '%';
        if (progress >= 1) advanceSlide();
        rafId = requestAnimationFrame(updateProgress);
    }

    rafId = requestAnimationFrame(updateProgress);

    const hero = document.querySelector('.hero');
    hero.addEventListener('mouseenter', () => cancelAnimationFrame(rafId));
    hero.addEventListener('mouseleave', () => {
        slideStartTime = performance.now() - (parseFloat(progressFill.style.height) / 100 * SLIDE_DURATION);
        rafId = requestAnimationFrame(updateProgress);
    });
}

// ========== CUSTOM CURSOR ==========
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width  = '16px'; cursor.style.height = '16px';
        cursor.style.background = 'transparent';
        cursor.style.border = '2px solid var(--accent)';
        follower.style.width = '50px'; follower.style.height = '50px';
        follower.style.borderColor = 'transparent';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width  = '8px'; cursor.style.height = '8px';
        cursor.style.background = 'var(--accent)';
        cursor.style.border = 'none';
        follower.style.width = '36px'; follower.style.height = '36px';
        follower.style.borderColor = 'var(--accent)';
    });
});

// ========== HERO WORDS ANIMATION ==========
function animateHeroWords() {
    const words = document.querySelectorAll('.anim-reveal-word');
    words.forEach((word, i) => setTimeout(() => word.classList.add('visible'), 300 + i * 120));
    setTimeout(() => {
        document.querySelectorAll('.hero-content .anim-reveal').forEach(el => el.classList.add('visible'));
    }, 300 + words.length * 120 + 200);
}

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 80));

// ========== MOBILE MENU ==========
const menuBtn    = document.getElementById('menu-btn');
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

// ========== SCROLL ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const parent   = entry.target.parentElement;
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
}, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.15 });

document.querySelectorAll('.anim-slide-up, .anim-scale-in, .anim-reveal').forEach(el => observer.observe(el));

// ========== COUNTER ANIMATION ==========
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(counter => {
                const target   = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const start    = performance.now();
                function updateCounter(t) {
                    const eased = 1 - Math.pow(1 - Math.min((t - start) / duration, 1), 3);
                    counter.textContent = Math.floor(target * eased) + '+';
                    if (eased < 1) requestAnimationFrame(updateCounter);
                }
                requestAnimationFrame(updateCounter);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

// ========== PARALLAX ==========
const parallaxImg = document.querySelector('.parallax-img');
if (parallaxImg) {
    window.addEventListener('scroll', () => {
        const section = document.querySelector('.philosophy');
        const rect    = section.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH && rect.bottom > 0) {
            const progress  = (windowH - rect.top) / (windowH + rect.height);
            parallaxImg.style.transform = `translateY(${(progress - 0.5) * 100}px)`;
        }
    }, { passive: true });
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.innerHTML = '<span>Mensaje Enviado!</span> ✓';
        btn.style.background = '#4caf50';
        setTimeout(() => {
            btn.innerHTML = '<span>Enviar Mensaje</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// ========== PANNELLUM 360 TOUR ==========
(function initTour360() {
    const panoEl = document.getElementById('pano-viewer');
    if (!panoEl) return;

    // Scene definitions — equirectangular images
    const sceneDefs = [
        { 
            id: 0, name: 'Sala', src: 'img/360/sala.jpg',
            hotSpots: [
                { pitch: 0, yaw: 90, text: 'Ir a la Cocina', target: 1 },
                { pitch: 0, yaw: 180, text: 'Ir a la entrada', target: 3 }
            ]
        },
        { 
            id: 1, name: 'Cocina', src: 'img/360/cocina.jpg',
            hotSpots: [
                { pitch: 0, yaw: 180, text: 'Ir al corredor', target: 2 },
                { pitch: 0, yaw: 0, text: 'Ir a la sala', target: 2 }
            ]
        },
        { 
            id: 2, name: 'Corredor', src: 'img/360/Corredor.jpg',
            hotSpots: [
                { pitch: 0, yaw: -20, text: 'Ir a la Sala', target: 0 },
                { pitch: 0, yaw: 60, text: 'Ir al Baño', target: 4 }
            ]
        },
        { 
            id: 3, name: 'Entrada', src: 'img/360/Entrada.jpg',
            hotSpots: [
                { pitch: 0, yaw: 90, text: 'Ir al Sala', target: 0 }
            ]
        },
        { 
            id: 4, name: 'Bano', src: 'img/360/ba\u00f1o.jpg',
            hotSpots: [
                { pitch: 0, yaw: 50, text: 'Ir al Corredor', target: 2 }
            ]
        },
    ];

    let pViewer    = null;
    let currentIdx = 0;
    let initialized = false;

    // Scene label
    const labelEl = document.createElement('div');
    labelEl.className   = 'tour360-scene-label';
    labelEl.textContent = sceneDefs[0].name;
    document.querySelector('.tour360-viewer-wrap').appendChild(labelEl);

    const hintEl = document.getElementById('tour-hint');
    function hideHint() { if (hintEl) hintEl.classList.add('hidden'); }

    // Load a panorama scene
    function loadScene(def) {
        if (typeof pannellum === 'undefined') {
            console.warn('Pannellum no disponible — sin conexion a internet?');
            return;
        }
        if (pViewer) { try { pViewer.destroy(); } catch(e) {} pViewer = null; }

        // Configure hotspots for this scene
        const hsConfig = (def.hotSpots || []).map(hs => ({
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: 'info',
            text: hs.text,
            clickHandlerFunc: () => switchScene(hs.target)
        }));

        pViewer = pannellum.viewer('pano-viewer', {
            type:               'equirectangular',
            panorama:           def.src,
            autoLoad:           true,
            autoRotate:         0,
            hfov:               100,
            minHfov:            40,
            maxHfov:            140,
            showZoomCtrl:       false,
            showFullscreenCtrl: false,
            showControls:       false,
            compass:            false,
            mouseZoom:          true,
            draggable:          true,
            hotSpots:           hsConfig
        });

        labelEl.textContent = def.name;
        
        pViewer.on('mousedown', function(e) {
            hideHint();
            // Utility to help you find the correct coordinates for your hotspots!
            // Open the browser console (F12) and click anywhere on the image to get pitch/yaw.
            const coords = pViewer.mouseEventToCoords(e);
            console.log(`[Pannellum] Click coord -> pitch: ${coords[0].toFixed(2)}, yaw: ${coords[1].toFixed(2)}`);
        });
        pViewer.on('touchstart', hideHint);
    }

    // Lazy init
    function initPannellum() {
        if (initialized) return;
        initialized = true;
        loadScene(sceneDefs[0]);
    }

    const lazyObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { initPannellum(); lazyObs.disconnect(); } });
    }, { threshold: 0.05 });

    const tourSection = document.getElementById('tour360');
    if (tourSection) lazyObs.observe(tourSection);

    // Scene switching
    function switchScene(index) {
        if (index === currentIdx && pViewer) return;
        currentIdx = index;
        document.querySelectorAll('.scene-btn').forEach(btn =>
            btn.classList.toggle('active', parseInt(btn.dataset.scene) === index));
        const wrap = document.querySelector('.tour360-viewer-wrap');
        wrap.classList.add('transitioning');
        setTimeout(() => { loadScene(sceneDefs[index]); wrap.classList.remove('transitioning'); }, 300);
    }

    document.querySelectorAll('.scene-btn').forEach(btn =>
        btn.addEventListener('click', () => switchScene(parseInt(btn.dataset.scene))));

    // Zoom
    let zoomTimer = null;
    function startZoom(dir) {
        stopZoom();
        zoomTimer = setInterval(() => {
            if (!pViewer) return;
            const v = pViewer.getHfov();
            pViewer.setHfov(dir === 'in' ? Math.max(40, v - 3) : Math.min(140, v + 3));
        }, 40);
    }
    function stopZoom() { clearInterval(zoomTimer); }

    [document.getElementById('tour-zoom-in'), document.getElementById('tour-zoom-out')].forEach((btn, i) => {
        if (!btn) return;
        const dir = i === 0 ? 'in' : 'out';
        btn.addEventListener('mousedown',  () => startZoom(dir));
        btn.addEventListener('touchstart', () => startZoom(dir), { passive: true });
        ['mouseup','mouseleave','touchend'].forEach(ev => btn.addEventListener(ev, stopZoom));
    });

    // Fullscreen
    const fsBtn = document.getElementById('tour-fullscreen');
    if (fsBtn) {
        fsBtn.addEventListener('click', () => {
            const wrap = document.querySelector('.tour360-viewer-wrap');
            if (!document.fullscreenElement) {
                (wrap.requestFullscreen || wrap.webkitRequestFullscreen)?.call(wrap);
            } else {
                (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
            }
        });
        document.addEventListener('fullscreenchange', () => {
            fsBtn.innerHTML = document.fullscreenElement
                ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`
                : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/></svg>`;
        });
    }

})(); // end initTour360
