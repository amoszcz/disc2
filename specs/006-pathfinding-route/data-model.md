# Data Model: Pathfinding Route Preview

## Route Preview

- **Purpose**: Represents the currently plotted route for a specific hero before or after confirmation.
- **Fields**:
  - `heroId`
  - `destinationPosition`
  - `steps`
  - `totalMovementCost`
  - `status`
  - `lastValidatedFromPosition`
  - `autoAdvanceEligible`
- **Relationships**:
  - Belongs to one selected hero.
  - References one ordered list of route steps.
  - Drives map rendering, click-confirmation behavior, hero-click clearing, and end-turn auto-advance.
- **Validation Rules**:
  - A preview is valid only for the hero that generated it.
  - A preview must contain at least one step beyond the hero's current tile.
  - A completed preview must no longer be considered active.
  - A preview that can no longer advance automatically may still remain valid for manual continuation unless explicitly invalidated.

## Route Step

- **Purpose**: Represents one legal tile transition in a plotted path.
- **Fields**:
  - `position`
  - `movementCost`
  - `terrainLabel`
  - `objectLabels`
- **Relationships**:
  - Belongs to one route preview in ordered sequence.
  - Derives from existing route legality and movement-cost rules.
- **Validation Rules**:
  - Every step must be legally enterable at the time the route is calculated.
  - Movement cost must match the same cost used for real movement resolution.

## Route Confirmation State

- **Purpose**: Tracks whether the next click on a destination should preview or confirm movement.
- **Fields**:
  - `previewState`
  - `selectedHeroId`
  - `destinationPosition`
  - `isAwaitingConfirmation`
- **Relationships**:
  - Uses one route preview as its primary reference.
  - Resets when destination or selected hero changes.
- **Validation Rules**:
  - Confirmation is only valid when the clicked destination matches the active preview destination.
  - Confirmation becomes invalid when route ownership no longer matches the selected hero.

## Route Cancel Action

- **Purpose**: Represents the explicit interaction that clears the active route when the owning hero is clicked.
- **Fields**:
  - `heroId`
  - `clearedDestinationPosition`
  - `wasAwaitingConfirmation`
- **Relationships**:
  - Applies only to the currently active route preview for one hero.
  - Resets the route confirmation state and visible route overlay.
- **Validation Rules**:
  - Clicking a different hero must not silently clear another hero's route.
  - Clearing a route must not spend movement or move the hero.

## Persistent Destination

- **Purpose**: Captures the journey target that remains visible across turns after partial movement or end-turn auto-advance.
- **Fields**:
  - `destinationPosition`
  - `heroId`
  - `isVisibleAfterTurnEnd`
  - `continuationRequired`
- **Relationships**:
  - Reuses the route preview entity but survives end-turn boundaries.
  - Can be replaced by a new destination request.
- **Validation Rules**:
  - Persistence ends when the destination is reached, explicitly replaced, cleared, or found invalid on revalidation.

## Route Progress Result

- **Purpose**: Describes the outcome of confirming a previewed route or auto-advancing it at end turn.
- **Fields**:
  - `traversedSteps`
  - `finalPosition`
  - `movementSpent`
  - `remainingSteps`
  - `completionState`
  - `failureReason`
  - `triggerSource`
- **Relationships**:
  - Produced from one active route preview.
  - Updates hero position, remaining movement, and preview persistence.
- **Validation Rules**:
  - Traversed steps must form the leading contiguous segment of the previewed route.
  - Remaining steps, if any, must still reference the original destination intent.
  - Automatic end-turn advancement must be distinguishable from manual confirmation.

## State Transitions

### Route Plotting

1. Player clicks a destination tile.
2. The game resolves the shortest legal weighted path for the selected hero.
3. The route preview becomes active and visible if a valid path exists.

### Route Confirmation

1. Player clicks the same active destination again.
2. The game confirms route ownership and validity.
3. The hero traverses as many leading steps as current movement allows.
4. The route is either completed or remains persistent with remaining intent.

### Route Clearing

1. A route is currently active for a hero.
2. The player clicks that same hero.
3. The route preview, destination intent, and confirmation state are cleared without movement.

### Route Replacement

1. A different destination is clicked while a route is active.
2. The previous preview and confirmation state are discarded.
3. A new route preview is calculated for the new target.

### Cross-Turn Continuation

1. A partial route remains visible after end turn.
2. The player regains control on a later turn and clicks the same destination.
3. The route is revalidated from the hero's current position.
4. Movement continues if a valid continuation still exists.

### End-Turn Auto-Advance

1. The player ends the turn while a hero still owns an active route and has legal movement remaining.
2. The game advances the hero along that route as far as legal movement allows.
3. The route is either completed or preserved with remaining intent for later continuation.
