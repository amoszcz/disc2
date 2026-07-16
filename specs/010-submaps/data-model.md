# Data Model: Submap Transitions

## World Map

- **Purpose**: Represents one playable map space within a scenario, including the main map and any linked submaps.
- **Fields**:
  - `id`
  - `name`
  - `kind`
  - `mapDefinition`
  - `entryLinks`
  - `exitLinks`
- **Relationships**:
  - A scenario owns one main world map and may own multiple linked submaps.
  - A world map can connect to other world maps through submap links.
- **Validation Rules**:
  - Every world map must have a unique identifier within the scenario.
  - The main world map must be uniquely identifiable.

## Submap Link

- **Purpose**: Represents a directed travel connection from a source trigger on one world map to a destination position on another world map.
- **Fields**:
  - `id`
  - `sourceMapId`
  - `sourcePosition`
  - `triggerKind`
  - `destinationMapId`
  - `destinationPosition`
  - `travelDirection`
- **Relationships**:
  - Belongs to a scenario and references two world maps.
  - Can represent main-map entry, submap exit, teleport travel, or another scenario-defined trigger.
- **Validation Rules**:
  - Both source and destination map identifiers must exist in the same scenario.
  - Source and destination positions must be valid coordinates on their referenced maps.
  - The link must fail safely if any required reference is missing.

## Entry Trigger

- **Purpose**: Represents a player-reachable trigger on a map that begins travel into a linked map space.
- **Fields**:
  - `triggerKind`
  - `sourcePosition`
  - `activationRule`
  - `linkId`
- **Relationships**:
  - Resolves to one submap link.
  - Exists on a specific world map and is evaluated during map interaction.
- **Validation Rules**:
  - The trigger must resolve to a valid submap link before travel occurs.
  - Trigger activation must only be evaluated during map-capable scenes.

## Exit Point

- **Purpose**: Represents a player-reachable location inside a submap that returns the player to a linked destination on another map.
- **Fields**:
  - `sourcePosition`
  - `linkId`
  - `destinationMapId`
  - `destinationPosition`
- **Relationships**:
  - Resolves to one submap link with exit travel semantics.
  - Exists on a linked submap and returns the player to a connected world map.
- **Validation Rules**:
  - Multiple exit points may exist in the same submap.
  - Each exit must preserve its own destination mapping.

## Map Travel State

- **Purpose**: Represents the currently active world map and the transition context required to keep travel continuous inside one scenario session.
- **Fields**:
  - `activeMapId`
  - `lastMapId`
  - `lastTravelLinkId`
  - `transitionMessage`
  - `travelHistory`
- **Relationships**:
  - Lives inside the active game session.
  - Influences map rendering, map interaction, and linked destination routing.
- **Validation Rules**:
  - The active map must always resolve to a valid world map in the current scenario.
  - Repeated travel must not discard unrelated scenario progress.

## Scenario World State

- **Purpose**: Represents mutable scenario progress across all linked maps in the current session.
- **Fields**:
  - `heroLocations`
  - `pickupStates`
  - `guardStates`
  - `routeState`
  - `victoryState`
- **Relationships**:
  - Spans the main map and all submaps.
  - Is preserved while the player moves between linked maps.
- **Validation Rules**:
  - Leaving a map must not reset that map’s prior progress unless a future feature explicitly says so.
  - Returning to a previously visited map must reflect current session state.

## State Transitions

### Enter Submap

1. The player reaches or activates an entry trigger on the active map.
2. The game resolves the corresponding submap link.
3. The active map changes to the linked destination map and the player appears at the linked arrival position.

### Exit Submap

1. The player reaches or activates an exit point on the current submap.
2. The game resolves the corresponding return link.
3. The active map changes to the linked destination map and the player appears at the linked return position.

### Repeat Travel

1. The player travels between linked maps more than once during the same session.
2. The game preserves scenario world state while changing only the active map context.
3. The player re-enters maps with prior progress still intact.

### Invalid Link Attempt

1. A travel trigger is evaluated.
2. The game cannot resolve a valid link or destination.
3. The transition is rejected safely and the current session remains playable on the current map.
