# Data Model: Decision Presentation

| Element | Meaning | Source |
|---|---|---|
| Subject | Selected hero, active unit, or turn owner | Current game state |
| Proposed action | Route, target, strike, defend, or end turn | Interaction state |
| Known consequences | Cost, resources, effects, encounter, transition, or turn change | Existing rule results |
| Commitment status | Previewed, awaiting confirmation, traversing, resolved, or unavailable | Route, battle, traversal state |
| Recovery action | Replace, cancel, clear target, or wait | Current decision state |

## Rules

- Recovery clears only uncommitted input; it never reverses resolved game state.
- A preview is stale when its owner, destination validity, target, or scene state changes.
- Busy, traversal, and transition states override availability and expose their reason.
