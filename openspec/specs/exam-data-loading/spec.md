## Requirements

### Requirement: Exam markdown files are parsed into structured questions
The app SHALL parse exam markdown files into an array of question objects with a number, text, and options.

#### Scenario: Standard question parsing
- **GIVEN** a markdown block starting with `N. Question text` followed by `* a) ... * b) ...` options
- **WHEN** the file is parsed
- **THEN** a question object is produced with `number`, `text`, and `options` array

#### Scenario: Multi-line question text
- **GIVEN** a question whose text spans multiple lines before the first option
- **WHEN** the file is parsed
- **THEN** all text lines are concatenated into a single `text` string

#### Scenario: Questions without options are skipped
- **GIVEN** a markdown block with a question number but no `* a)` options
- **WHEN** the file is parsed
- **THEN** that block is silently dropped from the output

---

### Requirement: Solution files are parsed into a question-to-answer map
The app SHALL parse solution files into a map of `{ [questionNumber]: answerLetter }`.

#### Scenario: Standard solution parsing
- **GIVEN** a solution file with lines in the format `N: a`
- **WHEN** the file is parsed
- **THEN** a map is produced where `map[N] === 'a'`

#### Scenario: Answer letters are lowercased
- **GIVEN** a solution file with uppercase entries like `1: B`
- **WHEN** the file is parsed
- **THEN** the stored value is `'b'`

#### Scenario: Annulled questions
- **GIVEN** a solution file with an entry `3: nula`
- **WHEN** the file is parsed
- **THEN** `map[3] === 'nula'`

#### Scenario: Empty solution file
- **GIVEN** a solution file with no valid entries
- **WHEN** the file is parsed
- **THEN** an empty map `{}` is returned

---

### Requirement: Exam metadata is derived from the file path
For structured exams, the app SHALL extract `exam`, `year`, `region`, and `type` from the file path segments.

#### Scenario: Structured path parsing
- **GIVEN** a file at path `teji/2025/clm/ordinaria.md`
- **WHEN** `parseMeta` is called
- **THEN** `exam === "TEJI"`, `year === "2025"`, `region === "Castilla La Mancha"`, `type === "Ordinaria"`

#### Scenario: Region label mapping
- **GIVEN** the path segment `clm`
- **WHEN** parsed
- **THEN** the region is mapped to the human-readable label "Castilla La Mancha"

#### Scenario: Unknown region falls back to uppercased segment
- **GIVEN** a path segment not in the region map (e.g., `mad`)
- **WHEN** parsed
- **THEN** the region is shown as `"MAD"`

---

### Requirement: Standalone exam title is extracted from the markdown heading
For standalone exams (flat path, not structured), the app SHALL use the `# heading` as the exam title.

#### Scenario: Title from heading
- **GIVEN** a standalone exam file with `# Examen de prueba` as its first heading
- **WHEN** loaded
- **THEN** `title === "Examen de prueba"`

#### Scenario: Title falls back to filename
- **GIVEN** a standalone exam file with no `#` heading
- **WHEN** loaded
- **THEN** `title` falls back to the filename without extension
