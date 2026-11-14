let activePageController;
const translatedTextNodes = new WeakMap();
const translatedAttributes = new WeakMap();
let requestedNavigationHash = null;
let requestedNavigationDirection = "down";
let requestedNavigationTimer;
function holdNavigationTarget(hash) {
  requestedNavigationHash = hash;
  clearTimeout(requestedNavigationTimer);
  if (hash) {
    const target = document.getElementById(hash.slice(1));
    const threshold = (document.querySelector(".masthead")?.offsetHeight || 0) + 80;
    requestedNavigationDirection = target && target.getBoundingClientRect().top <= threshold ? "up" : "down";
    requestedNavigationTimer = setTimeout(() => { requestedNavigationHash = null; }, 1800);
  }
}
function initializePage() {
  activePageController?.abort();
  activePageController = new AbortController();
  const pageSignal = { signal: activePageController.signal };

const LANGUAGE_STORAGE_KEY = "lumaKidsLanguage";
const translations = {
  "Главная": ["Bosh sahifa", "Home"], "Каталог": ["Katalog", "Catalog"], "Производство": ["Ishlab chiqarish", "Production"], "Оптовикам": ["Ulgurji xaridorlar uchun", "Wholesale"],
  "Обсудить заказ": ["Buyurtmani muhokama qilish", "Discuss an order"], "ПРОИЗВОДСТВО ДЕТСКОГО ТРИКОТАЖА · УЗБЕКИСТАН": ["BOLALAR TRIKOTAJI ISHLAB CHIQARISH · O‘ZBEKISTON", "CHILDREN’S KNITWEAR MANUFACTURING · UZBEKISTAN"],
  "Детский": ["Bolalar", "Kids’"], "трикотаж": ["trikotaji", "knitwear"], "для оптовых партнёров.": ["ulgurji hamkorlar uchun.", "for wholesale partners."],
  "Одежда для детей 2–12 лет. Оптовые заказы и пошив по индивидуальным моделям.": ["2–12 yoshli bolalar uchun kiyim. Ulgurji buyurtmalar va individual modellar bo‘yicha tikuv.", "Clothing for children aged 2–12. Wholesale orders and custom styles."],
  "Обсудить оптовый заказ": ["Ulgurji buyurtmani muhokama qilish", "Discuss a wholesale order"], "Модели из каталога": ["Katalogdagi modellar", "Catalog styles"], "Смотреть все": ["Barchasini ko‘rish", "View all"], "Перейти в каталог моделей": ["Modellar katalogiga o‘tish", "Go to the style catalog"],
  "Детская пижама светлого цвета": ["Och rangli bolalar pijamasi", "Light-colored children's pajamas"], "Детская пижама розового цвета": ["Pushti rangli bolalar pijamasi", "Pink children's pajamas"], "Детская одежда с цветным принтом": ["Rangli naqshli bolalar kiyimi", "Children’s clothing with a colorful print"],
  "Этапы производства": ["Ishlab chiqarish bosqichlari", "Production steps"], "Материалы": ["Materiallar", "Materials"], "Раскрой": ["Bichish", "Cutting"], "Пошив": ["Tikish", "Sewing"], "Контроль качества": ["Sifat nazorati", "Quality control"], "Упаковка": ["Qadoqlash", "Packing"], "О Luma Kids": ["Luma Kids haqida", "About Luma Kids"],
  "5 лет": ["5 yil", "5 years"], "работы": ["faoliyat", "in business"], "2–12 лет": ["2–12 yosh", "Ages 2–12"], "детская одежда": ["bolalar kiyimi", "children’s clothing"], "ОТК": ["Sifat nazorati", "Quality control"], "отдельный отдел контроля качества": ["alohida sifat nazorati bo‘limi", "dedicated quality control team"], "Опт": ["Ulgurji", "Wholesale"], "производство для партнёров": ["hamkorlar uchun ishlab chiqarish", "production for partners"],
  "МОДЕЛИ ИЗ КАТАЛОГА": ["KATALOGDAGI MODELLAR", "CATALOG STYLES"], "Открыть каталог": ["Katalogni ochish", "Open catalog"], "От заказа": ["Buyurtmadan", "From order"], "до готовой": ["tayyor", "to finished"], "партии.": ["partiyagacha.", "batch."],
  "Luma Kids специализируется на детской трикотажной одежде для детей 2–12 лет. Производственный маршрут включает подбор материалов, раскрой, пошив, контроль качества, упаковку и отгрузку.": ["Luma Kids 2–12 yoshli bolalar uchun trikotaj kiyimlarga ixtisoslashgan. Ishlab chiqarish jarayoni material tanlash, bichish, tikish, sifat nazorati, qadoqlash va jo‘natishni o‘z ichiga oladi.", "Luma Kids specializes in knitwear for children aged 2–12. Production includes material selection, cutting, sewing, quality control, packing, and dispatch."],
  "Двухнитка, трёхнитка и супрем": ["Ikki ipli, uch ipli mato va suprema", "Two-thread, three-thread, and single jersey"], "Индивидуальные модели и цвета": ["Individual modellar va ranglar", "Custom styles and colors"], "Отдельный этап контроля качества": ["Alohida sifat nazorati bosqichi", "A dedicated quality control step"], "Состав ткани и параметры конкретных моделей уточняются при согласовании заказа.": ["Mato tarkibi va muayyan modellar parametrlari buyurtmani kelishish vaqtida aniqlashtiriladi.", "Fabric composition and specific style details are confirmed when discussing an order."], "Обсудить сотрудничество": ["Hamkorlikni muhokama qilish", "Discuss cooperation"],
  "03 / ОПТОВОЕ СОТРУДНИЧЕСТВО": ["03 / ULGURJI HAMKORLIK", "03 / WHOLESALE PARTNERSHIPS"], "Ваш заказ.": ["Sizning buyurtmangiz.", "Your order."], "Наша": ["Bizning", "Our"], "команда.": ["jamoamiz.", "team."],
  "Принимаем запросы на оптовые поставки и производство под заказ. Минимальная сумма заказа около 10 млн сум — предварительный ориентир, условия зависят от изделия и согласуются индивидуально.": ["Ulgurji yetkazib berish va buyurtma asosida ishlab chiqarish bo‘yicha so‘rovlarni qabul qilamiz. Buyurtmaning taxminiy eng kam summasi 10 mln so‘m; shartlar mahsulotga qarab alohida kelishiladi.", "We accept inquiries for wholesale supply and made-to-order production. The approximate minimum order value is UZS 10 million; terms depend on the product and are agreed individually."],
  "ПРЕДВАРИТЕЛЬНЫЕ УСЛОВИЯ · УТОЧНЯЮТСЯ": ["DASTLABKI SHARTLAR · ANIQLASHTIRILADI", "PRELIMINARY TERMS · TO BE CONFIRMED"], "60% предоплата · 40% после отгрузки": ["60% oldindan to‘lov · 40% jo‘natilgandan so‘ng", "60% advance · 40% after dispatch"], "Оплата и доставка — по договорённости.": ["To‘lov va yetkazib berish kelishuv asosida.", "Payment and delivery by agreement."], "ЗАПРОС ДЛЯ ОПТОВОГО ОТДЕЛА": ["ULGURJI BO‘LIMIGA SO‘ROV", "WHOLESALE INQUIRY"], "Расскажите о моделях": ["Modellar haqida yozing", "Tell us about the styles"], "и планируемом заказе.": ["va rejalashtirilgan buyurtma haqida.", "and your planned order."],
  "Пока ничего не выбрано. Добавьте модели в каталоге.": ["Hozircha model tanlanmagan. Katalogdan model qo‘shing.", "No styles selected yet. Add styles from the catalog."], "Ваше имя": ["Ismingiz", "Your name"], "Как к вам обращаться?": ["Sizga qanday murojaat qilaylik?", "What should we call you?"], "Телефон или Telegram": ["Telefon yoki Telegram", "Phone or Telegram"], "Ваш номер или @username": ["Raqamingiz yoki @username", "Your number or @username"], "Комментарий": ["Izoh", "Comment"], "Модель, количество, размеры или пожелания": ["Model, miqdor, o‘lchamlar yoki istaklar", "Style, quantity, sizes, or requests"], "Сформировать запрос": ["So‘rov tayyorlash", "Prepare inquiry"],
  "Форма пока формирует текст запроса в браузере и не отправляет его автоматически. Скопируйте текст, чтобы передать его менеджеру.": ["Forma hozircha so‘rov matnini brauzerda tayyorlaydi, avtomatik yubormaydi. Matnni nusxalab menejerga yuboring.", "The form currently prepares an inquiry in your browser but does not send it. Copy the text to share it with a manager."], "Запросить условия": ["Shartlarni so‘rash", "Request terms"], "Каталог ↗": ["Katalog ↗", "Catalog ↗"], "Наверх ↑": ["Yuqoriga ↑", "Back to top ↑"], "На главную ↑": ["Bosh sahifaga ↑", "Home ↑"], "Производство детской трикотажной одежды": ["Bolalar trikotaj kiyimlari ishlab chiqarish", "Children’s knitwear manufacturing"], "Производство детского трикотажа": ["Bolalar trikotaji ishlab chiqarish", "Children’s knitwear manufacturing"], "Оптовое сотрудничество · Узбекистан": ["Ulgurji hamkorlik · O‘zbekiston", "Wholesale partnerships · Uzbekistan"], "Производство детского трикотажа": ["Bolalar trikotaji ishlab chiqarish", "Children’s knitwear manufacturing"],
  "ПРЕДВАРИТЕЛЬНАЯ ПОДБОРКА": ["DASTLABKI TANLOV", "PRELIMINARY SELECTION"], "Фотографии помогают начать разговор о заказе. Наличие, возраст, размеры, материалы и актуальный каталог уточняются у менеджера.": ["Fotosuratlar buyurtma haqida suhbatni boshlashga yordam beradi. Mavjudlik, yosh, o‘lchamlar, materiallar va amaldagi katalogni menejerdan aniqlashtiring.", "Photos help start a conversation about an order. Please confirm availability, age range, sizes, materials, and the current catalog with a manager."], "Поиск": ["Qidiruv", "Search"], "Название или номер модели": ["Model nomi yoki raqami", "Style name or number"], "Выберите одну или несколько моделей": ["Bir yoki bir nechta modelni tanlang", "Select one or more styles"], "По этим параметрам моделей не найдено.": ["Bu mezonlar bo‘yicha model topilmadi.", "No styles match these criteria."], "Сбросить поиск": ["Qidiruvni tozalash", "Clear search"], "Язык сайта": ["Sayt tili", "Site language"],
  "ВАШ ВЫБОР": ["TANLOVINGIZ", "YOUR SELECTION"], "Закрыть шоппер": ["Tanlangan modellarni yopish", "Close selected styles"], "Перейти к заявке": ["So‘rovga o‘tish", "Continue to inquiry"], "Открыть выбранные модели": ["Tanlangan modellarni ochish", "Open selected styles"], "Смотреть каталог": ["Katalogni ko‘rish", "Browse catalog"], "Возраст уточняется": ["Yosh aniqlashtiriladi", "Age to be confirmed"], "Детский трикотаж": ["Bolalar trikotaji", "Children’s knitwear"], "Фото модели из предварительной подборки. Возраст, состав, размеры и наличие уточняются.": ["Dastlabki tanlovdagi model surati. Yosh, tarkib, o‘lchamlar va mavjudlik aniqlashtiriladi.", "Photo from the preliminary selection. Age, composition, sizes, and availability are to be confirmed."], "Подробнее:": ["Batafsil:", "Details:"], "Выбрано": ["Tanlandi", "Selected"], "Выбрать": ["Tanlash", "Select"], "Убрать": ["Olib tashlash", "Remove"], "ПРЕДВАРИТЕЛЬНЫЕ ДАННЫЕ": ["DASTLABKI MA’LUMOTLAR", "PRELIMINARY DETAILS"], "Возраст": ["Yosh", "Age"], "Размер, сезон, материал": ["O‘lcham, mavsum, material", "Size, season, material"], "Не указаны": ["Ko‘rsatilmagan", "Not specified"], "Убрать из запроса": ["So‘rovdan olib tashlash", "Remove from inquiry"], "Выбрать модель": ["Modelni tanlash", "Select style"], "Текст запроса сформирован, но не отправлен.": ["So‘rov matni tayyorlandi, ammo yuborilmadi.", "Inquiry text prepared but not sent."], "Скопируйте его и передайте менеджеру по официальному контакту компании.": ["Matnni nusxalab, kompaniyaning rasmiy aloqasi orqali menejerga yuboring.", "Copy it and share it with a manager through the company’s official contact."], "Скопировать текст": ["Matnni nusxalash", "Copy text"], "Скопировано": ["Nusxalandi", "Copied"], "Запрос на модели — Luma Kids": ["Modellar bo‘yicha so‘rov — Luma Kids", "Style inquiry — Luma Kids"], "Имя:": ["Ism:", "Name:"], "Контакт:": ["Aloqa:", "Contact:"], "Модели:": ["Modellar:", "Styles:"], "не выбраны": ["tanlanmagan", "none selected"], "Комментарий:": ["Izoh:", "Comment:"], "не указан": ["ko‘rsatilmagan", "not provided"], "Пока пусто": ["Hozircha bo‘sh", "Your selection is empty"], "Добавьте понравившиеся модели — они появятся здесь.": ["Yoqtirgan modellaringizni qo‘shing — ular shu yerda ko‘rinadi.", "Add styles you like and they’ll appear here."], "Номер модели": ["Model raqami", "Style number"],
  "Категория": ["Turkum", "Category"], "Модели": ["Modellar", "Styles"], "Поиск моделей": ["Modellarni qidirish", "Search styles"], "Выбранные модели": ["Tanlangan modellar", "Selected styles"], "Открыть шоппер, моделей пока нет": ["Tanlangan modellarni ochish, hozircha model yo‘q", "Open selection, no styles yet"], "Закрыть": ["Yopish", "Close"], "02 / ПРОИЗВОДСТВО": ["02 / ISHLAB CHIQARISH", "02 / PRODUCTION"], "Запросить условия ↗": ["Shartlarni so‘rash ↗", "Request terms ↗"],
  "моделей.": ["modellari.", "styles."],
  "Модель": ["Model", "Style"], "Модель LK-001": ["Model LK-001", "Style LK-001"], "Модель LK-002": ["Model LK-002", "Style LK-002"], "Модель LK-003": ["Model LK-003", "Style LK-003"], "Модель LK-004": ["Model LK-004", "Style LK-004"], "Модель LK-005": ["Model LK-005", "Style LK-005"], "Пример детской одежды": ["Bolalar kiyimidan namuna", "Example of children's clothing"], "CHILDREN’S KNITWEAR": ["BOLALAR TRIKOTAJI", "CHILDREN’S KNITWEAR"], "Открыть меню": ["Menyuni ochish", "Open menu"],
  "Luma Kids — производство детского трикотажа": ["Luma Kids — bolalar trikotaji ishlab chiqarish", "Luma Kids — children’s knitwear manufacturing"], "Модели и запрос каталога — Luma Kids": ["Modellar va katalog so‘rovi — Luma Kids", "Styles and catalog inquiry — Luma Kids"], "Luma Kids — производство детской трикотажной одежды для оптовых партнёров. Индивидуальные модели и цвета, каталог и запрос на сотрудничество.": ["Luma Kids — ulgurji hamkorlar uchun bolalar trikotaj kiyimlari ishlab chiqarish. Individual modellar va ranglar, katalog va hamkorlik so‘rovi.", "Luma Kids manufactures children’s knitwear for wholesale partners. Custom styles and colors, catalog, and partnership inquiries."], "Предварительная подборка моделей Luma Kids. Запросите каталог, размеры, наличие и условия оптового производства.": ["Luma Kids modellarining dastlabki tanlovi. Katalog, o‘lchamlar, mavjudlik va ulgurji ishlab chiqarish shartlarini so‘rang.", "A preliminary selection of Luma Kids styles. Ask about the catalog, sizes, availability, and wholesale production terms."]
};
let currentLanguage = ["uz", "en"].includes(localStorage.getItem(LANGUAGE_STORAGE_KEY)) ? localStorage.getItem(LANGUAGE_STORAGE_KEY) : "ru";
const t = (text, language = currentLanguage) => language === "ru" ? text : translations[text]?.[language === "uz" ? 0 : 1] || text;
const localizedVariants = text => [text, ...(translations[text] || [])];
const countModels = count => currentLanguage === "uz" ? `${count} ta model` : currentLanguage === "en" ? `${count} ${count === 1 ? "model" : "models"}` : `${count} ${count === 1 ? "модель" : "моделей"}`;
function applyPageLanguage() {
  document.documentElement.lang = currentLanguage === "uz" ? "uz-Latn" : currentLanguage;
  const title = document.querySelector("title");
  if (title) {
    if (!title.dataset.ruText) title.dataset.ruText = title.textContent;
    title.textContent = t(title.dataset.ruText);
  }
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    if (!description.dataset.ruContent) description.dataset.ruContent = description.content;
    description.content = t(description.dataset.ruContent);
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!translatedTextNodes.has(node)) translatedTextNodes.set(node, node.nodeValue);
    const original = translatedTextNodes.get(node);
    const trimmed = original.trim();
    if (!trimmed) continue;
    const start = original.indexOf(trimmed);
    node.nodeValue = `${original.slice(0, start)}${t(trimmed)}${original.slice(start + trimmed.length)}`;
  }
  document.querySelectorAll("body *").forEach(element => {
    ["aria-label", "placeholder", "alt", "title"].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      let originals = translatedAttributes.get(element);
      if (!originals) translatedAttributes.set(element, originals = {});
      if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, t(originals[attribute]));
    });
  });
  document.querySelectorAll("[data-language]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage)));
  syncLanguageIndicators();
}
function syncLanguageIndicators() {
  document.querySelectorAll(".language-switch").forEach(group => {
    const selected = group.querySelector(`[data-language="${currentLanguage}"]`);
    if (!selected) return;
    const groupBounds = group.getBoundingClientRect();
    const buttonBounds = selected.getBoundingClientRect();
    group.style.setProperty("--language-indicator-x", `${buttonBounds.left - groupBounds.left}px`);
    group.style.setProperty("--language-indicator-y", `${buttonBounds.top - groupBounds.top}px`);
    group.style.setProperty("--language-indicator-width", `${buttonBounds.width}px`);
    group.style.setProperty("--language-indicator-height", `${buttonBounds.height}px`);
  });
}
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
  if (button.dataset.language === currentLanguage) return;
  currentLanguage = button.dataset.language;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  applyPageLanguage();
  document.dispatchEvent(new Event("luma-language-change"));
}, pageSignal));

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
let activeDialogId = null;
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
  heroVideo.addEventListener("playing", () => heroVideo.classList.add("is-playing"), pageSignal);
  heroVideo.addEventListener("pause", () => heroVideo.classList.remove("is-playing"), pageSignal);
  heroVideo.addEventListener("error", () => heroVideo.classList.remove("is-playing"), pageSignal);
  syncHeroVideo();
  reducedMotion.addEventListener?.("change", syncHeroVideo, pageSignal);
  smallScreen.addEventListener?.("change", syncHeroVideo, pageSignal);
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
const ageLabel = () => t("Возраст уточняется");

