(function () {
  'use strict';

  var pairs = [
    ['Pergo Advanced', 'Pergo'],
    ['Coswick advanced', 'Coswick'],
    ['Alpine Floor Advanced', 'Alpine Floor']
  ];

  function findCard(title) {
    return Array.prototype.slice.call(document.querySelectorAll('[data-brand-href]')).find(function (card) {
      var heading = card.querySelector('h3');
      return heading && heading.textContent.trim() === title;
    });
  }

  function copyCardDetails(target, source) {
    if (!target || !source) return;

    var sourceMetric = source.querySelector('.metric');
    var targetMetric = target.querySelector('.metric');
    var sourceSummary = source.querySelector('p');
    var targetSummary = target.querySelector('p');
    var sourceCategories = source.querySelector('.pills');
    var targetCategories = target.querySelector('.pills');
    var sourceFoot = source.querySelector('.card-foot');
    var targetFoot = target.querySelector('.card-foot');

    if (sourceMetric && targetMetric) targetMetric.innerHTML = sourceMetric.innerHTML;
    if (sourceSummary && targetSummary) targetSummary.innerHTML = sourceSummary.innerHTML;
    if (sourceCategories && targetCategories) targetCategories.innerHTML = sourceCategories.innerHTML;

    if (sourceFoot && targetFoot) {
      var favorite = targetFoot.querySelector('.brand-favorite');
      var cloned = sourceFoot.cloneNode(true);
      var clonedFavorite = cloned.querySelector('.brand-favorite');
      if (clonedFavorite) clonedFavorite.remove();
      targetFoot.innerHTML = cloned.innerHTML;
      if (favorite) targetFoot.appendChild(favorite);
    }

    target.setAttribute('data-advanced-card-synced', 'true');
  }

  function syncAdvancedCards() {
    pairs.forEach(function (pair) {
      var target = findCard(pair[0]);
      var source = findCard(pair[1]);
      if (!target || !source) return;
      if (target.getAttribute('data-advanced-card-synced') === 'true') return;
      copyCardDetails(target, source);
    });
  }

  function start() {
    if (!/brands\.html$/.test(window.location.pathname) && !document.querySelector('[data-brand-grid]')) return;
    syncAdvancedCards();
    var root = document.querySelector('[data-brand-grid]') || document.body;
    var observer = new MutationObserver(function () { syncAdvancedCards(); });
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
