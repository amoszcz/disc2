# Feature Specification: Migrate Campaign Map

**Feature Branch**: `024-migrate-campaign-map`

**Created**: 2026-07-24

**Status**: Draft

**Input**: User description: "Replace Existing TypeScript Canvas Map with a Procedural 2D Dark-Fantasy Strategy Map"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Traverse a Readable Campaign World (Priority: P1)

As a player, I can view and navigate a coherent dark-fantasy campaign map where terrain, roads, settlements, landmarks, barriers, and my hero's planned route are easy to understand before I move.

**Why this priority**: Traversal is the core strategic loop. The migration only delivers value when the new map remains playable and makes meaningful routes and destinations legible at a glance.

**Independent Test**: Start a supported scenario, select a hero, preview both a reachable and an unreachable destination, confirm a valid route, and verify that the hero reaches its destination with the expected movement outcome while existing game flow remains available.

**Acceptance Scenarios**:

1. **Given** a player starts a supported scenario, **When** the campaign map appears, **Then** the player can distinguish broad terrain areas, roads, water, major barriers, named locations, and the active hero without relying on a visible square grid.
2. **Given** a player selects a hero and a reachable destination, **When** the route is previewed, **Then** the map shows the proposed route, its movement consequence, and the destination before the player commits movement.
3. **Given** a destination is blocked or cannot be reached with the selected hero, **When** the player attempts to select it, **Then** the map keeps the game state unchanged and explains why the destination is unavailable.
4. **Given** a player has previewed but not committed a route, **When** the player chooses another destination or cancels the preview, **Then** the prior preview clears or is replaced without consuming movement or ending the turn.

---

### User Story 2 - Explore a Varied, Strategic Dark-Fantasy Map (Priority: P2)

As a player, I can explore a campaign world with memorable regions, defensible routes, varied terrain, and purposeful locations that create choices rather than appearing as random decoration.

**Why this priority**: A strategic campaign map should communicate risk, opportunity, and world identity while supporting the current game objectives.

**Independent Test**: Generate or load the same supported scenario twice using the same seed; verify that its major locations, terrain identity, traversable connections, and starting opportunities are unchanged and that all required objectives remain reachable.

**Acceptance Scenarios**:

1. **Given** a generated campaign map, **When** a player surveys it, **Then** it contains broad, recognizable terrain regions and a purposeful mix of settlements, strongholds, shrines, ruins, rewards, roads, rivers, forests, swamps, and mountain routes appropriate to the scenario.
2. **Given** the player begins a supported scenario, **When** the starting area is available, **Then** the player has at least two reachable early objectives or meaningful route choices without immediately facing an inappropriately difficult enemy or impassable barrier.
3. **Given** major locations and objectives are placed on the map, **When** the map is validated, **Then** each required location is reachable through legal terrain and every road crossing of an impassable barrier has a legal crossing point.
4. **Given** the same scenario seed and configuration, **When** the scenario is generated again or restored from saved progress, **Then** its gameplay-relevant terrain, locations, connections, and movement rules are unchanged.

---

### User Story 3 - Navigate a Polished Illustrated Map (Priority: P3)

As a player, I can pan and zoom an illustrated campaign map smoothly, with readable labels and landmarks that retain their visual hierarchy as I explore.

**Why this priority**: The visual migration succeeds only if the map is both atmospheric and practical to use during play.

**Independent Test**: Pan and zoom across a supported map on desktop and touch-capable mobile viewports; verify that map content remains responsive, labels and landmarks remain legible, and the player can select and move a hero after navigation.

**Acceptance Scenarios**:

1. **Given** a player pans or zooms the map, **When** the view changes, **Then** terrain, roads, landmarks, labels, and overlays stay aligned and the player can continue selecting map actions.
2. **Given** several labels and landmarks appear near one another, **When** the player views that area, **Then** the map prioritizes important labels and avoids obscuring critical routes, locations, heroes, and interaction feedback.
3. **Given** a supported touch-capable or desktop viewport, **When** the player navigates and performs a map action, **Then** the controls and essential movement feedback remain available without hover-only information.

### Edge Cases

