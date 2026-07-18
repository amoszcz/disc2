# Quickstart: Validate Relocated Map Controls

## Prerequisites

- Node.js dependencies installed for this repository.
- Run commands from the repository root.

## Automated validation

Run the focused tests introduced for this feature, then the existing mobile, combat, and visual-template suites they build on:

```bash
npm test
npm run verify:mobile
npm run verify:combat
npm run verify:visual-templates
npm run build
```

When the feature-specific test command is added in task implementation, use it before the broader verification commands.

Expected outcomes:

- Map action-bar contracts prove icon controls have stable names, tooltips, availability state, and no duplicated map action behavior.
- Responsive browser coverage proves End Turn and other required map actions can be activated at a phone viewport without page scrolling.
- Battle coverage proves the queue is beneath the canvas, retains current turn order, identifies entries on hover, and updates after actions or defeat.
- Visual-template coverage proves each queue entry uses a dedicated template when available and a readable fallback otherwise.
- The production build completes successfully.

## Manual browser smoke check

1. Run `npm run dev` and open a current scenario at a phone-sized viewport such as 390 × 844.
2. Confirm the map action icons form a narrow vertical bar beside the canvas. Activate Zoom In, Zoom Out, and End Turn without scrolling the document.
3. On a pointer-capable viewport, hover each map action icon and confirm its tooltip shows the action name.
4. Trigger a guard battle. Confirm the unit queue appears as one horizontal strip directly below the canvas.
5. Hover every visible queue unit on a pointer-capable viewport; confirm it identifies that unit and uses its template (or a readable fallback).
6. Take a battle action and confirm the active unit and queue order refresh while the queue remains below the canvas.

See [gameplay-control-layout.md](contracts/gameplay-control-layout.md) for the detailed player-visible contract and [data-model.md](data-model.md) for its derived presentation state.
