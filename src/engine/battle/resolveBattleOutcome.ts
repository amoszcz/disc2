import type { Battle, BattleOutcome, GameState } from "../scenario/types";

function unitIsAlive(state: GameState, unitId: string): boolean {
  const unit = state.scenario.units.find((entry) => entry.id === unitId);
  return Boolean(unit && !unit.defeatState && unit.currentHealth > 0);
}

export function resolveBattleOutcome(state: GameState, battle: Battle): BattleOutcome {
  const attackerAlive = battle.participants
    .filter((participant) => participant.side === "attacker")
    .some((participant) => unitIsAlive(state, participant.unitId));

  const defenderAlive = battle.participants
    .filter((participant) => participant.side === "defender")
    .some((participant) => unitIsAlive(state, participant.unitId));

  const winner = attackerAlive && !defenderAlive ? "attacker" : "defender";
  const defeatedUnitIds = battle.participants
    .filter((participant) => !unitIsAlive(state, participant.unitId))
    .map((participant) => participant.unitId);
  const survivingAttackerUnitIds = battle.participants
    .filter((participant) => participant.side === "attacker" && unitIsAlive(state, participant.unitId))
    .map((participant) => participant.unitId);
  const survivingDefenderUnitIds = battle.participants
    .filter((participant) => participant.side === "defender" && unitIsAlive(state, participant.unitId))
    .map((participant) => participant.unitId);

  const outcome: BattleOutcome = {
    winner,
    defeatedUnitIds,
    survivingAttackerUnitIds,
    survivingDefenderUnitIds,
    heroExperienceAwarded: winner === "attacker" ? 5 : 0
  };

  battle.battleState = "resolved";
  battle.outcome = outcome;
  return outcome;
}
