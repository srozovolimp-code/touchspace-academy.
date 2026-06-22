(function () {
  function addClass(node, name) {
    if (node && !node.classList.contains(name)) node.classList.add(name);
  }

  function patch(root) {
    if (!root) return;
    addClass(root, 'coswick-standardized');
    addClass(root.querySelector('.academy-topline'), 'topline');
    addClass(root.querySelector('.quiz-modal__head .icon-btn'), 'quiz-close');

    root.querySelectorAll('.academy-tab').forEach(function (tab) {
      addClass(tab, 'lesson-tab');
      var number = tab.querySelector('.academy-tab__num');
      var title = tab.querySelector('.academy-tab__title');
      var meta = tab.querySelector('.academy-tab__meta');
      addClass(number, 'tab-num');
      addClass(title, 'tab-title');
      addClass(meta, 'tab-meta');
      var check = tab.lastElementChild;
      addClass(check, 'tab-check');
      if ((meta && meta.textContent.trim() === 'пройдено') || (check && check.textContent.trim() === '✓')) {
        addClass(tab, 'is-done');
      }
    });

    root.querySelectorAll('.academy-content-section').forEach(function (section) {
      addClass(section, 'block');
    });

    root.querySelectorAll('.academy-algorithm').forEach(function (list) {
      if (!list.classList.contains('coswick-timeline')) addClass(list, 'coswick-formula');
    });
  }

  function start(selector) {
    var root = document.querySelector(selector);
    if (!root) return;
    patch(root);
    new MutationObserver(function () { patch(root); }).observe(root, { childList: true, subtree: true });
  }

  start('[data-academy-module-root]');
  start('[data-academy-final-root]');
})();
