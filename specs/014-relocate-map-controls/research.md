# Research: Relocate Map Controls

## Decision: Compose scene-specific controls adjacent to the canvas

**Rationale**: The game shell currently contains one canvas panel and one general sidebar. In mobile layout that sidebar moves below the canvas, which leaves End Turn and zoom controls below the fold. A dedicated map action region nested with the canvas can stay adjacent to the play surface in both layouts while the informational HUD remains in the sidebar. Existing map actions can retain their exact handlers.

**Alternatives considered**:

- Keep controls in the sidebar and make the sidebar sticky: rejected because it still competes with HUD content and does not establish the required thin, vertical bar beside the map.
- Put controls inside the Canvas 2D scene: rejected because HTML buttons provide established touch, disabled, focus, and tooltip behavior without expanding canvas hit testing.
- Duplicate map action handlers in a new component: rejected because duplicating turn and zoom logic risks behavior divergence; extract or reuse the existing bindings instead.

## Decision: Use compact native buttons with icon text, accessible names, and browser-native hover labels

**Rationale**: A button can have an icon-visible label, a programmatic action name, native `title` hover text, and disabled semantics with no tooltip library. The icon bar can be kept visually thin while touch users activate the same control directly.

**Alternatives considered**:

- Add a third-party icon or tooltip package: rejected because the project has no existing UI framework and browser-native behavior satisfies the requested hover tooltips.
- Use CSS-only pseudo-element tooltips: rejected as the primary solution because native title/accessible-name semantics reduce custom positioning and clipping risk; a styled tooltip can be added later only if native presentation proves insufficient.
- Use text labels at all times: rejected because it conflicts with the requested compact icon-only control bar.

## Decision: Render the battle queue as DOM below the canvas using existing visual-template resolution

**Rationale**: The current queue is already a DOM projection of `battle.turnQueue` in the battle HUD, but is text-only and in the sidebar. Moving it beneath the canvas follows the spec and allows each entry to display an image/template with a semantic unit name and title. The existing resolver already selects dedicated unit assets or a fallback and should remain the single source of visual-template truth.

**Alternatives considered**:

- Draw queue items into the battle canvas: rejected because layout, tooltips, and responsive overflow become coupled to Canvas hit testing and rendering.
- Invent separate queue artwork: rejected because the specification requires existing unit templates and that would bypass the dedicated-template/fallback system.
- Keep a text queue in the sidebar: rejected because it fails both required placement and representation.

## Decision: Keep queue order read-only and derive it from current battle state

**Rationale**: `battle.turnQueue` and the battle engine already own order and eligibility. The queue UI should simply present its current ordered unit IDs and update on store changes, thereby reflecting progression and defeated-unit removal without duplicating engine logic.

**Alternatives considered**:

- Store a second UI-specific queue: rejected because it can become stale or disagree with battle rules.
- Recalculate initiative in the UI: rejected because it changes ownership of combat behavior and risks rule divergence.

## Decision: Validate both responsive layout and unchanged game actions through public seams

**Rationale**: Contract tests can verify control/queue markup and identifiers; integration tests can invoke real bindings against `GameStore` state; Playwright can verify page scrolling, element placement, hover names, and battle queue behavior at actual browser viewport sizes. This matches the project constitution's preference for feature-level evidence.

**Alternatives considered**:

- Snapshot-only testing: rejected because it would not demonstrate action behavior, reachability, or responsive placement.
- Engine-only tests: rejected because battle and map engines do not prove the new player-facing layout.
