const products = [
  { id: "LK-001", title: "Модель LK-001", category: "Детский трикотаж", description: "Фото модели из предварительной подборки. Возраст, состав, размеры и наличие уточняются.", searchTerms: ["Детская пижама светлого цвета"], src: "./public/images/17861036598580539.jpg" },
  { id: "LK-002", title: "Модель LK-002", category: "Детский трикотаж", description: "Фото модели из предварительной подборки. Возраст, состав, размеры и наличие уточняются.", searchTerms: ["Детская пижама розового цвета"], src: "./public/images/17872721088487035.jpg" },
  { id: "LK-003", title: "Модель LK-003", category: "Детский трикотаж", description: "Фото модели из предварительной подборки. Возраст, состав, размеры и наличие уточняются.", searchTerms: ["Детская одежда с цветным принтом"], src: "./public/images/17860733421585008.jpg" },
  { id: "LK-004", title: "Модель LK-004", category: "Детский трикотаж", description: "Фото модели из предварительной подборки. Возраст, состав, размеры и наличие уточняются.", src: "./public/images/17874270624581928.jpg" },
  { id: "LK-005", title: "Модель LK-005", category: "Детский трикотаж", description: "Фото модели из предварительной подборки. Возраст, состав, размеры и наличие уточняются.", src: "./public/images/17870661123599568.jpg" }
];

const savedSelection = JSON.parse(localStorage.getItem("lumaKidsSelection") || "[]");
const selected = new Set(savedSelection);
const grid = document.querySelector("#productGrid");
const selectedModels = document.querySelector("#selectedModels");
const result = document.querySelector("#formResult");
const dialog = document.querySelector("#productDialog");
const dialogContent = document.querySelector("#dialogContent");
const saveSelected = () => localStorage.setItem("lumaKidsSelection", JSON.stringify([...selected]));

const heroVideo = document.querySelector(".hero-video");
if (heroVideo) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallScreen = window.matchMedia("(max-width: 650px)");
  const syncHeroVideo = () => {
    if (reducedMotion.matches || smallScreen.matches) {
      heroVideo.pause();
      heroVideo.autoplay = false;
      heroVideo.classList.remove("is-playing");
      return;
    }
    heroVideo.autoplay = true;
    heroVideo.preload = "auto";
    if (heroVideo.readyState === 0) heroVideo.load();
    heroVideo.play().then(() => {
      if (!heroVideo.paused) heroVideo.classList.add("is-playing");
    }).catch(() => heroVideo.classList.remove("is-playing"));
  };
  heroVideo.addEventListener("playing", () => heroVideo.classList.add("is-playing"));
  heroVideo.addEventListener("pause", () => heroVideo.classList.remove("is-playing"));
  heroVideo.addEventListener("error", () => heroVideo.classList.remove("is-playing"));
  syncHeroVideo();
  reducedMotion.addEventListener?.("change", syncHeroVideo);
  smallScreen.addEventListener?.("change", syncHeroVideo);
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const ageLabel = () => "Возраст уточняется";

function productCard(product) {
  const isSelected = selected.has(product.id);
  return `<article class="product-card${isSelected ? " is-selected" : ""}" data-id="${product.id}">
    <button class="product-image product-open" type="button" aria-label="Подробнее: ${escapeHtml(product.title)}">
      <img src="${product.src}" alt="${escapeHtml(product.title)}" loading="lazy">
      <span class="product-number">${product.id}</span>
      <span class="selected-mark" aria-hidden="true">${isSelected ? "✓" : "+"}</span>
    </button>
    <div class="product-title"><span><b>${escapeHtml(product.title)}</b><small>${escapeHtml(product.category)} · ${ageLabel(product)}</small></span><button class="select-btn" type="button" data-select="${product.id}">${isSelected ? "Выбрано" : "Выбрать"}</button></div>
  </article>`;
}

function renderSelected() {
  if (!selectedModels) return;
  const items = products.filter(product => selected.has(product.id));
  selectedModels.innerHTML = items.length
    ? items.map(product => `<div class="selected-model"><span>${escapeHtml(product.title)} <small>${product.id}</small></span><button type="button" data-remove="${product.id}" aria-label="Убрать ${escapeHtml(product.title)}">×</button></div>`).join("")
    : "<p>Пока ничего не выбрано. Добавьте модели в каталоге.</p>";
  selectedModels.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => {
    selected.delete(button.dataset.remove);
    saveSelected();
    renderCatalog();
    renderFeatured();
    renderSelected();
    renderSelectionBar();
  }));
}

