# Contract: Storybook Preview Readability

## Purpose

Define how preview subjects, state selectors, isolated tiles, and fallback behavior must read to the user inside the asset storybook.

## Preview Listing Contract

- The storybook must list every currently supported preview subject that participates in the game's visual-template system.
- Each entry must present a readable subject label, subject category, preview tile, and adjacent state-selection control.
- Subject entries must remain understandable without requiring the viewer to know the currently loaded scenario.

## Shared Resolution Contract

- Storybook preview rendering must use the same subject-resolution logic as gameplay for heroes, battle units, movement objects, guarded locations, and other supported visual subjects.
- The storybook must not rely on a storybook-only asset mapping that can drift from gameplay.
- State changes in the storybook must preserve the same dedicated-versus-fallback distinction the game already uses.

## Isolated Tile Contract

- Each storybook preview must be rendered in a single-subject tile rather than a full map or battle layout.
- The isolated tile must keep the subject large and readable enough for visual inspection.
- Subject context that is irrelevant to asset inspection should be omitted rather than simulated.

## State Selection Contract

- Each subject's selector must expose only states that are meaningful or reviewable for that subject.
- Changing the selected state must update the preview in a visually observable way.
- Subjects with one reviewable state must still present a stable, non-misleading control or state label.

## Fallback Review Contract

- When a selected state lacks a dedicated asset, the preview must remain visible through fallback rendering.
- Fallback outcomes must remain readable enough for reviewers to notice both the subject and the missing dedicated coverage.
- Diagnostics or public seams should still allow tests to verify the originally requested state and the resolved fallback result.

## Acceptance Signals

- A browser test can open the storybook, switch states for at least one hero, one battle unit, and one object entry, and observe preview changes.
- An integration or contract test can prove that a storybook preview request resolves through the same resolver path used by gameplay.
