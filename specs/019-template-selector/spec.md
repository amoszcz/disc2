# Feature Specification: Switch Visual Templates

**Feature Branch**: `019-template-selector`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "the app uses currently one template to display objects at their states. the template is a png file with json maps. there is another map in wip folder. i would like to be able to switch between templates in game, storybook and assets mapper. lets assume that template files should have the same name png and json. lets select template using dropdown."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose a Visual Template for Gameplay (Priority: P1)

As a player or developer, I can choose an available visual template before or during gameplay so that I can view the same game objects and states using a different complete artwork set.

**Why this priority**: Gameplay is the primary rendering surface, so template selection must change the visuals players actually see.

**Independent Test**: Open the game, choose each available template from the template selector, and verify through an acceptance-style flow that a rendered object uses the selected template while remaining playable.

**Acceptance Scenarios**:

1. **Given** two or more valid template pairs are present in the template catalog, **When** the user opens the game template selector, **Then** every available template is listed as a selectable option and the configured default is initially active.
2. **Given** the user selects a different valid template, **When** a game scene renders an object in a supported state, **Then** the object uses the selected template's mapping and remains visible.
3. **Given** the user changes templates while a game session is active, **When** the next render occurs, **Then** the current game state is preserved and only its visual template changes.

---

### User Story 2 - Review a Chosen Template in the Storybook (Priority: P1)

As a developer or artist, I can select a visual template in the asset storybook so that I can compare how supported subjects and their states appear in each available artwork set.

**Why this priority**: The storybook is the focused visual-review surface and needs to use the same selection as gameplay for trustworthy comparison.

**Independent Test**: Open the storybook, select each available template, switch a preview subject between supported states, and verify that every preview resolves through the selected template.

**Acceptance Scenarios**:

1. **Given** the asset storybook is open, **When** the user selects a template from its selector, **Then** displayed previews update to use that template.
2. **Given** a storybook preview is using a selected template, **When** the user selects another valid state for the subject, **Then** the preview uses that template's mapping for the selected state.
3. **Given** the user selects a template in either gameplay or the storybook, **When** they move to the other surface, **Then** the same selected template is shown as active.

---

### User Story 3 - Select an Atlas in the Asset Mapper (Priority: P1)

As a developer, I can choose an available template in the asset mapper so that I can inspect and correct the image and coordinate map for the exact artwork set I intend to use.

**Why this priority**: The mapper must work against the selected source pair, including the existing work-in-progress atlas, to support visual asset development safely.

**Independent Test**: Open the asset mapper, choose each available template, and verify that its image, coordinate entries, previews, and any save operation are all scoped to the selected pair.

**Acceptance Scenarios**:

1. **Given** the asset mapper is open, **When** the user chooses a template, **Then** the mapper loads that template's paired image and coordinate map for review.
2. **Given** the user switches templates in the asset mapper, **When** the new template loads, **Then** its gallery and selected-entry details reflect only its own coordinate map.
3. **Given** the user saves a corrected coordinate map for a selected template, **When** the save completes, **Then** only that selected template's coordinate map is changed.

### Edge Cases

- What happens when an image has no same-named coordinate map, or a coordinate map has no same-named image? The incomplete pair is not selectable and the user receives a clear explanation.
- What happens when the selected pair cannot be read or its coordinates are invalid? The affected surface reports the validation problem and keeps the current rendering or review state usable.
- What happens when a supported subject or state is absent from the selected template? The established fallback presentation remains visible rather than producing a blank result.
- What happens when the user has unsaved mapper alignment changes and selects another template? The mapper warns the user before discarding those changes.
- What happens when only one valid template pair is available? The selector remains clear about the active template and does not prevent use of the surface.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST keep every visual template pair in one shared template catalog.
- **FR-002**: The system MUST identify each catalogued template as paired image and coordinate-map files that share the same base name.
- **FR-003**: The system MUST treat a catalogued template as available only when both members of its same-named pair are present and valid enough to load.
- **FR-004**: The shared catalog MUST include the existing template pair and the work-in-progress template pair when both are available.
- **FR-005**: The game configuration MUST explicitly define the default template using an identifier from the shared catalog.
- **FR-006**: When a session begins, the system MUST use the configured default template unless the user selects another available template.
- **FR-007**: The system MUST provide a visible dropdown selector for choosing an available template in gameplay, the asset storybook, and the asset mapper.
- **FR-008**: Each selector MUST identify the currently active template and list every available template exactly once.
- **FR-009**: Selecting a template MUST cause gameplay object and state rendering to resolve against that template's coordinate map and image.
- **FR-010**: Selecting a template MUST cause storybook previews and state changes to resolve against that template's coordinate map and image using the same visual-resolution rules as gameplay.
- **FR-011**: Selecting a template in the asset mapper MUST load and review that template's paired image and coordinate map.
- **FR-012**: A saved mapper correction MUST affect only the coordinate map belonging to the currently selected template.
- **FR-013**: The active template selection MUST stay consistent when the user moves between gameplay, the storybook, and the asset mapper during the same session.
- **FR-014**: Changing templates MUST preserve gameplay progress, storybook subject/state choices where still valid, and mapper data belonging to other templates.
- **FR-015**: The system MUST clearly report unavailable, unreadable, incomplete, or invalid template pairs without presenting them as usable selections.
- **FR-016**: When the selected template has no mapping for a supported subject or state, the system MUST retain the project's readable fallback rendering behavior.
- **FR-017**: The asset mapper MUST protect unsaved corrections when the user attempts to switch to another template.

### Key Entities *(include if feature involves data)*

- **Visual Template**: A complete selectable artwork source made of one image and one coordinate map with the same base name.
- **Template Catalog**: The single authoritative collection of all known visual template pairs and their availability.
- **Template Pair**: The matched image and coordinate-map files that together define one visual template.
- **Game Template Configuration**: The game configuration setting that names the catalogued template used when a new session starts.
- **Active Template**: The visual template selected for the current session across gameplay and review surfaces.
- **Template Selector**: The dropdown control that lists valid visual templates and changes the active one.
- **Template Mapping**: The selected template's coordinate definitions that resolve a subject and state to artwork within its paired image.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid same-named image and coordinate-map pairs in the shared catalog are available in the selectors across gameplay, the storybook, and the asset mapper.
- **SC-002**: In validation flows, 100% of tested template changes update the gameplay and storybook visual result without changing the underlying game or preview state.
- **SC-003**: In validation flows, 100% of mapper saves modify only the selected template's coordinate map.
- **SC-004**: In validation flows, 100% of incomplete or invalid template pairs are prevented from being selected and are accompanied by a readable explanation.
- **SC-005**: A user can select a different valid template and see the updated visual result in each surface within 5 seconds.

## Assumptions

- A template image is a PNG file and its coordinate map is a JSON file; both use the same base filename.
- The configured default template identifies a ready entry in the shared template catalog.
- The current template pair and the work-in-progress pair are stored in project-provided asset locations and can be made available without a user upload workflow.
- Template selection is a session-level development and review setting; persistence across separate browser sessions is not required for this feature.
- Existing fallback rendering remains the default result for an unmapped subject or state.
- The asset mapper's existing validation and save rules continue to apply separately to each selected template.

## Out of Scope

- Creating, uploading, deleting, or renaming template image or coordinate-map files from the application.
- Letting an individual screen define a separate template list or default template.
- Editing individual sprite rectangles beyond the asset mapper's existing correction workflow.
- Requiring every template to have identical subject or state coverage before it can be reviewed.
- Persisting a user's template choice across separate browser sessions or sharing it between users.
