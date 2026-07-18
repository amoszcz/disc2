# Feature Specification: Sprite Mapping Tool

**Feature Branch**: `015-sprite-mapping-tool`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Create a developer page for previewing the WIP PNG sprite sheet against its coordinate JSON, panning the whole image to correct alignment, reviewing all assets like a storybook, and saving corrected map coordinates."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Mapped Sprite Previews (Priority: P1)

As a developer, I can open a dedicated sprite mapping page and inspect every coordinate-map entry as a labeled preview of the WIP sprite sheet so that I can immediately identify incorrect crops.

**Why this priority**: Visual review is the prerequisite for correcting atlas data; without it, the current coordinate map cannot be trusted or efficiently repaired.

**Independent Test**: Open the developer page with the supplied WIP PNG and coordinate JSON, confirm every listed entry has a labeled preview, and verify that selecting an entry identifies its current map coordinates and crop dimensions.

**Acceptance Scenarios**:

1. **Given** the WIP sprite image and its coordinate map are available, **When** the developer opens the sprite mapping page, **Then** the source image and every mapped asset entry are loaded for review.
2. **Given** the mapping page is open, **When** the developer views the asset gallery, **Then** every mapped entry is shown with its display name or subject identity, state, current crop dimensions, and a preview based on its current coordinates.
3. **Given** the developer selects an asset entry, **When** its detail view appears, **Then** the page clearly identifies the selected entry and its current coordinate values.
4. **Given** a mapped coordinate falls outside the source image or produces no visible crop, **When** the page renders that entry, **Then** the entry is visibly flagged instead of silently appearing valid.

---

### User Story 2 - Align the Source Image Against Map Coordinates (Priority: P1)

As a developer, I can pan the source image under the fixed coordinate overlays and see every sprite preview update live so that I can align the sheet with the existing coordinate map by eye.

**Why this priority**: The atlas data is known to be offset from the supplied image. Live alignment is the core correction workflow.

**Independent Test**: Select a recognizable sprite, pan the source image in the mapping canvas, and verify the selected crop and gallery previews move consistently while the displayed horizontal and vertical alignment offset changes.

**Acceptance Scenarios**:

1. **Given** a loaded mapping page, **When** the developer drags the source image in the alignment canvas, **Then** the image pans while the coordinate-map crop boundaries remain fixed in their mapped positions.
2. **Given** the developer changes the alignment offset, **When** the gallery and selected preview update, **Then** every preview reflects the same live image translation.
3. **Given** the developer has panned the source image, **When** they inspect the active alignment values, **Then** the horizontal and vertical offsets are visible in source-image coordinate units.
4. **Given** the developer wants to discard a trial alignment, **When** they reset the alignment, **Then** the initial coordinate-map alignment is restored without changing the saved map.

---

### User Story 3 - Save a Corrected Coordinate Map (Priority: P1)

As a developer, I can save the validated alignment so that every coordinate-map entry is updated consistently and future game rendering uses the corrected coordinates.

**Why this priority**: Reviewing and panning only create value if the developer can persist the chosen correction rather than manually editing every entry.

**Independent Test**: Apply a non-zero alignment offset, save it, reload the mapping data, and verify each entry's saved coordinate values are shifted by the selected offset while its identity, size, anchors, and other metadata are unchanged.

**Acceptance Scenarios**:

1. **Given** the developer has changed the alignment offset, **When** they choose Save, **Then** the coordinate map is updated using that one shared horizontal and vertical correction for every mapped entry.
2. **Given** a save finishes successfully, **When** the developer reloads the mapping page, **Then** the corrected coordinates are loaded and the alignment offset returns to zero because the correction is now part of the map.
3. **Given** a shared correction would move one or more mapped crops outside the source-image bounds, **When** the developer attempts to save, **Then** the page identifies the affected entries and does not save until the developer chooses an in-bounds alignment.
4. **Given** the developer has made an unsaved adjustment, **When** they attempt to leave or load a different atlas, **Then** the page warns that the correction has not been saved.

### Edge Cases

