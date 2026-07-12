import type { GameState } from "../../engine/scenario/types";
import { unlockLocation } from "../../engine/map/guardRules";

export function applyBattleOutcome(state: GameState): void {
  const battle = state.battle;
  if (!battle || !battle.outcome) {
    return;
  }

  const hero = state.scenario.heroes.find((entry) => entry.id === battle.attackingHeroId);
  const guardForce = state.scenario.guardForces.find((entry) => entry.id === battle.defendingForceId);
  if (!hero || !guardForce) {
    return;
  }

  if (battle.outcome.winner === "attacker") {
    guardForce.defeatState = true;
    const guardOwner = state.scenario.players.find((entry) => entry.id === "neutral-guards");
    if (guardOwner) {
      guardOwner.defeatState = true;
    }

    unlockLocation(state, guardForce.guardedLocationId, hero.ownerPlayerId);
    hero.experience += battle.outcome.heroExperienceAwarded;
    state.messageLog.push(`${hero.name} won the battle and gained ${battle.outcome.heroExperienceAwarded} experience.`);
  } else {
    hero.availabilityState = "defeated";
    const player = state.scenario.players.find((entry) => entry.id === hero.ownerPlayerId);
    if (player) {
      player.defeatState = true;
    }
    state.messageLog.push(`${hero.name} was driven back by the guards.`);
  }
}
