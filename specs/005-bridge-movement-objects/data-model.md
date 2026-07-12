# Data Model: Bridges and Movement Objects

## Movement Object Region

- **Purpose**: Defines a painted area that applies one supported movement-object type to every covered tile.
- **Fields**:
  - `id`
  - `objectType`
  - `coverage`
  - `priority`
- **Relationships**:
  - Belongs to one scenario map.
  - Contributes to the movement-object stack for every covered tile.
- **Validation Rules**:
  - Every region must reference a supported object type.
  - Coverage must resolve only to in-bounds tiles.
  - Priority must allow deterministic evaluation where overlapping object regions exist.

## Movement Object Type

- **Purpose**: Canonical definition of a supported static movement object and the kind of effect it contributes.
- **Fields**:
  - `name`
  - `effectKind`
  - `movementDelta`
  - `changesPassability`
  - `visualClass`
- **Relationships**:
  - Referenced by movement-object regions.
  - Contributes to resolved movement tiles and route feedback.
- **Validation Rules**:
  - Supported first-slice names are `bridge`, `milestone`, and `rubble`.
  - Bridge must convert covered river tiles into traversable cost-1 crossings.
  - Milestone reduces final cost by 1 to a minimum of 1.
  - Rubble increases final cost by 1.

## Resolved Movement Object Stack

- **Purpose**: The ordered set of all movement-object effects that apply to a tile after object-region membership is resolved.
- **Fields**:
  - `position`
  - `objectTypes`
  - `passabilityOverride`
  - `movementDeltaTotal`
  - `resolutionOrder`
- **Relationships**:
  - Derived from zero or more movement-object regions covering one tile.
  - Composed with the base terrain tile to create the resolved movement tile.
- **Validation Rules**:
  - Bridge passability overrides must apply before final movement-cost modifiers.
  - Final movement cost must clamp to a minimum of 1 after all supported deltas are combined.

## Resolved Movement Tile

- **Purpose**: The effective gameplay tile after combining terrain behavior with any covered movement-object effects.
- **Fields**:
  - `position`
  - `baseTerrainType`
  - `objectEffects`
  - `isTraversable`
  - `finalMovementCost`
  - `legalReason`
- **Relationships**:
  - Uses one resolved terrain tile plus one resolved movement-object stack.
  - Consumed by movement validation and route feedback.
- **Validation Rules**:
  - Unbridged river tiles remain blocked.
  - Bridged river tiles become traversable with final bridge cost unless other supported modifiers alter that cost.
  - Final cost can never be lower than 1.

## Bridge Placement Validation

- **Purpose**: Represents an authoring-time rule check for bridge regions.
- **Fields**:
  - `regionId`
  - `samplePosition`
  - `baseTerrainType`
  - `isValid`
  - `failureReason`
- **Relationships**:
  - Derived during scenario validation from bridge object regions and base terrain resolution.
- **Validation Rules**:
  - Every tile covered by a bridge region must resolve to river terrain before bridge override is applied.
  - Any non-river bridge coverage fails scenario validation.

## Movement Object Feedback

- **Purpose**: Player-visible explanation of how one or more movement objects changed a move.
- **Fields**:
  - `destinationPosition`
  - `objectLabels`
  - `passabilityExplanation`
  - `movementDeltaExplanation`
  - `stackExplanation`
- **Relationships**:
  - Derived from the resolved movement tile and route attempt.
  - Shown alongside existing route feedback and map presentation.
- **Validation Rules**:
  - Must explain when a move became legal because of a bridge.
  - Must explain when cost was reduced or increased because of movement modifiers.

## State Transitions

### Object Region Resolution

1. Scenario loads movement-object regions.
2. Region membership resolves all movement-object types covering a queried tile.
3. Covered object effects are ordered deterministically into a resolved movement-object stack.

### Bridge Validation

1. Scenario validation identifies all bridge object regions.
2. Each covered tile resolves its base terrain before any object override is applied.
3. If any bridge-covered tile is not river terrain, scenario validation fails.

### Movement Resolution

1. Base terrain resolves for the destination tile.
2. Movement-object stack resolves for the same tile.
3. Bridge passability overrides apply first if present.
4. Cost modifiers such as milestone and rubble apply next.
5. Final traversability and movement cost are validated for the move attempt.
