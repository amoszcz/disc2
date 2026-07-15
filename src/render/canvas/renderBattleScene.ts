import type { BattleFormationSlot, GameState } from "../../engine/scenario/types";
import { getBattleCanvasSlotCenter, BATTLE_SLOT_HEIGHT, BATTLE_SLOT_WIDTH } from "../../engine/battle/battleFormation";
import { getBattleParticipant, getBattleUnit, getUnitAttackCategory, isPlayerControlledBattleUnit } from "../../engine/battle/battleTargeting";
import { palette } from "../sprites/placeholders";

function drawFormationSlot(context: CanvasRenderingContext2D, slot: BattleFormationSlot): void {
  const center = getBattleCanvasSlotCenter(slot);
  context.save();
  context.fillStyle = palette.battleSlot;
  context.strokeStyle = palette.battleSlotBorder;
  context.lineWidth = 2;
  context.fillRect(center.x - BATTLE_SLOT_WIDTH / 2, center.y - BATTLE_SLOT_HEIGHT / 2, BATTLE_SLOT_WIDTH, BATTLE_SLOT_HEIGHT);
  context.strokeRect(center.x - BATTLE_SLOT_WIDTH / 2, center.y - BATTLE_SLOT_HEIGHT / 2, BATTLE_SLOT_WIDTH, BATTLE_SLOT_HEIGHT);
  context.restore();
}

function drawUnitCard(
  context: CanvasRenderingContext2D,
  state: GameState,
  slot: BattleFormationSlot,
  legalTargetUnitIds: string[],
  selectedTargetUnitId: string | null
): void {
  if (!slot.unitId) {
    return;
  }

  const unit = getBattleUnit(state, slot.unitId);
  const isAlive = !unit.defeatState && unit.currentHealth > 0;
  const center = getBattleCanvasSlotCenter(slot);
  const left = center.x - BATTLE_SLOT_WIDTH / 2 + 4;
  const top = center.y - BATTLE_SLOT_HEIGHT / 2 + 4;
  const width = BATTLE_SLOT_WIDTH - 8;
  const height = BATTLE_SLOT_HEIGHT - 8;
  const isActive = state.battle?.activeUnitId === unit.id;
  const isLegalTarget = legalTargetUnitIds.includes(unit.id);
  const isSelectedTarget = selectedTargetUnitId === unit.id;
  const isDefending = state.battle?.defendStates.some((entry) => entry.unitId === unit.id && entry.isActive);

  context.save();
  context.fillStyle = !isAlive ? "#9f9487" : slot.side === "attacker" ? palette.attacker : palette.defender;
  context.fillRect(left, top, width, height);

  context.lineWidth = isSelectedTarget ? 4 : isLegalTarget ? 3 : isActive ? 3 : 1;
  context.strokeStyle = isSelectedTarget ? palette.battleSelected : isLegalTarget ? palette.battleLegal : isActive ? palette.battleActive : "#ffffff";
  context.strokeRect(left, top, width, height);

  if (isDefending && isAlive) {
    context.strokeStyle = palette.battleDefending;
    context.setLineDash([6, 4]);
    context.lineWidth = 2;
    context.strokeRect(left - 4, top - 4, width + 8, height + 8);
    context.setLineDash([]);
  }

  context.fillStyle = "#ffffff";
  context.font = "bold 13px Georgia";
  context.fillText(unit.name, left + 6, top + 20, width - 12);
  context.font = "12px Georgia";
  context.fillText(`${unit.currentHealth}/${unit.maxHealth} HP`, left + 6, top + 38);

  if (isAlive) {
    context.fillStyle = "#f8e7b0";
    context.fillText(getUnitAttackCategory(state, unit.id).toUpperCase(), left + 6, top + 52);
  }

  context.restore();
}

export function renderBattleScene(context: CanvasRenderingContext2D, state: GameState): void {
  const battle = state.battle;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f3e6d3";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  if (!battle) {
    return;
  }

  const targetingState = battle.targetingState;
  const legalTargetUnitIds = targetingState?.legalTargetUnitIds ?? [];
  const selectedTargetUnitId = targetingState?.selectedTargetUnitId ?? null;
  const actingUnit = getBattleUnit(state, battle.activeUnitId);
  const actingParticipant = getBattleParticipant(battle, actingUnit.id);
  const actingSideLabel = actingParticipant.side === "attacker" ? "Attackers" : "Defenders";
  const controlLabel = isPlayerControlledBattleUnit(state, actingUnit.id) ? "Player Turn" : "Enemy Turn";

  context.fillStyle = palette.text;
  context.font = "28px Georgia";
  context.fillText("Guard Battle", 24, 42);
  context.font = "16px Georgia";
  context.fillText(`${controlLabel}: ${actingUnit.name} (${actingSideLabel})`, 24, 70);

  for (const slot of battle.formation.attackerSlots) {
    drawFormationSlot(context, slot);
  }

  for (const slot of battle.formation.defenderSlots) {
    drawFormationSlot(context, slot);
  }

  for (const slot of battle.formation.attackerSlots) {
    drawUnitCard(context, state, slot, legalTargetUnitIds, selectedTargetUnitId);
  }

  for (const slot of battle.formation.defenderSlots) {
    drawUnitCard(context, state, slot, legalTargetUnitIds, selectedTargetUnitId);
  }

  context.fillStyle = palette.text;
  context.font = "16px Georgia";
  context.fillText("Attackers", 96, 594);
  context.fillText("Defenders", 648, 594);
}
