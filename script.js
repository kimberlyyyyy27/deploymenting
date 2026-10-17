const firebaseConfig = {
  apiKey: "AIzaSyBORVA6Mb_l24POsHmQscEO8I0bgyE2MWs",
  authDomain: "rewear-marketplace-c17d8.firebaseapp.com",
  projectId: "rewear-marketplace-c17d8",
  storageBucket: "rewear-marketplace-c17d8.firebasestorage.app",
  messagingSenderId: "838631734380",
  appId: "1:838631734380:web:0dbff2b8bacacc0fb9ac49"
};

const firebaseApp = typeof firebase !== 'undefined' ? firebase.initializeApp(firebaseConfig) : null;
const firebaseAuth = firebaseApp ? firebase.auth() : null;
const firebaseAuthErrorMessage = (error) => ({
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account was found for this email.',
  'auth/wrong-password': 'The email or password is incorrect.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/email-already-in-use': 'This email is already registered. Please sign in.',
  'auth/weak-password': 'Use a password with at least 6 characters.',
  'auth/operation-not-allowed': 'Enable Email/Password in Firebase Authentication settings.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your internet connection.'
}[error?.code] || error?.message || 'Authentication failed. Please try again.');
const hasFirebaseAdminClaim = async (user) => {
  try {
    const token = await user.getIdTokenResult(true);
    return token.claims.admin === true;
  } catch (error) {
    console.error('Could not verify Firebase admin claim:', error);
    return false;
  }
};

const signInWithGoogle = async () => {
  if (!firebaseApp || !firebaseAuth) {
    showToast('Firebase belum dikonfigurasi. Masukkan project Firebase yang valid untuk Google login.');
    return;
  }

  if (firebaseConfig.apiKey.includes('YOUR_') || firebaseConfig.projectId.includes('YOUR_')) {
    showToast('Google login belum aktif karena Firebase config masih placeholder. Ganti nilai config dengan project asli Anda.');
    return;
  }

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const result = await firebaseAuth.signInWithPopup(provider);
    const user = result.user;
    const isAdmin = await hasFirebaseAdminClaim(user);

    setUser({
      name: user.displayName || user.email?.split('@')[0] || 'Google User',
      email: user.email || user.uid,
      role: isAdmin ? 'admin' : 'buyer',
      authProvider: 'google',
      photoURL: user.photoURL || ''
    });

    showToast('Berhasil masuk dengan Google');
  } catch (error) {
    console.error('Google login failed:', error);
    const message = error?.code === 'auth/popup-closed-by-user'
      ? 'Login Google dibatalkan.'
      : (error?.message || 'Login Google gagal.');
    showToast(message);
  }
};

