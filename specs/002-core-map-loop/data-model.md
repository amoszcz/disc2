# Data Model: Core Map Loop

## Scenario

- **Purpose**: Defines one playable session and its initial state.
- **Fields**:
  - `id`
  - `name`
  - `map`
  - `players`
  - `heroes`
  - `resourcePickups`
  - `guardedLocations`
  - `victoryCondition`
- **Relationships**:
  - Owns the map, actors, pickups, and guarded objectives.
  - References one or more players and heroes.
- **Validation Rules**:
  - Must contain at least one player-controlled hero.
  - Must define at least one opposing or blocking force to make victory meaningful.
  - Every guarded location must reference an existing guard force.

## Player

- **Purpose**: Represents a side that can take turns and collect resources.
- **Fields**:
  - `id`
  - `name`
  - `isHumanControlled`
  - `resourceStockpile`
  - `heroIds`
  - `defeatState`
- **Relationships**:
  - Owns one or more heroes.
  - Accumulates resources from pickups.
- **Validation Rules**:
  - Resource totals cannot be negative.
  - Defeated players cannot become active turn owners again in the same scenario without explicit revive logic, which is out of scope.

## Hero

- **Purpose**: The map actor selected by the player to move and engage guards.
- **Fields**:
  - `id`
  - `name`
  - `ownerPlayerId`
  - `mapPosition`
  - `movementPerTurn`
  - `remainingMovement`
  - `unitIds`
  - `experience`
  - `availabilityState`
- **Relationships**:
  - Belongs to one player.
  - Leads a list of units.
  - Can enter battles and interact with pickups or guarded locations.
- **Validation Rules**:
  - Remaining movement must stay between zero and the per-turn allowance.
  - A hero must have at least one battle-capable unit to initiate guarded combat.

## Unit

- **Purpose**: A battle participant attached to a hero or guard force.
- **Fields**:
  - `id`
  - `name`
  - `ownerSideId`
  - `agility`
  - `maxHealth`
  - `currentHealth`
  - `attackValue`
  - `actionState`
  - `defeatState`
- **Relationships**:
  - Belongs to a hero force or guard force.
  - Participates in battles through a queue.
- **Validation Rules**:
  - Agility must be a defined numeric value for queue ordering.
  - Defeated units cannot take actions.
  - Action state resets only when a new turn is granted in battle.

## Resource Pickup

- **Purpose**: A one-time collectible map object.
- **Fields**:
  - `id`
  - `mapPosition`
  - `resourceType`
  - `amount`
  - `collectedState`
- **Relationships**:
  - Exists on the map until collected by a hero.
- **Validation Rules**:
  - Amount must be positive.
  - A collected pickup cannot be collected again.

## Guard Force

- **Purpose**: A stationary neutral or hostile defender that blocks a location.
- **Fields**:
  - `id`
  - `unitIds`
  - `guardedLocationId`
  - `defeatState`
- **Relationships**:
  - Protects exactly one guarded location in this slice.
  - Provides units to a battle when challenged.
- **Validation Rules**:
  - Must contain at least one unit at scenario start.
  - A defeated guard force can no longer block access.

## Guarded Location

- **Purpose**: A map objective that is inaccessible until its guards are defeated.
- **Fields**:
  - `id`
  - `name`
  - `mapPosition`
  - `guardForceId`
  - `locationType`
  - `accessState`
  - `ownerPlayerId`
- **Relationships**:
  - References one guard force.
  - May become owned or accessible after victory.
- **Validation Rules**:
  - Access is blocked while the linked guard force is undefeated.
  - Access opens immediately after the linked guard force is defeated.

## Battle

- **Purpose**: Encapsulates one tactical encounter.
- **Fields**:
  - `id`
  - `attackingHeroId`
  - `defendingForceId`
  - `participants`
  - `turnQueue`
  - `activeUnitId`
  - `battleState`
  - `outcome`
- **Relationships**:
  - Pulls units from a hero force and a guard force.
  - Produces updates to hero, unit, guard, and location state after resolution.
- **Validation Rules**:
  - Queue must include all battle-capable units at battle start.
  - Active unit must always be the head of the current queue.
  - Outcome remains unset until one side has no battle-capable units.

## Victory Condition

- **Purpose**: Determines when the scenario ends.
- **Fields**:
  - `type`
  - `targetSideIds`
  - `evaluationMoments`
- **Relationships**:
  - Belongs to the scenario.
- **Validation Rules**:
  - This slice supports the `eliminate-all-enemies` rule only.
  - Evaluation must run after battles and at end-of-turn boundaries.

## State Transitions

### Scenario Flow

1. Scenario loads into a map-play state.
2. Active player takes map actions.
3. Player ends turn, which resets turn-scoped movement and advances ownership.
4. Victory is evaluated after battle resolution and turn ending.
5. Scenario ends in victory or defeat when the rule is satisfied.

### Hero Movement

1. Hero starts turn with `remainingMovement = movementPerTurn`.
2. Valid movement reduces `remainingMovement`.
3. Entering a pickup tile marks the pickup collected and updates resources.
4. Entering a guarded tile transitions either to blocked interaction or into battle.

### Battle Lifecycle

1. Battle initializes with all battle-capable units.
2. Queue is sorted by agility and tie-break rules.
3. Active unit performs one action and ends its turn.
4. Queue advances until one side has no remaining battle-capable units.
5. Outcome updates the scenario, rewards experience if applicable, and returns control to the map or ends the scenario.
