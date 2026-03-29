// ============================================================
//  TEMPURA POTATO — app.js
//  Firebase + Cart + Menu + PWA + Animations + Rebranding + Gallery
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

let db, auth;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  auth = firebase.auth();
} catch(e) { console.warn('Firebase init:', e.message); }

// ─── MENU DATA ─────────────────────────────────────────────
const menuData = [
  { id:'b1', name:'Grill Burger', cat:'burgers', price:320, emoji:'🍔', desc:'Flame-grilled patty with fresh veggies & signature sauce' },
  { id:'b2', name:'Zinger Burger', cat:'burgers', price:350, emoji:'🍔', desc:'Crispy zinger patty, crunchy lettuce, special zinger sauce' },
  { id:'b3', name:'Zinger Twister', cat:'burgers', price:380, emoji:'🌯', desc:'Crispy zinger in a soft tortilla wrap with fresh veggies' },
  { id:'b4', name:'Chicken BBQ Wrap', cat:'wraps', price:300, emoji:'🌯', desc:'Juicy BBQ chicken strips wrapped in warm paratha' },
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
  { id:'c1', name:'Chicken Taka Paratha Roll', cat:'wraps', price:280, emoji:'🫔', desc:'Taka-style spiced chicken in crispy paratha' },
  { id:'c2', name:'Chicken Paratha Roll', cat:'wraps', price:290, emoji:'🫔', desc:'Tender chicken strips in warm fresh paratha' },
  { id:'c3', name:'Taka Grilled Chicken', cat:'sides', price:250, emoji:'🍗', desc:'Perfectly grilled chicken taka style — 330g' },
  { id:'c4', name:'Half Chicken Zinger Sharma', cat:'wraps', price:550, emoji:'🌯', desc:'Half chicken zinger shawarma — massive flavour' },
  { id:'s1', name:'Plane Fries', cat:'sides', price:120, emoji:'🍟', desc:'Classic golden crispy fries' },
  { id:'s2', name:'Loaded Fries', cat:'sides', price:180, emoji:'🍟', desc:'Fries loaded with cheese sauce & toppings' },
  { id:'s3', name:'1 Litre Next Cola', cat:'sides', price:120, emoji:'🥤', desc:'Chilled Next Cola 1 litre' },
  { id:'d1', name:'Deal 1', cat:'deals', price:600, emoji:'🎁', desc:'2 Zinger Burgers + 2 Next Colas', includes:['2 Zinger Burgers','2 Next Colas'] },
  { id:'d2', name:'Deal 2', cat:'deals', price:420, emoji:'🎁', desc:'2 Zinger Twisters + 1 Plane Fries', includes:['2 Zinger Twisters','1 Plane Fries'] },
  { id:'d3', name:'Deal 3', cat:'deals', price:380, emoji:'🎁', desc:'1 Zinger Burger + 1 Plane Fries + 1 Red Drink', includes:['1 Zinger Burger','1 Plane Fries','1 Red Drink'] },
  { id:'d4', name:'Deal 4', cat:'deals', price:480, emoji:'🎁', desc:'2 Patty Burger + 1 Litre Next Cola', includes:['2 Patty Burgers','1 Litre Next Cola'] },
  { id:'d5', name:'Deal 5', cat:'deals', price:550, emoji:'🎁', desc:'1 Zinger Burger + 1 Chicken Sharma + 1 Half Drink', includes:['1 Zinger Burger','1 Chicken Shawarma','1 Half Drink'] },
  { id:'d6', name:'Deal 6 — Family', cat:'deals', price:1000, emoji:'🎉', desc:'2 Patty Burgers + 2 Zingers + 1 Litre Cola + 1 Loaded Fries', includes:['2 Patty Burgers','2 Zinger Burgers','1 Litre Next Cola','1 Loaded Fries'] },
  { id:'d7', name:'Deal 7 — Mega', cat:'deals', price:1250, emoji:'🎉', desc:'4 Zingers + 1 Litre Cola + 1 Loaded Fries', includes:['4 Zinger Burgers','1 Litre Next Cola','1 Loaded Fries'] },
  { id:'d8', name:'Deal 8 — Feast', cat:'deals', price:1480, emoji:'🎉', desc:'5 Grill Burgers + 2 Loaded Fries + 1 Litre Cola', includes:['5 Grill Burgers','2 Loaded Fries','1 Litre Next Cola'] },
  { id:'d9', name:'Deal 9 — Party', cat:'deals', price:1500, emoji:'🎊', desc:'6 Patty Burgers + 1 Litre Cola + 1 Next Cola + 1 Loaded Fries', includes:['6 Patty Burgers','1 Litre Next Cola','1 Loaded Fries'] },
  { id:'d10', name:'Deal 10 — Legendary', cat:'deals', price:2000, emoji:'👑', desc:'Ultimate party pack — everything you need for a group', includes:['2 Patty Burgers','2 Zingers','2 Grill Burgers','2 Loaded Fries','2 Litres Cola'] },
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

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

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

function initNavbar() {
  const nav = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
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

function triggerRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));
}

