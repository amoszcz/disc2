# Contract: Map Travel UX

## Purpose

Define the player-visible travel behavior for entering and leaving linked submaps.

## Entry Travel Contract

- A player must be able to trigger linked-map travel from a valid cave, teleport, or comparable scenario-defined entry trigger during normal map play.
- Entering a submap must keep the scenario session active rather than dropping the player into a separate scenario shell.
- The player must appear at the configured arrival point for the triggered destination map.

## Exit Travel Contract

- A player must be able to leave a submap through a defined exit point during normal map play.
- Each exit point must return the player to its specific linked destination rather than a generic fallback return tile.
- Returning from a submap must preserve normal playability immediately after arrival.

## Continuity Contract

- Repeated travel between linked maps must preserve current session state.
- Progress made on a map before leaving it must still be reflected when the player returns during the same session.
- Travel must only occur from scenes where map interaction is valid; unsupported scenes must not silently corrupt the session.

## Feedback Contract

- The player must be able to tell when they have entered or exited a linked map.
- Travel failures caused by invalid data or unavailable transitions must provide understandable feedback without breaking the current map session.
# Map Travel UX Contract

## Visible Feedback

- The map HUD shows the current active map name.
- After a successful transition, the HUD and overlay expose a travel message describing the entry, teleport, or return event.
- Route, pan, and zoom controls continue using the existing map scene after travel; the transition is not a scenario reload.

## Transition Messaging

- Cave entry copy should communicate entry into the destination submap.
- Teleport entry copy should communicate teleport travel into the destination submap.
- Exit copy should communicate return to the destination parent map.
- Invalid-link copy should clearly state that the linked passage is unavailable or unsafe.

## Continuity Expectations

- Travel resets route-preview state that belonged to the previous active map.
- The viewport re-centers on the newly active map after a successful transition.
- Hidden-map heroes, pickups, and guarded locations are not rendered or selectable while another world map is active.
