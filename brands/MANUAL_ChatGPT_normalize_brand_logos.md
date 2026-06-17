# Промпт для ChatGPT: нормализация логотипов брендов TouchSpace

Задача: нормализовать логотипы из папки `logos` для использования в каталоге брендов `brands.html` и внутри HTML-страниц брендов в `brands/touchspace_brand_pages`.

Логотипы сейчас разного размера, формата и пропорций. Нужно привести их к единому аккуратному виду, чтобы они одинаково хорошо смотрелись:

- на карточках брендов в каталоге;
- в блоке логотипа внутри брендовой страницы;
- на светлом фоне;
- в маленьком размере;
- без прилипания к нижнему/верхнему краю;
- без белых квадратов вокруг логотипа.

## Исходная папка

```text
logos/
```

Текущие файлы:

```text
Alpine floor.png
alta step.png
coswick.jpg
Ensten.jpg
ensten.png
Kahrs.webp
Karelia.webp
NatisSton.jpg
Norland.webp
Orac Decor.png
Polarwood.png
Royal Parket.webp
Tulesna.webp
Unilin.jpg
WoodRock.png
tarkett.png
техномассив.jpg
```

Если есть два файла одного бренда, например `Ensten.jpg` и `ensten.png`, выбрать более качественный вариант по четкости, контрасту и отсутствию фона.

## Целевые папки

Готовые логотипы нужно сохранить в двух местах:

```text
images/brand-logos/
brands/touchspace_brand_pages/images/brand-logos/
```

Для страниц брендов в `brands/touchspace_brand_pages` использовать lowercase-slug имена:

```text
alpine-floor.png
alta-step.png
coswick.png
ensten.png
kahrs.png
karelia.png
natisston.png
norland.png
orac-decor.png
polarwood.png
royal-parket.png
tulesna.png
unilin.png
woodrock.png
tehnomassiv.png
tarkett.png
```

Для общего каталога `images/brand-logos` можно дополнительно сохранить совместимые имена, если они уже используются в коде:

```text
Alpine_Floor.png
Alta_Step.png
Coswick.png
Ensten.png
Kahrs.png
Karelia.png
NatisSton.png
Norland.png
Orac_Decor.png
Polarwood.png
Royal_Parket.png
Tulesna.png
Unilin.png
WoodRock.png
Tehnomassiv.png
Tarkett.png
```

## Требования к изображению

Сделать единый мастер-формат:

```text
PNG
прозрачный фон
512 × 256 px
цветовой профиль sRGB
```

Важно:

- фон должен быть прозрачным, не белым;
- если исходник на белом фоне, удалить белый фон аккуратно;
- не обрезать буквы;
- не искажать пропорции логотипа;
- не растягивать по ширине или высоте;
- не добавлять декоративные рамки, тени, подложки или новые цвета;
- сохранить оригинальную айдентику бренда;
- логотип должен быть оптически центрирован по горизонтали и вертикали;
- вокруг логотипа должен быть safe area.

## Safe Area

Разместить логотип внутри холста `512 × 256 px` так:

- максимальная ширина логотипа: `380 px`;
- максимальная высота логотипа: `150 px`;
- минимальный отступ сверху и снизу: `40 px`;
- минимальный отступ слева и справа: `48 px`;
- для очень широких логотипов приоритет ширине;
- для высоких/компактных логотипов приоритет высоте;
- логотип должен визуально находиться по центру, а не математически по bounding box, если форма асимметрична.

Цель: при отображении через CSS `object-fit: contain` логотип не должен прилипать к нижнему краю карточки.

## Проверка на сайте

После нормализации логотип должен хорошо выглядеть в этих контейнерах:

### Каталог брендов

CSS-контейнер примерно такой:

```css
.brand-logo {
  display: grid;
  place-items: center;
  width: 96px;
  height: 64px;
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
```

### Внутри страницы бренда

CSS-контейнер примерно такой:

```css
.brand-logo {
  display: grid;
  place-items: center;
  width: 118px;
  height: 70px;
  padding: 12px;
  border-radius: 22px;
  background: rgba(255,255,255,.94);
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
```

