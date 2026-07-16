import { createBattleFormation } from "./battleFormation";
import { createBattleTargetingState } from "./battleTargeting";
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
    state.visualStates.unitStates[unit.id] = { stateName: "idle" };
  }

  const battle: Battle = {
    id: `battle-${guardForceId}`,
    attackingHeroId: heroId,
    defendingForceId: guardForceId,
    participants,
    formation: createBattleFormation(
      attackerUnits.map((unit) => unit.id),
      defenderUnits.map((unit) => unit.id)
    ),
    turnQueue: participants.map((participant) => participant.unitId),
    activeUnitId: participants[0]?.unitId ?? "",
    targetingState: null,
    defendStates: [],
    battleState: "active",
    outcome: null
  };

  battle.targetingState = createBattleTargetingState(state, battle, battle.activeUnitId);
  if (battle.activeUnitId) {
    state.visualStates.unitStates[battle.activeUnitId] = { stateName: "ready" };
  }
  return battle;
}
