## Requirements

### Requirement: A simulacro card is shown per oposición
The exam list SHALL show one simulacro card for each unique oposición (e.g., TEJI) when no filters are active.

#### Scenario: Simulacro card appears
- **GIVEN** structured exams are loaded and no filters are active
- **WHEN** the exam list renders
- **THEN** one simulacro card is shown per unique oposición name

#### Scenario: Simulacro hidden with active filters
- **GIVEN** at least one filter is active
- **WHEN** the exam list renders
- **THEN** no simulacro cards are shown

---

### Requirement: Simulacro pools questions from all exams for the oposición
Generating a simulacro SHALL collect all questions (with solutions) from every exam of the chosen oposición, shuffle them, and take up to 80.

#### Scenario: Pool from multiple exams
- **GIVEN** TEJI has exams from 2021, 2023, and 2025
- **WHEN** the simulacro is generated
- **THEN** questions are drawn from all three exams

#### Scenario: Only questions with solutions are included
- **WHEN** the simulacro is generated
- **THEN** only questions that have a matching solution entry are included in the pool

#### Scenario: Maximum 80 questions
- **GIVEN** the pool has more than 80 questions
- **WHEN** the simulacro is generated
- **THEN** exactly 80 questions are included

#### Scenario: Fewer than 80 available
- **GIVEN** the pool has fewer than 80 questions
- **WHEN** the simulacro is generated
- **THEN** all available questions are included (no padding or duplication)

#### Scenario: Questions are shuffled randomly
- **WHEN** two simulacros are generated for the same oposición
- **THEN** the question order is likely different between the two (random shuffle)

#### Scenario: Questions are renumbered sequentially
- **WHEN** the simulacro is generated
- **THEN** questions are renumbered 1 through N regardless of their original question numbers

---

### Requirement: Simulacro questions retain source metadata
Each question in a simulacro SHALL carry metadata about which exam it came from.

#### Scenario: Source metadata on questions
- **WHEN** a simulacro question is displayed in the quiz
- **THEN** the year, region, and type of the source exam is shown on the question card

---

### Requirement: Simulacro generation errors are handled gracefully
If generating a simulacro fails, the app SHALL show an error message and remain on the list view.

#### Scenario: Generation error
- **WHEN** simulacro generation throws an error
- **THEN** "No se pudo generar el simulacro." is displayed and the user stays on the exam list
