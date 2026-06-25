(function () {
  var STORAGE_KEY = "tsAcademyStudentState";
  var FAVORITES_KEY = "tsAcademyFavorites";
  var ACTIVE_USER_KEY = "tsAcademyActiveUser";
  var ADMIN_ACCOUNTS_KEY = "tsAcademyAdminAccounts";
  var ADMIN_COMPANIES_KEY = "tsAcademyAdminCompanies";
  var sharedHeaderScript = document.currentScript || Array.prototype.slice.call(document.scripts).find(function (script) {
    return /(^|\/)shared-header\.js(?:\?|#|$)/.test(script.getAttribute("src") || "");
  });
  var sharedHeaderBase = sharedHeaderScript && sharedHeaderScript.getAttribute("src")
    ? new URL(sharedHeaderScript.getAttribute("src"), window.location.href)
    : new URL("./", window.location.href);
  sharedHeaderBase = new URL("./", sharedHeaderBase.href);

  function portalUrl(path) {
    if (!path || /^(?:[a-z]+:|#|\/)/i.test(path)) return path;
    return new URL(path, sharedHeaderBase.href).href;
  }

  function pageNameFromHref(href) {
    try {
      return new URL(href, window.location.href).pathname.split("/").pop() || "index.html";
    } catch (error) {
      return String(href || "").split("?")[0].split("#")[0].split("/").pop() || "index.html";
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  var defaultState = {
    student: {
      name: "Сергей Розов",
      initials: "СР",
      role: "Продавец-консультант",
      level: 7,
      xp: 680,
      nextLevelXp: 1000,
      totalXp: 5680,
      monthlyXp: 0,
      lastLoginDate: "",
      streakDays: 7
    },
    courses: [
      { id: "pergo", title: "Pergo: философия и продажа", desc: "История бренда, технологии, AquaSafe, TitanX и логика продажи через спокойствие клиента.", status: "active", progress: 62, testsPassed: 1, testsTotal: 2, cert: false, attention: false, next: "Тест по бренду Pergo" },
      { id: "calitex", title: "Calitex: качество и аргументы", desc: "Философия качества, X-Guard, HydroSeal и продажа через долговечность и комфорт.", status: "active", progress: 54, testsPassed: 0, testsTotal: 2, cert: false, attention: false, next: "Тест по бренду Calitex" },
      { id: "academy", title: "Основы работы с каталогом TouchSpace", desc: "Навигация, карточки брендов, категории и базовая логика подбора.", status: "completed", progress: 100, testsPassed: 2, testsTotal: 2, cert: true, attention: false, next: "Курс завершён" }
    ],
    tests: [
      { id: "catalog-base", brand: "catalog", course: "Каталог", title: "Поиск брендов и категорий", score: 100, total: 100, percent: 100, status: "passed", date: "01.06.2026" }
    ],
    achievements: [
      { id: "first", icon: "★", title: "Первый старт", desc: "Начал первый курс Академии.", unlocked: true },
      { id: "pergo", icon: "P", title: "Знаток Pergo", desc: "Пройден тест по бренду Pergo.", unlocked: false },
      { id: "calitex", icon: "C", title: "Знаток Calitex", desc: "Пройден тест по бренду Calitex.", unlocked: false },
      { id: "cert", icon: "✓", title: "Первый сертификат", desc: "Получен первый сертификат Академии.", unlocked: true }
    ],
    events: [
      ["Сегодня", "Открыт кабинет реселлера"],
      ["01.06.2026", "Получен сертификат по каталогу TouchSpace"]
    ],
    xpEvents: [],
    activity: [],
    certificates: [
      { id: "cert-academy", courseId: "academy", title: "Основы работы с каталогом TouchSpace", tier: "Уверенный", percent: 92, date: "01.06.2026" }
    ],
    levelConfig: [
      { level: 1, xpFrom: 0, title: "Новичок" },
      { level: 2, xpFrom: 300, title: "Стажёр" },
      { level: 3, xpFrom: 700, title: "Консультант" },
      { level: 4, xpFrom: 1200, title: "Уверенный продавец" },
      { level: 5, xpFrom: 2000, title: "Специалист" },
      { level: 6, xpFrom: 3200, title: "Старший специалист" },
      { level: 7, xpFrom: 5000, title: "Эксперт" },
      { level: 8, xpFrom: 7500, title: "Мастер продукта" },
      { level: 9, xpFrom: 10500, title: "Наставник" },
      { level: 10, xpFrom: 15000, title: "Амбассадор TouchSpace" }
    ],
    scoringRules: {
      lesson_opened: 2,
      lesson_completed: 10,
      course_started: 10,
      courseMilestones: { 25: 25, 50: 50, 75: 75, 100: 150 },
      certificate_issued: 100,
      assignment: { simple: 20, medium: 50, hard: 100, returned_for_revision: 10 },
      activityDailyCap: 50
    }
  };

  var appUsers = [
    {
      id: "student",
      name: "Сергей Розов",
      initials: "СР",
      role: "Продавец-консультант",
      cabinetLabel: "перейти в кабинет",
      cabinetMenuLabel: "мой кабинет",
      cabinetMenuDesc: "Кабинет реселлера",
      cabinetMenuAria: "Кабинет реселлера",
      cabinetHref: "student-dashboard.html",
      avatar: "linear-gradient(135deg, #2f8cff 0%, #32c48d 100%)"
    },
    {
      id: "supplier",
      name: "Оксана Розова",
      initials: "ОР",
      role: "Поставщик брендов",
      cabinetLabel: "перейти в кабинет",
      cabinetMenuLabel: "кабинет поставщика",
      cabinetMenuDesc: "Бренды и тесты поставщика",
      cabinetMenuAria: "Кабинет поставщика",
      cabinetHref: "supplier-dashboard.html",
      avatar: "linear-gradient(135deg, #7257c6 0%, #d95a9b 100%)"
    },
    {
      id: "seller",
      name: "Елена Кузнецова",
      initials: "ЕК",
      role: "Компания-продавец",
      cabinetLabel: "перейти в кабинет",
      cabinetMenuLabel: "кабинет компании",
      cabinetMenuDesc: "Реселлеры и статистика",
      cabinetMenuAria: "Кабинет компании",
      cabinetHref: "seller-company-dashboard.html",
      avatar: "linear-gradient(135deg, #ff8a3d 0%, #23c483 100%)"
    },
    {
      id: "admin",
      name: "Администратор",
      initials: "АД",
      role: "Администратор платформы",
      cabinetLabel: "перейти в кабинет",
      cabinetMenuLabel: "админка",
      cabinetMenuDesc: "Кабинет администратора",
      cabinetMenuAria: "Кабинет администратора",
      cabinetHref: "admin-dashboard.html",
      avatar: "linear-gradient(135deg, #172033 0%, #0a84ff 100%)"
    }
  ];

  function makeInitials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .map(function (part) { return part.charAt(0); })
      .join("")
      .slice(0, 2)
      .toUpperCase() || "АК";
  }

  function normalizeManagedUser(user) {
    var type = user.type === "supplier" ? "supplier" : "student";
    var id = String(user.id || ("managed-" + type + "-" + Date.now())).replace(/[^\w-]/g, "-");
    var name = String(user.name || (type === "supplier" ? "Новый поставщик" : "Новый реселлер")).trim();
    return {
      id: id,
      managed: true,
      type: type,
      name: name,
      initials: makeInitials(user.initials || name),
      role: user.role || (type === "supplier" ? "Поставщик брендов" : "Продавец-консультант"),
      cabinetLabel: "перейти в кабинет",
      cabinetMenuLabel: type === "supplier" ? "кабинет поставщика" : "мой кабинет",
      cabinetMenuDesc: type === "supplier" ? "Бренды и тесты поставщика" : "Кабинет реселлера",
      cabinetMenuAria: type === "supplier" ? "Кабинет поставщика" : "Кабинет реселлера",
      cabinetHref: type === "supplier" ? "supplier-dashboard.html" : "student-dashboard.html",
      avatar: user.avatar || (type === "supplier"
        ? "linear-gradient(135deg, #7257c6 0%, #d95a9b 100%)"
        : "linear-gradient(135deg, #2f8cff 0%, #32c48d 100%)"),
      email: user.email || "",
      company: user.company || "",
      brands: user.brands || ""
    };
  }

  function getManagedUsers() {
    try {
      var users = JSON.parse(localStorage.getItem(ADMIN_ACCOUNTS_KEY) || "[]");
      return Array.isArray(users) ? users.map(normalizeManagedUser) : [];
    } catch (error) {
      return [];
    }
  }

  function saveManagedUsers(users) {
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(users.map(normalizeManagedUser)));
    window.dispatchEvent(new CustomEvent("ts-academy-admin-accounts-change", { detail: getManagedUsers() }));
    return getManagedUsers();
  }

  function addManagedUser(user) {
    var users = getManagedUsers();
    var normalized = normalizeManagedUser(user);
    if (users.some(function (item) { return item.id === normalized.id; })) {
      normalized.id += "-" + Date.now().toString(36);
    }
    users.unshift(normalized);
    return saveManagedUsers(users);
  }

  function removeManagedUser(id) {
    return saveManagedUsers(getManagedUsers().filter(function (user) { return user.id !== id; }));
  }

  function normalizeAdminCompany(company) {
    var name = String(company && company.name || "Новая компания").trim();
    var id = String(company && company.id || ("company-" + Date.now())).replace(/[^\w-]/g, "-");
    var rawStores = Array.isArray(company && company.stores) ? company.stores : String(company && company.stores || "")
      .split(/[\n,]+/)
      .map(function (store) { return store.trim(); })
      .filter(Boolean);
    var stores = rawStores.map(function (store, index) {
      if (typeof store === "object") {
        return {
          id: String(store.id || (id + "-store-" + index)).replace(/[^\w-]/g, "-"),
          name: String(store.name || "Торговая точка").trim(),
          city: String(store.city || "").trim()
        };
      }
      return {
        id: id + "-store-" + index,
        name: store,
        city: ""
      };
    });
    if (!stores.length) {
      stores.push({ id: id + "-store-0", name: "Основная торговая точка", city: "" });
    }
    return {
      id: id,
      name: name,
      stores: stores,
      contact: String(company && company.contact || "").trim(),
      note: String(company && company.note || "").trim()
    };
  }

  function getAdminCompanies() {
    try {
      var companies = JSON.parse(localStorage.getItem(ADMIN_COMPANIES_KEY) || "[]");
      return Array.isArray(companies) ? companies.map(normalizeAdminCompany) : [];
    } catch (error) {
      return [];
    }
  }

  function saveAdminCompanies(companies) {
    localStorage.setItem(ADMIN_COMPANIES_KEY, JSON.stringify(companies.map(normalizeAdminCompany)));
    window.dispatchEvent(new CustomEvent("ts-academy-admin-companies-change", { detail: getAdminCompanies() }));
    return getAdminCompanies();
  }

  function addAdminCompany(company) {
    var companies = getAdminCompanies();
    var normalized = normalizeAdminCompany(company);
    if (companies.some(function (item) { return item.id === normalized.id; })) {
      normalized.id += "-" + Date.now().toString(36);
    }
    companies.unshift(normalized);
    return saveAdminCompanies(companies);
  }

  function removeAdminCompany(id) {
    return saveAdminCompanies(getAdminCompanies().filter(function (company) { return company.id !== id; }));
  }

  function allUsers() {
    return appUsers.concat(getManagedUsers());
  }

  var hiddenMenuKeys = {
    rating: true,
    handbook: true
  };

  function getActiveUserId() {
    try {
      var id = localStorage.getItem(ACTIVE_USER_KEY);
      return allUsers().some(function (user) { return user.id === id; }) ? id : "student";
    } catch (error) {
      return "student";
    }
  }

  function getActiveUser() {
    var id = getActiveUserId();
    return allUsers().find(function (user) { return user.id === id; }) || appUsers[0];
  }

  function setActiveUser(id) {
    try {
      localStorage.setItem(ACTIVE_USER_KEY, id);
    } catch (error) {}
    window.dispatchEvent(new CustomEvent("ts-academy-user-change", { detail: getActiveUser() }));
    return getActiveUser();
  }

  function mergeState(raw) {
    var state = clone(defaultState);
    if (!raw || typeof raw !== "object") return state;
    Object.keys(raw).forEach(function (key) {
      state[key] = raw[key];
    });
    state.student = Object.assign({}, defaultState.student, state.student || {});
    state.courses = Array.isArray(state.courses) ? state.courses : clone(defaultState.courses);
    state.tests = Array.isArray(state.tests) ? state.tests : [];
    state.achievements = Array.isArray(state.achievements) ? state.achievements : clone(defaultState.achievements);
    state.events = Array.isArray(state.events) ? state.events : [];
    state.xpEvents = Array.isArray(state.xpEvents) ? state.xpEvents : [];
    state.activity = Array.isArray(state.activity) ? state.activity : [];
    state.certificates = Array.isArray(state.certificates) ? state.certificates : [];
    state.levelConfig = Array.isArray(state.levelConfig) ? state.levelConfig : clone(defaultState.levelConfig);
    state.scoringRules = Object.assign({}, defaultState.scoringRules, state.scoringRules || {});
    if (typeof state.student.totalXp !== "number") {
      var level = Number(state.student.level || 1);
      var levelConfig = state.levelConfig || defaultState.levelConfig;
      var currentLevel = levelConfig.slice().reverse().find(function (item) { return item.level <= level; }) || levelConfig[0];
      state.student.totalXp = Number(currentLevel.xpFrom || 0) + Number(state.student.xp || 0);
    }
    syncStudentLevel(state);
    updateAchievements(state);
    return state;
  }

  function getState() {
    try {
      return mergeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    } catch (error) {
      return clone(defaultState);
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("ts-academy-state-change", { detail: state }));
    return state;
  }

  function formatDate() {
    return new Date().toLocaleDateString("ru-RU");
  }

  function isoDate() {
    return new Date().toISOString();
  }

  function dateKey(date) {
    var source = date ? new Date(date) : new Date();
    return source.toISOString().slice(0, 10);
  }

  function monthKey(date) {
    return dateKey(date).slice(0, 7);
  }

  function eventDateLabel(date) {
    return new Date(date || Date.now()).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function levelInfo(totalXp, config) {
    var levels = (config || defaultState.levelConfig).slice().sort(function (a, b) { return a.xpFrom - b.xpFrom; });
    var current = levels[0];
    var next = null;
    levels.forEach(function (level, index) {
      if (totalXp >= level.xpFrom) {
        current = level;
        next = levels[index + 1] || null;
      }
    });
    var nextLevelXp = next ? next.xpFrom - current.xpFrom : Math.max(1000, Math.round((current.xpFrom || 0) * 0.2));
    var xpInCurrentLevel = next ? totalXp - current.xpFrom : nextLevelXp;
    return {
      currentLevel: current.level,
      levelTitle: current.title,
      nextLevel: next ? next.level : current.level,
      nextLevelTitle: next ? next.title : "Максимальный уровень",
      nextLevelXp: nextLevelXp,
      xpInCurrentLevel: Math.max(0, xpInCurrentLevel),
      xpToNextLevel: next ? Math.max(0, next.xpFrom - totalXp) : 0,
      progressPercent: next ? Math.min(100, Math.round(xpInCurrentLevel / nextLevelXp * 100)) : 100
    };
  }

  function syncStudentLevel(state) {
    var info = levelInfo(Number(state.student.totalXp || 0), state.levelConfig);
    state.student.level = info.currentLevel;
    state.student.levelTitle = info.levelTitle;
    state.student.xp = info.xpInCurrentLevel;
    state.student.nextLevelXp = info.nextLevelXp;
    state.student.monthlyXp = monthlyXp(state);
    return info;
  }

  function monthlyXp(state) {
    var currentMonth = monthKey();
    return (state.xpEvents || []).filter(function (event) {
      return monthKey(event.createdAt) === currentMonth;
    }).reduce(function (sum, event) { return sum + Number(event.xp || 0); }, 0);
  }

  function eventKey(event) {
    return [event.eventType, event.entityId || "", event.courseId || "", event.milestone || ""].join("|");
  }

  function hasXpEvent(state, event) {
    var key = eventKey(event);
    return (state.xpEvents || []).some(function (item) { return eventKey(item) === key; });
  }

  function attemptMultiplier(attempt) {
    attempt = Number(attempt || 1);
    if (attempt <= 1) return 1;
    if (attempt === 2) return 0.7;
    if (attempt === 3) return 0.5;
    return 0.25;
  }

  function baseTestXp(percent, passPercent) {
    if (percent < passPercent) return 5;
    if (percent < 80) return 50;
    if (percent < 90) return 70;
    if (percent < 100) return 90;
    return 120;
  }

  function calculateXpForEvent(event, state) {
    var type = event.eventType;
    var rules = state.scoringRules || defaultState.scoringRules;
    if (type === "test_passed" || type === "test_failed") {
      var percent = Number(event.percent || 0);
      var passPercent = Number(event.passPercent || 70);
      var base = baseTestXp(percent, passPercent);
      if (type === "test_failed") base = Math.min(base, 5);
      var multiplier = attemptMultiplier(event.attempt || 1);
      var xp = Math.round(base * multiplier);
      if (event.isFinal && percent >= 80) xp += 150;
      return { xp: xp, baseXp: base, multiplier: multiplier };
    }
    if (type === "course_milestone") {
      var table = rules.courseMilestones || {};
      return { xp: Number(table[event.milestone] || 0), baseXp: Number(table[event.milestone] || 0), multiplier: 1 };
    }
    if (type === "certificate_issued") return { xp: 100, baseXp: 100, multiplier: 1 };
    if (type === "assignment_accepted") {
      var difficulty = event.difficulty || "medium";
      var amount = Number((rules.assignment || {})[difficulty] || 50);
      return { xp: amount, baseXp: amount, multiplier: 1 };
    }
    if (type === "assignment_returned") return { xp: 10, baseXp: 10, multiplier: 1 };
    if (type === "lesson_completed") return { xp: 10, baseXp: 10, multiplier: 1 };
    if (type === "lesson_opened") return { xp: 2, baseXp: 2, multiplier: 1 };
    if (type === "webinar_attended") return { xp: 50, baseXp: 50, multiplier: 1 };
    if (type === "favorite_added") return { xp: 2, baseXp: 2, multiplier: 1 };
    if (type === "daily_login") return { xp: 5, baseXp: 5, multiplier: 1 };
    return { xp: Number(event.xp || 0), baseXp: Number(event.xp || 0), multiplier: 1 };
  }

  function activityXpToday(state) {
    var today = dateKey();
    return (state.xpEvents || []).filter(function (event) {
      return event.isActivity && dateKey(event.createdAt) === today;
    }).reduce(function (sum, event) { return sum + Number(event.xp || 0); }, 0);
  }

  function awardXp(event, existingState) {
    var state = existingState || getState();
    event = Object.assign({}, event || {});
    event.eventType = event.eventType || "activity";
    event.entityId = event.entityId || event.eventType;
    if (event.dedupe !== false && hasXpEvent(state, event)) {
      return existingState ? state : saveState(state);
    }
    var calc = calculateXpForEvent(event, state);
    var xp = Math.max(0, Number(event.xp != null ? event.xp : calc.xp || 0));
    if (event.isActivity) {
      var cap = Number((state.scoringRules || {}).activityDailyCap || 50);
      xp = Math.max(0, Math.min(xp, cap - activityXpToday(state)));
    }
    if (!xp && event.skipZeroEvent !== false) {
      return existingState ? state : saveState(state);
    }
    var createdAt = isoDate();
    var xpEvent = {
      id: "xp-" + Date.now() + "-" + Math.round(Math.random() * 100000),
      eventType: event.eventType,
      entityId: event.entityId,
      courseId: event.courseId || "",
      title: event.title || "",
      xp: xp,
      baseXp: calc.baseXp || xp,
      multiplier: calc.multiplier || 1,
      score: event.score,
      percent: event.percent,
      attempt: event.attempt,
      milestone: event.milestone || "",
      isActivity: !!event.isActivity,
      createdAt: createdAt,
      dateLabel: eventDateLabel(createdAt),
      metadata: event.metadata || {}
    };
    state.xpEvents.unshift(xpEvent);
    state.student.totalXp = Number(state.student.totalXp || 0) + xp;
    syncStudentLevel(state);
    state.events = state.events || [];
    state.events.unshift(["Сейчас", (event.label || xpEvent.title || "Учебное событие") + " · +" + xp + " XP"]);
    updateAchievements(state);
    return existingState ? state : saveState(state);
  }

  function recordActivity(type, metadata) {
    var state = getState();
    metadata = metadata || {};
    var entityId = metadata.entityId || metadata.lessonId || metadata.courseId || type;
    var milestone = type === "daily_login" || type === "lesson_opened" || type === "lesson_revisited" ? dateKey() : "";
    state.activity.unshift({ type: type, entityId: entityId, metadata: metadata, createdAt: isoDate() });
    if (type === "daily_login") {
      var today = dateKey();
      var last = state.student.lastLoginDate;
      if (last !== today) {
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (!last && Number(state.student.streakDays || 0) > 0) {
          state.student.streakDays = Number(state.student.streakDays || 0);
        } else {
          state.student.streakDays = last === dateKey(yesterday) ? Number(state.student.streakDays || 0) + 1 : 1;
        }
        state.student.lastLoginDate = today;
      }
    }
    awardXp({ eventType: type, entityId: entityId, courseId: metadata.courseId || "", milestone: milestone, isActivity: true, label: metadata.label || "Активность" }, state);
    return saveState(state);
  }

  function certificateTier(percent, attempt) {
    percent = Number(percent || 0);
    attempt = Number(attempt || 1);
    if (percent === 100 && attempt === 1) return "Экспертный";
    if (percent >= 90) return "Уверенный";
    return "Базовый";
  }

  function issueCertificate(courseId, state) {
    state = state || getState();
    var course = (state.courses || []).find(function (item) { return item.id === courseId; });
    if (!course || course.progress < 100) return null;
    var finalTest = (state.tests || []).filter(function (test) {
      return (test.courseId === courseId || test.brand === courseId || String(test.course || "").toLowerCase().indexOf(courseId) >= 0) && test.status === "passed";
    }).sort(function (a, b) { return Number(b.percent || 0) - Number(a.percent || 0); })[0];
    if (!finalTest || Number(finalTest.percent || 0) < 80) return null;
    state.certificates = state.certificates || [];
    var existing = state.certificates.find(function (cert) { return cert.courseId === courseId; });
    if (existing) return existing;
    var cert = {
      id: "cert-" + courseId,
      courseId: courseId,
      title: course.title,
      tier: certificateTier(finalTest.percent, finalTest.attempt),
      percent: finalTest.percent,
      date: formatDate()
    };
    state.certificates.unshift(cert);
    course.cert = true;
    awardXp({ eventType: "certificate_issued", entityId: cert.id, courseId: courseId, label: "Выдан сертификат \"" + course.title + "\"" }, state);
    return cert;
  }

  function ensureAchievement(state, id, icon, title, desc, unlocked) {
    var item = (state.achievements || []).find(function (achievement) { return achievement.id === id; });
    if (!item) {
      item = { id: id, icon: icon, title: title, desc: desc, unlocked: false };
      state.achievements.push(item);
    }
    if (unlocked) item.unlocked = true;
    return item;
  }

  function updateAchievements(state) {
    state.achievements = Array.isArray(state.achievements) ? state.achievements : [];
    var events = state.xpEvents || [];
    var tests = state.tests || [];
    var courses = state.courses || [];
    var certs = state.certificates || [];
    ensureAchievement(state, "first_lesson", "1", "Первый шаг", "Завершён первый урок.", events.some(function (event) { return event.eventType === "lesson_completed"; }));
    ensureAchievement(state, "first_test", "✓", "Первый тест", "Пройден первый тест Академии.", tests.some(function (test) { return test.status === "passed"; }));
    ensureAchievement(state, "perfect_test", "100", "Без ошибок", "Тест закрыт на 100%.", tests.some(function (test) { return Number(test.percent || 0) === 100; }));
    ensureAchievement(state, "first_try", "★", "С первой попытки", "Финальный тест пройден с первой попытки.", tests.some(function (test) { return test.status === "passed" && Number(test.attempt || 1) === 1 && Number(test.percent || 0) >= 80; }));
    ensureAchievement(state, "persistent", "↻", "Упрямый", "Проваленный тест был закрыт пересдачей.", tests.some(function (test) { return test.status === "passed" && Number(test.attempt || 1) > 1; }));
    ensureAchievement(state, "streak_7", "7", "Серийный ученик", "7 дней активности подряд.", Number((state.student || {}).streakDays || 0) >= 7);
    ensureAchievement(state, "brand_specialist", "B", "Бренд-специалист", "Завершён курс по бренду.", courses.some(function (course) { return course.status === "completed" && /pergo|calitex|coswick/i.test(course.id + " " + course.title); }));
    ensureAchievement(state, "category_expert", "C", "Категорийный эксперт", "Завершён курс по категории.", courses.some(function (course) { return course.status === "completed" && /catalog|каталог|категор/i.test(course.id + " " + course.title); }));
    ensureAchievement(state, "cert", "✓", "Первый сертификат", "Получен первый сертификат Академии.", certs.length > 0 || courses.some(function (course) { return course.cert; }));
    ensureAchievement(state, "pergo", "P", "Знаток Pergo", "Пройден тест по бренду Pergo.", tests.some(function (test) { return test.status === "passed" && /pergo/i.test(test.brand || test.courseId || test.course || ""); }));
    ensureAchievement(state, "calitex", "C", "Знаток Calitex", "Пройден тест по бренду Calitex.", tests.some(function (test) { return test.status === "passed" && /calitex/i.test(test.brand || test.courseId || test.course || ""); }));
  }

  function getSummary(state) {
    var metrics = getStudentMetrics(state);
    var courses = state.courses || [];
    var tests = state.tests || [];
    var activeCourses = courses.filter(function (course) { return course.status === "active"; }).length;
    var completedCourses = courses.filter(function (course) { return course.status === "completed"; }).length;
    var passedTests = tests.filter(function (test) { return test.status === "passed"; }).length;
    var failedTests = tests.filter(function (test) { return test.status === "failed"; }).length;
    var certs = courses.filter(function (course) { return course.cert; }).length;
    var avgProgress = courses.length ? Math.round(courses.reduce(function (sum, course) { return sum + (course.progress || 0); }, 0) / courses.length) : 0;
    return {
      activeCourses: activeCourses,
      completedCourses: completedCourses,
      passedTests: passedTests,
      failedTests: failedTests,
      certs: certs,
      avgProgress: avgProgress,
      xp: metrics.xpInCurrentLevel,
      totalXp: metrics.totalXp,
      monthlyXp: metrics.monthlyXp,
      nextLevelXp: metrics.nextLevelXp,
      level: metrics.currentLevel,
      levelTitle: metrics.levelTitle
    };
  }

  function setCourseProgress(state, courseId, progress, next) {
    var course = state.courses.find(function (item) { return item.id === courseId; });
    if (!course) return;
    var previous = Number(course.progress || 0);
    course.progress = Math.max(previous, progress);
    if (next) course.next = next;
    [25, 50, 75, 100].forEach(function (milestone) {
      if (previous < milestone && course.progress >= milestone) {
        awardXp({
          eventType: "course_milestone",
          entityId: courseId,
          courseId: courseId,
          milestone: String(milestone),
          title: course.title,
          label: "Закрыт этап " + milestone + "% курса \"" + course.title + "\""
        }, state);
      }
    });
    if (course.progress >= 100) {
      course.progress = 100;
      course.status = "completed";
      course.next = "Курс завершён";
      issueCertificate(courseId, state);
    }
    syncStudentLevel(state);
  }

  function completeTest(options) {
    var state = getState();
    var total = options.total || options.questions || 1;
    var score = options.score || 0;
    var percent = Math.round(score / total * 100);
    var passPercent = Number(options.passPercent || (options.isFinal ? 80 : 70));
    var passed = percent >= passPercent;
    var id = options.id || options.brand + "-brand-test";
    var existing = state.tests.find(function (test) { return test.id === id; });
    var attempt = Number(options.attempt || ((existing && existing.attempt) ? existing.attempt + 1 : 1));
    var courseId = options.courseId || options.brand || options.course || "";
    var calc = calculateXpForEvent({
      eventType: passed ? "test_passed" : "test_failed",
      percent: percent,
      passPercent: passPercent,
      attempt: attempt,
      isFinal: !!options.isFinal
    }, state);
    var previousAwarded = existing ? Number(existing.xpAwarded || 0) : 0;
    var xpAwarded = Math.max(0, calc.xp - previousAwarded);
    var record = {
      id: id,
      brand: options.brand,
      courseId: courseId,
      course: options.course || options.brand,
      title: options.title,
      score: score,
      total: total,
      percent: percent,
      status: passed ? "passed" : "failed",
      attempt: attempt,
      passPercent: passPercent,
      multiplier: calc.multiplier,
      xpAwarded: previousAwarded + xpAwarded,
      xpLastAwarded: xpAwarded,
      date: formatDate()
    };

    if (existing) {
      Object.keys(record).forEach(function (key) { existing[key] = record[key]; });
    } else {
      state.tests.unshift(record);
    }

    var course = state.courses.find(function (item) { return item.id === courseId; });
    if (course) {
      course.testsPassed = Math.max(course.testsPassed || 0, passed ? 1 : 0);
      setCourseProgress(state, course.id, passed ? 100 : Math.max(course.progress || 0, 78), passed ? "Курс завершён" : "Повторить тест");
      course.next = passed ? "Курс завершён" : "Повторить тест";
      if (passed) {
        course.status = "completed";
        issueCertificate(course.id, state);
      }
    }

    if (xpAwarded > 0) {
      awardXp({
        eventType: passed ? "test_passed" : "test_failed",
        entityId: id,
        courseId: courseId,
        title: options.title,
        score: score,
        percent: percent,
        passPercent: passPercent,
        attempt: attempt,
        isFinal: !!options.isFinal,
        xp: xpAwarded,
        milestone: "best-result",
        dedupe: false,
        label: (passed ? "Пройден" : "Не пройден") + " тест \"" + options.title + "\""
      }, state);
    } else {
      state.events.unshift(["Сейчас", "Тест \"" + options.title + "\" обновлён без дополнительного XP"]);
    }
    updateAchievements(state);
    saveState(state);
    return { state: state, record: record, xpAwarded: xpAwarded, percent: percent, passed: passed, attempt: attempt, multiplier: calc.multiplier };
  }

  function courseXp(state, courseId) {
    return (state.xpEvents || []).filter(function (event) {
      return event.courseId === courseId;
    }).reduce(function (sum, event) { return sum + Number(event.xp || 0); }, 0);
  }

  function qualityIndex(state) {
    var tests = state.tests || [];
    var courses = state.courses || [];
    var avgTest = tests.length ? tests.reduce(function (sum, test) { return sum + Number(test.percent || 0); }, 0) / tests.length : 0;
    var completedShare = courses.length ? courses.filter(function (course) { return course.status === "completed"; }).length / courses.length : 0;
    if (!tests.length && !courses.length) return 0;
    if (!tests.length) return Math.round(completedShare * 100);
    if (!courses.length) return Math.round(avgTest);
    return Math.round(avgTest * 0.6 + completedShare * 100 * 0.4);
  }

  function getStudentMetrics(existingState) {
    var state = existingState || getState();
    syncStudentLevel(state);
    var info = levelInfo(Number(state.student.totalXp || 0), state.levelConfig);
    var courses = state.courses || [];
    var tests = state.tests || [];
    var certs = state.certificates || [];
    var metrics = {
      totalXp: Number(state.student.totalXp || 0),
      monthlyXp: monthlyXp(state),
      currentLevel: info.currentLevel,
      levelTitle: info.levelTitle,
      nextLevel: info.nextLevel,
      nextLevelTitle: info.nextLevelTitle,
      nextLevelXp: info.nextLevelXp,
      xpInCurrentLevel: info.xpInCurrentLevel,
      xpToNextLevel: info.xpToNextLevel,
      progressPercent: info.progressPercent,
      activeCourses: courses.filter(function (course) { return course.status === "active"; }).length,
      completedCourses: courses.filter(function (course) { return course.status === "completed"; }).length,
      passedTests: tests.filter(function (test) { return test.status === "passed"; }).length,
      failedTests: tests.filter(function (test) { return test.status === "failed"; }).length,
      certs: certs.length || courses.filter(function (course) { return course.cert; }).length,
      streakDays: Number(state.student.streakDays || 0),
      qualityIndex: qualityIndex(state),
      courses: courses.map(function (course) {
        return Object.assign({}, course, {
          xpEarned: courseXp(state, course.id),
          milestonesAwarded: (state.xpEvents || []).filter(function (event) {
            return event.courseId === course.id && event.eventType === "course_milestone";
          }).map(function (event) { return event.milestone; })
        });
      }),
      tests: tests,
      certificates: certs,
      achievements: state.achievements || [],
      activity: (state.xpEvents || []).concat((state.activity || []).map(function (event) {
        return Object.assign({ xp: 0, eventType: event.type, title: event.type }, event);
      })).sort(function (a, b) { return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); })
    };
    return metrics;
  }

  function getRatingPeople(mode) {
    var state = getState();
    var metrics = getStudentMetrics(state);
    var people = [
      { id: "anna", name: "Анна Владимирова", role: "Менеджер по продажам", type: "manager", totalXp: 6840, monthlyXp: 840, progress: 96, tests: 6, certs: 2, streak: 12, qualityIndex: 93, status: "Лидер группы", attention: false },
      { id: "current", name: state.student.name, role: state.student.role, type: "manager", totalXp: metrics.totalXp, monthlyXp: metrics.monthlyXp, progress: Math.round((metrics.completedCourses / Math.max(1, state.courses.length)) * 100), tests: metrics.passedTests, certs: metrics.certs, streak: metrics.streakDays, qualityIndex: metrics.qualityIndex, status: metrics.failedTests ? "Есть пересдачи" : "Стабильный прогресс", attention: metrics.failedTests > 0 },
      { id: "maria", name: "Мария Орлова", role: "Супервайзер торгового зала", type: "supervisor", totalXp: 5565, monthlyXp: 620, progress: 82, tests: 4, certs: 0, streak: 5, qualityIndex: 84, status: "Наставник группы", attention: false },
      { id: "igor", name: "Игорь Семёнов", role: "Менеджер-стажёр", type: "manager", totalXp: 4190, monthlyXp: 210, progress: 68, tests: 2, certs: 0, streak: 2, qualityIndex: 61, status: "Нужна пересдача", attention: true }
    ];
    var key = mode === "all-time" ? "totalXp" : "monthlyXp";
    return people.sort(function (a, b) { return b[key] - a[key]; }).map(function (person, index) {
      return Object.assign({}, person, { place: index + 1, points: person[key], ratingMode: mode || "month" });
    });
  }

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    return saveState(clone(defaultState));
  }

  function getFavorites() {
    try {
      var favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      return Array.isArray(favorites) ? favorites : [];
    } catch (error) {
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent("ts-academy-favorites-change", { detail: favorites }));
    return favorites;
  }

  function normalizeFavoriteItem(item) {
    return {
      id: item.id,
      title: item.title,
      type: item.type || "Материал",
      url: item.url,
      description: item.description || ""
    };
  }

  function isFavorite(id) {
    return getFavorites().some(function (item) {
      return item.id === id;
    });
  }

  function toggleFavorite(item) {
    var normalized = normalizeFavoriteItem(item);
    if (!normalized.id || !normalized.title || !normalized.url) {
      return getFavorites();
    }

    var favorites = getFavorites();
    var index = favorites.findIndex(function (favorite) {
      return favorite.id === normalized.id;
    });

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.unshift(normalized);
      awardXp({
        eventType: "favorite_added",
        entityId: normalized.id,
        title: normalized.title,
        isActivity: true,
        label: "Добавлено в избранное \"" + normalized.title + "\""
      });
    }

    return saveFavorites(favorites);
  }

  window.TouchSpaceAcademy = {
    getState: getState,
    saveState: saveState,
    getSummary: function () { return getSummary(getState()); },
    completeTest: completeTest,
    awardXp: awardXp,
    calculateXpForEvent: function (event) { return calculateXpForEvent(event, getState()); },
    recordActivity: recordActivity,
    getStudentMetrics: function () { return getStudentMetrics(getState()); },
    getRatingPeople: getRatingPeople,
    issueCertificate: function (courseId) {
      var state = getState();
      var cert = issueCertificate(courseId, state);
      saveState(state);
      return cert;
    },
    setCourseProgress: function (courseId, progress, next) {
      var state = getState();
      setCourseProgress(state, courseId, progress, next);
      return saveState(state);
    },
    resetState: resetState,
    getFavorites: getFavorites,
    isFavorite: isFavorite,
    toggleFavorite: toggleFavorite,
    getActiveUser: getActiveUser,
    isSupplierAccount: function () { var user = getActiveUser(); return user.id === "supplier" || user.type === "supplier"; },
    setActiveUser: setActiveUser,
    getManagedUsers: getManagedUsers,
    addManagedUser: addManagedUser,
    removeManagedUser: removeManagedUser,
    getAdminCompanies: getAdminCompanies,
    addAdminCompany: addAdminCompany,
    removeAdminCompany: removeAdminCompany
  };

  var notifications = [
    {
      icon: "AI",
      title: "Новый курс: AI-помощник для менеджера",
      text: "Научитесь готовить встречи и follow-up быстрее."
    },
    {
      icon: "%",
      title: "Продолжите “Работу с возражениями”",
      text: "Осталось 12 минут до завершения модуля."
    },
    {
      icon: "★",
      title: "До 5 уровня осталось 500 очков",
      text: "Самый быстрый путь: пройти продуктовый тест."
    },
    {
      icon: "✓",
      title: "Задача на сегодня",
      text: "Посмотрите урок “Демо без лишней воды”."
    }
  ];

  function createWordmark() {
    var wordmark = document.createElement("div");
    wordmark.className = "wordmark";
    wordmark.setAttribute("aria-label", "TouchSpace Академия");
    wordmark.innerHTML = "<span>TouchSpace</span><span>Академия</span>";
    return wordmark;
  }

  function injectUniversalMenuStyles() {
    if (document.getElementById("ts-universal-menu-styles")) return;
    var style = document.createElement("style");
    style.id = "ts-universal-menu-styles";
    style.textContent =
      ".sidebar{position:sticky!important;top:22px!important;z-index:1000!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:thin;scrollbar-color:rgba(10,132,255,.2) transparent}" +
      ".sidebar::-webkit-scrollbar{width:6px}" +
      ".sidebar::-webkit-scrollbar-track{background:transparent}" +
      ".sidebar::-webkit-scrollbar-thumb{background:rgba(10,132,255,.3);border-radius:3px}" +
      ".sidebar::-webkit-scrollbar-thumb:hover{background:rgba(10,132,255,.5)}" +
      ".sidebar .nav{position:relative;z-index:2;display:grid;gap:10px;overflow:visible;width:100%;justify-items:center}" +
      ".sidebar .nav__item{position:relative;display:grid;place-items:center;width:56px;height:56px;border:0;border-radius:18px;background:transparent;cursor:pointer;color:#7b8799;font-weight:950;transition:background 180ms ease,box-shadow 180ms ease,transform 180ms ease}" +
      ".sidebar .nav__item:hover{background:rgba(10,132,255,.08);transform:translateY(-1px)}" +
      ".sidebar .nav__item.is-active{background:#0a84ff;box-shadow:0 12px 28px rgba(10,132,255,.26);color:#fff}" +
      ".sidebar .nav__item img{width:25px;height:25px;object-fit:contain;transition:filter 180ms ease}" +
      ".sidebar .nav__item.is-active img:not([data-active-icon]){filter:brightness(0) invert(1)}" +
      ".sidebar .nav__item span[data-menu-fallback]{font-size:20px;line-height:1}" +
      ".sidebar .nav__ts{display:inline-flex;align-items:baseline;justify-content:center;width:34px;height:34px;border-radius:14px;background:#fff;box-shadow:inset 0 0 0 1px rgba(217,229,246,.92);font-weight:950;font-size:18px;line-height:1;letter-spacing:-.08em}" +
      ".sidebar .nav__ts-t{color:#172033}" +
      ".sidebar .nav__ts-s{color:#0a84ff;margin-left:-1px}" +
      ".sidebar .nav__badge{position:absolute;right:6px;top:6px;display:grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border:2px solid #fff;border-radius:999px;background:#ff8a3d;color:#fff;font-size:10px;font-weight:950;line-height:1}" +
      ".sidebar .nav__badge[hidden]{display:none}" +
      ".sidebar .nav__item::before,.sidebar .nav__item::after{display:none!important}" +
      ".nav__tooltip{position:fixed!important;z-index:99999!important;min-width:max-content!important;padding:10px 13px!important;border-radius:14px!important;background:rgba(255,255,255,.94)!important;box-shadow:0 16px 38px rgba(24,45,90,.14)!important;color:#111827!important;font-size:13px!important;font-weight:800!important;line-height:1!important;white-space:nowrap!important;opacity:0!important;pointer-events:none!important;transition:opacity 160ms ease,transform 160ms ease!important;backdrop-filter:blur(14px)!important;transform:translate(-6px,-50%)!important}" +
      ".nav__tooltip.show{opacity:1!important;transform:translate(0,-50%)!important}" +
      "[data-favorite-toggle].is-favorite{background:#edf4ff!important;color:#0a84ff!important;border-color:rgba(10,132,255,.36)!important;box-shadow:0 12px 28px rgba(10,132,255,.16)!important}" +
      "@media(max-width:760px){.sidebar{position:static!important;top:auto!important;overflow-x:auto!important;overflow-y:hidden!important}.sidebar .nav{grid-template-columns:repeat(7,minmax(48px,1fr));display:grid}.sidebar .nav__item{width:100%}.nav__tooltip{display:none!important}}";
    document.head.appendChild(style);
  }

  var menuTooltip;
  var activeTooltipButton;

  function getMenuTooltip() {
    if (menuTooltip) return menuTooltip;
    menuTooltip = document.createElement("div");
    menuTooltip.className = "nav__tooltip";
    menuTooltip.setAttribute("role", "tooltip");
    document.body.appendChild(menuTooltip);
    return menuTooltip;
  }

  function hideMenuTooltip() {
    activeTooltipButton = null;
    if (menuTooltip) {
      menuTooltip.classList.remove("show");
    }
  }

  function positionMenuTooltip(button) {
    if (!menuTooltip || !button) return;
    var rect = button.getBoundingClientRect();
    var tooltipRect = menuTooltip.getBoundingClientRect();
    var gap = 12;
    var left = rect.right + gap;
    var top = rect.top + rect.height / 2;

    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = rect.left - tooltipRect.width - gap;
    }

    top = Math.max(tooltipRect.height / 2 + 8, Math.min(top, window.innerHeight - tooltipRect.height / 2 - 8));
    menuTooltip.style.left = left + "px";
    menuTooltip.style.top = top + "px";
  }

  function showMenuTooltip(button) {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    var text = button.getAttribute("data-tooltip") || button.getAttribute("aria-label");
    if (!text) return;
    var tooltip = getMenuTooltip();
    activeTooltipButton = button;
    tooltip.textContent = text;
    tooltip.classList.add("show");
    positionMenuTooltip(button);
  }

  var menuItems = [
    { key: "home", label: "главная", desc: "Главная страница", aria: "Главная", href: "index.html", icon: "icons/home.svg" },
    { key: "courses", label: "все курсы", desc: "Все доступные курсы", aria: "Курсы", href: "courses.html", icon: "icons/catalog.svg" },
    { key: "brands", label: "бренды", desc: "Бренды и проекты", aria: "Бренды", href: "brands.html", icon: "icons/Star.svg" },
    { key: "student", label: "мой кабинет", desc: "Кабинет реселлера", aria: "Кабинет реселлера", href: "student-dashboard.html", icon: "icons/progress.svg", dynamicCabinet: true },
    { key: "admin-resellers", label: "реселлеры", desc: "Администрирование реселлеров", aria: "Администрирование реселлеров", href: "admin-resellers.html", icon: "icons/progress.svg", adminOnly: true },
    { key: "admin-suppliers", label: "поставщики", desc: "Администрирование поставщиков", aria: "Администрирование поставщиков", href: "admin-suppliers.html", icon: "icons/catalog.svg", adminOnly: true },
    { key: "admin-companies", label: "компании", desc: "Администрирование компаний", aria: "Администрирование компаний", href: "admin-companies.html", icon: "icons/moya_kompaniya.png", activeIcon: "icons/moya_kompaniya_white.png", adminOnly: true },
    { key: "supplier-students", label: "реселлеры брендов", desc: "Торговые точки и реселлеры по брендам поставщика", aria: "Реселлеры брендов", href: "supplier-students.html", icon: "icons/moya_kompaniya.png", activeIcon: "icons/moya_kompaniya_white.png", supplierOnly: true },
    { key: "tasks", label: "задачи", desc: "Мои задачи и дедлайны", aria: "Задачи", href: "tasks.html", icon: "icons/calendar.svg" },
    { key: "favorites", label: "избранное", desc: "Сохраненные курсы", aria: "Избранное", href: "favorites.html", icon: "icons/favorites.svg" },
    { key: "library", label: "библиотека", desc: "Библиотека материалов", aria: "Библиотека", href: "library.html", icon: "icons/biblioteka.png", activeIcon: "icons/biblioteka_white.png" },
    { key: "glossary", label: "глоссарий", desc: "Словарь терминов", aria: "Глоссарий", href: "glossary.html", icon: "icons/glossariy.png", activeIcon: "icons/glossariy_white.png" },
    { key: "polls", label: "опросы", desc: "Опросы и голосования", aria: "Опросы", href: "polls.html", icon: "icons/oprosy.png", activeIcon: "icons/oprosy_white.png" },
    { key: "rating", label: "рейтинг", desc: "Таблица лидеров", aria: "Рейтинг", href: "rating.html", icon: "icons/reyting.png", activeIcon: "icons/reyting_white.png" },
    { key: "events", label: "мероприятия", desc: "События и встречи", aria: "Мероприятия", href: "events.html", icon: "icons/meropriyatiya.png", activeIcon: "icons/meropriyatiya_white.png" },
    { key: "handbook", label: "моя компания", desc: "Структура и сотрудники", aria: "Моя компания", href: "employee-handbook.html", icon: "icons/moya_kompaniya.png", activeIcon: "icons/moya_kompaniya_white.png" },
    { key: "touchspace-b2b", label: "TouchSpace B2B", desc: "Личный кабинет TouchSpace B2B", aria: "TouchSpace B2B", href: "https://b2b.touchspace.biz/personal/", tsIcon: true }
  ];

  function currentPageName() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function resolveMenuItem(item) {
    if (!item.dynamicCabinet) return item;
    var user = getActiveUser();
    var resolved = {};
    Object.keys(item).forEach(function (key) {
      resolved[key] = item[key];
    });
    resolved.label = user.cabinetMenuLabel || item.label;
    resolved.desc = user.cabinetMenuDesc || item.desc;
    resolved.aria = user.cabinetMenuAria || item.aria;
    resolved.href = user.cabinetHref || item.href;
    return resolved;
  }

  function isMenuItemVisible(item) {
    var user = getActiveUser();
    if (user.id === "admin") return true;
    if (item.adminOnly) return false;
    if (hiddenMenuKeys[item.key]) return false;
    var isSupplier = user.id === "supplier" || user.type === "supplier";
    if (isSupplier && ["favorites", "glossary", "polls"].indexOf(item.key) >= 0) return false;
    if (item.supplierOnly && !isSupplier) return false;
    return true;
  }

  function isMenuItemActive(item) {
    item = resolveMenuItem(item);
    var page = currentPageName();
    if (item.href && page === item.href) return true;
    if (item.key === "courses" && /^(course-|lesson-)/.test(page)) return true;
    if (item.key === "brands" && /\/brands\/touchspace_brand_pages\//.test(window.location.pathname)) return true;
    if (item.key === "brands" && /-brand\.html$/.test(page)) return true;
    if (item.key === "brands" && /-test\.html$/.test(page)) return true;
    return false;
  }

  function createMenuButton(item) {
    item = resolveMenuItem(item);
    var button = document.createElement("button");
    button.className = "nav__item";
    button.type = "button";
    button.setAttribute("data-tooltip", item.desc || item.label);
    button.setAttribute("data-menu-key", item.key);
    button.setAttribute("aria-label", item.aria);
    if (item.href) button.setAttribute("data-href", portalUrl(item.href));
    var isActive = isMenuItemActive(item);
    if (isActive) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
    }
    if (item.tsIcon) {
      button.innerHTML = '<span class="nav__ts" aria-hidden="true"><span class="nav__ts-t">T</span><span class="nav__ts-s">S</span></span>';
    } else if (item.icon) {
      var iconSrc = isActive && item.activeIcon ? item.activeIcon : item.icon;
      var activeIconAttr = item.activeIcon ? ' data-active-icon="' + portalUrl(item.activeIcon) + '" data-default-icon="' + portalUrl(item.icon) + '"' : "";
      iconSrc = portalUrl(iconSrc);
      button.innerHTML = '<img src="' + iconSrc + '" alt=""' + activeIconAttr + '>' + (item.key === "favorites" ? '<span class="nav__badge" data-favorites-count hidden></span>' : "");
    } else {
      button.innerHTML = '<span data-menu-fallback>' + item.fallback + '</span>';
    }
    button.addEventListener("mouseenter", function () {
      showMenuTooltip(button);
    });
    button.addEventListener("focus", function () {
      showMenuTooltip(button);
    });
    button.addEventListener("mouseleave", hideMenuTooltip);
    button.addEventListener("blur", hideMenuTooltip);
    
    return button;
  }

  function renderNavigationCabinetLinks() {
    document.querySelectorAll(".nav__item").forEach(function (button) {
      var key = button.getAttribute("data-menu-key");
      var source = menuItems.find(function (item) { return item.key === key; });
      if (!source) return;
      var item = resolveMenuItem(source);
      button.setAttribute("data-tooltip", item.desc || item.label);
      button.setAttribute("aria-label", item.aria);
      if (item.href) {
        button.setAttribute("data-href", portalUrl(item.href));
      } else {
        button.removeAttribute("data-href");
      }
      var active = isMenuItemActive(source);
      button.classList.toggle("is-active", active);
      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
      var icon = button.querySelector("img");
      if (icon && item.activeIcon && item.icon) {
        icon.src = portalUrl(active ? item.activeIcon : item.icon);
      }
    });
  }

  function normalizeSidebar(sidebar) {
    sidebar.setAttribute("aria-label", "Навигация");
    sidebar.innerHTML = "";
    sidebar.dataset.sharedSidebar = "1";
    var nav = document.createElement("nav");
    nav.className = "nav";
    menuItems.forEach(function (item) {
      if (!isMenuItemVisible(item)) return;
      nav.appendChild(createMenuButton(item));
    });
    sidebar.appendChild(nav);
  }

  function bindUniversalNav() {
    Array.prototype.slice.call(document.querySelectorAll(".nav__item")).forEach(function (item) {
      if (item.dataset.universalBound === "1") return;
      item.dataset.universalBound = "1";
      item.addEventListener("click", function () {
        var href = item.getAttribute("data-href");
        if (!href) return;
        if (currentPageName() !== pageNameFromHref(href)) {
          window.location.href = href;
        }
      });
    });
  }


  function bindGenericHrefs() {
    Array.prototype.slice.call(document.querySelectorAll('[data-href]')).forEach(function (item) {
      if (item.classList.contains('nav__item')) return;
      if (item.dataset.genericHrefBound === '1') return;
      item.dataset.genericHrefBound = '1';
      item.style.cursor = 'pointer';
      item.setAttribute('role', item.getAttribute('role') || 'link');
      item.setAttribute('tabindex', item.getAttribute('tabindex') || '0');
      function go() {
        var href = item.getAttribute('data-href');
        if (href) window.location.href = href;
      }
      item.addEventListener('click', function (event) {
        if (event.target.closest('a, button, input, textarea, select')) return;
        go();
      });
      item.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          go();
        }
      });
    });
  }

  function createSearch(header) {
    var placeholder = header.getAttribute("data-search-placeholder") || "Найти курс, урок, тест или бренд";
    if (placeholder === "none") {
      return null;
    }

    var search = document.createElement("label");
    search.className = "search";
    search.setAttribute("aria-label", "Поиск");
    search.innerHTML = '<img src="' + portalUrl("icons/poisk.svg") + '" width="22" height="22" alt=""><input type="search">';
    search.querySelector("input").setAttribute("placeholder", placeholder);
    var inputAttr = header.getAttribute("data-search-input-attr");
    if (inputAttr) {
      search.querySelector("input").setAttribute(inputAttr, "");
    }
    return search;
  }

  function createUserOption(user, activeUserId) {
    return '<div class="user-option' + (user.id === activeUserId ? ' is-active' : '') + '" role="button" tabindex="0" data-user-option="' + user.id + '">' +
      '<span class="avatar" style="background:' + user.avatar + '">' + user.initials.slice(0, 1) + '</span>' +
      '<span class="user-option__meta">' +
        '<strong>' + user.name + '</strong>' +
        '<span>' + user.role + '</span>' +
        '<a class="user-option__cabinet" href="' + portalUrl(user.cabinetHref) + '">' + user.cabinetLabel + '</a>' +
      '</span>' +
    '</div>';
  }

  function createActions(index) {
    var panelId = "notification-panel-shared-" + index;
    var userPanelId = "user-panel-shared-" + index;
    var activeUser = getActiveUser();
    var activeUserId = activeUser.id;
    var actions = document.createElement("div");
    actions.className = "header-actions";
    actions.setAttribute("data-shared-header-actions", "");

    actions.innerHTML =
      '<div class="notification-wrap">' +
        '<button class="notification" type="button" aria-label="Уведомления" aria-expanded="false" aria-controls="' + panelId + '" data-notification-toggle>' +
          '<img src="' + portalUrl("icons/push.svg") + '" alt="">' +
        '</button>' +
        '<div class="notification-panel" id="' + panelId + '" data-notification-panel>' +
          '<div class="notification-panel__head">' +
            '<strong>Уведомления</strong>' +
            '<span class="notification-panel__count">' + notifications.length + '</span>' +
          '</div>' +
          '<div class="notification-list">' +
            notifications.map(function (item) {
              return '<button class="notification-item" type="button">' +
                '<span class="notification-item__icon">' + item.icon + '</span>' +
                '<span class="notification-item__copy"><strong>' + item.title + '</strong><span>' + item.text + '</span></span>' +
              '</button>';
            }).join("") +
          '</div>' +
          '<button class="notification-panel__foot" type="button">Посмотреть все</button>' +
        '</div>' +
      '</div>' +
      '<div class="user-switcher">' +
        '<div class="user" role="button" tabindex="0" aria-label="Выбрать пользователя" aria-expanded="false" aria-controls="' + userPanelId + '" data-user-toggle>' +
          '<div class="user__meta">' +
            '<span class="user__name" data-active-user-name>' + activeUser.name + '</span>' +
            '<span class="user__role" data-active-user-role>' + activeUser.role + '</span>' +
            '<a class="user__cabinet" href="' + portalUrl(activeUser.cabinetHref) + '" data-active-user-cabinet>' + activeUser.cabinetLabel + '</a>' +
          '</div>' +
          '<span class="avatar" data-active-user-avatar style="background:' + activeUser.avatar + '">' + activeUser.initials.slice(0, 1) + '</span>' +
        '</div>' +
        '<div class="user-panel" id="' + userPanelId + '" data-user-panel>' +
          '<div class="user-panel__title">Выбор пользователя</div>' +
          allUsers().map(function (user) { return createUserOption(user, activeUserId); }).join("") +
        '</div>' +
      '</div>';

    return actions;
  }

  function bindNotifications(root) {
    var toggle = root.querySelector("[data-notification-toggle]");
    var panel = root.querySelector("[data-notification-panel]");

    if (!toggle || !panel) {
      return;
    }

    function closePanel() {
      panel.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function (event) {
      event.stopPropagation();
      var isOpen = panel.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    panel.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    document.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePanel();
      }
    });
  }

  function renderUserSwitchers() {
    var activeUser = getActiveUser();
    document.querySelectorAll("[data-shared-header-actions]").forEach(function (actions) {
      var panel = actions.querySelector("[data-user-panel]");
      if (panel) {
        var activeUserId = activeUser.id;
        var title = panel.querySelector(".user-panel__title");
        panel.innerHTML = (title ? title.outerHTML : '<div class="user-panel__title">Выбор пользователя</div>') +
          allUsers().map(function (user) { return createUserOption(user, activeUserId); }).join("");
      }
      var name = actions.querySelector("[data-active-user-name]");
      var role = actions.querySelector("[data-active-user-role]");
      var cabinet = actions.querySelector("[data-active-user-cabinet]");
      var avatar = actions.querySelector("[data-active-user-avatar]");
      if (name) name.textContent = activeUser.name;
      if (role) role.textContent = activeUser.role;
      if (cabinet) {
        cabinet.textContent = activeUser.cabinetLabel;
        cabinet.setAttribute("href", portalUrl(activeUser.cabinetHref));
      }
      if (avatar) {
        avatar.textContent = activeUser.initials.slice(0, 1);
        avatar.style.background = activeUser.avatar;
      }
      actions.querySelectorAll("[data-user-option]").forEach(function (option) {
        option.classList.toggle("is-active", option.getAttribute("data-user-option") === activeUser.id);
      });
    });
  }

  function bindUserSwitcher(root) {
    var toggle = root.querySelector("[data-user-toggle]");
    var panel = root.querySelector("[data-user-panel]");

    if (!toggle || !panel) {
      return;
    }

    function closePanel() {
      panel.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function openPanel() {
      panel.classList.add("is-open");
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function togglePanel() {
      if (panel.classList.contains("is-open")) {
        closePanel();
      } else {
        openPanel();
      }
    }

    toggle.addEventListener("click", function (event) {
      if (event.target.closest("a")) return;
      event.stopPropagation();
      togglePanel();
    });

    toggle.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePanel();
      }
    });

    panel.addEventListener("click", function (event) {
      var option = event.target.closest("[data-user-option]");
      if (!option || event.target.closest("a")) {
        event.stopPropagation();
        return;
      }
      event.stopPropagation();
      setActiveUser(option.getAttribute("data-user-option"));
      renderUserSwitchers();
      closePanel();
    });

    panel.addEventListener("keydown", function (event) {
      var option = event.target.closest("[data-user-option]");
      if (event.target.closest("a")) return;
      if (!option || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      setActiveUser(option.getAttribute("data-user-option"));
      renderUserSwitchers();
      closePanel();
    });

    document.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closePanel();
      }
    });
  }

  function normalizeHeader(header, index) {
    if (!header.querySelector(".wordmark")) {
      header.insertBefore(createWordmark(), header.firstChild);
    }

    if (!header.querySelector(".search")) {
      var search = createSearch(header);
      if (search) {
        var wordmark = header.querySelector(".wordmark");
        wordmark.insertAdjacentElement("afterend", search);
      }
    }

    header.querySelectorAll(".header-actions, .profile").forEach(function (node) {
      node.remove();
    });

    var actions = createActions(index);
    header.appendChild(actions);
    bindNotifications(actions);
    bindUserSwitcher(actions);
  }

  function initSharedHeader() {
    injectUniversalMenuStyles();
    document.querySelectorAll(".sidebar").forEach(normalizeSidebar);
    document.querySelectorAll(".header").forEach(normalizeHeader);
    bindUniversalNav();
    bindGenericHrefs();
    renderNavigationCabinetLinks();
    renderStudentBindings();
    renderFavoriteBindings();
    renderUserSwitchers();
  }

  function renderStudentBindings() {
    var state = getState();
    var summary = getSummary(state);
    var values = {
      activeCourses: summary.activeCourses,
      completedCourses: summary.completedCourses,
      passedTests: summary.passedTests,
      failedTests: summary.failedTests,
      certs: summary.certs,
      avgProgress: summary.avgProgress,
      xp: summary.xp,
      nextLevelXp: summary.nextLevelXp,
      level: summary.level
    };

    document.querySelectorAll("[data-student-value]").forEach(function (node) {
      var key = node.getAttribute("data-student-value");
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        node.textContent = values[key];
      }
    });

    document.querySelectorAll("[data-student-progress]").forEach(function (node) {
      node.style.width = summary.avgProgress + "%";
    });
  }

  function favoriteItemFromButton(button) {
    return {
      id: button.getAttribute("data-favorite-id"),
      title: button.getAttribute("data-favorite-title"),
      type: button.getAttribute("data-favorite-type"),
      url: button.getAttribute("data-favorite-url"),
      description: button.getAttribute("data-favorite-description")
    };
  }

  function renderFavoriteMenuCount() {
    var count = getFavorites().length;
    document.querySelectorAll("[data-menu-key='favorites']").forEach(function (item) {
      item.setAttribute("data-tooltip", count ? "избранное: " + count : "избранное");
    });
    document.querySelectorAll("[data-favorites-count]").forEach(function (badge) {
      badge.hidden = count === 0;
      badge.textContent = count > 9 ? "9+" : String(count);
    });
  }

  function renderFavoriteButtons() {
    document.querySelectorAll("[data-favorite-toggle]").forEach(function (button) {
      var activeUser = getActiveUser();
      var supplierAccount = activeUser.id === "supplier" || activeUser.type === "supplier";
      button.hidden = supplierAccount;
      button.setAttribute("aria-hidden", String(supplierAccount));
      if (supplierAccount) return;
      var item = favoriteItemFromButton(button);
      var active = isFavorite(item.id);
      button.classList.toggle("is-favorite", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", (active ? "Убрать " : "Добавить ") + item.title + (active ? " из избранного" : " в избранное"));
      if (!button.querySelector("img, svg")) {
        button.textContent = active ? "В избранном" : "В избранное";
      }

      if (button.dataset.favoriteBound === "1") return;
      button.dataset.favoriteBound = "1";
      button.addEventListener("click", function () {
        toggleFavorite(favoriteItemFromButton(button));
      });
    });
  }

  function renderFavoriteBindings() {
    renderFavoriteMenuCount();
    renderFavoriteButtons();
  }

  function injectModuleButtonTheme() {
    if (document.getElementById("ts-module-button-theme")) return;
    var style = document.createElement("style");
    style.id = "ts-module-button-theme";
    style.textContent = [
      ".lesson-actions .btn,.quiz-modal__foot .btn{",
      "min-height:34px!important;padding:8px 13px!important;border-radius:12px!important;",
      "border:1px solid rgba(10,132,255,.22)!important;background:#eef5ff!important;color:#0a84ff!important;",
      "box-shadow:none!important;font-size:13px!important;font-weight:900!important;line-height:1.1!important;letter-spacing:0!important;",
      "transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,transform .18s ease!important;",
      "}",
      ".lesson-actions .btn[hidden],.quiz-modal__foot .btn[hidden]{display:none!important;}",
      ".lesson-actions .btn:hover,.quiz-modal__foot .btn:hover{",
      "background:#f6faff!important;border-color:rgba(10,132,255,.38)!important;box-shadow:0 8px 22px rgba(10,132,255,.12)!important;transform:translateY(-1px)!important;",
      "}",
      ".lesson-actions .btn:active,.quiz-modal__foot .btn:active{transform:translateY(0)!important;box-shadow:none!important;}",
      ".lesson-actions .btn.secondary,.quiz-modal__foot .btn.secondary{background:#f3f7ff!important;color:#0a84ff!important;border-color:rgba(10,132,255,.18)!important;}",
      ".lesson-actions .btn[disabled],.quiz-modal__foot .btn[disabled],.lesson-actions .btn[aria-disabled='true'],.quiz-modal__foot .btn[aria-disabled='true']{",
      "opacity:.48!important;cursor:not-allowed!important;transform:none!important;box-shadow:none!important;",
      "}",
      ".lesson-actions .btn.danger,.quiz-modal__foot .btn.danger,.lesson-actions .danger.btn,.quiz-modal__foot .danger.btn{",
      "background:#fff5f5!important;border-color:#ffcaca!important;color:#d22121!important;",
      "}",
      ".lesson-actions .btn.danger:hover,.quiz-modal__foot .btn.danger:hover,.lesson-actions .danger.btn:hover,.quiz-modal__foot .danger.btn:hover{",
      "background:#fffafa!important;border-color:#ffaaaa!important;box-shadow:0 8px 22px rgba(210,33,33,.1)!important;",
      "}",
      "@media(max-width:640px){.lesson-actions .btn,.quiz-modal__foot .btn{min-height:36px!important;padding:8px 12px!important;font-size:12px!important;}}"
    ].join("");
    document.head.appendChild(style);
  }

  var sharedHeaderInitialized = false;

  function bootSharedHeader() {
    if (sharedHeaderInitialized) return;
    sharedHeaderInitialized = true;
    initSharedHeader();
    injectModuleButtonTheme();
    autoRecordSessionActivity();
  }

  function autoRecordSessionActivity() {
    var page = currentPageName();
    var state = getState();
    var today = dateKey();
    if (!hasXpEvent(state, { eventType: "daily_login", entityId: "daily_login", milestone: today })) {
      recordActivity("daily_login", { entityId: "daily_login", label: "Вход в Академию" });
    }
    if (/^lesson-/.test(page) && !/-test\.html$/.test(page)) {
      var lessonId = page.replace(/\.html$/, "");
      if (!hasXpEvent(getState(), { eventType: "lesson_opened", entityId: lessonId, milestone: today })) {
        recordActivity("lesson_opened", { lessonId: lessonId, entityId: lessonId, courseId: lessonId.split("-").slice(0, 2).join("-"), label: "Открыт урок" });
      }
    }
  }

  if (document.readyState === "loading" && !document.querySelector(".header, .sidebar")) {
    document.addEventListener("DOMContentLoaded", bootSharedHeader);
  } else {
    bootSharedHeader();
  }

  window.addEventListener("scroll", function () {
    if (activeTooltipButton) positionMenuTooltip(activeTooltipButton);
  }, true);
  window.addEventListener("resize", hideMenuTooltip);
  window.addEventListener("ts-academy-state-change", renderStudentBindings);
  window.addEventListener("ts-academy-favorites-change", renderFavoriteBindings);
  window.addEventListener("ts-academy-admin-accounts-change", renderUserSwitchers);
  window.addEventListener("ts-academy-user-change", function () {
    document.querySelectorAll("[data-shared-sidebar]").forEach(normalizeSidebar);
    bindUniversalNav();
    renderFavoriteBindings();
    renderUserSwitchers();
    renderNavigationCabinetLinks();
  });
})();
