# Contract: Storybook Menu Access

## Purpose

Define the user-visible navigation contract for reaching and leaving the asset storybook from the existing menu flow.

## Menu Entry Contract

- The main menu must expose a distinct action for opening the asset storybook in addition to scenario-start actions.
- The storybook action must be labeled clearly enough that a developer or artist can identify it as a visual review tool rather than a playable scenario.
- The storybook action must remain available on desktop and mobile menu layouts.
- Selecting the storybook action must open the dedicated storybook scene instead of mutating or starting scenario progress.

## Return Flow Contract

- The storybook view must provide a clear way to return to the main menu.
- Returning to the menu from the storybook must leave the main menu usable for immediately starting a scenario or reopening the storybook.
- The return flow must not leave the app in battle, map, or victory mode unless the user explicitly starts a scenario afterward.

## UI Contract Signals

- The menu should expose stable selectors or structural markers for:
- the main menu shell
- the storybook entry action
- the scenario option list
- the storybook return action
- The storybook scene should expose a stable shell marker distinct from battle, map, and victory overlays so acceptance tests can identify it directly.

## Acceptance Signals

- A browser test can open the game, enter the storybook from the menu, and return to the menu without touching scenario state.
- A contract test can verify that the menu renders both scenario-start actions and the storybook action in a stable structure.
