# Copilot Instructions

## Commands

```bash
npm run dev      # start dev server (localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

No test or lint scripts exist.

## Architecture

Fully static React + Vite SPA deployed to GitHub Pages. No backend. Exam data lives in markdown files bundled at **build time** via `import.meta.glob`.

```
src/data/exams/    ← structured: {exam}/{year}/{region}/{type}.md  (e.g. teji/2025/clm/ordinaria.md)
                     standalone: {name}.md  (e.g. test.md, uses # title from markdown)
src/data/solutions/ ← matching solution files with same path structure
src/
  examLoader.js        ← entry point: listExams() / loadExam(), parseMeta()
  utils/parseExam.js   ← pure parsers: parseExam, parseSolutions, getExamTitle
  components/
    ExamList.jsx       ← exam list with filter sidebar and metadata badges
    Badge.jsx          ← shared Badge component (zinc/blue/amber/emerald/indigo)
    Quiz.jsx           ← interactive quiz (navigation, swipe, inline feedback)
    Results.jsx        ← summary + per-question review
  App.jsx              ← view state machine: list → quiz → results
  index.css            ← Tailwind + card slide animation keyframes
```

**Data flow:** `import.meta.glob('/src/data/exams/**/*.md')` returns lazy loaders keyed by path. `parseMeta(name)` splits the path into `{ exam, year, region, type }`. `loadExam(name)` awaits both exam and solution files, parses them, and returns `{ name, title, exam, year, region, type, questions, solutions }`.

**`title`** is `null` for structured exams (UI uses `exam` field + badges). For standalone exams, `title` is extracted from the `#` heading via `getExamTitle`.

## Key conventions

### Adding a new exam
Drop `exams/{exam}/{year}/{region}/{type}.md` in the data submodule (e.g. `exams/teji/2025/clm/ordinaria.md`). Vite picks it up at build time via recursive glob — no code changes needed. Metadata (name, year, region, type) is derived from the path by `parseMeta()`.

For standalone exams without structured metadata, use a flat path (`exams/test.md`) with a `#` title heading.

### Exam markdown format
Structured exams (no `#` title needed — derived from path):
```
## Oposición: TEJI
## Año: 2025
## Región: Castilla La Mancha
## Tipo: Ordinaria

1. Question text
    * a) Option A
    * b) Option B
    * c) Option C
    * d) Option D
```
The `##` lines are documentation only — the app ignores them. Parser splits on `/\n(?=\d+\.\s)/`. Multi-line question text before the first `* a)` option is concatenated.

### Solutions format
```
1: a
2: b
3: nula
```
`parseSolutions` lowercases all values. The string `"nula"` marks an annulled question. A question number absent from the map means "no solution available" — distinct from annulled.

### Answer state
`answers` is `{ [questionNumber]: letter }` stored in Quiz component state. Question numbers are integers from the parsed markdown (not array indices).

### `base: './'` in vite.config
Required for GitHub Pages subdirectory deployment. The app has no client-side routing, so relative asset paths work fine.

### Deployment
Push to `main` → GitHub Actions runs `npm ci && npm run build` → deploys `dist/` to GitHub Pages. GitHub Pages source must be set to **GitHub Actions** in repo Settings → Pages.