const baseProducts = [
  { id: 1, brand: 'Massimo Dutti', name: 'Wool Trench Coat', category: 'Outer', price: 680000, originalPrice: 2800000, size: 'M', condition: 'Like New', location: 'Jakarta Selatan', viewed: 12, ribbon: 'Terlaris', image: 'https://assets.preloved.co.id/products/1222753/9ce25ee7-ccf9-41db-a6df-ce46f20a9287.jpg' },
  { id: 2, brand: '& Other Stories', name: 'Ribbed Knit Cardigan', category: 'Atasan', price: 340000, originalPrice: 1190000, size: 'S', condition: 'Like New', location: 'Bandung', viewed: 28, ribbon: 'Populer', image: 'https://di2ponv0v5otw.cloudfront.net/posts/2026/09/01/6a97a328fa43c1da53c748d6/s_6a97a329ebb1a50d35c6b9a4.jpg' },
  { id: 3, brand: 'Sandro', name: 'Silk Midi Dress', category: 'Dress', price: 890000, originalPrice: 3400000, size: 'XS', condition: 'Very Good', location: 'Surabaya', viewed: 5, image: 'https://di2ponv0v5otw.cloudfront.net/posts/2024/03/20/65fb2054fb7304c3011632df/l_65fb206c02760b4bf41973cf.jpg' },
  { id: 4, brand: 'A.P.C.', name: 'Leather Bucket Bag', category: 'Tas', price: 1120000, originalPrice: 4200000, size: 'One Size', condition: 'Very Good', location: 'Jakarta Pusat', viewed: 3, ribbon: 'Hot Offer', image: 'https://static.mercdn.net/item/detail/orig/photos/m44840443427_1.jpg?1776395786' },
  { id: 5, brand: 'COS', name: 'Linen Wide-Leg Pants', category: 'Bawahan', price: 420000, originalPrice: 1350000, size: 'L', condition: 'Good', location: 'Yogyakarta', viewed: 9, image: 'https://di2ponv0v5otw.cloudfront.net/posts/2026/08/24/6a8cde24253621ae54424419/s_6a8cde264985e889561eeff0.jpeg' },
  { id: 6, brand: 'Uniqlo', name: 'Cashmere Turtleneck', category: 'Atasan', price: 155000, originalPrice: 890000, size: 'M', condition: 'Like New', location: 'Medan', viewed: 17, ribbon: 'Baru', image: 'https://i.ebayimg.com/images/g/LkgAAOSw9JllSnlr/s-l1600.webp' },
  { id: 7, brand: "Levi's", name: 'Denim Jacket', category: 'Outer', price: 450000, originalPrice: 1650000, size: 'M', condition: 'Good', location: 'Bandung', viewed: 22, ribbon: 'Terlaris', image: 'https://static.mercdn.net/item/detail/orig/photos/m47100205242_1.jpg?1779710117' },
  { id: 8, brand: 'Zara', name: 'Floral Wrap Dress', category: 'Dress', price: 290000, originalPrice: 980000, size: 'S', condition: 'Very Good', location: 'Semarang', viewed: 14, image: 'https://i.ebayimg.com/images/g/pcwAAeSw2Adqaj4R/s-l1600.jpg' },
  { id: 9, brand: 'H&M', name: 'Striped Linen Shirt', category: 'Atasan', price: 180000, originalPrice: 590000, size: 'L', condition: 'Like New', location: 'Jakarta Barat', viewed: 31, ribbon: 'Murah', image: 'https://i.ebayimg.com/images/g/dLgAAOSw5j9ncIxL/s-l1600.webp' },
  { id: 10, brand: 'Toteme', name: 'Black Leather Tote Bag', category: 'Tas', price: 380000, originalPrice: 1450000, size: 'One Size', condition: 'Like New', location: 'Denpasar', viewed: 7, image: 'https://i.ebayimg.com/images/g/VeYAAeSwhoBqnsnU/s-l1600.webp' },
];
let products = [...baseProducts];
const storeName = 'Default preloved store';
const load = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getProfileName = (user) => String(user?.displayName || user?.username || user?.name || user?.email?.split('@')[0] || 'REWEAR Member').trim();
const loadCurrentUser = () => { const user = load('rewear-user', null); if (user?.role === 'admin') { if (user.authProvider === 'local') { localStorage.removeItem('rewear-user'); return null; } user.role = 'buyer'; } if (user && user.name !== getProfileName(user)) user.name = getProfileName(user); if (user) save('rewear-user', user); return user; };
const $ = (selector) => document.querySelector(selector);
const state = { user: loadCurrentUser(), cart: [], orders: [], favorites: [], chat: [], modal: null, selectedProduct: null, selectedStore: null, activeRoom: 'helper', mobileChatView: 'inbox', authMode: 'login', authIntent: 'buyer', sellerPage: 'dashboard', editingSellerProduct: null, accountEditing: false, mobileMenuOpen: false, mobileMenuReturnFocus: null, category: 'Semua', condition: 'Semua Kondisi', search: '', sort: 'Terbaru' };
const accountKey = () => state.user ? state.user.email.toLowerCase() : 'guest';
const hydrateAccount = () => { const key = accountKey(); state.cart = load(`rewear-cart-${key}`, []); state.orders = load(`rewear-orders-${key}`, []); state.favorites = load(`rewear-favorites-${key}`, []); state.chat = load(`rewear-chat-${key}`, [{ room: 'helper', name: 'Rewear Helper', messages: [{ sender: 'other', text: 'Halo! Ada yang bisa kami bantu?' }] }, { room: 'store', name: storeName, messages: [{ sender: 'other', text: `Halo! Selamat datang di ${storeName}. Ada yang ingin ditanyakan?` }] }]); };
const formatPrice = (value) => `Rp${value.toLocaleString('id-ID')}`;
const discount = (product) => Math.round((1 - product.price / product.originalPrice) * 100);
const syncFilterButtons = () => {
  document.querySelectorAll('.category-pill').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === state.category);
  });
  document.querySelectorAll('.condition-pill').forEach((button) => {
    button.classList.toggle('active', button.dataset.condition === state.condition);
  });
};
const filtered = () => products.filter((product) => state.category === 'Semua' || product.category === state.category).filter((product) => state.condition === 'Semua Kondisi' || product.condition === state.condition).filter((product) => `${product.brand} ${product.name} ${product.category} ${product.sellerName || storeName}`.toLowerCase().includes(state.search.toLowerCase())).sort((a, b) => state.sort === 'Harga Terendah' ? a.price - b.price : state.sort === 'Harga Tertinggi' ? b.price - a.price : (Number(b.createdAt) || Number(b.id) || 0) - (Number(a.createdAt) || Number(a.id) || 0));
const requireLogin = (action) => {
  if (!state.user) {
    state.modal = 'auth';
    state.authMode = 'login';
    renderModal();
    return;
  }
  action();
};
const setUser = (user) => { state.user = { ...user, name: getProfileName(user) }; save('rewear-user', state.user); hydrateAccount(); state.modal = null; render(); renderModal(); };
const updateAuthHeader = () => { const loginButton = $('#login-button'); const registerButton = $('#register-button'); if (!loginButton || !registerButton) return; if (state.user) { loginButton.textContent = getProfileName(state.user); loginButton.classList.add('user-name'); loginButton.disabled = false; loginButton.onclick = () => openAccount(); registerButton.hidden = true; } else { loginButton.textContent = 'Masuk'; loginButton.classList.remove('user-name'); loginButton.disabled = false; loginButton.onclick = () => openAuth('login'); registerButton.hidden = false; } };
const renderMobileMenu = () => {
  const name = $('#mobile-profile-name');
  const links = $('#mobile-menu-links');
  if (!name || !links) return;
  name.textContent = state.user ? getProfileName(state.user) : 'Welcome to REWEAR';
  links.replaceChildren();
  const actions = state.user ? [{ action: 'profile', icon: '●', label: 'My Account / Profile' }, { action: 'browse', icon: '⌂', label: 'Home / Browse Products' }, { action: 'search', icon: '⌕', label: 'Search' }, { action: 'categories', icon: '▦', label: 'Categories' }, { action: 'flash', icon: '％', label: 'Flash Sale' }] : [{ action: 'browse', icon: '⌂', label: 'Home / Browse Products' }, { action: 'search', icon: '⌕', label: 'Search' }, { action: 'categories', icon: '▦', label: 'Categories' }, { action: 'flash', icon: '％', label: 'Flash Sale' }];
  if (state.user) {
    actions.push({ action: 'orders', icon: '▤', label: 'My Orders' });
    if (state.user.role === 'seller') actions.push({ action: 'seller', icon: '◇', label: 'Seller Center' });
    actions.push({ divider: true }, { action: 'logout', icon: '⇥', label: 'Logout' });
  } else {
    actions.push({ divider: true }, { action: 'login', icon: '↪', label: 'Login' }, { action: 'register', icon: '+', label: 'Register' });
  }
  actions.forEach((item) => {
    if (item.divider) {
      const divider = document.createElement('div');
      divider.className = 'mobile-menu-divider';
      divider.setAttribute('role', 'separator');
      links.appendChild(divider);
      return;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mobileAction = item.action;
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = item.icon;
    button.append(icon, document.createTextNode(item.label));
    links.appendChild(button);
  });
};
const closeMobileMenu = (restoreFocus = true) => {
  if (!state.mobileMenuOpen) return;
  state.mobileMenuOpen = false;
  $('#mobile-menu-backdrop').classList.add('hidden');
  $('#mobile-menu-backdrop').classList.remove('open');
  $('#mobile-menu-button').setAttribute('aria-expanded', 'false');
  $('body').classList.remove('mobile-menu-open');
  if (restoreFocus && state.mobileMenuReturnFocus?.isConnected) state.mobileMenuReturnFocus.focus();
};
const openMobileMenu = () => {
  renderMobileMenu();
  state.mobileMenuReturnFocus = $('#mobile-menu-button');
  state.mobileMenuOpen = true;
  $('#mobile-menu-backdrop').classList.remove('hidden');
  $('#mobile-menu-backdrop').classList.add('open');
  $('#mobile-menu-button').setAttribute('aria-expanded', 'true');
  $('body').classList.add('mobile-menu-open');
  $('#mobile-menu-close').focus();
};
const bindMobileMenu = () => {
  const menuButton = $('#mobile-menu-button');
  const backdrop = $('#mobile-menu-backdrop');
  const closeButton = $('#mobile-menu-close');
  const menu = $('#mobile-menu');
  const links = $('#mobile-menu-links');
  menuButton.onclick = openMobileMenu;
  closeButton.onclick = () => closeMobileMenu();
  backdrop.onclick = (event) => { if (event.target === backdrop) closeMobileMenu(); };
  links.onclick = (event) => {
    const button = event.target.closest('[data-mobile-action]');
    if (!button) return;
    const action = button.dataset.mobileAction;
    closeMobileMenu(false);
    if (action === 'browse') setMobilePage('products');
    if (action === 'flash') setMobilePage('flash');
    if (action === 'search') { $('#search').scrollIntoView({ behavior: 'smooth', block: 'center' }); $('#search').focus(); }
    if (action === 'categories') { setMobilePage('products'); document.querySelector('#category-list').scrollIntoView({ behavior: 'auto', block: 'start' }); }
    if (action === 'profile') openAccount();
    if (action === 'orders') { state.modal = 'orders'; renderModal(); }
    if (action === 'cart') { state.modal = 'cart'; renderModal(); }
    if (action === 'seller') openSellerCenter();
    if (action === 'login') openAuth('login');
    if (action === 'register') openAuth('register');
    if (action === 'logout') logout();
  };
  document.addEventListener('keydown', (event) => {
    if (!state.mobileMenuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMobileMenu(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...menu.querySelectorAll('button:not([disabled])')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
};
let toastTimer = null;
let activeToastContext = null;
const toastContextForCurrentView = () => {
  const page = [...document.body.classList].find((name) => name.startsWith('mobile-page-')) || 'desktop';
  const detail = state.modal === 'seller-center' ? state.sellerPage : state.modal === 'chat' ? state.mobileChatView : '';
  return `${page}:${state.modal || ''}:${detail}`;
};
const clearToast = () => {
  if (toastTimer !== null) window.clearTimeout(toastTimer);
  toastTimer = null;
  activeToastContext = null;
  document.querySelectorAll('.toast').forEach((toast) => toast.remove());
};
const showToast = (message) => {
  const context = toastContextForCurrentView();
  clearToast();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  activeToastContext = context;
  toastTimer = window.setTimeout(() => {
    if (activeToastContext !== context) return;
    toast.remove();
    activeToastContext = null;
    toastTimer = null;
  }, 2400);
};
const addToCart = (product) => requireLogin(() => { if (state.cart.some((entry) => entry.product.id === product.id)) { showToast('Item ini sudah ada di keranjang'); return; } state.cart.push({ product, quantity: 1 }); save(`rewear-cart-${accountKey()}`, state.cart); state.modal = null; render(); showToast(`${product.name} masuk ke keranjang`); });
const updateCart = () => save(`rewear-cart-${accountKey()}`, state.cart);
const removeFromCart = (productId) => { state.cart = state.cart.filter((entry) => entry.product.id !== productId); updateCart(); renderModal(); };
const shippingRates = { regular: 15000, express: 25000, cargo: 40000 };
const checkout = () => {
  if (!state.cart.length) return;
  state.paymentStage = 'form';
  state.paymentDraft = { recipient: state.user?.name || '', phone: '', address: '', shippingMethod: 'regular', paymentMethod: 'Kartu debit/kredit', bank: 'BCA' };
  state.paymentBusy = false;
  state.modal = 'payment';
  if (window.matchMedia('(max-width: 680px)').matches) setMobilePage('payment');
  renderModal();
};
const completePayment = (form) => {
  if (state.paymentBusy) return;
  const data = new FormData(form);
  const method = String(data.get('payment-method') || 'Kartu debit/kredit');
  const recipient = String(data.get('recipient') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const address = String(data.get('address') || '').trim();
  if (!recipient || !phone || !address) { showToast('Lengkapi nama penerima, nomor telepon, dan alamat.'); return; }
  if (!/^[0-9+()\\s-]{8,20}$/.test(phone)) { showToast('Masukkan nomor telepon yang valid.'); form.querySelector('[name="phone"]').focus(); return; }
  if (method === 'Kartu debit/kredit') {
    const holder = String(data.get('card-holder') || '').trim();
    const number = String(data.get('card-number') || '').replace(/\\s/g, '');
    const expiry = String(data.get('expiry') || '').trim();
    const cvv = String(data.get('cvv') || '').trim();
    if (!holder || !/^\d{13,19}$/.test(number) || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvv)) {
      showToast('Periksa nama pemegang kartu, nomor kartu, masa berlaku MM/YY, dan CVV.'); return;
    }
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    if (year < now.getFullYear() % 100 || (year === now.getFullYear() % 100 && month < now.getMonth() + 1)) { showToast('Kartu sudah kedaluwarsa.'); return; }
  }
  state.paymentBusy = true;
  const submit = form.querySelector('#payment-submit');
  if (submit) { submit.disabled = true; submit.textContent = 'Memproses…'; }
  // Card credentials are used only for client-side validation and are never persisted.
  const items = state.cart.map((item) => ({ product: { ...item.product }, quantity: Math.max(1, Number(item.quantity) || 1) }));
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const shippingMethod = String(data.get('shipping-method') || 'regular');
  const shippingCost = shippingRates[shippingMethod] || shippingRates.regular;
  const total = subtotal + shippingCost;
  const id = `RW-${Date.now().toString(36).toUpperCase()}`;
  const order = {
    id, items, subtotal, shippingCost, discount: 0, total, recipient, phone, address,
    paymentMethod: method, bank: method === 'Transfer bank' ? String(data.get('bank') || 'BCA') : '',
    shippingMethod, createdAt: new Date().toISOString(),
    paymentStatus: method === 'COD' ? 'Bayar di tempat' : method === 'Transfer bank' ? 'Menunggu pembayaran' : 'Memproses pembayaran',
    orderStatus: method === 'COD' ? 'Menunggu pengiriman' : method === 'Transfer bank' ? 'Menunggu pembayaran' : 'Memproses pembayaran',
    status: method === 'COD' ? 'New' : method === 'Transfer bank' ? 'Awaiting Payment' : 'Processing',
    sellerStatuses: {}
  };
  window.setTimeout(() => {
    if (method === 'Kartu debit/kredit') {
      // Explicitly a local prototype simulation; no real charge is made.
      order.paymentStatus = 'Sudah dibayar';
      order.orderStatus = 'Menunggu pengiriman';
      order.status = 'New';
    }
    if (method === 'Transfer bank') {
      order.virtualAccount = ({ BCA: '39012', BNI: '88018', BRI: '26215', Mandiri: '70012' }[order.bank] || '39012') + String(Date.now()).slice(-10);
    }
    state.orders.unshift(order);
    save(`rewear-orders-${accountKey()}`, state.orders);
    const sellerGroups = new Map();
    items.forEach((item) => { const sellerId = item.product.sellerId; if (sellerId) sellerGroups.set(sellerId, [...(sellerGroups.get(sellerId) || []), item]); });
    sellerGroups.forEach((sellerItems, sellerId) => {
      const key = `rewear-seller-${sellerId}-orders`; const list = load(key, []);
      const sellerSubtotal = sellerItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
      list.unshift({ id, buyerOrderId: id, sellerId, buyerKey: accountKey(), buyer: state.user?.name || state.user?.email || 'Buyer', buyerEmail: state.user?.email || '', recipient, phone, address, items: sellerItems, subtotal: sellerSubtotal, shippingCost: Math.round(shippingCost * sellerSubtotal / (subtotal || 1)), amount: sellerSubtotal + Math.round(shippingCost * sellerSubtotal / (subtotal || 1)), shipping: shippingMethod, shippingMethod, status: order.status, createdAt: Date.now() });
      save(key, list);
    });
    state.cart = []; updateCart(); state.selectedOrder = order;
    state.paymentStage = method === 'Transfer bank' ? 'bank-instructions' : 'confirmation';
    state.paymentBusy = false;
    render(); renderModal();
    if (method === 'Kartu debit/kredit') showToast('Simulasi pembayaran berhasil. Tidak ada kartu yang ditagih.');
    else if (method === 'COD') showToast('Pesanan COD berhasil dibuat.');
  }, 650);
};
const openProduct = (product) => { state.selectedProduct = product; state.modal = 'product'; renderModal(); };
const openStore = (name) => { state.selectedStore = name; state.modal = 'store'; renderModal(); };
function openAuth(mode) { state.authMode = mode; state.authIntent = mode === 'seller' || mode === 'seller-register' ? 'seller' : 'buyer'; state.modal = 'auth'; renderModal(); }
const openAccount = () => { state.accountTab = 'details'; state.accountEditing = false; state.modal = 'account'; renderModal(); };
const sendPasswordReset = async () => { if (!firebaseAuth || !state.user?.email) { showToast('Password reset is unavailable for this account.'); return; } try { await firebaseAuth.sendPasswordResetEmail(state.user.email); showToast('Password reset email sent.'); } catch (error) { console.error('Password reset failed:', error); showToast(firebaseAuthErrorMessage(error)); } };
const saveAccountInformation = async (form) => {
  const username = String(new FormData(form).get('username') || '').trim();
  if (!username || username.length > 50) {
    showToast('Username must be between 1 and 50 characters.');
    return;
  }

  const firebaseUser = firebaseAuth?.currentUser;
  if (!firebaseUser) {
    showToast('Sign in to your Firebase account before updating your username.');
    return;
  }

  try {
    await firebaseUser.updateProfile({ displayName: username });
    state.user = { ...state.user, displayName: username, name: username };
    save('rewear-user', state.user);
    state.accountEditing = false;
    render();
    renderModal();
    showToast('Username updated successfully.');
  } catch (error) {
    console.error('Could not update Firebase display name:', error);
    showToast(firebaseAuthErrorMessage(error));
  }
};
const logout = async () => { let signOutFailed = false; try { if (firebaseAuth) await firebaseAuth.signOut(); } catch (error) { signOutFailed = true; console.error('Firebase sign-out failed:', error); } state.user = null; localStorage.removeItem('rewear-user'); state.modal = null; state.selectedOrder = null; state.accountTab = 'details'; hydrateAccount(); render(); renderModal(); showToast(signOutFailed ? 'Local logout completed, but Firebase sign-out failed.' : 'Kamu sudah keluar'); };
const card = (product) => { const id = String(product.id); const favorite = state.favorites.some((item) => String(item) === id); return `<article class="product-card"><button class="product-image" data-product="${sellerEscape(id)}"><img src="${sellerEscape(product.image)}" alt="${sellerEscape(product.name)}"><span class="ribbon ${product.ribbon === 'Hot Offer' ? 'orange' : product.ribbon === 'Murah' ? 'sky' : ''}">${sellerEscape(product.ribbon || 'Baru')}</span><span class="discount">-${discount(product)}%</span></button><button class="heart ${favorite ? 'active' : ''}" data-favorite="${sellerEscape(id)}">${favorite ? '&#9829;' : '&#9825;'}</button><div class="product-info"><strong class="brand">${sellerEscape(product.brand)}</strong><h3>${sellerEscape(product.name)}</h3><button class="store-link" data-store="${sellerEscape(product.sellerName || storeName)}">Dijual oleh ${sellerEscape(product.sellerName || storeName)}</button><div class="price-row"><b>${formatPrice(product.price)}</b><del>${formatPrice(product.originalPrice)}</del></div><div class="meta">${sellerEscape(product.size)} <span>-</span> ${sellerEscape(product.condition)}</div><small>${sellerEscape(product.location)} 🏠︎ ${Number(product.viewed) || 0} Dilihat</small></div><button class="quick-add" data-add="${sellerEscape(id)}">+ Keranjang</button></article>`; };
const setMobilePage = (page, options = {}) => {
  const allowed = ['home', 'flash', 'products', 'chat', 'chatroom', 'profile', 'payment'];
  if (!allowed.includes(page)) page = 'home';
  const currentPage = allowed.find((name) => document.body.classList.contains(`mobile-page-${name}`)) || 'home';
  if (currentPage !== page) clearToast();
  document.body.classList.remove(...allowed.map((name) => `mobile-page-${name}`));
  document.body.classList.add(`mobile-page-${page}`);
  const nav = $('#mobile-bottom-nav');
  if (nav) nav.querySelectorAll('[data-bottom-action]').forEach((item) => {
    const action = item.dataset.bottomAction;
    item.classList.toggle('active', (page === 'home' && action === 'home') || (page === 'flash' && action === 'flash') || ((page === 'chat' || page === 'chatroom') && action === 'chat') || (page === 'profile' && action === 'me'));
  });
  if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'auto' });
};
function render() { hydrateAccount(); updateAuthHeader(); renderMobileMenu(); renderBottomNavigation(); syncFilterButtons(); products = [...baseProducts, ...sellerMarketplaceProducts()].filter((p) => !(window.adminHidden && window.adminHidden(p))); const list = filtered(); $('#product-count').textContent = `${list.length} produk ditemukan`; $('#products-grid').innerHTML = list.map(card).join(''); $('#flash-grid').innerHTML = (window.adminFlash ? window.adminFlash(products) : products.slice(0, 4)).map(card).join(''); bindCards(); }
function bindCards() { document.querySelectorAll('[data-product]').forEach((button) => button.onclick = () => openProduct(products.find((product) => String(product.id) === button.dataset.product))); document.querySelectorAll('[data-add]').forEach((button) => button.onclick = () => addToCart(products.find((product) => String(product.id) === button.dataset.add))); document.querySelectorAll('[data-store]').forEach((button) => button.onclick = (event) => { event.stopPropagation(); openStore(button.dataset.store); }); document.querySelectorAll('[data-favorite]').forEach((button) => button.onclick = () => requireLogin(() => { const id = button.dataset.favorite; state.favorites = state.favorites.includes(id) ? state.favorites.filter((item) => String(item) !== id) : [...state.favorites, id]; save(`rewear-favorites-${accountKey()}`, state.favorites); render(); })); }
function renderModal() { const modal = $('#modal'); const context = toastContextForCurrentView(); if (activeToastContext && activeToastContext !== context) clearToast(); if (!state.modal) { modal.innerHTML = ''; modal.className = 'modal-backdrop hidden'; return; } modal.className = 'modal-backdrop'; if (state.modal === 'auth') modal.innerHTML = authModal(); if (state.modal === 'product') modal.innerHTML = productModal(); if (state.modal === 'store') modal.innerHTML = storeModal(); if (state.modal === 'cart') modal.innerHTML = cartModal(); if (state.modal === 'payment') modal.innerHTML = paymentModal(); if (state.modal === 'order-detail') modal.innerHTML = orderDetailModal(); if (state.modal === 'orders') modal.innerHTML = ordersModal(); if (state.modal === 'account') modal.innerHTML = accountModal(); if (state.modal === 'chat') modal.innerHTML = chatModal(); if (state.modal === 'seller-center') modal.innerHTML = sellerCenter(); bindModal(); bindAccountControls(); bindPaymentControls(); bindSellerControls(); }
const closeModal = () => { const wasMobilePage = window.matchMedia('(max-width: 680px)').matches && (['chat','account','payment'].includes(state.modal) || document.body.classList.contains('mobile-page-payment')); state.modal = null; renderModal(); if (wasMobilePage) setMobilePage('home'); };
const authModal = () => { const sellerMode = state.authMode === 'seller';
const sellerRegister = state.authMode === 'seller-register';
const loginMode = state.authMode === 'login'; return `<div class="modal auth-modal"><button class="close" data-close>X</button><div class="auth-head"><b>RE<span class="circle-logo"></span>WEAR</b><div class="auth-tabs">
  <button class="${state.authMode === 'login' ? 'active' : ''}" data-auth="login">Masuk</button>
  <button class="${state.authMode === 'register' ? 'active' : ''}" data-auth="register">Daftar</button>
  <button class="${state.authMode === 'seller-register' ? 'active' : ''}" data-auth="seller-register">Daftar sebagai Seller</button>
</div></div><form id="auth-form"><h2>${sellerRegister ? 'Daftar sebagai Seller' : sellerMode ? 'Masuk sebagai Seller' : loginMode ? 'Selamat datang kembali' : 'Buat akun Rewear'}</h2>${sellerMode || sellerRegister ? '<p>Kelola produk, pesanan, dan toko kamu di Rewear.</p>' : ''}${state.authMode === 'register' || sellerRegister ? '<input name="name" placeholder="Nama lengkap" required>' : ''}<input name="email" type="text" placeholder="Username atau email" required><input name="password" type="password" placeholder="Password" required><button class="primary-button full">${sellerMode ? 'Masuk ke Seller Center' : state.authMode === 'login' ? 'Masuk' : 'Daftar'}</button>${sellerMode ? '<button type="button" class="google-button" data-auth="login">Masuk sebagai Pembeli</button>' : '<div class="or">atau</div><button type="button" class="google-button" data-google>Lanjut dengan Google</button>'}</form></div>`; };
const productModal = () => { const p = state.selectedProduct; const isOwnListing = p.sellerId && state.user && sellerOwnerId() === p.sellerId; const threads = p.sellerId && state.user && !isOwnListing ? sellerCollectionFor(p.sellerId, 'messages', []).filter((message) => message.buyerKey === accountKey() && String(message.productId) === String(p.sellerProductId)) : []; return `<div class="modal product-modal"><button class="close" data-close>X</button><div class="product-detail"><img src="${sellerEscape(p.image)}" alt="${sellerEscape(p.name)}"><div><span class="eyebrow">${sellerEscape(p.condition.toUpperCase())}</span><p class="brand">${sellerEscape(p.brand)}</p><h2>${sellerEscape(p.name)}</h2><button class="store-link" data-store="${sellerEscape(p.sellerName || storeName)}">Dijual oleh ${sellerEscape(p.sellerName || storeName)}</button><div class="detail-price">${formatPrice(p.price)} <del>${formatPrice(p.originalPrice)}</del></div><p>${sellerEscape(p.description || 'Kondisi sangat terawat, siap menemani gaya kamu berikutnya.')}</p><div class="detail-specs">Ukuran <b>${sellerEscape(p.size)}</b><br>Lokasi <b>${sellerEscape(p.location)}</b><br>Views <b>${Number(p.viewed) || 0}</b></div>${p.sellerId && !isOwnListing ? `<button type="button" class="google-button full" data-contact-seller="${sellerEscape(p.sellerId)}" data-contact-product="${sellerEscape(p.sellerProductId)}" data-contact-name="${sellerEscape(p.name)}">Tanya Seller</button>${threads.map((thread) => `<div class="seller-message">${(thread.conversation || []).map((message) => `<p><b>${message.sender === 'seller' ? 'Seller' : 'Kamu'}:</b> ${sellerEscape(message.text)}</p>`).join('')}</div>`).join('')}` : ''}<button class="primary-button full" data-detail-add="${sellerEscape(p.id)}">Tambah ke Keranjang</button></div></div></div>`; };
const storeModal = () => `<div class="modal store-modal"><button class="close" data-close>X</button><div class="store-header"><span class="eyebrow">TOKO</span><h2>${state.selectedStore}</h2><p>${products.length} produk tersedia</p></div><div class="store-product-grid">${products.map(card).join('')}</div></div>`;
const cartModal = () => `<div class="modal narrow"><button class="close" data-close>X</button><h2>Keranjang Kamu</h2><div class="modal-body">${state.cart.length ? `${state.cart.map((item) => `<div class="cart-item"><img src="${item.product.image}" alt="${item.product.name}"><span><b>${item.product.name}</b><small>${formatPrice(item.product.price)}</small><button class="cart-delete" data-cart-delete="${item.product.id}">Hapus</button></span></div>`).join('')}<button class="primary-button full" data-checkout>Checkout</button>` : '<p>Keranjang masih kosong.</p>'}</div></div>`;
const paymentModal = () => {
  const order = state.selectedOrder;
  const stage = state.paymentStage || 'form';
  const mobile = window.matchMedia('(max-width: 680px)').matches;
  if (stage === 'bank-instructions' && order) return `<div class="modal payment-modal payment-page-modal"><div class="payment-page-header"><button type="button" class="payment-back" data-payment-back aria-label="Kembali">←</button><h2>Instruksi Transfer</h2></div><p class="demo-note">DEMO — virtual account ini simulasi, bukan instruksi transfer bank sungguhan.</p><div class="payment-summary"><div><span>Nomor pesanan</span><b>${sellerEscape(order.id)}</b></div><div><span>Bank</span><b>${sellerEscape(order.bank)}</b></div><div><span>Virtual account demo</span><b id="virtual-account">${sellerEscape(order.virtualAccount)}</b></div><button type="button" class="google-button full" data-copy-va>Salin nomor virtual account</button><div><span>Total transfer</span><b>${formatPrice(order.total)}</b></div><div><span>Status pembayaran</span><b>${sellerEscape(order.paymentStatus)}</b></div></div><p>Untuk menguji alur prototipe, gunakan tombol simulasi di bawah. Tidak ada transfer nyata yang diperiksa.</p><button type="button" class="primary-button full" data-check-payment-status>Check payment status</button><button type="button" class="google-button full" data-demo-bank-paid>Simulasikan pembayaran berhasil</button><button type="button" class="google-button full" data-payment-finish>Lihat pesanan</button></div>`;
  if (stage === 'confirmation' && order) return `<div class="modal payment-modal payment-page-modal"><div class="payment-page-header"><button type="button" class="payment-back" data-payment-back aria-label="Kembali">←</button><h2>Pesanan dikonfirmasi</h2></div><p class="demo-note">Pembayaran kartu pada halaman ini hanya simulasi. Tidak ada tagihan nyata.</p><div class="payment-summary"><div><span>Nomor pesanan</span><b>${sellerEscape(order.id)}</b></div><div><span>Item</span><b>${order.items.reduce((n, i) => n + i.quantity, 0)} item</b></div><div><span>Total</span><b>${formatPrice(order.total)}</b></div><div><span>Metode pembayaran</span><b>${sellerEscape(order.paymentMethod)}</b></div><div><span>Status pembayaran</span><b>${sellerEscape(order.paymentStatus)}</b></div><div><span>Status pesanan</span><b>${sellerEscape(order.orderStatus)}</b></div><div><span>Penerima</span><b>${sellerEscape(order.recipient)}</b></div><div><span>Telepon</span><b>${sellerEscape(order.phone)}</b></div><div><span>Alamat</span><b>${sellerEscape(order.address)}</b></div></div><h3>Produk</h3>${order.items.map((item) => `<div class="order-item"><span>${sellerEscape(item.product.name)} × ${item.quantity}</span><b>${formatPrice(item.product.price * item.quantity)}</b></div>`).join('')}<button type="button" class="primary-button full" data-payment-finish>Lihat pesanan</button></div>`;
  const subtotal = state.cart.reduce((sum, item) => sum + item.product.price * (Number(item.quantity) || 1), 0);
  const shippingMethod = state.paymentDraft?.shippingMethod || 'regular';
  const shippingCost = shippingRates[shippingMethod] || shippingRates.regular;
  const total = subtotal + shippingCost;
  const method = state.paymentDraft?.paymentMethod || 'Kartu debit/kredit';
  return `<div class="modal payment-modal payment-page-modal"><div class="payment-page-header"><button type="button" class="payment-back" data-payment-back aria-label="Kembali">←</button><h2>Payment</h2></div><p class="checkout-step">1. Review pesanan · 2. Detail pengiriman · 3. Pembayaran · 4. Konfirmasi</p><div class="payment-summary"><div><span>Produk (${state.cart.reduce((n,i)=>n+(Number(i.quantity)||1),0)} item)</span><b>${formatPrice(subtotal)}</b></div>${state.cart.map((item) => `<div><span>${sellerEscape(item.product.name)} × ${Number(item.quantity)||1}</span><span>${formatPrice(item.product.price * (Number(item.quantity)||1))}</span></div>`).join('')}<div><span>Subtotal</span><b>${formatPrice(subtotal)}</b></div><div><span>Ongkir</span><b id="shipping-cost">${formatPrice(shippingCost)}</b></div><div><span>Total</span><b id="payment-total">${formatPrice(total)}</b></div></div><form class="payment-form" id="payment-form"><h3>Detail pengiriman</h3><label>Nama penerima<input name="recipient" autocomplete="name" placeholder="Nama lengkap" value="${sellerEscape(state.paymentDraft?.recipient || '')}" required></label><label>Nomor telepon<input name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="08xxxxxxxxxx" value="${sellerEscape(state.paymentDraft?.phone || '')}" required></label><label>Alamat pengiriman<textarea name="address" autocomplete="street-address" rows="3" placeholder="Alamat lengkap" required>${sellerEscape(state.paymentDraft?.address || '')}</textarea></label><label>Layanan pengiriman<select name="shipping-method" id="shipping-method"><option value="regular" ${shippingMethod==='regular'?'selected':''}>Regular Service (REG) - ${formatPrice(shippingRates.regular)} / 1-3 hari</option><option value="express" ${shippingMethod==='express'?'selected':''}>Express / Next Day - ${formatPrice(shippingRates.express)}</option><option value="cargo" ${shippingMethod==='cargo'?'selected':''}>Cargo / Heavy Packages - ${formatPrice(shippingRates.cargo)}</option></select></label><h3>Pilih pembayaran</h3><label>Metode pembayaran<select name="payment-method" id="payment-method"><option value="Kartu debit/kredit" ${method==='Kartu debit/kredit'?'selected':''}>Kartu debit/kredit</option><option value="Transfer bank" ${method==='Transfer bank'?'selected':''}>Transfer bank</option><option value="COD" ${method==='COD'?'selected':''}>Bayar di tempat (COD)</option></select></label><div id="payment-method-fields">${method==='Kartu debit/kredit' ? `<p class="demo-note">SIMULASI DEMO — jangan masukkan kartu asli. Data kartu tidak disimpan.</p><label>Nama pemegang kartu<input name="card-holder" autocomplete="off" placeholder="Nama pada kartu" required></label><label>Nomor kartu<input name="card-number" inputmode="numeric" autocomplete="off" maxlength="23" placeholder="1234 5678 9012 3456" required></label><div class="payment-row"><label>Berlaku sampai (MM/YY)<input name="expiry" autocomplete="off" placeholder="MM/YY" maxlength="5" required></label><label>CVV / kode keamanan<input name="cvv" inputmode="numeric" autocomplete="off" maxlength="4" placeholder="123" required></label></div>` : method==='Transfer bank' ? `<p class="demo-note">DEMO — instruksi virtual account akan dibuat setelah pesanan dikonfirmasi. Tidak ada transfer nyata.</p><label>Pilih bank<select name="bank"><option>BCA</option><option>BNI</option><option>BRI</option><option>Mandiri</option></select></label>` : `<p class="demo-note">Bayar saat pesanan tiba. Pastikan nama penerima, nomor telepon, dan alamat pengiriman sudah benar.</p><label class="cod-confirm"><input type="checkbox" name="cod-confirm" required> Saya mengonfirmasi alamat dan nomor telepon untuk pengiriman COD.</label>`}</div><button class="primary-button full" type="submit" id="payment-submit">${method==='COD'?'Konfirmasi pesanan COD':method==='Transfer bank'?'Konfirmasi & lihat instruksi':`Simulasikan pembayaran ${formatPrice(total)}`}</button></form></div>`;
};
function bindPaymentControls() {
  const form = $('#payment-form');
  const modal = $('#modal');
  const methodSelect = $('#payment-method');
  if (form && methodSelect) {
    methodSelect.onchange = () => {
      state.paymentDraft = { ...(state.paymentDraft || {}), paymentMethod: methodSelect.value };
      // Re-render method-specific fields immediately; only non-sensitive delivery choices persist in memory.
      const fd = new FormData(form);
      state.paymentDraft.recipient = fd.get('recipient') || '';
      state.paymentDraft.phone = fd.get('phone') || '';
      state.paymentDraft.address = fd.get('address') || '';
      state.paymentDraft.shippingMethod = fd.get('shipping-method') || 'regular';
      state.paymentDraft.bank = fd.get('bank') || 'BCA';
      renderModal();
    };
    const shippingSelect = $('#shipping-method');
    if (shippingSelect) shippingSelect.onchange = () => {
      state.paymentDraft = { ...(state.paymentDraft || {}), shippingMethod: shippingSelect.value, paymentMethod: methodSelect.value };
      const fd = new FormData(form);
      state.paymentDraft.recipient = fd.get('recipient') || '';
      state.paymentDraft.phone = fd.get('phone') || '';
      state.paymentDraft.address = fd.get('address') || '';
      renderModal();
    };
    form.onsubmit = (event) => { event.preventDefault(); completePayment(form); };
    const cardNumber = form.querySelector('[name="card-number"]');
    if (cardNumber) cardNumber.oninput = () => { cardNumber.value = cardNumber.value.replace(/\\D/g,'').slice(0,19).replace(/(.{4})/g,'$1 ').trim(); };
    const expiry = form.querySelector('[name="expiry"]');
    if (expiry) expiry.oninput = () => { const v=expiry.value.replace(/\\D/g,'').slice(0,4); expiry.value=v.length>2 ? `${v.slice(0,2)}/${v.slice(2)}` : v; };
    const cvv = form.querySelector('[name="cvv"]');
    if (cvv) cvv.oninput = () => { cvv.value=cvv.value.replace(/\\D/g,'').slice(0,4); };
  }
  const back = modal.querySelector('[data-payment-back]');
  if (back) back.onclick = () => {
    if (state.paymentStage === 'confirmation' || state.paymentStage === 'bank-instructions') {
      state.modal = null; renderModal(); setMobilePage('home');
    } else {
      state.modal = 'cart'; renderModal();
    }
  };
  const copy = modal.querySelector('[data-copy-va]');
  if (copy) copy.onclick = async () => { try { await navigator.clipboard.writeText(state.selectedOrder?.virtualAccount || ''); showToast('Nomor virtual account disalin'); } catch { showToast(`Nomor VA: ${state.selectedOrder?.virtualAccount || '-'}`); } };
  const check = modal.querySelector('[data-check-payment-status]');
  if (check) check.onclick = () => showToast(state.selectedOrder?.paymentStatus === 'Sudah dibayar' ? 'Pembayaran demo sudah dikonfirmasi.' : 'Status masih menunggu pembayaran.');
  const demoPaid = modal.querySelector('[data-demo-bank-paid]');
  if (demoPaid) demoPaid.onclick = () => {
    const order = state.selectedOrder; if (!order || order.paymentMethod !== 'Transfer bank' || order.paymentStatus === 'Sudah dibayar') return;
    order.paymentStatus = 'Sudah dibayar'; order.orderStatus = 'Menunggu pengiriman'; order.status = 'New';
    save(`rewear-orders-${accountKey()}`, state.orders); saveSellerOrderStatuses(order);
    state.paymentStage = 'confirmation'; renderModal(); showToast('Pembayaran demo ditandai berhasil; bukan verifikasi bank nyata.');
  };
  modal.querySelectorAll('[data-payment-finish]').forEach((button) => button.onclick = () => { state.modal = 'order-detail'; renderModal(); });
}
const saveSellerOrderStatuses = (order) => {
  Object.keys(order?.sellerStatuses || {}).forEach(() => {});
  Object.keys(order?.items ? Object.fromEntries(order.items.filter(i=>i.product.sellerId).map(i=>[i.product.sellerId,true])) : {}).forEach((sellerId) => {
    const key=`rewear-seller-${sellerId}-orders`; const list=load(key,[]); const found=list.find(item=>item.id===order.id);
    if(found){found.status=order.status;save(key,list);}
  });
};

const orderDetailModal = () => { const order = state.selectedOrder; if (!order) return '<div class="modal narrow"><button class="close" data-close>X</button><p>Order details are unavailable.</p></div>'; return `<div class="modal narrow"><button class="close" data-close>X</button><span class="eyebrow">PESANAN</span><h2>Detail Pesanan</h2><p><b>${sellerEscape(order.id)}</b></p><div class="modal-body">${order.items.map((item) => `<div class="order-item"><span><b>${sellerEscape(item.product.name)}</b><small>${Number(item.quantity) || 1} × ${sellerEscape(item.product.brand)}</small></span><strong>${formatPrice(item.product.price * (Number(item.quantity) || 1))}</strong></div>`).join('')}<div class="payment-summary"><div><span>Status</span><b>${sellerEscape(order.orderStatus || order.status || 'New')}</b></div><div><span>Subtotal</span><b>${formatPrice(order.subtotal || order.total)}</b></div><div><span>Pengiriman</span><span>${sellerEscape(order.shippingMethod || 'Regular Service (REG)')}</span></div><div><span>Ongkir</span><span>${formatPrice(order.shippingCost || 0)}</span></div><div><span>Total</span><b>${formatPrice(order.total)}</b></div><div><span>Pembayaran</span><span>${sellerEscape(order.paymentMethod)}</span></div><div><span>Status pembayaran</span><span>${sellerEscape(order.paymentStatus || (order.status === 'New' ? 'Sudah dibayar' : 'Menunggu pembayaran'))}</span></div><div><span>Penerima</span><span>${sellerEscape(order.recipient)}</span></div><div><span>Alamat</span><span>${sellerEscape(order.address)}</span></div>${Object.entries(order.shipments || {}).map(([sellerId, shipment]) => `<div><span>Kurir (${sellerEscape(sellerId)})</span><span>${sellerEscape(shipment.courierName || '-')} · ${sellerEscape(shipment.trackingNumber || '-')} · ${sellerEscape(shipment.status || '-')}</span></div>`).join('')}</div>${sellerReviewSection(order)}<button class="primary-button full" data-close>Lanjut Belanja</button></div></div>`; };
const accountModal = () => {
  const privacyTab = state.accountTab === 'privacy';
  const editing = state.accountEditing && !privacyTab;
  const hasPasswordLogin = state.user.authProvider !== 'google' && state.user.authProvider !== 'local';
  const details = privacyTab
    ? `<div class="privacy-details"><div class="privacy-row"><span>Username</span><b>${sellerEscape(getProfileName(state.user))}</b></div><div class="privacy-row"><span>Email</span><b>${sellerEscape(state.user.email || '-')}</b></div><div class="privacy-row"><span>Peran</span><b>${sellerEscape(state.user.role || 'Pembeli')}</b></div><div class="privacy-row"><span>Password</span><b>${hasPasswordLogin ? '••••••••' : state.user.authProvider === 'google' ? 'Managed by Google' : 'Not available'}</b></div></div><p class="privacy-note">Firebase tidak dapat menampilkan password asli. Password tidak disimpan dalam bentuk teks yang dapat dibaca.</p>${hasPasswordLogin ? '<button type="button" class="primary-button full" data-password-reset>Kirim email reset password</button>' : ''}`
    : editing
      ? `<form class="account-edit-form" id="account-edit-form"><label for="account-username">Username<input id="account-username" name="username" type="text" maxlength="50" autocomplete="name" value="${sellerEscape(getProfileName(state.user))}" required></label><div class="account-edit-actions"><button type="button" class="google-button" data-cancel-account-edit>Batal</button><button type="submit" class="primary-button">Simpan</button></div></form>`
      : `<div class="payment-summary"><div><span>Username</span><b>${sellerEscape(getProfileName(state.user))}</b></div><div><span>Peran</span><span>${sellerEscape(state.user.role || 'Pembeli')}</span></div></div><button type="button" class="google-button full" data-edit-account>Edit Profil</button><h3>Pesanan Saya</h3><div class="modal-body">${state.orders.length ? state.orders.map((order) => `<button class="order-item account-order" data-order="${sellerEscape(order.id)}"><b>${sellerEscape(order.id)}</b><span>${formatPrice(order.total)}</span></button>`).join('') : '<p>Belum ada pesanan.</p>'}</div><button class="primary-button full" data-logout>Logout</button>`;

  return `<div class="modal narrow"><button class="close" data-close>X</button><span class="eyebrow">AKUN SAYA</span><h2>${privacyTab ? 'Privasi Akun' : sellerEscape(getProfileName(state.user) || 'Pengguna Rewear')}</h2><div class="account-tabs" role="tablist" aria-label="Account settings"><button type="button" class="account-tab ${privacyTab ? '' : 'active'}" role="tab" aria-selected="${!privacyTab}" data-account-tab="details">Akun</button><button type="button" class="account-tab ${privacyTab ? 'active' : ''}" role="tab" aria-selected="${privacyTab}" data-account-tab="privacy">Privasi</button></div>${details}</div>`;
};
function bindAccountControls() {
  const modal = $('#modal');
  const logoutButton = modal.querySelector('[data-logout]');
  if (logoutButton) logoutButton.onclick = logout;
  const accountTabs = modal.querySelector('.account-tabs');
  if (accountTabs && state.user?.role === 'seller' && !modal.querySelector('[data-open-seller-center]')) {
    const sellerButton = document.createElement('button');
    sellerButton.type = 'button';
    sellerButton.className = 'primary-button full';
    sellerButton.dataset.openSellerCenter = '';
    sellerButton.textContent = 'Buka Seller Center';
    accountTabs.insertAdjacentElement('afterend', sellerButton);
    sellerButton.onclick = openSellerCenter;
  }
  const editButton = modal.querySelector('[data-edit-account]');
  if (editButton) editButton.onclick = () => { state.accountEditing = true; renderModal(); };
  const cancelEditButton = modal.querySelector('[data-cancel-account-edit]');
  if (cancelEditButton) cancelEditButton.onclick = () => { state.accountEditing = false; renderModal(); };
  const editForm = modal.querySelector('#account-edit-form');
  if (editForm) editForm.onsubmit = (event) => { event.preventDefault(); saveAccountInformation(editForm); };
  modal.querySelectorAll('[data-account-tab]').forEach((button) => button.onclick = () => {
    state.accountTab = button.dataset.accountTab;
    state.accountEditing = false;
    renderModal();
  });
  const resetButton = modal.querySelector('[data-password-reset]');
  if (resetButton) resetButton.onclick = sendPasswordReset;
  modal.querySelectorAll('[data-order]').forEach((button) => button.onclick = () => {
    state.selectedOrder = state.orders.find((order) => order.id === button.dataset.order);
    state.modal = 'order-detail';
    renderModal();
  });
}
const ordersModal = () => `<div class="modal narrow"><button class="close" data-close>X</button><h2>Pesanan Saya</h2><div class="modal-body">${state.orders.length ? state.orders.map((order) => `<div class="order-item"><b>${order.id}</b><span>${formatPrice(order.total)}</span></div>`).join('') : '<p>Belum ada pesanan.</p>'}</div></div>`;
const chatModal = () => {
  const mobile = window.matchMedia('(max-width: 680px)').matches;
  const room = state.chat.find((item) => item.room === (state.activeRoom || 'helper')) || state.chat[0];
  if (mobile && state.mobileChatView !== 'room') return `<div class="modal chat-modal"><button class="close" data-close aria-label="Kembali">X</button><h2>Chat</h2><div class="chat-inbox-list">${state.chat.map((item) => { const last = item.messages?.[item.messages.length - 1]; const preview = last?.text || 'Mulai percakapan'; return `<button class="chat-inbox-item" type="button" data-room="${sellerEscape(item.room)}"><span class="chat-avatar">${sellerEscape((item.name || 'R').slice(0,1).toUpperCase())}</span><span class="chat-inbox-copy"><span class="chat-inbox-head"><strong>${sellerEscape(item.name)}</strong><time>${last?.createdAt ? new Date(last.createdAt).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) : 'Baru'}</time></span><span class="chat-inbox-preview">${sellerEscape(preview)}</span></span></button>`; }).join('')}</div></div>`;
  return `<div class="modal chat-modal">${mobile ? `<div class="chat-room-header"><button type="button" class="chat-back" data-chat-back aria-label="Kembali ke daftar chat">←</button><span class="chat-avatar">${sellerEscape((room.name || 'R').slice(0,1).toUpperCase())}</span><h2>${sellerEscape(room.name)}</h2></div>` : '<button class="close" data-close>X</button><h2>Ruang Chat</h2>'}<div class="chat-layout"><aside>${state.chat.map((item) => `<button class="chat-room ${item.room === room.room ? 'active' : ''}" data-room="${sellerEscape(item.room)}">${sellerEscape(item.name)}</button>`).join('')}</aside><section><h3>${sellerEscape(room.name)}</h3><div class="messages">${room.messages.map((message) => `<div class="message ${sellerEscape(message.sender)}">${sellerEscape(message.text)}</div>`).join('')}</div><form id="chat-form" class="chat-form"><input name="text" placeholder="Tulis pesan..." required autocomplete="off"><button class="primary-button">Kirim</button></form></section></div></div>`;
};
function bindModal() { const modal = $('#modal'); modal.querySelectorAll('[data-close]').forEach((button) => button.onclick = closeModal); modal.querySelectorAll('[data-auth]').forEach((button) => button.onclick = () => { if (button.dataset.auth === 'register') state.authIntent = 'buyer'; if (button.dataset.auth === 'seller-register') state.authIntent = 'seller'; state.authMode = button.dataset.auth; renderModal(); }); modal.querySelectorAll('[data-contact-seller]').forEach((button) => button.onclick = () => beginSellerInquiry(button.dataset.contactSeller, button.dataset.contactProduct, button.dataset.contactName)); const form = modal.querySelector('#auth-form');

if (form) form.onsubmit = async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const email = String(data.get('email') || '').trim();
  const password = String(data.get('password') || '');
  const registering = state.authMode === 'register' || state.authMode === 'seller-register';
  const displayName = String(data.get('name') || '').trim();

  if (!firebaseAuth) {
    showToast('Firebase Authentication could not be loaded. Check your connection and Firebase configuration.');
    return;
  }

  try {
    const credential = registering
      ? await firebaseAuth.createUserWithEmailAndPassword(email, password)
      : await firebaseAuth.signInWithEmailAndPassword(email, password);
    const user = credential.user;
    const isAdmin = await hasFirebaseAdminClaim(user);

    if (registering && displayName) {
      try {
        await user.updateProfile({ displayName });
      } catch (error) {
        console.error('Could not update Firebase display name:', error);
      }
    }

    const isSellerRegistration = state.authMode === 'seller-register';
    const isRegisteredSeller = localStorage.getItem(sellerRoleKey(email)) === 'seller';
    const isSeller = isSellerRegistration || isRegisteredSeller;

    if (state.authIntent === 'seller' && !isSeller) {
      await firebaseAuth.signOut();
      showToast('No seller account is registered for this email. Register as a seller first.');
      return;
    }

    if (isSellerRegistration) {
      localStorage.setItem(sellerRoleKey(email), 'seller');
    }

    setUser({
      name: user.displayName || displayName || user.email?.split('@')[0] || 'Sahabat Rewear',
      email: user.email || email,
      role: isAdmin ? 'admin' : isSeller ? 'seller' : 'buyer',
      authProvider: 'password',
      photoURL: user.photoURL || ''
    });

    if (isSeller) {
      state.sellerPage = 'dashboard';
      state.editingSellerProduct = null;
      state.modal = 'seller-center';
      renderModal();
      showToast(registering ? 'Akun seller berhasil dibuat' : 'Berhasil masuk sebagai Seller');
    } else {
      showToast(isAdmin ? 'Berhasil masuk sebagai Admin' : registering ? 'Akun berhasil dibuat' : 'Berhasil masuk');
    }
  } catch (error) {
    console.error('Email/password authentication failed:', error);
    showToast(firebaseAuthErrorMessage(error));
  }
};
const google = modal.querySelector('[data-google]'); if (google) google.onclick = () => state.authIntent === 'seller' ? showToast('Seller accounts must use the registered seller email and password.') : signInWithGoogle(); const detail = modal.querySelector('[data-detail-add]'); if (detail) detail.onclick = () => requireLogin(() => addToCart(state.selectedProduct)); modal.querySelectorAll('[data-cart-delete]').forEach((button) => button.onclick = () => removeFromCart(Number(button.dataset.cartDelete))); const checkoutButton = modal.querySelector('[data-checkout]'); if (checkoutButton) checkoutButton.onclick = checkout; const paymentForm = modal.querySelector('#payment-form'); if (paymentForm) paymentForm.onsubmit = (event) => { event.preventDefault(); completePayment(paymentForm); }; modal.querySelectorAll('[data-room]').forEach((button) => button.onclick = () => { state.activeRoom = button.dataset.room; if (window.matchMedia('(max-width: 680px)').matches) { state.mobileChatView = 'room'; setMobilePage('chatroom'); } renderModal(); }); const backToChatList = modal.querySelector('[data-chat-back]'); if (backToChatList) backToChatList.onclick = () => { state.mobileChatView = 'inbox'; setMobilePage('chat'); renderModal(); }; const chatForm = modal.querySelector('#chat-form'); if (chatForm) chatForm.onsubmit = (event) => { event.preventDefault(); const data = new FormData(chatForm); const room = state.chat.find((item) => item.room === (state.activeRoom || 'helper')); room.messages.push({ sender: 'user', text: data.get('text') }); save(`rewear-chat-${accountKey()}`, state.chat); renderModal(); }; modal.querySelectorAll('[data-product]').forEach((button) => button.onclick = () => openProduct(products.find((product) => String(product.id) === button.dataset.product))); modal.querySelectorAll('[data-store]').forEach((button) => button.onclick = () => openStore(button.dataset.store)); modal.querySelectorAll('[data-add]').forEach((button) => button.onclick = () => addToCart(products.find((product) => String(product.id) === button.dataset.add))); }
$('#search').oninput = (event) => { state.search = event.target.value; render(); }; $('#search-button').onclick = () => { setMobilePage('products'); document.getElementById('products').scrollIntoView({ behavior: 'auto' }); $('#search').focus(); }; $('#sort').onchange = (event) => { state.sort = event.target.value; render(); }; $('#category-list').onclick = (event) => { if (event.target.matches('[data-category]')) { state.category = event.target.dataset.category; render(); setMobilePage('products'); document.getElementById('products').scrollIntoView({ behavior: 'auto' }); } }; $('#condition-list').onclick = (event) => { if (event.target.matches('[data-condition]')) { state.condition = event.target.dataset.condition; render(); } }; $('#chat-button').onclick = () => requireLogin(() => { state.modal = 'chat'; state.activeRoom = 'helper'; renderModal(); }); $('#cart-button').onclick = () => requireLogin(() => { state.modal = 'cart'; renderModal(); }); $('#login-button').onclick = () => { state.modal = 'auth'; state.authMode = 'login'; renderModal(); }; $('#register-button').onclick = () => { state.modal = 'auth'; state.authMode = 'register'; renderModal(); }; $('#seller-button').onclick = () => { state.modal = 'auth'; state.authMode = 'seller-register'; renderModal(); };
const sellerOwnerId = (email = state.user?.email || state.user?.name || '') => String(email).trim().toLowerCase();
const sellerRoleKey = (email) => `rewear-seller-role-${sellerOwnerId(email)}`;
const sellerKey = () => state.user ? `rewear-seller-${sellerOwnerId()}` : 'rewear-seller-guest';
const sellerProductStoragePrefix = 'rewear-seller-';
const sellerMarketplaceProducts = () => Object.keys(localStorage).filter((key) => key.startsWith(sellerProductStoragePrefix) && key.endsWith('-products')).flatMap((key) => {
  const ownerId = key.slice(sellerProductStoragePrefix.length, -'-products'.length);
  const listings = load(key, []);
  if (!Array.isArray(listings)) return [];
  return listings.filter((product) => product.status === 'Active' && Number(product.stock) > 0).map((product) => ({
    ...product,
    id: `seller:${ownerId}:${product.id}`,
    sellerProductId: product.id,
    sellerId: ownerId,
    sellerName: product.sellerName || ownerId,
    brandType: product.brandType || (product.brand && product.brand !== product.sellerName && product.brand !== ownerId ? 'Branded' : 'Unbranded'),
    brand: product.brandType === 'Branded' || (!product.brandType && product.brand && product.brand !== product.sellerName && product.brand !== ownerId) ? product.brand : 'Unbranded',
    originalPrice: Number(product.originalPrice) || Number(product.price),
    viewed: Number(product.viewed) || 0,
    location: product.location || 'Indonesia',
    createdAt: Number(product.createdAt) || 0
  }));
});
const sellerDefaultProducts = [];
const sellerDefaultOrders = [];
const sellerDefaultMessages = [];
const sellerDefaultReviews = [];
const sellerLoad = (name, fallback) => load(`${sellerKey()}-${name}`, fallback);
const sellerSave = (name, value) => save(`${sellerKey()}-${name}`, value);
const sellerCollectionFor = (ownerId, name, fallback = []) => load(`rewear-seller-${ownerId}-${name}`, fallback);
const beginSellerInquiry = (sellerId, productId, productName) => requireLogin(() => { if (sellerOwnerId() === sellerId) { showToast('Kamu tidak dapat mengirim pertanyaan ke toko sendiri.'); return; } const messageText = window.prompt(`Tulis pertanyaan untuk ${productName}:`, ''); if (!messageText || !messageText.trim()) return; const messages = sellerCollectionFor(sellerId, 'messages', []); const buyerKey = accountKey(); let thread = messages.find((message) => message.buyerKey === buyerKey && String(message.productId) === String(productId)); if (!thread) { thread = { id: `MSG-${Date.now()}`, sellerId, productId, product: productName, buyer: state.user.name || state.user.email, buyerEmail: state.user.email, buyerKey, conversation: [] }; messages.unshift(thread); } thread.message = messageText.trim(); thread.time = new Date().toLocaleString(); thread.conversation.push({ sender: 'buyer', text: messageText.trim(), createdAt: Date.now() }); save(`rewear-seller-${sellerId}-messages`, messages); renderModal(); showToast('Pertanyaan terkirim ke seller'); });
const sellerEscape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const sellerProducts = () => sellerLoad('products', sellerDefaultProducts);
const sellerOrders = () => sellerLoad('orders', sellerDefaultOrders);
const sellerMessages = () => sellerLoad('messages', sellerDefaultMessages);
const sellerReviews = () => sellerLoad('reviews', sellerDefaultReviews);
const sellerStatusClass = (status) => ({ Active: 'active', New: 'pending', Processing: 'pending', Shipped: 'shipped', Completed: 'completed', Sold: 'sold' }[status] || 'pending');
const sellerOrderNextStatus = { New: ['New', 'Processing'], Processing: ['Processing', 'Shipped'], Shipped: ['Shipped', 'Completed'], Completed: ['Completed'] };
const sellerOrderCard = (order) => `<div class="seller-order-card"><div class="seller-order-head"><b>${sellerEscape(order.id)}</b><span>${formatPrice(Number(order.amount) || 0)}</span></div><div class="seller-order-info"><span>Pembeli: <b>${sellerEscape(order.buyer)}</b></span><span>Email: <b>${sellerEscape(order.buyerEmail || '-')}</b></span><span>Penerima: <b>${sellerEscape(order.recipient || '-')}</b></span><span>Produk: <b>${(order.items || []).map((item) => `${Number(item.quantity) || 1} × ${sellerEscape(item.product?.name)}`).join(', ') || sellerEscape(order.product || '-')}</b></span><span>Pengiriman: ${sellerEscape(order.shippingMethod || order.shipping || '-')}</span><span>Alamat: ${sellerEscape(order.address || '-')}</span><span>Kurir / resi: ${sellerEscape(order.courierName || '-')} / ${sellerEscape(order.trackingNumber || '-')}</span></div><div class="seller-order-controls"><span class="seller-status ${sellerStatusClass(order.status)}">${sellerEscape(order.status)}</span><select data-seller-order-status="${sellerEscape(order.id)}">${(sellerOrderNextStatus[order.status] || [order.status]).map((status) => `<option value="${sellerEscape(status)}" ${order.status === status ? 'selected' : ''}>${sellerEscape(status)}</option>`).join('')}</select><input aria-label="Nama kurir" placeholder="Kurir" value="${sellerEscape(order.courierName || '')}" data-seller-courier="${sellerEscape(order.id)}"><input aria-label="Nomor resi" placeholder="Nomor resi" value="${sellerEscape(order.trackingNumber || '')}" data-seller-tracking="${sellerEscape(order.id)}"><button type="button" data-update-seller-order="${sellerEscape(order.id)}">Simpan</button></div></div>`;
const sellerDashboard = () => { const products = sellerProducts(); const orders = sellerOrders(); const active = products.filter((product) => product.status === 'Active' && Number(product.stock) > 0).length; const pending = orders.filter((order) => ['New', 'Processing'].includes(order.status)).length; const revenue = orders.filter((order) => order.status === 'Completed').reduce((sum, order) => sum + Number(order.subtotal ?? order.amount ?? 0), 0); return `<div class="seller-main"><div class="seller-page-title"><div><h2>Seller Dashboard</h2><p>Kelola toko, produk, pesanan, dan pembeli kamu.</p></div><button class="seller-primary" data-seller-page="add-product">+ Tambah Produk</button></div><div class="seller-stats"><div class="seller-stat"><span>Total Produk</span><strong>${products.length}</strong></div><div class="seller-stat"><span>Listing Aktif</span><strong>${active}</strong></div><div class="seller-stat"><span>Pesanan Masuk</span><strong>${orders.length}</strong></div><div class="seller-stat"><span>Perlu Diproses</span><strong>${pending}</strong></div><div class="seller-stat"><span>Pendapatan Selesai</span><strong>${formatPrice(revenue)}</strong></div></div><div class="seller-section"><h3>Pesanan Terbaru</h3>${orders.length ? orders.slice(0, 4).map(sellerOrderCard).join('') : '<div class="seller-empty">Belum ada pesanan.</div>'}</div></div>`; };
const sellerListings = () => { const products = sellerProducts(); return `<div class="seller-main"><div class="seller-page-title"><div><h2>Produk Saya</h2><p>Tambah dan kelola listing preloved kamu.</p></div><button class="seller-primary" data-seller-page="add-product">+ Tambah Produk</button></div><div class="seller-section seller-listings-section">${products.length ? `<table class="seller-table"><thead><tr><th>Produk</th><th>Harga</th><th>Kondisi</th><th>Stok</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${products.map((product) => `<tr><td data-label="Produk"><div class="seller-product-mini"><img src="${sellerEscape(product.image)}" alt="${sellerEscape(product.name)}"><div><b>${sellerEscape(product.name)}</b><small>${sellerEscape(product.category)} · ${sellerEscape(product.size)}</small></div></div></td><td data-label="Harga">${formatPrice(Number(product.price) || 0)}</td><td data-label="Kondisi">${sellerEscape(product.condition)}</td><td data-label="Stok">${Number(product.stock) || 0}</td><td data-label="Status"><span class="seller-status ${sellerStatusClass(product.status)}">${sellerEscape(product.status)}</span></td><td data-label="Aksi"><div class="seller-actions"><button class="seller-small-btn" data-edit-seller-product="${sellerEscape(product.id)}">Edit</button><button class="seller-small-btn" data-toggle-seller-product="${sellerEscape(product.id)}">${product.status === 'Active' ? 'Sembunyikan' : 'Aktifkan'}</button><button class="seller-small-btn" data-delete-seller-product="${sellerEscape(product.id)}">Hapus</button></div></td></tr>`).join('')}</tbody></table>` : '<div class="seller-empty">Belum ada produk. Tambahkan produk pertama kamu.</div>'}</div></div>`; };
const sellerProductForm = (editing = null) => { const product = editing || { id: '', name: '', category: 'Atasan', price: '', condition: 'Like New', size: 'M', stock: 1, image: '', description: '', brandType: 'Unbranded', brand: '' }; const brandType = product.brandType || (product.brand && product.brand !== product.sellerName ? 'Branded' : 'Unbranded'); return `<div class="seller-main"><div class="seller-page-title"><div><h2>${editing ? 'Edit Produk' : 'Tambah Produk'}</h2><p>${editing ? 'Perbarui informasi produk kamu.' : 'Buat listing baru untuk toko kamu.'}</p></div></div><div class="seller-section"><form id="seller-product-form" class="seller-form"><input type="hidden" name="id" value="${sellerEscape(product.id)}"><div class="seller-form-grid"><label>Nama Produk<input name="name" value="${sellerEscape(product.name)}" maxlength="100" required></label><label>Kategori<select name="category">${['Atasan', 'Dress', 'Outer', 'Bawahan', 'Tas'].map((category) => `<option value="${category}" ${product.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></label><label>Brand<select name="brandType" data-brand-type><option value="Unbranded" ${brandType === 'Unbranded' ? 'selected' : ''}>Unbranded</option><option value="Branded" ${brandType === 'Branded' ? 'selected' : ''}>Branded</option></select></label><label data-brand-name-wrapper ${brandType === 'Branded' ? '' : 'hidden'}>Nama Brand<input name="brand" value="${sellerEscape(brandType === 'Branded' ? product.brand : '')}" maxlength="60" ${brandType === 'Branded' ? 'required' : ''} placeholder="Contoh: H&M, Adidas"></label><label>Harga<input name="price" type="number" min="1" step="1" value="${sellerEscape(product.price)}" required></label><label>Kondisi<select name="condition">${['Like New', 'Very Good', 'Good', 'Fair'].map((condition) => `<option value="${condition}" ${product.condition === condition ? 'selected' : ''}>${condition}</option>`).join('')}</select></label><label>Ukuran<input name="size" value="${sellerEscape(product.size)}" maxlength="30" required></label><label>Stok<input name="stock" type="number" min="0" step="1" value="${sellerEscape(product.stock)}" required></label></div><label>Deskripsi<textarea name="description" rows="3" maxlength="1000" required>${sellerEscape(product.description)}</textarea></label><label>URL Foto Produk<input name="image" type="url" value="${sellerEscape(product.image)}" placeholder="https://..." required></label><p class="seller-note">Pilih Branded untuk memasukkan merek produk, atau Unbranded jika tidak memiliki merek.</p><div class="seller-actions"><button type="button" class="seller-small-btn" data-seller-page="listings">Batal</button><button type="submit" class="seller-primary">${editing ? 'Simpan Perubahan' : 'Publikasikan Produk'}</button></div></form></div></div>`; };
const sellerMessagePage = () => { const messages = sellerMessages(); return `<div class="seller-main"><div class="seller-page-title"><div><h2>Pertanyaan Pembeli</h2><p>Kelola pertanyaan dari calon pembeli.</p></div></div><div class="seller-section">${messages.length ? messages.map((message) => `<div class="seller-message"><div class="seller-message-head"><b>${sellerEscape(message.buyer)} · ${sellerEscape(message.product)}</b><small>${sellerEscape(message.time)}</small></div>${(message.conversation || [{ sender: 'buyer', text: message.message }]).map((entry) => `<p><b>${entry.sender === 'seller' ? 'Seller' : sellerEscape(message.buyer)}:</b> ${sellerEscape(entry.text)}</p>`).join('')}<button type="button" data-seller-reply="${sellerEscape(message.id)}">Balas</button></div>`).join('') : '<div class="seller-empty">Belum ada pertanyaan dari pembeli.</div>'}</div></div>`; };
const sellerOrdersPage = () => { const orders = sellerOrders(); return `<div class="seller-main"><div class="seller-page-title"><div><h2>Pesanan Masuk</h2><p>Proses pesanan dan perbarui statusnya.</p></div></div>${orders.length ? orders.map(sellerOrderCard).join('') : '<div class="seller-section seller-empty">Belum ada pesanan.</div>'}</div>`; };
const sellerShippingPage = () => { const orders = sellerOrders().filter((order) => ['Processing', 'Shipped'].includes(order.status)); return `<div class="seller-main"><div class="seller-page-title"><div><h2>Pengiriman</h2><p>Simpan kurir, nomor resi, dan status pengiriman.</p></div></div><div class="seller-section">${orders.length ? orders.map(sellerOrderCard).join('') : '<div class="seller-empty">Tidak ada pesanan yang sedang diproses untuk pengiriman.</div>'}</div></div>`; };
const sellerReviewSection = (order) => { const items = [...new Map((order.items || []).filter((item) => item.product?.sellerId).map((item) => [`${item.product.sellerId}:${item.product.sellerProductId}`, item.product])).values()]; if (!items.length) return ''; if (order.status !== 'Completed') return `<div class="seller-section"><h3>Ulasan</h3><p class="seller-note">Kamu dapat memberi ulasan setelah seller menyelesaikan pesanan.</p></div>`; return `<div class="seller-section"><h3>Ulasan Produk</h3>${items.map((product) => { const review = sellerCollectionFor(product.sellerId, 'reviews', []).find((item) => item.buyerKey === accountKey() && String(item.productId) === String(product.sellerProductId)); if (review) return `<div class="seller-review"><div class="seller-stars">${'★'.repeat(Number(review.rating))}${'☆'.repeat(5 - Number(review.rating))}</div><p>${sellerEscape(review.text)}</p>${review.reply ? `<p class="seller-reply">Balasan seller: ${sellerEscape(review.reply)}</p>` : ''}<small>${sellerEscape(product.name)}</small></div>`; return `<form class="seller-form" data-buyer-review data-review-seller="${sellerEscape(product.sellerId)}" data-review-product="${sellerEscape(product.sellerProductId)}"><b>${sellerEscape(product.name)}</b><label>Rating<select name="rating" required><option value="5">5 - Sangat baik</option><option value="4">4 - Baik</option><option value="3">3 - Cukup</option><option value="2">2 - Kurang</option><option value="1">1 - Buruk</option></select></label><label>Ulasan<textarea name="text" rows="3" maxlength="1000" required></textarea></label><button type="submit" class="seller-primary">Kirim Ulasan</button></form>`; }).join('')}</div>`; };
const sellerReviewsPage = () => { const reviews = sellerReviews(); const average = reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1) : '0.0'; return `<div class="seller-main"><div class="seller-page-title"><div><h2>Ulasan Pembeli</h2><p>Feedback dari pembeli setelah transaksi.</p></div></div><div class="seller-stats"><div class="seller-stat"><span>Rating</span><strong>${average}/5</strong><small>Dari pembeli</small></div><div class="seller-stat"><span>Total Ulasan</span><strong>${reviews.length}</strong><small>Feedback</small></div></div><div class="seller-section">${reviews.length ? reviews.map((review) => `<div class="seller-review"><div class="seller-stars">${'★'.repeat(Math.max(0, Math.min(5, Number(review.rating))))}${'☆'.repeat(5 - Math.max(0, Math.min(5, Number(review.rating))))}</div><p>"${sellerEscape(review.text)}"</p><small>${sellerEscape(review.buyer)} · ${sellerEscape(review.product)}</small>${review.reply ? `<p class="seller-reply">Balasan: ${sellerEscape(review.reply)}</p>` : ''}<button type="button" data-seller-review-reply="${sellerEscape(review.id)}">${review.reply ? 'Ubah balasan' : 'Balas ulasan'}</button></div>`).join('') : '<div class="seller-empty">Belum ada ulasan.</div>'}</div></div>`; };
const sellerCenter = () => { if (!state.user || state.user.role !== 'seller') return `<div class="modal narrow"><button class="close" data-close>X</button><h2>Seller Center</h2><p>Silakan masuk sebagai seller terlebih dahulu.</p><button class="primary-button full" data-seller-login>Masuk sebagai Seller</button></div>`; const page = state.sellerPage || 'dashboard'; const content = page === 'listings' ? sellerListings() : page === 'add-product' ? sellerProductForm(state.editingSellerProduct) : page === 'orders' ? sellerOrdersPage() : page === 'messages' ? sellerMessagePage() : page === 'shipping' ? sellerShippingPage() : page === 'reviews' ? sellerReviewsPage() : sellerDashboard(); return `<div class="modal seller-center-modal"><div class="seller-center"><div class="seller-topbar"><div class="seller-brand"><strong>RE<span class="circle-logo"></span>WEAR</strong><small>Seller Center</small></div><div class="seller-top-actions"><span style="font-size:10px">${sellerEscape(state.user.name || state.user.email)}</span><button type="button" data-marketplace>Marketplace</button><button type="button" data-seller-logout>Logout</button><button type="button" class="seller-close" data-close aria-label="Close">×</button></div></div><div class="seller-layout"><aside class="seller-sidebar"><nav class="seller-nav">${[['dashboard', 'Dashboard'], ['listings', 'Produk Saya'], ['orders', 'Pesanan'], ['messages', 'Pertanyaan'], ['shipping', 'Pengiriman'], ['reviews', 'Ulasan']].map(([key, label]) => `<button type="button" class="${page === key ? 'active' : ''}" data-seller-page="${key}">${label}</button>`).join('')}</nav></aside>${content}</div></div></div>`; };
const openSellerCenter = () => { if (!state.user || state.user.role !== 'seller') { openAuth('seller'); return; } state.sellerPage = 'dashboard'; state.editingSellerProduct = null; state.modal = 'seller-center'; renderModal(); };
const sellerCtaButton = $('#seller-button'); if (sellerCtaButton) sellerCtaButton.onclick = () => state.user?.role === 'seller' ? openSellerCenter() : openAuth('seller-register');
const syncBuyerOrder = (sellerOrder, sellerOrdersSnapshot) => { if (!sellerOrder.buyerKey) return; const matchingOrders = Object.keys(localStorage).filter((key) => key.startsWith(sellerProductStoragePrefix) && key.endsWith('-orders')).flatMap((key) => load(key, [])).filter((order) => order.buyerKey === sellerOrder.buyerKey && order.buyerOrderId === sellerOrder.buyerOrderId); const sellerStatuses = Object.fromEntries(matchingOrders.map((order) => [order.sellerId, order.status])); const buyerOrdersKey = `rewear-orders-${sellerOrder.buyerKey}`; const buyerOrders = load(buyerOrdersKey, []); const buyerOrder = buyerOrders.find((order) => order.id === sellerOrder.buyerOrderId); if (!buyerOrder) return; buyerOrder.sellerStatuses = sellerStatuses; const statuses = Object.values(sellerStatuses); buyerOrder.status = statuses.length && statuses.every((status) => status === 'Completed') ? 'Completed' : statuses.includes('Processing') ? 'Processing' : statuses.includes('Shipped') ? 'Shipped' : 'New'; buyerOrder.shipments = { ...(buyerOrder.shipments || {}), [sellerOrder.sellerId]: { status: sellerOrder.status, courierName: sellerOrder.courierName || '', trackingNumber: sellerOrder.trackingNumber || '' } }; save(buyerOrdersKey, buyerOrders); };
const bindSellerControls = () => {
  document.querySelectorAll('[data-seller-page]').forEach((button) => button.onclick = () => { state.sellerPage = button.dataset.sellerPage; if (state.sellerPage !== 'add-product') state.editingSellerProduct = null; renderModal(); });
  const sellerLogout = $('[data-seller-logout]'); if (sellerLogout) sellerLogout.onclick = logout;
  const marketplaceButton = $('[data-marketplace]'); if (marketplaceButton) marketplaceButton.onclick = () => { state.modal = null; renderModal(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const sellerLogin = $('[data-seller-login]'); if (sellerLogin) sellerLogin.onclick = () => openAuth('seller');
  const productForm = $('#seller-product-form');
  if (productForm) {
    const brandTypeSelect = productForm.querySelector('[data-brand-type]');
    const brandNameWrapper = productForm.querySelector('[data-brand-name-wrapper]');
    const brandNameInput = productForm.elements.brand;
    const syncBrandField = () => {
      const isBranded = brandTypeSelect.value === 'Branded';
      brandNameWrapper.hidden = !isBranded;
      brandNameInput.required = isBranded;
      if (!isBranded) brandNameInput.value = '';
    };
    brandTypeSelect.onchange = syncBrandField;
    syncBrandField();
  }
  if (productForm) productForm.onsubmit = (event) => {
    event.preventDefault();
    const data = new FormData(productForm);
    const products = sellerProducts();
    const id = String(data.get('id') || `SP-${Date.now()}`);
    const name = String(data.get('name') || '').trim();
    const size = String(data.get('size') || '').trim();
    const description = String(data.get('description') || '').trim();
    const brandType = String(data.get('brandType') || '');
    const brandName = String(data.get('brand') || '').trim();
    const category = String(data.get('category') || '');
    const condition = String(data.get('condition') || '');
    const price = Number(data.get('price'));
    const stock = Number(data.get('stock'));
    let imageUrl;

    try {
      imageUrl = new URL(String(data.get('image') || '').trim());
    } catch {
      showToast('Masukkan URL gambar yang valid.');
      return;
    }

    if (!name || name.length > 100 || !size || size.length > 30 || !description || description.length > 1000 || !['Branded', 'Unbranded'].includes(brandType) || (brandType === 'Branded' && (!brandName || brandName.length > 60)) || !['Atasan', 'Dress', 'Outer', 'Bawahan', 'Tas'].includes(category) || !['Like New', 'Very Good', 'Good', 'Fair'].includes(condition) || !Number.isSafeInteger(price) || price <= 0 || !Number.isSafeInteger(stock) || stock < 0 || !['http:', 'https:'].includes(imageUrl.protocol)) {
      showToast('Periksa nama, deskripsi, kategori, kondisi, harga, stok, dan URL gambar produk.');
      return;
    }

    const index = products.findIndex((item) => String(item.id) === id);
    const previous = index >= 0 ? products[index] : null;
    const product = {
      id,
      name,
      brandType,
      brand: brandType === 'Branded' ? brandName : 'Unbranded',
      sellerName: state.user.name || state.user.email,
      sellerId: sellerOwnerId(),
      category,
      price,
      originalPrice: price,
      condition,
      size,
      stock,
      image: imageUrl.href,
      description,
      status: previous?.status || 'Active',
      createdAt: previous?.createdAt || Date.now(),
      location: previous?.location || 'Indonesia',
      viewed: previous?.viewed || 0,
      ribbon: previous?.ribbon || 'Baru'
    };

    if (index >= 0) products[index] = product;
    else products.unshift(product);

    sellerSave('products', products);
    render();
    state.sellerPage = 'listings';
    state.editingSellerProduct = null;
    renderModal();
    showToast(index >= 0 ? 'Produk berhasil diperbarui' : 'Produk berhasil dipublikasikan');
  };
  document.querySelectorAll('[data-edit-seller-product]').forEach((button) => button.onclick = () => { const product = sellerProducts().find((item) => String(item.id) === button.dataset.editSellerProduct); if (!product) return; state.editingSellerProduct = product; state.sellerPage = 'add-product'; renderModal(); });
  document.querySelectorAll('[data-delete-seller-product]').forEach((button) => button.onclick = () => { sellerSave('products', sellerProducts().filter((item) => String(item.id) !== button.dataset.deleteSellerProduct)); renderModal(); showToast('Produk berhasil dihapus'); });
  document.querySelectorAll('[data-toggle-seller-product]').forEach((button) => button.onclick = () => { const products = sellerProducts(); const product = products.find((item) => String(item.id) === button.dataset.toggleSellerProduct); if (!product) return; product.status = product.status === 'Active' ? 'Hidden' : 'Active'; sellerSave('products', products); render(); renderModal(); showToast(product.status === 'Active' ? 'Listing diaktifkan' : 'Listing disembunyikan'); });
  document.querySelectorAll('[data-update-seller-order]').forEach((button) => button.onclick = () => {
    const orders = sellerOrders();
    const order = orders.find((item) => String(item.id) === button.dataset.updateSellerOrder);
    const select = document.querySelector(`[data-seller-order-status="${button.dataset.updateSellerOrder}"]`);
    const courierInput = document.querySelector(`[data-seller-courier="${button.dataset.updateSellerOrder}"]`);
    const trackingInput = document.querySelector(`[data-seller-tracking="${button.dataset.updateSellerOrder}"]`);
    if (!order || !select) return;
    const permittedStatuses = sellerOrderNextStatus[order.status] || [order.status];
    const courierName = courierInput?.value.trim() || '';
    const trackingNumber = trackingInput?.value.trim() || '';
    if (!permittedStatuses.includes(select.value)) { showToast('Status pesanan harus mengikuti urutan pemrosesan.'); return; }
    if (courierName.length > 100 || trackingNumber.length > 100) { showToast('Nama kurir dan nomor resi harus kurang dari 100 karakter.'); return; }
    if (select.value === 'Shipped' && (!courierName || !trackingNumber)) { showToast('Isi nama kurir dan nomor resi sebelum menandai pesanan dikirim.'); return; }
    order.status = select.value;
    order.courierName = courierName;
    order.trackingNumber = trackingNumber;
    sellerSave('orders', orders);
    syncBuyerOrder(order);
    renderModal();
    showToast('Pesanan dan informasi pengiriman berhasil disimpan');
  });
  document.querySelectorAll('[data-seller-reply]').forEach((button) => button.onclick = () => { const messages = sellerMessages(); const message = messages.find((item) => String(item.id) === button.dataset.sellerReply); if (!message) return; const reply = window.prompt(`Balas pesan dari ${message.buyer}:`, ''); if (!reply || !reply.trim()) return; message.reply = reply.trim(); message.conversation = [...(message.conversation || []), { sender: 'seller', text: reply.trim(), createdAt: Date.now() }]; sellerSave('messages', messages); renderModal(); showToast('Balasan berhasil disimpan'); });
  document.querySelectorAll('[data-buyer-review]').forEach((form) => form.onsubmit = (event) => { event.preventDefault(); const order = state.selectedOrder; const sellerId = form.dataset.reviewSeller; const productId = form.dataset.reviewProduct; if (!order || order.status !== 'Completed' || state.user?.role === 'seller' || sellerOwnerId() === sellerId) { showToast('Ulasan hanya tersedia untuk pembeli setelah pesanan selesai.'); return; } const purchased = order.items.some((item) => item.product?.sellerId === sellerId && String(item.product.sellerProductId) === String(productId)); const rating = Number(new FormData(form).get('rating')); const text = String(new FormData(form).get('text') || '').trim(); if (!purchased || !Number.isInteger(rating) || rating < 1 || rating > 5 || !text) { showToast('Periksa rating dan isi ulasan sebelum menyimpan.'); return; } const reviews = sellerCollectionFor(sellerId, 'reviews', []); if (reviews.some((review) => review.buyerKey === accountKey() && String(review.productId) === String(productId))) { showToast('Kamu sudah mengulas produk ini.'); return; } const product = order.items.find((item) => item.product?.sellerId === sellerId && String(item.product.sellerProductId) === String(productId)).product; reviews.unshift({ id: `REV-${Date.now()}`, orderId: order.id, sellerId, productId, product: product.name, buyerKey: accountKey(), buyer: state.user.name || state.user.email, rating, text, reply: '', createdAt: Date.now() }); save(`rewear-seller-${sellerId}-reviews`, reviews); renderModal(); showToast('Ulasan berhasil dikirim'); });
  document.querySelectorAll('[data-seller-review-reply]').forEach((button) => button.onclick = () => { const reviews = sellerReviews(); const review = reviews.find((item) => String(item.id) === button.dataset.sellerReviewReply); if (!review) return; const reply = window.prompt('Balas ulasan pembeli:', review.reply || ''); if (!reply || !reply.trim()) return; review.reply = reply.trim(); review.replyAt = Date.now(); sellerSave('reviews', reviews); renderModal(); showToast('Balasan ulasan berhasil disimpan'); });
};
const renderBottomNavigation = () => {
  const nav = $('#mobile-bottom-nav');
  if (!nav) return;
  const isSeller = state.user?.role === 'seller';
  nav.classList.toggle('is-seller', isSeller);
  const addButton = isSeller ? `<button type="button" data-bottom-action="add" class="bottom-nav-item add-product"><span class="bottom-nav-icon" aria-hidden="true">+</span><span>Tambah</span></button>` : '';
  nav.innerHTML = `
    <button type="button" data-bottom-action="home" class="bottom-nav-item active"><span class="bottom-nav-icon" aria-hidden="true">⌂</span><span>Beranda</span></button>
    <button type="button" data-bottom-action="flash" class="bottom-nav-item"><span class="bottom-nav-icon" aria-hidden="true">％</span><span>Flash Sale</span></button>
    ${addButton}
    <button type="button" data-bottom-action="chat" class="bottom-nav-item"><span class="bottom-nav-icon" aria-hidden="true">✉</span><span>Chat</span></button>
    <button type="button" data-bottom-action="me" class="bottom-nav-item"><span class="bottom-nav-icon" aria-hidden="true">♙</span><span>Saya</span></button>`;
};
const bindBottomNavigation = () => {
  const nav = $('#mobile-bottom-nav');
  if (!nav) return;
  nav.addEventListener('click', (event) => {
    const button = event.target.closest('[data-bottom-action]');
    if (!button) return;
    const action = button.dataset.bottomAction;
    if (action !== 'add') nav.querySelectorAll('.bottom-nav-item').forEach((item) => item.classList.toggle('active', item === button));
    if (action === 'home') {
      setMobilePage('home');
    } else if (action === 'flash') {
      setMobilePage('flash');
    } else if (action === 'add') {
      if (state.user?.role === 'seller') {
        state.sellerPage = 'add-product';
        state.editingSellerProduct = null;
        state.modal = 'seller-center';
        renderModal();
      } else {
        openAuth('seller');
      }
    } else if (action === 'chat') {
      requireLogin(() => { state.activeRoom = 'helper'; state.mobileChatView = 'inbox'; state.modal = 'chat'; setMobilePage('chat'); renderModal(); });
    } else if (action === 'me') {
      if (state.user) { state.accountTab = 'details'; state.modal = 'account'; setMobilePage('profile'); renderModal(); }
      else { state.modal = 'auth'; state.authMode = 'login'; renderModal(); }
    }
  });
};
if (firebaseAuth) firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
  if (!firebaseUser || !state.user || state.user.email !== (firebaseUser.email || firebaseUser.uid)) return;
  const isAdmin = await hasFirebaseAdminClaim(firebaseUser);
  const isSeller = localStorage.getItem(sellerRoleKey(firebaseUser.email || firebaseUser.uid)) === 'seller';
  const role = isAdmin ? 'admin' : isSeller ? 'seller' : 'buyer';
  if (state.user.role !== role) {
    state.user.role = role;
    save('rewear-user', state.user);
    render();
  }
});
if (state.user?.role === 'seller' && state.user.email) localStorage.setItem(sellerRoleKey(state.user.email), 'seller');

document.querySelectorAll('[data-footer-action="seller"]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  if (state.user?.role === 'seller') openSellerCenter();
  else openAuth('seller-register');
}));

bindMobileMenu();
bindBottomNavigation();
setMobilePage('home', { scroll: false });
hydrateAccount(); render();

/* ===== Next original inline script ===== */

/* ===== REWEAR ADMIN ADD-ON (added; original code untouched except small hooks) ===== */
(() => {
const ADMIN = { email: 'rewearofficials@gmail.com', pass: 'rewear123' };
const K = { sus: 'rewear-admin-suspended', hid: 'rewear-admin-hidden', flash: 'rewear-admin-flash', ann: 'rewear-admin-announcement', read: 'rewear-admin-chat-read' };
const ls = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; } };
const ss = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const E = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rp = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');
const keys = (p) => Object.keys(localStorage).filter((k) => k.startsWith(p));
const arr = (v) => Array.isArray(v) ? v : [];
const isAdmin = () => sessionStorage.getItem('rewear-admin-session') === '1';
const toast = (m) => { try { showToast(m); } catch { alert(m); } };
const STAT = ['Awaiting Payment', 'New', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
const dt = (d) => { const x = new Date(d); return isNaN(x) ? '-' : x.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); };

/* ---------- data helpers ---------- */
const allOrders = () => keys('rewear-orders-').flatMap((k) => arr(ls(k, [])).map((o) => ({ ...o, _k: k, _e: k.slice(14) }))).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const emails = () => { const s = new Set(); ['rewear-cart-', 'rewear-orders-', 'rewear-favorites-', 'rewear-chat-', 'rewear-seller-role-'].forEach((p) => keys(p).forEach((k) => s.add(k.slice(p.length)))); const u = ls('rewear-user', null); if (u && u.email) s.add(String(u.email).toLowerCase()); s.delete('guest'); return [...s].sort(); };
const sellerListings = () => keys('rewear-seller-').filter((k) => k.endsWith('-products')).flatMap((k) => { const o = k.slice(14, -9); return arr(ls(k, [])).map((p) => ({ ...p, _k: k, _owner: o, _id: `seller:${o}:${p.id}` })); });
const reviews = () => keys('rewear-seller-').filter((k) => k.endsWith('-reviews')).flatMap((k) => arr(ls(k, [])).map((r) => ({ ...r, _k: k })));
const chats = () => keys('rewear-chat-').map((k) => { const e = k.slice(12); const r = arr(ls(k, [])).find((x) => x.room === 'helper'); const m = (r && r.messages) || []; if (!m.some((x) => x.sender === 'user')) return null; const rd = ls(K.read, {})[e] || 0; return { e, k, m, unread: m[m.length - 1].sender === 'user' && m.length > rd }; }).filter(Boolean).sort((a, b) => b.unread - a.unread);
const hidden = () => ls(K.hid, []).map(String);
window.adminHidden = (p) => hidden().includes(String(p.id));
window.adminFlash = (list) => { const ids = ls(K.flash, []).map(String); const sel = ids.length ? list.filter((p) => ids.includes(String(p.id))) : []; return sel.length ? sel : list.slice(0, 4); };

/* ---------- announcement ---------- */
const applyAnn = () => { const a = ls(K.ann, null); const c = document.querySelector('.announcement .container'); if (a && c) c.innerHTML = `🌿 <b>${E(a.bold)}</b><span>${E(a.text)}</span>`; };

/* ---------- panel shell ---------- */
const css = document.createElement('style');
css.textContent = `#admin-root{display:none;position:fixed;inset:0;z-index:10050;background:#f5f1ec;color:#251a1b;overflow:auto;font-size:14px}
#admin-root.open{display:block}.adm-wrap{display:grid;grid-template-columns:210px 1fr;min-height:100%}
.adm-side{background:#4a1420;color:#fff;padding:18px 12px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;gap:6px}
.adm-side h2{margin:0 8px 14px;font-size:18px}.adm-side button{text-align:left;padding:10px 12px;border-radius:8px;background:transparent;color:#eadde0}
.adm-side button.on{background:#fff;color:#4a1420;font-weight:700}.adm-side .sp{flex:1}
.adm-main{padding:22px;min-width:0}.adm-main h1{margin:0 0 16px;font-size:22px;color:#4a1420}
.adm-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:18px}
.adm-card,.adm-box{background:#fff;border-radius:12px;padding:16px;box-shadow:0 2px 0 #e8dfd9}.adm-card b{display:block;font-size:22px;color:#4a1420;margin-top:4px}.adm-card span{color:#7b7070;font-size:12px}
.adm-box{margin-bottom:16px}.adm-box h3{margin:0 0 12px;font-size:15px}
.adm-scroll{overflow-x:auto}.adm-main table{width:100%;border-collapse:collapse;min-width:640px}.adm-main th,.adm-main td{padding:9px 8px;border-bottom:1px solid #eee7e3;text-align:left;vertical-align:top}
.adm-main th{font-size:12px;color:#7b7070}.adm-empty{text-align:center!important;color:#7b7070;padding:24px!important}
.adm-btn{padding:7px 12px;border-radius:7px;background:#4a1420;color:#fff;font-weight:700;font-size:12px}.adm-btn.alt{background:#e9e5e2;color:#4a1420}.adm-btn.red{background:#b3322f}
.adm-main input,.adm-main select{padding:8px 10px;border:1px solid #ddd2cf;border-radius:7px;background:#fff;max-width:100%}
.adm-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}.adm-tag{display:inline-block;padding:2px 8px;border-radius:99px;background:#eee7e3;font-size:11px;font-weight:700}
.adm-tag.g{background:#dcf1e1;color:#2b6a3c}.adm-tag.r{background:#f6dcdb;color:#8f2623}.adm-tag.y{background:#fbefcf;color:#7a5a07}
.adm-bars div{display:flex;align-items:center;gap:8px;margin:6px 0;font-size:12px}.adm-bars i{display:block;height:10px;border-radius:5px;background:#4a1420;min-width:3px}
.adm-chat{display:grid;grid-template-columns:260px 1fr;gap:14px}.adm-clist{display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow:auto}
.adm-clist button{text-align:left;padding:10px;border-radius:9px;background:#fff;border:1px solid #eee7e3}.adm-clist button.on{border-color:#4a1420;background:#f8eef0}
.adm-msgs{display:flex;flex-direction:column;gap:8px;height:46vh;overflow:auto;padding:10px;background:#f7f7f7;border-radius:10px}
.adm-m{max-width:78%;padding:9px 12px;border-radius:14px;background:#fff;border:1px solid #eee;overflow-wrap:anywhere}.adm-m.me{align-self:flex-end;background:#f5e6e3}
.adm-rep{display:flex;gap:8px;margin-top:10px}.adm-rep input{flex:1}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#c24c63;margin-left:6px}
.adm-thumb{width:42px;height:42px;object-fit:cover;border-radius:6px;background:#ebe6e1}.adm-pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}.adm-pick label{display:flex;gap:8px;align-items:center;padding:8px;background:#f7f4f1;border-radius:8px}
.no-results{grid-column:1/-1;text-align:center;padding:40px 10px;color:#7b7070}
@media(max-width:760px){.adm-wrap{grid-template-columns:1fr}.adm-side{position:static;height:auto;flex-direction:row;overflow-x:auto;padding:10px}.adm-side h2{display:none}.adm-side button{white-space:nowrap}.adm-side .sp{display:none}.adm-main{padding:14px}.adm-chat{grid-template-columns:1fr}}`;
document.head.appendChild(css);
const root = document.createElement('div'); root.id = 'admin-root'; document.body.appendChild(root);
let tab = 'dash', ordF = 'All', ordQ = '', selChat = null;
const TABS = [['dash', '📊 Dashboard'], ['orders', '📦 Pesanan'], ['chat', '💬 Chat'], ['users', '👥 Pengguna'], ['products', '🛍 Produk'], ['reviews', '⭐ Ulasan'], ['settings', '⚙ Pengaturan']];
const tbl = (h, rows) => `<div class="adm-scroll"><table><thead><tr>${h.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${h.length}" class="adm-empty">Belum ada data.</td></tr>`}</tbody></table></div>`;
const stTag = (s) => `<span class="adm-tag ${s === 'Completed' ? 'g' : s === 'Cancelled' ? 'r' : 'y'}">${E(s)}</span>`;
const itemsOf = (o) => arr(o.items).map((i) => `${E(i.product && i.product.name)}${i.quantity > 1 ? ' ×' + i.quantity : ''}`).join(', ');

/* ---------- views ---------- */
const vDash = () => {
  const o = allOrders(), live = o.filter((x) => x.status !== 'Cancelled'), rev = live.reduce((s, x) => s + Number(x.total || 0), 0);
  const pend = o.filter((x) => ['Awaiting Payment', 'New', 'Processing'].includes(x.status)).length;
  const prods = baseProducts.length + sellerListings().filter((p) => p.status === 'Active').length;
  const max = Math.max(1, ...STAT.map((s) => o.filter((x) => x.status === s).length));
  return `<h1>Dashboard</h1><div class="adm-cards">${[['Total pesanan', o.length], ['Pendapatan', rp(rev)], ['Perlu diproses', pend], ['Pengguna', emails().length], ['Produk aktif', prods], ['Chat belum dibalas', chats().filter((c) => c.unread).length]].map(([a, b]) => `<div class="adm-card"><span>${a}</span><b>${b}</b></div>`).join('')}</div>
  <div class="adm-box"><h3>Status pesanan</h3><div class="adm-bars">${STAT.map((s) => { const n = o.filter((x) => x.status === s).length; return `<div><span style="width:130px">${s}</span><i style="width:${n / max * 60}%"></i><b>${n}</b></div>`; }).join('')}</div></div>
  <div class="adm-box"><h3>Pesanan terbaru</h3>${tbl(['ID', 'Pembeli', 'Total', 'Status'], o.slice(0, 5).map((x) => `<tr><td>${E(x.id)}</td><td>${E(x._e)}</td><td>${rp(x.total)}</td><td>${stTag(x.status)}</td></tr>`))}</div>`;
};
const vOrders = () => {
  let o = allOrders();
  if (ordF !== 'All') o = o.filter((x) => x.status === ordF);
  const q = ordQ.toLowerCase(); if (q) o = o.filter((x) => `${x.id} ${x._e} ${x.recipient}`.toLowerCase().includes(q));
  return `<h1>Pesanan</h1><div class="adm-bar"><input id="ord-q" placeholder="Cari ID / email / nama" value="${E(ordQ)}"><select id="ord-f" data-a="ordf"><option>All</option>${STAT.map((s) => `<option ${s === ordF ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
  <div class="adm-box">${tbl(['ID', 'Pembeli', 'Item', 'Total', 'Bayar', 'Tanggal', 'Status'], o.map((x) => `<tr><td><b>${E(x.id)}</b></td><td>${E(x._e)}<br><small>${E(x.recipient)} · ${E(x.phone)}<br>${E(x.address)}</small></td><td>${itemsOf(x)}</td><td>${rp(x.total)}</td><td>${E(x.paymentMethod)}<br><small>${E(x.paymentStatus)}</small></td><td>${dt(x.createdAt)}</td><td><select data-sel="${E(x.id)}">${STAT.map((s) => `<option ${s === x.status ? 'selected' : ''}>${s}</option>`).join('')}</select><br><button class="adm-btn" style="margin-top:6px" data-a="ost" data-k="${E(x._k)}" data-id="${E(x.id)}">Simpan</button></td></tr>`))}</div>`;
};
const vChat = () => {
  const list = chats(); if (!selChat && list[0]) selChat = list[0].e;
  const c = list.find((x) => x.e === selChat);
  if (c) { const rd = ls(K.read, {}); if (rd[c.e] !== c.m.length) { rd[c.e] = c.m.length; ss(K.read, rd); } }
  return `<h1>Chat Pelanggan</h1><div class="adm-chat"><div class="adm-clist">${list.map((x) => `<button class="${x.e === selChat ? 'on' : ''}" data-a="selchat" data-e="${E(x.e)}"><b>${E(x.e)}</b>${x.unread && x.e !== selChat ? '<span class="dot"></span>' : ''}<br><small>${E(String(x.m[x.m.length - 1].text).slice(0, 40))}</small></button>`).join('') || '<div class="adm-box">Belum ada pelanggan yang chat.</div>'}</div>
  <div>${c ? `<div class="adm-box" style="margin:0"><h3>${E(c.e)}</h3><div class="adm-msgs">${c.m.map((m) => `<div class="adm-m ${m.sender === 'user' ? '' : 'me'}">${E(m.text)}</div>`).join('')}</div><div class="adm-rep"><input id="adm-reply" placeholder="Tulis balasan untuk pelanggan..."><button class="adm-btn" data-a="send">Kirim</button></div></div>` : ''}</div></div>`;
};
const vUsers = () => {
  const sus = ls(K.sus, []), o = allOrders();
  return `<h1>Pengguna</h1><div class="adm-box">${tbl(['Email', 'Peran', 'Pesanan', 'Total belanja', 'Status', ''], emails().map((e) => { const mine = o.filter((x) => x._e === e); const bad = sus.includes(e); return `<tr><td>${E(e)}</td><td>${localStorage.getItem('rewear-seller-role-' + e) === 'seller' ? 'Seller' : 'Buyer'}</td><td>${mine.length}</td><td>${rp(mine.reduce((s, x) => s + Number(x.total || 0), 0))}</td><td>${bad ? '<span class="adm-tag r">Disuspend</span>' : '<span class="adm-tag g">Aktif</span>'}</td><td><button class="adm-btn ${bad ? 'alt' : 'red'}" data-a="sus" data-e="${E(e)}">${bad ? 'Aktifkan' : 'Suspend'}</button></td></tr>`; }))}<p style="color:#7b7070;font-size:12px">Daftar ini berisi akun yang pernah dipakai di browser ini.</p></div>`;
};
const vProducts = () => {
  const h = hidden();
  const rows = [...baseProducts.map((p) => ({ _id: String(p.id), p, src: 'Toko REWEAR', base: true })), ...sellerListings().map((p) => ({ _id: p._id, p, src: p._owner, base: false }))];
  return `<h1>Produk</h1><div class="adm-box">${tbl(['', 'Produk', 'Penjual', 'Harga', 'Status', ''], rows.map(({ _id, p, src, base }) => { const hid = h.includes(_id); return `<tr><td><img class="adm-thumb" src="${E(p.image)}" alt=""></td><td><b>${E(p.brand)}</b><br>${E(p.name)}</td><td>${E(src)}</td><td>${rp(p.price)}</td><td>${hid ? '<span class="adm-tag r">Disembunyikan</span>' : '<span class="adm-tag g">Tampil</span>'}</td><td><button class="adm-btn alt" data-a="hide" data-id="${E(_id)}">${hid ? 'Tampilkan' : 'Sembunyikan'}</button> ${base ? '' : `<button class="adm-btn red" data-a="del" data-k="${E(p._k)}" data-pid="${E(p.id)}">Hapus</button>`}</td></tr>`; }))}</div>`;
};
const vReviews = () => `<h1>Ulasan</h1><div class="adm-box">${tbl(['Pembeli', 'Produk', 'Rating', 'Ulasan', ''], reviews().map((r) => `<tr><td>${E(r.buyer)}</td><td>${E(r.product)}</td><td>${'★'.repeat(Number(r.rating) || 0)}</td><td>${E(r.text)}</td><td><button class="adm-btn red" data-a="delrev" data-k="${E(r._k)}" data-id="${E(r.id)}">Hapus</button></td></tr>`))}</div>`;
const vSettings = () => {
  const a = ls(K.ann, { bold: 'GRATIS ONGKIR', text: 'Belanja preloved, hemat sampai 80%!' }), fl = ls(K.flash, []).map(String);
  const vis = [...baseProducts, ...sellerMarketplaceProducts()].filter((p) => !hidden().includes(String(p.id)));
  return `<h1>Pengaturan Website</h1><div class="adm-box"><h3>Teks pengumuman (bar atas)</h3><div class="adm-bar"><input id="ann-b" value="${E(a.bold)}" placeholder="Teks tebal"><input id="ann-t" style="flex:1;min-width:220px" value="${E(a.text)}" placeholder="Teks"></div><button class="adm-btn" data-a="annsave">Simpan</button> <button class="adm-btn alt" data-a="annreset">Reset</button></div>
  <div class="adm-box"><h3>Produk Flash Sale</h3><p style="color:#7b7070;margin-top:0">Pilih produk yang tampil di Flash Sale. Kosongkan semua untuk default (4 produk pertama).</p><div class="adm-pick">${vis.map((p) => `<label><input type="checkbox" data-fid="${E(p.id)}" ${fl.includes(String(p.id)) ? 'checked' : ''}> ${E(p.brand)} – ${E(p.name)}</label>`).join('')}</div><p><button class="adm-btn" data-a="flashsave">Simpan Flash Sale</button> <button class="adm-btn alt" data-a="flashreset">Reset</button></p></div>`;
};
const VIEW = { dash: vDash, orders: vOrders, chat: vChat, users: vUsers, products: vProducts, reviews: vReviews, settings: vSettings };
const paint = () => {
  const a = document.activeElement, id = a && root.contains(a) ? a.id : '', v = a && a.value, s = a && a.selectionStart;
  root.innerHTML = `<div class="adm-wrap"><aside class="adm-side"><h2>REWEAR Admin</h2>${TABS.map(([k, l]) => `<button class="${k === tab ? 'on' : ''}" data-a="tab" data-t="${k}">${l}</button>`).join('')}<div class="sp"></div><button data-a="logout">⎋ Keluar</button></aside><main class="adm-main">${VIEW[tab]()}</main></div>`;
  if (id) { const n = root.querySelector('#' + id); if (n) { if (v !== undefined && n.tagName !== 'SELECT') n.value = v; n.focus(); try { n.setSelectionRange(s, s); } catch {} } }
  const m = root.querySelector('.adm-msgs'); if (m) m.scrollTop = m.scrollHeight;
};
const openAdmin = () => { root.classList.add('open'); document.body.style.overflow = 'hidden'; paint(); };
const closeAdmin = () => { root.classList.remove('open'); document.body.style.overflow = ''; };

/* ---------- actions ---------- */
const setStatus = (key, id, st) => {
  const l = arr(ls(key, [])), o = l.find((x) => x.id === id); if (!o) return;
  o.status = st; o.orderStatus = st;
  if (['Processing', 'Shipped', 'Completed'].includes(st) && o.paymentStatus === 'Menunggu pembayaran') o.paymentStatus = 'Sudah dibayar';
  ss(key, l);
  const buyer = key.slice(14);
  keys('rewear-seller-').filter((k) => k.endsWith('-orders')).forEach((k) => { const sl = arr(ls(k, [])); let ch = false; sl.forEach((so) => { if (so.buyerOrderId === id && String(so.buyerKey).toLowerCase() === buyer) { so.status = st; ch = true; } }); if (ch) ss(k, sl); });
};
root.addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]'); if (!b || b.tagName === 'SELECT') return;
  const a = b.dataset.a, d = b.dataset;
  if (a === 'tab') { tab = d.t; }
  else if (a === 'logout') { sessionStorage.removeItem('rewear-admin-session'); closeAdmin(); history.replaceState(null, '', location.pathname + location.search); render(); toast('Admin berhasil keluar.'); return; }
  else if (a === 'ost') { const s = root.querySelector(`[data-sel="${CSS.escape(d.id)}"]`); setStatus(d.k, d.id, s.value); toast('Status pesanan diperbarui.'); }
  else if (a === 'selchat') { selChat = d.e; }
  else if (a === 'send') { const i = root.querySelector('#adm-reply'), t = i.value.trim(); if (!t) return; const k = 'rewear-chat-' + selChat; const rooms = arr(ls(k, [])); let r = rooms.find((x) => x.room === 'helper'); if (!r) { r = { room: 'helper', name: 'Rewear Helper', messages: [] }; rooms.push(r); } r.messages.push({ sender: 'other', text: t, createdAt: Date.now() }); ss(k, rooms); i.value = ''; toast('Balasan terkirim.'); }
  else if (a === 'sus') { let s = ls(K.sus, []); s = s.includes(d.e) ? s.filter((x) => x !== d.e) : [...s, d.e]; ss(K.sus, s); }
  else if (a === 'hide') { let h = hidden(); h = h.includes(d.id) ? h.filter((x) => x !== d.id) : [...h, d.id]; ss(K.hid, h); render(); }
  else if (a === 'del') { if (!confirm('Hapus produk ini secara permanen?')) return; ss(d.k, arr(ls(d.k, [])).filter((p) => String(p.id) !== d.pid)); render(); }
  else if (a === 'delrev') { if (!confirm('Hapus ulasan ini?')) return; ss(d.k, arr(ls(d.k, [])).filter((r) => String(r.id) !== d.id)); }
  else if (a === 'annsave') { ss(K.ann, { bold: root.querySelector('#ann-b').value.trim(), text: root.querySelector('#ann-t').value.trim() }); applyAnn(); toast('Pengumuman diperbarui.'); }
  else if (a === 'annreset') { localStorage.removeItem(K.ann); const c = document.querySelector('.announcement .container'); if (c) c.innerHTML = '🌿 <b>GRATIS ONGKIR</b><span>Belanja preloved, hemat sampai 80%!</span>'; }
  else if (a === 'flashsave') { ss(K.flash, [...root.querySelectorAll('[data-fid]:checked')].map((x) => x.dataset.fid)); render(); toast('Flash Sale diperbarui.'); }
  else if (a === 'flashreset') { localStorage.removeItem(K.flash); render(); toast('Flash Sale dikembalikan ke default.'); }
  paint();
});
root.addEventListener('input', (e) => { if (e.target.id === 'ord-q') { ordQ = e.target.value; paint(); } });
root.addEventListener('change', (e) => { if (e.target.id === 'ord-f') { ordF = e.target.value; paint(); } });
root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'adm-reply') { e.preventDefault(); root.querySelector('[data-a="send"]').click(); } });

/* ---------- login intercept (admin + suspended accounts) ---------- */
document.addEventListener('submit', (e) => {
  const f = e.target; if (!f || f.id !== 'auth-form') return;
  const fd = new FormData(f), em = String(fd.get('email') || '').trim().toLowerCase(), pw = String(fd.get('password') || '');
  if (em === ADMIN.email) {
    e.preventDefault(); e.stopPropagation();
    if (pw === ADMIN.pass) { sessionStorage.setItem('rewear-admin-session', '1'); closeModal(); render(); openAdmin(); } else toast('Email atau password admin salah.');
    return;
  }
  if (ls(K.sus, []).includes(em)) { e.preventDefault(); e.stopPropagation(); toast('Akun ini disuspend oleh admin.'); }
}, true);

/* ---------- hooks into existing render ---------- */
const _render = render;
render = function () {
  const u = state.user;
  if (u && ls(K.sus, []).includes(String(u.email || '').toLowerCase())) { localStorage.removeItem('rewear-user'); state.user = null; try { firebaseAuth && firebaseAuth.signOut(); } catch {} setTimeout(() => toast('Akun kamu disuspend oleh admin.'), 60); }
  _render.apply(this, arguments);
  const g = document.querySelector('#products-grid');
  if (g && !g.children.length) g.innerHTML = `<p class="no-results">😕 Produk ${state.search ? '"' + E(state.search) + '" ' : ''}tidak ditemukan. Coba kata kunci atau filter lain.</p>`;
};

/* ---------- live sync between tabs ---------- */
window.addEventListener('storage', (e) => {
  if (!e.key) return;
  if (e.key.startsWith('rewear-chat-') && state.user && e.key === 'rewear-chat-' + accountKey()) { hydrateAccount(); if (state.modal === 'chat') renderModal(); }
  if (root.classList.contains('open') && ['dash', 'orders', 'chat', 'users'].includes(tab)) paint();
});

/* ---------- search fix ---------- */
const si = document.querySelector('#search'), sb = document.querySelector('#search-button');
const doSearch = () => { state.search = si.value; render(); setMobilePage('products'); document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); };
sb.onclick = doSearch;
si.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });

/* Google login can't work when the page is opened as a plain file (file://) */
document.addEventListener('click', (e) => { const g = e.target.closest && e.target.closest('[data-google]'); if (g && location.protocol === 'file:') { e.preventDefault(); e.stopPropagation(); toast('Login Google tidak bisa dari file langsung. Jalankan lewat Live Server (http://localhost).'); } }, true);

applyAnn();
render();
if (isAdmin()) openAdmin();
/* shortcut: open Rewear.html#admin to reach the admin login even if a customer is logged in */
const hashCheck = () => { if (location.hash === '#admin') { if (isAdmin()) openAdmin(); else { try { openAuth('login'); } catch {} } } };
window.addEventListener('hashchange', hashCheck); hashCheck();
})();