function renderSelectionBar() {
  const toggle = document.querySelector("#shopperToggle");
  const count = document.querySelector("#shopperCount");
  const heading = document.querySelector("#shopperHeading");
  const itemsContainer = document.querySelector("#shopperItems");
  if (!toggle || !count || !heading || !itemsContainer) return;

  const items = products.filter(product => selected.has(product.id));
  count.textContent = String(items.length);
  count.hidden = items.length === 0;
  toggle.setAttribute("aria-label", items.length ? `Открыть выбранные модели: ${items.length}` : "Открыть шоппер, моделей пока нет");
  heading.textContent = items.length ? `Выбрано: ${items.length}` : "Пока пусто";
  itemsContainer.innerHTML = items.length
    ? items.map(product => `<div class="shopper-item"><img src="${product.src}" alt=""><span><b>${escapeHtml(product.title)}</b><small>${product.id}</small></span><button type="button" data-shopper-remove="${product.id}" aria-label="Убрать ${escapeHtml(product.title)}">×</button></div>`).join("")
    : '<p class="shopper-empty">Добавьте понравившиеся модели — они появятся здесь.</p><a class="shopper-browse" href="#productGrid">Смотреть каталог <span aria-hidden="true">↓</span></a>';
}

function renderCatalog() {
  if (!grid) return;
  const query = (document.querySelector("#searchInput")?.value || "").trim().toLowerCase();
  const activeSearch = document.querySelector("#activeSearch");
  const searchTerms = document.querySelector("#activeSearchTerms");
  const clearSearch = document.querySelector("#clearSearch");
  const emptyReset = document.querySelector("#emptyReset");
  if (searchTerms) {
    if (activeSearch) activeSearch.hidden = !query;
    searchTerms.textContent = query;
  }
  if (clearSearch) clearSearch.hidden = !query;
  if (emptyReset) emptyReset.hidden = !query;
  const filtered = products.filter(product => {
    const searchable = `${product.id} ${product.title} ${product.category} ${product.description} ${(product.searchTerms || []).join(" ")}`.toLowerCase();
    const matchesSearch = !query || query.split(/\s+/).every(term => searchable.includes(term));
    return matchesSearch;
  });
  grid.innerHTML = filtered.map(productCard).join("");
  document.querySelector("#emptyState").hidden = filtered.length > 0;
  document.querySelector("#catalogCount").textContent = `${filtered.length} ${filtered.length === 1 ? "модель" : "моделей"}`;
  grid.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => {
    selected.has(button.dataset.select) ? selected.delete(button.dataset.select) : selected.add(button.dataset.select);
    saveSelected();
    renderCatalog();
    renderSelected();
    renderSelectionBar();
  }));
  grid.querySelectorAll(".product-open").forEach(button => button.addEventListener("click", () => openProduct(button.closest("[data-id]").dataset.id)));
}

function renderFeatured() {
  const featuredCards = document.querySelector("#featuredCards");
  if (!featuredCards) return;
  featuredCards.innerHTML = products.slice(0, 5).map((product, index) => `<a class="featured-card" style="--card-index:${index}" href="./catalog.html" aria-label="Открыть каталог: ${escapeHtml(product.title)}"><img src="${product.src}" alt="${escapeHtml(product.title)}" loading="lazy" decoding="async"></a>`).join("");
}

function openProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product || !dialog) return;
  const isSelected = selected.has(product.id);
  dialogContent.innerHTML = `<div class="dialog-product"><img src="${product.src}" alt="${escapeHtml(product.title)}"><div class="dialog-copy"><span class="eyebrow">${product.id} / ПРЕДВАРИТЕЛЬНЫЕ ДАННЫЕ</span><h2>${escapeHtml(product.title)}</h2><p>${escapeHtml(product.description)}</p><dl><div><dt>Категория</dt><dd>${escapeHtml(product.category)}</dd></div><div><dt>Возраст</dt><dd>${ageLabel(product)}</dd></div><div><dt>Размер, сезон, материал</dt><dd>Не указаны</dd></div></dl><button class="submit-btn dialog-select" type="button">${isSelected ? "Убрать из запроса" : "Выбрать модель"} <span>↗</span></button></div></div>`;
  dialogContent.querySelector(".dialog-select").addEventListener("click", () => {
    isSelected ? selected.delete(product.id) : selected.add(product.id);
    saveSelected();
    dialog.close();
    renderCatalog();
    renderFeatured();
    renderSelected();
    renderSelectionBar();
  });
  dialog.showModal();
}

document.querySelector("#searchInput")?.addEventListener("input", renderCatalog);
const searchInput = document.querySelector("#searchInput");
const resetSearch = () => { if (!searchInput) return; searchInput.value = ""; renderCatalog(); searchInput.focus(); };
document.querySelector("#clearSearch")?.addEventListener("click", resetSearch);
document.querySelector("#emptyReset")?.addEventListener("click", resetSearch);
document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
renderCatalog();
renderFeatured();
renderSelected();
renderSelectionBar();

if (document.body.classList.contains("catalog-page") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const enterTargets = [
    [document.querySelector(".masthead"), 0],
    [document.querySelector(".catalog-hero"), 90],
    [document.querySelector(".catalog-filter-bar"), 180],
    [document.querySelector(".catalog-meta"), 260],
    ...[...document.querySelectorAll("#productGrid .product-card")].map((card, index) => [card, 340 + Math.min(index, 6) * 50])
  ];
  enterTargets.forEach(([element, delay]) => {
    if (!element) return;
    element.style.setProperty("--catalog-enter-delay", `${delay}ms`);
    element.classList.add("catalog-enter");
  });
}

