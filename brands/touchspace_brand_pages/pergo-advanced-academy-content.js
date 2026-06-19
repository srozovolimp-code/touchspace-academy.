(function () {
  var manifest = window.PergoAdvancedCourseManifest;
  var grid = document.querySelector(".course-grid");
  if (!manifest || !grid) return;

  var art = ["art-blue", "art-mint", "art-violet", "art-blue", "art-mint", "art-violet", "art-blue"];
  var icons = ["../../icons/5.png", "../../icons/7.png", "../../icons/8.png", "../../icons/9.png", "../../icons/10.png", "../../icons/11.png", "../../icons/12.png"];

  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function card(item, index) {
    var id = item.идентификатор;
    var href = item.url;
    var title = item.название;
    var desc = item.описание;
    var badge = item.количество_разделов + " страницы";
    return '<article class="course-card is-link" data-href="' + esc(href) + '">' +
      '<div class="course-card__image ' + art[index % art.length] + '" data-badge="' + esc(badge) + '">' +
      '<div class="course-card__tools">' +
      '<button class="course-action course-action--favorite" type="button" data-favorite-toggle data-favorite-id="academy-pergo-advanced-course-' + esc(id) + '" data-favorite-title="' + esc(title) + '" data-favorite-type="Курс академии" data-favorite-url="brands/touchspace_brand_pages/' + esc(href) + '" data-favorite-description="' + esc(desc) + '" aria-label="Добавить ' + esc(title) + ' в избранное" aria-pressed="false"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>' +
      '</div><img src="' + icons[index % icons.length] + '" alt=""></div>' +
      '<div class="course-card__body"><span class="course-status course-status--new">Новый курс</span>' +
      '<span class="badge">Модуль ' + item.порядковый_номер + '</span><h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p>' +
      '<div class="course-progress" style="--progress:0%"><span></span></div>' +
      '<div class="course-card__foot"><span class="level">' + esc(item.уровень) + '</span><span>' + item.продолжительность_минут + ' мин</span></div></div></article>';
  }

  function finalCard(finalItem) {
    return '<article class="course-card is-link" data-href="' + esc(finalItem.url) + '">' +
      '<div class="course-card__image art-cream" data-badge="28 вопросов"><div class="course-card__tools">' +
      '<button class="course-action course-action--favorite" type="button" data-favorite-toggle data-favorite-id="academy-pergo-advanced-final-test" data-favorite-title="' + esc(finalItem.название) + '" data-favorite-type="Тест академии" data-favorite-url="brands/touchspace_brand_pages/' + esc(finalItem.url) + '" data-favorite-description="Итоговая проверка по всем семи блокам Pergo Advanced." aria-label="Добавить итоговый тест в избранное" aria-pressed="false"><img class="favorite-icon" src="../../icons/favorites.svg" alt="" aria-hidden="true"></button>' +
      '</div><img src="../../icons/10.png" alt=""></div>' +
      '<div class="course-card__body"><span class="course-status course-status--new">Итоговый тест</span>' +
      '<span class="badge">Финал</span><h3>' + esc(finalItem.название) + '</h3>' +
      '<p>Проверка по истории бренда, конструкции, технологиям, ассортименту, визуальному подбору, продаже, монтажу и гарантии.</p>' +
      '<div class="course-progress" style="--progress:0%"><span></span></div>' +
      '<div class="course-card__foot"><span class="level">Итоговый</span><span>30–40 мин</span></div></div></article>';
  }

  grid.innerHTML = manifest.модули.map(card).join("") + finalCard(manifest.итоговый_тест);
  var count = document.querySelector(".course-count");
  if (count) count.textContent = "0 из " + (manifest.модули.length + 1) + " завершено";

  if (window.TouchSpaceHeader && typeof window.TouchSpaceHeader.refreshFavorites === "function") {
    window.TouchSpaceHeader.refreshFavorites();
  }
})();
