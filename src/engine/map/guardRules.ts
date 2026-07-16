import type { GameState, GuardForce, GuardedLocation } from "../scenario/types";
import { positionsEqual } from "./mapRules";

export function findGuardedLocationAtHero(state: GameState, heroId: string): GuardedLocation | undefined {
  const hero = state.scenario.heroes.find((entry) => entry.id === heroId);
  if (!hero) {
    return undefined;
  }

  return state.scenario.guardedLocations.find(
    (location) => location.mapId === hero.mapId && positionsEqual(location.mapPosition, hero.mapPosition)
  );
}

export function getGuardForce(state: GameState, location: GuardedLocation): GuardForce | undefined {
  return state.scenario.guardForces.find((force) => force.id === location.guardForceId);
}

export function isLocationBlocked(state: GameState, location: GuardedLocation): boolean {
  const force = getGuardForce(state, location);
  return location.accessState === "blocked" && Boolean(force && !force.defeatState);
}

export function unlockLocation(state: GameState, locationId: string, ownerPlayerId: string): void {
  const location = state.scenario.guardedLocations.find((entry) => entry.id === locationId);
  if (!location) {
    return;
  }

  location.accessState = "open";
  location.ownerPlayerId = ownerPlayerId;
}
