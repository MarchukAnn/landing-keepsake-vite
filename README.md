# Keepsake — landing (Vite + Pug + SCSS)

**Demo:** https://marchukann.github.io/landing-keepsake-vite/

Той самий лендінг агенції Keepsake з лабораторної №7, зібраний за допомогою Vite, Pug, SCSS і PostCSS.

## Вимоги та команди

Node.js LTS (не нижче 20), npm.

| Команда           | Що робить                                                    |
| ----------------- | ------------------------------------------------------------ |
| `npm install`     | встановлює залежності                                        |
| `npm run dev`     | dev-сервер з hot reload                                      |
| `npm run build`   | production-збірка в `dist/` (CSS мініфікується Vite)         |
| `npm run preview` | локальний перегляд зібраної версії                           |
| `npm run format`  | форматує все Prettier-ом                                     |
| `npm run lint`    | Stylelint + `prettier --check`                               |
| `npm run images`  | генерує AVIF/WebP/JPEG у двох ширинах з `images-src` (sharp) |

## Структура

```
src/
├── assets/images-src/   # вихідні JPEG
├── assets/images/       # згенеровані AVIF, WebP, JPEG (400w, 800w)
├── components/          # header, footer, newsletter, sections/*.pug
├── data/                # дані: навігація, роботи, послуги, футер...
├── includes/            # SVG-спрайт
├── layouts/main.pug     # базовий макет (блоки meta, title, styles, content, scripts)
├── mixins/              # btn, icon, picture, section-title, work-card, post-card
├── pages/index.pug      # сторінка (extends макета)
└── styles/
    ├── abstracts/       # токени, брейкпоінти, функція rem(), міксини
    ├── base/            # reset, :root (custom properties), типографіка, a11y
    ├── layout/          # container, section, header, footer
    ├── components/      # один БЕМ-блок — один файл
    └── main.scss        # єдина точка входу
```

**Pug.** `pages/index.pug` успадковує `layouts/main.pug` (`extends`, `block`), доповнює `meta` і `styles` через `append`/`prepend`. Шапка, футер і секції — окремі файли (`include`). Повторюваний вміст береться з масивів у `src/data` і виводиться через `each`; картки й кнопки — міксини.

**SCSS.** Лише `@use`/`@forward`, кожна папка має `_index.scss`. Токени — SCSS-map-и, з яких `@each` генерує CSS custom properties в `:root`. Брейкпоінти в map-і, міксин `mq()` (mobile first, лише `min-width`). Класи — БЕМ, вкладеність ≤ 3.

## Інструменти

| Інструмент                      | Навіщо                                        |
| ------------------------------- | --------------------------------------------- |
| Vite + Vituum                   | dev-сервер і збірка, рендер Pug у HTML        |
| Pug                             | шаблонізатор: макети, міксини, дані, цикли    |
| Sass (Dart Sass)                | модульні стилі, змінні, міксини, функції      |
| PostCSS + Autoprefixer          | вендорні префікси під браузери з Browserslist |
| sharp                           | генерація AVIF/WebP/JPEG різних розмірів      |
| Prettier + @prettier/plugin-pug | єдине форматування коду (включно з Pug)       |
| Stylelint (standard-scss)       | контроль якості SCSS, БЕМ-шаблон класів       |
| husky + lint-staged             | pre-commit: перевіряє лише змінені файли      |
| commitlint                      | Conventional Commits у повідомленнях комітів  |
| GitHub Actions                  | lint, збірка й публікація на GitHub Pages     |

## Цільові браузери (Browserslist)

Останні 2 версії Chrome, Firefox, Edge, Safari та iOS Safari (`.browserslistrc`).

## Оптимізація

Розміри взяті з `npm run build` та `npm run images`. Цифри за 9 зображеннями портфоліо.

| Що                                     | Розмір   |
| -------------------------------------- | -------- |
| Оригінальні JPEG (9 × 358px)           | 195.9 KB |
| AVIF 400w (9 файлів)                   | 18.1 KB  |
| WebP 400w (9 файлів)                   | 22.3 KB  |
| AVIF 800w (9 файлів)                   | 31.5 KB  |
| WebP 800w (9 файлів)                   | 43.5 KB  |
| JPEG 800w, запасний варіант (9 файлів) | 92.1 KB  |

Сучасний браузер завантажує AVIF потрібної ширини: на десктопі це приблизно 18–32 KB замість 195.9 KB (економія понад 80%).

| Що                               | До (lab-07) | Після (`dist`)          |
| -------------------------------- | ----------- | ----------------------- |
| CSS (`style.css` → `main-*.css`) | 20.0 KB     | 18.87 KB (gzip 3.99 KB) |
| HTML (`index.html`)              | —           | 23.95 KB (gzip 4.83 KB) |

Для збирання використовується Vite, CSS мініфікується автоматично.
