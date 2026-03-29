// ============================================================
//  TEMPURA POTATO — app.js
//  Firebase + Cart + Menu + PWA + Animations
// ============================================================

// ─── FIREBASE CONFIG ───────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCD9Xm9Etzxg5Avy9n4sHP-SW0Ei-ZTcHA",
  authDomain: "tempura-potato-deep.firebaseapp.com",
  databaseURL: "https://tempura-potato-deep-default-rtdb.firebaseio.com",
  projectId: "tempura-potato-deep",
  storageBucket: "tempura-potato-deep.firebasestorage.app",
  messagingSenderId: "516857155009",
  appId: "1:516857155009:web:c5ed7f3bac91d2fc127340",
  measurementId: "G-9FW6P8L7VP"
};

// Init Firebase (compat version loaded via script tags)
let db, auth;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  auth = firebase.auth();
} catch(e) { console.warn('Firebase init:', e.message); }

// ─── MENU DATA ─────────────────────────────────────────────
const menuData = [
  // BURGERS
  { id:'b1', name:'Grill Burger', cat:'burgers', price:320, emoji:'🍔', desc:'Flame-grilled patty with fresh veggies & signature sauce' },
  { id:'b2', name:'Zinger Burger', cat:'burgers', price:350, emoji:'🍔', desc:'Crispy zinger patty, crunchy lettuce, special zinger sauce' },
  { id:'b3', name:'Zinger Twister', cat:'burgers', price:380, emoji:'🌯', desc:'Crispy zinger in a soft tortilla wrap with fresh veggies' },
  { id:'b4', name:'Chicken BBQ Wrap', cat:'wraps', price:300, emoji:'🌯', desc:'Juicy BBQ chicken strips wrapped in warm paratha' },

  // WRAPS & ROLLS
  { id:'w1', name:'Chicken Bhayari Paratha Roll', cat:'wraps', price:300, emoji:'🫔', desc:'Classic chicken bhayari in soft flaky paratha' },
  { id:'w2', name:'Seekh Kabab Paratha Roll', cat:'wraps', price:250, emoji:'🫔', desc:'Juicy seekh kababs rolled in fresh paratha' },
  { id:'w3', name:'Mala Boti Wrap', cat:'wraps', price:450, emoji:'🌯', desc:'Spicy mala boti with crispy fries inside a wrap' },
  { id:'w4', name:'Zinger Wrap', cat:'wraps', price:350, emoji:'🌯', desc:'Zinger patty with lettuce & sauce in a tortilla' },
  { id:'w5', name:'Shapath Roll', cat:'wraps', price:390, emoji:'🫔', desc:'Loaded shapath in flaky paratha, street-style' },
  { id:'w6', name:'Dhamaka Roll', cat:'wraps', price:490, emoji:'🫔', desc:'The ultimate roll — fully loaded, fully flavoured' },
  { id:'w7', name:'Malai Boti Paratha Roll', cat:'wraps', price:420, emoji:'🫔', desc:'Creamy malai boti wrapped in hot paratha' },
  { id:'w8', name:'Grill Shawarma', cat:'wraps', price:280, emoji:'🌯', desc:'Fresh grilled chicken shawarma with garlic sauce' },
  { id:'w9', name:'Special Grilled Shawarma', cat:'wraps', price:380, emoji:'🌯', desc:'Upgraded shawarma — extra toppings, extra flavour' },
  { id:'w10', name:'2 Shawarma', cat:'wraps', price:380, emoji:'🌯', desc:'Two classic shawarmas — great value' },

  // CHICKEN
  { id:'c1', name:'Chicken Taka Paratha Roll', cat:'wraps', price:280, emoji:'🫔', desc:'Taka-style spiced chicken in crispy paratha' },
  { id:'c2', name:'Chicken Paratha Roll', cat:'wraps', price:290, emoji:'🫔', desc:'Tender chicken strips in warm fresh paratha' },
  { id:'c3', name:'Taka Grilled Chicken', cat:'sides', price:250, emoji:'🍗', desc:'Perfectly grilled chicken taka style — 330g' },
  { id:'c4', name:'Half Chicken Zinger Sharma', cat:'wraps', price:550, emoji:'🌯', desc:'Half chicken zinger shawarma — massive flavour' },

  // SIDES
  { id:'s1', name:'Plane Fries', cat:'sides', price:120, emoji:'🍟', desc:'Classic golden crispy fries' },
  { id:'s2', name:'Loaded Fries', cat:'sides', price:180, emoji:'🍟', desc:'Fries loaded with cheese sauce & toppings' },
  { id:'s3', name:'1 Litre Next Cola', cat:'sides', price:120, emoji:'🥤', desc:'Chilled Next Cola 1 litre' },

  // DEALS
  { id:'d1', name:'Deal 1', cat:'deals', price:600, emoji:'🎁',
    desc:'2 Zinger Burgers + 2 Next Colas',
    includes:['2 Zinger Burgers','2 Next Colas'] },
  { id:'d2', name:'Deal 2', cat:'deals', price:420, emoji:'🎁',
    desc:'2 Zinger Twisters + 1 Plane Fries',
    includes:['2 Zinger Twisters','1 Plane Fries'] },
  { id:'d3', name:'Deal 3', cat:'deals', price:380, emoji:'🎁',
    desc:'1 Zinger Burger + 1 Plane Fries + 1 Red Drink',
    includes:['1 Zinger Burger','1 Plane Fries','1 Red Drink'] },
  { id:'d4', name:'Deal 4', cat:'deals', price:480, emoji:'🎁',
    desc:'2 Patty Burger + 1 Litre Next Cola',
    includes:['2 Patty Burgers','1 Litre Next Cola'] },
  { id:'d5', name:'Deal 5', cat:'deals', price:550, emoji:'🎁',
    desc:'1 Zinger Burger + 1 Chicken Sharma + 1 Half Drink',
    includes:['1 Zinger Burger','1 Chicken Shawarma','1 Half Drink'] },
  { id:'d6', name:'Deal 6 — Family', cat:'deals', price:1000, emoji:'🎉',
    desc:'2 Patty Burgers + 2 Zingers + 1 Litre Cola + 1 Loaded Fries',
    includes:['2 Patty Burgers','2 Zinger Burgers','1 Litre Next Cola','1 Loaded Fries'] },
  { id:'d7', name:'Deal 7 — Mega', cat:'deals', price:1250, emoji:'🎉',
    desc:'4 Zingers + 1 Litre Cola + 1 Loaded Fries',
    includes:['4 Zinger Burgers','1 Litre Next Cola','1 Loaded Fries'] },
  { id:'d8', name:'Deal 8 — Feast', cat:'deals', price:1480, emoji:'🎉',
    desc:'5 Grill Burgers + 2 Loaded Fries + 1 Litre Cola',
    includes:['5 Grill Burgers','2 Loaded Fries','1 Litre Next Cola'] },
  { id:'d9', name:'Deal 9 — Party', cat:'deals', price:1500, emoji:'🎊',
    desc:'6 Patty Burgers + 1 Litre Cola + 1 Next Cola + 1 Loaded Fries',
    includes:['6 Patty Burgers','1 Litre Next Cola','1 Loaded Fries'] },
  { id:'d10', name:'Deal 10 — Legendary', cat:'deals', price:2000, emoji:'👑',
    desc:'Ultimate party pack — everything you need for a group',
    includes:['2 Patty Burgers','2 Zingers','2 Grill Burgers','2 Loaded Fries','2 Litres Cola'] },
];

