# Contract: Mobile Layout UX

## Purpose

Define the player-visible layout contract for using the game on a narrow mobile browser viewport.

## Main Menu Contract

- A fresh launch on a supported mobile browser must show the main menu without requiring horizontal page scrolling.
- Scenario options must remain readable and tappable on a phone-sized viewport.
- The mobile menu may stack the play surface and action panel vertically, but scenario launch actions must stay visible without hidden desktop-only affordances.
- The player must be able to start any available scenario from the menu without mouse or keyboard input.

## Active Gameplay Layout Contract

- During map and battle scenes, the main play surface and required controls must remain visible or reachable within the mobile layout.
- The active mobile layout may move the sidebar below the canvas, provided the canvas, battle controls, end-turn action, and return-to-menu action stay reachable in the same page state.
- If the live viewport becomes too tight for comfortable map readability, explicit zoom controls must remain available without relying on wheel input.
- When a player uses a two-finger zoom gesture on the play surface, the layout must remain stable and the canvas must continue to fit within the mobile shell without runaway growth or page zoom.
- Primary actions such as ending the turn, choosing battle actions, and returning to the menu after completion must remain easy to access on a small screen.
- Text labels that convey required actions or state must stay readable on supported mobile viewports.

## Viewport Change Contract

- Changing viewport size or orientation must not require reloading the page to restore usability.
- Layout adjustments must preserve the active scene and keep required controls available afterward.
- Layout recalculation must preserve the current session and keep canvas hit testing aligned with the resized display surface.
- The mobile layout may rearrange supporting panels, but it must not hide required actions behind inaccessible presentation states.

## Usability Signals

- A player can tell how to begin a scenario from the mobile menu without external instructions.
- A player can identify where to tap for primary gameplay actions while in map, battle, and victory scenes, including mobile zoom and replay actions when shown.
- A player can continue playing after rotating the device or after browser chrome changes the visible viewport height.
