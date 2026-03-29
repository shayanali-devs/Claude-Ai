// ============================================================
//  TEMPURA POTATO — app.js (FULLY FIXED)
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCD9Xm9Etzxg5Avy9n4sHP-SW0Ei-ZTcHA",
  authDomain: "tempura-potato-deep.firebaseapp.com",
  databaseURL: "https://tempura-potato-deep-default-rtdb.firebaseio.com",
  projectId: "tempura-potato-deep",
  storageBucket: "tempura-potato-deep.firebasestorage.app",
  messagingSenderId: "516857155009",
  appId: "1:516857155009:web:c5ed7f3bac91d2fc127340",
};

let db, auth;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  auth = firebase.auth();
  console.log("Firebase connected");
} catch(e) { console.warn('Firebase init error:', e.message); }

// ─── DEFAULT MENU (with working image placeholders) ─────────
const defaultMenuData = [
  { id:'b1', name:'Grill Burger', cat:'burgers', price:320, emoji:'🍔', desc:'Flame-grilled patty with fresh veggies', imageUrl:'https://picsum.photos/id/106/400/300' },
  { id:'b2', name:'Zinger Burger', cat:'burgers', price:350, emoji:'🍔', desc:'Crispy zinger patty, special sauce', imageUrl:'https://picsum.photos/id/108/400/300' },
  { id:'b3', name:'Zinger Twister', cat:'burgers', price:380, emoji:'🌯', desc:'Crispy chicken in tortilla', imageUrl:'https://picsum.photos/id/127/400/300' },
  { id:'w1', name:'Chicken Bhayari Roll', cat:'wraps', price:300, emoji:'🫔', desc:'Classic chicken bhayari', imageUrl:'https://picsum.photos/id/128/400/300' },
  { id:'w2', name:'Seekh Kabab Roll', cat:'wraps', price:250, emoji:'🫔', desc:'Juicy seekh kababs', imageUrl:'https://picsum.photos/id/129/400/300' },
  { id:'w3', name:'Mala Boti Wrap', cat:'wraps', price:450, emoji:'🌯', desc:'Spicy mala boti with fries', imageUrl:'https://picsum.photos/id/130/400/300' },
  { id:'w4', name:'Zinger Wrap', cat:'wraps', price:350, emoji:'🌯', desc:'Zinger patty wrap', imageUrl:'https://picsum.photos/id/131/400/300' },
  { id:'s1', name:'Plane Fries', cat:'sides', price:120, emoji:'🍟', desc:'Golden crispy fries', imageUrl:'https://picsum.photos/id/132/400/300' },
  { id:'s2', name:'Loaded Fries', cat:'sides', price:180, emoji:'🍟', desc:'Cheese & toppings', imageUrl:'https://picsum.photos/id/133/400/300' },
  { id:'s3', name:'1 Litre Cola', cat:'sides', price:120, emoji:'🥤', desc:'Chilled soft drink', imageUrl:'https://picsum.photos/id/134/400/300' },
  { id:'d1', name:'Deal 1', cat:'deals', price:600, emoji:'🎁', desc:'2 Zinger Burgers + 2 Colas', includes:['2 Zinger','2 Cola'], imageUrl:'https://picsum.photos/id/135/400/300' },
  { id:'d2', name:'Deal 2', cat:'deals', price:420, emoji:'🎁', desc:'2 Twisters + Fries', includes:['2 Twisters','Fries'], imageUrl:'https://picsum.photos/id/136/400/300' },
];

