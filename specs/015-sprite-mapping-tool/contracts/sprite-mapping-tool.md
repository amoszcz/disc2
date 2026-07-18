# Contract: Sprite Mapping Tool

## Purpose

Define the developer-visible behavior and local save boundary for reviewing and correcting the WIP sprite atlas.

## Page Contract

- The developer can reach a Sprite Mapping page from the developer-facing menu area.
- The page loads the configured WIP PNG and JSON together and reports loading or validation failures clearly.
- The page shows actual image dimensions, declared map dimensions, and a visible mismatch warning when they differ.
- The gallery has one review entry per mapping record. Each entry shows identity, state/direction when present, crop size, preview, and validation status.
- Selecting an entry updates the alignment canvas and detail information without discarding the current shared offset.

## Alignment Contract

- The alignment canvas shows the source image beneath fixed coordinate-map crop boundaries.
- Pointer drag pans the source image and updates a shared x/y offset in source-image coordinate units.
- Every gallery preview and selected preview reflects the same current offset.
- Reset returns offset values and previews to their loaded-map state without persistence.
- A dirty unsaved offset causes a discard warning before leaving the page or replacing the atlas source.

## Validation and Save Contract

- The tool validates every adjusted crop against the actual decoded image dimensions.
- Invalid source data or any invalid adjusted entry disables Save and identifies all affected entries.
- A successful Save applies the same offset to each entry's x/y values only and preserves all other mapping metadata.
- The local save request accepts only the configured sprite-map document and a validated shared offset; it cannot write arbitrary paths or arbitrary repository files.
- Production and preview app modes report Save as unavailable and do not expose a writable route.
- After local Save succeeds, the editor reloads the persisted map and returns to zero unsaved offset.

## Amendment: Individual Crop Rectangle Contract

- Selected-entry x/y values may be edited directly or by dragging the image beneath the fixed selected boundary; dragging changes no other entry.
- Selected-entry width and height are independently adjustable as positive whole-pixel sliders.
- Zoom and review pan are visual-only and leave mapping values unchanged.
- The save request accepts pending per-entry rectangle overrides. The local boundary resolves and validates every resulting x/y/width/height rectangle atomically, then writes only those fields while preserving non-rectangle metadata.

## Amendment: Resolved Mapping Download Contract

- The page offers Download mapping JSON alongside Copy mapping JSON whenever a complete mapping document is loaded.
- Download serializes the same resolved mapping document used by copy, including pending crop rectangle overrides and all unchanged metadata.
- Download starts one `.json` file and does not invoke the local save boundary.
- Download remains available when clipboard access is unavailable.
- Download is unavailable before the mapping document loads and must not create an empty or malformed file.
- A successful download confirms the result. A failure to start one reports a readable error and retains pending edits, selection, and validation state.
