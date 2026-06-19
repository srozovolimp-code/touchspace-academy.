(function () {
  "use strict";

  var root = document.querySelector("[data-pergo-advanced-root]");
  if (!root) return;

  var DATA_BASE = "data/pergo-advanced/";
  var STORAGE_NS = "touchspace.academy.pergo-advanced.v1";
  var BRAND_LOGO = "../../images/brand-logos/Pergo.png";
  var FAVORITE_ID = "brand-academy:pergo-advanced";
  var DATE_LABEL = "19.06.2026";
  var FORBIDDEN_PATTERNS = [
    /натуральн[а-я ]*дерев/i,
    /дубов[а-я ]*доск/i,
    /деревянн[а-я ]*доск/i,
    /массив/i,
    /паркет/i,
    /абсолютн[а-я ]*нецарап/i,
    /не боится воды/i,
    /любо[йм] помещени/i,
    /без подготовки основания/i,
    /без зазоров/i
  ];

  var pageType = document.body.getAttribute("data-pergo-advanced-page") || "academy";
  var state = null;
  var data = {};
  var activeModuleId = null;
  var activeLessonId = null;
  var renderedTest = null;

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function fetchJson(file) {
    return fetch(DATA_BASE + file, { cache: "no-cache" }).then(function (response) {
      if (!response.ok) throw new Error("Не удалось загрузить " + file);
      return response.json();
    });
  }

  function getActiveUser() {
    var api = window.TouchSpaceAcademy;
    if (api && typeof api.getActiveUser === "function") return api.getActiveUser();
    return { id: "student", type: "student", name: "Сергей Розов" };
  }

  function isPreviewUser() {
    var user = getActiveUser();
    return user.id === "admin" || user.type === "admin" || user.id === "supplier" || user.type === "supplier";
  }

  function storageKey() {
    var user = getActiveUser();
    return STORAGE_NS + "." + (user.id || "guest");
  }

  function defaultState() {
    return {
      completed_lessons: [],
      lesson_scores: {},
      lesson_attempts: {},
      completed_modules: [],
      module_scores: {},
      module_attempts: {},
      final_score: null,
      final_attempts: 0,
      last_route: "pergo-advanced-module.html?module=brand-history"
    };
  }

  function readState() {
    try {
      return Object.assign(defaultState(), JSON.parse(localStorage.getItem(storageKey()) || "{}"));
    } catch (error) {
      return defaultState();
    }
  }

  function writeState(nextState) {
    state = nextState;
    if (isPreviewUser()) return;
    try {
      localStorage.setItem(storageKey(), JSON.stringify(state));
    } catch (error) {}
  }

  function uniqPush(list, id) {
    if (list.indexOf(id) === -1) list.push(id);
  }

  function moduleById(id) {
    return data.course.modules.find(function (module) { return module.id === id; });
  }

  function lessonById(module, id) {
    return module.lessons.find(function (lesson) { return lesson.id === id; });
  }

  function moduleIndex(id) {
    return data.course.modules.findIndex(function (module) { return module.id === id; });
  }

  function allLessons() {
    return data.course.modules.reduce(function (acc, module) {
      return acc.concat(module.lessons.map(function (lesson) {
        return { module: module, lesson: lesson };
      }));
    }, []);
  }

  function courseProgress() {
    var total = allLessons().length + data.course.modules.length + 1;
    var done = state.completed_lessons.length + state.completed_modules.length + (state.final_score >= data.tests.final_exam.pass_percent ? 1 : 0);
    return total ? Math.round(done / total * 100) : 0;
  }

  function moduleProgress(module) {
    var doneLessons = module.lessons.filter(function (lesson) {
      return state.completed_lessons.indexOf(lesson.id) !== -1;
    }).length;
    var moduleDone = state.completed_modules.indexOf(module.id) !== -1 ? 1 : 0;
    return Math.round((doneLessons + moduleDone) / (module.lessons.length + 1) * 100);
  }

  function isModuleOpen(module) {
    if (isPreviewUser()) return true;
    if (module.order === 1) return true;
    var prev = data.course.modules[module.order - 2];
    return prev && state.completed_modules.indexOf(prev.id) !== -1;
  }

  function isLessonOpen(module, lesson) {
    if (isPreviewUser()) return true;
    var idx = module.lessons.findIndex(function (item) { return item.id === lesson.id; });
    if (idx === 0) return isModuleOpen(module);
    return state.completed_lessons.indexOf(module.lessons[idx - 1].id) !== -1;
  }

  function isModuleTestOpen(module) {
    if (isPreviewUser()) return true;
    return module.lessons.every(function (lesson) {
      return state.completed_lessons.indexOf(lesson.id) !== -1;
    });
  }

  function isFinalOpen() {
    if (isPreviewUser()) return true;
    return data.course.modules.every(function (module) {
      return state.completed_modules.indexOf(module.id) !== -1;
    });
  }

  function favoriteIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.2-4.6-9.6-9.1C.8 8.8 2.1 5.1 5.4 4.2c1.9-.5 4 .2 5.2 1.8L12 7.8l1.4-1.8c1.2-1.6 3.3-2.3 5.2-1.8 3.3.9 4.6 4.6 3 7.7C19.2 16.4 12 21 12 21z"/></svg>';
  }

  function updateFavoriteButtons() {
    var api = window.TouchSpaceAcademy;
    var active = api && typeof api.isFavorite === "function" ? api.isFavorite(FAVORITE_ID) : false;
    document.querySelectorAll("[data-pa-favorite]").forEach(function (button) {
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function favoriteButton() {
    if (window.TouchSpaceAcademy && window.TouchSpaceAcademy.isSupplierAccount && window.TouchSpaceAcademy.isSupplierAccount()) return "";
    return '<button class="pa-icon-btn" type="button" data-pa-favorite aria-label="Добавить академию Pergo Advanced в избранное">' + favoriteIcon() + '</button>';
  }

  function renderProgress(percent) {
    return '<div class="pa-progress" aria-label="Прогресс ' + percent + '%"><span style="width:' + percent + '%"></span></div>';
  }

  function academyUrl() {
    return "pergo-advanced-academy.html";
  }

  function moduleUrl(id) {
    return "pergo-advanced-module.html?module=" + encodeURIComponent(id);
  }

  function testUrlFinal() {
    return "pergo-advanced-module.html?module=final";
  }

  function renderAcademy() {
    var progress = courseProgress();
    var firstIncomplete = data.course.modules.find(function (module) {
      return state.completed_modules.indexOf(module.id) === -1;
    }) || data.course.modules[0];
    var cta = progress > 0 ? "Продолжить" : "Начать";
    root.innerHTML =
      '<div class="pa-breadcrumb"><div><a href="../../brands.html">Бренды</a> / Pergo Advanced</div><a class="pa-btn" href="../../brands.html">Назад к каталогу брендов</a></div>' +
      '<section class="pa-hero">' +
        '<div>' +
          '<span class="pa-kicker">Академия бренда</span>' +
          '<h1 class="pa-title">Pergo Advanced</h1>' +
          '<p class="pa-subtitle">' + escapeHtml(data.course.subtitle) + '</p>' +
          '<div class="pa-hero-actions">' +
            '<a class="pa-btn pa-btn-primary" href="' + moduleUrl(firstIncomplete.id) + '">' + cta + '</a>' +
            favoriteButton() +
          '</div>' +
          '<div class="pa-meta">Данные проверены: ' + DATE_LABEL + '. ' + escapeHtml(data.course.notice) + '</div>' +
        '</div>' +
        '<div class="pa-logo-card">' +
          '<img src="' + BRAND_LOGO + '" alt="Pergo">' +
          '<div><strong>Углубленный курс Pergo</strong><div class="pa-meta">История, технологии, ассортимент и консультация</div></div>' +
          '<div><div class="pa-progress-row"><span>Общий прогресс</span><span>' + progress + '%</span></div>' + renderProgress(progress) + '</div>' +
        '</div>' +
      '</section>' +
      '<section class="pa-section pa-panel">' +
        '<div class="pa-section-head"><div><h2>Результат курса</h2><p>После прохождения реселлер сможет уверенно консультировать по Pergo без спорных обещаний.</p></div></div>' +
        '<ul class="pa-outcomes">' + data.course.learning_result.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join("") + '</ul>' +
      '</section>' +
      '<section class="pa-section">' +
        '<div class="pa-section-head"><div><h2>Модули курса</h2><p>Каждый модуль открывает следующий после успешной проверки знаний.</p></div><strong>' + progress + '% курса</strong></div>' +
        '<div class="pa-grid">' + data.course.modules.map(renderModuleCard).join("") + renderFinalCard() + '</div>' +
      '</section>' +
      '<section class="pa-section pa-panel">' +
        '<div class="pa-section-head"><div><h2>Быстрые инструменты</h2><p>Переходы к ключевым темам и памяткам курса.</p></div></div>' +
        '<div class="pa-inline-actions">' + data.course.quick_tools.map(renderQuickTool).join("") + '</div>' +
      '</section>' +
      '<section class="pa-section pa-panel" id="sources">' +
        '<div class="pa-section-head"><div><h2>Реестр источников</h2><p>Используются только проверяемые материалы и локальные данные платформы.</p></div></div>' +
        '<div class="pa-source-list">' + data.sources.sources.map(function (source) {
          return '<div class="pa-block pa-sources"><strong>' + escapeHtml(source.id) + ' · ' + escapeHtml(source.title) + '</strong><p>' + escapeHtml(source.region) + ' · надежность ' + escapeHtml(source.reliability) + ' · проверено ' + DATE_LABEL + '</p></div>';
        }).join("") + '</div>' +
      '</section>';
    updateFavoriteButtons();
  }

  function renderQuickTool(tool) {
    var href = academyUrl();
    if (tool.target.indexOf("module:") === 0) href = moduleUrl(tool.target.replace("module:", ""));
    if (tool.target === "sources") href = "#sources";
    return '<a class="pa-btn" href="' + href + '">' + escapeHtml(tool.label) + '</a>';
  }

  function renderModuleCard(module) {
    var open = isModuleOpen(module);
    var percent = moduleProgress(module);
    var completed = state.completed_modules.indexOf(module.id) !== -1;
    var button = completed ? "Повторить" : (percent > 0 ? "Продолжить" : "Начать");
    return '<article class="pa-module-card">' +
      '<div class="pa-module-visual"><span class="pa-module-index">' + module.order + '</span></div>' +
      '<h3>' + escapeHtml(module.title) + '</h3>' +
      '<p>' + escapeHtml(module.result) + '</p>' +
      '<div class="pa-module-foot">' +
        '<div class="pa-progress-row"><span>' + module.lessons.length + ' урока, ' + module.duration_min + ' мин</span><span>' + percent + '%</span></div>' +
        renderProgress(percent) +
        '<div class="pa-card-actions">' +
          (open ? '<a class="pa-btn pa-btn-primary" href="' + moduleUrl(module.id) + '">' + button + '</a>' : '<button class="pa-btn" type="button" disabled>Откроется позже</button>') +
          '<span class="pa-meta">' + (completed ? 'раздел пройден' : 'проверка ' + (module.module_test_id ? 'в конце' : '')) + '</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderFinalCard() {
    var open = isFinalOpen();
    var passed = state.final_score >= data.tests.final_exam.pass_percent;
    return '<article class="pa-module-card">' +
      '<div class="pa-module-visual"><span class="pa-module-index">★</span></div>' +
      '<h3>Итоговый практикум</h3>' +
      '<p>Финальный сценарный тест по истории, технологиям, ассортименту, визуальному подбору, монтажу и продаже.</p>' +
      '<div class="pa-module-foot">' +
        '<div class="pa-progress-row"><span>' + data.course.final_exam.duration_min + ' мин</span><span>' + (passed ? '100%' : '0%') + '</span></div>' +
        renderProgress(passed ? 100 : 0) +
        (open ? '<a class="pa-btn pa-btn-primary" href="' + testUrlFinal() + '">' + (passed ? 'Повторить' : 'Открыть') + '</a>' : '<button class="pa-btn" type="button" disabled>Откроется после модулей</button>') +
      '</div>' +
    '</article>';
  }

  function renderModulePage() {
    var params = new URLSearchParams(location.search);
    activeModuleId = params.get("module") || "brand-history";

    if (activeModuleId === "final") {
      renderFinalPage();
      return;
    }

    var module = moduleById(activeModuleId) || data.course.modules[0];
    if (!isModuleOpen(module)) {
      renderLocked(module);
      return;
    }

    var requestedLesson = params.get("lesson");
    activeLessonId = requestedLesson || module.lessons[0].id;
    var lesson = lessonById(module, activeLessonId) || module.lessons[0];
    if (!isLessonOpen(module, lesson)) lesson = module.lessons[0];
    activeLessonId = lesson.id;

    if (!isPreviewUser()) {
      state.last_route = moduleUrl(module.id) + "&lesson=" + encodeURIComponent(lesson.id);
      writeState(state);
    }

    root.innerHTML =
      '<div class="pa-breadcrumb"><div><a href="../../brands.html">Бренды</a> / <a href="' + academyUrl() + '">Pergo Advanced</a> / ' + escapeHtml(module.title) + '</div><a class="pa-btn" href="' + academyUrl() + '">Назад в академию</a></div>' +
      '<section class="pa-module-shell">' +
        renderAside(module, lesson) +
        '<div class="pa-module-content">' +
          '<div class="pa-module-top">' +
            '<span class="pa-page-count">Урок ' + (module.lessons.indexOf(lesson) + 1) + ' из ' + module.lessons.length + '</span>' +
            '<div class="pa-inline-actions">' + favoriteButton() + '</div>' +
          '</div>' +
          '<div class="pa-module-heading"><span class="pa-kicker">Урок</span><h1>' + escapeHtml(lesson.title) + '</h1><p>' + escapeHtml(lesson.goal) + '</p></div>' +
          '<div class="pa-content-blocks">' + lesson.blocks.map(renderBlock).join("") + '</div>' +
          renderLessonTest(module, lesson) +
          renderBottomNav(module, lesson) +
        '</div>' +
      '</section>';
    updateFavoriteButtons();
  }

  function renderAside(module, lesson) {
    var progress = moduleProgress(module);
    return '<aside class="pa-course-aside">' +
      '<div class="pa-aside-hero"><div class="pa-aside-logo"><img src="' + BRAND_LOGO + '" alt="Pergo"></div><h1>' + escapeHtml(module.title) + '</h1><p>' + module.duration_min + ' мин · последовательное прохождение · ' + module.lessons.length + ' урока</p></div>' +
      '<div class="pa-aside-progress"><div class="pa-progress-row"><span>Пройдено</span><span>' + progress + '%</span></div>' + renderProgress(progress) + '</div>' +
      '<nav class="pa-lesson-nav">' +
        module.lessons.map(function (item, index) {
          var done = state.completed_lessons.indexOf(item.id) !== -1;
          var open = isLessonOpen(module, item);
          return '<button class="pa-lesson-btn' + (item.id === lesson.id ? ' is-active' : '') + '" type="button" data-pa-lesson="' + item.id + '"' + (open ? '' : ' disabled') + '>' +
            '<span class="pa-lesson-number">' + (index + 1) + '</span><span><span class="pa-lesson-title">' + escapeHtml(item.title) + '</span><span class="pa-lesson-state">' + (done ? 'пройдено' : open ? 'доступно' : 'закрыто') + '</span></span><span class="pa-check">' + (done ? '✓' : '') + '</span>' +
          '</button>';
        }).join("") +
        '<button class="pa-lesson-btn' + (isModuleTestOpen(module) ? '' : ' is-disabled') + '" type="button" data-pa-module-test' + (isModuleTestOpen(module) ? '' : ' disabled') + '><span class="pa-lesson-number">★</span><span><span class="pa-lesson-title">Итоговая проверка</span><span class="pa-lesson-state">' + (state.completed_modules.indexOf(module.id) !== -1 ? 'пройдено' : isModuleTestOpen(module) ? 'доступно' : 'закрыто') + '</span></span><span class="pa-check">' + (state.completed_modules.indexOf(module.id) !== -1 ? '✓' : '') + '</span></button>' +
      '</nav>' +
    '</aside>';
  }

  function renderBlock(block) {
    if (block.type === "callout") return '<article class="pa-block pa-callout"><h2>' + escapeHtml(block.title) + '</h2><p>' + escapeHtml(block.text) + '</p></article>';
    if (block.type === "warning") return '<article class="pa-block pa-warning"><h2>' + escapeHtml(block.title) + '</h2><p>' + escapeHtml(block.text) + '</p></article>';
    if (block.type === "text") return '<article class="pa-block"><h2>' + escapeHtml(block.title) + '</h2>' + block.paragraphs.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join("") + '</article>';
    if (block.type === "timeline") return '<article class="pa-block"><h2>Ключевые этапы</h2><ul class="pa-timeline">' + block.items.map(function (item) { return '<li><span class="pa-pill">' + escapeHtml(item.year) + '</span><div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.text) + '</p></div></li>'; }).join("") + '</ul></article>';
    if (block.type === "sales_script") return '<article class="pa-block"><h2>' + escapeHtml(block.title) + '</h2><div class="pa-script"><div><strong>Говорим так</strong><p>' + escapeHtml(block.good) + '</p></div><div><strong>Не обещаем так</strong><p>' + escapeHtml(block.avoid) + '</p></div></div></article>';
    if (block.type === "source_note") return renderSourceNote(block);
    if (block.type === "layer_diagram") return '<article class="pa-block"><h2>Конструкция ламината</h2><ul class="pa-layer-list">' + block.layers.map(function (layer) { return '<li><span class="pa-pill">' + escapeHtml(layer.name) + '</span><div><strong>' + escapeHtml(layer.material) + '</strong><p>' + escapeHtml(layer.function) + '. ' + escapeHtml(layer.meaning) + '</p></div></li>'; }).join("") + '</ul></article>';
    if (block.type === "technology_card") return renderTechnologyBlock(block);
    if (block.type === "collection_compare") return '<article class="pa-block"><h2>' + escapeHtml(block.title) + '</h2><div class="pa-script"><div><strong>Международные данные</strong><p>' + escapeHtml(block.left) + '</p></div><div><strong>Каталог TouchSpace</strong><p>' + escapeHtml(block.right) + '</p></div></div><p>' + escapeHtml(block.note) + '</p></article>';
    if (block.type === "decor_classifier") return renderDecorBlock(block);
    if (block.type === "decision_tree") return '<article class="pa-block"><h2>' + escapeHtml(block.title) + '</h2><ol class="pa-steps">' + block.steps.map(function (step, index) { return '<li><span class="pa-pill">' + (index + 1) + '</span><div>' + escapeHtml(step) + '</div></li>'; }).join("") + '</ol></article>';
    if (block.type === "scenario") return '<article class="pa-block"><h2>' + escapeHtml(block.title) + '</h2><ul class="pa-steps">' + block.items.map(function (item) { return '<li><span class="pa-pill">?</span><div>' + escapeHtml(item) + '</div></li>'; }).join("") + '</ul></article>';
    return '<article class="pa-block"><pre>' + escapeHtml(JSON.stringify(block, null, 2)) + '</pre></article>';
  }

  function renderTechnologyBlock(block) {
    var tech = data.technologies.technologies.filter(function (item) { return block.technology_ids.indexOf(item.id) !== -1; });
    return '<article class="pa-block"><h2>Технологии Pergo</h2><ul class="pa-layer-list">' + tech.map(function (item) {
      return '<li><span class="pa-pill">' + escapeHtml(item.name) + '</span><div><strong>' + escapeHtml(item.short) + '</strong><p>' + escapeHtml(item.seller_note) + '</p><div class="pa-meta">' + escapeHtml(item.market_label) + ' · проверено ' + DATE_LABEL + '</div></div></li>';
    }).join("") + '</ul></article>';
  }

  function renderDecorBlock(block) {
    return '<article class="pa-block"><h2>' + escapeHtml(block.title) + '</h2><p>' + escapeHtml(block.text) + '</p><ul class="pa-pairs">' + data.decor.fields.map(function (field) {
      return '<li><span class="pa-pill">' + escapeHtml(field) + '</span><div>Используйте как нейтральный параметр визуального описания.</div></li>';
    }).join("") + '</ul></article>';
  }

  function renderSourceNote(block) {
    var sources = data.sources.sources.filter(function (source) { return block.source_ids.indexOf(source.id) !== -1; });
    return '<article class="pa-block pa-sources"><h3>Источники и проверка</h3>' + sources.map(function (source) {
      return '<p><strong>' + escapeHtml(source.id) + '</strong> · ' + escapeHtml(source.title) + ' · ' + escapeHtml(source.region) + ' · надежность ' + escapeHtml(source.reliability) + '</p>';
    }).join("") + '<p>Проверено: ' + DATE_LABEL + '</p></article>';
  }

  function renderLessonTest(module, lesson) {
    var test = data.tests.lesson_tests[lesson.test_id];
    var passed = state.completed_lessons.indexOf(lesson.id) !== -1;
    return '<section class="pa-test-card" data-pa-test-card data-test-type="lesson" data-test-id="' + escapeHtml(lesson.test_id) + '" data-module-id="' + escapeHtml(module.id) + '" data-lesson-id="' + escapeHtml(lesson.id) + '">' +
      '<h2>' + escapeHtml(test.title) + '</h2>' +
      '<p class="pa-meta">Для открытия следующего урока нужен результат 100%.</p>' +
      (passed ? '<div class="pa-test-result is-pass">Урок пройден. Лучший результат: ' + (state.lesson_scores[lesson.id] || 100) + '%.</div>' : '') +
      '<button class="pa-btn pa-btn-primary" type="button" data-pa-start-test>Открыть проверку</button>' +
    '</section>';
  }

  function renderBottomNav(module, lesson) {
    var idx = module.lessons.indexOf(lesson);
    var prev = idx > 0 ? module.lessons[idx - 1] : null;
    var next = idx < module.lessons.length - 1 ? module.lessons[idx + 1] : null;
    return '<div class="pa-panel pa-section pa-inline-actions">' +
      (prev ? '<a class="pa-btn" href="' + moduleUrl(module.id) + '&lesson=' + encodeURIComponent(prev.id) + '">Назад</a>' : '<a class="pa-btn" href="' + academyUrl() + '">В академию</a>') +
      (next && isLessonOpen(module, next) ? '<a class="pa-btn pa-btn-primary" href="' + moduleUrl(module.id) + '&lesson=' + encodeURIComponent(next.id) + '">Следующий урок</a>' : '') +
      (!next && isModuleTestOpen(module) ? '<button class="pa-btn pa-btn-primary" type="button" data-pa-module-test>Итоговая проверка раздела</button>' : '') +
    '</div>';
  }

  function renderLocked(module) {
    root.innerHTML = '<div class="pa-breadcrumb"><a href="' + academyUrl() + '">Назад в академию</a></div><section class="pa-panel"><span class="pa-kicker">Раздел закрыт</span><h1 class="pa-title">' + escapeHtml(module.title) + '</h1><p class="pa-subtitle">Этот раздел откроется после прохождения предыдущего раздела.</p></section>';
  }

  function renderFinalPage() {
    root.innerHTML =
      '<div class="pa-breadcrumb"><div><a href="../../brands.html">Бренды</a> / <a href="' + academyUrl() + '">Pergo Advanced</a> / Итоговый практикум</div><a class="pa-btn" href="' + academyUrl() + '">Назад в академию</a></div>' +
      '<section class="pa-module-shell">' +
        '<aside class="pa-course-aside"><div class="pa-aside-hero"><div class="pa-aside-logo"><img src="' + BRAND_LOGO + '" alt="Pergo"></div><h1>Итоговый практикум</h1><p>' + data.course.final_exam.duration_min + ' мин · сценарная проверка</p></div><div class="pa-aside-progress"><div class="pa-progress-row"><span>Итог</span><span>' + (state.final_score || 0) + '%</span></div>' + renderProgress(state.final_score || 0) + '</div></aside>' +
        '<div class="pa-module-content"><div class="pa-module-heading"><span class="pa-kicker">Финал</span><h1>Итоговый практикум Pergo Advanced</h1><p>Проверка объединяет историю бренда, конструкцию, технологии, ассортимент, визуальный подбор, монтаж и консультацию.</p></div>' +
        (isFinalOpen() ? '<section class="pa-test-card" data-pa-test-card data-test-type="final" data-test-id="' + data.tests.final_exam.id + '"><h2>' + escapeHtml(data.tests.final_exam.title) + '</h2><p class="pa-meta">Для завершения курса нужен результат не ниже 80%.</p><button class="pa-btn pa-btn-primary" type="button" data-pa-start-test>Открыть практикум</button></section>' : '<article class="pa-block pa-warning"><h2>Практикум закрыт</h2><p>Он откроется после прохождения всех разделов курса.</p></article>') +
        '</div></section>';
  }

  function startTest(card) {
    var type = card.getAttribute("data-test-type");
    var testId = card.getAttribute("data-test-id");
    var test = null;
    if (type === "lesson") test = data.tests.lesson_tests[testId];
    if (type === "module") test = data.tests.module_tests[testId];
    if (type === "final") test = data.tests.final_exam;
    renderedTest = { type: type, test: test, card: card };
    card.innerHTML = renderTestForm(type, test, card);
  }

  function renderTestForm(type, test, card) {
    return '<h2>' + escapeHtml(test.title) + '</h2>' +
      '<form data-pa-test-form>' + test.questions.map(renderQuestion).join("") +
      '<div class="pa-test-actions"><button class="pa-btn pa-btn-primary" type="submit">Проверить</button></div></form>';
  }

  function renderQuestion(question, index) {
    var html = '<fieldset class="pa-test-question" data-qid="' + escapeHtml(question.id) + '" data-qtype="' + escapeHtml(question.type) + '"><legend><strong>' + (index + 1) + '. ' + escapeHtml(question.text) + '</strong></legend>';
    if (question.type === "single_choice" || question.type === "scenario") {
      html += question.options.map(function (option, i) {
        return '<label class="pa-option"><input type="radio" name="' + question.id + '" value="' + i + '"> <span>' + escapeHtml(option) + '</span></label>';
      }).join("");
    } else if (question.type === "true_false") {
      html += '<label class="pa-option"><input type="radio" name="' + question.id + '" value="true"> <span>Верно</span></label><label class="pa-option"><input type="radio" name="' + question.id + '" value="false"> <span>Неверно</span></label>';
    } else if (question.type === "multiple_choice") {
      html += question.options.map(function (option, i) {
        return '<label class="pa-option"><input type="checkbox" name="' + question.id + '" value="' + i + '"> <span>' + escapeHtml(option) + '</span></label>';
      }).join("");
    } else if (question.type === "matching") {
      html += question.pairs.map(function (pair, i) {
        return '<div class="pa-match-row"><span>' + escapeHtml(pair[0]) + '</span><select class="pa-match-select" name="' + question.id + '-' + i + '"><option value="">Выберите</option>' + question.pairs.map(function (answer, j) { return '<option value="' + j + '">' + escapeHtml(answer[1]) + '</option>'; }).join("") + '</select></div>';
      }).join("");
    } else if (question.type === "sequence") {
      html += question.items.map(function (item, i) {
        return '<div class="pa-order-row"><span>' + escapeHtml(item) + '</span><select class="pa-order-select" name="' + question.id + '-' + i + '">' + question.items.map(function (_, j) { return '<option value="' + j + '">' + (j + 1) + '</option>'; }).join("") + '</select></div>';
      }).join("");
    }
    return html + '</fieldset>';
  }

  function gradeTest(form, type, test, card) {
    var correct = 0;
    test.questions.forEach(function (question) {
      if (isQuestionCorrect(form, question)) correct += 1;
    });
    var score = Math.round(correct / test.questions.length * 100);
    var pass = score >= test.pass_percent;
    recordAttempt(type, score, card);
    var result = '<div class="pa-test-result ' + (pass ? 'is-pass' : 'is-fail') + '">' + (pass ? 'Готово' : 'Нужно повторить') + ': ' + score + '%. Минимум: ' + test.pass_percent + '%.</div>';
    var next = "";
    if (pass) next = applyPassedTest(type, score, card);
    card.querySelector(".pa-test-actions").insertAdjacentHTML("afterend", result + next);
  }

  function selectedValues(form, name) {
    return Array.prototype.slice.call(form.querySelectorAll('[name="' + CSS.escape(name) + '"]:checked')).map(function (input) {
      return input.value;
    });
  }

  function isQuestionCorrect(form, question) {
    if (question.type === "single_choice" || question.type === "scenario") {
      var single = selectedValues(form, question.id);
      return single.length && Number(single[0]) === question.answer;
    }
    if (question.type === "true_false") {
      var bool = selectedValues(form, question.id);
      return bool.length && (bool[0] === "true") === question.answer;
    }
    if (question.type === "multiple_choice") {
      var values = selectedValues(form, question.id).map(Number).sort().join(",");
      return values === question.answers.slice().sort().join(",");
    }
    if (question.type === "matching") {
      return question.pairs.every(function (_, i) {
        var select = form.elements[question.id + "-" + i];
        return select && Number(select.value) === i;
      });
    }
    if (question.type === "sequence") {
      return question.answer.every(function (value, i) {
        var select = form.elements[question.id + "-" + i];
        return select && Number(select.value) === value;
      });
    }
    return false;
  }

  function recordAttempt(type, score, card) {
    if (type === "lesson") {
      var lessonId = card.getAttribute("data-lesson-id");
      state.lesson_attempts[lessonId] = (state.lesson_attempts[lessonId] || 0) + 1;
      state.lesson_scores[lessonId] = Math.max(state.lesson_scores[lessonId] || 0, score);
      writeState(state);
    }
    if (type === "module") {
      var moduleId = card.getAttribute("data-module-id") || activeModuleId;
      state.module_attempts[moduleId] = (state.module_attempts[moduleId] || 0) + 1;
      state.module_scores[moduleId] = Math.max(state.module_scores[moduleId] || 0, score);
      writeState(state);
    }
    if (type === "final") {
      state.final_attempts += 1;
      state.final_score = Math.max(state.final_score || 0, score);
      writeState(state);
    }
  }

  function applyPassedTest(type, score, card) {
    if (type === "lesson") {
      var moduleId = card.getAttribute("data-module-id");
      var lessonId = card.getAttribute("data-lesson-id");
      uniqPush(state.completed_lessons, lessonId);
      writeState(state);
      var module = moduleById(moduleId);
      var idx = module.lessons.findIndex(function (lesson) { return lesson.id === lessonId; });
      if (idx < module.lessons.length - 1) {
        var nextLesson = module.lessons[idx + 1];
        return '<div class="pa-test-actions pa-next-actions"><a class="pa-btn pa-btn-primary" href="' + moduleUrl(moduleId) + '&lesson=' + encodeURIComponent(nextLesson.id) + '">Перейти к следующему уроку</a></div>';
      }
      if (isModuleTestOpen(module)) {
        return '<div class="pa-test-actions pa-next-actions"><button class="pa-btn pa-btn-primary" type="button" data-pa-module-test>Перейти к итоговой проверке раздела</button></div>';
      }
    }
    if (type === "module") {
      var currentModuleId = card.getAttribute("data-module-id") || activeModuleId;
      uniqPush(state.completed_modules, currentModuleId);
      writeState(state);
      var nextModule = data.course.modules[moduleIndex(currentModuleId) + 1];
      if (nextModule) return '<div class="pa-test-actions pa-next-actions"><a class="pa-btn pa-btn-primary" href="' + moduleUrl(nextModule.id) + '">Перейти к следующему разделу</a></div>';
      return '<div class="pa-test-actions pa-next-actions"><a class="pa-btn pa-btn-primary" href="' + testUrlFinal() + '">Перейти к итоговому практикуму</a></div>';
    }
    if (type === "final") {
      return '<div class="pa-test-actions pa-next-actions"><a class="pa-btn pa-btn-primary" href="' + academyUrl() + '">Вернуться в академию</a></div>';
    }
    return "";
  }

  function openModuleTest() {
    var module = moduleById(activeModuleId);
    var test = data.tests.module_tests[module.module_test_id];
    var card = document.createElement("section");
    card.className = "pa-test-card";
    card.setAttribute("data-pa-test-card", "");
    card.setAttribute("data-test-type", "module");
    card.setAttribute("data-test-id", module.module_test_id);
    card.setAttribute("data-module-id", module.id);
    card.innerHTML = renderTestForm("module", test, card);
    var old = document.querySelector("[data-pa-module-test-inline]");
    if (old) old.remove();
    card.setAttribute("data-pa-module-test-inline", "");
    document.querySelector(".pa-module-content").appendChild(card);
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateLoadedContent(payload) {
    var text = JSON.stringify(payload);
    var warnings = FORBIDDEN_PATTERNS.filter(function (pattern) { return pattern.test(text); });
    if (warnings.length) {
      console.warn("Pergo Advanced content validator: найдены рискованные формулировки", warnings);
    }
  }

  function bindEvents() {
    document.addEventListener("click", function (event) {
      var favorite = event.target.closest("[data-pa-favorite]");
      if (favorite) {
        var api = window.TouchSpaceAcademy;
        if (api && typeof api.toggleFavorite === "function") api.toggleFavorite(FAVORITE_ID);
        updateFavoriteButtons();
        event.preventDefault();
        return;
      }
      var lessonButton = event.target.closest("[data-pa-lesson]");
      if (lessonButton && !lessonButton.disabled) {
        location.href = moduleUrl(activeModuleId) + "&lesson=" + encodeURIComponent(lessonButton.getAttribute("data-pa-lesson"));
        return;
      }
      var start = event.target.closest("[data-pa-start-test]");
      if (start) {
        startTest(start.closest("[data-pa-test-card]"));
        return;
      }
      var moduleTest = event.target.closest("[data-pa-module-test]");
      if (moduleTest && !moduleTest.disabled) {
        openModuleTest();
      }
    });

    document.addEventListener("submit", function (event) {
      var form = event.target.closest("[data-pa-test-form]");
      if (!form) return;
      event.preventDefault();
      var card = form.closest("[data-pa-test-card]");
      var type = card.getAttribute("data-test-type");
      var test = type === "lesson" ? data.tests.lesson_tests[card.getAttribute("data-test-id")] :
        type === "module" ? data.tests.module_tests[card.getAttribute("data-test-id")] :
        data.tests.final_exam;
      card.querySelectorAll(".pa-test-result, .pa-next-actions").forEach(function (node) { node.remove(); });
      gradeTest(form, type, test, card);
    });

    window.addEventListener("ts-academy-user-change", function () {
      state = readState();
      if (pageType === "academy") renderAcademy();
      else renderModulePage();
    });
  }

  function init() {
    Promise.all([
      fetchJson("course.json"),
      fetchJson("tests.json"),
      fetchJson("sources.json"),
      fetchJson("technologies.json"),
      fetchJson("collections-international.json"),
      fetchJson("collections-touchspace.json"),
      fetchJson("installation.json"),
      fetchJson("decor-taxonomy.json")
    ]).then(function (results) {
      data.course = results[0];
      data.tests = results[1];
      data.sources = results[2];
      data.technologies = results[3];
      data.collectionsInternational = results[4];
      data.collectionsTouchspace = results[5];
      data.installation = results[6];
      data.decor = results[7];
      validateLoadedContent(data);
      state = readState();
      bindEvents();
      if (pageType === "academy") renderAcademy();
      else renderModulePage();
    }).catch(function (error) {
      root.innerHTML = '<section class="pa-panel"><h1>Pergo Advanced</h1><p>Не удалось загрузить курс: ' + escapeHtml(error.message) + '</p></section>';
      console.error(error);
    });
  }

  init();
})();