// ─── CART ──────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('tp_cart') || '[]');
let modalItem = null, modalQty = 1;

function saveCart() {
  localStorage.setItem('tp_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(item, qty = 1) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) existing.qty += qty;
  else cart.push({ ...item, qty });
  saveCart();
  showToast(`${item.name} added to cart 🛒`);
}

function updateCartUI() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const countEl = document.getElementById('cart-float-count');
  const floatEl = document.getElementById('cart-float');
  if (countEl) countEl.textContent = total;
  if (floatEl) {
    if (total > 0) floatEl.classList.add('show');
    else floatEl.classList.remove('show');
  }
}

// ─── TOAST ─────────────────────────────────────────────────
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ─── ITEM MODAL ────────────────────────────────────────────
function openItemModal(item) {
  modalItem = item;
  modalQty = 1;
  document.getElementById('modal-emoji').textContent = item.emoji;
  document.getElementById('modal-name').textContent = item.name;
  document.getElementById('modal-desc').textContent = item.desc;
  document.getElementById('modal-price').textContent = `Rs. ${item.price * modalQty}`;
  document.getElementById('modal-qty').textContent = modalQty;
  document.getElementById('item-modal-overlay').classList.add('show');
}

function closeItemModal() {
  document.getElementById('item-modal-overlay').classList.remove('show');
  modalItem = null;
}

