# Contract: Terrain UX

## Purpose

Define the player-visible contract for terrain readability and movement feedback.

## Map Presentation Contract

- The 64x64 map must distinguish roads, standard terrain, difficult terrain, and blocked terrain visually.
- Region boundaries must still result in readable tile outcomes where movement decisions matter.
- The player must be able to tell when a road approaches blocked water without assuming the road creates a crossing.

## Movement Feedback Contract

- Legal movement must show or imply the cost that will be spent.
- Diagonal movement must follow the same visible terrain interpretation as orthogonal movement.
- Illegal movement must report whether the destination is blocked terrain or too expensive for the remaining movement.

## Blocked Terrain Contract

- Mountains, lakes, and rivers must read as blocked destinations.
- Roads adjacent to blocked water must not visually imply an allowed crossing unless a future bridge feature is introduced.

## Acceptance Signals

- A player can visually identify road, standard, difficult, and blocked terrain classes.
- A player can understand why a move was rejected without inferring hidden terrain rules.