function productCard(product) {
  const isSelected = selected.has(product.id);
  return `<article class="product-card${isSelected ? " is-selected" : ""}" data-id="${product.id}">
    <button class="product-image product-open" type="button" aria-label="${escapeHtml(t("Подробнее:"))} ${escapeHtml(t(product.title))}">
      <img src="${product.src}" alt="${escapeHtml(t(product.title))}" loading="lazy">
      <span class="product-number">${product.id}</span>
      <span class="selected-mark" aria-hidden="true">${isSelected ? "✓" : "+"}</span>
    </button>
    <div class="product-title"><span><b>${escapeHtml(t(product.title))}</b><small>${escapeHtml(t(product.category))} · ${ageLabel(product)}</small></span><button class="select-btn" type="button" data-select="${product.id}">${isSelected ? t("Выбрано") : t("Выбрать")}</button></div>
  </article>`;
}

function renderSelected() {
  if (!selectedModels) return;
  const items = products.filter(product => selected.has(product.id));
  selectedModels.innerHTML = items.length
    ? items.map(product => `<div class="selected-model"><span>${escapeHtml(t(product.title))} <small>${product.id}</small></span><button type="button" data-remove="${product.id}" aria-label="${escapeHtml(t("Убрать"))} ${escapeHtml(t(product.title))}">×</button></div>`).join("")
    : `<p>${t("Пока ничего не выбрано. Добавьте модели в каталоге.")}</p>`;
  selectedModels.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => {
    selected.delete(button.dataset.remove);
    saveSelected();
    renderCatalog();
    renderFeatured();
    renderSelected();
    renderSelectionBar();
  }, pageSignal));
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
  toggle.setAttribute("aria-label", items.length ? `${t("Открыть выбранные модели")}: ${countModels(items.length)}` : t("Открыть шоппер, моделей пока нет"));
  heading.textContent = items.length ? `${t("Выбрано")}: ${countModels(items.length)}` : t("Пока пусто");
  itemsContainer.innerHTML = items.length
    ? items.map(product => `<div class="shopper-item"><img src="${product.src}" alt=""><span><b>${escapeHtml(t(product.title))}</b><small>${product.id}</small></span><button type="button" data-shopper-remove="${product.id}" aria-label="${escapeHtml(t("Убрать"))} ${escapeHtml(t(product.title))}">×</button></div>`).join("")
    : `<p class="shopper-empty">${t("Добавьте понравившиеся модели — они появятся здесь.")}</p><a class="shopper-browse" href="#productGrid">${t("Смотреть каталог")} <span aria-hidden="true">↓</span></a>`;
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
    const searchable = [product.id, product.title, product.category, product.description, ...(product.searchTerms || [])].flatMap(localizedVariants).join(" ").toLowerCase();
    const matchesSearch = !query || query.split(/\s+/).every(term => searchable.includes(term));
    return matchesSearch;
  });
  grid.innerHTML = filtered.map(productCard).join("");
  const emptyState = document.querySelector("#emptyState");
  if (emptyState) emptyState.hidden = filtered.length > 0;
  const catalogCount = document.querySelector("#catalogCount");
  if (catalogCount) catalogCount.textContent = countModels(filtered.length);
  grid.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => {
    selected.has(button.dataset.select) ? selected.delete(button.dataset.select) : selected.add(button.dataset.select);
    saveSelected();
    renderCatalog();
    renderSelected();
    renderSelectionBar();
  }, pageSignal));
  grid.querySelectorAll(".product-open").forEach(button => button.addEventListener("click", () => openProduct(button.closest("[data-id]").dataset.id), pageSignal));
}

