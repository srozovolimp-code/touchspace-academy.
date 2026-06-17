(function () {
  var STORAGE_KEY = "touchspaceScheduledLessons";
  var JOINED_EVENTS_KEY = "touchspaceJoinedEvents";
  var DEFAULT_DURATION_MINUTES = 60;
  var eventDates = {
    "brand-day": { date: "2026-06-25", time: "11:00", duration: 180, title: "Большой бренд-день: напольные покрытия 2026" },
    "webinar-objections": { date: "2026-06-28", time: "14:00", duration: 75, title: "Вебинар: работа с возражениями клиента" },
    "seller-supervisor": { date: "2026-07-02", time: "10:30", duration: 90, title: "Тренинг для супервайзеров компаний" },
    "showroom-practice": { date: "2026-07-08", time: "12:00", duration: 120, title: "Практикум в шоуруме: подбор под интерьер" },
    "supplier-demo": { date: "2026-07-15", time: "16:00", duration: 60, title: "Демо для поставщиков: как запускать бренд на платформе" }
  };

  function readJson(key, fallback) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || "null");
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function getScheduledLessons() {
    var items = readJson(STORAGE_KEY, []);
    return Array.isArray(items) ? items : [];
  }

  function saveScheduledLessons(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("touchspace-scheduled-lessons-change", { detail: items }));
  }

  function minutesFromTime(time) {
    var parts = String(time || "00:00").split(":");
    return Number(parts[0] || 0) * 60 + Number(parts[1] || 0);
  }

  function overlaps(a, b) {
    if (a.date !== b.date) return false;
    var aStart = minutesFromTime(a.time);
    var bStart = minutesFromTime(b.time);
    var aEnd = aStart + Number(a.duration || DEFAULT_DURATION_MINUTES);
    var bEnd = bStart + Number(b.duration || DEFAULT_DURATION_MINUTES);
    return aStart < bEnd && bStart < aEnd;
  }

  function getJoinedEventConflicts(candidate) {
    var ids = readJson(JOINED_EVENTS_KEY, []);
    if (!Array.isArray(ids)) return [];
    return ids.map(function (id) { return eventDates[id]; }).filter(Boolean).filter(function (item) {
      return overlaps(candidate, item);
    });
  }

  function findConflicts(candidate) {
    var lessonConflicts = getScheduledLessons().filter(function (item) {
      return item.id !== candidate.id && overlaps(candidate, item);
    });
    return lessonConflicts.concat(getJoinedEventConflicts(candidate));
  }

  function formatDateRu(date) {
    var parts = String(date || "").split("-");
    if (parts.length !== 3) return date;
    var month = { "01":"января", "02":"февраля", "03":"марта", "04":"апреля", "05":"мая", "06":"июня", "07":"июля", "08":"августа", "09":"сентября", "10":"октября", "11":"ноября", "12":"декабря" }[parts[1]] || "";
    return Number(parts[2]) + " " + month;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }

  function getTomorrowIso() {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }

  function injectStyles() {
    if (document.querySelector("[data-lesson-scheduler-styles]")) return;
    var style = document.createElement("style");
    style.setAttribute("data-lesson-scheduler-styles", "");
    style.textContent =
      ".lesson-kicker-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}" +
      ".lesson-plan-btn{display:inline-grid;place-items:center;width:38px;height:38px;border:1px solid rgba(10,132,255,.18);border-radius:14px;background:#fff;color:#0a84ff;box-shadow:0 10px 24px rgba(24,45,90,.08);cursor:pointer;transition:transform .16s ease,box-shadow .16s ease,background .16s ease}" +
      ".lesson-plan-btn:hover{transform:translateY(-1px);background:#edf4ff;box-shadow:0 14px 30px rgba(10,132,255,.14)}" +
      ".lesson-plan-btn.is-planned{background:#edf4ff;border-color:rgba(10,132,255,.48);box-shadow:0 0 0 4px rgba(10,132,255,.14),0 14px 30px rgba(10,132,255,.22)}" +
      ".lesson-plan-btn svg{width:20px;height:20px;stroke:currentColor;stroke-width:2.2;fill:none}" +
      ".lesson-plan-btn img{width:18px;height:18px;object-fit:contain}" +
      ".lesson-plan-btn.is-planned img{filter:brightness(0) saturate(100%) invert(41%) sepia(99%) saturate(2524%) hue-rotate(198deg) brightness(103%) contrast(105%)}" +
      ".lesson-scheduler-popup{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:22px;background:rgba(15,23,42,.28);backdrop-filter:blur(10px)}" +
      ".lesson-scheduler-popup.is-open{display:flex}" +
      ".lesson-scheduler-card{width:min(520px,100%);border:1px solid rgba(255,255,255,.88);border-radius:30px;background:rgba(255,255,255,.96);box-shadow:0 28px 80px rgba(24,45,90,.22);padding:22px}" +
      ".lesson-scheduler-top{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;margin-bottom:16px}" +
      ".lesson-scheduler-top h2{margin:0;font-size:26px;line-height:1.05;letter-spacing:-.035em}" +
      ".lesson-scheduler-top p{margin:7px 0 0;color:#66758a;font-size:14px;line-height:1.45}" +
      ".lesson-scheduler-close{display:grid;place-items:center;flex:0 0 38px;width:38px;height:38px;border:1px solid #dfe6f2;border-radius:14px;background:#fff;color:#66758a;font-size:22px;cursor:pointer}" +
      ".lesson-scheduler-form{display:grid;gap:12px}" +
      ".lesson-scheduler-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}" +
      ".lesson-scheduler-field{display:grid;gap:7px}" +
      ".lesson-scheduler-field label{font-size:12px;text-transform:uppercase;letter-spacing:.07em;font-weight:900;color:#718095}" +
      ".lesson-scheduler-field input{width:100%;min-height:46px;border:1px solid #dfe6f2;border-radius:16px;background:#f8fbff;padding:0 13px;color:#111827;outline:none;font:inherit}" +
      ".lesson-scheduler-field input:focus{border-color:rgba(10,132,255,.5);box-shadow:0 0 0 4px rgba(10,132,255,.08);background:#fff}" +
      ".lesson-scheduler-warning{display:none;padding:13px 14px;border-radius:18px;background:#fff7ed;border:1px solid rgba(255,138,61,.28);color:#8a4a16;font-weight:800;line-height:1.4;font-size:13px}" +
      ".lesson-scheduler-warning.is-open{display:block}" +
      ".lesson-scheduler-actions{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:4px}" +
      ".lesson-scheduler-actions button{min-height:44px;border:0;border-radius:15px;padding:0 15px;font-weight:950;cursor:pointer}" +
      ".lesson-scheduler-actions .ghost{border:1px solid #dfe6f2;background:#fff;color:#0a84ff}" +
      ".lesson-scheduler-actions .primary{background:#0a84ff;color:#fff;box-shadow:0 12px 28px rgba(10,132,255,.22)}" +
      ".lesson-scheduler-toast{position:fixed;right:22px;bottom:22px;z-index:1300;padding:13px 15px;border-radius:18px;background:#172033;color:#fff;box-shadow:0 18px 44px rgba(23,32,51,.25);opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s}" +
      ".lesson-scheduler-toast.is-open{opacity:1;transform:translateY(0)}" +
      "@media(max-width:640px){.lesson-scheduler-fields{grid-template-columns:1fr}.lesson-scheduler-card{border-radius:24px;padding:18px}}";
    document.head.appendChild(style);
  }

  function createPopup() {
    var popup = document.createElement("section");
    popup.className = "lesson-scheduler-popup";
    popup.setAttribute("data-lesson-scheduler-popup", "");
    popup.setAttribute("aria-hidden", "true");
    popup.innerHTML =
      '<div class="lesson-scheduler-card" role="dialog" aria-modal="true" aria-label="Планирование урока">' +
        '<div class="lesson-scheduler-top"><div><h2>Запланировать урок</h2><p data-plan-subtitle></p></div><button class="lesson-scheduler-close" type="button" data-plan-close aria-label="Закрыть">×</button></div>' +
        '<form class="lesson-scheduler-form" data-plan-form>' +
          '<div class="lesson-scheduler-fields">' +
            '<div class="lesson-scheduler-field"><label>Дата</label><input type="date" name="date" required></div>' +
            '<div class="lesson-scheduler-field"><label>Начало</label><input type="time" name="time" required></div>' +
          '</div>' +
          '<div class="lesson-scheduler-warning" data-plan-warning></div>' +
          '<div class="lesson-scheduler-actions"><button class="ghost" type="button" data-plan-close>Отмена</button><button class="primary" type="submit" data-plan-submit>Добавить</button></div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(popup);
    return popup;
  }

  function toast(message) {
    var node = document.querySelector("[data-lesson-scheduler-toast]");
    if (!node) {
      node = document.createElement("div");
      node.className = "lesson-scheduler-toast";
      node.setAttribute("data-lesson-scheduler-toast", "");
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add("is-open");
    setTimeout(function () { node.classList.remove("is-open"); }, 2200);
  }

  function canPlanAccount() {
    var api = window.TouchSpaceAcademy;
    var activeUser = api && api.getActiveUser ? api.getActiveUser() : null;
    return !activeUser || (activeUser.id !== "supplier" && activeUser.type !== "supplier");
  }

  function hasScheduledId(id) {
    return getScheduledLessons().some(function (item) {
      return item.id === id;
    });
  }

  function courseIdFromPageUrl(pageUrl) {
    var match = String(pageUrl || "").match(/calitex-course-([a-z-]+)\.html$/);
    return match ? "academy-calitex-" + match[1] : "";
  }

  function updatePlanButtonState(button) {
    if (!button) return;
    var ids = String(button.getAttribute("data-plan-linked-ids") || "").split(",").filter(Boolean);
    var active = ids.some(hasScheduledId);
    button.classList.toggle("is-planned", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "Изучение уже запланировано" : "Запланировать изучение урока 1");
  }

  function openPlan(config) {
    config = config || {};
    injectStyles();
    if (!canPlanAccount()) {
      toast("Планирование доступно в кабинете реселлера.");
      return;
    }
    var popup = createPopup();
    var form = popup.querySelector("[data-plan-form]");
    var warning = popup.querySelector("[data-plan-warning]");
    var subtitle = popup.querySelector("[data-plan-subtitle]");
    var title = popup.querySelector(".lesson-scheduler-top h2");
    var dateInput = form.elements.date;
    var timeInput = form.elements.time;
    var submit = form.querySelector("[data-plan-submit]");
    var pendingCandidate = null;
    var itemType = config.type || "lesson";
    var itemTitle = config.title || "Учебная задача";
    var brandTitle = config.brand || "TouchSpace Академия";
    var itemId = config.id || ("lesson-" + itemTitle.toLowerCase().replace(/[^\wа-яё-]+/gi, "-") + "-" + Date.now());

    function close() {
      popup.classList.remove("is-open");
      popup.setAttribute("aria-hidden", "true");
      warning.classList.remove("is-open");
      warning.textContent = "";
      pendingCandidate = null;
      submit.textContent = "Добавить";
      setTimeout(function () { popup.remove(); }, 180);
    }

    function save(candidate) {
      var items = getScheduledLessons().filter(function (item) { return item.id !== candidate.id; });
      items.push(candidate);
      items.sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
      saveScheduledLessons(items);
      close();
      toast("Добавлено в мои задачи и дедлайны: " + formatDateRu(candidate.date) + " · " + candidate.time);
    }

    if (title) title.textContent = config.heading || "Запланировать обучение";
    subtitle.textContent = config.subtitle || (brandTitle + " · " + itemTitle);
    dateInput.value = config.date || getTomorrowIso();
    timeInput.value = config.time || "10:00";
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    setTimeout(function () { dateInput.focus(); }, 30);

    popup.addEventListener("click", function (event) {
      if (event.target === popup || event.target.closest("[data-plan-close]")) close();
    });
    [dateInput, timeInput].forEach(function (input) {
      input.addEventListener("input", function () {
        pendingCandidate = null;
        warning.classList.remove("is-open");
        warning.textContent = "";
        submit.textContent = "Добавить";
      });
    });
    document.addEventListener("keydown", function onKeydown(event) {
      if (event.key === "Escape" && popup.classList.contains("is-open")) {
        document.removeEventListener("keydown", onKeydown);
        close();
      }
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var candidate = pendingCandidate || {
        id: itemId,
        type: itemType,
        brand: brandTitle,
        lesson: config.lesson || (itemType === "academy" ? "Академия" : "Курс"),
        title: itemTitle,
        date: dateInput.value,
        time: timeInput.value,
        duration: Number(config.duration || DEFAULT_DURATION_MINUTES),
        url: config.url || location.pathname.split("/").slice(-3).join("/")
      };
      if (!pendingCandidate) {
        var conflicts = findConflicts(candidate);
        if (conflicts.length) {
          pendingCandidate = candidate;
          warning.innerHTML = "Есть пересечение по времени: " + conflicts.map(function (item) {
            return escapeHtml(item.title) + " (" + escapeHtml(item.time) + ")";
          }).join(", ") + ". Можно добавить после подтверждения.";
          warning.classList.add("is-open");
          submit.textContent = "Добавить всё равно";
          return;
        }
      }
      save(candidate);
    });
  }

  window.TouchSpaceLessonScheduler = {
    openPlan: openPlan,
    getScheduledLessons: getScheduledLessons,
    saveScheduledLessons: saveScheduledLessons
  };

  function init() {
    if (!canPlanAccount()) return;
    var firstSlide = document.querySelector(".module-shell [data-slide]");
    if (!firstSlide || firstSlide.querySelector("[data-plan-lesson]")) return;
    var kicker = firstSlide.querySelector(".lesson-kicker");
    if (!kicker) return;

    injectStyles();

    var brandTitle = (document.querySelector(".course-cover h1") || document.querySelector("h1") || {}).textContent || "Брендовый модуль";
    brandTitle = brandTitle.replace(/\s+—\s+брендовый модуль/i, "").trim();
    var lessonTitle = (firstSlide.querySelector(".lesson-title") || {}).textContent || "Урок 1";
    var pageUrl = location.pathname.split("/").slice(-3).join("/");
    var lessonId = "lesson-" + pageUrl.replace(/[^\w-]+/g, "-") + "-1";
    var linkedCourseId = courseIdFromPageUrl(pageUrl);
    var planIds = [lessonId].concat(linkedCourseId ? [linkedCourseId] : []);
    var calendarIconSrc = /\/brands\/touchspace_brand_pages\//.test(location.pathname) ? "../../icons/calendar.svg" : "icons/calendar.svg";

    var row = document.createElement("div");
    row.className = "lesson-kicker-row";
    kicker.parentNode.insertBefore(row, kicker);
    row.appendChild(kicker);

    var button = document.createElement("button");
    button.className = "lesson-plan-btn";
    button.type = "button";
    button.setAttribute("data-plan-lesson", "");
    button.setAttribute("data-plan-linked-ids", planIds.join(","));
    button.setAttribute("aria-label", "Запланировать изучение урока 1");
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = '<img src="' + calendarIconSrc + '" alt="" aria-hidden="true">';
    row.appendChild(button);
    updatePlanButtonState(button);

    button.addEventListener("click", function () {
      openPlan({
        id: linkedCourseId || lessonId,
        type: "lesson",
        brand: brandTitle,
        lesson: "Урок 1",
        title: lessonTitle,
        duration: DEFAULT_DURATION_MINUTES,
        url: pageUrl,
        heading: "Запланировать урок",
        subtitle: brandTitle + " · " + lessonTitle
      });
    });
    window.addEventListener("touchspace-scheduled-lessons-change", function () {
      updatePlanButtonState(button);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
