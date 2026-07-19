# Feature Specification: Animate Path Movement

**Feature Branch**: `020-animate-path-movement`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "When traversing the map, the hero instantly teleports to the destination. Change this to animate movement along the path at one tile per second, make the behavior configurable in settings, and move game template switching into a dedicated persistent settings page." Follow-up: "Continue animation when we have another setting than immediate."

## Clarifications

### Session 2026-07-19

- Q: Should game settings be remembered only for the current session or across restarts? → A: Persist across restarts.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Watch a Hero Traverse a Confirmed Route (Priority: P1)

As a player, I see my hero travel tile by tile along a confirmed route instead of appearing at its endpoint immediately, so that movement is understandable and feels connected to the route I chose.

**Why this priority**: Visible route traversal is the core behavior change and makes every movement action easier to follow.

**Independent Test**: Plot and confirm a multi-tile route in a playable scenario, then verify through an acceptance-style flow that the hero visits its route tiles in order at one tile per second and finishes at the legal endpoint.

**Acceptance Scenarios**:

1. **Given** a hero has a confirmed route containing several legal steps and the selected movement setting is not immediate, **When** movement begins, **Then** the hero advances through the route one tile at a time in the displayed order at one completed tile per second.
2. **Given** a confirmed route can only be partially completed with the hero's remaining movement, **When** movement begins, **Then** the hero animates to each affordable tile in order and stops on the same last legal tile it would otherwise reach.
3. **Given** a confirmed route completes, **When** the final step finishes, **Then** the hero is at the route destination and the completed route is no longer active.

---

### User Story 2 - Configure Map Movement Behavior (Priority: P2)

As a player, I can choose an immediate route-movement setting when I want routes to finish at once; every other movement setting keeps the route animation, so that immediate movement is a clear opt-out rather than the only exception explicitly supported by the game.

**Why this priority**: A player-controlled option preserves a fast play style while making animation the default experience.

**Independent Test**: Open Settings, select immediate and a non-immediate movement setting, start routes in both cases, and verify that only immediate produces instant completion while every non-immediate setting produces one-tile-per-second traversal without changing route legality or outcomes.

**Acceptance Scenarios**:

1. **Given** the game opens without an existing setting, **When** the player starts a scenario and confirms a route, **Then** the hero uses the default non-immediate movement setting at one tile per second.
2. **Given** the Settings page is open, **When** the player changes movement behavior to immediate, **Then** the next confirmed route reaches its legal endpoint without a visible step-by-step delay.
3. **Given** the active movement setting is any value other than immediate, **When** the player confirms a route, **Then** the route advances one tile per second.

---

### User Story 3 - Manage Game Visuals in Dedicated Settings (Priority: P2)

As a player, I use a dedicated Settings page to change the game's visual template and movement behavior, so that gameplay controls remain focused and my choices stay in effect for the game until I change them.

**Why this priority**: Centralizing game preferences makes them discoverable and prevents template selection from competing with in-game controls.

**Independent Test**: Navigate to Settings from the game, select a valid visual template and movement behavior, enter or return to gameplay, and verify that the chosen visuals and behavior remain active across scenario transitions during the same game session.

**Acceptance Scenarios**:

1. **Given** the player is on the main menu or in a playable scenario, **When** they choose Settings, **Then** a dedicated settings page displays the current movement behavior and active visual template.
2. **Given** the player chooses a different valid visual template in Settings, **When** they return to gameplay, **Then** gameplay renders with that template and preserves the current game progress.
3. **Given** the player changes either setting, **When** they start another scenario, return to the main menu, or restart the game, **Then** the changed setting remains active until the player changes it again.
4. **Given** gameplay previously offered a template selector, **When** this feature is available, **Then** template switching is available from Settings rather than from gameplay controls.

### Edge Cases

