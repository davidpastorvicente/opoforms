# OpoForms

Aplicación web para practicar exámenes de oposición. Lee los exámenes en formato Markdown y genera cuestionarios interactivos con corrección automática.

## Stack

- **Backend**: Node.js + Express — API ligera para leer y parsear los ficheros de examen.
- **Frontend**: React + Vite + Tailwind CSS — interfaz minimalista y moderna.

## Estructura del proyecto

```
opoForms/
├── exams/          # Ficheros Markdown con los exámenes
├── solutions/      # Ficheros Markdown con las soluciones (mismo nombre que el examen)
├── client/         # Código fuente del frontend (React + Vite)
├── server.js       # Servidor Express (API)
├── package.json
└── README.md
```

## Formato de los exámenes

Cada examen es un fichero `.md` dentro de la carpeta `exams/`. El nombre del fichero es el identificador del examen (p. ej. `TEJI.md`).

### Estructura esperada

```markdown
### Título del examen

1. Texto de la pregunta...
    * a) Opción A
    * b) Opción B
    * c) Opción C
    * d) Opción D

2. Otra pregunta...
    * a) ...
```

- Las preguntas deben estar numeradas (`1.`, `2.`, ...).
- Cada opción va en su propia línea, precedida por `* a)`, `* b)`, `* c)` o `* d)`.

## Formato de las soluciones

El fichero de soluciones lleva el **mismo nombre** que el examen y va en la carpeta `solutions/`.

```
1: a
2: d
3: b
4: null
```

- Un par `número: letra` por línea.
- Las preguntas anuladas se indican con `null` (mayúsculas o minúsculas).

## Añadir un nuevo examen

1. Crea el fichero `exams/NOMBRE.md` con el formato indicado.
2. (Opcional) Crea `solutions/NOMBRE.md` con las respuestas correctas.
3. Recarga la aplicación — el examen aparecerá automáticamente en la lista.

## Instalación y uso

```bash
npm install
npm run dev
```

La aplicación abrirá en `http://localhost:5173`.

### Producción

```bash
npm run build     # genera la carpeta dist/
npm run server    # sirve la API en el puerto 3001
```

> Para producción, puedes configurar Express para servir también los estáticos de `dist/`.
