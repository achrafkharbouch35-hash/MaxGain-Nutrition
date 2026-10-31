/* =====================================
   CONFIGURATION : MODIFIE TES COORDONNÉES
===================================== */

const CONFIG = {
  whatsapp: "212600000000", // Ton numéro sans + ni espaces
  instagram: "https://www.instagram.com/TON_COMPTE/"
};

/* =====================================
   PRODUITS : MODIFIE LES INFOS ET IMAGES
=====================================

Pour changer une image :
1. Mets ta photo dans le dossier images.
2. Change simplement le chemin image ci-dessous.
*/

const products = [
  {
    id: 1,
    name: "Whey Protein",
    category: "protein",
    label: "PROTÉINES",
    description: "Protéines en poudre - format 2 kg.",
    price: 650,
    image: "images/whey.jpg"
  },
  {
    id: 2,
    name: "Creatine Monohydrate",
    category: "creatine",
    label: "CRÉATINE",
    description: "Créatine monohydrate - format 300 g.",
    price: 280,
    image: "images/creatine.jpg"
  },
  {
    id: 3,
    name: "Pre Workout",
    category: "preworkout",
    label: "PRÉ-WORKOUT",
    description: "Complément pré-entraînement.",
    price: 320,
    image: "images/preworkout.jpg"
  },
  {
    id: 4,
    name: "Mass Gainer",
    category: "protein",
    label: "PROTÉINES",
    description: "Préparation en poudre - format 3 kg.",
    price: 590,
    image: "images/gainer.jpg"
  },
  {
    id: 5,
    name: "Shaker Sport",
    category: "accessories",
    label: "ACCESSOIRES",
    description: "Shaker pour tes boissons sportives.",
    price: 90,
    image: "images/shaker.jpg"
  },
  {
    id: 6,
    name: "Wrist Straps",
    category: "accessories",
    label: "ACCESSOIRES",
    description: "Accessoire d'entraînement.",
    price: 120,
    image: "images/straps.jpg"
  }
];

/* =====================================
   ÉTAT DU SITE
===================================== */

let cart = [];
let favorites = [];
let currentCategory = "all";

const $ = id => document.getElementById(id);
const money = value => `${value.toLocaleString("fr-FR")} DH`;

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

/* =====================================
   AFFICHAGE DES PRODUITS
===================================== */

function renderProducts() {
  const grid = $("product-grid");
  let list = products.filter(p =>
    currentCategory === "all" || p.category === currentCategory
  );

  const sort = $("sort").value;
  if (sort === "low") list.sort((a,b) => a.price - b.price);
  if (sort === "high") list.sort((a,b) => b.price - a.price);
  if (sort === "name") list.sort((a,b) => a.name.localeCompare(b.name));

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}"
             onerror="this.src='https://placehold.co/600x600/222222/f97316?text=Ajoute+une+photo'">
        <button class="favorite ${favorites.includes(p.id) ? "active" : ""}"
                onclick="toggleFavorite(${p.id})">♥</button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.label}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(p.price)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">AJOUTER +</button>
        </div>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    renderProducts();
  });
});

$("sort").addEventListener("change", renderProducts);

/* =====================================
   FAVORIS
===================================== */

function toggleFavorite(id) {
  favorites = favorites.includes(id)
    ? favorites.filter(item => item !== id)
    : [...favorites, id];

  renderProducts();
}

/* =====================================
   PANIER
===================================== */

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });

  renderCart();
  showToast(`${product.name} ajouté au panier`);
}

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  renderCart();
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  $("cart-count").textContent = count;
  $("cart-title-count").textContent = count;
  $("subtotal").textContent = money(getSubtotal());

  $("cart-empty").style.display = cart.length ? "none" : "block";
  $("cart-footer").style.display = cart.length ? "block" : "none";

  $("cart-items").innerHTML = cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}"
        onerror="this.src='https://placehold.co/100x100/222222/f97316?text=Photo'">
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price * item.quantity)}</p>
        <div class="qty">
          <button onclick="changeQuantity(${item.id},-1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id},1)">+</button>
        </div>
      </div>
    </div>
  `).join("");
}

/* =====================================
   COMMANDE WHATSAPP
===================================== */

$("checkout").addEventListener("click", () => {
  if (!cart.length) return;

  if (CONFIG.whatsapp === "212600000000") {
    showToast("Configure ton numéro WhatsApp dans script.js");
    return;
  }

  let message = "Bonjour FORGE NUTRITION ! Je souhaite passer cette commande :\n\n";

  cart.forEach(item => {
    message += `• ${item.name}\n`;
    message += `  Quantité : ${item.quantity}\n`;
    message += `  Prix : ${money(item.price * item.quantity)}\n\n`;
  });

  message += `TOTAL : ${money(getSubtotal())}\n\n`;
  message += "Merci de me confirmer la disponibilité et la livraison.";

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

/* =====================================
   OUVERTURE / FERMETURE DU PANIER
===================================== */

function openCart() {
  $("cart-drawer").classList.add("open");
  $("overlay").classList.add("show");
}

function closeCart() {
  $("cart-drawer").classList.remove("open");
  $("overlay").classList.remove("show");
}

$("cart-open").addEventListener("click", openCart);
$("cart-close").addEventListener("click", closeCart);
$("overlay").addEventListener("click", closeCart);
$("continue-shopping").addEventListener("click", closeCart);

/* =====================================
   RECHERCHE
===================================== */

function searchProducts(value) {
  const term = value.toLowerCase().trim();
  const results = products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.label.toLowerCase().includes(term)
  );

  $("search-results").innerHTML = results.map(p => `
    <div class="search-result" onclick="addToCart(${p.id})">
      <img src="${p.image}" alt="${p.name}">
      <div><strong>${p.name}</strong><p>${money(p.price)}</p></div>
    </div>
  `).join("") || "<p>Aucun produit trouvé.</p>";
}

$("search-open").addEventListener("click", () => {
  $("search-modal").classList.add("open");
  $("search-input").focus();
});

$("search-close").addEventListener("click", () => {
  $("search-modal").classList.remove("open");
});

$("search-input").addEventListener("input", e => {
  searchProducts(e.target.value);
});

/* =====================================
   MENU MOBILE
===================================== */

$("menu-open").addEventListener("click", () => {
  $("nav").classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => $("nav").classList.remove("open"));
});

/* =====================================
   INSTAGRAM ET WHATSAPP
===================================== */

$("contact-whatsapp").href = `https://wa.me/${CONFIG.whatsapp}`;
$("footer-whatsapp").href = `https://wa.me/${CONFIG.whatsapp}`;
$("contact-instagram").href = CONFIG.instagram;
$("footer-instagram").href = CONFIG.instagram;

/* =====================================
   ANIMATIONS AU SCROLL
===================================== */

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".product-card, .about-copy, .about-image").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

/* =====================================
   RACCOURCI ECHAP
===================================== */

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeCart();
    $("search-modal").classList.remove("open");
  }
});

/* INITIALISATION */
renderProducts();
renderCart();
