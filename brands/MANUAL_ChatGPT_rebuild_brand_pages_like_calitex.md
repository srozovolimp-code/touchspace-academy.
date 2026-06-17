# Мануал для ChatGPT: пересборка страниц брендов в стиле TouchSpace

Задача: переделать HTML-страницы брендов так, чтобы они выглядели и работали как рабочая страница `calitex-test.html` в корне проекта TouchSpace Academy.

Главное: не делать изолированные страницы без меню. Каждая страница бренда должна быть частью портала: с левым меню, общей шапкой, поиском, хлебными крошками, кнопкой назад, hero-блоком, кнопками переходов и встроенным учебным модулем/тестом.

## Канонический пример

Рабочий пример, который нужно брать за основу:

```text
calitex-test.html
```

Эту страницу считать эталоном по структуре:

- подключает общие стили портала;
- имеет левое меню через пустой `<aside class="sidebar"></aside>`;
- имеет шапку через пустой `<header class="header"></header>`;
- подключает `shared-header.js`, который сам наполняет меню и шапку;
- содержит breadcrumb и кнопку возврата в каталог;
- содержит hero-блок бренда;
- содержит логотип бренда;
- содержит быстрые кнопки;
- содержит блок с iframe учебного модуля;
- адаптирована под мобильную версию.

## Обязательная структура страницы

Каждая новая страница бренда должна иметь такую базовую структуру:

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>НАЗВАНИЕ БРЕНДА | TouchSpace Академия</title>
  <link rel="stylesheet" href="shared-header.css">
  <link rel="stylesheet" href="mobile-responsive.css">
  <style>
    /* Использовать CSS-структуру из calitex-test.html:
       .page, .shell, .sidebar, .header, .brand-top,
       .hero, .hero-main, .hero-side, .badge, .logo-card,
       .btn, .scorm-card, .scorm-toolbar, .scorm-frame,
       media queries.
    */
  </style>
</head>
<body>
  <div class="page">
    <div class="shell">
      <aside class="sidebar" aria-label="Навигация"></aside>
      <main class="main">
        <header class="header" data-search-placeholder="Поиск по странице НАЗВАНИЕ БРЕНДА"></header>

        <div class="brand-top">
          <nav class="breadcrumb" aria-label="Хлебные крошки">
            <a href="brands.html">Бренды</a>
            <span>/</span>
            <span>НАЗВАНИЕ БРЕНДА</span>
          </nav>
          <a class="back-link" href="brands.html">Назад к брендам</a>
        </div>

        <section class="hero" aria-label="НАЗВАНИЕ БРЕНДА">
          <div class="hero-main">
            <div class="hero-row">
              <span class="badge">Академия бренда НАЗВАНИЕ БРЕНДА</span>
              <span class="logo-card">
                <img alt="НАЗВАНИЕ БРЕНДА" src="ПУТЬ_К_ЛОГОТИПУ">
              </span>
            </div>
            <h1>НАЗВАНИЕ БРЕНДА</h1>
            <p>Короткое описание бренда, чему учит страница и зачем реселлеру проходить материал.</p>
            <div class="hero-actions">
              <a class="btn" href="#scorm-module">Открыть модуль</a>
              <a class="btn ghost" href="brands.html">Каталог брендов</a>
              <a class="btn ghost" href="ПУТЬ_К_ТЕСТУ">Итоговый тест</a>
            </div>
          </div>

          <aside class="hero-side">
            <h2>Что внутри</h2>
            <ul class="meta-list">
              <li><b>1</b><span>Ключевая информация о бренде</span></li>
              <li><b>2</b><span>Ассортимент, коллекции и продуктовые аргументы</span></li>
              <li><b>3</b><span>Сценарии консультации и итоговая проверка</span></li>
            </ul>
          </aside>
        </section>

        <section class="scorm-card" id="scorm-module" aria-label="Учебный модуль НАЗВАНИЕ БРЕНДА">
          <div class="scorm-toolbar">
            <div>
              <h2>Учебный модуль НАЗВАНИЕ БРЕНДА</h2>
              <p>Материал открывается внутри портала; для полного экрана используйте отдельную вкладку.</p>
            </div>
            <a class="btn ghost" href="ПУТЬ_К_МОДУЛЮ" target="_blank" rel="noopener">Открыть отдельно</a>
          </div>
          <iframe class="scorm-frame" src="ПУТЬ_К_МОДУЛЮ" title="Учебный модуль НАЗВАНИЕ БРЕНДА"></iframe>
        </section>
      </main>
    </div>
  </div>

  <script src="shared-header.js"></script>
