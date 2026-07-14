# Research: Pathfinding Route Preview

## Decision 1: Use weighted shortest-path resolution based on total movement cost

- **Decision**: Define the shortest route by total legal movement cost rather than by raw tile count.
- **Rationale**: The existing map already supports differing terrain and movement-object costs, so routefinding must honor those rules or the preview would disagree with actual movement spending.
- **Alternatives considered**:
  - Shortest path by fewest tiles: rejected because it can produce a visibly shorter route that costs more movement than an alternative.
  - Manual step-by-step preview only: rejected because the feature specifically asks for calculated shortest routes.

## Decision 2: Keep route preview and route confirmation as separate interaction states

- **Decision**: Treat the first click as a preview request and require a second click on the same destination to confirm movement along the stored route.
- **Rationale**: This matches the requested interaction model, prevents accidental movement, and creates a stable seam for acceptance tests and multi-turn continuation.
- **Alternatives considered**:
  - Move immediately on first click: rejected because it removes deliberate confirmation and contradicts the requested behavior.
  - Use a dedicated confirm button: rejected because the requested interaction is click-based and already map-centric.

## Decision 3: Persist destination intent across turns, but revalidate on each continuation

- **Decision**: Preserve the plotted destination and visible route after end turn, but re-check legality before continuing movement on a later turn.
- **Rationale**: The spec wants the route to remain visible and reusable, while the game still needs to avoid blindly following stale assumptions if hero position or legality changes.
- **Alternatives considered**:
  - Keep the old route without revalidation: rejected because the hero state or map legality may differ when the next confirmation happens.
  - Clear all routes at end turn: rejected because it removes the requested quality-of-life improvement.

## Decision 4: Stop partial movement on the last affordable legal step and keep the destination active

- **Decision**: When a confirmed route costs more than the hero can currently afford, move the hero as far as possible this turn, stop on the last affordable step, and keep the destination intent available for continuation.
- **Rationale**: This preserves consistency between preview and execution while supporting long journeys across multiple turns without introducing automatic marching.
- **Alternatives considered**:
  - Reject the entire route unless the hero can finish it now: rejected because the spec explicitly wants partial traversal.
  - Automatically keep moving on later turns without another click: rejected because the spec still requires explicit confirmation clicks.

## Decision 5: Reuse existing movement legality seams for neighbor evaluation

- **Decision**: Build pathfinding on top of the current terrain, movement-object, and blocked-tile resolution rules rather than creating a parallel legality system.
- **Rationale**: A route preview is only trustworthy if it uses the same legality and cost logic as real hero movement.
- **Alternatives considered**:
  - A separate pathfinding-only rule table: rejected because it risks divergence from actual movement behavior.
  - Only use passability and ignore actual step cost during pathfinding: rejected because cost-weighted route choice is part of the feature value.

## Decision 6: Render the route as a dotted line with a destination marker layered over the map

- **Decision**: Visualize the stored route as a dotted overlay from hero to destination and render a distinct destination marker that reads like a flag pole.
- **Rationale**: The spec explicitly asks for a dotted path and a flagged endpoint, and this keeps route intent legible without changing the underlying terrain art.
- **Alternatives considered**:
  - Text-only route summaries in the sidebar: rejected because they do not satisfy the visible map-path requirement.
  - Solid-line route overlays: rejected because the spec explicitly asks for dotted rendering.