- A generated map fails strategic validation because an essential location is isolated, a road crosses an impassable barrier without a legal crossing, or the starting area lacks meaningful choices; the game must reject or repair that result before it becomes playable and expose the failure to developers.
- A saved game references a map created before the migration; the game must preserve a compatible playable map state or provide a clear, documented migration path without silently changing a player's strategic progress.
- A player views a dense landmark area or an extreme zoom level; important locations, routes, the active hero, and current selection feedback must remain discernible.
- A seed produces extreme terrain distribution, such as a dominant water, mountain, or swamp area; required locations and objectives must still be legally reachable or the map must be regenerated or rejected.
- A player interacts with a bridge, mountain pass, location arrival, or terrain barrier; the movement preview and unavailable-state feedback must accurately reflect the legal traversal result before commitment.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST present each supported campaign scenario as a layered illustrated dark-fantasy map with broad, readable terrain regions rather than a visually dominant raw tile grid.
- **FR-002**: The system MUST represent gameplay-relevant terrain, regions, locations, connections, traversal rules, and map metadata as semantic map information that is independent of visual decoration.
- **FR-003**: The system MUST produce the same gameplay-relevant map information from the same scenario seed and configuration, including terrain, locations, connections, traversal costs, and validation result.
- **FR-004**: The system MUST provide a small number of memorable regions with terrain identity, danger, faction or ownership information where applicable, and meaningful landmark placement.
- **FR-005**: The system MUST place required castles, towns, shrines, ruins, vaults, resource sites, and other scenario objectives only where their terrain, spacing, reachability, and scenario constraints are satisfied.
- **FR-006**: The system MUST create a connected strategic route network with meaningful early choices, controlled chokepoints, optional reward branches, and alternate routes to major objectives where the scenario permits.
- **FR-007**: The system MUST represent roads, rivers, bridges, mountain passes, forests, swamps, corrupted terrain, and other map features so that their traversal consequences and strategic role are clear.
- **FR-008**: The system MUST preserve existing hero movement, pathfinding, collision or walkability rules, objective interactions, and existing game UI unless a compatible change is required by the map migration.
- **FR-009**: Before a player commits hero movement, the system MUST show the selected route, destination, legal availability, and known movement cost or consequence; blocked or unavailable destinations MUST include a specific explanation.
- **FR-010**: The system MUST allow a player to replace or cancel an uncommitted route preview without changing hero position, movement allowance, resources, or turn state.
- **FR-011**: The system MUST maintain existing fog-of-war behavior when it is enabled for a scenario and MUST keep hidden information from being exposed by map rendering or labels.
- **FR-012**: The system MUST preserve existing save and load behavior for migrated map state, or provide an explicit, documented migration for incompatible prior save data.
- **FR-013**: The system MUST validate generated maps before play for required-location reachability, legal roads and crossings, location spacing, starting-area choices, suitable enemy progression, biome diversity, and optional route loops.
- **FR-014**: The system MUST provide developer-facing map diagnostics that can reveal seed information, terrain and traversal state, regions, strategic connections, route exploration, placement evaluation, validation failures, and relevant rendering boundaries.
- **FR-015**: The system MUST keep map navigation and rendering responsive during normal camera movement on supported desktop and touch-capable mobile devices.

### Key Entities

- **Campaign map**: The deterministic, gameplay-relevant representation of one scenario's terrain, regions, locations, routes, traversal state, and generation metadata.
- **Terrain region**: A broad named area with a terrain identity, strategic properties, optional faction association, danger level, and landmarks.
- **Map location**: A named strategic destination such as a castle, town, shrine, ruin, vault, resource site, pass, or objective, with placement and interaction properties.
- **Map connection**: A legal strategic route between locations, including its traversable path, travel consequence, and route type.
- **Map validation result**: The recorded pass/fail outcome and diagnostics that determine whether a generated campaign map is safe and strategically suitable to play.
- **Map seed**: The stable scenario value that reproduces the same gameplay-relevant campaign map.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In automated scenario flows, 100% of supported campaign maps load into a playable state with all required locations and objectives reachable through legal traversal.
- **SC-002**: In deterministic-generation coverage, 100% of repeated runs using the same seed and configuration produce identical gameplay-relevant terrain, locations, connections, and traversal outcomes.
- **SC-003**: In automated movement flows, players can preview, replace, cancel, and commit 100% of tested legal routes without unintended changes to movement allowance or turn state; tested unavailable destinations display a specific reason.
- **SC-004**: In automated desktop and touch-capable viewport flows, players can pan, zoom, identify the active hero and a major destination, and complete a movement action without hover-only information.
- **SC-005**: In validation coverage, 100% of maps accepted for play meet the defined connectivity, legal-crossing, starting-choice, location-spacing, and terrain-diversity checks.
- **SC-006**: During normal supported camera navigation, map updates remain visually responsive with no sustained interaction delay noticeable to a player.

## Assumptions

- The migration applies to the existing playable campaign-map scenarios; any scenario that cannot yet use the new representation will retain a documented compatibility path until it is migrated.
- Existing game objectives, combat, economy, turn order, and UI ownership remain unchanged unless a compatible adjustment is necessary to represent the new map.
- The current supported desktop and touch-capable mobile browser experience remains in scope.
- Seeds and configuration are stored or recoverable with scenario state so saved and regenerated maps can retain their gameplay identity.
- Developer diagnostics are available only in existing or appropriate development-facing game surfaces and do not disrupt ordinary player sessions.
- The map uses an illustrated dark-fantasy visual direction with clear visual hierarchy; exact art assets and individual region names may be finalized during planning.

## Out of Scope

- Rebuilding unrelated menu, battle, economy, quest, turn-order, or unit systems.
- Adding new player progression systems, factions, location types, or objectives beyond what the existing game and migrated scenarios require.
- Replacing existing save infrastructure or making old saves silently change strategic outcomes.
- Native application packaging, online multiplayer, or a new third-party map-generation service.
- Pixel-perfect visual snapshot testing where it is not already an established, reliable project practice.
