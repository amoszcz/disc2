# Quickstart: Unit And Object Animation States

## Goal

Validate that the project can adopt a shared animation-state vocabulary for heroes, battle units, and map objects while preserving readable fallback behavior during incremental rollout.

## Prerequisites

1. Install project dependencies:

```powershell
npm install
```

2. Install the Playwright browser used by acceptance tests:

```powershell
npx playwright install chromium
```

## Validation Flow

1. Start the local development server:

```powershell
npm run dev
```

2. Open a scenario with a movable hero and confirm:
   - the hero can be validated against the approved directional state families `idle`, `start-move`, `walk`, and `stop-move`
   - interaction-oriented moments such as claiming or entering locations can be mapped to `interact`
   - fallback visual behavior remains available if a dedicated hero state is not yet present

3. Trigger a battle and confirm:
   - battle-capable units can be validated against the approved state vocabulary for `idle`, `ready`, `attack`, `cast`, `shoot`, `hit`, `defend`, `wait`, `victory`, and `perish`
   - currently supported attack categories remain coverable through that vocabulary
   - battle readability cues such as active-unit and defend feedback remain readable alongside stateful visuals

4. Review current map objects and guarded locations and confirm:
   - each supported object type is assigned either a meaningful state set or an explicit idle-only decision
   - blocked/open and active/inactive distinctions remain grounded in current gameplay meaning

5. Validate incomplete coverage by intentionally leaving at least one dedicated state absent and confirm:
   - the affected subject still renders through fallback behavior
   - the gameplay moment remains understandable rather than blank or ambiguous

## Suggested Verification Commands

Run the targeted contract and integration suites for the implemented state-selection seams:

```powershell
npm test -- --run tests/contract/heroAnimationStateCatalog.contract.test.ts tests/contract/battleAnimationStateCatalog.contract.test.ts tests/contract/objectAnimationStateCatalog.contract.test.ts tests/integration/render/animationStateResolverFlow.test.ts tests/integration/render/heroMapAnimationStateFlow.test.ts tests/integration/render/battleAnimationStateFlow.test.ts tests/integration/render/animationStateFallbackFlow.test.ts
```

Run the focused browser validation flow for map, battle, and fallback readability:

```powershell
npx playwright test tests/acceptance/hero-map-animation-states.spec.ts tests/acceptance/battle-animation-states.spec.ts tests/acceptance/object-animation-state-fallback.spec.ts
```

Build the project once after state-profile updates:

```powershell
npm run build
```

## Expected Outcomes

- Current hero map behaviors are fully covered by approved named states.
- Current battle action categories map to approved unit-state meanings or documented fallbacks.
- Current interactable object types are assigned meaningful required states or an explicit idle-only decision.
- Incremental rollout remains playable even when some dedicated animation states are still missing.
