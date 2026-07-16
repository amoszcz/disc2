# Contract: Animation State Catalog

## Purpose

Define the approved vocabulary and coverage rules for hero, battle-unit, and object animation states before detailed sprite production begins.

## Catalog Guarantees

- Every supported hero, battle unit, and eligible map object must resolve through a named animation-state vocabulary rather than ad hoc one-off state names.
- The catalog must distinguish required states from optional states for each subject category.
- The same named state must carry the same gameplay meaning wherever it is reused.
- The first slice may defer frame counts and timing, but it must not leave required state names ambiguous.

## Hero State Guarantees

- Map heroes must support directional variants for `idle`, `start-move`, `walk`, and `stop-move`.
- Supported directions in the first slice are `up`, `down`, `left`, and `right`.
- Heroes must also support non-directional event states for `interact`, `victory`, `hurt`, and `perish`.
- If a dedicated directional or event state is missing, the system must retain a readable fallback state.
- Current implementation ships one dedicated hero profile for `Aren`.
- `Aren` requires `idle`, `start-move`, `walk`, `stop-move`, `interact`, `victory`, and `perish`, and accepts `hurt` as an optional extension.
- Hero diagnostics must report the requested state name, the resolved state name, and the active facing direction when a directional state is requested.

## Battle Unit State Guarantees

- Battle units must be able to express `idle`, `ready`, `attack`, `cast`, `shoot`, `hit`, `defend`, `wait`, `victory`, and `perish` at the catalog level.
- A specific unit type may use only the subset that matches its combat role.
- Current combat action categories must map cleanly to the vocabulary rather than inventing new action names per unit.
- Outcome states must remain distinguishable from idle and action states.
- Current dedicated battle profiles are:
- `Militia`, `Skeleton`, and `Stone Watcher`: `idle`, `ready`, `attack`, `hit`, `defend`, `wait`, `victory`, `perish`
- `Archer` and `Skeleton Archer`: `idle`, `ready`, `shoot`, `hit`, `defend`, `wait`, `victory`, `perish`
- `Mage`: `idle`, `ready`, `cast`, `hit`, `defend`, `wait`, `victory`, `perish`
- If a unit requests an unsupported state, the resolver must fall back to that unit profile's nearest readable idle-like state instead of returning no asset.

## Object State Guarantees

- Objects may use gameplay-relevant states such as `idle`, `active`, `inactive`, `blocked`, `open`, `claimed`, `depleted`, `damaged`, `destroyed`, `highlighted`, and `selected`.
- Objects without meaningful state change may remain explicitly idle-only.
- Required object states must reflect current gameplay meaning rather than speculative future polish.
- Missing object variants must degrade to a stable fallback instead of leaving the object undefined.
- Current movement-object profiles are:
- `bridge`, `milestone`, and `rubble`: `idle`
- `cave`, `teleport`, and `exit`: `idle`, `active`
- Current guarded-location profiles are:
- `resource-site`: `blocked`, `open`
- `city`: `blocked`, `open`
- Resolver diagnostics must preserve whether the final result came from a dedicated asset mapping or from a placeholder fallback.

## Maintenance Notes

- New units, heroes, or objects should add approved state-profile entries before renderer-specific logic changes.
- Asset creators should rely on the catalog vocabulary rather than inventing custom filenames or states outside the contract.
- Detailed frame-count and timing decisions can evolve later as long as they do not redefine the approved state meanings in this contract.
- State support is currently declared in `src/render/sprites/visualTemplateCatalog.ts` and enforced during lookup in `src/render/sprites/visualTemplateResolver.ts`.

## Acceptance Signals

- A tester can list the required and optional states for current heroes, battle units, and objects without referring to implementation code.
- An asset creator can prepare new art with clear expectations for state naming and required coverage.
