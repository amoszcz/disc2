# Data Model: Unit And Object Animation States

## Animation State Catalog

Represents the complete approved vocabulary of animation states that the game may request for heroes, battle units, and eligible map objects.

### Fields

- `heroStateGroups`: state groups for map-hero behavior such as directional locomotion and non-directional outcome states
- `battleUnitStateGroups`: state groups for combat-ready, action, reaction, and outcome moments
- `objectStateGroups`: gameplay-relevant object-state variants by object type or object category
- `fallbackPolicies`: category-level rules for what visual state to use when a dedicated state asset is unavailable
- `mvpCoverage`: the minimum required subset of states for first-slice implementation

### Relationships

- Supplies approved state names to per-subject animation profiles
- Constrains what the rendering layer may request from dedicated assets
- Is referenced by validation contracts and asset-preparation guidance

### Validation Rules

- Every required state named in the feature spec must appear in the catalog
- Optional states must be explicitly identified as optional rather than implied
- State names must remain stable enough for renderer logic, tests, and asset creators to reference consistently

## Hero Directional State

Represents a map-hero state that combines a locomotion meaning with a facing direction.

### Fields

- `stateName`: one of `idle`, `start-move`, `walk`, or `stop-move`
- `direction`: one of `up`, `down`, `left`, or `right`
- `requiredForMvp`: whether the state is required in the MVP asset set
- `fallbackStateName`: the stable fallback state used if the dedicated directional variant is unavailable

### Relationships

- Belongs to the Animation State Catalog
- Is selected from hero map activity such as standing, starting movement, moving, or stopping
- May resolve to dedicated assets or fallback presentation through the render layer

### Validation Rules

- Only the four supported directions are valid in the first slice
- Every locomotion state must define a valid fallback path
- Direction changes must resolve deterministically to the latest requested direction

## Hero Event State

Represents a non-directional hero state tied to a discrete event rather than continuous locomotion.

### Fields

- `stateName`: one of `interact`, `victory`, `hurt`, or `perish`
- `triggerMoment`: gameplay meaning that causes the event state to be requested
- `requiredForMvp`: whether the state is included in first-slice implementation
- `fallbackStateName`: the stable fallback state if a dedicated event asset is unavailable

### Relationships

- Belongs to the Animation State Catalog
- Is selected by map interaction, success, damage, or defeat moments

### Validation Rules

- Event states must not require new gameplay mechanics to exist
- A fallback path must remain available when a dedicated event asset is absent

## Battle Unit State Profile

Represents the allowed and required animation states for a specific unit type or combat role.

### Fields

- `unitName` or `unitRole`: subject identifier for the profile
- `supportedStates`: relevant subset of `idle`, `ready`, `attack`, `cast`, `shoot`, `hit`, `defend`, `wait`, `victory`, and `perish`
- `attackCategoryAlignment`: relationship between supported action states and current attack categories such as melee, ranged, or area
- `requiredForMvp`: minimum states required for the first slice
- `fallbackPolicies`: default state substitutions when a dedicated state is unavailable

### Relationships

- Belongs to the Animation State Catalog
- Is referenced by battle rendering and targeting-driven feedback
- Aligns with existing battle rules and attack categories

### Validation Rules

- A unit profile may include only states that make sense for its gameplay role
- Every supported action category must resolve to either a dedicated state or a documented fallback
- Outcome states such as `victory` and `perish` must remain visually distinct from idle/action states

## Object State Variant Profile

Represents the meaningful animation-state coverage for a map object type.

### Fields

- `objectType`: supported map object identity such as bridge, teleport, guarded site, exit, or pickup
- `supportedStates`: relevant subset of object states such as `idle`, `active`, `blocked`, `open`, `claimed`, or `depleted`
- `requiredStates`: states the game expects for that object type
- `optionalStates`: extra variants that may be added later without changing the catalog vocabulary
- `fallbackStateName`: stable object-state fallback when a dedicated variant is absent

### Relationships

- Belongs to the Animation State Catalog
- Aligns with gameplay meaning for current map objects and guarded-location states

### Validation Rules

- Objects without meaningful state change may remain idle-only
- States must reflect real gameplay meaning rather than speculative future behavior
- Required states must be documented separately from optional polish states

## Animation Request

Represents one renderer-facing request for the visual state that should be shown for a subject at a given gameplay moment.

### Fields

- `subjectKind`: `hero`, `unit`, or `object`
- `subjectType`: stable subject identity such as `Aren`, `Militia`, `teleport`, or `resource-site`
- `requestedStateName`: approved state name from the catalog
- `direction`: optional facing direction for directional hero states
- `sceneContext`: `map` or `battle`
- `fallbackAllowed`: whether the renderer may resolve to a backup state

### Relationships

- Produced from gameplay and render context
- Consumed by the animation-aware visual resolver
- Resolves against the Animation State Catalog and per-subject profiles

### Validation Rules

- Requested state names must come from the approved catalog
- Direction is allowed only for directional state families
- A request must always resolve to a renderable result for supported content

## State Resolution Result

Represents the render-ready outcome of matching a requested subject state to a dedicated asset or fallback.

### Fields

- `resolvedStateName`: final state chosen for rendering
- `resolvedFrom`: specific subject-profile or fallback path used
- `assetKind`: dedicated or fallback
- `assetReference`: asset source or sprite-sheet region when available
- `isFallback`: whether the resolution used fallback behavior
- `readabilityLabel`: short human-readable description for diagnostics and tests

### Relationships

- Produced from an Animation Request
- Consumed by map or battle rendering helpers and diagnostics

### Validation Rules

- Resolution must always produce a visible result for supported subjects
- Fallback resolution must remain readable and non-empty
- The same request should resolve consistently unless the catalog or asset coverage changes
