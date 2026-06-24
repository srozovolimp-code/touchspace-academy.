# Canonical Advanced architecture

## Purpose

Create one reusable Advanced module architecture for TouchSpace Academy.

## Canonical sources

- Visual and interaction reference: `coswick-advanced-block-01.html` and the remaining Coswick Advanced modules.
- Reusable technical mechanics reference: current Pergo Advanced `pergo-advanced-module.js`, `pergo-advanced-module.css`, manifests and data files.

## Target structure

```text
brands/touchspace_brand_pages/
├── advanced/
│   ├── advanced-module.css
│   ├── advanced-module.js
│   ├── advanced-module-template.html
│   └── README.md
├── coswick-advanced/
│   ├── course-manifest.js
│   └── block-XX-data.js
├── pergo-advanced/
│   ├── course-manifest.js
│   └── block-XX-data.js
└── alpine-floor-advanced/
    ├── course-manifest.js
    └── block-XX-data.js
```

## Required behavior

- Coswick-compatible `module-shell`, `course-panel`, `course-cover`, `lesson-list`, `stage` and `quiz-modal`.
- Sequential unlocking of sections.
- Page quiz in a modal window.
- Module final quiz.
- Progress stored in `localStorage`.
- Immediate rerender after a successful quiz.
- Transition to the next section, next module and final course test.
- Mobile behavior equivalent to Coswick Advanced.

## Required visual rules

- Do not redesign components from screenshots.
- Copy verified values from the actual Coswick files in `main`.
- Action buttons must use the compact outlined Coswick version approved in local validation.
- Do not inherit the old large filled `.btn` rules from `academy-content-blocks.css`.
- Brand-specific images, logos and content must stay outside the common renderer.

## Scope restrictions

The branch `feature/advanced-canonical-template` may change only:

- new files inside the future shared Advanced directory;
- one isolated example module;
- documentation and validation helpers directly related to the template.

It must not change:

- `shared-header.css`;
- `shared-header.js`;
- `mobile-responsive.css` for brand-specific fixes;
- `brands.html`;
- current production Coswick, Pergo or Alpine Floor pages during the first phase;
- Vercel configuration.

## Migration phases

1. Build an isolated canonical template from exact Coswick DOM and styles.
2. Validate all controls, quizzes, progress and mobile layout locally.
3. Connect one disposable example module.
4. Move Pergo Advanced to the common renderer in a separate PR.
5. Move Coswick Advanced in a separate PR.
6. Move Alpine Floor Advanced in a separate PR.
7. Retire obsolete Advanced renderers only after all three brands pass validation.

## Branch policy

- `main` contains only checked production code.
- One feature branch solves one task.
- One PR contains one logical change.
- Experimental branches are never merged wholesale.
- Useful code from archived branches is copied manually and reviewed line by line.