let deferredPrompt = null;
function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => document.getElementById('pwa-banner')?.classList.add('show'), 3000);
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

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW:', err));
  }
}

window.closePWAPopup = function() {
  document.getElementById('pwa-popup-overlay')?.classList.remove('show');
};

// ─── NEW: LIVE REBRANDING & IMAGE LOADER ───────────────────
function loadBrandingFromFirebase() {
  if (!db) return;
  db.ref('settings/branding').on('value', snap => {
    const data = snap.val() || {};
    if (data.accentColor) {
      document.documentElement.style.setProperty('--yellow', data.accentColor);
      document.documentElement.style.setProperty('--yellow-glow', data.accentColor + '4d');
    }
    if (data.name) document.querySelectorAll('.nav-brand, .footer-brand').forEach(el => el.textContent = data.name.toUpperCase());
    if (data.tagline) document.querySelectorAll('.nav-sub, .footer-tagline').forEach(el => el.textContent = data.tagline);
    if (data.phone) {
      const phoneEl = document.getElementById('contact-phone');
      if (phoneEl) phoneEl.innerText = data.phone;
    }
    if (data.address) {
      const addrEl = document.getElementById('contact-address');
      if (addrEl) addrEl.innerText = data.address;
    }
  });

  db.ref('settings/content').on('value', snap => {
    const data = snap.val() || {};
    if (data.bannerText) {
      const bannerSpan = document.querySelector('.pwa-banner span');
      if (bannerSpan) bannerSpan.innerHTML = `🎉 ${data.bannerText}`;
    }
    if (data.heroHeadline) {
      const parts = data.heroHeadline.split(' ');
      const line1El = document.getElementById('hero-line1');
      const line2El = document.getElementById('hero-line2');
      if (line1El) line1El.innerText = parts[0] || 'TASTE THE';
      if (line2El && parts[1]) line2El.innerText = parts.slice(1).join(' ') || 'OBSESSION';
    }
    if (data.heroSub) {
      const subEl = document.getElementById('hero-sub-text');
      if (subEl) subEl.innerHTML = data.heroSub;
    }
    if (data.heroBadge) {
      const badgeEl = document.getElementById('hero-badge-text');
      if (badgeEl) badgeEl.innerText = data.heroBadge;
    }
  });

  db.ref('settings/images').on('value', snap => {
    const imgs = snap.val() || {};
    const heroImg = document.getElementById('hero-image');
    if (heroImg && imgs.hero) heroImg.src = imgs.hero;
    const gallery1 = document.querySelector('#gallery-img1 img');
    if (gallery1 && imgs.gallery1) gallery1.src = imgs.gallery1;
    const gallery2 = document.querySelector('#gallery-img2 img');
    if (gallery2 && imgs.gallery2) gallery2.src = imgs.gallery2;
    const gallery3 = document.querySelector('#gallery-img3 img');
    if (gallery3 && imgs.gallery3) gallery3.src = imgs.gallery3;
    const gallery4 = document.querySelector('#gallery-img4 img');
    if (gallery4 && imgs.gallery4) gallery4.src = imgs.gallery4;
    const comboImgs = document.querySelectorAll('.combo-card img');
    if (comboImgs.length >= 1 && imgs.combo1) comboImgs[0].src = imgs.combo1;
    if (comboImgs.length >= 2 && imgs.combo2) comboImgs[1].src = imgs.combo2;
    if (comboImgs.length >= 3 && imgs.combo3) comboImgs[2].src = imgs.combo3;
  });
}

function initScrollGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.3 });
  items.forEach(item => observer.observe(item));
}

function loadCombos() {
  const container = document.getElementById('combos-grid');
  if (!container) return;
  container.innerHTML = `
    <div class="combo-card"><img src="https://via.placeholder.com/400x200?text=Zinger+Combo" alt="Zinger Combo"><h3>Zinger Meal</h3><p>Zinger Burger + Fries + Cola</p><div class="combo-price">Rs. 550</div></div>
    <div class="combo-card"><img src="https://via.placeholder.com/400x200?text=Shawarma+Combo" alt="Shawarma Combo"><h3>Shawarma Feast</h3><p>2 Shawarmas + Fries + Drink</p><div class="combo-price">Rs. 650</div></div>
    <div class="combo-card"><img src="https://via.placeholder.com/400x200?text=Family+Combo" alt="Family Combo"><h3>Family Bucket</h3><p>4 Burgers + 2 Fries + 1.5L Cola</p><div class="combo-price">Rs. 1250</div></div>
  `;
}

// ─── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initParallax();
  renderMenu('all');
  renderDeals();
  initMenuTabs();
  triggerRevealAnimations();
  initPWA();
  updateCartUI();
  loadBrandingFromFirebase();
  initScrollGallery();
  loadCombos();

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

// Exports for other pages
window.TP = { cart, addToCart, saveCart, menuData, showToast, db, auth };
document.addEventListener('click', (e) => {
  if (e.target.id === 'item-modal-overlay') closeItemModal();
  if (e.target.id === 'pwa-popup-overlay') closePWAPopup();
});
