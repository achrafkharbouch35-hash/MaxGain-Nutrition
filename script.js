const products = [
  {
    id: 1,
    name: "Whey Protein",
    category: "protein",
    categoryLabel: "PROTÉINES",
    description: "Pour compléter tes apports quotidiens en protéines.",
    price: 349,
    oldPrice: 399,
    badge: "BEST SELLER",
    rating: "★★★★★",
    ratingCount: "(128)",
    size: "1 kg",
    flavour: "Chocolat",
    color: "orange",
    type: "WHEY",
    detail: "PROTEIN BLEND",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Creatine Monohydrate",
    category: "performance",
    categoryLabel: "PERFORMANCE",
    description: "Un complément populaire pour les efforts intenses.",
    price: 219,
    oldPrice: null,
    badge: "ESSENTIEL",
    rating: "★★★★★",
    ratingCount: "(94)",
    size: "300 g",
    flavour: "Neutre",
    color: "light",
    type: "CREATINE",
    detail: "PURE FORMULA",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Pre-Workout",
    category: "performance",
    categoryLabel: "PERFORMANCE",
    description: "Une formule pré-entraînement à découvrir.",
    price: 279,
    oldPrice: null,
    badge: "TRAINING",
    rating: "★★★★☆",
    ratingCount: "(61)",
    size: "300 g",
    flavour: "Fruits rouges",
    color: "red",
    type: "PRE-WORKOUT",
    detail: "TRAINING FORMULA",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Mass Gainer",
    category: "protein",
    categoryLabel: "PRISE DE MASSE",
    description: "Pour compléter les besoins énergétiques de ta routine.",
    price: 399,
    oldPrice: 449,
    badge: "VALUE PACK",
    rating: "★★★★★",
    ratingCount: "(76)",
    size: "2 kg",
    flavour: "Vanille",
    color: "blue",
    type: "MASS GAINER",
    detail: "CALORIE BLEND",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Daily Vitamins",
    category: "wellness",
    categoryLabel: "BIEN-ÊTRE",
    description: "Un complément à utiliser selon son étiquette.",
    price: 159,
    oldPrice: null,
    badge: "DAILY",
    rating: "★★★★☆",
    ratingCount: "(43)",
    size: "60 tabs",
    flavour: "Comprimés",
    color: "green",
    type: "VITAMINS",
    detail: "DAILY SUPPORT",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Recovery Blend",
    category: "wellness",
    categoryLabel: "RÉCUPÉRATION",
    description: "Une option à intégrer à une routine équilibrée.",
    price: 189,
    oldPrice: null,
    badge: "RECOVERY",
    rating: "★★★★★",
    ratingCount: "(38)",
    size: "400 g",
    flavour: "Citron",
    color: "purple",
    type: "RECOVERY",
    detail: "POST-TRAINING",
    image: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=700&q=80"
  }
];

const grid = document.getElementById("product-grid");

let cart = [];
let favorites = new Set();
let activeFilter = "all";
let sortMode = "featured";
let toastTimer;

// Charger les données sauvegardées sans planter si elles sont invalides.
try {
  const savedCart = JSON.parse(localStorage.getItem("forgeCart") || "[]");
  if (Array.isArray(savedCart)) {
    cart = savedCart.filter(item =>
      products.some(product => product.id === item.id) &&
      Number.isInteger(item.qty) &&
      item.qty > 0
    );
  }

  const savedFavorites = JSON.parse(
    localStorage.getItem("forgeFavorites") || "[]"
  );

  if (Array.isArray(savedFavorites)) {
    favorites = new Set(
      savedFavorites.filter(id => products.some(p => p.id === id))
    );
  }
} catch (error) {
  console.warn("Impossible de charger les données sauvegardées.");
}

function formatPrice(price) {
  return `${price.toLocaleString("fr-FR")} DH`;
}

function tubMarkup(product) {
  const type = product.type.replace(" ", "<br>");

  return `
    <div class="mini-tub ${product.color}">
      <span class="mini-brand">FORGE</span>
      <span class="mini-stripe"></span>
      <span class="mini-type">${type}</span>
      <span class="mini-detail">${product.detail}</span>
    </div>
  `;
}

