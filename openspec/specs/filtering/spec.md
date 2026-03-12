## Requirements

### Requirement: User can filter exams by multiple dimensions
The sidebar SHALL provide independent multi-select filters for oposición name, year, region, and type.

#### Scenario: Filter by oposición
- **WHEN** the user selects a filter value (e.g., "TEJI") in the Oposición dimension
- **THEN** only exams with `exam === "TEJI"` are shown

#### Scenario: Multiple values in one dimension (OR logic)
- **WHEN** the user selects two years (e.g., "2023" and "2025")
- **THEN** exams from either year are shown

#### Scenario: Multiple dimensions active (AND logic)
- **WHEN** the user selects a year ("2025") and a type ("Ordinaria")
- **THEN** only exams that match both year AND type are shown

#### Scenario: Toggling a filter off removes it
- **WHEN** the user clicks an already-active filter value
- **THEN** it is deselected and the exam list updates accordingly

---

### Requirement: A clear-all button appears when filters are active
A "Limpiar filtros" button SHALL appear whenever at least one filter is selected and reset all filters when clicked.

#### Scenario: Button appears with active filters
- **WHEN** at least one filter is active
- **THEN** the "Limpiar filtros" button is visible

#### Scenario: Button resets all filters
- **WHEN** the user clicks "Limpiar filtros"
- **THEN** all filter dimensions are cleared and all exams are shown again

#### Scenario: Button hidden with no filters
- **WHEN** no filters are active
- **THEN** the "Limpiar filtros" button is not visible

---

### Requirement: Filter sidebar only shows dimensions with data
A filter section SHALL not render if there are no values for that dimension.

#### Scenario: Empty dimension hidden
- **GIVEN** all exams are from the same region
- **WHEN** the filter sidebar renders
- **THEN** the region filter section is not shown (only one value, no filtering useful)

---

### Requirement: Filter state is not persisted across sessions
Filter selections SHALL reset when the user navigates away to a quiz and returns to the list.

#### Scenario: Filters reset on return to list
- **WHEN** the user starts an exam and then returns to the list view
- **THEN** all filter dimensions are empty and all exams are visible
