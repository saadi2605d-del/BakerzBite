// BAKERZ BITE — BANDA 2 / interactive storefront
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $("#preloader")?.classList.add("done"), 450);
});
$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
$$(".main-nav a").forEach(a => a.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Reveal-on-scroll effects
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  $$(".reveal").forEach(el => revealObserver.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("visible"));
}

// Product category filtering
$$(".category-tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".category-tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  const category = tab.dataset.category;
  $$(".product-card").forEach(card => {
    card.classList.toggle("hidden", category !== "all" && card.dataset.category !== category);
  });
}));

// Shopping cart
let cart = [];
const cartDrawer = $("#cartDrawer");
const cartOverlay = $("#cartOverlay");
const money = amount => "Rs. " + Number(amount).toLocaleString("en-PK");

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

function addToCart(card) {
  const name = card.dataset.name;
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty += 1;
  else cart.push({
    name, price: Number(card.dataset.price), image: card.dataset.image, qty: 1
  });
  renderCart();
  const toast = $("#toast");
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}
$$(".quick-add").forEach(button => {
  button.addEventListener("click", () => addToCart(button.closest(".product-card")));
});

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartTotal").textContent = money(total);
  const holder = $("#cartItems");
  if (!cart.length) {
    holder.innerHTML = '<div class="cart-empty"><span>✧</span><h4>Your cart is waiting.</h4><p>Add a little sweetness to get started.</p></div>';
    return;
  }
  holder.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div><h4>${escapeHTML(item.name)}</h4><p>${money(item.price)}</p>
        <div class="qty-controls">
          <button data-action="minus" data-index="${index}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button data-action="plus" data-index="${index}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item" data-action="remove" data-index="${index}" aria-label="Remove ${escapeHTML(item.name)}">×</button>
    </div>`).join("");
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}
$("#cartItems").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const index = Number(button.dataset.index);
  const action = button.dataset.action;
  if (action === "plus") cart[index].qty++;
  if (action === "minus") cart[index].qty--;
  if (action === "remove" || cart[index]?.qty <= 0) cart.splice(index, 1);
  renderCart();
});

// WhatsApp checkout: replace with the bakery's real WhatsApp number.
const WHATSAPP_NUMBER = "923001234567";
$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    $("#toast").textContent = "Your cart is empty — add a treat first.";
    $("#toast").classList.add("show");
    setTimeout(() => $("#toast").classList.remove("show"), 1800);
    return;
  }
  const lines = cart.map(item => `${item.qty} x ${item.name} — ${money(item.price * item.qty)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = `Hello Bakerz Bite! I would like to place this order:\n\n${lines.join("\n")}\n\nSubtotal: ${money(total)}\nPlease confirm availability and delivery details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

// WhatsApp quick contact link
$("#whatsappLink").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Bakerz Bite! I'd like to ask about your menu.")}`;

// Reviews carousel
let reviewIndex = 0;
const reviewTrack = $("#reviewTrack");
function moveReviews(direction) {
  const cards = $$(".review-card", reviewTrack);
  if (!cards.length) return;
  const visible = window.innerWidth <= 560 ? 1 : window.innerWidth <= 800 ? 2 : 3;
  const max = Math.max(0, cards.length - visible);
  reviewIndex = Math.max(0, Math.min(max, reviewIndex + direction));
  const gap = 18;
  const width = cards[0].getBoundingClientRect().width + gap;
  reviewTrack.style.transform = `translateX(-${reviewIndex * width}px)`;
}
$("#reviewPrev").addEventListener("click", () => moveReviews(-1));
$("#reviewNext").addEventListener("click", () => moveReviews(1));
window.addEventListener("resize", () => { reviewIndex = 0; moveReviews(0); });

// Newsletter demo (connect to a mailing service for real subscriptions)
$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  $("#newsletterStatus").textContent = "Thanks for joining our sweet list!";
  event.currentTarget.reset();
});

// Contact form opens the visitor's email app; configure a real inbox before launch.
$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const subject = encodeURIComponent(`Bakerz Bite enquiry — ${data.get("topic")}`);
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nTopic: ${data.get("topic")}\n\n${data.get("message")}`
  );
  $("#formStatus").textContent = "Opening your email app to send this enquiry…";
  window.location.href = `mailto:hello@bakerzbite.com?subject=${subject}&body=${body}`;
});
renderCart();