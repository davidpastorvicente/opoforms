## Requirements

### Requirement: App displays all available exams on load
The app SHALL load and display all available exams from the data directory when the list view is shown.

#### Scenario: Structured exams are displayed
- **WHEN** the exam list loads
- **THEN** each structured exam (path `{exam}/{year}/{region}/{type}.md`) is shown as a card with its name, year, region, and type badges

#### Scenario: Standalone exams are displayed
- **WHEN** the exam list loads
- **THEN** standalone exams (flat path like `test.md`) are shown with their title extracted from the `#` heading

#### Scenario: Loading fails gracefully
- **WHEN** the exam loader throws an error
- **THEN** the list displays the message "No se pudieron cargar los exámenes."

---

### Requirement: Exams are sorted newest first
Structured exams SHALL be sorted by year descending so the most recent exams appear at the top.

#### Scenario: Year descending sort
- **GIVEN** exams from multiple years (e.g., 2021, 2023, 2025)
- **WHEN** displayed with no active filters
- **THEN** the 2025 exam appears before 2023, which appears before 2021

---

### Requirement: Each exam card shows solution availability
Every exam card SHALL indicate whether a solution file is available for that exam.

#### Scenario: Exam with solution
- **WHEN** an exam has a paired solution file
- **THEN** its card shows a green (emerald) solution badge

#### Scenario: Exam without solution
- **WHEN** an exam has no paired solution file
- **THEN** its card shows a neutral (zinc) "Sin soluciones" badge

---

### Requirement: Clicking an exam starts the quiz
Selecting an exam from the list SHALL load that exam and transition to the quiz view.

#### Scenario: Start exam
- **WHEN** the user clicks an exam card
- **THEN** the exam data loads and the quiz view opens with that exam's questions

#### Scenario: Loading state prevents double-click
- **WHEN** an exam is loading
- **THEN** all exam cards are disabled until loading completes

#### Scenario: Load error is shown
- **WHEN** loading an exam fails
- **THEN** an error message "No se pudo cargar el examen." is displayed and the user remains on the list

---

### Requirement: Standalone exams are hidden when filters are active
Standalone exams SHALL only be visible when no filters are active, as they have no metadata to filter by.

#### Scenario: Standalone hidden with filters
- **GIVEN** at least one filter is active
- **WHEN** the exam list renders
- **THEN** standalone exams are not shown

#### Scenario: Standalone visible without filters
- **GIVEN** no filters are active
- **WHEN** the exam list renders
- **THEN** standalone exams are shown below structured exams
