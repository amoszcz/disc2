import type { Battle, BattleParticipant, GameState, ScenarioUnit } from "../scenario/types";

function createParticipant(unit: ScenarioUnit, side: "attacker" | "defender"): BattleParticipant {
  return {
    unitId: unit.id,
    side,
    orderKey: unit.agility
  };
}

export function createBattle(state: GameState, heroId: string, guardForceId: string): Battle {
  const hero = state.scenario.heroes.find((entry) => entry.id === heroId);
  const force = state.scenario.guardForces.find((entry) => entry.id === guardForceId);
  if (!hero || !force) {
    throw new Error("Cannot start battle without a valid hero and guard force.");
  }

  const attackerUnits = state.scenario.units.filter(
    (unit) => hero.unitIds.includes(unit.id) && !unit.defeatState && unit.currentHealth > 0
  );
  const defenderUnits = state.scenario.units.filter(
    (unit) => force.unitIds.includes(unit.id) && !unit.defeatState && unit.currentHealth > 0
  );

  const participants = [
    ...attackerUnits.map((unit) => createParticipant(unit, "attacker")),
    ...defenderUnits.map((unit) => createParticipant(unit, "defender"))
  ].sort((left, right) => {
    if (right.orderKey !== left.orderKey) {
      return right.orderKey - left.orderKey;
    }
    return left.unitId.localeCompare(right.unitId);
  });

  for (const unit of [...attackerUnits, ...defenderUnits]) {
    unit.actionState = "ready";
  }

  return {
    id: `battle-${guardForceId}`,
    attackingHeroId: heroId,
    defendingForceId: guardForceId,
    participants,
    turnQueue: participants.map((participant) => participant.unitId),
    activeUnitId: participants[0]?.unitId ?? "",
    battleState: "active",
    outcome: null
  };
}
