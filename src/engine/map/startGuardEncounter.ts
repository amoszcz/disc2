import type { GameState } from "../scenario/types";
import { createBattle } from "../battle/createBattle";
import { findGuardedLocationAtHero, getGuardForce, isLocationBlocked } from "./guardRules";

type GuardEncounterFailure = { ok: false; reason: string };
type GuardEncounterSuccess = {
  ok: true;
  battle: ReturnType<typeof createBattle>;
  location: NonNullable<ReturnType<typeof findGuardedLocationAtHero>>;
};

export function startGuardEncounter(state: GameState, heroId: string): GuardEncounterFailure | GuardEncounterSuccess {
  const hero = state.scenario.heroes.find((entry) => entry.id === heroId);
  if (!hero) {
    return { ok: false, reason: "Missing hero." };
  }

  const battleCapableUnits = state.scenario.units.filter(
    (unit) => hero.unitIds.includes(unit.id) && !unit.defeatState && unit.currentHealth > 0
  );
  if (battleCapableUnits.length === 0) {
    return { ok: false, reason: "This hero has no battle-capable units." };
  }

  const location = findGuardedLocationAtHero(state, heroId);
  if (!location || !isLocationBlocked(state, location)) {
    return { ok: false, reason: "No blocked location is present here." };
  }

  const force = getGuardForce(state, location);
  if (!force) {
    return { ok: false, reason: "Missing guard force." };
  }

  const battle = createBattle(state, heroId, force.id);
  return { ok: true, battle, location };
}
