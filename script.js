/* ============================================================
   SL GOME JAVASCRIPT
   Animaciones, interacciones y utilidades
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────
// 1. NAVBAR SCROLL BEHAVIOR
// ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

const handleScroll = () => {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Parallax on hero bg
  const heroBg = document.querySelector('.hero-bg-image');
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
  }
};

window.addEventListener('scroll', debounce(handleScroll, 8));

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─────────────────────────────────────────────
// 2. MOBILE MENU
// ─────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

menuToggle.addEventListener('click', () => {
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', (e) => {
  if (e.target === mobileOverlay) closeMenu();
});

function closeMenu() {
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ─────────────────────────────────────────────
// 3. SMOOTH SCROLL FOR NAV LINKS
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─────────────────────────────────────────────
// 4. ACTIVE NAV LINK ON SCROLL
// ─────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ─────────────────────────────────────────────
// 5. SCROLL REVEAL
// ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.animationDelay || '0s';
      const delayMs = parseFloat(delay) * 1000;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delayMs);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─────────────────────────────────────────────
// 6. ANIMATED COUNTERS
// ─────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let current = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = Math.round(target).toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.round(current).toLocaleString();
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number, .counter, .fsm-number').forEach(el => {
        const target = parseFloat(el.dataset.target);
        if (!isNaN(target) && !el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el, target, 2200);
        }
      });
    }
  });
}, { threshold: 0.3 });

// Observe hero stats + stats section + fleet stats
document.querySelectorAll('.hero-stats, .stats-grid, .fleet-stats-mini').forEach(el => {
  counterObserver.observe(el);
});

// ─────────────────────────────────────────────
// 7. PARTICLE SYSTEMS
// ─────────────────────────────────────────────
function createParticles(containerId, count = 40) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.width = p.style.height = `${Math.random() * 3 + 1}px`;
    p.style.animationDelay = `${Math.random() * 20}s`;
    p.style.animationDuration = `${15 + Math.random() * 15}s`;
    p.style.opacity = Math.random() * 0.5 + 0.1;
    container.appendChild(p);
  }
}

createParticles('particles', 45);
createParticles('ctaParticles', 25);

// ─────────────────────────────────────────────
// 8. FLIP CARDS — MOBILE TAP SUPPORT
// ─────────────────────────────────────────────
if (window.innerWidth <= 768) {
  document.querySelectorAll('.service-card-flip').forEach(card => {
    card.addEventListener('click', () => {
      const inner = card.querySelector('.service-card-inner');
      const isFlipped = inner.style.transform === 'rotateY(180deg)';
      // Reset all
      document.querySelectorAll('.service-card-inner').forEach(c => {
        c.style.transform = '';
      });
      if (!isFlipped) {
        inner.style.transform = 'rotateY(180deg)';
      }
    });
  });
}

// ─────────────────────────────────────────────
// 9. CONTACT FORM
// ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // Simulate send (replace with real endpoint/EmailJS/etc.)
    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1800);
  });
}

// ─────────────────────────────────────────────
// 10. TRUST BAR AUTO-SCROLL ANIMATION
// ─────────────────────────────────────────────
const trustItems = document.querySelector('.trust-items');
if (trustItems) {
  // Clone items for infinite scroll effect on mobile
  if (window.innerWidth < 768) {
    const items = trustItems.innerHTML;
    trustItems.innerHTML = items + items;
    trustItems.style.animation = 'scrollTrust 20s linear infinite';
  }
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Initial check on load
handleScroll();

// ─────────────────────────────────────────────
// 11. VISIT COUNTER
// ─────────────────────────────────────────────
(function () {
  const BASE_VISITS = 3847; // Número base realista
  const STORAGE_KEY = 'slgome_visits';

  // Read or initialize
  let stored = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  if (isNaN(stored) || stored < BASE_VISITS) {
    stored = BASE_VISITS;
  }

  // Add random increment (3-12 per session for realism)
  const increment = Math.floor(Math.random() * 10) + 3;
  const total = stored + increment;
  localStorage.setItem(STORAGE_KEY, total);

  // Display with animated count-up
  const el = document.getElementById('visitCount');
  if (!el) return;

  let current = Math.max(total - 150, BASE_VISITS);
  const duration = 2400;
  const steps = 60;
  const stepValue = (total - current) / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current += stepValue;
    if (step >= steps) {
      el.textContent = total.toLocaleString('es-MX');
      el.style.animation = 'countUp 0.3s ease';
      clearInterval(timer);
    } else {
      el.textContent = Math.round(current).toLocaleString('es-MX');
    }
  }, duration / steps);
})();
