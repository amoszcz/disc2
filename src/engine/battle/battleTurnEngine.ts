import {
  clearInvalidSelectedTarget,
  createBattleTargetingState,
  getAutomaticTargetUnitId,
  getBattleParticipant,
  getBattleUnit,
  getLegalTargetUnitIds,
  getUnitAttackCategory,
  isPlayerControlledBattleUnit,
  selectBattleTarget,
  unitIsAlive
} from "./battleTargeting";
import type { Battle, GameState, ScenarioUnit } from "../scenario/types";

function applyDefendMitigation(battle: Battle, targetUnitId: string, baseDamage: number): number {
  const defendState = battle.defendStates.find((entry) => entry.unitId === targetUnitId && entry.isActive);
  if (!defendState) {
    return baseDamage;
  }

  return Math.max(1, Math.ceil(baseDamage * defendState.damageMultiplier));
}

function markUnitDefeated(unit: ScenarioUnit): void {
  unit.currentHealth = 0;
  unit.defeatState = true;
  unit.actionState = "defeated";
}

function applyDamageToUnit(state: GameState, battle: Battle, unitId: string, baseDamage: number): number {
  const unit = getBattleUnit(state, unitId);
  const appliedDamage = applyDefendMitigation(battle, unitId, baseDamage);
  unit.currentHealth = Math.max(0, unit.currentHealth - appliedDamage);
  if (unit.currentHealth === 0) {
    markUnitDefeated(unit);
  }
  return appliedDamage;
}

function expireDefendStateForUnit(battle: Battle, unitId: string): void {
  for (const defendState of battle.defendStates) {
    if (defendState.unitId === unitId) {
      defendState.isActive = false;
    }
  }
}

function getStrikeTargetUnitIds(state: GameState, battle: Battle, actorId: string): string[] {
  const attackCategory = getUnitAttackCategory(state, actorId);
  if (attackCategory === "area") {
    return getLegalTargetUnitIds(state, battle, actorId);
  }

  const selectedTargetUnitId = battle.targetingState?.selectedTargetUnitId ?? null;
  if (!selectedTargetUnitId) {
    return [];
  }

  return [selectedTargetUnitId];
}

export function canBattleContinue(state: GameState, battle: Battle): boolean {
  const aliveBySide = battle.participants.reduce<Record<string, number>>((totals, participant) => {
    if (unitIsAlive(state, participant.unitId)) {
      totals[participant.side] = (totals[participant.side] ?? 0) + 1;
    }
    return totals;
  }, {});

  return Boolean(aliveBySide.attacker && aliveBySide.defender);
}

export function performStrikeAction(state: GameState, battle: Battle): string {
  const actor = getBattleUnit(state, battle.activeUnitId);
  if (actor.defeatState || actor.currentHealth <= 0 || actor.actionState === "spent") {
    throw new Error("The active unit cannot act.");
  }

  const targetUnitIds = getStrikeTargetUnitIds(state, battle, actor.id);
  if (targetUnitIds.length === 0) {
    throw new Error("No legal battle target.");
  }

  const hitSummaries = targetUnitIds.map((targetUnitId) => {
    const target = getBattleUnit(state, targetUnitId);
    const dealtDamage = applyDamageToUnit(state, battle, targetUnitId, actor.attackValue);
    return `${target.name} for ${dealtDamage}`;
  });

  actor.actionState = "spent";
  return `${actor.name} strikes ${hitSummaries.join(", ")}.`;
}

export function performDefendAction(state: GameState, battle: Battle): string {
  const actor = getBattleUnit(state, battle.activeUnitId);
  if (actor.defeatState || actor.currentHealth <= 0 || actor.actionState === "spent") {
    throw new Error("The active unit cannot act.");
  }

  const existing = battle.defendStates.find((entry) => entry.unitId === actor.id);
  if (existing) {
    existing.damageMultiplier = 0.5;
    existing.expiresOnUnitTurnId = actor.id;
    existing.isActive = true;
  } else {
    battle.defendStates.push({
      unitId: actor.id,
      damageMultiplier: 0.5,
      expiresOnUnitTurnId: actor.id,
      isActive: true
    });
  }

  actor.actionState = "spent";
  return `${actor.name} defends and braces for the next attack.`;
}

export function advanceBattleQueue(state: GameState, battle: Battle): void {
  const aliveQueue = battle.turnQueue.filter((unitId) => unitIsAlive(state, unitId));

  if (aliveQueue.length === 0) {
    battle.turnQueue = [];
    battle.activeUnitId = "";
    battle.targetingState = null;
    return;
  }

  const [current, ...rest] = aliveQueue;
  const currentUnit = getBattleUnit(state, current);
  const rotated = [...rest, current];

  currentUnit.actionState = currentUnit.defeatState ? "defeated" : "ready";

  battle.turnQueue = rotated;
  battle.activeUnitId = rotated[0] ?? current;
  expireDefendStateForUnit(battle, battle.activeUnitId);
  battle.targetingState = createBattleTargetingState(state, battle, battle.activeUnitId);
  clearInvalidSelectedTarget(state, battle);
}

export function performAutomaticBattleAction(state: GameState, battle: Battle): string {
  const actorId = battle.activeUnitId;
  const automaticTargetUnitId = getAutomaticTargetUnitId(state, battle, actorId);
  if (automaticTargetUnitId) {
    selectBattleTarget(state, battle, automaticTargetUnitId);
    return performStrikeAction(state, battle);
  }

  return performDefendAction(state, battle);
}

export function activeBattleUnitIsPlayerControlled(state: GameState, battle: Battle): boolean {
  return isPlayerControlledBattleUnit(state, battle.activeUnitId);
}

export function refreshBattleTargetingState(state: GameState, battle: Battle): void {
  battle.targetingState = createBattleTargetingState(state, battle, battle.activeUnitId);
  clearInvalidSelectedTarget(state, battle);
}

export function trySelectBattleTarget(state: GameState, battle: Battle, targetUnitId: string): boolean {
  return selectBattleTarget(state, battle, targetUnitId);
}

export function canBattleStrike(state: GameState, battle: Battle): boolean {
  const targetingState = battle.targetingState ?? createBattleTargetingState(state, battle, battle.activeUnitId);
  battle.targetingState = targetingState;
  clearInvalidSelectedTarget(state, battle);
  return targetingState.canStrike;
}

export function getActingBattleSide(battle: Battle): "attacker" | "defender" {
  return getBattleParticipant(battle, battle.activeUnitId).side;
}
