(function () {
  'use strict';

  var config = window.AdvancedTemplateModuleConfig;
  if (!config) return;

  var raw = window[config.dataGlobal];
  var manifest = window[config.manifestGlobal];
  if (!raw || !manifest || !raw.метаданные || !raw.учебный_контент || !raw.тесты) return;

  var moduleMeta = raw.метаданные.модуль || {};
  var modules = manifest.модули || [];
  var moduleIndex = modules.findIndex(function (item) { return item.идентификатор === config.moduleId; });
  var moduleRecord = moduleIndex >= 0 ? modules[moduleIndex] : {};
  var nextRecord = moduleIndex >= 0 ? modules[moduleIndex + 1] : null;
  var nextModuleUrl = nextRecord ? nextRecord.url : (manifest.итоговый_тест && manifest.итоговый_тест.url);
  var nextModuleLabel = nextRecord ? 'К следующему модулю' : 'К итоговому тесту курса';
  var pages = (raw.учебный_контент.страницы || []).slice().sort(function (a, b) {
    return Number(a.порядковый_номер || 0) - Number(b.порядковый_номер || 0);
  });
  var pageTests = {};
  ((raw.тесты && raw.тесты.тесты_страниц) || []).forEach(function (test) {
    pageTests[test.идентификатор_теста] = test;
    if (test.связанная_страница) pageTests[test.связанная_страница] = test;
  });
  var finalTest = raw.тесты.итоговый_тест_модуля || {};
  var storageKey = config.storageKey || ('touchspace-advanced-template:' + config.moduleId + ':v1');
  var current = 0;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function humanText(value) {
    return String(value == null ? '' : value)
      .replace(/Студенты/g, 'Реселлеры')
      .replace(/Студентов/g, 'Реселлеров')
      .replace(/Студентам/g, 'Реселлерам')
      .replace(/Студенту/g, 'Реселлеру')
      .replace(/Студентом/g, 'Реселлером')
      .replace(/Студента/g, 'Реселлера')
      .replace(/Студент/g, 'Реселлер')
      .replace(/студенты/g, 'реселлеры')
      .replace(/студентов/g, 'реселлеров')
      .replace(/студентам/g, 'реселлерам')
      .replace(/студенту/g, 'реселлеру')
      .replace(/студентом/g, 'реселлером')
      .replace(/студента/g, 'реселлера')
      .replace(/студент/g, 'реселлер')
      .replace(/учебной страницы/g, 'раздела')
      .replace(/учебная страница/g, 'раздел')
      .replace(/учебную страницу/g, 'раздел')
      .replace(/страницы модуля/g, 'раздела курса')
      .replace(/страница модуля/g, 'раздел курса');
  }

  function humanLabel(value) {
    return humanText(value).replace(/_/g, ' ').replace(/^./, function (char) { return char.toUpperCase(); });
  }

  function safe(value) { return esc(humanText(value)); }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch (error) { return {}; }
  }

  function saveState(state) {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch (error) { /* localStorage may be unavailable in a restricted preview */ }
  }

  function pageId(page) { return page && page.идентификатор_страницы; }
  function pageAt(index) { return pages[index]; }

  function canBypassTests() {
    var api = window.TouchSpaceAcademy;
    var user = api && api.getActiveUser ? api.getActiveUser() : null;
    return !!user && (user.id === 'admin' || user.type === 'admin' || user.id === 'supplier' || user.type === 'supplier');
  }

  function pagePassed(state, id) { return !!(state.pages && state.pages[id] && state.pages[id].passed); }
  function allPagesPassed(state) { return pages.every(function (page) { return pagePassed(state, pageId(page)); }); }
  function finalPassed(state) { return !!(state.finalTest && state.finalTest.passed); }

  function completedCount(state) {
    return pages.reduce(function (total, page) {
      return total + (pagePassed(state, pageId(page)) ? 1 : 0);
    }, 0) + (finalPassed(state) ? 1 : 0);
  }

  function unlocked(state, index) {
    if (canBypassTests()) return true;
    if (index === 0) return true;
    if (index < pages.length) return pagePassed(state, pageId(pages[index - 1]));
    return allPagesPassed(state);
  }

  function threshold(test, fallback) {
    return Number(test && test.проходной_балл_процентов || fallback || 80);
  }

  function renderProgress(state) {
    var total = pages.length + 1;
    var done = completedCount(state);
    var percent = total ? Math.round(done / total * 100) : 0;
    var label = document.querySelector('[data-progress-label]');
    var percentNode = document.querySelector('[data-progress-percent]');
    var bar = document.querySelector('[data-progress-bar]');
    if (label) label.textContent = 'Пройдено ' + done + ' из ' + total;
    if (percentNode) percentNode.textContent = percent + '%';
    if (bar) bar.style.width = percent + '%';
  }

  function normalizeQuestion(question) {
    var correct = question && question.правильный_ответ ? question.правильный_ответ.значение : [];
    if (!Array.isArray(correct)) correct = [correct];
    return {
      type: question && question.тип_вопроса,
      q: humanText(question && question.текст_вопроса || ''),
      options: ((question && (question.варианты_ответа || question.элементы_для_упорядочивания)) || []).map(function (item) {
        return [String(item.идентификатор), humanText(item.текст || '')];
      }),
      correct: correct.map(String),
      exp: humanText(question && question.пояснение || '')
    };
  }

  function blockTitle(block) {
    return block.заголовок ? '<h3>' + safe(block.заголовок) + '</h3>' : '';
  }

  function asListItems(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (Array.isArray(value.элементы)) return value.элементы;
    if (Array.isArray(value.пункты)) return value.пункты;
    if (Array.isArray(value.карточки)) return value.карточки;
    if (Array.isArray(value.данные)) return value.данные;
    return Object.keys(value).map(function (key) {
      var item = value[key];
      if (typeof item === 'string') return { название: key, описание: item };
      if (Array.isArray(item)) return { название: key, описание: item.join(', ') };
      if (item && typeof item === 'object') return Object.assign({ название: key }, item);
      return { название: key, описание: String(item == null ? '' : item) };
    });
  }

  function renderCards(items) {
    return '<div class="coswick-grid">' + (items || []).map(function (item) {
      if (typeof item === 'string') return '<div class="coswick-card"><span>' + safe(item) + '</span></div>';
      var title = item.название || item.title || item.ситуация || '';
      var value = item.значение || item.text || item.текст || '';
      var description = item.описание || item.пояснение || '';
      return '<div class="coswick-card">' +
        (title ? '<strong>' + safe(title) + '</strong>' : '') +
        (value ? '<span>' + safe(value) + '</span>' : '') +
        (description ? '<p>' + safe(description) + '</p>' : '') +
      '</div>';
    }).join('') + '</div>';
  }

  function renderList(items) {
    return '<ul class="coswick-list">' + asListItems(items).map(function (item) {
      if (typeof item === 'string') return '<li>' + safe(item) + '</li>';
      var title = item.название || item.текст || item.этап || '';
      var text = item.описание || item.пояснение || item.значение || '';
      return '<li>' + (title ? '<strong>' + safe(title) + '</strong>' : '') + (text ? '<span>' + safe(text) + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
  }

  function renderTable(rows, columns) {
    var normalized = (rows || []).map(function (row) {
      return Array.isArray(row) ? row : Object.keys(row || {}).map(function (key) { return row[key]; });
    });
    var head = columns && columns.length
      ? '<div class="coswick-table__row coswick-table__row--head coswick-table__row--' + columns.length + '">' + columns.map(function (cell) { return '<span>' + safe(cell) + '</span>'; }).join('') + '</div>'
      : '';
    return '<div class="coswick-table">' + head + normalized.map(function (row) {
      return '<div class="coswick-table__row coswick-table__row--' + row.length + '">' + row.map(function (cell) { return '<span>' + safe(cell) + '</span>'; }).join('') + '</div>';
    }).join('') + '</div>';
  }

  function renderCompare(items) {
    return '<div class="coswick-compare">' + (items || []).map(function (item) {
      if (Array.isArray(item)) return '<article><span>' + safe(item[0]) + '</span><span>' + safe(item[1]) + '</span></article>';
      return '<article><span>' + safe(item.неправильно || item.до || item.первое || '') + '</span><span>' + safe(item.правильно || item.после || item.второе || '') + '</span></article>';
    }).join('') + '</div>';
  }

  function renderBlock(block) {
    var type = block.тип_блока;
    var content = block.содержимое || {};
    var body = '';

    if (type === 'карточки') {
      body = renderCards(content.карточки || content.данные || []);
    } else if (type === 'текст') {
      body = '<div class="coswick-text">' + (content.абзацы || []).map(function (text) { return '<p>' + safe(text) + '</p>'; }).join('') + '</div>';
    } else if (type === 'хронология') {
      body = '<div class="coswick-timeline">' + (content.события || []).map(function (event) {
        return '<article><b>' + safe(event.год) + '</b><p>' + safe(event.событие) + '</p></article>';
      }).join('') + '</div>';
    } else if (type === 'уведомление') {
      body = '<div class="coswick-callout">' + safe(content.текст) + '</div>';
    } else if (type === 'список_категорий' || type === 'опоры_позиционирования' || type === 'список') {
      body = renderList(content.данные || content.элементы || content.пункты || content);
    } else if (type === 'алгоритм') {
      body = '<div class="coswick-formula">' + (content.этапы || []).map(function (step, index) {
        var title = step.название || step.label || step.этап || ('Шаг ' + (index + 1));
        var text = step.описание || step.text || step.действие || step.пояснение || '';
        return '<div class="coswick-step"><strong>' + safe(title) + '</strong><span>' + safe(text) + '</span></div>';
      }).join('') + '</div>';
    } else if (type === 'таблица') {
      body = renderTable(content.строки || [], content.столбцы || []);
    } else if (type === 'примеры') {
      body = '<div class="coswick-examples">' + (content.примеры || []).map(function (example) {
        var parts = Object.keys(example || {}).map(function (key) {
          return '<p><b>' + esc(humanLabel(key)) + ':</b> ' + safe(example[key]) + '</p>';
        }).join('');
        return '<div class="coswick-example">' + parts + '</div>';
      }).join('') + '</div>';
    } else if (type === 'сравнение') {
      body = renderCompare(content.строки || content.сравнения || content.данные || []);
    } else {
      body = '<div class="coswick-callout">Этот блок пока не настроен для отображения.</div>';
    }

    return '<section class="block content-section">' + blockTitle(block) + body + '</section>';
  }

  function renderTabs(state, currentIndex) {
    var tabs = pages.map(function (page, index) {
      var locked = !unlocked(state, index);
      var passed = pagePassed(state, pageId(page));
      return '<button class="lesson-tab' + (index === currentIndex ? ' is-active' : '') + (passed ? ' is-done' : '') + (locked ? ' is-locked' : '') + '" type="button" data-go="' + index + '"' + (locked ? ' disabled' : '') + '>' +
        '<span class="tab-num">' + (index + 1) + '</span>' +
        '<span><span class="tab-title">' + safe(page.название) + '</span><span class="tab-meta">' + (passed ? 'пройдено' : (canBypassTests() ? 'доступен без теста' : 'раздел курса')) + '</span></span>' +
        '<span class="tab-check">' + (passed ? '✓' : '') + '</span>' +
      '</button>';
    }).join('');

    var finalLocked = !unlocked(state, pages.length);
    var finalDone = finalPassed(state);
    tabs += '<button class="lesson-tab' + (currentIndex === pages.length ? ' is-active' : '') + (finalDone ? ' is-done' : '') + (finalLocked ? ' is-locked' : '') + '" type="button" data-go="' + pages.length + '"' + (finalLocked ? ' disabled' : '') + '>' +
      '<span class="tab-num">★</span>' +
      '<span><span class="tab-title">' + safe(finalTest.название || 'Итоговый тест модуля') + '</span><span class="tab-meta">' + (finalLocked ? 'закрыт' : (finalDone ? 'пройдено' : (canBypassTests() ? 'доступен без теста' : 'доступен'))) + '</span></span>' +
      '<span class="tab-check">' + (finalDone ? '✓' : '') + '</span>' +
    '</button>';

    var list = document.querySelector('[data-lesson-list]');
    if (list) list.innerHTML = tabs;
  }

  function questionHtml(rawQuestion, pageIndex, index) {
    var question = normalizeQuestion(rawQuestion);
    if (question.type === 'верно_неверно') {
      return '<div class="question" data-question="' + index + '"><strong>' + (index + 1) + '. ' + safe(question.q) + '</strong>' +
        '<label><input type="radio" name="p' + pageIndex + 'q' + index + '" value="true"> Верно</label>' +
        '<label><input type="radio" name="p' + pageIndex + 'q' + index + '" value="false"> Неверно</label></div>';
    }
    if (question.type === 'последовательность') {
      var options = '<option value="">Выберите этап</option>' + question.options.map(function (option) {
        return '<option value="' + esc(option[0]) + '">' + safe(option[1]) + '</option>';
      }).join('');
      return '<div class="question" data-question="' + index + '"><strong>' + (index + 1) + '. ' + safe(question.q) + '</strong><div class="sequence-list">' +
        question.correct.map(function (_, position) {
          return '<label class="sequence-row"><b>' + (position + 1) + '</b><select name="p' + pageIndex + 'q' + index + 'seq">' + options + '</select></label>';
        }).join('') + '</div></div>';
    }
    var inputType = question.type === 'несколько_ответов' ? 'checkbox' : 'radio';
    return '<div class="question" data-question="' + index + '"><strong>' + (index + 1) + '. ' + safe(question.q) + '</strong>' +
      question.options.map(function (option) {
        return '<label><input type="' + inputType + '" name="p' + pageIndex + 'q' + index + '" value="' + esc(option[0]) + '"> ' + safe(option[1]) + '</label>';
      }).join('') + '</div>';
  }

  function currentTest(index) {
    if (index === pages.length) return finalTest;
    var page = pageAt(index);
    return pageTests[page.связанный_тест] || pageTests[pageId(page)];
  }

  function renderStageContent(index, state) {
    if (index === pages.length) {
      state.finalTest = state.finalTest || { status: 'available', lastScore: null, attempts: 0, passed: false };
      saveState(state);
      var bypass = canBypassTests();
      var canContinue = state.finalTest.passed || bypass;
      return '<article class="lesson-slide is-active" data-rendered-page="' + index + '" data-rendered-final="true">' +
        '<span class="lesson-kicker">Итог</span>' +
        '<h2 class="lesson-title">' + safe(finalTest.название || 'Итоговый тест модуля') + '</h2>' +
        '<p class="lesson-lead">' + safe(finalTest.описание || 'Проверка по материалам модуля.') + '</p>' +
        '<div class="blocks"><div class="block coswick-callout">' + (bypass ? 'Для администратора и поставщика следующий шаг доступен без прохождения теста.' : 'Следующий шаг откроется после результата итогового теста не ниже ' + threshold(finalTest, 80) + '%.') + '</div></div>' +
        '<div class="lesson-actions"><div class="lesson-actions__row">' +
          '<button class="btn secondary" type="button" data-course-prev>Назад</button>' +
          '<button class="btn" type="button" data-open-test="' + pages.length + '">' + (state.finalTest.passed ? 'Повторить итоговый тест' : 'Пройти итоговый тест') + '</button>' +
          '<a class="btn" href="' + esc(nextModuleUrl || config.academyUrl || '#') + '"' + (canContinue ? '' : ' aria-disabled="true" tabindex="-1"') + '>' + nextModuleLabel + '</a>' +
          '<span class="result ' + (canContinue ? 'good' : '') + '">' + (state.finalTest.passed ? 'Модуль пройден.' : (bypass ? 'Доступ открыт для вашей роли.' : 'Для перехода нужен итоговый результат не ниже ' + threshold(finalTest, 80) + '%.')) + '</span>' +
        '</div></div>' +
      '</article>';
    }

    var page = pageAt(index);
    var passed = pagePassed(state, pageId(page));
    var canNext = passed || canBypassTests();
    return '<article class="lesson-slide is-active" data-rendered-page="' + index + '" data-rendered-id="' + esc(pageId(page)) + '">' +
      '<span class="lesson-kicker">Раздел ' + (index + 1) + '</span>' +
      '<h2 class="lesson-title">' + safe(page.название) + '</h2>' +
      '<p class="lesson-lead">' + safe(page.цель_страницы) + '</p>' +
      '<div class="blocks">' + (page.контент_страницы || []).map(renderBlock).join('') + '</div>' +
      '<div class="lesson-actions"><div class="lesson-actions__row">' +
        '<button class="btn secondary" type="button" data-course-prev>Назад</button>' +
        '<button class="btn" type="button" data-open-test="' + index + '">' + (passed ? 'Повторить тест' : 'Пройти тест раздела') + '</button>' +
        '<button class="btn" type="button" data-course-next' + (canNext ? '' : ' disabled') + '>Следующий раздел</button>' +
        '<span class="result ' + (passed ? 'good' : '') + '" data-result>' + (passed ? 'Раздел пройден. Следующий открыт.' : (canBypassTests() ? 'Следующий раздел доступен для вашей роли.' : 'Для перехода нужно 100% правильных ответов.')) + '</span>' +
      '</div><p class="lesson-actions__note">Тест открывается в отдельном окне после материала раздела.</p></div>' +
    '</article>';
  }

  function renderPage(index) {
    var state = loadState();
    current = Math.max(0, Math.min(index, pages.length));
    renderTabs(state, current);
    renderProgress(state);
    var count = document.querySelector('[data-stage-count]');
    if (count) count.textContent = 'Раздел ' + (current + 1) + ' из ' + (pages.length + 1);
    var stage = document.querySelector('[data-course-stage]');
    if (stage) stage.innerHTML = renderStageContent(current, state);
    document.querySelectorAll('[data-course-prev]').forEach(function (button) { button.disabled = current === 0; });
  }

  function openQuiz(index) {
    var test = currentTest(index);
    if (!test) return;
    var isFinal = index === pages.length;
    var modal = document.querySelector('[data-quiz-modal]');
    document.querySelector('[data-quiz-title]').textContent = test.название || (isFinal ? 'Итоговый тест модуля' : pages[index].название);
    document.querySelector('[data-quiz-kicker]').textContent = isFinal ? 'Итоговая проверка' : 'Проверка страницы ' + (index + 1);
    document.querySelector('[data-quiz-content]').innerHTML = (test.вопросы || []).map(function (question, questionIndex) {
      return questionHtml(question, index, questionIndex);
    }).join('');
    document.querySelector('[data-feedback]').innerHTML = '';
    document.querySelector('[data-quiz-next]').hidden = true;
    document.querySelector('[data-quiz-next]').removeAttribute('data-quiz-next-target');
    document.querySelector('[data-quiz-next-module]').hidden = !(isFinal && finalPassed(loadState()) && nextModuleUrl);
    document.querySelector('[data-quiz-next-module]').textContent = nextModuleLabel;
    document.querySelector('[data-modal-result]').textContent = isFinal ? 'Для зачета модуля нужен результат не ниже ' + threshold(finalTest, 80) + '%.' : 'Для перехода дальше нужен результат 100%.';
    document.querySelector('[data-modal-result]').className = 'result';
    document.querySelector('[data-check-page]').setAttribute('data-check-page', index);
    modal.setAttribute('data-open-page', String(index));
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeQuiz() {
    var modal = document.querySelector('[data-quiz-modal]');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('data-open-page');
  }

  function answerValues(index, questionIndex, type) {
    if (type === 'последовательность') {
      return Array.prototype.slice.call(document.querySelectorAll('[name="p' + index + 'q' + questionIndex + 'seq"]')).map(function (select) { return select.value; });
    }
    return Array.prototype.slice.call(document.querySelectorAll('[name="p' + index + 'q' + questionIndex + '"]:checked')).map(function (input) { return input.value; }).sort();
  }

  function checkPage(index) {
    current = index;
    var state = loadState();
    state.pages = state.pages || {};
    var isFinal = index === pages.length;
    var test = currentTest(index);
    if (!test) return;
    var questions = test.вопросы || [];
    var correctCount = 0;
    var messages = [];

    questions.forEach(function (rawQuestion, questionIndex) {
      var question = normalizeQuestion(rawQuestion);
      var selected = answerValues(index, questionIndex, question.type);
      var expected = question.correct.slice();
      var ok = question.type === 'последовательность'
        ? selected.join('|') === expected.join('|')
        : selected.slice().sort().join('|') === expected.slice().sort().join('|');
      var node = document.querySelector('[data-question="' + questionIndex + '"]');
      if (node) {
        node.classList.toggle('is-correct', ok);
        node.classList.toggle('is-wrong', !ok);
      }
      if (ok) correctCount += 1;
      else if (question.exp) messages.push(question.exp);
    });

    var score = questions.length ? Math.round(correctCount / questions.length * 100) : 0;
    var passed = isFinal ? score >= threshold(finalTest, 80) : correctCount === questions.length;

    if (isFinal) {
      state.finalTest = state.finalTest || {};
      state.finalTest.attempts = (state.finalTest.attempts || 0) + 1;
      state.finalTest.lastScore = score;
      state.finalTest.passed = passed;
      state.finalTest.status = passed ? 'passed' : 'failed';
    } else {
      var id = pageId(pageAt(index));
      state.pages[id] = state.pages[id] || {};
      state.pages[id].attempts = (state.pages[id].attempts || 0) + 1;
      state.pages[id].lastScore = score;
      state.pages[id].passed = passed;
    }

    saveState(state);

    var modalResult = document.querySelector('[data-modal-result]');
    modalResult.className = 'result ' + (passed ? 'good' : 'bad');
    modalResult.textContent = score + '%. ' + (passed ? (isFinal ? 'Модуль пройден.' : 'Раздел пройден. Можно перейти дальше.') : 'Есть ошибки. Пояснения ниже, попробуйте ещё раз.');
    document.querySelector('[data-feedback]').innerHTML = passed ? '' : messages.map(function (message) { return '<div>' + esc(message) + '</div>'; }).join('');

    var quizNext = document.querySelector('[data-quiz-next]');
    quizNext.hidden = !(passed && !isFinal && index < pages.length - 1);
    if (!quizNext.hidden) quizNext.setAttribute('data-quiz-next-target', String(index + 1));
    else quizNext.removeAttribute('data-quiz-next-target');

    var quizNextModule = document.querySelector('[data-quiz-next-module]');
    quizNextModule.hidden = !(passed && isFinal && nextModuleUrl);
    quizNextModule.textContent = nextModuleLabel;

    renderPage(index);
  }

  function applyModuleMeta() {
    var brandName = config.brandName || manifest.название || 'Advanced';
    var title = moduleRecord.название || moduleMeta.название || 'Модуль Advanced';
    var duration = moduleRecord.продолжительность_минут || moduleMeta.примерная_продолжительность_минут || 0;
    var count = pages.length;
    var logo = config.logo || manifest.логотип || '';
    var coverArt = config.coverArt || logo;

    document.title = title + ' | ' + brandName;
    document.querySelectorAll('[data-module-title]').forEach(function (node) { node.textContent = title; });
    document.querySelectorAll('[data-module-meta]').forEach(function (node) { node.textContent = duration + ' мин · последовательное прохождение · ' + count + ' разделов'; });
    document.querySelectorAll('[data-academy-name]').forEach(function (node) { node.textContent = brandName; });
    document.querySelectorAll('[data-academy-link]').forEach(function (node) { node.setAttribute('href', config.academyUrl || '#'); });
    var section = document.querySelector('.module-shell');
    if (section) section.setAttribute('aria-label', title);
    var image = document.querySelector('.brand-logo img');
    if (image && logo) { image.src = logo; image.alt = config.brandLabel || brandName; }
    var cover = document.querySelector('.course-cover');
    if (cover && coverArt) cover.style.setProperty('--advanced-cover-art', 'url("' + String(coverArt).replace(/"/g, '\\"') + '")');
  }

  document.addEventListener('click', function (event) {
    var tab = event.target.closest('[data-go]');
    var next = event.target.closest('[data-course-next]');
    var prev = event.target.closest('[data-course-prev]');
    var check = event.target.closest('[data-check-page]');
    var open = event.target.closest('[data-open-test]');
    var quizNext = event.target.closest('[data-quiz-next]');
    var quizNextModule = event.target.closest('[data-quiz-next-module]');
    var close = event.target.closest('[data-close-quiz]');
    var modal = event.target.matches('[data-quiz-modal]');
    if (!(tab || next || prev || check || open || quizNext || quizNextModule || close || modal)) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (tab) {
      var target = Number(tab.getAttribute('data-go'));
      if (unlocked(loadState(), target)) renderPage(target);
      return;
    }
    if (next) {
      if (unlocked(loadState(), current + 1)) renderPage(current + 1);
      return;
    }
    if (prev) {
      if (current > 0) renderPage(current - 1);
      return;
    }
    if (open) { openQuiz(Number(open.getAttribute('data-open-test'))); return; }
    if (quizNext) {
      var targetFromQuiz = Number(quizNext.getAttribute('data-quiz-next-target'));
      if (!Number.isNaN(targetFromQuiz) && unlocked(loadState(), targetFromQuiz)) {
        closeQuiz();
        renderPage(targetFromQuiz);
      }
      return;
    }
    if (quizNextModule) {
      if (nextModuleUrl) window.location.href = nextModuleUrl;
      return;
    }
    if (close || modal) { closeQuiz(); return; }
    if (check) checkPage(Number(check.getAttribute('data-check-page')));
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeQuiz();
  });

  applyModuleMeta();
  if (window.TouchSpaceHeader && typeof window.TouchSpaceHeader.refreshFavorites === 'function') {
    window.TouchSpaceHeader.refreshFavorites();
  }
  renderPage(0);
})();
