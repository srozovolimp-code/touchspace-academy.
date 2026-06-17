(function () {
  var brandSlug = document.body.getAttribute("data-brand-academy");
  var root = document.querySelector("[data-brand-academy-root]");
  var academies = {
    "alpine-floor": {
      name: "Alpine Floor",
      category: "Кварц-виниловые покрытия",
      logo: "../../images/brand-logos/Alpine_Floor.png",
      source: ["Alpine floor / JSONL", "старый модуль Alpine Floor"],
      summary: "Академия помогает реселлеру быстро разложить широкий ассортимент Alpine Floor по сценариям клиента: формат, тип укладки, визуальный эффект, эксплуатация и аргументация в продаже.",
      courses: [
        ["brand", "О бренде и роли Alpine Floor", "Позиционирование бренда, отличие SPC/LVT от классического ламината и язык выгод для клиента.", "Бренд", "3 урока", "Начальный", "18 мин", "art-blue", "../../icons/5.png", "alpine-floor.html"],
        ["product", "Ассортимент и коллекции", "Grand Sequoia, Premium XL, Parquet LVT, Stone Mineral Core и другие линейки как карта быстрых рекомендаций.", "Продукт", "4 урока", "Средний", "26 мин", "art-mint", "../../icons/7.png", "alpine-floor.html"],
        ["sales", "Консультация и продажа", "Подбор покрытия под квартиру, коммерцию, влажные зоны, теплый пол и дизайн-проект.", "Продажи", "3 урока", "Практика", "22 мин", "art-violet", "../../icons/8.png", "alpine-floor.html"]
      ]
    },
    "alta-step": {
      name: "Alta Step",
      category: "SPC и кварц-виниловый ламинат",
      logo: "../../images/brand-logos/Alta_Step.png",
      source: ["Alta step / full brand JSON", "старый модуль Alta Step"],
      summary: "Новая структура делает Alta Step понятным через карточки коллекций, технические параметры и сравнение форматов: от Mirada и Gusto до сценариев продажи под конкретное помещение.",
      courses: [
        ["brand", "Бренд и продуктовая логика", "Зачем покупателю SPC, как связать дизайн, практичность и цену в одной консультации.", "Бренд", "3 урока", "Начальный", "16 мин", "art-blue", "../../icons/5.png", "alta-step.html"],
        ["product", "Коллекции и характеристики", "Форматы, защитный слой, фаска и упаковка на примерах Mirada, Gusto и смежных линеек.", "Продукт", "4 урока", "Средний", "24 мин", "art-mint", "../../icons/7.png", "alta-step.html"],
        ["sales", "Как продавать Alta Step", "Шпаргалка по вопросам клиенту, подбору декора и объяснению различий между близкими коллекциями.", "Продажи", "3 урока", "Практика", "21 мин", "art-violet", "../../icons/8.png", "alta-step.html"]
      ]
    },
    coswick: {
      name: "Coswick",
      category: "Паркетная доска, модульный паркет, инженерная доска",
      logo: "../../images/brand-logos/Coswick.png",
      source: ["косвик / PDF, XLSX, JSONL", "старый модуль Coswick"],
      summary: "Академия Coswick строится вокруг натурального дерева, конструкции пола, коллекций и грамотного подбора покрытия под стиль, нагрузку и ожидания клиента.",
      courses: [
        ["brand", "Философия натурального дерева", "Ценность паркета, инженерной доски и модульных решений без перегруза техническими деталями.", "Бренд", "3 урока", "Начальный", "20 мин", "art-blue", "../../icons/5.png", "coswick.html"],
        ["product", "Коллекции и палитры Coswick", "Натуральная палитра, Белые ночи, Оттенки серого, Таинственный лес и Американский орех.", "Продукт", "4 урока", "Средний", "28 мин", "art-mint", "../../icons/7.png", "coswick.html"],
        ["sales", "Техническая консультация", "Основание, помещение, уход, химия, спортивные и коммерческие сценарии.", "Консультация", "4 урока", "Продвинутый", "25 мин", "art-violet", "../../icons/8.png", "coswick.html"]
      ]
    },
    "coswick-advanced": {
      name: "Coswick advanced",
      category: "Расширенная академия Coswick",
      logo: "../../images/brand-logos/Coswick.png",
      summary: "Расширенная академия Coswick помогает реселлеру последовательно разобраться в бренде, структуре ассортимента, коллекциях, форматах и правилах точной консультации.",
      final: false,
      courses: [
        ["brand-block-01", "Бренд Coswick", "Происхождение, история, масштаб и позиционирование. Блок знакомит с фабрикой, продуктовой системой, историей развития и правилами корректной коммуникации бренда.", "Модуль 01", "4 раздела", "Начальный", "40 мин", "art-blue", "../../icons/5.png", "coswick-advanced-block-01.html"],
        ["assortment-block-02", "Как ориентироваться в ассортименте Coswick", "Коллекции, оттенки, форматы и параметры выбора в консультации клиента. Блок помогает вести подбор от общего запроса к конкретному продукту.", "Модуль 02", "4 раздела", "Средний", "55 мин", "art-mint", "../../icons/7.png", "coswick-advanced-block-02.html"]
      ]
    },
    ensten: {
      name: "Ensten",
      category: "SPC-ламинат",
      logo: "../../images/brand-logos/Ensten.png",
      source: ["Ensten / knowledge base JSONL", "старый модуль Ensten"],
      summary: "В материалах Ensten хорошо собраны позиционирование, свойства SPC и коллекции. Академия превращает эти данные в понятный маршрут обучения реселлера.",
      courses: [
        ["brand", "Позиционирование Ensten", "Доступная премиальность, контроль качества, современное производство и практичность SPC.", "Бренд", "3 урока", "Начальный", "15 мин", "art-blue", "../../icons/5.png", "ensten.html"],
        ["product", "Коллекции и форматы", "Уют, Валланд паркет и Теплый: длинная планка, английская елка и плиточный формат.", "Продукт", "4 урока", "Средний", "23 мин", "art-mint", "../../icons/7.png", "ensten.html"],
        ["sales", "Свойства и аргументы", "Водостойкость, теплый пол, фаска, тиснение в регистр, безопасность и шумоизоляция.", "Продажи", "3 урока", "Практика", "20 мин", "art-violet", "../../icons/8.png", "ensten.html"]
      ]
    },
    norland: {
      name: "Norland",
      category: "Кварц-виниловый ламинат",
      logo: "../../images/brand-logos/Norland.png",
      source: ["Norland / JSONL", "старый модуль Norland"],
      summary: "Академия Norland собирает ассортимент в понятную карту: линейки Sigrid, Lagom Parquet и Neowood, их форматы, визуальные задачи и сценарии рекомендации.",
      courses: [
        ["brand", "ДНК Norland", "Стиль бренда, спокойные декоры, формат и надежность как основа консультации.", "Бренд", "3 урока", "Начальный", "16 мин", "art-blue", "../../icons/5.png", "norland.html"],
        ["product", "Коллекции Norland", "Sigrid, Sigrid LVT, Sigrid Plus, Lagom Parquet, Lagom Parquet LVT и Neowood.", "Продукт", "4 урока", "Средний", "24 мин", "art-mint", "../../icons/7.png", "norland.html"],
        ["sales", "Подбор под клиента", "Выбор коллекции по комнате, дизайну и ожиданиям по эксплуатации без превращения консультации в каталог.", "Продажи", "3 урока", "Практика", "19 мин", "art-violet", "../../icons/8.png", "norland.html"]
      ]
    },
    tulesna: {
      name: "Tulesna",
      category: "Кварц-виниловый ламинат",
      logo: "../../images/brand-logos/Tulesna.png",
      source: ["Tulesna / JSONL", "старый модуль Tulesna"],
      summary: "Академия Tulesna фокусируется на компактном ассортименте и практичной продаже: быстро понять линейки Ottimo, Premium, Verano и Art Parquet.",
      courses: [
        ["brand", "Бренд и покупатель", "Для каких клиентов подходит Tulesna и какие задачи закрывает кварц-виниловый ламинат.", "Бренд", "3 урока", "Начальный", "14 мин", "art-blue", "../../icons/5.png", "tulesna.html"],
        ["product", "Ассортимент Tulesna", "Ottimo, Premium, Verano и Art Parquet: классика, акцентный рисунок и быстрый выбор.", "Продукт", "4 урока", "Средний", "21 мин", "art-mint", "../../icons/7.png", "tulesna.html"],
        ["sales", "Продажа без перегруза", "Как коротко объяснять характеристики и доводить клиента до решения без технической лекции.", "Продажи", "3 урока", "Практика", "18 мин", "art-violet", "../../icons/8.png", "tulesna.html"]
      ]
    }
  };

  if (!root || !academies[brandSlug]) return;

  var academy = academies[brandSlug];
  var pageUrl = "brands/touchspace_brand_pages/" + brandSlug + "-academy.html";
  document.title = "Академия " + academy.name + " | TouchSpace Академия";

  var header = document.querySelector(".header");
  if (header) header.setAttribute("data-search-placeholder", "Поиск по Академии " + academy.name);

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function canPlanAccount() {
    var api = window.TouchSpaceAcademy;
    var user = api && api.getActiveUser ? api.getActiveUser() : null;
    return !user || (user.id !== "supplier" && user.type !== "supplier");
  }

  function scheduledItems() {
    try {
      var items = JSON.parse(localStorage.getItem("touchspaceScheduledLessons") || "[]");
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  }

  function isPlanned(id) {
    return scheduledItems().some(function (item) { return item.id === id; });
  }

  function favoriteButton(id, title, type, url, desc) {
    return '<button class="course-action course-action--favorite" type="button" data-favorite-toggle data-favorite-id="' + escapeHtml(id) + '" data-favorite-title="' + escapeHtml(title) + '" data-favorite-type="' + escapeHtml(type) + '" data-favorite-url="' + escapeHtml(url) + '" data-favorite-description="' + escapeHtml(desc) + '" aria-label="Добавить ' + escapeHtml(title) + ' в избранное" aria-pressed="false"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>';
  }

  function planButton(id, title, courseId) {
    var planned = isPlanned(id);
    return '<button class="course-action course-action--plan' + (planned ? " is-planned" : "") + '" type="button" data-plan-course="' + escapeHtml(courseId) + '" data-plan-id="' + escapeHtml(id) + '" data-plan-title="' + escapeHtml(title) + '" aria-label="' + (planned ? "Запланировано: " : "Запланировать ") + escapeHtml(title) + '" aria-pressed="' + String(planned) + '"><img class="calendar-icon" src="../../icons/calendar.svg" alt="" aria-hidden="true"></button>';
  }

  function courseCard(course) {
    var id = course[0];
    var title = course[1];
    var desc = course[2];
    var tag = course[3];
    var badge = course[4];
    var level = course[5];
    var time = course[6];
    var art = course[7];
    var icon = course[8];
    var href = course[9];
    var fullUrl = "brands/touchspace_brand_pages/" + href;
    var favorite = favoriteButton("academy-" + brandSlug + "-course-" + id, title, "Курс академии", fullUrl, desc);
    var schedule = canPlanAccount() ? planButton("academy-" + brandSlug + "-" + id, title, id) : "";

    return '<article class="course-card is-link" data-href="' + escapeHtml(href) + '">' +
      '<div class="course-card__image ' + escapeHtml(art) + '" data-badge="' + escapeHtml(badge) + '"><div class="course-card__tools">' + favorite + schedule + '</div><img src="' + escapeHtml(icon) + '" alt=""></div>' +
      '<div class="course-card__body">' +
      '<span class="course-status course-status--new">Новый курс</span>' +
      '<span class="badge">' + escapeHtml(tag) + '</span>' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      '<p>' + escapeHtml(desc) + '</p>' +
      '<div class="course-progress" style="--progress:0%"><span></span></div>' +
      '<div class="course-card__foot"><span class="level">' + escapeHtml(level) + '</span><span>' + escapeHtml(time) + '</span></div>' +
      '</div>' +
      '</article>';
  }

  function finalCard() {
    var title = "Итоговое тестирование " + academy.name;
    var desc = "Финальная проверка по темам всех курсов академии. Откроется после прохождения разделов бренда.";
    var favorite = favoriteButton("academy-" + brandSlug + "-final-test", title, "Тест академии", pageUrl, desc);
    return '<article class="course-card is-locked">' +
      '<div class="course-card__image art-cream" data-badge="Тест"><div class="course-card__tools">' + favorite + '</div><img src="../../icons/10.png" alt=""></div>' +
      '<div class="course-card__body">' +
      '<span class="course-status course-status--locked">Откроется позже</span>' +
      '<span class="badge">Итоговая проверка</span>' +
      '<h3>' + escapeHtml(title) + '</h3>' +
      '<p>' + escapeHtml(desc) + '</p>' +
      '<div class="course-progress" style="--progress:0%"><span></span></div>' +
      '<div class="course-card__foot"><span class="level">После курсов</span><span>12-15 мин</span></div>' +
      '</div>' +
      '</article>';
  }

  root.innerHTML = '<div class="topline">' +
    '<nav class="breadcrumb" aria-label="Хлебные крошки"><a href="../../brands.html">Бренды</a><span>/</span><span>Академия ' + escapeHtml(academy.name) + '</span></nav>' +
    '<a class="back-link" href="../../brands.html">Назад к каталогу брендов</a>' +
    '</div>' +
    '<section class="academy-hero">' +
    '<div>' +
    '<span class="eyebrow">Академия бренда</span>' +
    '<h1>Академия ' + escapeHtml(academy.name) + '</h1>' +
    '<p>' + escapeHtml(academy.summary) + '</p>' +
    '<div class="academy-actions">' +
    '<button class="brand-hero-favorite academy-favorite" type="button" aria-label="Добавить Академию ' + escapeHtml(academy.name) + ' в избранное" aria-pressed="false" data-favorite-toggle data-favorite-id="academy-' + escapeHtml(brandSlug) + '" data-favorite-title="Академия ' + escapeHtml(academy.name) + '" data-favorite-type="Академия бренда" data-favorite-url="' + escapeHtml(pageUrl) + '" data-favorite-description="' + escapeHtml(academy.summary) + '"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>' +
    (canPlanAccount() ? '<button class="academy-plan-btn" type="button" data-plan-academy="' + escapeHtml(brandSlug) + '" data-plan-id="academy-' + escapeHtml(brandSlug) + '" data-plan-title="Академия ' + escapeHtml(academy.name) + '" aria-label="Запланировать Академию ' + escapeHtml(academy.name) + '" aria-pressed="false"><img class="calendar-icon" src="../../icons/calendar.svg" alt="" aria-hidden="true"></button>' : "") +
    '</div>' +
    '</div>' +
    '<aside class="brand-box">' +
    '<div class="brand-logo"><img src="' + escapeHtml(academy.logo) + '" alt="' + escapeHtml(academy.name) + '"></div>' +
    '<strong>' + escapeHtml(academy.name) + '</strong>' +
    '<span>' + escapeHtml(academy.category) + '</span>' +
    '</aside>' +
    '</section>' +
    '<section class="section">' +
    '<div class="section-head"><div><h2>Курсы бренда</h2><p>Карточки используют логику Академии Calitex: статус, прогресс, сложность и среднее время прохождения.</p></div><span class="course-count">0 из ' + academy.courses.length + ' завершено</span></div>' +
    '<div class="course-grid">' + academy.courses.map(courseCard).join("") + '</div>' +
    '</section>' +
    (academy.final === false ? "" : '<section class="section"><div class="section-head"><div><h2>Тестирование</h2><p>Финальный раздел академии доступен после прохождения курсов бренда.</p></div></div><div class="course-grid course-grid--single">' + finalCard() + '</div></section>');

  function refreshPlanButtons() {
    document.querySelectorAll("[data-plan-id]").forEach(function (button) {
      var active = isPlanned(button.getAttribute("data-plan-id"));
      var title = button.getAttribute("data-plan-title") || "обучение";
      button.classList.toggle("is-planned", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", (active ? "Запланировано: " : "Запланировать ") + title);
    });
  }

  function openPlanner(config) {
    if (window.TouchSpaceLessonScheduler && window.TouchSpaceLessonScheduler.openPlan) {
      window.TouchSpaceLessonScheduler.openPlan(config);
    }
  }

  document.addEventListener("click", function (event) {
    var favorite = event.target.closest("[data-favorite-toggle]");
    var planCourse = event.target.closest("[data-plan-course]");
    var planAcademy = event.target.closest("[data-plan-academy]");
    var card = event.target.closest(".course-card[data-href]");

    if (favorite) return;

    if (planAcademy) {
      event.preventDefault();
      event.stopPropagation();
      openPlanner({
        id: planAcademy.getAttribute("data-plan-id"),
        type: "academy",
        brand: academy.name,
        lesson: "Академия",
        title: "Академия " + academy.name,
        duration: academy.courses.length * 60,
        url: pageUrl,
        heading: "Запланировать академию",
        subtitle: academy.name + " · вся академия бренда"
      });
      return;
    }

    if (planCourse) {
      event.preventDefault();
      event.stopPropagation();
      var courseId = planCourse.getAttribute("data-plan-course");
      var course = null;
      academy.courses.forEach(function (item) {
        if (item[0] === courseId) course = item;
      });
      if (course) {
        openPlanner({
          id: planCourse.getAttribute("data-plan-id"),
          type: "course",
          brand: academy.name,
          lesson: course[1],
          title: course[1],
          duration: parseInt(course[6], 10) || 45,
          url: "brands/touchspace_brand_pages/" + course[9],
          heading: "Запланировать курс",
          subtitle: academy.name + " · " + course[1]
        });
      }
      return;
    }

    if (card) {
      window.location.href = card.getAttribute("data-href");
    }
  });

  if (window.TouchSpaceHeader && typeof window.TouchSpaceHeader.refreshFavorites === "function") {
    window.TouchSpaceHeader.refreshFavorites();
  }
  refreshPlanButtons();
  window.addEventListener("touchspace-scheduled-lessons-change", refreshPlanButtons);
})();
