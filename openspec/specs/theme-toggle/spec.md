## ADDED Requirements

### Requirement: User can toggle dark and light mode
The app SHALL provide a toggle button visible in all views that switches between dark and light mode.

#### Scenario: Toggle from light to dark
- **WHEN** the user clicks the theme toggle button while in light mode
- **THEN** the app switches to dark mode immediately

#### Scenario: Toggle from dark to light
- **WHEN** the user clicks the theme toggle button while in dark mode
- **THEN** the app switches to light mode immediately

### Requirement: Theme persists across page reloads
The selected theme SHALL be saved to `localStorage` so it is restored on subsequent visits.

#### Scenario: Preference restored on reload
- **WHEN** the user has selected dark mode and reloads the page
- **THEN** the app loads in dark mode without requiring another toggle

### Requirement: OS preference used as default
On first load (no stored preference), the app SHALL default to the user's OS-level `prefers-color-scheme` setting.

#### Scenario: OS dark mode default
- **WHEN** the user visits for the first time and their OS is set to dark mode
- **THEN** the app loads in dark mode

#### Scenario: OS light mode default
- **WHEN** the user visits for the first time and their OS is set to light mode
- **THEN** the app loads in light mode

### Requirement: All views support dark mode
All UI surfaces — exam list, quiz, and results — SHALL be fully readable and visually correct in dark mode.

#### Scenario: Exam list in dark mode
- **WHEN** dark mode is active
- **THEN** the exam list, filter sidebar, and badges are rendered with dark-appropriate colors

#### Scenario: Quiz in dark mode
- **WHEN** dark mode is active
- **THEN** question cards, options, navigation buttons, and progress bar are rendered with dark-appropriate colors

#### Scenario: Results in dark mode
- **WHEN** dark mode is active
- **THEN** the summary card and per-question review are rendered with dark-appropriate colors
