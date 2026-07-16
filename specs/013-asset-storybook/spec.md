# Feature Specification: Asset Storybook

**Feature Branch**: `013-asset-storybook`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "Lets add a storybook page, where all the objects are listed and presented in all of their states. The storybook should be selectable from the menu. The rendering should use exact same logic as it is used in the game but it should be rendered on the single tile instead of entire map. It would be used in the future to verify assets visually and how the transitions from each state look like. Next to the object there should be a dropdown with each possible states for given object and selecting the state should transition the rendered object to that state."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open The Asset Storybook From The Menu (Priority: P1)

As a developer or artist, I can open an asset storybook from the main menu so that I can inspect game visuals without starting a scenario.

**Why this priority**: The storybook is only useful if it is easy to reach during normal development and visual review sessions.

**Independent Test**: Open the game, select the storybook from the menu, and verify through acceptance-style navigation coverage that the user can enter and leave the storybook without affecting scenario gameplay flows.

**Acceptance Scenarios**:

1. **Given** the game is on the main menu, **When** the user selects the asset storybook entry, **Then** the game opens a dedicated storybook view instead of starting a scenario.
2. **Given** the storybook view is open, **When** the user returns to the menu, **Then** the main menu becomes available again without a broken or partially preserved scene.

---

### User Story 2 - Inspect Every Supported Subject In Its Available States (Priority: P1)

As a developer or artist, I can see each supported hero, battle unit, and object listed with a preview and a state selector so that I can verify whether available assets render correctly for each supported state.

**Why this priority**: The core value of the feature is asset verification through the same render-resolution rules the game already uses.

**Independent Test**: Open the storybook, review at least one subject from each supported category, change its selected state, and verify through integration or acceptance coverage that the preview updates using the same state-resolution logic the game uses elsewhere.

**Acceptance Scenarios**:

1. **Given** the storybook view is open, **When** the user scans the available entries, **Then** the view lists each supported preview subject together with its category and current state selector.
2. **Given** a preview subject has multiple supported states, **When** the user chooses a different state from the selector, **Then** the preview transitions to the selected state using the subject's supported state vocabulary.
3. **Given** a preview subject is shown in the storybook, **When** it renders, **Then** it uses the same visual resolution rules as gameplay instead of a separate one-off preview mapping.

---

### User Story 3 - Verify Fallbacks And State Transitions Visually (Priority: P2)

As a developer or artist, I can use the storybook to verify transition behavior and fallback rendering so that missing or incomplete assets can be noticed before they affect gameplay scenes.

**Why this priority**: Once the basic viewer exists, its next most valuable role is helping the team catch missing states, weak transitions, or unexpected fallbacks early.

**Independent Test**: Use contract or integration checks plus browser verification to confirm that state changes in the storybook surface fallback results and visually update the preview without requiring a full scenario or battle setup.

**Acceptance Scenarios**:

1. **Given** a preview subject is changed from one valid state to another, **When** the change occurs, **Then** the preview updates in a visually observable way rather than replacing the subject with a blank or static failure.
2. **Given** a requested state has no dedicated asset, **When** the storybook renders that state, **Then** the preview remains visible through the game's fallback behavior and the missing dedicated state is still apparent during review.
3. **Given** the storybook is used during asset review, **When** the user checks a subject repeatedly across states, **Then** the preview stays isolated to a single-subject tile rather than requiring map or battle context to remain understandable.

### Edge Cases

- What happens when a subject supports only one state? The storybook should still show the subject clearly and present a stable state selector that does not imply unavailable choices.
- What happens when a subject category uses directional states? The storybook should present a readable default preview without requiring a full gameplay scene to infer meaning.
- What happens when a requested state resolves to fallback behavior? The preview should remain visible and understandable rather than disappearing or silently failing.
- What happens when multiple subjects share some state names but not others? Each subject's selector should expose only the states that are meaningful for that subject.
- What happens when the user switches between many subjects quickly? The storybook should keep each subject's preview responsive enough for practical visual review.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a menu-accessible asset storybook view that can be opened without launching a scenario.
- **FR-002**: The system MUST allow the user to return from the asset storybook view to the main menu.
- **FR-003**: The asset storybook MUST list every currently supported preview subject that has a dedicated or fallback-resolvable visual profile in gameplay.
- **FR-004**: The asset storybook MUST group or label preview subjects clearly enough for a reviewer to distinguish heroes, battle units, movement objects, guarded locations, and other supported subject categories.
- **FR-005**: Each preview subject in the asset storybook MUST include a visible preview area and a state-selection control adjacent to that preview.
- **FR-006**: Each preview subject's state-selection control MUST expose only the states that are valid or reviewable for that subject.
- **FR-007**: When the user selects a different state for a preview subject, the preview MUST update to that state without requiring the user to leave the storybook.
- **FR-008**: Storybook previews MUST use the same visual-template and state-resolution rules that gameplay scenes use for the same subject category.
- **FR-009**: Storybook previews MUST render the selected subject in an isolated single-tile presentation rather than embedding the subject inside a full map or battle scene.
- **FR-010**: The system MUST preserve readable fallback behavior in the asset storybook when a requested state does not have a dedicated asset.
- **FR-011**: The asset storybook MUST make state changes visually reviewable so that users can inspect how a subject changes from one supported state to another.
- **FR-012**: The asset storybook MUST remain usable for repeated visual review sessions without mutating scenario progress, battle progress, or other gameplay session state.

### Key Entities *(include if feature involves data)*

- **Storybook View**: A dedicated review screen that presents supported game visuals outside normal gameplay scenes.
- **Preview Subject**: A hero, battle unit, movement object, guarded location, or other supported visual subject that can be inspected in the storybook.
- **State Option**: A selectable visual state that is valid or reviewable for a specific preview subject.
- **Preview Tile**: The isolated display area where a single preview subject is rendered for visual inspection.
- **Fallback Preview Result**: A storybook preview outcome that shows how the game renders a subject when the selected state lacks a dedicated asset.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of currently supported preview subjects can be reached from the asset storybook without starting a scenario.
- **SC-002**: In review flows, 100% of tested subject entries show a preview and a subject-appropriate state selector in the same screen.
- **SC-003**: In validation coverage, 100% of storybook preview state changes resolve through the same subject-resolution logic used by gameplay scenes.
- **SC-004**: In fallback validation, 100% of tested missing-state previews remain visible and readable instead of rendering blank.
- **SC-005**: In manual visual review, a user can inspect and switch states for any listed subject in under 10 seconds from entering the storybook.

## Assumptions

- The first slice of the storybook focuses on subjects that already participate in the current visual-template and animation-state systems rather than inventing new subject categories.
- A single-subject preview is sufficient for initial asset verification even when the subject normally appears in a map or battle context.
- Directional or transitional asset review can start from a sensible default presentation per subject, with deeper sequencing or playback controls deferred to later work.
- The storybook reuses existing supported state vocabularies rather than defining new storybook-only state names.
- No new external dependency is required; the feature should reuse the current menu, rendering, and scene-management patterns already present in the project.

## Out of Scope

- Editing assets, importing files, or replacing visuals directly from the storybook.
- Advanced animation timelines, frame scrubbing, playback speed controls, or side-by-side comparison tools.
- Bulk export, screenshot capture, or automated asset approval workflows.
- New gameplay-only subject types that do not yet participate in the existing visual-template system.
- Asset authoring guidance beyond what is needed to preview and review currently supported states.
