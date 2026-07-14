# Contract: Route Preview State

## Purpose

Define the interaction-state contract for route preview, confirmation, clearing, and continuation.

## Route Preview Contract

A plotted route must provide:

- The owning hero identity
- The destination tile
- The ordered legal steps from current position to destination
- The total projected movement cost
- Enough state to distinguish preview from confirmation

## Confirmation Guarantees

- A first click on a destination plots a route but does not spend movement.
- A second click on the same active destination confirms movement along the stored route.
- Clicking a different destination replaces the stored route instead of confirming the old one.
- Clicking the hero that owns the active route clears that route instead of confirming or moving.
- Changing the selected hero invalidates confirmation ownership for the old route.

## Continuation Guarantees

- Partial traversal may leave a route active after movement ends.
- Ending the turn does not automatically discard an unfinished active route.
- Ending the turn may automatically advance the route as far as legal movement allows before preserving any unfinished remainder.
- Continuing on a later turn requires route revalidation before additional movement is applied.

## Validation Guarantees

- Unreachable destinations must not produce a confirmable route.
- Completed destinations must no longer remain active.
- Stored route state must never cause movement for a hero other than the one that owns the route.
- Clearing a route through hero click must not spend movement or alter hero position.
