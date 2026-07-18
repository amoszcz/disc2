# Contract: Gameplay Control Layout

## Purpose

Define the player-visible contract for the map action bar and battle turn queue.

## Map Action Bar Contract

- During a map scene, a map action bar is rendered adjacent to the canvas play surface.
- The bar presents its controls vertically and compactly; full action labels are not permanently displayed in the bar.
- Every action currently required to operate or progress the map scene is represented once, including End Turn when it is available.
- Each action icon is a semantic control with a stable test identifier, an accessible action name, and a hover tooltip containing that same action name.
- On touch-capable devices, a player can activate every available action without hover.
- Unavailable actions are visibly disabled and do not invoke the underlying action.
- At supported phone viewports, the player can activate the required actions without document scrolling.
- Activating an available action produces the same game-state transition and messages as the current corresponding control.

## Battle Turn Queue Contract

- During a battle scene, a battle turn queue is rendered below the battle canvas.
- Queue entries are laid out horizontally in the exact current `battle.turnQueue` order.
- Each queue entry identifies its unit through a hover tooltip and accessible name.
- Each queue entry uses the resolved dedicated unit visual template when available; otherwise it uses the established readable fallback representation.
- The active queue entry is visually identifiable and corresponds to the active battle unit.
- After a battle action, automatic turn advance, or unit defeat, the next render reflects the current battle order and excludes units no longer eligible to act.
- The queue must not overlap the battle canvas or conceal required battle actions at supported viewport widths.

## Responsive Placement Contract

- The map action bar remains adjacent to the map play surface at both supported desktop and phone layouts.
- The battle queue remains below the battle canvas at both supported desktop and phone layouts.
- Tooltips remain supplemental and must not gate map or battle play on touch-only devices.