function renderFeatured() {
  const featuredCards = document.querySelector("#featuredCards");
  if (!featuredCards) return;
  featuredCards.innerHTML = products.slice(0, 5).map((product, index) => `<a class="featured-card" style="--card-index:${index}" href="./catalog.html" aria-label="${escapeHtml(t("Открыть каталог"))}: ${escapeHtml(t(product.title))}"><img src="${product.src}" alt="${escapeHtml(t(product.title))}" loading="lazy" decoding="async"></a>`).join("");
}

function openProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product || !dialog) return;
  activeDialogId = id;
  const isSelected = selected.has(product.id);
  dialogContent.innerHTML = `<div class="dialog-product"><img src="${product.src}" alt="${escapeHtml(t(product.title))}"><div class="dialog-copy"><span class="eyebrow">${product.id} / ${t("ПРЕДВАРИТЕЛЬНЫЕ ДАННЫЕ")}</span><h2>${escapeHtml(t(product.title))}</h2><p>${escapeHtml(t(product.description))}</p><dl><div><dt>${t("Категория")}</dt><dd>${escapeHtml(t(product.category))}</dd></div><div><dt>${t("Возраст")}</dt><dd>${ageLabel(product)}</dd></div><div><dt>${t("Размер, сезон, материал")}</dt><dd>${t("Не указаны")}</dd></div></dl><button class="submit-btn dialog-select" type="button">${isSelected ? t("Убрать из запроса") : t("Выбрать модель")} <span>↗</span></button></div></div>`;
  dialogContent.querySelector(".dialog-select").addEventListener("click", () => {
    isSelected ? selected.delete(product.id) : selected.add(product.id);
    saveSelected();
    dialog.close();
    renderCatalog();
    renderFeatured();
    renderSelected();
    renderSelectionBar();
  }, pageSignal);
  dialog.showModal();
}

