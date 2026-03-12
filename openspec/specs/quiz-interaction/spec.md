## Requirements

### Requirement: User can navigate between questions
The quiz SHALL allow navigation between questions via buttons, a quick-nav sidebar grid, and swipe gestures.

#### Scenario: Next and previous buttons
- **WHEN** the user clicks "Siguiente" or "Anterior"
- **THEN** the quiz moves to the next or previous question respectively

#### Scenario: Buttons disabled at boundaries
- **WHEN** the user is on the first question
- **THEN** the "Anterior" button is disabled
- **WHEN** the user is on the last question
- **THEN** the "Siguiente" button is disabled

#### Scenario: Quick-nav grid jump
- **WHEN** the user clicks a question number in the sidebar grid
- **THEN** the quiz jumps directly to that question

#### Scenario: Swipe gesture navigation
- **WHEN** the user swipes left (≥50px) on the question card
- **THEN** the quiz moves to the next question
- **WHEN** the user swipes right (≥50px)
- **THEN** the quiz moves to the previous question

#### Scenario: Slide animation direction
- **WHEN** navigating forward
- **THEN** the new question slides in from the right
- **WHEN** navigating backward
- **THEN** the new question slides in from the left

---

### Requirement: User can select an answer for each question
The quiz SHALL allow selecting one answer per question; the selection persists during navigation.

#### Scenario: Select an answer
- **WHEN** the user clicks an option
- **THEN** that option is marked as selected for that question

#### Scenario: Change answer
- **WHEN** the user clicks a different option on a previously answered question
- **THEN** the new option replaces the previous answer

#### Scenario: Answers persist across navigation
- **WHEN** the user answers question 1, navigates to question 3, then returns to question 1
- **THEN** question 1 still shows the previously selected answer

---

### Requirement: Real-time feedback is shown when solutions are available
The quiz SHALL immediately show whether an answer is correct or wrong after selection, if solutions exist.

#### Scenario: Correct answer feedback
- **GIVEN** the exam has solutions
- **WHEN** the user selects the correct answer
- **THEN** that option is highlighted in green and the message "¡Correcto!" is shown

#### Scenario: Wrong answer feedback
- **GIVEN** the exam has solutions
- **WHEN** the user selects a wrong answer
- **THEN** the user's option is highlighted in red, the correct option in green, and the message "Incorrecto — La respuesta correcta es la [X]" is shown

#### Scenario: Annulled question
- **GIVEN** a question is marked as annulled in the solutions (`"nula"`)
- **WHEN** the user views that question
- **THEN** no option is highlighted and "Esta pregunta está anulada" is shown

#### Scenario: No solution for question
- **GIVEN** solutions exist for the exam but not for a specific question number
- **WHEN** the user views that question
- **THEN** "No hay solución disponible para esta pregunta" is shown

#### Scenario: No solutions for exam
- **GIVEN** the exam has no solution file
- **WHEN** the user answers any question
- **THEN** no inline feedback is shown

---

### Requirement: Quick-nav grid shows answer state with color codes
Each number in the sidebar quick-nav SHALL reflect the current answer state of that question.

#### Scenario: Answered correctly
- **GIVEN** solutions are available and the user answered correctly
- **WHEN** the sidebar is displayed
- **THEN** that question number is shown in green

#### Scenario: Answered incorrectly
- **GIVEN** solutions are available and the user answered incorrectly
- **WHEN** the sidebar is displayed
- **THEN** that question number is shown in red

#### Scenario: Annulled question in grid
- **WHEN** a question is annulled
- **THEN** its number in the grid is shown in amber

#### Scenario: Unanswered question in grid
- **WHEN** a question has not been answered
- **THEN** its number in the grid is shown in neutral gray

---

### Requirement: User can submit the quiz with a confirmation step if incomplete
The quiz SHALL submit all answers when the user clicks "Finalizar", asking for confirmation if questions remain unanswered.

#### Scenario: Submit all answered
- **WHEN** all questions are answered and the user clicks "Finalizar"
- **THEN** the quiz submits immediately without a confirmation modal

#### Scenario: Submit with unanswered questions
- **WHEN** not all questions are answered and the user clicks "Finalizar"
- **THEN** a modal appears showing how many questions are unanswered

#### Scenario: Cancel submission
- **WHEN** the modal is shown and the user clicks "Seguir"
- **THEN** the modal closes and the user continues the quiz

#### Scenario: Confirm partial submission
- **WHEN** the modal is shown and the user clicks "Finalizar"
- **THEN** the quiz is submitted with the current answers and the results view is shown
