# Feature Specification: Pathfinding Route Preview

**Feature Branch**: `006-pathfinding-route`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "let add path finding. When user click on certain area the shortes path to this area should be calculated and the path should be rendered from the moving hero - dotted line with flag pole at the destination. Second click at the same area where the route is plotted should move the hero to that point using calculated path. the hero traverses only possible part of the movement based on his remaining movement points and area requirements. The path remains visible after ending the turn so the user can click again at the destination to continue movement. Clicking on another resets previous path and calculates new path. if the unit has calculated path and hero can move - ending the turn moves the hero as far as possible. if the unit has calculated path clicking on the unit clears that path"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Preview A Reachable Route (Priority: P1)

As a player, I can click a map destination and see the shortest legal route from my selected hero so that I can plan movement before committing.

**Why this priority**: Route preview is the core value of the feature because it turns movement planning from guesswork into an informed decision without yet changing hero state.

**Independent Test**: Select a hero, click several reachable and unreachable destinations, and confirm the game shows the shortest legal route only when one exists and clears or replaces previews appropriately.

**Acceptance Scenarios**:

1. **Given** a hero is selected and a destination can be reached through legal tiles, **When** the player clicks that destination once, **Then** the shortest legal route from the hero to that destination is calculated and shown on the map.
2. **Given** a route is already previewed, **When** the player clicks a different destination, **Then** the previous preview is removed and a new shortest legal route is shown for the newly chosen destination.
3. **Given** a route is already previewed for a hero, **When** the player clicks that same hero, **Then** the existing route preview is cleared without moving the hero.
4. **Given** a destination has no legal route, **When** the player clicks that destination, **Then** no movement is committed and the player is informed that the route cannot be plotted.

---

### User Story 2 - Commit Movement Along The Previewed Route (Priority: P1)

As a player, I can click the same destination a second time to move the hero along the already previewed route so that route confirmation is deliberate and movement follows the shown plan.

**Why this priority**: Preview without reliable confirmation would not complete the movement loop, so confirmation-by-second-click is part of the MVP interaction.

**Independent Test**: Preview a route, click the same destination again, and confirm the hero follows the stored route, spending only the movement points available for the current turn.

**Acceptance Scenarios**:

1. **Given** a route preview is visible for the selected hero, **When** the player clicks the same destination a second time, **Then** the hero starts moving along that previewed route instead of recalculating it.
2. **Given** the selected hero lacks enough remaining movement to finish the full route, **When** the route is confirmed, **Then** the hero travels the farthest legal segment allowed this turn and stops on the last affordable tile.
3. **Given** the selected hero has enough remaining movement for the full route, **When** the route is confirmed, **Then** the hero reaches the previewed destination in one movement action.

---

### User Story 3 - Continue A Planned Journey Across Turns (Priority: P2)

As a player, I can keep a plotted route visible after ending the turn and automatically advance along it when movement is still available so that long journeys require less repetitive clicking while still preserving route intent.

**Why this priority**: Multi-turn persistence adds strong usability value, but it depends on the preview-and-confirm loop already existing.

**Independent Test**: Plot a route longer than one turn, confirm partial movement, end the turn, and confirm the hero advances automatically as far as possible if movement remains available, while unfinished route intent stays visible for later continuation or replacement.

**Acceptance Scenarios**:

1. **Given** a plotted route remains active and the hero still has movement available when the turn is ended, **When** end turn is confirmed, **Then** the hero automatically advances along the plotted route as far as possible before the turn fully passes on.
2. **Given** a plotted route extends beyond what can be completed through that automatic end-turn advance, **When** the hero stops on the last affordable legal tile, **Then** the unfinished route remains visible for later continuation.
3. **Given** a persistent route remains visible after the turn changes back to the player, **When** the player clicks the same destination again, **Then** the hero continues toward that destination using the current legal continuation of the route.
4. **Given** a persistent route exists, **When** the player clicks a different destination, **Then** the original route is discarded and replaced with a newly plotted route.

### Edge Cases