document.querySelector("#searchInput")?.addEventListener("input", renderCatalog, pageSignal);
const searchInput = document.querySelector("#searchInput");
const resetSearch = () => { if (!searchInput) return; searchInput.value = ""; renderCatalog(); searchInput.focus(); };
document.querySelector("#clearSearch")?.addEventListener("click", resetSearch, pageSignal);
document.querySelector("#emptyReset")?.addEventListener("click", resetSearch, pageSignal);
document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close(), pageSignal);
dialog?.addEventListener("click", event => { if (event.target === dialog) dialog.close(); }, pageSignal);
renderCatalog();
renderFeatured();
renderSelected();
renderSelectionBar();
applyPageLanguage();
document.addEventListener("luma-language-change", () => {
  renderCatalog();
  renderFeatured();
  renderSelected();
  renderSelectionBar();
  if (dialog?.open && activeDialogId) openProduct(activeDialogId);
  if (result && !result.hidden && lastFormRequest) renderFormResult(buildRequestText(lastFormRequest));
}, pageSignal);

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
}, pageSignal);
shopperClose?.addEventListener("click", () => closeShopper(true), pageSignal);
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
}, pageSignal);
document.querySelector("#shopperSubmit")?.addEventListener("click", () => closeShopper(), pageSignal);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && shopperPanel && !shopperPanel.hidden) closeShopper(true);
}, pageSignal);
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
  window.addEventListener("scroll", positionShopperWithinMain, { passive: true, signal: activePageController.signal });
  window.addEventListener("resize", positionShopperWithinMain, pageSignal);
}

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");
window.addEventListener("resize", syncLanguageIndicators, { passive: true, signal: activePageController.signal });
let navIndicator = nav?.querySelector(".nav-indicator");
if (nav && !navIndicator) {
  navIndicator = document.createElement("span");
  navIndicator.className = "nav-indicator";
  navIndicator.setAttribute("aria-hidden", "true");
  nav.append(navIndicator);
}
const moveNavIndicator = (link = nav?.querySelector("a[aria-current]")) => {
  if (!nav || !navIndicator || !link || window.matchMedia("(max-width: 650px)").matches) return;
  const navBounds = nav.getBoundingClientRect();
  const linkBounds = link.getBoundingClientRect();
  navIndicator.style.width = `${linkBounds.width}px`;
  navIndicator.style.transform = `translate(${linkBounds.left - navBounds.left}px, ${linkBounds.bottom - navBounds.top + 3}px)`;
};
moveNavIndicator();
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  requestAnimationFrame(syncLanguageIndicators);
}, pageSignal);
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}, pageSignal));
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

