import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { findGuardedLocationAtHero, unlockLocation } from "../../src/engine/map/guardRules";

describe("guard location contract", () => {
  test("location stays blocked until unlocked after battle", () => {
    const state = createInitialState();
    const hero = state.scenario.heroes[0];
    hero.mapPosition = { x: 3, y: 2 };
    const location = findGuardedLocationAtHero(state, hero.id);
    expect(location?.accessState).toBe("blocked");

    unlockLocation(state, "guarded-location-1", hero.ownerPlayerId);
    expect(state.scenario.guardedLocations[0].accessState).toBe("open");
    expect(state.scenario.guardedLocations[0].ownerPlayerId).toBe(hero.ownerPlayerId);
  });
});