- What happens when the coordinate map references an image file that cannot be loaded? The page must explain that the mapping cannot be reviewed or saved until the correct image is available.
- What happens when the JSON is unreadable or contains no sprite entries? The page must show a clear validation error and must not offer a misleading save action.
- What happens when the declared sheet dimensions differ from the actual loaded image dimensions? The page must visibly report the mismatch and use the actual image dimensions for bounds checks and preview alignment.
- What happens when an entry has a negative coordinate, non-positive crop size, or crop bounds outside the image? The entry must be flagged and excluded from a successful save until its data is valid.
- What happens when one shared translation cannot correct a deliberately malformed individual entry? The tool must preserve that entry's separate validation warning rather than implying that the global alignment repaired it.
- What happens when the gallery contains more entries than fit on screen? The developer must be able to review all entries without losing the active alignment or selection.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a dedicated developer-facing sprite mapping page separate from ordinary game play.
- **FR-002**: The page MUST load the supplied WIP PNG sprite sheet and its coordinate-map JSON as a paired atlas source.
- **FR-003**: The page MUST display the actual loaded image dimensions and the dimensions declared by the coordinate map.
- **FR-004**: The page MUST identify and visibly warn about a mismatch between declared and actual image dimensions.
- **FR-005**: The page MUST present every coordinate-map entry in a review gallery with its identity, state where supplied, crop dimensions, and current visual preview.
- **FR-006**: The page MUST let the developer select an entry to inspect its full current coordinate values and visual crop.
- **FR-007**: The page MUST show the source image in an alignment canvas with the selected entry's coordinate-map crop boundary visible.
- **FR-008**: The page MUST let the developer pan the whole source image horizontally and vertically while coordinate-map crop boundaries remain fixed.
- **FR-009**: The page MUST apply the current shared pan offset to every gallery and selected-entry preview immediately.
- **FR-010**: The page MUST display the current shared horizontal and vertical alignment offsets in source-image coordinate units.
- **FR-011**: The page MUST let the developer reset an unsaved alignment to the original coordinate-map position.
- **FR-012**: The page MUST flag every entry with invalid coordinates, invalid dimensions, or crop bounds outside the actual source image.
- **FR-013**: The page MUST prevent saving while any entry would be out of bounds after applying the selected shared offset.
- **FR-014**: The page MUST provide an explicit Save action that updates every mapped entry's coordinates by the same selected horizontal and vertical offset.
- **FR-015**: Saving a shared alignment MUST preserve each entry's identity, state, crop dimensions, anchor values, and other non-coordinate metadata.
- **FR-016**: After a successful save, the page MUST reload the corrected coordinate map and show a zero unsaved alignment offset.
- **FR-017**: The page MUST warn the developer before discarding an unsaved alignment through navigation or loading another atlas source.
- **FR-018**: The page MUST report readable errors when the image or coordinate map cannot be loaded or validated.

### Key Entities *(include if feature involves data)*

- **Sprite Atlas Source**: The paired sprite image and coordinate-map document being reviewed by the developer.
- **Sprite Mapping Entry**: One coordinate-map record that identifies a subject, optional state or direction, crop rectangle, anchors, and related metadata.
- **Alignment Offset**: The unsaved shared horizontal and vertical translation applied to the source image during visual review.
- **Crop Boundary**: The fixed coordinate-map rectangle against which the panned source image is evaluated.
- **Preview Gallery Entry**: The rendered review representation of one Sprite Mapping Entry under the current Alignment Offset.
- **Mapping Validation Result**: The valid, warning, or invalid status for an atlas source or individual Sprite Mapping Entry.
- **Saved Mapping Revision**: The coordinate map after a successful shared alignment has been applied and persisted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With the supplied WIP atlas, 100% of coordinate-map entries appear in the review gallery with an identity label and preview or a visible validation warning.
- **SC-002**: In alignment interaction testing, 100% of gallery previews and the selected crop update consistently after a shared pan offset is changed.
- **SC-003**: In save-and-reload testing, 100% of valid map entries receive the selected shared horizontal and vertical coordinate adjustment, while 100% retain their pre-save non-coordinate metadata.
- **SC-004**: In invalid-data testing, 100% of out-of-bounds or malformed entries are identified before save, and no invalid coordinate map is persisted.
- **SC-005**: In developer usability testing, at least 90% of tested developers can select a recognizable sprite, align the image, and save a corrected map without manually editing JSON.