let lastFormRequest = null;
function buildRequestText(data) {
  const chosen = products.filter(product => selected.has(product.id));
  return [
    t("Запрос на модели — Luma Kids"),
    `${t("Имя:")} ${data.name}`,
    `${t("Контакт:")} ${data.contact}`,
    `${t("Модели:")} ${chosen.length ? chosen.map(product => `${product.id} — ${t(product.title)}`).join(", ") : t("не выбраны")}`,
    `${t("Комментарий:")} ${data.message || t("не указан")}`
  ].join("\n");
}
function renderFormResult(message) {
  result.innerHTML = `<strong>${t("Текст запроса сформирован, но не отправлен.")}</strong><br>${t("Скопируйте его и передайте менеджеру по официальному контакту компании.")}<p><button type="button" class="copy-request">${t("Скопировать текст")}</button></p>`;
  result.querySelector(".copy-request").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(message); } catch { const area = document.createElement("textarea"); area.value = message; result.append(area); area.select(); document.execCommand("copy"); area.remove(); }
    result.querySelector(".copy-request").textContent = t("Скопировано");
  }, pageSignal);
}
document.querySelector("#leadForm")?.addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  lastFormRequest = { name: data.get("name"), contact: data.get("contact"), message: data.get("message") };
  const message = buildRequestText(lastFormRequest);
  result.hidden = false;
  renderFormResult(message);
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}, pageSignal);