- What happens when the clicked destination is the hero's current tile? The system should not create a travel route or spend movement.
- What happens when the shortest route includes tiles the hero cannot legally enter? The route must exclude illegal tiles, and if no legal route remains the preview must not be shown.
- What happens when the hero's remaining movement is less than the cost of the first step on the plotted route? The route may remain previewed, but confirmation must not move the hero this turn.
- What happens when end turn is triggered while the active route cannot advance even one additional step? The route should remain visible, but the hero should not be moved automatically.
- What happens when the player changes the selected hero while a route is visible? The visible route must no longer be treated as a valid confirmation path for the newly selected hero.
- What happens when the player clicks the hero that owns the active route preview? The current route should be cleared so the player can cancel the plotted journey explicitly.
- What happens when the previewed destination becomes unreachable because the route assumptions changed between turns? The next confirmation attempt must fail safely and require a newly valid route.
- What happens when the plotted route passes through guarded, blocked, or impassable areas? Those tiles must not be traversed as part of the route.
- What happens when automatic end-turn movement reaches a battle, blocked site, or other forced stop? Automatic movement must halt on the last legal completed step and preserve or invalidate the route based on the new legality state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow the player to request a route preview by clicking a map destination while a movable hero is selected.
- **FR-002**: The system MUST calculate the shortest legal route from the selected hero's current position to the clicked destination when a legal route exists.
- **FR-003**: The system MUST define route legality using the same movement, terrain, movement-object, guard, and passability rules that govern actual hero movement.
- **FR-004**: The system MUST render a visible route preview from the selected hero to the chosen destination after a successful route calculation.
- **FR-005**: The system MUST visually mark the destination of a previewed route distinctly from the route line itself.
- **FR-006**: The system MUST require a second click on the same previewed destination to confirm movement along that previewed route.
- **FR-007**: The system MUST treat a click on a different destination as a request to discard the prior preview and calculate a new route.
- **FR-008**: The system MUST clear the active plotted route when the player clicks the hero that owns that route.
- **FR-009**: The system MUST move the hero along the confirmed previewed route in route order rather than by jumping directly to the destination.
- **FR-010**: The system MUST stop hero movement on the last step the hero can legally afford with current remaining movement if the full route cannot be completed this turn.
- **FR-011**: The system MUST preserve the intended destination after partial route completion so the player can continue toward it later.
- **FR-012**: The system MUST keep a plotted route visible after the player ends the turn unless the route is replaced, invalidated, or completed.
- **FR-013**: The system MUST automatically advance a hero along an active plotted route during end turn if that hero can still legally move farther along the route at that moment.
- **FR-014**: The system MUST stop automatic end-turn route movement on the last legal affordable step available before the turn fully ends.
- **FR-015**: The system MUST prevent movement confirmation when the selected hero has changed and no longer owns the currently previewed route.
- **FR-016**: The system MUST allow the player to continue the same journey on a later turn by clicking the same persistent destination again when automatic end-turn movement did not complete the route.
- **FR-017**: The system MUST re-evaluate route legality before continued movement when a persistent route is confirmed on a later turn.
- **FR-018**: The system MUST clear or invalidate a preview when no legal route can be produced for the currently selected hero and destination.
- **FR-019**: The system MUST avoid spending movement points on a preview-only click.
- **FR-020**: The system MUST avoid recalculating the route on the confirmation click when the hero, destination, and route preview state are unchanged.
- **FR-021**: The system MUST leave completed routes no longer marked as active once the hero reaches the destination.
- **FR-022**: The system MUST communicate when a destination cannot currently be reached or cannot currently be advanced due to insufficient movement.
- **FR-023**: The system MUST communicate when automatic end-turn route movement advanced the hero or stopped early.
- **FR-024**: The system MUST keep the first slice focused on path plotting and route-following for a single selected hero rather than simultaneous multi-hero route automation.

### Key Entities *(include if feature involves data)*

- **Route Preview**: The currently plotted path for one selected hero, including its destination, ordered steps, and current validity.
- **Route Step**: One tile entry in the ordered path, including the movement cost and legality required to enter it.
- **Persistent Destination**: The remembered target tile for a route that is intended to continue across turns after partial movement.
- **Auto-Advance Route State**: The part of route state that determines whether end turn should continue marching the hero along the active route automatically.
- **Route Confirmation State**: The interaction state that distinguishes a first click used for plotting from a second click used for committing movement.
- **Route Ownership**: The link between a plotted route and the specific hero for whom it was generated.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In route-preview testing, 100% of sampled reachable destinations display a route before movement is committed.
- **SC-002**: In route-preview testing, 100% of sampled unreachable destinations avoid moving the hero and provide clear failure feedback.
- **SC-003**: In route-confirmation testing, 100% of sampled second-click confirmations follow the displayed route rather than a different tile order.
- **SC-004**: In partial-movement testing, 100% of sampled routes longer than one turn stop exactly on the last affordable legal tile for that turn.
- **SC-005**: In multi-turn continuation testing, 100% of sampled persistent routes remain available after end turn and can be continued or replaced as intended.
- **SC-006**: In end-turn automation testing, 100% of sampled active routes advance automatically as far as possible when end turn is triggered and legal movement remains.
- **SC-007**: In route-cancel testing, 100% of sampled clicks on the route-owning hero clear the active route without moving the hero.
- **SC-008**: In usability testing, at least 90% of players can distinguish between previewing a route, confirming movement, clearing a route, and automatic end-turn route advancement.

## Assumptions

- The feature applies to the existing adventure-map hero movement flow and reuses the same selected-hero model already present in the game.
- The first slice targets one actively selected hero at a time and does not introduce background auto-marching for multiple heroes.
- The route should prefer the shortest legal path by total movement cost rather than by raw tile count whenever terrain or movement objects change step cost.
- A persistent route may need to be revalidated on later turns if the hero position or map legality changes before the next confirmation click.
- Ending the turn is allowed to trigger additional route progress for the currently selected hero if an active route remains and movement is still available.
- Route persistence is limited to the current scenario session and does not require saving across a full application restart.
- The first slice focuses on mouse-driven route preview and confirmation, with no requirement for keyboard-only route commands.
- Clicking the route-owning hero is treated as an explicit cancel action for the current plotted route rather than as an additional confirmation step.

## Out of Scope

- Fully autonomous multi-turn marching that continues turn after turn without either an existing active route or the end-turn-triggered advance rule described above.
- Coordinated pathfinding for multiple heroes at once or shared queue management between heroes.
- Fog-of-war-aware hidden-route logic, escort formations, or combat tactics pathfinding.
- Saving, loading, or exporting route plans outside the active scenario session.
