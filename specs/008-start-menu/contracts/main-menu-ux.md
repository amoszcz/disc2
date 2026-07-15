# Contract: Main Menu UX

## Purpose

Define the player-visible contract for initial menu entry and scenario selection.

## Initial Presentation Contract

- A fresh application launch must show the main menu before any scenario map or battle scene appears.
- The main menu must present each available scenario as a distinct start option.
- Each scenario option must include a clear player-facing label.

## Scenario Selection Contract

- Selecting a scenario must start that scenario and remove the main menu from view.
- Starting one scenario must not accidentally open a different scenario.
- Reopening the application or returning to the main menu must make the same scenario choices available again unless future features intentionally change availability.

## Usability Signals

- A player can tell they are not yet inside gameplay when the menu is visible.
- A player can identify which scenario they are about to start without relying on developer-only identifiers.
- A player can start a chosen scenario without using URL query parameters or external controls.