function modalQtyChange(d) {
  modalQty = Math.max(1, modalQty + d);
  document.getElementById('modal-qty').textContent = modalQty;
  if (modalItem) document.getElementById('modal-price').textContent = `Rs. ${modalItem.price * modalQty}`;
}

function addModalToCart() {
  if (modalItem) { addToCart(modalItem, modalQty); closeItemModal(); }
}

// ─── RENDER MENU ───────────────────────────────────────────
function renderMenu(cat = 'all') {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  const items = cat === 'all' ? menuData.filter(i => i.cat !== 'deals') : menuData.filter(i => i.cat === cat);
  grid.innerHTML = items.map(item => `
    <div class="menu-card reveal" onclick="openItemModal(${JSON.stringify(item).replace(/"/g,"'")})">
      <div class="menu-card-img">${item.emoji}</div>
      <div class="menu-card-body">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer">
          <div class="menu-card-price">Rs. ${item.price}</div>
          <button class="menu-card-add" onclick="event.stopPropagation();addToCart(${JSON.stringify(item).replace(/"/g,"'")})">+</button>
        </div>
      </div>
    </div>
  `).join('');
  triggerRevealAnimations();
}

function renderDeals() {
  const grid = document.getElementById('deals-grid');
  if (!grid) return;
  const deals = menuData.filter(i => i.cat === 'deals');
  grid.innerHTML = deals.map(deal => `
    <div class="deal-card reveal" onclick="openItemModal(${JSON.stringify(deal).replace(/"/g,"'")})">
      <div class="deal-badge">DEAL</div>
      <div class="deal-card-img">${deal.emoji}</div>
      <div class="deal-card-body">
        <div class="deal-name">${deal.name}</div>
        <div class="deal-includes">${(deal.includes||[]).map(i=>`✦ ${i}`).join('<br/>')}</div>
        <div class="deal-footer">
          <div class="deal-price">Rs. ${deal.price}</div>
          <button class="btn-primary" style="padding:10px 20px;font-size:13px" onclick="event.stopPropagation();addToCart(${JSON.stringify(deal).replace(/"/g,"'")})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
  triggerRevealAnimations();
}

// ─── MENU TABS ─────────────────────────────────────────────
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.cat);
    });
  });
}

// ─── NAVBAR ────────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    // shift navbar down if pwa banner showing
    if (document.getElementById('pwa-banner')?.classList.contains('show')) {
      nav.style.top = '48px';
    }
  });
  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
  });
}

window.closeMobileMenu = function() {
  document.getElementById('mobile-menu')?.classList.remove('open');
};

// ─── PARTICLES ─────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(p);
  }
}

// ─── PARALLAX ──────────────────────────────────────────────
function initParallax() {
  const bg = document.getElementById('parallax-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const section = document.getElementById('parallax-banner');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const progress = -rect.top / window.innerHeight;
    bg.style.transform = `translateY(${progress * 40}px)`;
  });
}

// ─── APPLE SCROLL EFFECT ───────────────────────────────────
function initAppleScroll() {
  const section = document.getElementById('apple-section');
  if (!section) return;
  const textBlocks = [
    document.getElementById('apple-text-1'),
    document.getElementById('apple-text-2'),
    document.getElementById('apple-text-3'),
    document.getElementById('apple-text-4'),
    document.getElementById('apple-text-5'),
  ].filter(Boolean);
  const burger = document.getElementById('ab-burger');
  const layers = {
    bunTop: document.getElementById('ab-bun-top'),
    lettuce: document.getElementById('ab-lettuce'),
    cheese: document.getElementById('ab-cheese'),
    patty: document.getElementById('ab-patty'),
    tomato: document.getElementById('ab-tomato'),
    bunBottom: document.getElementById('ab-bun-bottom'),
  };

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const sectionH = section.offsetHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / (sectionH - window.innerHeight)));
    const step = Math.floor(progress * 5);

    textBlocks.forEach((el, i) => {
      el.classList.toggle('visible', i === step);
    });

    // Burger layer explosion based on progress
    if (burger) {
      const explode = progress > 0.1;
      const gap = Math.min(progress * 60, 40);
      if (layers.bunTop) layers.bunTop.style.transform = explode ? `translateY(-${gap * 2.5}px)` : '';
      if (layers.lettuce) layers.lettuce.style.transform = explode ? `translateY(-${gap * 1.5}px)` : '';
      if (layers.cheese) layers.cheese.style.transform = explode ? `translateY(-${gap * 0.8}px)` : '';
      if (layers.tomato) layers.tomato.style.transform = explode ? `translateY(${gap * 0.8}px)` : '';
      if (layers.bunBottom) layers.bunBottom.style.transform = explode ? `translateY(${gap * 2}px)` : '';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── REVEAL ANIMATIONS ─────────────────────────────────────
function triggerRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));
}

// ─── PWA ───────────────────────────────────────────────────
let deferredPrompt = null;

function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show banner after 3s
    setTimeout(() => document.getElementById('pwa-banner')?.classList.add('show'), 3000);
    // Show popup after 8s (first visit)
    if (!localStorage.getItem('tp_pwa_shown')) {
      setTimeout(() => {
        document.getElementById('pwa-popup-overlay')?.classList.add('show');
        localStorage.setItem('tp_pwa_shown', '1');
      }, 8000);
    }
  });

  const installBtn = document.getElementById('pwa-install-btn');
  const popupInstall = document.getElementById('pwa-popup-install');

  async function triggerInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (outcome === 'accepted') {
        document.getElementById('pwa-banner')?.classList.remove('show');
        closePWAPopup();
        showToast('App installed! Enjoy 20% off 🎉');
      }
    } else {
      // Show manual instructions
      const manual = document.getElementById('pwa-popup-manual');
      if (manual) manual.style.display = 'block';
      document.getElementById('pwa-popup-overlay')?.classList.add('show');
    }
  }

  installBtn?.addEventListener('click', triggerInstall);
  popupInstall?.addEventListener('click', triggerInstall);

  document.getElementById('pwa-banner-close')?.addEventListener('click', () => {
    document.getElementById('pwa-banner')?.classList.remove('show');
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW:', err));
  }
}

window.closePWAPopup = function() {
  document.getElementById('pwa-popup-overlay')?.classList.remove('show');
};

// ─── CLOSE MODALS ON OVERLAY CLICK ────────────────────────
document.addEventListener('click', (e) => {
  if (e.target.id === 'item-modal-overlay') closeItemModal();
  if (e.target.id === 'pwa-popup-overlay') closePWAPopup();
});

// ─── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initParallax();
  initAppleScroll();
  renderMenu('all');
  renderDeals();
  initMenuTabs();
  triggerRevealAnimations();
  initPWA();
  updateCartUI();

  // Load dynamic settings from Firebase if available
  if (db) {
    db.ref('settings/branding').once('value').then(snap => {
      const data = snap.val();
      if (data?.accentColor) {
        document.documentElement.style.setProperty('--yellow', data.accentColor);
        document.documentElement.style.setProperty('--yellow-glow', data.accentColor + '4d');
      }
    }).catch(() => {});
  }
});

// Export for other pages
window.TP = { cart, addToCart, saveCart, menuData, showToast, db, auth };