## Assumptions

- The WIP atlas consists of the PNG and JSON currently stored together under `wip/sprite-atlas/`.
- The initial correction workflow is a shared translation of the source image, because the developer requested panning the whole image; it applies the same horizontal and vertical coordinate adjustment to every entry.
- Individual crop resizing, per-entry repositioning, rotation, scaling, image replacement, and automatic sprite detection are not required for the first version.
- The existing storybook is a reference for reviewability, but the new page is a separate developer tool and does not need to change normal game play.
- Saving is intentionally explicit and is expected to update the selected coordinate-map source only after validation succeeds.

## Out of Scope

- Editing individual entry width, height, anchors, labels, states, directions, or subject identity.
- Correcting atlas rotation, scale, perspective, or non-uniform per-entry errors.
- Generating a new sprite sheet, new artwork, or coordinate map automatically.
- Exposing the developer tool as a player-facing game feature.
- Replacing the existing storybook or modifying ordinary map and battle rendering as part of this first slice.

## Amendment: Independent Crop Editing, Zoom, Drag, and Resize

The following requirements supersede the original shared-offset-only assumptions while keeping the review and safe-save goals intact.

### User Story 4 - Independently Edit and Inspect a Crop (Priority: P1)

As a developer, I can select a mapping entry, edit only its x/y values, and zoom the review canvas, so I can make precise corrections without changing unrelated entries.

**Acceptance Scenarios**:

1. Editing the selected entry's x/y updates only that entry's preview, boundary, and validation result.
2. Zooming or visual panning changes only the review view and does not change any mapping data.
3. The selected crop boundary remains visible at every supported zoom level.

### User Story 5 - Drag and Resize the Selected Crop (Priority: P1)

As a developer, I can drag the image beneath the selected crop boundary and adjust its width and height with independent sliders, so I can correct the complete crop rectangle visually.

**Acceptance Scenarios**:

1. A canvas drag updates only the selected entry's proposed x/y values, converted correctly for the active zoom level.
2. Width and height sliders update only the selected entry's proposed dimensions and preview boundary.
3. A resized or repositioned crop outside the image is visibly invalid and cannot be saved.

### User Story 6 - Save Mixed Crop Corrections (Priority: P1)

As a developer, I can save valid changes to x, y, width, and height for multiple selected entries together, so corrected rectangles persist while unedited entries and metadata remain intact.

**Acceptance Scenarios**:

1. A successful save persists changed x/y/width/height values and reloads the map with no pending edits.
2. An invalid crop anywhere in the pending change set blocks the entire save without partial writes.
3. Leaving with unsaved crop changes shows a discard warning.

### Additional Functional Requirements

- **FR-019**: The page MUST allow independent x/y overrides for an individual selected entry; an entry override takes precedence over an optional shared alignment adjustment.
- **FR-020**: The page MUST provide bounded zoom-in, zoom-out, and reset-view controls that do not change mapping data.
- **FR-021**: Canvas dragging MUST update only the selected entry's proposed x/y values using source-image coordinates adjusted for the active zoom.
- **FR-022**: The page MUST provide independent width and height sliders for the selected entry, with visible whole-pixel values and a minimum value of one.
- **FR-023**: Every preview, boundary, validation result, and save operation MUST use the selected entry's effective x/y/width/height rectangle.
- **FR-024**: A save MUST preserve all unedited entries and all non-rectangle metadata while persisting valid changed rectangle fields.

### Updated Assumptions and Scope

- The mapping tool now supports independent per-entry crop rectangles; the original shared alignment remains optional bulk behavior, not the only correction workflow.
- Width and height are editable only for the selected entry through independent whole-pixel sliders.
- Rotation, freeform crop handles, and editing identity/state/anchor metadata remain out of scope.