- What happens if a route is cancelled, replaced, invalidated, or becomes blocked while traversal is pending? The hero stops without entering an illegal tile, and the route state follows the established cancellation or invalidation rules.
- What happens if an encounter, forced stop, victory condition, or other map event occurs on a traversed tile? Movement stops at that completed tile and existing event handling takes precedence before any later route step.
- What happens if the player changes a setting while a hero is already traversing a route? The in-progress movement completes using the behavior selected when it began; the changed setting applies to the next movement action.
- What happens if a new non-immediate movement setting is introduced? It continues to use tile-by-tile route animation unless it is explicitly the immediate setting.
- What happens if only one valid visual template is available? Settings clearly show it as active without preventing the player from using the page.
- What happens if the selected template later becomes unavailable? The game keeps the existing readable fallback behavior and shows a clear unavailable-state message in Settings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST animate a hero's confirmed map route by advancing through its legal route steps in order whenever the selected movement setting is not immediate.
- **FR-002**: Animated movement MUST complete one route tile per second, measured from completion of one tile step to completion of the next.
- **FR-003**: Animated movement MUST use the same route order, legality checks, movement costs, and stopping rules as existing confirmed route movement.
- **FR-004**: The system MUST update the hero's visible map position at each completed route step.
- **FR-005**: The system MUST stop animated traversal before any unaffordable, invalid, blocked, or forced-stop route step and preserve the established result for the unfinished route.
- **FR-006**: The system MUST prevent a second map movement action from being started for the traversing hero until its current movement action ends or is stopped.
- **FR-007**: The system MUST provide a dedicated Settings page reachable from the main menu and while a playable scenario is active.
- **FR-008**: The Settings page MUST display the active map route movement setting and allow the player to select immediate or a non-immediate movement setting.
- **FR-009**: A non-immediate, one-tile-per-second movement setting MUST be the default when no prior selection exists.
- **FR-010**: When immediate movement is selected, confirmed routes MUST retain the immediate-completion presentation while following the same legal endpoint and movement outcome as non-immediate animated movement.
- **FR-011**: The Settings page MUST display the currently active valid game visual template and allow the player to select another valid template.
- **FR-012**: Selecting a valid visual template in Settings MUST update subsequent gameplay rendering without resetting active game progress.
- **FR-013**: The game MUST remove template switching from gameplay controls and make Settings the game-facing location for that choice.
- **FR-014**: The selected movement behavior and visual template MUST remain active across game restarts and navigation between the main menu and scenarios until the player changes them.
- **FR-015**: The system MUST clearly communicate unavailable or invalid visual-template choices and must not let the player activate them.
- **FR-016**: Existing template-selection capabilities outside gameplay remain unchanged unless they explicitly use the game Settings page.
- **FR-017**: Immediate MUST be the only movement setting that bypasses tile-by-tile route animation; every other movement setting MUST use the established one-tile-per-second traversal behavior.

### Key Entities *(include if feature involves data)*

- **Movement Behavior**: The player's selected presentation for confirmed map routes. Immediate completes routes at once; every other value advances routes one tile per second.
- **Traversal State**: The current hero movement action, including the ordered remaining route steps and whether traversal is active or stopped.
- **Game Settings**: The game-session preferences for movement behavior and active visual template, managed from the dedicated Settings page.
- **Active Visual Template**: The valid artwork template currently used by gameplay rendering.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In route-traversal testing, 100% of sampled animated routes show every completed legal tile in route order, with one completed tile step per second.
- **SC-002**: In partial-route and forced-stop testing, 100% of sampled animated traversals stop on the same legal tile and preserve the same movement outcome as immediate traversal.
- **SC-003**: In settings testing, 100% of sampled immediate selections complete the next confirmed route at once, and 100% of sampled non-immediate selections animate the next confirmed route one tile per second.
- **SC-004**: In settings persistence testing, 100% of sampled changes to movement behavior and visual template remain active across main-menu and scenario transitions and after a game restart.
- **SC-005**: In usability testing, at least 90% of players can find Settings, identify the active movement behavior and template, and change each without external instructions.

## Assumptions

- Game settings are retained across page reloads and later game sessions until the player changes them.
- "One tile per second" means each route step completes at one-second intervals; the visual interpolation within a tile can be smooth.
- Immediate movement remains available as the sole configurable alternative that skips animation; every other movement setting uses the same animated traversal behavior.
- The Settings page is an application page distinct from the main menu and gameplay view, with a clear return path to the invoking context.
- The existing shared catalog of valid visual templates remains the source of available template choices.

## Out of Scope

- Changing movement speed to values other than the specified animated rate of one tile per second.
- Per-hero, per-scenario, or per-player-profile settings.
- Introducing new visual templates, changing template file formats, or altering storybook and asset-mapper template selection workflows.
- Route replanning, new pathfinding rules, or changes to movement costs beyond presenting confirmed routes over time.
