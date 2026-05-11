/* Main Script — v2 (mejorado) */

const CONFIG = {
  whatsapp: {
    number: '573104522104',
    message: 'Hola, encontré su página web y me gustaría agendar una consulta jurídica.',
  },
  form: { endpoint: '', redirectAfter: false },
};

/* ── MEJORA 1: Color dorado leído desde variable CSS (sin hardcodear) ── */
const cssGold = getComputedStyle(document.documentElement)
  .getPropertyValue('--gold').trim() || '#c5a763';

/* ── MEJORA 2: Toast en lugar de alert() ── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
    <span class="toast-msg">${message}</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ── WhatsApp Links ── */
document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(CONFIG.whatsapp.message)}`;
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
});

/* ── MEJORA 3: Header scroll con requestAnimationFrame (sin jank) ── */
const header = document.getElementById('header');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      header.classList.toggle('scrolled', window.scrollY > 60);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── MEJORA 4: Hamburger con ARIA correcto ── */
const hamburger = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
});

mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

/* ── MEJORA 5: Mapa diferido — se inicializa solo cuando el usuario llega ── */
let mapInitialized = false;

function initMap() {
  if (mapInitialized) return;
  mapInitialized = true;

  const map = L.map('map', { scrollWheelZoom: false }).setView([6.5, -75.5], 8);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  const municipios = [
    { nombre: 'Medellín',           coords: [6.2442, -75.5812], destacado: true },
    { nombre: 'Itagüí',             coords: [6.1847, -75.5990], destacado: true },
    { nombre: 'Envigado',           coords: [6.1675, -75.5874], destacado: true },
    { nombre: 'Sabaneta',           coords: [6.1514, -75.6169], destacado: true },
    { nombre: 'Bello',              coords: [6.3397, -75.5580], destacado: true },
    { nombre: 'La Estrella',        coords: [6.1561, -75.6428], destacado: true },
    { nombre: 'Caldas',             coords: [6.0939, -75.6347], destacado: true },
    { nombre: 'Copacabana',         coords: [6.3497, -75.5025], destacado: true },
    { nombre: 'Girardota',          coords: [6.3786, -75.4447], destacado: true },
    { nombre: 'Barbosa',            coords: [6.4378, -75.3325], destacado: true },
    { nombre: 'Rionegro',           coords: [6.1544, -75.3744] },
    { nombre: 'El Retiro',          coords: [6.0594, -75.5061] },
    { nombre: 'La Ceja',            coords: [6.0275, -75.4358] },
    { nombre: 'Guarne',             coords: [6.2800, -75.4500] },
    { nombre: 'Marinilla',          coords: [6.1744, -75.3364] },
    { nombre: 'El Peñol',           coords: [6.2175, -75.2358] },
    { nombre: 'Guatapé',            coords: [6.2322, -75.1594] },
    { nombre: 'El Santuario',       coords: [6.1408, -75.2722] },
    { nombre: 'La Unión',           coords: [5.9783, -75.3647] },
    { nombre: 'El Carmen de Víboral',coords:[6.0883, -75.3394] },
    { nombre: 'Abejorral',          coords: [5.7914, -75.4275] },
    { nombre: 'Santa Fe de Antioquia',coords:[6.5567,-75.8289] },
    { nombre: 'Sopetrán',           coords: [6.5044, -75.7428] },
    { nombre: 'San Jerónimo',       coords: [6.4664, -75.7197] },
    { nombre: 'Amagá',              coords: [6.0383, -75.7072] },
    { nombre: 'Jardín',             coords: [5.5986, -75.8200] },
    { nombre: 'Andes',              coords: [5.6564, -75.8797] },
    { nombre: 'Jericó',             coords: [5.7892, -75.7803] },
    { nombre: 'La Pintada',         coords: [5.7483, -75.6117] },
    { nombre: 'Támesis',            coords: [5.6700, -75.7178] },
    { nombre: 'Venecia',            coords: [5.9653, -75.7583] },
    { nombre: 'Salgar',             coords: [5.9644, -75.9719] },
    { nombre: 'Pueblorrico',        coords: [5.7267, -75.9264] },
    { nombre: 'Urrao',              coords: [6.3219, -76.1408] },
    { nombre: 'Frontino',           coords: [6.7814, -76.1311] },
    { nombre: 'Chigorodó',          coords: [7.6711, -76.6872] },
    { nombre: 'Apartadó',           coords: [7.8833, -76.6333] },
    { nombre: 'Turbo',              coords: [8.0997, -76.7283] },
    { nombre: 'Arboletes',          coords: [8.8522, -76.4275] },
    { nombre: 'Necoclí',            coords: [8.4264, -76.7822] },
    { nombre: 'San Pedro de Urabá', coords: [8.2856, -76.3869] },
    { nombre: 'Caucasia',           coords: [7.9883, -75.1947] },
    { nombre: 'Puerto Berrío',      coords: [6.4894, -74.4044] },
    { nombre: 'Segovia',            coords: [7.0833, -74.7000] },
    { nombre: 'Amalfi',             coords: [6.9122, -74.9258] },
    { nombre: 'Vegachí',            coords: [6.7725, -74.7986] },
    { nombre: 'Yolombó',            coords: [6.5997, -74.9994] },
    { nombre: 'Cisneros',           coords: [6.5408, -74.7461] },
    { nombre: 'Santo Domingo',      coords: [6.4786, -75.0353] },
    { nombre: 'San Rafael',         coords: [6.2947, -74.9958] },
    { nombre: 'San Carlos',         coords: [6.1872, -74.9939] },
    { nombre: 'San Vicente',        coords: [6.3028, -75.3333] },
    { nombre: 'Gómez Plata',        coords: [6.6908, -75.1439] },
    { nombre: 'Don Matías',         coords: [6.5028, -75.4194] },
    { nombre: 'Concepción',         coords: [6.3947, -75.2697] },
    { nombre: 'Santa Rosa de Osos', coords: [6.6433, -75.4608] },
    { nombre: 'San Pedro de los Milagros', coords: [6.4681, -75.5403] },
    { nombre: 'Yarumal',            coords: [7.0014, -75.4183] },
    { nombre: 'Nariño',             coords: [5.8136, -74.8831] },
    { nombre: 'Santa Bárbara',      coords: [5.8736, -75.5714] },
    { nombre: 'Sabanalarga',        coords: [6.6967, -75.7261] },
    { nombre: 'Puerto Triunfo',     coords: [5.8761, -74.5614] },
    { nombre: 'Argelia',            coords: [5.7239, -75.9169] },
  ];

  municipios.forEach(m => {
    const color  = m.destacado ? cssGold : '#3b5bdb';
    const radius = m.destacado ? 8 : 5;
    L.circleMarker(m.coords, {
      color, fillColor: color, fillOpacity: 0.9, radius, weight: 2, opacity: 1,
    }).addTo(map).bindPopup(`<b>${m.nombre}</b>`);
  });
}

const mapContainer = document.getElementById('map');
if (mapContainer) {
  const mapObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { initMap(); mapObserver.disconnect(); }
  }, { rootMargin: '200px' });
  mapObserver.observe(mapContainer);
}

/* ── Scroll animations ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in,.fade-in-left,.fade-in-right')
  .forEach(el => observer.observe(el));

/* ── Contadores Animados ── */
const statObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const textNode = el.childNodes[0];
      const target = parseInt(textNode.textContent, 10);
      if (isNaN(target)) return;
      
      let current = 0;
      const duration = 2000;
      const interval = Math.max(15, Math.abs(Math.floor(duration / target)));
      const increment = target / (duration / interval);
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          textNode.textContent = target + " ";
          clearInterval(timer);
        } else {
          textNode.textContent = Math.ceil(current) + " ";
        }
      }, interval);
      
      obs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stat-number').forEach(stat => statObserver.observe(stat));

/* ── MEJORA 6: Formulario con toast y estado de carga en el botón ── */
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  const data = Object.fromEntries(new FormData(this));

  const finish = () => { btn.textContent = original; btn.disabled = false; };

  if (CONFIG.form.endpoint) {
    fetch(CONFIG.form.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(() => { showToast('¡Mensaje enviado! Le responderemos pronto.', 'success'); this.reset(); })
      .catch(() => showToast('Error al enviar. Intente por WhatsApp.', 'error'))
      .finally(finish);
  } else {
    const msg = `Consulta desde web:\nNombre: ${data.name}\nTel: ${data.phone}\nTipo: ${data.service}\nMensaje: ${data.message}`;
    window.open(`https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(msg)}`, '_blank');
    this.reset();
    finish();
    showToast('Redirigiendo a WhatsApp...', 'success');
  }
});

/* ── MEJORA 7: Año dinámico en el footer ── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
