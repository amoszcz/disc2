# Research: Sprite Mapping Tool

## Decision: Treat the atlas correction as one shared coordinate translation

**Rationale**: The requested interaction is panning the whole image while mapped crop boundaries stay fixed. That corresponds directly to one horizontal and vertical offset applied to every mapping entry at save time. It makes the review result easy to reason about and preserves all per-entry crop and metadata values.

**Alternatives considered**:

- Per-entry drag and resize editing: rejected for the first slice because it conflicts with the requested whole-image alignment workflow and expands validation substantially.
- Automatically infer crop locations: rejected because visual developer judgment is the stated requirement and image recognition is unnecessary scope.
- Change only the declared sheet dimensions: rejected because a dimension mismatch does not itself move the mapped crop rectangles.

## Decision: Use the actual decoded image dimensions for review and validation

**Rationale**: The current supplied WIP PNG and JSON both report 1024 × 1536, but atlas sources can diverge during future asset iteration. The editor must report any mismatch and use the decoded image dimensions to determine whether preview and saved crop rectangles are valid.

**Alternatives considered**:

- Trust JSON dimensions: rejected because the tool would approve invalid crops against the real image.
- Silently replace JSON dimensions: rejected because the mismatch is useful diagnostic information and must be visible to the developer.

## Decision: Provide a local development-only persistence adapter

**Rationale**: A browser page cannot safely overwrite repository files by itself. A small Vite development middleware can validate and persist only the configured WIP JSON while the app is running locally, making Save real without adding a backend product or external dependency. Production and preview modes remain read-only and clearly communicate that saving is unavailable.

**Alternatives considered**:

- Download a corrected JSON file: rejected because the requested workflow is to update the mapping map, not create a manual replacement file.
- General-purpose file upload/write access: rejected because it creates unnecessary write scope and a larger security surface.
- Add a standalone server framework: rejected because the local Vite server is already present and sufficient.

## Decision: Reuse the main menu/scene composition but not the runtime visual-template catalog

**Rationale**: The storybook provides a familiar developer-review entry point and Canvas presentation pattern. The mapping tool must load raw WIP data and display invalid mappings, while the runtime catalog is curated and may hide or normalize those problems. Keeping the editor separate prevents accidental gameplay behavior changes.

**Alternatives considered**:

- Add editing directly to the existing storybook: rejected because it would mix curated runtime previews with raw WIP validation and persistence concerns.
- Modify the gameplay renderer to support editor interaction: rejected because normal rendering should remain independent of developer tooling.

## Decision: Validate the entire adjusted map before allowing Save

**Rationale**: A shared offset may make some entries invalid even when a selected sprite looks correct. Whole-map validation prevents partially correct output and preserves a reliable coordinate map.

**Alternatives considered**:

- Save only selected entries: rejected because the requested correction is global and would leave the map internally inconsistent.
- Save and flag invalid entries afterward: rejected because it persists data known to be invalid.
