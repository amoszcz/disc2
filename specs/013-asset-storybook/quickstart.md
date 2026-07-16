# Quickstart: Asset Storybook

## Goal

Validate that the game exposes a menu-selectable asset storybook scene where supported heroes, battle units, and objects can be previewed in isolated tiles using the same visual resolution logic as gameplay.

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

2. Open the game at the main menu and confirm:
   - a distinct storybook action is available alongside scenario-start actions
   - the storybook can be entered without starting a scenario
   - the storybook can return safely to the main menu

3. In the storybook view, confirm:
   - supported preview subjects are listed by category or readable label
   - each entry shows an isolated preview tile and a state-selection control
   - selecting a different state updates the preview without leaving the storybook

4. Validate shared render behavior by reviewing at least:
   - one hero entry that uses a state from the hero animation vocabulary
   - one battle-unit entry that uses a battle-oriented state such as `ready`, `shoot`, or `hit`
   - one map-object or guarded-location entry that uses a state such as `idle`, `active`, `blocked`, or `open`

5. Validate fallback review behavior by intentionally removing or bypassing one dedicated state mapping and confirming:
   - the preview remains visible
   - the requested state still resolves through fallback behavior rather than blank output

## Suggested Verification Commands

Run the storybook-focused contract and integration suites after implementation:

```powershell
npm test -- --run tests/contract/storybookMenu.contract.test.ts tests/contract/storybookPreviewCatalog.contract.test.ts tests/integration/storybook/storybookNavigationFlow.test.ts tests/integration/storybook/storybookPreviewResolutionFlow.test.ts
```

Run the browser validation flow for storybook entry, state switching, and fallback readability:

```powershell
npx playwright test tests/acceptance/storybook-menu-access.spec.ts tests/acceptance/storybook-preview-states.spec.ts tests/acceptance/storybook-fallback-preview.spec.ts
```

Build the project once after scene or preview catalog updates:

```powershell
npm run build
```

## Expected Outcomes

- The main menu exposes a stable entry point for the asset storybook.
- The storybook lists the currently supported preview subjects with isolated visual previews.
- State switching in the storybook uses the same resolver-backed behavior as gameplay scenes.
- Missing dedicated states remain visibly reviewable through fallback rendering.
