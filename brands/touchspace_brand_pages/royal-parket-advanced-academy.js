(function () {
  var root = document.querySelector("[data-brand-academy-root]");
  var manifest = window.RoyalParketAdvancedCourseManifest;
  if (!root || !manifest) return;

  var academy = {
    name: "Royal Parket",
    category: "Паркетная и инженерная доска из дуба",
    logo: manifest.логотип,
    summary: "Последовательный курс по Royal Parket: Click 130 и Click 150, инженерная доска Authentica, английская ёлка Angle, палитра, подбор, монтаж и эксплуатация."
  };
  var pageUrl = "brands/touchspace_brand_pages/royal-parket-advanced-academy.html";
  document.title = "Академия Royal Parket Advanced | TouchSpace Академия";

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }
  function activeUser() {
    var api = window.TouchSpaceAcademy;
    return api && api.getActiveUser ? api.getActiveUser() : null;
  }
  function canBypass() {
    var user = activeUser();
    return !!user && (user.id === "admin" || user.type === "admin" || user.id === "supplier" || user.type === "supplier");
  }
  function canPlanAccount() {
    var user = activeUser();
    return !user || (user.id !== "supplier" && user.type !== "supplier");
  }
  function readState(key) {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch (error) { return {}; }
  }
  function modulePassed(record) {
    var state = readState(record.storage_key);
    return !!(state.finalTest && state.finalTest.passed);
  }
  function moduleProgress(record) {
    var state = readState(record.storage_key);
    var pageCount = Number(record.количество_разделов || 0);
    var done = 0;
    if (state.pages) Object.keys(state.pages).forEach(function (id) { if (state.pages[id] && state.pages[id].passed) done += 1; });
    if (state.finalTest && state.finalTest.passed) done += 1;
    return Math.max(0, Math.min(100, Math.round(done / Math.max(1, pageCount + 1) * 100)));
  }
  function moduleUnlocked(index) {
    if (canBypass() || index === 0) return true;
    return modulePassed(manifest.модули[index - 1]);
  }
  function allModulesPassed() {
    return manifest.модули.every(modulePassed);
  }
  function finalPassed() {
    var state = readState(manifest.итоговый_тест.storage_key);
    return !!state.passed;
  }
  function scheduledItems() {
    try {
      var items = JSON.parse(localStorage.getItem("touchspaceScheduledLessons") || "[]");
      return Array.isArray(items) ? items : [];
    } catch (error) { return []; }
  }
  function isPlanned(id) { return scheduledItems().some(function (item) { return item.id === id; }); }
  function favoriteButton(id, title, type, url, desc) {
    return '<button class="course-action course-action--favorite" type="button" data-favorite-toggle data-favorite-id="' + esc(id) + '" data-favorite-title="' + esc(title) + '" data-favorite-type="' + esc(type) + '" data-favorite-url="' + esc(url) + '" data-favorite-description="' + esc(desc) + '" aria-label="Добавить ' + esc(title) + ' в избранное" aria-pressed="false"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>';
  }
  function planButton(id, title, courseId) {
    var planned = isPlanned(id);
    return '<button class="course-action course-action--plan' + (planned ? " is-planned" : "") + '" type="button" data-plan-course="' + esc(courseId) + '" data-plan-id="' + esc(id) + '" data-plan-title="' + esc(title) + '" aria-label="' + (planned ? "Запланировано: " : "Запланировать ") + esc(title) + '" aria-pressed="' + String(planned) + '"><img class="calendar-icon" src="../../icons/calendar.svg" alt="" aria-hidden="true"></button>';
  }
  var arts = ["art-blue","art-mint","art-violet","art-blue","art-mint","art-violet","art-blue"];
  var icons = ["../../icons/5.png","../../icons/7.png","../../icons/8.png","../../icons/9.png","../../icons/4.png","../../icons/6.png","../../icons/1.png"];

  function courseCard(record, index) {
    var unlocked = moduleUnlocked(index);
    var passed = modulePassed(record);
    var progress = moduleProgress(record);
    var id = record.идентификатор;
    var title = record.название;
    var desc = record.описание;
    var fullUrl = "brands/touchspace_brand_pages/" + record.url;
    var favorite = favoriteButton("academy-royal-parket-advanced-course-" + id, title, "Курс академии", fullUrl, desc);
    var schedule = canPlanAccount() && unlocked ? planButton("academy-royal-parket-advanced-" + id, title, id) : "";
    var statusClass = passed ? "course-status--done" : (unlocked ? "course-status--new" : "course-status--locked");
    var statusText = passed ? "Курс завершён" : (unlocked ? "Доступен" : "Сначала предыдущий модуль");
    return '<article class="course-card ' + (unlocked ? 'is-link' : 'is-locked') + '"' + (unlocked ? ' data-href="' + esc(record.url) + '"' : '') + '>' +
      '<div class="course-card__image ' + arts[index % arts.length] + '" data-badge="' + esc(record.количество_разделов + " раздела") + '"><div class="course-card__tools">' + favorite + schedule + '</div><img src="' + icons[index % icons.length] + '" alt=""></div>' +
      '<div class="course-card__body">' +
      '<span class="course-status ' + statusClass + '">' + statusText + '</span>' +
      '<span class="badge">Модуль ' + String(index + 1).padStart(2,"0") + '</span>' +
      '<h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' +
      '<div class="course-progress" style="--progress:' + progress + '%"><span></span></div>' +
      '<div class="course-card__foot"><span class="level">' + esc(record.уровень) + '</span><span>' + esc(record.продолжительность_минут + " мин") + '</span></div>' +
      '</div></article>';
  }
  function finalCard() {
    var unlocked = allModulesPassed() || canBypass();
    var passed = finalPassed();
    var record = manifest.итоговый_тест;
    var title = record.название;
    var desc = "Большая итоговая проверка по всем семи модулям. 20 вопросов, проходной результат — " + record.проходной_балл_процентов + "%.";
    var favorite = favoriteButton("academy-royal-parket-advanced-final-test", title, "Тест академии", "brands/touchspace_brand_pages/" + record.url, desc);
    return '<article class="course-card ' + (unlocked ? 'is-link' : 'is-locked') + '"' + (unlocked ? ' data-href="' + esc(record.url) + '"' : '') + '>' +
      '<div class="course-card__image art-cream" data-badge="20 вопросов"><div class="course-card__tools">' + favorite + '</div><img src="../../icons/4.png" alt=""></div>' +
      '<div class="course-card__body">' +
      '<span class="course-status ' + (passed ? 'course-status--done' : (unlocked ? 'course-status--new' : 'course-status--locked')) + '">' + (passed ? 'Тест пройден' : (unlocked ? 'Доступен' : 'Откроется после модулей')) + '</span>' +
      '<span class="badge">Итоговая проверка</span><h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' +
      '<div class="course-progress" style="--progress:' + (passed ? 100 : 0) + '%"><span></span></div>' +
      '<div class="course-card__foot"><span class="level">Итоговый</span><span>25 мин</span></div></div></article>';
  }
  function completedCount() { return manifest.модули.filter(modulePassed).length; }

  root.innerHTML = '<div class="topline">' +
    '<nav class="breadcrumb" aria-label="Хлебные крошки"><a href="../../brands.html">Бренды</a><span>/</span><span>Академия Royal Parket Advanced</span></nav>' +
    '<a class="back-link" href="../../brands.html">Назад к каталогу брендов</a></div>' +
    '<section class="academy-hero"><div><span class="eyebrow">Академия бренда</span><h1>Академия Royal Parket</h1><p>' + esc(academy.summary) + '</p>' +
    '<div class="academy-actions"><button class="brand-hero-favorite academy-favorite" type="button" aria-label="Добавить Академию Royal Parket в избранное" aria-pressed="false" data-favorite-toggle data-favorite-id="academy-royal-parket-advanced" data-favorite-title="Академия Royal Parket Advanced" data-favorite-type="Академия бренда" data-favorite-url="' + esc(pageUrl) + '" data-favorite-description="' + esc(academy.summary) + '"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>' +
    (canPlanAccount() ? '<button class="academy-plan-btn" type="button" data-plan-academy="royal-parket-advanced" data-plan-id="academy-royal-parket-advanced" data-plan-title="Академия Royal Parket Advanced" aria-label="Запланировать Академию Royal Parket" aria-pressed="false"><img class="calendar-icon" src="../../icons/calendar.svg" alt="" aria-hidden="true"></button>' : '') +
    '</div></div><aside class="brand-box"><div class="brand-logo"><img src="' + esc(academy.logo) + '" alt="Royal Parket"></div><strong>Royal Parket</strong><span>' + esc(academy.category) + '</span></aside></section>' +
    '<section class="section"><div class="section-head"><div><h2>Курсы бренда</h2><p>Каждый модуль состоит из четырёх страниц, проверок после страниц и итогового теста блока.</p></div><span class="course-count">' + completedCount() + ' из ' + manifest.модули.length + ' завершено</span></div>' +
    '<div class="course-grid">' + manifest.модули.map(courseCard).join("") + '</div></section>' +
    '<section class="section"><div class="section-head"><div><h2>Итоговое тестирование</h2><p>Открывается после успешного прохождения всех семи модулей.</p></div></div><div class="course-grid course-grid--single">' + finalCard() + '</div></section>';

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
    if (window.TouchSpaceLessonScheduler && window.TouchSpaceLessonScheduler.openPlan) window.TouchSpaceLessonScheduler.openPlan(config);
  }
  document.addEventListener("click", function (event) {
    var favorite = event.target.closest("[data-favorite-toggle]");
    var planCourse = event.target.closest("[data-plan-course]");
    var planAcademy = event.target.closest("[data-plan-academy]");
    var card = event.target.closest(".course-card[data-href]");
    if (favorite) return;
    if (planAcademy) {
      event.preventDefault(); event.stopPropagation();
      openPlanner({id:"academy-royal-parket-advanced",type:"academy",brand:"Royal Parket",lesson:"Академия",title:"Академия Royal Parket Advanced",duration:292,url:pageUrl,heading:"Запланировать академию",subtitle:"Royal Parket · вся академия бренда"});
      return;
    }
    if (planCourse) {
      event.preventDefault(); event.stopPropagation();
      var id = planCourse.getAttribute("data-plan-course");
      var record = manifest.модули.find(function (item) { return item.идентификатор === id; });
      if (record) openPlanner({id:planCourse.getAttribute("data-plan-id"),type:"course",brand:"Royal Parket",lesson:record.название,title:record.название,duration:record.продолжительность_минут,url:"brands/touchspace_brand_pages/" + record.url,heading:"Запланировать курс",subtitle:"Royal Parket · " + record.название});
      return;
    }
    if (card) window.location.href = card.getAttribute("data-href");
  });
  if (window.TouchSpaceHeader && typeof window.TouchSpaceHeader.refreshFavorites === "function") window.TouchSpaceHeader.refreshFavorites();
  refreshPlanButtons();
  window.addEventListener("touchspace-scheduled-lessons-change", refreshPlanButtons);
})();