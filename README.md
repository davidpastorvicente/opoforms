# OpoForms

Aplicación web para practicar exámenes de oposición. Lee los exámenes en formato Markdown y genera cuestionarios interactivos con corrección automática.

## Stack

- **React + Vite + Tailwind CSS** — SPA estática, sin backend
- **GitHub Pages** — despliegue automático vía GitHub Actions en cada push a `main`

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo → http://localhost:5173
npm run build     # build de producción → dist/
npm run preview   # previsualizar el build localmente
```

## Estructura del proyecto

```
opoForms/
├── src/
│   ├── data/                      # Submódulo git privado (opoforms-data)
│   │   ├── exams/
│   │   │   └── {exam}/{year}/{region}/{type}.md
│   │   └── solutions/
│   │       └── {exam}/{year}/{region}/{type}.md
│   ├── examLoader.js              # listExams() / loadExam(), parseMeta()
│   ├── utils/parseExam.js         # parseExam, parseSolutions, getExamTitle
│   ├── components/
│   │   ├── ExamList.jsx           # Lista con filtros y badges
│   │   ├── Badge.jsx              # Componente Badge reutilizable
│   │   ├── Quiz.jsx               # Cuestionario interactivo
│   │   └── Results.jsx            # Resumen y revisión de respuestas
│   └── App.jsx                    # Máquina de estados: list → quiz → results
├── .github/workflows/deploy.yml
└── vite.config.js
```

## Formato de los exámenes

Los exámenes estructurados siguen la ruta `exams/{exam}/{year}/{region}/{type}.md` (p. ej. `exams/teji/2025/clm/ordinaria.md`). El título y los metadatos se derivan de la ruta — no hace falta un encabezado `#`.

Opcionalmente, se pueden añadir metadatos como comentarios `##` al inicio del fichero (solo documentación, la app los ignora):

```markdown
## Oposición: TEJI
## Año: 2025
## Región: Castilla La Mancha
## Tipo: Ordinaria

1. Texto de la pregunta...
    * a) Opción A
    * b) Opción B
    * c) Opción C
    * d) Opción D
```

Los exámenes sin estructura de carpetas (p. ej. `exams/test.md`) pueden usar un encabezado `#` como título:

```markdown
# Título del examen

1. ...
```

- Las preguntas deben estar numeradas (`1.`, `2.`, ...).
- Cada opción va precedida por `* a)`, `* b)`, `* c)` o `* d)`.

## Formato de las soluciones

Mismo nombre y ruta que el examen, en la carpeta `solutions/`.

```
1: a
2: d
3: nula
```

- Un par `número: letra` por línea.
- Las preguntas anuladas se indican con `nula` (insensible a mayúsculas).
- Si una pregunta no aparece en el fichero de soluciones, se muestra como "Sin solución".

## Añadir un nuevo examen

1. Crea `src/data/exams/{exam}/{year}/{region}/{type}.md` con el formato indicado.
2. (Opcional) Crea `src/data/solutions/{exam}/{year}/{region}/{type}.md` con las respuestas.
3. Haz push al repo de datos — el deploy se lanza automáticamente. No hay que tocar el código.

## Despliegue

Push a `main` → GitHub Actions ejecuta `npm ci && npm run build` → despliega `dist/` a GitHub Pages.

> Primera vez: activar GitHub Pages en Settings → Pages → Source: **GitHub Actions**.

