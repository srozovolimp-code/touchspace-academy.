(function () {
  var moduleConfig = window.AcademyModuleConfig;
  var finalConfig = window.AcademyFinalTestConfig;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function getGlobal(name) {
    return name ? window[name] : null;
  }

  function canBypassTests() {
    var api = window.TouchSpaceAcademy;
    var user = api && api.getActiveUser ? api.getActiveUser() : null;
    return !!user && (user.id === "admin" || user.type === "admin" || user.id === "supplier" || user.type === "supplier");
  }

  function loadState(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveState(key, state) {
    localStorage.setItem(key, JSON.stringify(state));
  }

  function normalizeState(state) {
    state.версия = state.версия || 1;
    state.разделы = state.разделы || {};
    state.итоговыйТестМодуля = state.итоговыйТестМодуля || { passed: false, attempts: 0, lastScore: null };
    return state;
  }

  function threshold(test, fallback) {
    return Number(test && test.проходной_балл_процентов || fallback || 80);
  }

  function sortedPages(data) {
    return (data.учебный_контент.страницы || []).slice().sort(function (a, b) {
      return Number(a.порядковый_номер || 0) - Number(b.порядковый_номер || 0);
    });
  }

  function moduleIndex(manifest, moduleId) {
    return (manifest.модули || []).findIndex(function (item) {
      return item.идентификатор === moduleId;
    });
  }

  function moduleById(manifest, moduleId) {
    return (manifest.модули || []).find(function (item) {
      return item.идентификатор === moduleId;
    }) || null;
  }

  function nextModule(manifest, moduleId) {
    var index = moduleIndex(manifest, moduleId);
    return index >= 0 ? (manifest.модули[index + 1] || null) : null;
  }

  function previousModule(manifest, moduleId) {
    var index = moduleIndex(manifest, moduleId);
    return index > 0 ? manifest.модули[index - 1] : null;
  }

  function pageId(page) {
    return page.идентификатор_страницы;
  }

  function renderCards(items) {
    return '<div class="academy-grid">' + (items || []).map(function (item) {
      return '<div class="academy-card">' +
        (item.название ? '<strong>' + esc(item.название) + '</strong>' : '') +
        (item.значение ? '<span>' + esc(item.значение) + '</span>' : '') +
        (item.описание ? '<p>' + esc(item.описание) + '</p>' : '') +
      '</div>';
    }).join("") + '</div>';
  }

  function renderText(content) {
    return '<div class="academy-text">' + (content.абзацы || []).filter(Boolean).map(function (text) {
      return '<p>' + esc(text) + '</p>';
    }).join("") + '</div>';
  }

  function renderList(content) {
    var items = content.элементы || content.пункты || content.данные || [];
    return '<ul class="academy-list">' + items.map(function (item) {
      if (typeof item === "string") return '<li>' + esc(item) + '</li>';
      return '<li>' +
        (item.название ? '<strong>' + esc(item.название) + '</strong>' : '') +
        (item.описание ? '<span>' + esc(item.описание) + '</span>' : '') +
      '</li>';
    }).join("") + '</ul>';
  }

  function renderTable(content) {
    var columns = content.столбцы || [];
    var rows = content.строки || [];
    var head = columns.length ? '<div class="academy-table__row academy-table__row--head academy-table__row--' + columns.length + '">' + columns.map(function (cell) {
      return '<span>' + esc(cell) + '</span>';
    }).join("") + '</div>' : '';
    return '<div class="academy-table">' + head + rows.map(function (row) {
      return '<div class="academy-table__row academy-table__row--' + row.length + '">' + row.map(function (cell) {
        return '<span>' + esc(cell) + '</span>';
      }).join("") + '</div>';
    }).join("") + '</div>';
  }

  function renderAlgorithm(content) {
    return '<div class="academy-algorithm">' + (content.этапы || []).map(function (step) {
      return '<div class="academy-step"><div>' +
        (step.название ? '<strong>' + esc(step.название) + '</strong>' : '') +
        (step.описание ? '<span>' + esc(step.описание) + '</span>' : '') +
      '</div></div>';
    }).join("") + '</div>';
  }

  function renderTimeline(content) {
    return '<div class="academy-algorithm">' + (content.события || []).map(function (event) {
      return '<div class="academy-step"><div><strong>' + esc(event.год || '') + '</strong><span>' + esc(event.событие || '') + '</span></div></div>';
    }).join("") + '</div>';
  }

  function renderExamples(content) {
    return '<div class="academy-examples">' + (content.примеры || []).map(function (example) {
      var parts = ['ситуация', 'неправильно', 'правильно', 'почему', 'решение'].map(function (key) {
        return example[key] ? '<p><b>' + esc(key.charAt(0).toUpperCase() + key.slice(1)) + ':</b> ' + esc(example[key]) + '</p>' : '';
      }).join("");
      return '<div class="academy-example">' + parts + '</div>';
    }).join("") + '</div>';
  }

  function calloutClass(style) {
    if (style === 'предупреждение') return 'academy-callout academy-callout--warning';
    if (style === 'вывод') return 'academy-callout academy-callout--summary';
    return 'academy-callout academy-callout--accent';
  }

  function renderBlock(block) {
    var content = block.содержимое || {};
    var body = '';
    if (block.тип_блока === 'уведомление') body = '<div class="' + calloutClass(content.стиль) + '">' + esc(content.текст || '') + '</div>';
    else if (block.тип_блока === 'текст') body = renderText(content);
    else if (block.тип_блока === 'список') body = renderList(content);
    else if (block.тип_блока === 'карточки') body = renderCards(content.карточки || []);
    else if (block.тип_блока === 'таблица') body = renderTable(content);
    else if (block.тип_блока === 'алгоритм') body = renderAlgorithm(content);
    else if (block.тип_блока === 'хронология') body = renderTimeline(content);
    else if (block.тип_блока === 'примеры') body = renderExamples(content);
    else {
      console.error('Неизвестный тип блока', block);
      return '';
    }

    return '<section class="academy-content-section">' +
      (block.заголовок ? '<h3>' + esc(block.заголовок) + '</h3>' : '') +
      body +
    '</section>';
  }

  function normalizeQuestion(question) {
    var answer = question.правильный_ответ ? question.правильный_ответ.значение : [];
    if (question.тип_вопроса === 'верно_неверно') answer = [String(answer)];
    if (!Array.isArray(answer)) answer = [answer];
    var options = question.варианты_ответа || question.элементы_для_упорядочивания || [];
    return {
      id: question.идентификатор,
      type: question.тип_вопроса,
      text: question.текст_вопроса || '',
      options: options,
      correct: answer.map(String),
      explanation: question.пояснение || ''
    };
  }

  function questionHtml(question, pageIndex, questionIndex) {
    var q = normalizeQuestion(question);
    var name = 'p' + pageIndex + 'q' + questionIndex;
    if (q.type === 'верно_неверно') {
      return '<div class="question" data-question="' + questionIndex + '"><fieldset><legend>' + (questionIndex + 1) + '. ' + esc(q.text) + '</legend>' +
        '<label><input type="radio" name="' + name + '" value="true"> Верно</label>' +
        '<label><input type="radio" name="' + name + '" value="false"> Неверно</label>' +
      '</fieldset></div>';
    }
    if (q.type === 'последовательность') {
      var options = '<option value="">Выберите этап</option>' + q.options.map(function (option) {
        return '<option value="' + esc(option.идентификатор) + '">' + esc(option.текст || '') + '</option>';
      }).join("");
      return '<div class="question" data-question="' + questionIndex + '"><fieldset><legend>' + (questionIndex + 1) + '. ' + esc(q.text) + '</legend>' +
        q.correct.map(function (_, pos) {
          return '<label class="sequence-row"><b>' + (pos + 1) + '</b><select name="' + name + 'seq">' + options + '</select></label>';
        }).join("") +
      '</fieldset></div>';
    }
    var inputType = q.type === 'несколько_ответов' ? 'checkbox' : 'radio';
    return '<div class="question" data-question="' + questionIndex + '"><fieldset><legend>' + (questionIndex + 1) + '. ' + esc(q.text) + '</legend>' +
      q.options.map(function (option) {
        return '<label><input type="' + inputType + '" name="' + name + '" value="' + esc(option.идентификатор) + '"> ' + esc(option.текст || '') + '</label>';
      }).join("") +
    '</fieldset></div>';
  }

  function answerValues(pageIndex, questionIndex, type) {
    if (type === 'последовательность') {
      return Array.prototype.slice.call(document.querySelectorAll('[name="p' + pageIndex + 'q' + questionIndex + 'seq"]')).map(function (select) {
        return select.value;
      });
    }
    return Array.prototype.slice.call(document.querySelectorAll('[name="p' + pageIndex + 'q' + questionIndex + '"]:checked')).map(function (input) {
      return input.value;
    }).sort();
  }

  function renderModule() {
    if (!moduleConfig) return;
    var data = getGlobal(moduleConfig.dataGlobal);
    var manifest = getGlobal(moduleConfig.manifestGlobal);
    var root = document.querySelector('[data-academy-module-root]');
    if (!data || !manifest || !root) return;

    var moduleMeta = data.метаданные.модуль;
    var pages = sortedPages(data);
    var pageTests = {};
    (data.тесты.тесты_страниц || []).forEach(function (test) {
      pageTests[test.идентификатор_теста] = test;
      if (test.связанная_страница) pageTests[test.связанная_страница] = test;
    });
    var finalTest = data.тесты.итоговый_тест_модуля;
    var next = nextModule(manifest, moduleConfig.moduleId);
    var prev = previousModule(manifest, moduleConfig.moduleId);
    var current = 0;

    function state() {
      return normalizeState(loadState(moduleConfig.storageKey));
    }

    function save(stateValue) {
      saveState(moduleConfig.storageKey, stateValue);
    }

    function pagePassed(stateValue, id) {
      return !!(stateValue.разделы[id] && stateValue.разделы[id].passed);
    }

    function finalPassed(stateValue) {
      return !!(stateValue.итоговыйТестМодуля && stateValue.итоговыйТестМодуля.passed);
    }

    function allPagesPassed(stateValue) {
      return pages.every(function (page) { return pagePassed(stateValue, pageId(page)); });
    }

    function unlocked(stateValue, index) {
      if (canBypassTests()) return true;
      if (index === 0) return true;
      if (index < pages.length) return pagePassed(stateValue, pageId(pages[index - 1]));
      return allPagesPassed(stateValue);
    }

    function completedCount(stateValue) {
      return pages.reduce(function (total, page) {
        return total + (pagePassed(stateValue, pageId(page)) ? 1 : 0);
      }, 0) + (finalPassed(stateValue) ? 1 : 0);
    }

    function currentTest(index) {
      return index === pages.length ? finalTest : pageTests[pages[index].связанный_тест] || pageTests[pageId(pages[index])];
    }

    function renderTabs(stateValue) {
      var html = pages.map(function (page, index) {
        var locked = !unlocked(stateValue, index);
        var passed = pagePassed(stateValue, pageId(page));
        return '<button class="academy-tab' + (index === current ? ' is-active' : '') + (locked ? ' is-locked' : '') + '" type="button" data-go="' + index + '"' + (locked ? ' disabled' : '') + '>' +
          '<span class="academy-tab__num">' + (index + 1) + '</span><span><span class="academy-tab__title">' + esc(page.название) + '</span><span class="academy-tab__meta">' + (passed ? 'пройдено' : 'раздел курса') + '</span></span><span>' + (passed ? '✓' : '') + '</span>' +
        '</button>';
      }).join("");
      var finalLocked = !unlocked(stateValue, pages.length);
      html += '<button class="academy-tab' + (current === pages.length ? ' is-active' : '') + (finalLocked ? ' is-locked' : '') + '" type="button" data-go="' + pages.length + '"' + (finalLocked ? ' disabled' : '') + '>' +
        '<span class="academy-tab__num">★</span><span><span class="academy-tab__title">' + esc(finalTest.название || 'Итоговый тест модуля') + '</span><span class="academy-tab__meta">' + (finalPassed(stateValue) ? 'пройдено' : 'итоговая проверка') + '</span></span><span>' + (finalPassed(stateValue) ? '✓' : '') + '</span>' +
      '</button>';
      root.querySelector('[data-academy-nav]').innerHTML = html;
    }

    function renderProgress(stateValue) {
      var total = pages.length + 1;
      var done = completedCount(stateValue);
      var percent = Math.round(done / total * 100);
      root.querySelector('[data-progress-label]').textContent = 'Пройдено ' + done + ' из ' + total;
      root.querySelector('[data-progress-percent]').textContent = percent + '%';
      root.querySelector('[data-progress-bar]').style.width = percent + '%';
    }

    function renderStage(stateValue) {
      if (current === pages.length) {
        var canContinue = finalPassed(stateValue) || canBypassTests();
        var nextUrl = next ? next.url : manifest.итоговый_тест.url;
        var nextLabel = next ? 'К следующему модулю' : 'К итоговому тесту курса';
        return '<article class="academy-slide"><span class="academy-kicker">Итог</span><h2 class="academy-title">' + esc(finalTest.название || 'Итоговый тест модуля') + '</h2><p class="academy-lead">' + esc(finalTest.описание || 'Проверка по материалам модуля.') + '</p><div class="academy-actions"><div class="academy-actions__row"><button class="btn secondary" type="button" data-prev>Назад</button><button class="btn" type="button" data-open-test="' + pages.length + '">' + (finalPassed(stateValue) ? 'Повторить итоговый тест' : 'Пройти итоговый тест') + '</button><a class="btn" href="' + esc(nextUrl) + '"' + (canContinue ? '' : ' aria-disabled="true" tabindex="-1"') + '>' + nextLabel + '</a><span class="result ' + (canContinue ? 'good' : '') + '">' + (canContinue ? 'Модуль пройден.' : 'Для перехода нужен результат не ниже ' + threshold(finalTest, 80) + '%.') + '</span></div></div></article>';
      }
      var page = pages[current];
      var passed = pagePassed(stateValue, pageId(page));
      return '<article class="academy-slide"><span class="academy-kicker">Раздел ' + (current + 1) + '</span><h2 class="academy-title">' + esc(page.название) + '</h2><p class="academy-lead">' + esc(page.цель_страницы || '') + '</p><div class="academy-blocks">' + (page.контент_страницы || []).map(renderBlock).join("") + '</div><div class="academy-actions"><div class="academy-actions__row"><button class="btn secondary" type="button" data-prev>Назад</button><button class="btn" type="button" data-open-test="' + current + '">' + (passed ? 'Повторить тест' : 'Пройти тест раздела') + '</button><button class="btn" type="button" data-next' + (unlocked(stateValue, current + 1) ? '' : ' disabled') + '>Следующий раздел</button><span class="result ' + (passed ? 'good' : '') + '">' + (passed ? 'Раздел пройден.' : 'Для прохождения нужно набрать не менее ' + threshold(currentTest(current), 80) + '%.') + '</span></div><p class="academy-note">Тест открывается в отдельном окне после материала раздела.</p></div></article>';
    }

    function render() {
      var stateValue = state();
      renderTabs(stateValue);
      renderProgress(stateValue);
      root.querySelector('[data-stage-count]').textContent = 'Раздел ' + (current + 1) + ' из ' + (pages.length + 1);
      root.querySelector('[data-stage]').innerHTML = renderStage(stateValue);
      root.querySelectorAll('[data-prev]').forEach(function (button) { button.disabled = current === 0; });
    }

    function openQuiz(index) {
      var test = currentTest(index);
      var isFinal = index === pages.length;
      root.querySelector('[data-quiz-title]').textContent = test.название || (isFinal ? 'Итоговый тест модуля' : pages[index].название);
      root.querySelector('[data-quiz-kicker]').textContent = isFinal ? 'Итоговая проверка' : 'Проверка раздела ' + (index + 1);
      root.querySelector('[data-quiz-content]').innerHTML = (test.вопросы || []).map(function (question, questionIndex) {
        return questionHtml(question, index, questionIndex);
      }).join("");
      root.querySelector('[data-feedback]').innerHTML = '';
      root.querySelector('[data-modal-result]').textContent = 'Для прохождения нужно набрать не менее ' + threshold(test, 80) + '%.';
      root.querySelector('[data-modal-result]').className = 'result';
      root.querySelector('[data-check-page]').setAttribute('data-check-page', index);
      root.querySelector('[data-quiz-next]').hidden = true;
      root.querySelector('[data-quiz-next-module]').hidden = true;
      root.querySelector('[data-quiz-modal]').classList.add('is-open');
      root.querySelector('[data-quiz-modal]').setAttribute('aria-hidden', 'false');
      root.querySelector('[data-check-page]').focus();
    }

    function closeQuiz() {
      root.querySelector('[data-quiz-modal]').classList.remove('is-open');
      root.querySelector('[data-quiz-modal]').setAttribute('aria-hidden', 'true');
    }

    function checkQuiz(index) {
      var test = currentTest(index);
      var isFinal = index === pages.length;
      var questions = test.вопросы || [];
      var correctCount = 0;
      var messages = [];
      questions.forEach(function (rawQuestion, questionIndex) {
        var q = normalizeQuestion(rawQuestion);
        var selected = answerValues(index, questionIndex, q.type);
        var ok = q.type === 'последовательность'
          ? selected.join('|') === q.correct.join('|')
          : selected.sort().join('|') === q.correct.slice().sort().join('|');
        if (ok) correctCount += 1;
        else if (q.explanation) messages.push(q.explanation);
      });
      var score = questions.length ? Math.round(correctCount / questions.length * 100) : 0;
      var passed = score >= threshold(test, isFinal ? 80 : 80);
      var stateValue = state();
      if (isFinal) {
        stateValue.итоговыйТестМодуля = {
          passed: passed,
          lastScore: score,
          attempts: (stateValue.итоговыйТестМодуля.attempts || 0) + 1,
          completedAt: passed ? new Date().toISOString() : null
        };
      } else {
        stateValue.разделы[pageId(pages[index])] = {
          passed: passed,
          lastScore: score,
          attempts: ((stateValue.разделы[pageId(pages[index])] || {}).attempts || 0) + 1,
          completedAt: passed ? new Date().toISOString() : null
        };
      }
      save(stateValue);
      root.querySelector('[data-modal-result]').className = 'result ' + (passed ? 'good' : 'bad');
      root.querySelector('[data-modal-result]').textContent = score + '%. ' + (passed ? 'Тест пройден.' : 'Есть ошибки. Попробуйте ещё раз.');
      root.querySelector('[data-feedback]').innerHTML = passed ? '' : messages.map(function (message) { return '<div>' + esc(message) + '</div>'; }).join('');
      root.querySelector('[data-quiz-next]').hidden = !(passed && !isFinal && index < pages.length - 1);
      root.querySelector('[data-quiz-next-module]').hidden = !(passed && isFinal);
      render();
    }

    root.innerHTML = '<div class="academy-topline"><nav class="breadcrumb" aria-label="Хлебные крошки"><a href="../../brands.html">Бренды</a><span>/</span><a href="alpine-floor-advanced-academy.html">Расширенная академия Alpine Floor</a><span>/</span><span>' + esc(moduleMeta.название) + '</span></nav><a class="back-link" href="alpine-floor-advanced-academy.html">Назад в академию</a></div><section class="academy-shell"><aside class="academy-panel"><div class="academy-cover"><div class="academy-cover__top"><div class="brand-logo"><img src="../../images/brand-logos/Alpine_Floor.png" alt="Alpine Floor"></div></div><h1>' + esc(moduleMeta.название) + '</h1><p>' + esc(moduleMeta.примерная_продолжительность_минут || '') + ' мин · последовательное прохождение · ' + pages.length + ' разделов</p></div><div class="academy-progress"><div class="academy-progress__row"><span data-progress-label></span><span data-progress-percent></span></div><div class="academy-progress__track"><span data-progress-bar></span></div></div><div class="academy-nav" data-academy-nav></div></aside><div class="academy-stage"><div class="academy-toolbar"><div class="academy-count" data-stage-count></div><div><button class="icon-btn" type="button" data-prev aria-label="Предыдущий раздел">↑</button><button class="icon-btn" type="button" data-next aria-label="Следующий раздел">↓</button></div></div><div data-stage></div></div></section><div class="quiz-modal" data-quiz-modal aria-hidden="true"><div class="quiz-modal__panel" role="dialog" aria-modal="true" aria-labelledby="quiz-title"><div class="quiz-modal__head"><div><span data-quiz-kicker></span><h3 id="quiz-title" data-quiz-title></h3></div><button class="icon-btn" type="button" data-close-quiz aria-label="Закрыть тест">×</button></div><div class="quiz-modal__body"><div data-quiz-content></div><div class="feedback" data-feedback></div></div><div class="quiz-modal__foot"><button class="btn secondary" type="button" data-close-quiz>Вернуться к материалу</button><button class="btn" type="button" data-check-page>Проверить тест</button><button class="btn" type="button" data-quiz-next hidden>К следующему разделу</button><button class="btn" type="button" data-quiz-next-module hidden>К следующему модулю</button><span class="result" data-modal-result aria-live="polite" role="status"></span></div></div></div>';

    root.addEventListener('click', function (event) {
      var go = event.target.closest('[data-go]');
      var nextButton = event.target.closest('[data-next]');
      var prevButton = event.target.closest('[data-prev]');
      var open = event.target.closest('[data-open-test]');
      var close = event.target.closest('[data-close-quiz]');
      var check = event.target.closest('[data-check-page]');
      var quizNext = event.target.closest('[data-quiz-next]');
      var quizNextModule = event.target.closest('[data-quiz-next-module]');
      if (go) {
        var target = Number(go.getAttribute('data-go'));
        if (unlocked(state(), target)) { current = target; render(); }
      } else if (nextButton) {
        if (unlocked(state(), current + 1)) { current += 1; render(); }
      } else if (prevButton) {
        if (current > 0) { current -= 1; render(); }
      } else if (open) {
        openQuiz(Number(open.getAttribute('data-open-test')));
      } else if (close) {
        closeQuiz();
      } else if (check) {
        checkQuiz(Number(check.getAttribute('data-check-page')));
      } else if (quizNext) {
        closeQuiz();
        current += 1;
        render();
      } else if (quizNextModule) {
        var targetUrl = next ? next.url : manifest.итоговый_тест.url;
        window.location.href = targetUrl;
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeQuiz();
    });

    render();
  }

  function renderFinalTest() {
    if (!finalConfig) return;
    var data = getGlobal(finalConfig.dataGlobal);
    var manifest = getGlobal(finalConfig.manifestGlobal);
    var root = document.querySelector('[data-academy-final-root]');
    if (!data || !manifest || !root) return;
    var test = data.тест;
    function moduleStorageKey(moduleId) {
      var match = String(moduleId || '').match(/block-(\d{2})$/);
      return match ? 'touchspace-academy:alpine-floor-advanced:block-' + match[1] + ':v1' : '';
    }

    function courseModulesCompleted() {
      if (canBypassTests()) return true;
      return (manifest.модули || []).every(function (module) {
        var moduleState = loadState(moduleStorageKey(module.идентификатор));
        return !!(moduleState.итоговыйТестМодуля && moduleState.итоговыйТестМодуля.passed);
      });
    }

    var canOpen = courseModulesCompleted();
    root.innerHTML = '<div class="academy-topline"><nav class="breadcrumb" aria-label="Хлебные крошки"><a href="../../brands.html">Бренды</a><span>/</span><a href="alpine-floor-advanced-academy.html">Расширенная академия Alpine Floor</a><span>/</span><span>' + esc(test.название) + '</span></nav><a class="back-link" href="alpine-floor-advanced-academy.html">Назад в академию</a></div><section class="academy-stage"><article class="academy-slide"><span class="academy-kicker">Итоговая проверка</span><h1 class="academy-title">' + esc(test.название) + '</h1><p class="academy-lead">' + esc(test.описание || '') + '</p><div class="academy-actions"><div class="academy-actions__row"><button class="btn" type="button" data-open-final' + (canOpen ? '' : ' disabled') + '>Открыть тест</button><span class="result" data-final-result aria-live="polite" role="status">' + (canOpen ? 'Для прохождения нужно набрать не менее ' + threshold(test, 85) + '%.' : 'Итоговый тест откроется после прохождения всех модулей.') + '</span></div></div></article></section><div class="quiz-modal" data-quiz-modal aria-hidden="true"><div class="quiz-modal__panel" role="dialog" aria-modal="true" aria-labelledby="quiz-title"><div class="quiz-modal__head"><div><span>Итоговая проверка</span><h3 id="quiz-title">' + esc(test.название) + '</h3></div><button class="icon-btn" type="button" data-close-quiz aria-label="Закрыть тест">×</button></div><div class="quiz-modal__body"><div data-quiz-content>' + (test.вопросы || []).map(function (question, index) { return questionHtml(question, 0, index); }).join("") + '</div><div class="feedback" data-feedback></div></div><div class="quiz-modal__foot"><button class="btn secondary" type="button" data-close-quiz>Вернуться</button><button class="btn" type="button" data-check-final>Проверить тест</button><span class="result" data-modal-result aria-live="polite" role="status"></span></div></div></div>';

    root.addEventListener('click', function (event) {
      if (event.target.closest('[data-open-final]')) {
        root.querySelector('[data-quiz-modal]').classList.add('is-open');
      } else if (event.target.closest('[data-close-quiz]')) {
        root.querySelector('[data-quiz-modal]').classList.remove('is-open');
      } else if (event.target.closest('[data-check-final]')) {
        var questions = test.вопросы || [];
        var correct = 0;
        questions.forEach(function (rawQuestion, index) {
          var q = normalizeQuestion(rawQuestion);
          var selected = answerValues(0, index, q.type);
          var ok = q.type === 'последовательность'
            ? selected.join('|') === q.correct.join('|')
            : selected.sort().join('|') === q.correct.slice().sort().join('|');
          if (ok) correct += 1;
        });
        var score = questions.length ? Math.round(correct / questions.length * 100) : 0;
        var passed = score >= threshold(test, 85);
        var stateValue = loadState(finalConfig.storageKey);
        stateValue.passed = passed;
        stateValue.lastScore = score;
        stateValue.attempts = (stateValue.attempts || 0) + 1;
        stateValue.completedAt = passed ? new Date().toISOString() : null;
        saveState(finalConfig.storageKey, stateValue);
        root.querySelector('[data-modal-result]').className = 'result ' + (passed ? 'good' : 'bad');
        root.querySelector('[data-modal-result]').textContent = score + '%. ' + (passed ? 'Тест пройден.' : 'Попробуйте ещё раз.');
        root.querySelector('[data-final-result]').className = 'result ' + (passed ? 'good' : 'bad');
        root.querySelector('[data-final-result]').textContent = score + '%. ' + (passed ? 'Курс завершён.' : 'Итоговый тест пока не пройден.');
      }
    });
  }

  renderModule();
  renderFinalTest();
})();
