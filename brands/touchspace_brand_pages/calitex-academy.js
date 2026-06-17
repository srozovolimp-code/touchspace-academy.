(function () {
  var storageKey = "touchspaceCalitexAcademy";
  var courseOrder = ["history", "product", "sales"];
  var courses = {
    history: {
      title: "История бренда Calitex",
      href: "calitex-course-history.html",
      badge: "4 урока",
      tag: "Бренд",
      level: "Начальный",
      time: "35 мин",
      art: "art-blue",
      icon: "../../icons/5.png",
      desc: "История, ДНК качества и правильная подача Calitex через доверие, долговечность и комфорт клиента.",
      lead: "Курс помогает продавать Calitex не как случайную альтернативу, а как понятный стандарт качества: история бренда становится аргументом доверия.",
      lessons: [
        ["Зачем клиенту история бренда", "История Calitex нужна не для красивой легенды, а для доверия: клиенту проще выбрать покрытие, когда он понимает, какая логика качества стоит за продуктом.",
          ["Начинайте не с характеристик, а с контекста: Calitex в Академии позиционируется как бренд про надёжность, спокойствие и долгий срок службы.",
           "История помогает объяснить цену без давления: клиент покупает не квадратные метры, а уверенность в результате после укладки.",
           "Главная ошибка — рассказывать историю отдельно от задачи клиента. Каждый факт должен отвечать на вопрос: почему этому покрытию можно доверять?"],
          "История бренда работает только тогда, когда превращается в понятную клиенту пользу: меньше риска ошибиться, меньше тревоги после покупки, больше уверенности в выборе.",
          [["Фокус", "Доверие вместо набора лозунгов"], ["Роль менеджера", "Связать бренд с бытовым сценарием клиента"], ["Проверка", "Не обещать свойства без артикула и условий объекта"]]
        ],
        ["Инженерная ДНК Calitex", "Старый учебный модуль описывал Calitex через инженерный подход: прочность, защита поверхности, влагостойкость, точный монтаж и реалистичный визуал.",
          ["X-Guard объясняйте как сохранение внешнего вида при ежедневной нагрузке, а не как абстрактный защитный слой.",
           "HydroSeal переводите в язык спокойствия: кухня, прихожая, уборка и бытовые проливы перестают звучать как источник паники.",
           "SmartClick и TrueSense важны не сами по себе: первый помогает говорить о предсказуемом монтаже, второй — о качестве визуального восприятия."],
          "Технологии Calitex сильны не названиями, а тем, что закрывают типовые страхи клиента: износ, вода, щели, дешёвый внешний вид.",
          [["X-Guard", "Поверхность и износ"], ["HydroSeal", "Влага и бытовые проливы"], ["SmartClick", "Монтаж и стабильность"], ["TrueSense", "Фактура и ощущение материала"]]
        ],
        ["От продукта к интерьерному сценарию", "История Calitex в каталоге TouchSpace должна переходить в продуктовую карту: коллекции помогают говорить не только о свойствах, но и о настроении интерьера.",
          ["Diamonds, Elementals, Originals и Stones можно использовать как язык сценариев: спокойный фон, выразительный акцент, натуральная фактура, практичное решение.",
           "Реселлер не продаёт «бренд вообще»: он ведёт клиента от помещения и ожиданий к категории, коллекции, артикулу и условиям монтажа.",
           "Если клиент выбирает только по цвету, верните разговор к нагрузке, уходу, основанию, совместимости и ограничениям конкретного товара."],
          "Сильная консультация Calitex соединяет историю бренда, продуктовую карту и конкретную задачу помещения.",
          [["Diamonds", "Премиальный и выразительный сценарий"], ["Elementals", "Базовая гармония и спокойствие"], ["Originals", "Классический визуальный код"], ["Stones", "Практичность и фактура камня"]]
        ],
        ["Как рассказывать историю в продаже", "Историю Calitex нужно подавать коротко и уверенно: не перегружать клиента датами, а выстраивать цепочку «страх клиента → аргумент бренда → проверка артикула».",
          ["Прагматику говорите про долгосрочную выгоду: меньше риска замены, стабильный внешний вид, понятные правила эксплуатации.",
           "Эстету показывайте связь коллекции с интерьером: фактура, ритм, цветовая температура, ощущение качества.",
           "Клиенту, который боится воды или износа, объясняйте технологии через реальные ситуации: прихожая, кухня, гости, дети, уборка.",
           "Если проект временный или бюджет минимальный, не давите. Честный отказ от лишнего обещания повышает доверие к менеджеру."],
          "Формула продажи: выяснить потребность, назвать риск клиента, связать его с аргументом Calitex, затем обязательно сверить конкретный артикул и условия объекта.",
          [["Прагматик", "Инвестиция и срок службы"], ["Эстет", "Визуальная цель интерьера"], ["Семья", "Ежедневная нагрузка"], ["Спокойствие", "Меньше ухода и тревоги"]]
        ]
      ],
      questions: [
        { type: "single_choice", q: "Как лучше позиционировать Calitex в консультации?", a: ["Как случайный аналог любого покрытия", "Как осознанный выбор под помещение и сценарий клиента", "Как бренд, где все коллекции одинаковые"], correct: 1 },
        { type: "multiple_choice", q: "Какие аргументы делают историю Calitex полезной в продаже?", a: ["Доверие к качеству", "Сценарий помещения", "Связь технологии с бытовой пользой", "Обещание универсальности без проверки"], correct: [0, 1, 2] },
        { type: "matching_true_swap", q: "Соотнесите технологический акцент с правильной пользой для клиента.", pairs: [
          { statement: "X-Guard", answer: "Сохранённый внешний вид при ежедневной нагрузке." },
          { statement: "HydroSeal", answer: "Меньше тревоги из-за воды, кухни, прихожей и уборки." },
          { statement: "SmartClick", answer: "Более предсказуемый и аккуратный монтаж." },
          { statement: "TrueSense", answer: "Более убедительная фактура и ощущение материала." }
        ] },
        { type: "single_choice", q: "Как правильно использовать историю бренда в консультации?", a: ["Рассказывать длинную легенду без связи с задачей", "Связать факт о бренде с риском клиента и проверить конкретный артикул", "Заменить историю скидкой"], correct: 1 },
        { type: "multiple_choice", q: "Какие коллекции можно использовать как язык интерьерных сценариев Calitex?", a: ["Diamonds", "Elementals", "Originals", "Stones", "Random Basic"], correct: [0, 1, 2, 3] }
      ]
    },
    product: {
      title: "Продуктовая линейка Calitex",
      href: "calitex-course-product.html",
      badge: "4 урока",
      tag: "Продукт",
      level: "Средний",
      time: "35 мин",
      art: "art-mint",
      icon: "../../icons/7.png",
      desc: "Категория, коллекции, артикулы и правила корректной рекомендации.",
      lead: "Курс фиксирует продуктовую карту: категория, коллекции и параметры, которые нужно сверить до рекомендации.",
      lessons: [
        ["Категория", "В текущей матрице Calitex представлен как кварц-виниловый ламинат."],
        ["Коллекции", "Diamonds, Elementals, Originals и Stones помогают говорить с клиентом языком интерьерных сценариев."],
        ["Проверка", "Перед продажей сверяются помещение, влажность, основание, монтаж, артикул и ограничения."],
        ["Точность", "Свойства одной коллекции нельзя переносить на весь бренд без проверки карточки товара."]
      ],
      questions: [
        { type: "single_choice", q: "Какая категория указана для Calitex в текущей матрице?", a: ["Массивная доска", "Кварц-виниловый ламинат", "Светильники"], correct: 1 },
        { type: "multiple_choice", q: "Какие коллекции входят в продуктовую карту курса?", a: ["Diamonds", "Elementals", "Originals", "Stones", "Basic Pro"], correct: [0, 1, 2, 3] },
        { type: "matching_true_swap", q: "Соотнесите продуктовый блок с правильной проверкой.", pairs: [
          { statement: "Категория", answer: "Понять, какой тип покрытия предлагается клиенту." },
          { statement: "Коллекция", answer: "Связать визуальный характер с интерьерным сценарием." },
          { statement: "Артикул", answer: "Сверить конкретные характеристики и ограничения." },
          { statement: "Монтаж", answer: "Проверить основание и требования производителя." }
        ] },
        { type: "multiple_choice", q: "Что нужно проверить до рекомендации?", a: ["Помещение и влажность", "Основание", "Монтаж", "Ограничения артикула", "Только название коллекции"], correct: [0, 1, 2, 3] },
        { type: "single_choice", q: "Можно переносить свойства одной коллекции на весь бренд?", a: ["Да", "Нет", "Только если клиент торопится"], correct: 1 }
      ]
    },
    sales: {
      title: "Консультации и продажа Calitex",
      href: "calitex-course-sales.html",
      badge: "4 урока",
      tag: "Продажи",
      level: "Средний",
      time: "40 мин",
      art: "art-violet",
      icon: "../../icons/8.png",
      desc: "Как переводить свойства продукта в понятные аргументы для клиента.",
      lead: "Курс про спокойный сценарий продажи: выяснить задачу, объяснить пользу и закрыть возражения без давления.",
      lessons: [
        ["Диагностика", "Начинаем с помещения, нагрузки, ожиданий по внешнему виду и ограничений объекта."],
        ["Аргументация", "Свойства продукта переводятся в пользу: спокойствие, срок службы, монтаж, уход и совместимость."],
        ["Возражения", "Цена объясняется через ценность решения, срок службы, снижение рисков и корректный монтаж."],
        ["Финал", "Закрытие продажи строится на проверенном артикуле, комплектующих, запасе и инструкции."]
      ],
      questions: [
        { type: "single_choice", q: "С чего начинается консультация?", a: ["С диагностики задачи клиента", "С максимальной скидки", "С обещания универсальности"], correct: 0 },
        { type: "matching_true_swap", q: "Соотнесите запрос клиента и корректный аргумент.", pairs: [
          { statement: "Клиент сомневается из-за цены", answer: "Показать ценность решения, срок службы и снижение рисков." },
          { statement: "Клиент выбирает только по цвету", answer: "Вернуть разговор к материалу, монтажу и сценарию." },
          { statement: "Клиент боится ухода", answer: "Обсудить эксплуатацию и правила обслуживания." }
        ] },
        { type: "multiple_choice", q: "Какие действия помогают закрыть продажу корректно?", a: ["Сверить артикул", "Проверить комплектующие", "Обсудить запас и инструкцию", "Пообещать всё устно без проверки"], correct: [0, 1, 2] },
        { type: "single_choice", q: "Как корректно объяснять цену?", a: ["Через ценность решения, срок службы и снижение рисков", "Только через скидку", "Не обсуждать цену"], correct: 0 },
        { type: "multiple_choice", q: "Что нельзя пропускать при рекомендации?", a: ["Ограничения объекта", "Условия монтажа", "Ожидания клиента по внешнему виду", "Проверку только после оплаты"], correct: [0, 1, 2] }
      ]
    },
    final: {
      title: "Итоговое тестирование Calitex",
      href: "calitex-final-test.html",
      badge: "5 вопросов",
      tag: "Финал",
      level: "Итог",
      time: "18 мин",
      art: "art-cream",
      icon: "../../icons/9.png",
      desc: "Финальная проверка по истории бренда, продуктовой линейке и консультационным сценариям.",
      lead: "Финальный тест доступен после трёх курсов и проверяет целостное понимание Академии Calitex.",
      lessons: [
        ["История", "Понимание позиционирования бренда."],
        ["Продукт", "Категории, коллекции и параметры проверки."],
        ["Продажа", "Диагностика, аргументы и корректный финал рекомендации."]
      ],
      questions: [
        { type: "single_choice", q: "Какой порядок консультации наиболее корректный?", a: ["Цвет, цена, скидка", "Задача клиента, категория, коллекция, артикул, монтаж", "Бренд, обещание, оплата"], correct: 1 },
        { type: "multiple_choice", q: "Какие темы должен учитывать итоговый ответ реселлера?", a: ["Позиционирование бренда", "Коллекции и артикулы", "Условия монтажа", "Возражения клиента", "Только размер скидки"], correct: [0, 1, 2, 3] },
        { type: "matching_true_swap", q: "Соотнесите тему Академии Calitex с правильным фокусом.", pairs: [
          { statement: "История бренда", answer: "Понимать роль Calitex и не продавать бренд как случайный аналог." },
          { statement: "Продуктовая линейка", answer: "Проверять категорию, коллекцию, артикул и ограничения." },
          { statement: "Консультация и продажа", answer: "Выявлять задачу клиента и переводить свойства в пользу." }
        ] },
        { type: "single_choice", q: "Что нельзя делать с характеристиками Calitex?", a: ["Сверять их с артикулом", "Переносить свойства одной коллекции на весь бренд", "Объяснять ограничения"], correct: 1 },
        { type: "multiple_choice", q: "Какие коллекции есть в курсе?", a: ["Diamonds", "Elementals", "Originals", "Stones", "Oak Classic"], correct: [0, 1, 2, 3] },
        { type: "single_choice", q: "Что помогает снять возражение по цене?", a: ["Связь цены с пользой, сроком службы, монтажом и рисками", "Фраза “это просто дорого”", "Отказ от характеристик"], correct: 0 },
        { type: "single_choice", q: "Когда открывается итоговое тестирование?", a: ["Сразу из каталога", "После прохождения трёх курсов", "После добавления бренда в избранное"], correct: 1 }
      ]
    }
  };

  function loadState() {
    try {
      return Object.assign({ passed: {}, finalPassed: false }, JSON.parse(localStorage.getItem(storageKey) || "{}"));
    } catch (error) {
      return { passed: {}, finalPassed: false };
    }
  }

  function saveState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }

  function questionType(question) {
    return question.type || "single_choice";
  }

  function renderQuestionHtml(question, index, id) {
    var type = questionType(question);
    var meta = type === "multiple_choice" ? "Выберите все верные варианты" : (type === "matching_true_swap" ? "Соотнесите пары" : "Выберите один ответ");
    var html = '<article class="question" data-question-type="' + type + '"><div class="question-head"><strong>' + (index + 1) + '. ' + escapeHtml(question.q) + '</strong><span>' + meta + '</span></div>';
    if (type === "multiple_choice") {
      html += '<div class="answers">' + question.a.map(function (answer, answerIndex) {
        return '<label><input type="checkbox" name="' + id + '-q' + index + '" value="' + answerIndex + '"><span>' + escapeHtml(answer) + '</span></label>';
      }).join("") + '</div>';
    } else if (type === "matching_true_swap") {
      var answers = question.pairs.map(function (pair) { return pair.answer; });
      html += '<div class="match-list">' + question.pairs.map(function (pair, pairIndex) {
        return '<div class="match-row"><div class="match-statement">' + escapeHtml(pair.statement) + '</div><select class="match-select" data-match-question="' + index + '" data-match-index="' + pairIndex + '"><option value="">Выберите соответствие</option>' + answers.map(function (answer, answerIndex) {
          return '<option value="' + answerIndex + '">' + escapeHtml(answer) + '</option>';
        }).join("") + '</select></div>';
      }).join("") + '</div>';
    } else {
      html += '<div class="answers">' + question.a.map(function (answer, answerIndex) {
        return '<label><input type="radio" name="' + id + '-q' + index + '" value="' + answerIndex + '"><span>' + escapeHtml(answer) + '</span></label>';
      }).join("") + '</div>';
    }
    return html + '</article>';
  }

  function isQuestionCorrect(quiz, question, index, id) {
    var type = questionType(question);
    if (type === "multiple_choice") {
      var checked = Array.prototype.slice.call(quiz.querySelectorAll('input[name="' + id + '-q' + index + '"]:checked')).map(function (input) {
        return Number(input.value);
      }).sort().join(",");
      var correct = (question.correct || []).slice().sort().join(",");
      return checked === correct;
    }
    if (type === "matching_true_swap") {
      return (question.pairs || []).every(function (_pair, pairIndex) {
        var select = quiz.querySelector('[data-match-question="' + index + '"][data-match-index="' + pairIndex + '"]');
        return select && Number(select.value) === pairIndex;
      });
    }
    var checkedSingle = quiz.querySelector('input[name="' + id + '-q' + index + '"]:checked');
    return !!checkedSingle && Number(checkedSingle.value) === question.correct;
  }

  function renderLessonBlocks(course, lesson) {
    var points = lesson[2] || [
      lesson[1],
      "Свяжите этот блок с задачей клиента, помещением, ожиданиями по виду и условиями монтажа.",
      "Финальную рекомендацию всегда проверяйте по конкретной карточке товара Calitex."
    ];
    var quote = lesson[3] || course.lead;
    var facts = lesson[4] || [];
    return '<div class="blocks"><ol class="number-list block">' + points.map(function (point) {
      return '<li><span>' + escapeHtml(point) + '</span></li>';
    }).join("") + '</ol>' + (facts.length ? '<div class="history-grid block">' + facts.map(function (fact) {
      return '<article class="history-card"><strong>' + escapeHtml(fact[0]) + '</strong><span>' + escapeHtml(fact[1]) + '</span></article>';
    }).join("") + '</div>' : '') + '<div class="quote block"><p>' + escapeHtml(quote) + '</p><b>' + escapeHtml(course.tag) + '</b></div></div>';
  }

  function passedCount(state) {
    return courseOrder.filter(function (id) { return state.passed[id]; }).length;
  }

  function isAdminAccount() {
    var api = window.TouchSpaceAcademy;
    var user = api && api.getActiveUser ? api.getActiveUser() : null;
    return !!user && (user.id === "admin" || user.type === "admin");
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
    return scheduledItems().some(function (item) {
      return item.id === id;
    });
  }

  function courseProgress(state, id) {
    if (id === "final") return state.finalPassed ? 100 : 0;
    return state.passed[id] ? 100 : 0;
  }

  function statusClass(progress, locked) {
    if (locked) return "course-status course-status--locked";
    if (progress >= 100) return "course-status course-status--done";
    if (progress > 0) return "course-status course-status--progress";
    return "course-status course-status--new";
  }

  function statusText(progress, locked) {
    if (locked) return "Закрыто";
    if (progress >= 100) return "Пройдено";
    if (progress > 0) return progress + "% пройдено";
    return "Не начато";
  }

  function cardHtml(id, state) {
    var course = courses[id];
    var adminMode = isAdminAccount();
    var locked = id === "final" && passedCount(state) < 3 && !adminMode;
    var progress = courseProgress(state, id);
    var href = locked ? "" : course.href;
    var fullUrl = "brands/touchspace_brand_pages/" + course.href;
    var favoriteId = id === "final" ? "academy-calitex-final-test" : "academy-calitex-course-" + id;
    var favoriteType = id === "final" ? "Тест академии" : "Курс академии";
    var planId = "academy-calitex-" + id;
    var planned = isPlanned(planId);
    var scheduleButton = locked ? "" : '<button class="course-action course-action--plan' + (planned ? ' is-planned' : '') + '" type="button" data-plan-course="' + id + '" data-plan-id="' + planId + '" aria-label="' + (planned ? 'Запланировано: ' : 'Запланировать ') + escapeHtml(course.title) + '" aria-pressed="' + String(planned) + '"><img class="calendar-icon" src="../../icons/calendar.svg" alt="" aria-hidden="true"></button>';
    var favoriteButton = '<button class="course-action course-action--favorite" type="button" data-favorite-toggle data-favorite-id="' + favoriteId + '" data-favorite-title="' + escapeHtml(course.title) + '" data-favorite-type="' + favoriteType + '" data-favorite-url="' + fullUrl + '" data-favorite-description="' + escapeHtml(course.desc) + '" aria-label="Добавить ' + escapeHtml(course.title) + ' в избранное" aria-pressed="false"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>';
    return '<article class="course-card' + (href ? ' is-link' : '') + (locked ? ' is-locked' : '') + '"' + (href ? ' data-href="' + href + '"' : '') + '>' +
      '<div class="course-card__image ' + course.art + '" data-badge="' + escapeHtml(course.badge) + '"><div class="course-card__tools">' + favoriteButton + scheduleButton + '</div><img src="' + course.icon + '" alt=""></div>' +
      '<div class="course-card__body">' +
        '<span class="' + statusClass(progress, locked) + '">' + (id === "final" && adminMode && progress < 100 ? "Доступ администратора" : statusText(progress, locked)) + '</span>' +
        '<span class="badge">' + escapeHtml(course.tag) + '</span>' +
        '<h3>' + escapeHtml(course.title) + '</h3>' +
        '<p>' + escapeHtml(course.desc) + '</p>' +
        '<div class="course-progress" style="--progress:' + progress + '%"><span></span></div>' +
        '<div class="course-card__foot"><span class="level">' + escapeHtml(course.level) + '</span><span>' + escapeHtml(course.time) + '</span></div>' +
      '</div>' +
    '</article>';
  }

  function updateRoleControls() {
    var student = canPlanAccount();
    document.querySelectorAll("[data-plan-academy], [data-plan-course]").forEach(function (button) {
      button.hidden = !student;
      button.setAttribute("aria-hidden", String(!student));
    });
    document.querySelectorAll("[data-plan-id]").forEach(function (button) {
      var active = isPlanned(button.getAttribute("data-plan-id"));
      button.classList.toggle("is-planned", active);
      button.setAttribute("aria-pressed", String(active));
      var title = button.getAttribute("data-plan-title") || "обучение";
      button.setAttribute("aria-label", (active ? "Запланировано: " : "Запланировать ") + title);
    });
  }

  function initAcademy() {
    var state = loadState();
    var grid = document.querySelector("[data-academy-grid]");
    var finalGrid = document.querySelector("[data-final-grid]");
    var progress = document.querySelector("[data-academy-progress]");
    if (!grid || !finalGrid) return;
    grid.innerHTML = courseOrder.map(function (id) { return cardHtml(id, state); }).join("");
    finalGrid.innerHTML = cardHtml("final", state);
    if (progress) progress.textContent = passedCount(state) + " из 3 завершено";
    updateRoleControls();
    window.dispatchEvent(new CustomEvent("ts-academy-favorites-change"));
    document.addEventListener("click", function (event) {
      var academyPlan = event.target.closest("[data-plan-academy]");
      if (academyPlan) {
        event.preventDefault();
        event.stopPropagation();
        if (window.TouchSpaceLessonScheduler && window.TouchSpaceLessonScheduler.openPlan) {
          window.TouchSpaceLessonScheduler.openPlan({
            id: "academy-calitex",
            type: "academy",
            brand: "Calitex",
            lesson: "Академия",
            title: "Академия Calitex",
            duration: 180,
            url: "brands/touchspace_brand_pages/calitex-academy.html",
            heading: "Запланировать академию",
            subtitle: "Calitex · вся академия бренда"
          });
        }
        return;
      }
      var coursePlan = event.target.closest("[data-plan-course]");
      if (coursePlan) {
        event.preventDefault();
        event.stopPropagation();
        var courseId = coursePlan.getAttribute("data-plan-course");
        var plannedCourse = courses[courseId];
        if (plannedCourse && window.TouchSpaceLessonScheduler && window.TouchSpaceLessonScheduler.openPlan) {
          window.TouchSpaceLessonScheduler.openPlan({
            id: "academy-calitex-" + courseId,
            type: courseId === "final" ? "test" : "course",
            brand: "Calitex",
            lesson: courseId === "final" ? "Итоговый тест" : "Курс",
            title: plannedCourse.title,
            duration: parseInt(plannedCourse.time, 10) || 60,
            url: "brands/touchspace_brand_pages/" + plannedCourse.href,
            heading: courseId === "final" ? "Запланировать тест" : "Запланировать курс",
            subtitle: "Calitex · " + plannedCourse.title
          });
        }
        return;
      }
      var card = event.target.closest("[data-href]");
      if (card && !event.target.closest("button, a, input, select, textarea")) window.location.href = card.getAttribute("data-href");
    });
  }

  function renderCoursePage(id) {
    var root = document.querySelector("[data-course-root]");
    var course = courses[id];
    var state = loadState();
    if (!root || !course) return;
    if (id === "final" && passedCount(state) < 3 && !isAdminAccount()) {
      root.innerHTML = '<section class="section locked-panel"><h1>Итоговое тестирование пока закрыто</h1><p>Пройдите три курса Академии Calitex, чтобы открыть финальный тест.</p><div class="btns"><a class="btn secondary" href="calitex-academy.html">Вернуться в Академию Calitex</a></div></section>';
      return;
    }
    if (id === "final") {
      var finalProgress = courseProgress(state, id);
      root.innerHTML =
        '<div class="topline"><nav class="breadcrumb" aria-label="Хлебные крошки"><a href="../../brands.html">Бренды</a><span>/</span><a href="calitex-academy.html">Академия Calitex</a><span>/</span><span>' + escapeHtml(course.title) + '</span></nav><a class="back-link" href="calitex-academy.html">Назад к Академии Calitex</a></div>' +
        '<section class="hero" aria-label="' + escapeHtml(course.title) + '">' +
          '<div><span class="eyebrow">Итоговая проверка</span><h1>' + escapeHtml(course.title) + '</h1><p>' + escapeHtml(course.lead) + '</p><div class="btns"><a class="btn secondary" href="calitex-academy.html">К курсам Академии</a></div></div>' +
          '<aside class="aside-box"><div class="brand-logo"><img src="images/brand-logos/calitex.svg" alt="Calitex"></div><strong>Только тест</strong><p>Без уроков и промежуточных экранов. Вопросы затрагивают историю бренда, продуктовую линейку и консультационные сценарии.</p><div class="course-progress" style="--progress:' + finalProgress + '%"><span></span></div><span class="' + statusClass(finalProgress, false) + '">' + statusText(finalProgress, false) + '</span></aside>' +
        '</section>' +
        '<section class="section">' +
          '<div class="section-head"><div><span class="eyebrow">3 темы</span><h2>Что проверяет итоговый тест</h2></div><span class="course-count">' + course.questions.length + ' вопросов</span></div>' +
          '<div class="test-scope">' + course.lessons.map(function (lesson) {
            return '<article class="scope-card"><strong>' + escapeHtml(lesson[0]) + '</strong><span>' + escapeHtml(lesson[1]) + '</span></article>';
          }).join("") + '</div>' +
          '<div class="quiz quiz--final" data-quiz="' + id + '">' + course.questions.map(function (question, index) {
            return renderQuestionHtml(question, index, id);
          }).join("") + '<div class="slide-footer"><a class="btn secondary" href="calitex-academy.html">Назад к Академии</a><button class="btn" type="button" data-check-course="' + id + '">Проверить тест</button><span class="result" data-result></span></div></div>' +
        '</section>';
      return;
    }
    var progress = courseProgress(state, id);
    var slidesCount = course.lessons.length + 1;
    var courseFavoriteId = "academy-calitex-course-" + id;
    var courseFavoriteButton = '<button class="course-cover-favorite" type="button" data-favorite-toggle data-favorite-id="' + courseFavoriteId + '" data-favorite-title="' + escapeHtml(course.title) + '" data-favorite-type="Курс академии" data-favorite-url="brands/touchspace_brand_pages/' + course.href + '" data-favorite-description="' + escapeHtml(course.desc) + '" aria-label="Добавить ' + escapeHtml(course.title) + ' в избранное" aria-pressed="false"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>';
    root.innerHTML =
      '<div class="topline"><nav class="breadcrumb" aria-label="Хлебные крошки"><a href="../../brands.html">Бренды</a><span>/</span><a href="calitex-academy.html">Академия Calitex</a><span>/</span><span>' + escapeHtml(course.title) + '</span></nav><a class="back-link" href="calitex-academy.html">Назад к Академии Calitex</a></div>' +
      '<section class="module-shell" aria-label="' + escapeHtml(course.title) + '">' +
        '<aside class="course-panel"><div class="course-cover"><div class="course-cover__top"><div class="brand-logo"><img src="images/brand-logos/calitex.svg" alt="Calitex"></div>' + courseFavoriteButton + '</div><h1>' + escapeHtml(course.title) + '</h1><p>' + escapeHtml(course.time) + ' · ' + escapeHtml(course.level) + ' · ' + course.lessons.length + ' урока</p></div>' +
          '<div class="course-progress-panel"><div class="progress-row"><span data-progress-label>Урок 1 из ' + slidesCount + '</span><span data-progress-percent>' + Math.round(100 / slidesCount) + '%</span></div><div class="progress-track"><span data-progress-bar></span></div></div>' +
          '<div class="lesson-list" data-lesson-list>' + course.lessons.map(function (lesson, index) {
            return '<button class="lesson-tab' + (index === 0 ? ' is-active' : '') + '" type="button" data-go="' + index + '"><span class="tab-num">' + (index + 1) + '</span><span><span class="tab-title">' + escapeHtml(lesson[0]) + '</span><span class="tab-meta">урок курса</span></span><span class="tab-check"></span></button>';
          }).join("") + '<button class="lesson-tab" type="button" data-go="' + course.lessons.length + '"><span class="tab-num">✓</span><span><span class="tab-title">' + (id === "final" ? "Финальный тест" : "Тест курса") + '</span><span class="tab-meta">' + course.questions.length + ' вопросов</span></span><span class="tab-check"></span></button></div>' +
        '</aside>' +
        '<div class="stage"><div class="stage-toolbar"><div class="stage-count" data-stage-count>Урок 1 из ' + slidesCount + '</div><div class="stage-actions"><button class="icon-btn" type="button" data-prev aria-label="Предыдущий урок">↑</button><button class="icon-btn" type="button" data-next aria-label="Следующий урок">↓</button></div></div>' +
          course.lessons.map(function (lesson, index) {
            return '<article class="lesson-slide' + (index === 0 ? ' is-active' : '') + '" data-slide><span class="lesson-kicker">Урок ' + (index + 1) + '</span><h2 class="lesson-title">' + escapeHtml(lesson[0]) + '</h2><p class="lesson-lead">' + escapeHtml(lesson[1]) + '</p>' + renderLessonBlocks(course, lesson) + '<div class="slide-footer">' + (index ? '<button class="btn secondary" type="button" data-prev>Назад</button>' : '<span></span>') + '<button class="btn" type="button" data-next>' + (index === course.lessons.length - 1 ? 'Перейти к тесту' : 'Следующий урок') + '</button></div></article>';
          }).join("") +
          '<article class="lesson-slide" data-slide><span class="lesson-kicker">' + (id === "final" ? "Финал" : "Проверка") + '</span><div class="final-card block"><h2 class="lesson-title">' + (id === "final" ? "Итоговый тест" : "Тест курса") + '</h2><p class="lesson-lead">Для зачёта нужно ответить правильно на все вопросы.</p><div class="quiz" data-quiz="' + id + '">' + course.questions.map(function (question, index) {
        return renderQuestionHtml(question, index, id);
      }).join("") + '<div class="slide-footer"><button class="btn secondary" type="button" data-prev>Назад</button><button class="btn" type="button" data-check-course="' + id + '">Проверить тест</button><span class="result" data-result></span></div></div></div></article>' +
        '</div>' +
      '</section>';
    window.dispatchEvent(new CustomEvent("ts-academy-favorites-change"));
    initLessonModule();
  }

  function initLessonModule() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-slide]"));
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-go]"));
    var progressBar = document.querySelector("[data-progress-bar]");
    var progressLabel = document.querySelector("[data-progress-label]");
    var progressPercent = document.querySelector("[data-progress-percent]");
    var stageCount = document.querySelector("[data-stage-count]");
    var current = 0;
    function update() {
      var percent = Math.round((current + 1) / slides.length * 100);
      if (progressBar) progressBar.style.width = percent + "%";
      if (progressLabel) progressLabel.textContent = "Урок " + (current + 1) + " из " + slides.length;
      if (progressPercent) progressPercent.textContent = percent + "%";
      if (stageCount) stageCount.textContent = "Урок " + (current + 1) + " из " + slides.length;
      tabs.forEach(function (tab, index) {
        tab.classList.toggle("is-active", index === current);
        tab.classList.toggle("is-done", index < current);
        var check = tab.querySelector(".tab-check");
        if (check) check.textContent = index < current ? "✓" : "";
      });
      document.querySelectorAll("[data-prev]").forEach(function (button) { button.disabled = current === 0; });
      document.querySelectorAll("[data-next]").forEach(function (button) { button.disabled = current === slides.length - 1; });
    }
    function go(index) {
      if (index < 0 || index >= slides.length || index === current) return;
      var old = current;
      current = index;
      slides[old].classList.remove("is-active");
      slides[old].classList.add(index > old ? "is-leaving-up" : "is-leaving-down");
      setTimeout(function () { slides[old].classList.remove("is-leaving-up", "is-leaving-down"); }, 380);
      slides[current].classList.add("is-active");
      update();
    }
    document.addEventListener("click", function (event) {
      var next = event.target.closest("[data-next]");
      var prev = event.target.closest("[data-prev]");
      var tab = event.target.closest("[data-go]");
      if (next) go(current + 1);
      if (prev) go(current - 1);
      if (tab) go(Number(tab.getAttribute("data-go")));
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "PageDown") go(current + 1);
      if (event.key === "ArrowUp" || event.key === "PageUp") go(current - 1);
    });
    update();
  }

  function checkCourse(id) {
    var course = courses[id];
    var quiz = document.querySelector('[data-quiz="' + id + '"]');
    var state = loadState();
    if (!course || !quiz) return;
    var correct = 0;
    course.questions.forEach(function (question, index) {
      var node = quiz.querySelectorAll(".question")[index];
      var ok = isQuestionCorrect(quiz, question, index, id);
      node.classList.toggle("is-correct", !!ok);
      node.classList.toggle("is-wrong", !ok);
      if (ok) correct += 1;
    });
    var passed = correct === course.questions.length;
    var result = quiz.querySelector("[data-result]");
    result.textContent = correct + " из " + course.questions.length + ". " + (passed ? "Тест пройден." : "Нужно ответить правильно на все вопросы.");
    result.className = "result " + (passed ? "good" : "bad");
    if (passed) {
      if (id === "final") state.finalPassed = true;
      else state.passed[id] = true;
      saveState(state);
      renderCoursePage(id);
    }
  }

  document.addEventListener("click", function (event) {
    var check = event.target.closest("[data-check-course]");
    if (check) checkCourse(check.getAttribute("data-check-course"));
  });

  if (document.body.hasAttribute("data-calitex-academy")) initAcademy();
  var courseId = document.body.getAttribute("data-calitex-course");
  if (courseId) renderCoursePage(courseId);
  window.addEventListener("ts-academy-user-change", updateRoleControls);
  window.addEventListener("touchspace-scheduled-lessons-change", updateRoleControls);
})();