Логотип должен:

- быть читаемым;
- не касаться краев;
- не выглядеть слишком маленьким;
- не иметь белого прямоугольника;
- быть визуально центрированным;
- выглядеть единообразно с остальными логотипами.

## Именование брендов

Соответствия:

```text
Alpine floor.png      -> alpine-floor.png / Alpine_Floor.png
alta step.png         -> alta-step.png / Alta_Step.png
coswick.jpg           -> coswick.png / Coswick.png
Ensten.jpg или ensten.png -> ensten.png / Ensten.png
Kahrs.webp            -> kahrs.png / Kahrs.png
Karelia.webp          -> karelia.png / Karelia.png
NatisSton.jpg         -> natisston.png / NatisSton.png
Norland.webp          -> norland.png / Norland.png
Orac Decor.png        -> orac-decor.png / Orac_Decor.png
Polarwood.png         -> polarwood.png / Polarwood.png
Royal Parket.webp     -> royal-parket.png / Royal_Parket.png
Tulesna.webp          -> tulesna.png / Tulesna.png
Unilin.jpg            -> unilin.png / Unilin.png
WoodRock.png          -> woodrock.png / WoodRock.png
tarkett.png           -> tarkett.png / Tarkett.png
техномассив.jpg       -> tehnomassiv.png / Tehnomassiv.png
```

## Промпт для ChatGPT

```text
Ты работаешь с проектом TouchSpace Academy. В папке logos лежат исходные логотипы брендов разных размеров, форматов и пропорций.

Нужно нормализовать все логотипы для сайта.

Сделай для каждого бренда PNG-файл 512 × 256 px с прозрачным фоном, sRGB. Логотип размести по центру холста с safe area: максимальная ширина 380 px, максимальная высота 150 px, отступы не меньше 48 px по бокам и 40 px сверху/снизу. Пропорции не искажать. Белый фон у исходников удалить. Не добавлять тени, рамки, подложки, градиенты или декоративные элементы. Сохранить оригинальные цвета и форму логотипа.

Логотип должен быть оптически центрирован по вертикали и горизонтали, чтобы он хорошо смотрелся в маленькой карточке бренда и в блоке логотипа внутри страницы бренда. Он не должен прилипать к нижнему или верхнему краю и не должен выглядеть как белый квадрат.

Готовые файлы сохрани в двух наборах:

1. Для страниц брендов:
brands/touchspace_brand_pages/images/brand-logos/

Имена:
alpine-floor.png
alta-step.png
coswick.png
ensten.png
kahrs.png
karelia.png
natisston.png
norland.png
orac-decor.png
polarwood.png
royal-parket.png
tulesna.png
unilin.png
woodrock.png
tehnomassiv.png
tarkett.png

2. Для общего каталога:
images/brand-logos/

Имена:
Alpine_Floor.png
Alta_Step.png
Coswick.png
Ensten.png
Kahrs.png
Karelia.png
NatisSton.png
Norland.png
Orac_Decor.png
Polarwood.png
Royal_Parket.png
Tulesna.png
Unilin.png
WoodRock.png
Tehnomassiv.png
Tarkett.png

Если у бренда есть два исходника, выбери более качественный. Например для Ensten сравни Ensten.jpg и ensten.png и используй лучший.

После обработки проверь каждый PNG:
- размер ровно 512 × 256 px;
- фон прозрачный;
- нет белого прямоугольника;
- логотип не обрезан;
- логотип визуально центрирован;
- логотип хорошо читается в контейнере 96 × 64 px и 118 × 70 px с object-fit: contain.

Верни список созданных файлов и укажи, какие исходники были использованы.
```

## Финальная проверка

После получения файлов нужно проверить:

```text
1. Все файлы существуют.
2. Все файлы PNG.
3. Все файлы 512 × 256 px.
4. У всех есть альфа-канал.
5. В каталоге брендов логотипы не прилипают к краям.
6. На страницах брендов логотипы читаются и центрированы.
```
