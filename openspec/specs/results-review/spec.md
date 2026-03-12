## Requirements

### Requirement: Results screen shows overall score summary
After submitting the quiz, the app SHALL display a summary with correct, wrong, skipped, and annulled counts.

#### Scenario: Score summary with solutions
- **GIVEN** the exam has solutions
- **WHEN** the results screen loads
- **THEN** it shows the counts of correct, incorrect, skipped, and annulled questions

#### Scenario: Score summary without solutions
- **GIVEN** the exam has no solution file
- **WHEN** the results screen loads
- **THEN** it shows a message indicating no solutions are available

#### Scenario: Final score percentage
- **GIVEN** the exam has solutions and at least one answerable (non-annulled) question
- **WHEN** the results screen loads
- **THEN** it shows a percentage score based on correct answers over total non-annulled questions with solutions

---

### Requirement: Results screen shows per-question review
The results screen SHALL list each question with the user's answer, the correct answer, and a status badge.

#### Scenario: Correct question review
- **GIVEN** the user answered a question correctly
- **WHEN** viewing the results
- **THEN** that question shows the selected option highlighted in green and a "Correcta" badge

#### Scenario: Incorrect question review
- **GIVEN** the user answered a question incorrectly
- **WHEN** viewing the results
- **THEN** the user's option is shown in red, the correct option in green, and an "Incorrecta" badge

#### Scenario: Skipped question review
- **GIVEN** the user did not answer a question and solutions are available
- **WHEN** viewing the results
- **THEN** the correct option is highlighted in green and a "Sin responder" badge is shown

#### Scenario: Annulled question review
- **GIVEN** a question is marked as annulled
- **WHEN** viewing the results
- **THEN** the question shows an "Anulada" badge and no option highlighting

#### Scenario: No solution for question
- **GIVEN** solutions exist for the exam but not for a specific question
- **WHEN** viewing the results
- **THEN** a "Sin solución" badge is shown for that question

---

### Requirement: User can restart or return to list from results
The results screen SHALL provide buttons to retry the same exam or go back to the exam list.

#### Scenario: Restart exam
- **WHEN** the user clicks "Reintentar"
- **THEN** the quiz restarts with the same exam and all answers cleared

#### Scenario: Back to list
- **WHEN** the user clicks the back button or "Volver"
- **THEN** the user is returned to the exam list and exam data is cleared
