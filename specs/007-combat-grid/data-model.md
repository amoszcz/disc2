# Data Model: Grid Combat Tactics

## Battle Formation

- **Purpose**: Represents the full slot layout for both sides in the 3x4 battle grid.
- **Fields**:
  - `attackerSlots`
  - `defenderSlots`
  - `rows`
  - `columns`
- **Relationships**:
  - Contains many combat formation slots.
  - References participating units by slot occupancy.
- **Validation Rules**:
  - Each side must expose exactly 3 rows and 4 columns.
  - A unit may occupy at most one slot at a time.
  - Empty slots remain valid positions and cannot be treated as defeated units.

## Combat Formation Slot

- **Purpose**: Represents one row-and-column position on one side of the battle.
- **Fields**:
  - `side`
  - `rowIndex`
  - `columnIndex`
  - `unitId`
  - `isOccupied`
- **Relationships**:
  - Belongs to one battle formation.
  - May reference one participating unit.
- **Validation Rules**:
  - `rowIndex` must be between 0 and 2.
  - `columnIndex` must be between 0 and 3.
  - `isOccupied` must agree with whether `unitId` is present.

## Attack Category

- **Purpose**: Defines how a unit can legally select and affect enemy targets.
- **Fields**:
  - `type`
  - `requiresTargetSelection`
  - `targetCoverage`
- **Relationships**:
  - Assigned to one or more units.
  - Drives legal-target resolution during strike.
- **Validation Rules**:
  - Supported values are `melee`, `ranged`, and `area`.
  - Area attacks must be resolvable as a single action against all living enemies.

## Target Selection State

- **Purpose**: Tracks current player battle interaction around target selection and action readiness.
- **Fields**:
  - `activeUnitId`
  - `selectedTargetUnitId`
  - `legalTargetUnitIds`
  - `canStrike`
  - `canDefend`
- **Relationships**:
  - Belongs to one active battle state.
  - References the acting unit and zero or one currently selected target.
- **Validation Rules**:
  - `selectedTargetUnitId` must be a member of `legalTargetUnitIds` when present.
  - `canStrike` must be false when the acting unit requires a target but none is selected.
  - Area-of-effect actions may leave `selectedTargetUnitId` empty while still allowing strike.

## Defend State

- **Purpose**: Captures temporary mitigation for a unit that chose defend.
- **Fields**:
  - `unitId`
  - `damageMultiplier`
  - `expiresOnUnitTurnId`
  - `isActive`
- **Relationships**:
  - Belongs to one unit in battle.
  - Interacts with battle damage resolution and turn advancement.
- **Validation Rules**:
  - `damageMultiplier` must be `0.5` while active in this first slice.
  - The defend state must expire when the defended unit’s next turn begins.
  - Defend must not stack into multiple simultaneous mitigation states.

## Battle Action

- **Purpose**: Represents the one action an acting unit may take on its turn.
- **Fields**:
  - `actingUnitId`
  - `actionType`
  - `targetUnitIds`
  - `resolvedDamage`
  - `turnSpent`
- **Relationships**:
  - Belongs to one turn within a battle.
  - May reference zero targets for defend, one target for most strikes, or many targets for area attacks.
- **Validation Rules**:
  - `actionType` must be either `strike` or `defend`.
  - `turnSpent` must become true after a valid action resolves.
  - Strike target count must match the rules of the acting unit’s attack category.

## State Transitions

### Battle Start

1. A map encounter creates a battle.
2. Participating units are assigned into fixed formation slots.
3. The turn queue identifies the first acting unit.
4. Target selection state initializes for that acting unit.

### Strike Selection

1. A player-controlled unit becomes active.
2. The system computes legal enemy targets from formation and attack category.
3. The player selects a target if required.
4. Pressing strike resolves damage and spends the turn.

### Defend Action

1. A player-controlled unit becomes active.
2. The player chooses defend instead of strike.
3. The unit gains temporary damage reduction.
4. The turn ends without dealing damage.

### Defend Expiration

1. A unit has an active defend state.
2. Battle queue advances until that same unit’s next turn begins.
3. The defend state is removed before the unit chooses its new action.

### Battle Continuation

1. A valid action resolves.
2. Defeated units are marked unavailable for future targeting.
3. The queue advances to the next living unit.
4. New target selection state is computed for the next acting unit.
