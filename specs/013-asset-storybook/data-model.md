# Data Model: Asset Storybook

## Storybook Session State

Represents the runtime state needed to open, navigate, and review preview subjects in the dedicated storybook scene.

### Fields

- `sceneMode`: includes the dedicated `storybook` mode
- `selectedStorybookSubjectId`: the currently focused preview subject, if the UI supports highlighting or primary focus
- `storyboardPreviewStates`: subject-specific selected state values for the storybook session
- `entryOrder`: the stable presentation order for storybook entries
- `lastMenuOrigin`: optional indicator that the user arrived from the main menu for safe return flow

### Relationships

- Lives alongside existing shared game state without mutating scenario progress
- Supplies the active state selection for each storybook preview entry
- Drives storybook sidebar controls and canvas preview rendering

### Validation Rules

- Storybook session state must not overwrite scenario progression, battle progression, or route state
- Every selected storybook state must correspond to a valid review option for the referenced subject
- Entry order must remain deterministic enough for repeatable tests and visual review

## Storybook Preview Subject

Represents one renderable item in the storybook, such as a hero, battle unit, movement object, guarded location, or other supported visual subject.

### Fields

- `subjectId`: stable storybook identifier
- `subjectKind`: subject category such as `hero`, `unit`, `movement-object`, or `guarded-location`
- `subjectType`: stable gameplay-facing identity such as `Aren`, `Archer`, `teleport`, or `resource-site:blocked`
- `displayName`: human-readable label shown in the storybook UI
- `sceneContext`: the context required for shared resolution logic such as `map` or `battle`
- `defaultStateName`: the initial state shown when the storybook opens
- `defaultDirection`: default facing direction when the subject uses directional hero states
- `previewTileStyle`: simple presentation metadata for sizing or framing the isolated preview tile

### Relationships

- Is backed by existing visual-template mappings and state profiles
- Has one or more Storybook State Options
- Resolves to a Preview Render Request when the storybook draws its tile

### Validation Rules

- Every storybook subject must be resolvable through existing gameplay visual logic
- A subject must appear only once per distinct review identity unless a separate state family requires a distinct entry
- `defaultStateName` must be one of the subject's supported review states

## Storybook State Option

Represents one selectable state in a preview subject's dropdown.

### Fields

- `stateName`: approved state vocabulary entry for the subject
- `label`: human-readable option label
- `isDirectional`: whether the state participates in directional hero preview behavior
- `direction`: optional default or fixed direction for a directional preview state
- `isFallbackReviewable`: whether the storybook should allow the user to inspect this state even when only fallback rendering is expected

### Relationships

- Belongs to a Storybook Preview Subject
- Produces a Preview Render Request when selected

### Validation Rules

- Only states meaningful for the subject may be exposed
- Direction may be supplied only for directional hero states
- A subject with one reviewable state must still expose a stable option set

## Preview Render Request

Represents the storybook-to-renderer request for one isolated preview tile.

### Fields

- `subjectKind`: category passed to shared resolution logic
- `subjectType`: gameplay-facing identifier
- `requestedStateName`: currently selected storybook state
- `stateDirection`: optional facing direction for directional previews
- `sceneContext`: `map` or `battle`
- `previewBounds`: isolated tile bounds used by the storybook renderer

### Relationships

- Derived from Storybook Preview Subject + Storybook State Option + current session state
- Consumed by shared resolver-backed preview rendering

### Validation Rules

- Requests must be representable without full map or battle reconstruction
- Every request must resolve to a visible template result, dedicated or fallback

## Preview Resolution Result

Represents the resolved storybook render outcome for a selected subject state.

### Fields

- `requestedStateName`: state requested by the storybook control
- `resolvedStateName`: actual state resolved for rendering
- `assetKind`: dedicated or fallback
- `readabilityLabel`: human-readable descriptor for diagnostics or UI hints
- `stateDirection`: facing direction retained in the preview
- `isFallback`: whether fallback resolution occurred

### Relationships

- Produced from a Preview Render Request through the shared visual resolver
- Can be surfaced through diagnostics, tests, or optional storybook metadata

### Validation Rules

- Resolution must never produce a blank result for a supported preview subject
- Fallback outcomes must remain visibly distinct enough for review
- The same request should resolve consistently unless mappings or assets change

## Storybook Menu Entry

Represents the main-menu action that opens the asset storybook scene.

### Fields

- `entryId`: stable action identifier
- `label`: visible menu label
- `description`: short explanation of the storybook's purpose
- `destinationSceneMode`: `storybook`

### Relationships

- Appears alongside existing scenario launch options in the main menu UI
- Triggers creation or activation of Storybook Session State

### Validation Rules

- The menu entry must remain reachable without an active scenario
- It must not be confused with scenario-start actions in the menu contract
