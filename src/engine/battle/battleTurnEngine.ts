import type { Battle, BattleParticipant, GameState, ScenarioUnit } from "../scenario/types";

function getUnit(state: GameState, unitId: string): ScenarioUnit {
  const unit = state.scenario.units.find((entry) => entry.id === unitId);
  if (!unit) {
    throw new Error(`Missing unit ${unitId}.`);
  }
  return unit;
}

function getParticipant(battle: Battle, unitId: string): BattleParticipant {
  const participant = battle.participants.find((entry) => entry.unitId === unitId);
  if (!participant) {
    throw new Error(`Missing participant ${unitId}.`);
  }
  return participant;
}

function findTarget(state: GameState, battle: Battle, side: "attacker" | "defender"): ScenarioUnit | undefined {
  return battle.participants
    .filter((participant) => participant.side !== side)
    .map((participant) => getUnit(state, participant.unitId))
    .filter((unit) => !unit.defeatState && unit.currentHealth > 0)
    .sort((left, right) => left.currentHealth - right.currentHealth || left.id.localeCompare(right.id))[0];
}

export function canBattleContinue(state: GameState, battle: Battle): boolean {
  const aliveBySide = battle.participants.reduce<Record<string, number>>((totals, participant) => {
    const unit = getUnit(state, participant.unitId);
    if (!unit.defeatState && unit.currentHealth > 0) {
      totals[participant.side] = (totals[participant.side] ?? 0) + 1;
    }
    return totals;
  }, {});

  return Boolean(aliveBySide.attacker && aliveBySide.defender);
}

export function performAttack(state: GameState, battle: Battle): string {
  const actor = getUnit(state, battle.activeUnitId);
  if (actor.defeatState || actor.currentHealth <= 0 || actor.actionState === "spent") {
    throw new Error("The active unit cannot act.");
  }

  const participant = getParticipant(battle, actor.id);
  const target = findTarget(state, battle, participant.side);
  if (!target) {
    throw new Error("No legal battle target.");
  }

  target.currentHealth = Math.max(0, target.currentHealth - actor.attackValue);
  if (target.currentHealth === 0) {
    target.defeatState = true;
    target.actionState = "defeated";
  }

  actor.actionState = "spent";
  return `${actor.name} strikes ${target.name} for ${actor.attackValue}.`;
}

export function advanceBattleQueue(state: GameState, battle: Battle): void {
  const aliveQueue = battle.turnQueue.filter((unitId) => {
    const unit = getUnit(state, unitId);
    return !unit.defeatState && unit.currentHealth > 0;
  });

  if (aliveQueue.length === 0) {
    battle.turnQueue = [];
    battle.activeUnitId = "";
    return;
  }

  const [current, ...rest] = aliveQueue;
  const currentUnit = getUnit(state, current);
  const rotated = [...rest, current];

  currentUnit.actionState = currentUnit.defeatState ? "defeated" : "ready";

  battle.turnQueue = rotated;
  battle.activeUnitId = rotated[0] ?? current;
}
