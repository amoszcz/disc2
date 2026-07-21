# UI Contract: Shared Button

## Purpose

Defines the observable contract for every button rendered by the application. This contract applies to player-facing and developer-tool controls alike.

## Required Base Semantics

- Every rendered control is a native button with button behavior unless its explicitly supplied type differs.
- Every control has the shared button presentation marker.
- An icon-only control supplies an accessible name and descriptive tooltip.
- Supplied IDs, test hooks, and screen action data remain present and unchanged.

## Supported Configuration

| Need | Observable result |
|---|---|
| Primary, secondary, quiet, or icon treatment | A matching shared presentation treatment is present. |
| Default or compact size | A matching shared size treatment is present. |
| Selected entry | Selected presentation is present; selected state remains distinguishable from focus. |
| Persistent pressed action | Pressed state is exposed to assistive technology and has a pressed appearance. |
| Busy action | Busy state is exposed to assistive technology and the control is unavailable. |
| Disabled action | The control is unavailable and visibly subdued. |

## Interaction States

| State | Required observable behavior |
|---|---|
| Resting | Meets the standard visual treatment and remains activatable when enabled. |
| Hovered | On hover-capable devices, visibly elevates or highlights relative to resting. |
| Pressed | While activated, visibly depresses relative to resting. |
| Focused | Keyboard focus is visible without depending on color alone. |
| Disabled | Cannot be activated and lacks enabled-state elevation or press behavior. |
| Busy | Cannot be activated and communicates in-progress state. |
| Selected | Has a persistent selection indicator that does not conceal focus. |

## Migration Invariants

- All current menu, map, battle, settings, storybook, victory, and sprite-mapping buttons use this contract.
- Existing button labels or icons, event identity, action data, and availability rules remain unchanged.
- No separately authored base button markup is permitted outside the shared button presentation.

## Retained-Control Inventory

| Surface | Retained control identity | Availability rule |
|---|---|---|
| Main menu | Scenario start controls and storybook, settings, and sprite-mapping actions | Available while the main menu is shown. |
| Map | Settings, zoom out, zoom in, and end-turn controls | Zoom controls remain available; end turn remains unavailable during route traversal. |
| Battle | Strike and defend controls | Retain the current player-turn, target-readiness, and transition rules. |
| Victory and storybook | Return-to-menu controls | Available while their overlay is shown. |
| Sprite mapping | Zoom, reset, save, copy, download, return, apply, and gallery-entry controls | Retain current zoom bounds, document availability, dirty-state, validation, saving, and selected-entry rules. |
