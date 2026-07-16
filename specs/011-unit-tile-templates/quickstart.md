# Quickstart: Dedicated Visual Templates

## Goal

Validate that the game can use dedicated visual templates for current units, map objects, and terrain tiles while preserving a readable fallback path for incomplete asset coverage.

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

2. Open the core scenario and confirm:
   - the hero and current battle-capable units use dedicated visuals when available
   - guarded locations and supported map objects use dedicated visuals when available
   - any subject without a dedicated template still appears through the fallback path

3. Open the advanced terrain scenario and confirm:
   - roads, plains, grass, mud, woods, mountains, lakes, and rivers are visually distinguishable through dedicated tile templates when available
   - bridges, milestones, caves, teleports, exits, and rubble remain readable above their tiles
   - map readability holds during ordinary pan and zoom play

4. Trigger a battle and confirm:
   - units remain distinguishable in battle slots
   - active-unit, legal-target, selected-target, and defend-state cues remain readable after dedicated visuals are introduced

5. Temporarily validate fallback coverage by running with at least one supported dedicated template intentionally absent and confirm:
   - the affected subject still renders
   - the scene remains playable and readable

## Suggested Verification Commands

Run the dedicated visual-template contract and integration suites:

```powershell
npm run test:visual-templates
```

Run the full dedicated visual-template verification flow, including browser acceptance coverage:

```powershell
npm run verify:visual-templates
```

## Expected Outcomes

- Supported current units, terrain tiles, and map objects resolve to dedicated templates whenever those templates exist.
- Mixed dedicated/fallback coverage remains stable and readable.
- No current map, battle, or scenario flow becomes unusable because a dedicated visual template is missing.