// AFFICHER LES PRODUITS
function renderProducts() {
  let list = products.filter(product =>
    activeFilter === "all" ||
    product.category === activeFilter
  );

  if (sortMode === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sortMode === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  grid.innerHTML = list.map((product, index) => `
    <article class="product-card"
      style="animation-delay:${index * 70}ms">

      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        >

        <span class="product-badge">${product.badge}</span>

        <button
          class="product-wish ${favorites.has(product.id) ? "liked" : ""}"
          data-favorite="${product.id}"
          aria-label="Ajouter ${product.name} aux favoris"
        >
          <i data-lucide="heart"></i>
        </button>

        <div class="product-visual">
          ${tubMarkup(product)}
        </div>
      </div>

      <div class="product-info">
        <div class="product-meta">
          <span>${product.categoryLabel}</span>
          <span class="product-rating">
            ${product.rating}
            <span style="color:#777">${product.ratingCount}</span>
          </span>
        </div>

        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="product-buy-row">
          <div class="product-price">
            ${formatPrice(product.price)}
            ${
              product.oldPrice
                ? `<small><s>${formatPrice(product.oldPrice)}</s></small>`
                : ""
            }
          </div>

          <button class="add-button" data-add="${product.id}">
            <i data-lucide="plus"></i> AJOUTER
          </button>
        </div>
      </div>
    </article>
  `).join("");

  if (window.lucide) lucide.createIcons();
}

// SAUVEGARDER LE PANIER ET LES FAVORIS
function saveCart() {
  try {
    localStorage.setItem("forgeCart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Le panier ne peut pas être sauvegardé.");
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(
      "forgeFavorites",
      JSON.stringify([...favorites])
    );
  } catch (error) {
    console.warn("Les favoris ne peuvent pas être sauvegardés.");
  }
}

// NOTIFICATION ANIMÉE
function showToast(message) {
  const toast = document.getElementById("toast");

  toast.querySelector("span").textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// AJOUTER AU PANIER
function addToCart(id) {
  const item = cart.find(item => item.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart();
  renderCart();

  const product = products.find(product => product.id === id);
  showToast(`${product.name} ajouté au panier`);
}

// MODIFIER LA QUANTITÉ
function changeQty(id, delta) {
  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  renderCart();
}

// RETIRER UN PRODUIT
function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

// METTRE À JOUR LE PANIER
function renderCart() {
  const totalQty = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  document.querySelector(".cart-count").textContent = totalQty;

  document.getElementById("cart-total-count").textContent =
    `(${totalQty})`;

  document.getElementById("subtotal").textContent =
    formatPrice(total);

  const itemsContainer = document.getElementById("cart-items");

  itemsContainer.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);

    return `
      <div class="cart-line">
        <div class="cart-thumb">
          ${tubMarkup(product)}
        </div>

        <div>
          <h4>${product.name}</h4>
          <small>${product.size} · ${product.flavour}</small>

          <div class="quantity-control">
            <button data-qty="-1" data-id="${product.id}"
              aria-label="Diminuer">−</button>

            <span>${item.qty}</span>

            <button data-qty="1" data-id="${product.id}"
              aria-label="Augmenter">+</button>

            <button class="remove-item"
              data-remove="${product.id}">
              Retirer
            </button>
          </div>
        </div>

        <div class="cart-line-price">
          ${formatPrice(product.price * item.qty)}
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("cart-empty")
    .classList.toggle("show", cart.length === 0);

  document.getElementById("cart-bottom")
    .classList.toggle("hidden", cart.length === 0);

  if (window.lucide) lucide.createIcons();
}

// OUVRIR ET FERMER LE PANIER
function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("backdrop").classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("backdrop").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

document.getElementById("cart-open").addEventListener(
  "click", openCart
);

document.getElementById("cart-close").addEventListener(
  "click", closeCart
);

document.getElementById("backdrop").addEventListener(
  "click", closeCart
);

document.getElementById("continue-shopping").addEventListener(
  "click", () => {
    closeCart();
    document.getElementById("shop").scrollIntoView({
      behavior: "smooth"
    });
  }
);

// RECHERCHE
function openSearch() {
  const modal = document.getElementById("search-modal");

  modal.classList.add("open");
  document.body.classList.add("no-scroll");

  renderSearch();

  setTimeout(() => {
    document.getElementById("search-input").focus();
  }, 100);
}

function closeSearch() {
  document.getElementById("search-modal").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function renderSearch(query = "") {
  const q = query.trim().toLowerCase();

  const results = products.filter(product =>
    `${product.name} ${product.categoryLabel} ${product.description}`
      .toLowerCase()
      .includes(q)
  );

  const container = document.getElementById("search-results");

  if (results.length === 0) {
    container.innerHTML = `
      <p style="color:#aaa;font-size:12px">
        Aucun produit trouvé. Essaie « whey » ou « créatine ».
      </p>
    `;
    return;
  }

  container.innerHTML = results.map(product => `
    <div class="search-result" data-search-product="${product.id}">
      <span>
        ${product.name}<br>
        <small>${product.categoryLabel} · ${product.size}</small>
      </span>
      <b>${formatPrice(product.price)}</b>
    </div>
  `).join("");
}

document.getElementById("search-open").addEventListener(
  "click", openSearch
);

document.getElementById("search-close").addEventListener(
  "click", closeSearch
);

document.getElementById("search-modal").addEventListener(
  "click", event => {
    if (event.target.id === "search-modal") closeSearch();
  }
);

document.getElementById("search-input").addEventListener(
  "input", event => renderSearch(event.target.value)
);

// FILTRES ET TRI
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    activeFilter = button.dataset.filter;

    renderProducts();
  });
});

document.getElementById("sort").addEventListener(
  "change", event => {
    sortMode = event.target.value;
    renderProducts();
  }
);

// INTERACTIONS DES CARTES ET DU PANIER
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite]");

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);

    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    saveFavorites();
    renderProducts();
    return;
  }

  const quantityButton = event.target.closest("[data-qty]");

  if (quantityButton) {
    changeQty(
      Number(quantityButton.dataset.id),
      Number(quantityButton.dataset.qty)
    );
    return;
  }

  const removeButton = event.target.closest("[data-remove]");

  if (removeButton) {
    removeItem(Number(removeButton.dataset.remove));
    return;
  }

  const searchResult = event.target.closest("[data-search-product]");

  if (searchResult) {
    closeSearch();

    document.getElementById("shop").scrollIntoView({
      behavior: "smooth"
    });
  }
});

// MENU MOBILE
document.getElementById("menu-open").addEventListener(
  "click", () => {
    document.getElementById("nav").classList.toggle("open");
  }
);

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("nav").classList.remove("open");
  });
});

// NEWSLETTER : DÉMONSTRATION
document.getElementById("newsletter-form").addEventListener(
  "submit", event => {
    event.preventDefault();

    document.getElementById("newsletter-msg").textContent =
      "Merci ! Démonstration uniquement : aucune donnée n’a été envoyée.";

    document.getElementById("email").value = "";

    showToast("Inscription de démonstration enregistrée");
  }
);

// BOUTON DE COMMANDE : PAS DE PAIEMENT RÉEL
document.getElementById("checkout").addEventListener(
  "click", () => {
    showToast("Démo : connecte un backend pour activer les commandes.");
  }
);

// HEADER ET BOUTON RETOUR EN HAUT
const backTop = document.getElementById("back-top");

window.addEventListener("scroll", () => {
  document.querySelector(".header")
    .classList.toggle("scrolled", window.scrollY > 30);

  backTop.classList.toggle("visible", window.scrollY > 550);
}, { passive: true });

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ANIMATIONS AU SCROLL
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach(element => {
    element.classList.add("visible");
  });
}

// EFFET 3D SUR LES CARTES STACK
document.querySelectorAll(".stack-card").forEach(card => {
  card.addEventListener("mousemove", event => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = card.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform =
      `perspective(700px) rotateY(${x * 5}deg) ` +
      `rotateX(${-y * 5}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// FERMER LES FENÊTRES AVEC ESCAPE
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeSearch();
  }
});

// INITIALISATION
renderProducts();
renderCart();

if (window.lucide) {
  lucide.createIcons();
}