(() => {
  const progress = document.querySelector(".scroll-progress");
  const updateProgress = () => { const max = document.documentElement.scrollHeight - window.innerHeight; if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`; };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true, signal: activePageController.signal });
  window.addEventListener("resize", updateProgress, pageSignal);
  const revealTargets = document.querySelectorAll(".collection-heading, .home-page .product-card, .studio-copy, .studio-image, .wholesale-intro, .lead-form");
  revealTargets.forEach((element, index) => { element.classList.add("reveal"); if (element.classList.contains("product-card")) element.style.transitionDelay = `${(index % 3) * 90}ms`; });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach(element => observer.observe(element));
  } else revealTargets.forEach(element => element.classList.add("is-visible"));
})();
(() => {
  const header = document.querySelector(".masthead");
  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
    document.dispatchEvent(new Event("luma-header-state-change"));
  };
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true, signal: activePageController.signal });
})();
document.addEventListener("luma-header-state-change", () => requestAnimationFrame(() => moveNavIndicator()), pageSignal);
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

  const setActive = section => {
    links.forEach(link => {
      if (link === section.link) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    moveNavIndicator(section.link);
  };
  const updateActive = () => {
    const threshold = (document.querySelector(".masthead")?.offsetHeight || 0) + 80;
    if (requestedNavigationHash) {
      const requested = sections.find(section => section.link.getAttribute("href") === requestedNavigationHash);
      const requestedTop = requested?.element.getBoundingClientRect().top;
      const targetReached = requestedNavigationHash === "#top"
        ? window.scrollY <= 2
        : requestedNavigationDirection === "down" ? requestedTop <= threshold : requestedTop >= threshold;
      if (requested && !targetReached) {
        setActive(requested);
        return;
      }
      holdNavigationTarget(null);
    }
    let active = sections[0];
    sections.forEach(section => { if (section.element.getBoundingClientRect().top <= threshold) active = section; });
    setActive(active);
  };
  links.forEach(link => link.addEventListener("click", () => {
    const target = sections.find(section => section.link === link);
    if (target) {
      holdNavigationTarget(target.link.getAttribute("href"));
      setActive(target);
    }
  }, pageSignal));
  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true, signal: activePageController.signal });
  window.addEventListener("resize", updateActive, pageSignal);
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
}

initializePage();

const routeCache = new Map();
let navigationRequest = 0;
const routeName = url => /(?:^|\/)catalog(?:\.html)?\/?$/.test(url.pathname) ? "catalog" : "home";
let currentRoute = document.body.classList.contains("catalog-page") ? "catalog" : "home";
let scrollSaveTimer;
window.addEventListener("scroll", () => {
  clearTimeout(scrollSaveTimer);
  scrollSaveTimer = setTimeout(() => history.replaceState({ ...history.state, scrollY: window.scrollY }, "", window.location.href), 120);
}, { passive: true });
const fetchPage = url => {
  const key = `${url.pathname}${url.search}`;
  if (!routeCache.has(key)) routeCache.set(key, fetch(key).then(response => {
    if (!response.ok) throw new Error(`Could not load ${key}`);
    return response.text();
  }).then(markup => new DOMParser().parseFromString(markup, "text/html")).catch(error => {
    routeCache.delete(key);
    throw error;
  }));
  return routeCache.get(key);
};

async function navigateTo(url, addHistory = true, restoreScroll = 0) {
  const requestId = ++navigationRequest;
  try {
    const nextPage = await fetchPage(url);
    if (requestId !== navigationRequest) return;
    const nextMain = nextPage.querySelector("main")?.cloneNode(true);
    const currentMain = document.querySelector("main");
    if (!nextMain || !currentMain) throw new Error("Page content is missing");

    const updatePage = () => {
      if (requestId !== navigationRequest) return;
      const currentHeader = document.querySelector(".masthead");
      const nextHeader = nextPage.querySelector(".masthead");
      const currentLinks = [...(currentHeader?.querySelectorAll(".nav > a") || [])];
      const nextLinks = [...(nextHeader?.querySelectorAll(".nav > a") || [])];
      currentLinks.forEach((link, index) => {
        const nextLink = nextLinks[index];
        if (!nextLink) return;
        link.href = nextLink.getAttribute("href");
        const currentState = nextLink.getAttribute("aria-current");
        currentState ? link.setAttribute("aria-current", currentState) : link.removeAttribute("aria-current");
      });
      const nextCta = nextHeader?.querySelector(".header-cta");
      const currentCta = currentHeader?.querySelector(".header-cta");
      if (nextCta && currentCta) currentCta.href = nextCta.getAttribute("href");

      document.body.className = nextPage.body.className;
      currentRoute = routeName(url);
      currentMain.replaceWith(nextMain);
      const currentFooter = document.querySelector(".footer");
      const nextFooter = nextPage.querySelector(".footer")?.cloneNode(true);
      if (currentFooter && nextFooter) currentFooter.replaceWith(nextFooter);
      const nextDescription = nextPage.querySelector('meta[name="description"]');
      const currentDescription = document.querySelector('meta[name="description"]');
      if (nextDescription && currentDescription) {
        currentDescription.dataset.ruContent = nextDescription.content;
        currentDescription.content = nextDescription.content;
      }
      const currentTitle = document.querySelector("title");
      if (currentTitle) {
        currentTitle.dataset.ruText = nextPage.title;
        currentTitle.textContent = nextPage.title;
      }
      if (addHistory) {
        history.replaceState({ ...history.state, scrollY: window.scrollY }, "", window.location.href);
        history.pushState({ scrollY: 0 }, "", url.href);
      }
      nextMain.classList.add("route-enter");
      window.scrollTo(0, restoreScroll);
      holdNavigationTarget(["#studio", "#wholesale"].includes(url.hash) ? url.hash : null);
      initializePage();
      document.dispatchEvent(new Event("luma-header-state-change"));
      if (url.hash) requestAnimationFrame(() => document.querySelector(decodeURIComponent(url.hash))?.scrollIntoView({ behavior: "smooth" }));
    };

    if (document.startViewTransition) document.startViewTransition(updatePage);
    else updatePage();
  } catch {
    if (requestId === navigationRequest) window.location.assign(url.href);
  }
}

document.addEventListener("click", event => {
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute("download")) return;
  const isHomeNavLink = link.matches(".nav > a:first-child");
  const url = new URL(link.href, window.location.href);
  if (isHomeNavLink) {
    url.pathname = new URL("./index.html", window.location.href).pathname;
    url.search = "";
    url.hash = "";
  }
  const file = url.pathname.split("/").pop();
  const sameRouteHomeReset = isHomeNavLink && routeName(url) === currentRoute && (window.location.hash || window.location.pathname !== url.pathname);
  if (url.origin !== window.location.origin || !["", "index", "index.html", "catalog", "catalog.html"].includes(file) || (routeName(url) === currentRoute && !sameRouteHomeReset)) return;
  event.preventDefault();
  document.querySelector(".nav")?.classList.remove("open");
  document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
  navigateTo(url);
});

document.addEventListener("pointerover", event => {
  const link = event.target instanceof Element ? event.target.closest('a[href$="catalog.html"]') : null;
  if (link) fetchPage(new URL(link.href, window.location.href)).catch(() => {});
}, { passive: true });
window.addEventListener("popstate", event => {
  const url = new URL(window.location.href);
  const scrollY = event.state?.scrollY || 0;
  if (routeName(url) === currentRoute) {
    if (url.hash) requestAnimationFrame(() => document.querySelector(decodeURIComponent(url.hash))?.scrollIntoView({ behavior: "smooth" }));
    else window.scrollTo(0, scrollY);
    return;
  }
  navigateTo(url, false, scrollY);
});