const shopperToggle = document.querySelector("#shopperToggle");
const shopperPanel = document.querySelector("#shopperPanel");
const shopperClose = document.querySelector("#shopperClose");
const closeShopper = (returnFocus = false) => {
  if (!shopperToggle || !shopperPanel) return;
  shopperPanel.hidden = true;
  shopperToggle.setAttribute("aria-expanded", "false");
  if (returnFocus) shopperToggle.focus();
};
shopperToggle?.addEventListener("click", () => {
  const open = shopperPanel.hidden;
  shopperPanel.hidden = !open;
  shopperToggle.setAttribute("aria-expanded", String(open));
  if (open) shopperClose?.focus();
});
shopperClose?.addEventListener("click", () => closeShopper(true));
shopperPanel?.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-shopper-remove]");
  if (removeButton) {
    selected.delete(removeButton.dataset.shopperRemove);
    saveSelected();
    renderCatalog();
    renderFeatured();
    renderSelected();
    renderSelectionBar();
    return;
  }
  if (event.target.closest(".shopper-browse")) closeShopper();
});
document.querySelector("#shopperSubmit")?.addEventListener("click", () => closeShopper());
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && shopperPanel && !shopperPanel.hidden) closeShopper(true);
});
const catalogMain = document.querySelector(".catalog-page main");
if (catalogMain) {
  const positionShopperWithinMain = () => {
    const bounds = catalogMain.getBoundingClientRect();
    const baseOffset = window.innerWidth <= 650 ? 16 : 22;
    const bottomOffset = Math.max(baseOffset, window.innerHeight - bounds.bottom + baseOffset);
    shopperToggle?.style.setProperty("--shopper-main-bottom", `${bottomOffset}px`);
    shopperPanel?.style.setProperty("--shopper-main-bottom", `${bottomOffset}px`);
  };
  positionShopperWithinMain();
  window.addEventListener("scroll", positionShopperWithinMain, { passive: true });
  window.addEventListener("resize", positionShopperWithinMain);
}

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));
document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector("#leadForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const chosen = products.filter(product => selected.has(product.id));
  const message = [
    "Запрос на модели — Luma Kids",
    `Имя: ${data.get("name")}`,
    `Контакт: ${data.get("contact")}`,
    `Модели: ${chosen.length ? chosen.map(product => `${product.id} — ${product.title}`).join(", ") : "не выбраны"}`,
    `Комментарий: ${data.get("message") || "не указан"}`
  ].join("\n");
  result.hidden = false;
  result.innerHTML = `<strong>Текст запроса сформирован, но не отправлен.</strong><br>Скопируйте его и передайте менеджеру по официальному контакту компании.<p><button type="button" class="copy-request">Скопировать текст</button></p>`;
  result.querySelector(".copy-request").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(message); } catch { const area = document.createElement("textarea"); area.value = message; result.append(area); area.select(); document.execCommand("copy"); area.remove(); }
    result.querySelector(".copy-request").textContent = "Скопировано";
  });
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

(() => {
  const progress = document.querySelector(".scroll-progress");
  const updateProgress = () => { const max = document.documentElement.scrollHeight - window.innerHeight; if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`; };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  const revealTargets = document.querySelectorAll(".collection-heading, .home-page .product-card, .studio-copy, .studio-image, .wholesale-intro, .lead-form");
  revealTargets.forEach((element, index) => { element.classList.add("reveal"); if (element.classList.contains("product-card")) element.style.transitionDelay = `${(index % 3) * 90}ms`; });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach(element => observer.observe(element));
  } else revealTargets.forEach(element => element.classList.add("is-visible"));
})();
(() => {
  const header = document.querySelector(".masthead");
  const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
})();
(() => {
  if (!document.body.classList.contains("home-page")) return;
  const nav = document.querySelector("#nav");
  const links = [...(nav?.querySelectorAll("a") || [])];
  const sections = [
    { link: links.find(link => link.getAttribute("href") === "#top"), element: document.querySelector(".hero-fullscreen") },
    { link: links.find(link => link.getAttribute("href") === "#studio"), element: document.querySelector("#studio") },
    { link: links.find(link => link.getAttribute("href") === "#wholesale"), element: document.querySelector("#wholesale") }
  ].filter(section => section.link && section.element);
  if (!sections.length) return;

  const setActive = section => links.forEach(link => {
    if (link === section.link) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  const updateActive = () => {
    const threshold = (document.querySelector(".masthead")?.offsetHeight || 0) + 80;
    let active = sections[0];
    sections.forEach(section => { if (section.element.getBoundingClientRect().top <= threshold) active = section; });
    setActive(active);
  };
  links.forEach(link => link.addEventListener("click", () => {
    const target = sections.find(section => section.link === link);
    if (target) setActive(target);
  }));
  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
})();
(() => {
  const items = [...document.querySelectorAll(".process-strip-inner span, .trust-strip-inner > div")];
  if (!items.length || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  items.forEach((item, index) => {
    item.classList.add("info-reveal");
    item.style.transitionDelay = `${(index % 5) * 65}ms`;
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: .15, rootMargin: "0px 0px -24px 0px" });
  items.forEach(item => observer.observe(item));
})();
