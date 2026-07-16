# Research: Unit And Object Animation States

## Decision 1: Extend the existing visual-template system with animation-state metadata instead of creating a separate animation runtime

**Decision**: Build the feature as an extension of the current `visualTemplateCatalog` and `visualTemplateResolver` seams so the game can request animation-aware hero, unit, and object visuals through the same rendering-facing path that already handles dedicated assets and fallbacks.

**Rationale**: The repository already has a working catalog, resolver, diagnostics path, and map/battle render integration for static dedicated visuals. Reusing that seam keeps the feature small, avoids duplicating asset-selection logic, and lets the project add state-aware visuals without inventing a second parallel rendering contract.

**Alternatives considered**:
- Create a separate animation manager outside the current visual-template layer: rejected because it would split visual selection across two systems and increase coupling between renderers and gameplay state.
- Store all animation choices directly inside each render function: rejected because it would duplicate state mapping logic and make fallback behavior harder to keep consistent.

## Decision 2: Approve the state vocabulary now and defer exact frame counts and timing to implementation

**Decision**: Treat this feature as the source of truth for named animation states, required versus optional coverage, and category-specific expectations, while deferring frame counts, playback speed, and packing details to later planning and implementation steps.

**Rationale**: The current need is to avoid asset ambiguity before art production continues. The user specifically wants to make decisions about frames and animation states, but the spec intentionally keeps frame-count details out of scope so the team can agree on vocabulary and coverage before committing to concrete sprite-sheet layout.

**Alternatives considered**:
- Lock frame counts for every state in the planning artifact: rejected because it would prematurely constrain art production and create rework risk before implementation details are explored.
- Leave both states and frame counts undefined until implementation: rejected because asset creators would still be guessing what the game expects.

## Decision 3: Use directional variants only for map-hero locomotion in the first slice

**Decision**: Require `up`, `down`, `left`, and `right` directional variants for hero `idle`, `start-move`, `walk`, and `stop-move`, while keeping battle-unit states non-directional for now.

**Rationale**: The current map loop already communicates hero movement through cardinal directions, so directional hero states deliver immediate player value. Battle readability currently depends more on action meaning than on facing complexity because units occupy fixed battle slots and do not yet use positional movement during combat.

**Alternatives considered**:
- Add directional variants to every battle unit immediately: rejected because the gameplay does not currently justify the extra asset burden.
- Use a single non-directional map-hero state set: rejected because it would reduce movement readability, which is the primary reason for animating the hero first.

## Decision 4: Map battle-unit state expectations to current combat roles and attack categories

**Decision**: Define the approved battle vocabulary around current gameplay meaning: `idle`, `ready`, `attack`, `cast`, `shoot`, `hit`, `defend`, `wait`, `victory`, and `perish`, with each unit type using only the relevant subset for its role.

**Rationale**: The existing scenarios already distinguish `melee`, `ranged`, and `area` attack categories, and the battle flow already exposes active turns, defend states, damage intake, and defeat. The state catalog should mirror those meanings so the visual layer reflects current gameplay instead of speculative future mechanics.

**Alternatives considered**:
- Force every unit to supply every approved battle state: rejected because it would create unnecessary art work for units that cannot logically cast, shoot, or defend in a distinct way.
- Define only generic `act` and `die` states: rejected because it would be too vague to guide readable combat visuals.

## Decision 5: Keep object states opt-in and gameplay-driven rather than universal

**Decision**: Support a broad object-state vocabulary such as `idle`, `active`, `inactive`, `blocked`, `open`, `claimed`, `depleted`, `damaged`, `destroyed`, `highlighted`, and `selected`, but require only the variants that correspond to real gameplay meaning for a given object type.

**Rationale**: Some objects, such as guarded sites, teleports, pickups, and exits, benefit from meaningful state changes, while others may remain readable with an idle-only presentation. This keeps the first slice scoped and avoids making every static object artificially complex.

**Alternatives considered**:
- Require the full state set for every object: rejected because it would create unnecessary asset scope and little user value.
- Limit objects to idle-only forever: rejected because several current map objects clearly benefit from state differences such as blocked versus open or active versus inactive.

## Decision 6: Validate the feature through state-selection contracts and rendering flows instead of timing-perfect animation assertions

**Decision**: Prove the feature through contract coverage for state vocabulary and resolution, integration coverage for map and battle rendering state selection, and acceptance flows that confirm readable transitions during real gameplay interactions.

**Rationale**: The constitution prefers feature-level evidence over implementation-detail tests. Since this slice defines animation-state selection rather than final production timing, the highest-value automated evidence is that the correct named state is chosen for the correct gameplay moment and that fallback behavior remains stable.

**Alternatives considered**:
- Pixel-perfect frame snapshot coverage for every state: rejected because it would be brittle before art production is stable.
- No automated coverage until real animations exist: rejected because the state-selection behavior is still a meaningful feature change that should be proven automatically.

## Implementation Notes

- The current implementation stores live visual-state selection in `state.visualStates`, split into hero, battle-unit, and object-facing state buckets.
- Resolver diagnostics now capture `requestedStateName`, `resolvedStateName`, and `stateDirection` so integration and browser tests can assert gameplay meaning without snapshotting art.
- Browser acceptance coverage should follow the route-preview interaction model: first click plots a route and should read as `start-move`, second click confirms movement and may transition to `walk`, `stop-move`, or `interact`.
- Battle acceptance coverage should enter combat through the same guarded-location route flow already used elsewhere in the project before asserting `shoot`, `cast`, `hit`, or `defend`.

## Asset Preparation Guidance

- The current slice does not require sprite-sheet frame timing, but asset names should still be grouped by subject and approved state vocabulary.
- Dedicated art may omit unsupported states for a profile, but omitted states must intentionally fall back to a readable idle-like or placeholder rendering path.
- Hero directional art should keep the same semantic frame grouping across `up`, `down`, `left`, and `right` so later timing work can reuse the same state names.
