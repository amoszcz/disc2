import type { GameState, ResourcePickup, ScenarioPlayer } from "../scenario/types";
import { positionsEqual } from "./mapRules";

function addPickupToPlayer(player: ScenarioPlayer, pickup: ResourcePickup): void {
  if (pickup.resourceType === "gold") {
    player.resourceStockpile.gold += pickup.amount;
  }
}

export function collectPickupIfPresent(state: GameState, heroId: string): boolean {
  const hero = state.scenario.heroes.find((entry) => entry.id === heroId);
  if (!hero) {
    return false;
  }

  const pickup = state.scenario.resourcePickups.find(
    (entry) => !entry.collectedState && positionsEqual(entry.mapPosition, hero.mapPosition)
  );

  if (!pickup) {
    return false;
  }

  const player = state.scenario.players.find((entry) => entry.id === hero.ownerPlayerId);
  if (!player) {
    return false;
  }

  addPickupToPlayer(player, pickup);
  pickup.collectedState = true;
  state.messageLog.push(`${hero.name} collected ${pickup.amount} gold.`);
  return true;
}
