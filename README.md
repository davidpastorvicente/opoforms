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
├── exams/               # Ficheros Markdown con los exámenes
├── solutions/           # Ficheros Markdown con las soluciones (mismo nombre que el examen)
├── src/
│   ├── examLoader.js    # Carga y parseo de exámenes (import.meta.glob)
│   ├── utils/parseExam.js
│   ├── components/
│   │   ├── ExamList.jsx
│   │   ├── Quiz.jsx
│   │   └── Results.jsx
│   └── App.jsx
├── .github/workflows/deploy.yml
└── vite.config.js
```

## Formato de los exámenes

Cada examen es un fichero `.md` dentro de `exams/`. El nombre del fichero es el identificador.

```markdown
# Título del examen

1. Texto de la pregunta...
    * a) Opción A
    * b) Opción B
    * c) Opción C
    * d) Opción D
```

- Las preguntas deben estar numeradas (`1.`, `2.`, ...).
- Cada opción va precedida por `* a)`, `* b)`, `* c)` o `* d)`.
- El título se extrae del primer encabezado `#`.

## Formato de las soluciones

Mismo nombre que el examen, en la carpeta `solutions/`.

```
1: a
2: d
3: nula
```

- Un par `número: letra` por línea.
- Las preguntas anuladas se indican con `nula` (insensible a mayúsculas).
- Si una pregunta no aparece en el fichero de soluciones, se muestra como "Sin solución".

## Añadir un nuevo examen

1. Crea `exams/NOMBRE.md` con el formato indicado.
2. (Opcional) Crea `solutions/NOMBRE.md` con las respuestas.
3. Haz `npm run build` — el examen aparece automáticamente. No hay que tocar el código.

## Despliegue

Push a `main` → GitHub Actions ejecuta `npm ci && npm run build` → despliega `dist/` a GitHub Pages.

> Primera vez: activar GitHub Pages en Settings → Pages → Source: **GitHub Actions**.