</body>
</html>
```

## Если страница лежит в подпапке

Если брендовая страница находится не в корне проекта, а, например, здесь:

```text
brands/touchspace_brand_pages/calitex-test.html
```

то пути к общим файлам нужно поднять на два уровня:

```html
<link rel="stylesheet" href="../../shared-header.css">
<link rel="stylesheet" href="../../mobile-responsive.css">
<script src="../../shared-header.js"></script>
<a href="../../brands.html">Бренды</a>
<a href="../../brands.html">Назад к брендам</a>
```

Локальные файлы внутри самой папки брендов можно оставлять относительными:

```html
<img src="images/brand-logos/calitex.svg" alt="Calitex">
<iframe src="scorm/calitex/index.html"></iframe>
```

## Что нельзя удалять

Нельзя удалять эти элементы:

```html
<aside class="sidebar" aria-label="Навигация"></aside>
<header class="header" data-search-placeholder="..."></header>
<script src="shared-header.js"></script>
```

Или, если страница лежит в подпапке:

```html
<script src="../../shared-header.js"></script>
```

Без этих элементов пропадут меню, шапка, поиск, профиль, иконки и поведение портала.

## Что обязательно должно быть на странице бренда

1. Левое меню портала.
2. Общая шапка портала.
3. Поиск в шапке с placeholder под конкретный бренд.
4. Хлебные крошки:

```text
Бренды / Название бренда
```

5. Кнопка `Назад к брендам`.
6. Hero-блок:

- бейдж `Академия бренда ...`;
- логотип бренда;
- H1 с названием бренда;
- короткое описание;
- кнопки `Открыть модуль`, `Каталог брендов`, `Итоговый тест`.

7. Блок `Что внутри` на 3-5 пунктов.
8. Учебный модуль в iframe или обычный HTML-блок, если модуль переносится без iframe.
9. Кнопка `Открыть отдельно`, если используется iframe.
10. Мобильная адаптация.

## Визуальный стиль

Использовать стиль `calitex-test.html`:

- светлый фон с легким голубым оттенком;
- белые полупрозрачные карточки;
- скругления 20-36 px;
- синий брендовый цвет `#0a84ff`;
- мягкие тени;
- компактные кнопки;
- логотип в белой карточке;
- без черных тяжелых блоков;
- без изолированного дизайна, который не похож на портал.

Цветовые переменные:

```css
:root {
  --blue:#0a84ff;
  --ink:#111827;
  --muted:#6b7280;
  --line:#dfe6f2;
  --page:#eef4ff;
  --shadow:0 24px 80px rgba(24,45,90,.12);
  --shadow-soft:0 14px 38px rgba(24,45,90,.08);
  --max:1500px;
}
```

## Как подключать страницу к каталогу brands.html

В `brands.html` есть объект `brandPages`. Он отвечает за переход с карточки бренда на страницу бренда.

Пример:

```js
var brandPages = {
  'Calitex': 'calitex-test.html',
  'Pergo': 'pergo-test.html'
};
```

Если страницы лежат в подпапке:

```js
var brandPages = {
  'Calitex': 'brands/touchspace_brand_pages/calitex-test.html',
  'Pergo': 'brands/touchspace_brand_pages/pergo-test.html'
};
```

Название ключа должно точно совпадать с названием бренда в каталоге.

## Промпт для ChatGPT

Скопируй этот промпт и передай вместе с файлом `calitex-test.html`:

```text
Ты работаешь с сайтом TouchSpace Academy. Нужно переделать страницы брендов под стиль и структуру рабочей страницы calitex-test.html.

Не делай изолированные лендинги. Каждая страница бренда должна быть частью портала.

Обязательно сохрани:
- левое меню через <aside class="sidebar" aria-label="Навигация"></aside>;
- общую шапку через <header class="header" data-search-placeholder="..."></header>;
- подключение shared-header.css;
- подключение mobile-responsive.css;
- подключение shared-header.js;
- хлебные крошки;
- кнопку "Назад к брендам";
- hero-блок с бейджем, логотипом, h1, описанием и кнопками;
- блок "Что внутри";
- учебный модуль или перенесенный обучающий контент;
- кнопку "Итоговый тест";
- мобильную адаптацию.

Рабочую страницу calitex-test.html используй как канонический шаблон по HTML, CSS, сетке, меню, шапке, кнопкам и поведению.

Если новая страница лежит в подпапке brands/touchspace_brand_pages, исправь пути:
shared-header.css -> ../../shared-header.css
mobile-responsive.css -> ../../mobile-responsive.css
shared-header.js -> ../../shared-header.js
brands.html -> ../../brands.html

Для каждого бренда замени только брендовые данные:
- title;
- название бренда в h1;
- alt логотипа;
- путь к логотипу;
- описание;
- пункты "Что внутри";
- путь к учебному модулю;
- путь к итоговому тесту.

Не удаляй общую оболочку портала. Не заменяй ее самостоятельным меню. Не делай тяжелые черные блоки. Визуально ориентируйся на светлый стиль TouchSpace: белые карточки, голубой фон, синий #0a84ff, мягкие тени, скругления.

После генерации проверь:
1. Есть ли меню слева.
2. Есть ли шапка.
3. Работает ли ссылка "Назад к брендам".
4. Работает ли переход из brands.html.
5. Открывается ли модуль.
6. Открывается ли итоговый тест.
7. Не сломалась ли мобильная версия.
```

## Чек-лист приемки

Перед тем как отдавать готовые страницы, проверить:

- в HTML есть `.sidebar`;
- в HTML есть `.header`;
- подключен `shared-header.js`;
- подключены `shared-header.css` и `mobile-responsive.css`;
- путь к `brands.html` правильный с учетом папки;
- логотип открывается;
- iframe или учебный блок открывается;
- кнопка итогового теста не пустая;
- карточка бренда в `brands.html` ведет на нужный файл;
- страница не выглядит отдельно от портала.
