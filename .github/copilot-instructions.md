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
exams/        ← exam markdown files (e.g. TEJI.md)
solutions/    ← matching solution files with same filename
src/
  examLoader.js        ← entry point: listExams() / loadExam()
  utils/parseExam.js   ← pure parsers: parseExam, parseSolutions, getExamTitle
  components/
    ExamList.jsx       ← async exam list with titles
    Quiz.jsx           ← interactive quiz (navigation, swipe, inline feedback)
    Results.jsx        ← summary + per-question review
  App.jsx              ← view state machine: list → quiz → results
  index.css            ← Tailwind + card slide animation keyframes
```

**Data flow:** `import.meta.glob('/exams/*.md')` and `import.meta.glob('/solutions/*.md')` return lazy loaders keyed by path. `loadExam(name)` awaits both, parses them, and returns `{ name, title, questions, solutions }`.

## Key conventions

### Adding a new exam
Drop `exams/MYEXAM.md` (and optionally `solutions/MYEXAM.md`). Vite picks them up at build time — no code changes needed.

### Exam markdown format
```
# Exam Title

1. Question text
    * a) Option A
    * b) Option B
    * c) Option C
    * d) Option D
```
Parser splits on `/\n(?=\d+\.\s)/`. Multi-line question text before the first `* a)` option is concatenated.

### Solutions format
```
1: a
2: b
3: ANULADA
```
`parseSolutions` lowercases all values. The string `"nula"` (case-insensitive, lowercased by the parser) marks an annulled question. A question number absent from the map means "no solution available" — distinct from annulled.

### Answer state
`answers` is `{ [questionNumber]: letter }` stored in Quiz component state. Question numbers are integers from the parsed markdown (not array indices).

### `base: './'` in vite.config
Required for GitHub Pages subdirectory deployment. The app has no client-side routing, so relative asset paths work fine.

### Deployment
Push to `main` → GitHub Actions runs `npm ci && npm run build` → deploys `dist/` to GitHub Pages. GitHub Pages source must be set to **GitHub Actions** in repo Settings → Pages.
