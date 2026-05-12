// =====================
// FRANK SALMÓN — script.js
// =====================

// --- CONFIGURACIÓN ---
const WHATSAPP_NUMBER = '526675761167'; // Cambia al número real
const WHATSAPP_MSG    = encodeURIComponent('Hola, quiero hacer un pedido en Frank Salmón 🐟');

// --- NAV PILLS → scroll a sección ---
document.querySelectorAll('.nav-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const id = pill.dataset.section;
    const el = document.getElementById(id);
    if (el) {
      const offset = document.querySelector('.sticky-nav').offsetHeight + 8;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- NAV PILL ACTIVO según scroll ---
const sections  = ['ofrecemos', 'servicios', 'nosotros', 'contacto'];
const pills     = document.querySelectorAll('.nav-pill');

function updateNav() {
  const nav    = document.querySelector('.sticky-nav');
  const offset = nav.offsetHeight + 40;
  let current  = sections[0];

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= offset) current = id;
  });

  pills.forEach(p => {
    p.classList.toggle('active', p.dataset.section === current);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });

// --- REVEAL ON SCROLL ---
const revealEls = document.querySelectorAll('.section');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObserver.observe(el));

// --- CONTADOR ANIMADO en estadísticas ---
function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}

const statsSection = document.getElementById('nosotros');
let counted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    document.querySelectorAll('.stat-n[data-target]').forEach(el => {
      animateCount(el, parseInt(el.dataset.target));
    });
  }
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

// --- TOAST helper ---
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// --- SERVICIOS: acciones ---
document.getElementById('svc-domicilio').addEventListener('click', () => {
  showToast('📍 Servicio disponible en Culiacán');
});

document.getElementById('svc-recoja').addEventListener('click', () => {
  showToast('🛍️ Ordena y pasa a recoger tu pedido');
});

document.getElementById('svc-whatsapp').addEventListener('click', () => {
  window.open(
    `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_MSG}`,
    '_blank'
  );
});

// --- TARJETAS menú: feedback táctil ---
document.querySelectorAll('.ocard').forEach(card => {
  card.addEventListener('click', () => {
    const nombre = card.querySelector('h3').textContent;
    showToast(`🍽️ ${nombre}`);
  });
});