let menuData = [...defaultMenuData];
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
  if (countEl) countEl.textContent = total;
  const floatEl = document.getElementById('cart-float');
  if (floatEl) total > 0 ? floatEl.classList.add('show') : floatEl.classList.remove('show');
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
  const modalImg = document.getElementById('modal-img');
  const modalEmoji = document.getElementById('modal-emoji');
  if (item.imageUrl && item.imageUrl.trim() !== '') {
    modalImg.src = item.imageUrl;
    modalImg.style.display = 'block';
    modalEmoji.style.display = 'none';
  } else {
    modalImg.style.display = 'none';
    modalEmoji.style.display = 'block';
    modalEmoji.textContent = item.emoji || '🍔';
  }
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
  grid.innerHTML = items.map(item => {
    const imgHtml = item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex';">` : '';
    return `
    <div class="menu-card reveal" onclick="openItemModal(${JSON.stringify(item).replace(/"/g,"'")})">
      <div class="menu-card-img">${imgHtml}<div class="emoji-fallback" style="${imgHtml?'display:none':''}">${item.emoji || '🍔'}</div></div>
      <div class="menu-card-body">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer">
          <div class="menu-card-price">Rs. ${item.price}</div>
          <button class="menu-card-add" onclick="event.stopPropagation();addToCart(${JSON.stringify(item).replace(/"/g,"'")})">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
  triggerRevealAnimations();
}

function renderDeals() {
  const grid = document.getElementById('deals-grid');
  if (!grid) return;
  const deals = menuData.filter(i => i.cat === 'deals');
  grid.innerHTML = deals.map(deal => {
    const imgHtml = deal.imageUrl ? `<img src="${deal.imageUrl}" alt="${deal.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex';">` : '';
    return `
    <div class="deal-card reveal" onclick="openItemModal(${JSON.stringify(deal).replace(/"/g,"'")})">
      <div class="deal-badge">DEAL</div>
      <div class="deal-card-img">${imgHtml}<div class="emoji-fallback" style="${imgHtml?'display:none':''}">${deal.emoji || '🎁'}</div></div>
      <div class="deal-card-body">
        <div class="deal-name">${deal.name}</div>
        <div class="deal-includes">${(deal.includes||[]).map(i=>`✦ ${i}`).join('<br/>')}</div>
        <div class="deal-footer">
          <div class="deal-price">Rs. ${deal.price}</div>
          <button class="btn-primary" style="padding:10px 20px;font-size:13px" onclick="event.stopPropagation();addToCart(${JSON.stringify(deal).replace(/"/g,"'")})">Add</button>
        </div>
      </div>
    </div>`;
  }).join('');
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
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
  hamburger?.addEventListener('click', () => mobileMenu?.classList.toggle('open'));
}
window.closeMobileMenu = () => document.getElementById('mobile-menu')?.classList.remove('open');

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

function triggerRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.gallery-item').forEach(el => observer.observe(el));
}

let deferredPrompt = null;
function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => document.getElementById('pwa-banner')?.classList.add('show'), 3000);
    if (!localStorage.getItem('tp_pwa_shown')) {
      setTimeout(() => { document.getElementById('pwa-popup-overlay')?.classList.add('show'); localStorage.setItem('tp_pwa_shown', '1'); }, 8000);
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
      document.getElementById('pwa-popup-manual').style.display = 'block';
      document.getElementById('pwa-popup-overlay')?.classList.add('show');
    }
  }
  installBtn?.addEventListener('click', triggerInstall);
  popupInstall?.addEventListener('click', triggerInstall);
  document.getElementById('pwa-banner-close')?.addEventListener('click', () => document.getElementById('pwa-banner')?.classList.remove('show'));
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(console.warn);
}
window.closePWAPopup = () => document.getElementById('pwa-popup-overlay')?.classList.remove('show');

// LIVE REBRANDING & IMAGES
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
    if (data.phone) { const p = document.getElementById('contact-phone'); if(p) p.innerText = data.phone; }
    if (data.address) { const a = document.getElementById('contact-address'); if(a) a.innerText = data.address; }
  });
  db.ref('settings/content').on('value', snap => {
    const data = snap.val() || {};
    if (data.heroHeadline) {
      const parts = data.heroHeadline.split(' ');
      if (document.getElementById('hero-line1')) document.getElementById('hero-line1').innerText = parts[0] || 'TASTE THE';
      if (document.getElementById('hero-line2') && parts[1]) document.getElementById('hero-line2').innerText = parts.slice(1).join(' ') || 'OBSESSION';
    }
    if (data.heroSub && document.getElementById('hero-sub-text')) document.getElementById('hero-sub-text').innerHTML = data.heroSub;
    if (data.heroBadge && document.getElementById('hero-badge-text')) document.getElementById('hero-badge-text').innerText = data.heroBadge;
  });
  db.ref('settings/images').on('value', snap => {
    const imgs = snap.val() || {};
    if (imgs.hero && document.getElementById('hero-image')) document.getElementById('hero-image').src = imgs.hero;
    const g1 = document.querySelector('#gallery-img1 img'); if(g1 && imgs.gallery1) g1.src = imgs.gallery1;
    const g2 = document.querySelector('#gallery-img2 img'); if(g2 && imgs.gallery2) g2.src = imgs.gallery2;
    const g3 = document.querySelector('#gallery-img3 img'); if(g3 && imgs.gallery3) g3.src = imgs.gallery3;
    const g4 = document.querySelector('#gallery-img4 img'); if(g4 && imgs.gallery4) g4.src = imgs.gallery4;
    const comboImgs = document.querySelectorAll('.combo-card img');
    if (comboImgs[0] && imgs.combo1) comboImgs[0].src = imgs.combo1;
    if (comboImgs[1] && imgs.combo2) comboImgs[1].src = imgs.combo2;
    if (comboImgs[2] && imgs.combo3) comboImgs[2].src = imgs.combo3;
  });
}

function initScrollGallery() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.3 });
  document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
}

function loadCombos() {
  const container = document.getElementById('combos-grid');
  if (!container) return;
  container.innerHTML = `
    <div class="combo-card"><img id="combo1-img" src="https://picsum.photos/id/135/400/200" alt="Zinger Combo" onerror="this.style.display='none'"><h3>Zinger Meal</h3><p>Zinger Burger + Fries + Cola</p><div class="combo-price">Rs. 550</div></div>
    <div class="combo-card"><img id="combo2-img" src="https://picsum.photos/id/136/400/200" alt="Shawarma Combo"><h3>Shawarma Feast</h3><p>2 Shawarmas + Fries + Drink</p><div class="combo-price">Rs. 650</div></div>
    <div class="combo-card"><img id="combo3-img" src="https://picsum.photos/id/137/400/200" alt="Family Combo"><h3>Family Bucket</h3><p>4 Burgers + 2 Fries + 1.5L Cola</p><div class="combo-price">Rs. 1250</div></div>
  `;
}

// Load menu from Firebase – FIXED flickering
function loadMenuFromFirebase() {
  if (!db) {
    renderMenu('all');
    renderDeals();
    return;
  }
  // First, seed default menu if empty
  db.ref('menu').once('value', snap => {
    if (!snap.val()) {
      const updates = {};
      defaultMenuData.forEach(item => { updates[`menu/${item.id}`] = item; });
      db.ref().update(updates).then(() => console.log("Default menu seeded"));
    }
  });
  // Listen for changes
  db.ref('menu').on('value', snap => {
    const fbMenu = snap.val();
    if (fbMenu && Object.keys(fbMenu).length > 0) {
      menuData = Object.values(fbMenu);
    } else {
      menuData = [...defaultMenuData];
    }
    renderMenu('all');
    renderDeals();
  });
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initMenuTabs();
  triggerRevealAnimations();
  initPWA();
  updateCartUI();
  loadBrandingFromFirebase();
  initScrollGallery();
  loadCombos();
  loadMenuFromFirebase();
});
document.addEventListener('click', (e) => {
  if (e.target.id === 'item-modal-overlay') closeItemModal();
  if (e.target.id === 'pwa-popup-overlay') closePWAPopup();
});

window.TP = { cart, addToCart, saveCart, menuData, showToast, db, auth };
