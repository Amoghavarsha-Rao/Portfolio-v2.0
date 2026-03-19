const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealNodes = document.querySelectorAll('.reveal');
const yearNode = document.getElementById('year');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && header && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    header.classList.toggle('nav-open', !expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      header.classList.remove('nav-open');
    });
  });
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });
      });
    },
    {
      rootMargin: '-35% 0px -45% 0px',
      threshold: 0.01,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealNodes.forEach((node) => node.classList.add('visible'));
}

/* ---------- Splash follow cursor ---------- */
const splashCards = document.querySelectorAll(
  '.feature-card, .contact-card, .hero-note, .split-card, .project-card, .framework-card, .timeline-item'
);

splashCards.forEach((card) => {
  let trackingTimer;
  let rafId = 0;
  let lastX = 0;
  let lastY = 0;

  function applySplash() {
    card.style.setProperty('--splash-x', `${lastX}px`);
    card.style.setProperty('--splash-y', `${lastY}px`);
    rafId = 0;
  }

  function queueUpdate(e) {
    const rect = card.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    if (!rafId) {
      rafId = requestAnimationFrame(applySplash);
    }
  }

  card.addEventListener('mouseenter', (e) => {
    queueUpdate(e);
    trackingTimer = setTimeout(() => card.classList.add('splash-tracking'), 550);
  });

  card.addEventListener('mousemove', queueUpdate);

  card.addEventListener('mouseleave', () => {
    clearTimeout(trackingTimer);
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    card.classList.remove('splash-tracking');
    card.style.removeProperty('--splash-x');
    card.style.removeProperty('--splash-y');
  });
});