# Research: Switch Visual Templates

## Decision: Keep each selectable template in one catalog as a validated PNG/JSON pair with one stable identifier

**Rationale**: The feature's pairing convention is a same base filename. One catalog holds source descriptors with identifier, display label, image URL, map URL, and readiness/error status. All three surfaces and the game configuration consume that catalog rather than independently scanning or guessing filenames.

**Alternatives considered**:

- Keep the current hard-coded runtime sheet and add a second special WIP path: rejected because it would not scale beyond two templates and would make selector behavior inconsistent.
- Let each screen discover files separately: rejected because screens could disagree on availability and active selection.
- Use arbitrary user-provided URLs: rejected because the feature is for repository-provided assets and mapper persistence must stay constrained.

## Decision: Preserve one active template in session state and pass its resolved catalog to all render surfaces

**Rationale**: The specification requires a selection made in gameplay, storybook, or mapper to be reflected in the other two during the same session. Session state is the existing cross-scene mechanism and avoids persistence requirements outside scope.

**Alternatives considered**:

- Maintain one independent selector value per screen: rejected because it violates cross-surface consistency and makes comparison ambiguous.
- Persist the choice in browser storage: rejected because cross-session persistence is explicitly out of scope.
- Reload the application when selecting: rejected because it would lose game progress and storybook selections.

## Decision: Load runtime frame data from the selected JSON map through a catalog adapter

**Rationale**: Current gameplay and storybook both resolve from the visual-template catalog. Translating a selected map into that catalog shape lets both surfaces keep the same resolver and fallback behavior, while the source image and crop coordinates change together.

**Alternatives considered**:

- Implement a second renderer for selected templates: rejected because previews would diverge from gameplay resolution rules.
- Require identical maps and retain hard-coded frame coordinates: rejected because the map is the requested editable source of truth.
- Treat a missing selected state as a selection failure: rejected because existing fallback behavior must remain visible.

## Decision: Make mapper requests template-scoped and validate the identifier server-side

**Rationale**: The existing mapper already needs a local Vite write boundary. Sending a registered template identifier with load and save requests keeps the selected source explicit while allowing the middleware to map it to a known PNG/JSON pair. It never accepts a file path from the browser.

**Alternatives considered**:

- Permit the client to provide image/map paths: rejected because it expands local file access beyond the declared asset roots.
- Continue using one fixed endpoint/source: rejected because saves could silently affect the wrong template.
- Use browser downloads instead of selected-map saves: rejected because mapper saving is in scope and already established.

## Decision: Prompt before switching a dirty mapper source and preserve all other session state

**Rationale**: A template switch replaces the loaded mapper document, so it has the same risk as leaving the mapper with pending edits. Reusing the established discard confirmation keeps the workflow safe. Gameplay progress and storybook choices are unrelated and must stay intact.

**Alternatives considered**:

- Automatically discard mapper edits: rejected because it risks data loss.
- Keep edits globally across templates: rejected because a change set belongs to exactly one atlas and could be applied to the wrong map.
- Block all template changes during gameplay: rejected because live comparison is an explicit acceptance scenario.
## Decision: Define the new-session default as a catalog identifier in game configuration

**Rationale**: Game configuration already defines application-level defaults. Keeping only a template identifier there makes the selected default explicit and testable while preserving the catalog as the authority for paths, labels, and validity.

**Alternatives considered**:

- Mark one catalog entry as default inside catalog metadata: rejected because it couples source inventory to game policy.
- Let the first catalogued item be default: rejected because file ordering is not an intentional configuration choice.
- Hard-code the default in each scene: rejected because the surfaces could diverge.
