(function () {
  var manifest = window.PolarwoodAdvancedCourseManifest;
  var raw = window.PolarwoodAdvancedFinalTestData;
  var stage = document.querySelector("[data-final-stage]");
  if (!manifest || !raw || !stage) return;
  var testMeta = raw.метаданные.тест;
  var storageKey = manifest.итоговый_тест.storage_key;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g,function (char) {
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char];
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
  function readState(key) { try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) { return {}; } }
  function modulePassed(record) {
    var state = readState(record.storage_key);
    return !!(state.finalTest && state.finalTest.passed);
  }
  function allModulesPassed() { return manifest.модули.every(modulePassed); }
  function loadResult() { return readState(storageKey); }
  function saveResult(state) {
    localStorage.setItem(storageKey,JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("touchspace-course-progress-change",{detail:{course:"polarwood-advanced",final:true}}));
  }
  function normalize(question) {
    var correct = question.правильный_ответ ? question.правильный_ответ.значение : [];
    if (!Array.isArray(correct)) correct = [correct];
    return {
      type: question.тип_вопроса,
      text: question.текст_вопроса || "",
      options: (question.варианты_ответа || question.элементы_для_упорядочивания || []).map(function (item) { return [String(item.идентификатор),String(item.текст || "")]; }),
      correct: correct.map(String),
      explanation: question.пояснение || ""
    };
  }
  function renderSidebar() {
    var done = manifest.модули.filter(modulePassed).length;
    var percent = Math.round(done / manifest.модули.length * 100);
    document.querySelector("[data-final-progress-label]").textContent = "Пройдено " + done + " из " + manifest.модули.length + " модулей";
    document.querySelector("[data-final-progress-percent]").textContent = percent + "%";
    document.querySelector("[data-final-progress-bar]").style.width = percent + "%";
    var items = manifest.модули.map(function (record,index) {
      var passed = modulePassed(record);
      return '<div class="module-status-item' + (passed ? " is-done" : "") + '"><b>' + (index+1) + '</b><span>' + esc(record.название) + '</span><span>' + (passed ? "✓" : "—") + "</span></div>";
    }).join("");
    var final = loadResult();
    items += '<div class="module-status-item' + (final.passed ? " is-done" : "") + '"><b>★</b><span>Итоговый тест</span><span>' + (final.passed ? "✓" : "—") + "</span></div>";
    document.querySelector("[data-final-module-list]").innerHTML = '<div class="module-status-list">' + items + "</div>";
  }
  function questionHtml(rawQuestion,index) {
    var q = normalize(rawQuestion);
    if (q.type === "верно_неверно") {
      return '<div class="final-test-question" data-final-question="' + index + '"><strong>' + (index+1) + ". " + esc(q.text) + '</strong><label><input type="radio" name="fq' + index + '" value="true"> Верно</label><label><input type="radio" name="fq' + index + '" value="false"> Неверно</label></div>';
    }
    if (q.type === "последовательность") {
      var opts = '<option value="">Выберите этап</option>' + q.options.map(function (option) { return '<option value="' + esc(option[0]) + '">' + esc(option[1]) + "</option>"; }).join("");
      return '<div class="final-test-question" data-final-question="' + index + '"><strong>' + (index+1) + ". " + esc(q.text) + '</strong><div class="sequence-list">' + q.correct.map(function (_,position) { return '<label class="sequence-row"><b>' + (position+1) + '</b><select name="fq' + index + 'seq">' + opts + "</select></label>"; }).join("") + "</div></div>";
    }
    var type = q.type === "несколько_ответов" ? "checkbox" : "radio";
    return '<div class="final-test-question" data-final-question="' + index + '"><strong>' + (index+1) + ". " + esc(q.text) + "</strong>" + q.options.map(function (option) { return '<label><input type="' + type + '" name="fq' + index + '" value="' + esc(option[0]) + '"> ' + esc(option[1]) + "</label>"; }).join("") + "</div>";
  }
  function renderLocked() {
    stage.innerHTML = '<article class="lesson-slide is-active"><span class="lesson-kicker">Итог курса</span><h2 class="lesson-title">Итоговый тест Polarwood Advanced</h2><p class="lesson-lead">Финальная проверка открывается после успешного прохождения итоговых тестов всех семи модулей.</p><div class="blocks"><div class="block coswick-callout">Сейчас тест закрыт. Вернитесь в академию и завершите оставшиеся модули.</div></div><div class="lesson-actions"><a class="btn" href="polarwood-advanced-academy.html">К модулям академии</a></div></article>';
  }
  function renderTest() {
    var result = loadResult();
    stage.innerHTML = '<article class="lesson-slide is-active"><span class="lesson-kicker">Итог курса</span><h2 class="lesson-title">' + esc(testMeta.название) + '</h2><p class="lesson-lead">' + esc(testMeta.описание) + '</p>' +
      (result.passed ? '<div class="final-score-card"><h3>Курс уже пройден</h3><p>Лучший подтверждённый результат: ' + Number(result.bestScore || result.lastScore || 0) + '%. Тест можно пройти повторно.</p></div>' : '') +
      '<div class="final-test-grid">' + raw.вопросы.map(questionHtml).join("") + '</div>' +
      '<div class="feedback" data-final-feedback></div><div class="lesson-actions"><div class="lesson-actions__row"><button class="btn" type="button" data-check-final>Проверить итоговый тест</button><a class="btn secondary" href="polarwood-advanced-academy.html">Вернуться в академию</a><span class="result" data-final-result>Для зачёта нужно не менее ' + Number(testMeta.проходной_балл_процентов) + '%.</span></div></div></article>';
  }
  function values(index,type) {
    if (type === "последовательность") return Array.prototype.slice.call(document.querySelectorAll('[name="fq' + index + 'seq"]')).map(function (select) { return select.value; });
    return Array.prototype.slice.call(document.querySelectorAll('[name="fq' + index + '"]:checked')).map(function (input) { return input.value; }).sort();
  }
  function check() {
    var correct = 0, messages = [];
    raw.вопросы.forEach(function (rawQuestion,index) {
      var q = normalize(rawQuestion), selected = values(index,q.type), expected = q.correct.slice(), ok;
      if (q.type === "последовательность") ok = selected.join("|") === expected.join("|");
      else ok = selected.sort().join("|") === expected.sort().join("|");
      var node = document.querySelector('[data-final-question="' + index + '"]');
      if (node) { node.classList.toggle("is-correct",ok); node.classList.toggle("is-wrong",!ok); }
      if (ok) correct += 1; else messages.push((index+1) + ". " + q.explanation);
    });
    var score = Math.round(correct / raw.вопросы.length * 100);
    var passed = score >= Number(testMeta.проходной_балл_процентов || 85);
    var state = loadResult();
    state.attempts = (state.attempts || 0)+1;
    state.lastScore = score;
    state.bestScore = Math.max(Number(state.bestScore || 0),score);
    state.passed = !!(state.passed || passed);
    state.lastAttemptAt = new Date().toISOString();
    saveResult(state);
    var result = document.querySelector("[data-final-result]");
    result.className = "result " + (passed ? "good" : "bad");
    result.textContent = score + "%. " + (passed ? "Курс Polarwood Advanced успешно пройден." : "Проходной результат не достигнут. Проверьте пояснения и повторите попытку.");
    document.querySelector("[data-final-feedback]").innerHTML = passed ? "" : messages.map(function (message) { return "<div>" + esc(message) + "</div>"; }).join("");
    renderSidebar();
    window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
  }
  renderSidebar();
  if (allModulesPassed() || canBypass()) renderTest(); else renderLocked();
  document.addEventListener("click",function (event) {
    var button = event.target.closest("[data-check-final]");
    if (button) { event.preventDefault(); check(); }
  });
})();