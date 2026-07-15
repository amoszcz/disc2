import { BATTLE_FORMATION_COLUMNS, findBattleFormationSlotByUnitId, getLivingUnitIdsInColumn } from "./battleFormation";
import type { AttackCategory, Battle, BattleParticipant, BattleSide, BattleTargetingState, GameState, ScenarioUnit } from "../scenario/types";

export function getBattleUnit(state: GameState, unitId: string): ScenarioUnit {
  const unit = state.scenario.units.find((entry) => entry.id === unitId);
  if (!unit) {
    throw new Error(`Missing unit ${unitId}.`);
  }
  return unit;
}

export function getBattleParticipant(battle: Battle, unitId: string): BattleParticipant {
  const participant = battle.participants.find((entry) => entry.unitId === unitId);
  if (!participant) {
    throw new Error(`Missing participant ${unitId}.`);
  }
  return participant;
}

export function unitIsAlive(state: GameState, unitId: string): boolean {
  const unit = state.scenario.units.find((entry) => entry.id === unitId);
  return Boolean(unit && !unit.defeatState && unit.currentHealth > 0);
}

export function getUnitAttackCategory(state: GameState, unitId: string): AttackCategory {
  return getBattleUnit(state, unitId).attackCategory;
}

export function getOpposingSide(side: BattleSide): BattleSide {
  return side === "attacker" ? "defender" : "attacker";
}

export function isPlayerControlledBattleUnit(state: GameState, unitId: string): boolean {
  const unit = getBattleUnit(state, unitId);
  const player = state.scenario.players.find((entry) => entry.id === unit.ownerSideId);
  return Boolean(player?.isHumanControlled);
}

function getLivingEnemyUnitIds(state: GameState, battle: Battle, actingSide: BattleSide): string[] {
  return battle.participants
    .filter((participant) => participant.side !== actingSide)
    .map((participant) => participant.unitId)
    .filter((unitId) => unitIsAlive(state, unitId));
}

function getMeleeTargetUnitIds(state: GameState, battle: Battle, actingSide: BattleSide): string[] {
  const opposingSide = getOpposingSide(actingSide);
  const adjacentTargets = getLivingUnitIdsInColumn(state, battle, opposingSide, 0);
  if (adjacentTargets.length > 0) {
    return adjacentTargets;
  }

  return getLivingUnitIdsInColumn(state, battle, opposingSide, 1);
}

export function getLegalTargetUnitIds(state: GameState, battle: Battle, actingUnitId: string): string[] {
  const actingSide = getBattleParticipant(battle, actingUnitId).side;
  switch (getUnitAttackCategory(state, actingUnitId)) {
    case "melee":
      return getMeleeTargetUnitIds(state, battle, actingSide);
    case "ranged":
    case "area":
      return getLivingEnemyUnitIds(state, battle, actingSide);
    default:
      return [];
  }
}

export function createBattleTargetingState(state: GameState, battle: Battle, activeUnitId: string): BattleTargetingState {
  const legalTargetUnitIds = getLegalTargetUnitIds(state, battle, activeUnitId);
  const attackCategory = getUnitAttackCategory(state, activeUnitId);
  return {
    activeUnitId,
    selectedTargetUnitId: null,
    legalTargetUnitIds,
    canStrike: attackCategory === "area" ? legalTargetUnitIds.length > 0 : false,
    canDefend: true
  };
}

export function selectBattleTarget(_state: GameState, battle: Battle, targetUnitId: string): boolean {
  const targetingState = battle.targetingState;
  if (!targetingState) {
    return false;
  }

  if (!targetingState.legalTargetUnitIds.includes(targetUnitId)) {
    return false;
  }

  targetingState.selectedTargetUnitId = targetUnitId;
  targetingState.canStrike = true;
  return true;
}

export function clearInvalidSelectedTarget(state: GameState, battle: Battle): void {
  const targetingState = battle.targetingState;
  if (!targetingState) {
    return;
  }

  if (!targetingState.selectedTargetUnitId) {
    targetingState.canStrike =
      getUnitAttackCategory(state, targetingState.activeUnitId) === "area" ? targetingState.legalTargetUnitIds.length > 0 : false;
    return;
  }

  if (!targetingState.legalTargetUnitIds.includes(targetingState.selectedTargetUnitId)) {
    targetingState.selectedTargetUnitId = null;
    targetingState.canStrike = false;
  }
}

export function getAutomaticTargetUnitId(state: GameState, battle: Battle, actingUnitId: string): string | null {
  const legalTargetUnitIds = getLegalTargetUnitIds(state, battle, actingUnitId);
  return legalTargetUnitIds[0] ?? null;
}

export function getFormationSlotForUnit(battle: Battle, unitId: string) {
  return findBattleFormationSlotByUnitId(battle.formation, unitId);
}

export function getLegalTargetColumnsForMelee(state: GameState, battle: Battle, actingSide: BattleSide): number[] {
  const adjacent = getLivingUnitIdsInColumn(state, battle, getOpposingSide(actingSide), 0);
  if (adjacent.length > 0) {
    return [0];
  }

  const nextColumn = getLivingUnitIdsInColumn(state, battle, getOpposingSide(actingSide), 1);
  return nextColumn.length > 0 ? [1] : [];
}

export function getAllFormationColumns(): number[] {
  return Array.from({ length: BATTLE_FORMATION_COLUMNS }, (_, index) => index);
}
