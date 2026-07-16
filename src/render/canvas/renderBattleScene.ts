import type { BattleFormationSlot, GameState } from "../../engine/scenario/types";
import { getBattleCanvasSlotCenter, BATTLE_SLOT_HEIGHT, BATTLE_SLOT_WIDTH } from "../../engine/battle/battleFormation";
import { getBattleParticipant, getBattleUnit, getUnitAttackCategory, isPlayerControlledBattleUnit } from "../../engine/battle/battleTargeting";
import { palette } from "../sprites/placeholders";
import {
  drawResolvedVisualTemplate,
  recordVisualTemplateDiagnostic,
  resetVisualTemplateDiagnostics,
  resolveUnitVisualTemplate
} from "../sprites/visualTemplateResolver";

function drawFormationSlot(context: CanvasRenderingContext2D, slot: BattleFormationSlot): void {
  const center = getBattleCanvasSlotCenter(slot, context.canvas.width, context.canvas.height);
  const slotWidth = (BATTLE_SLOT_WIDTH * context.canvas.width) / 896;
  const slotHeight = (BATTLE_SLOT_HEIGHT * context.canvas.height) / 640;
  context.save();
  context.fillStyle = palette.battleSlot;
  context.strokeStyle = palette.battleSlotBorder;
  context.lineWidth = 2;
  context.fillRect(center.x - slotWidth / 2, center.y - slotHeight / 2, slotWidth, slotHeight);
  context.strokeRect(center.x - slotWidth / 2, center.y - slotHeight / 2, slotWidth, slotHeight);
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
  const center = getBattleCanvasSlotCenter(slot, context.canvas.width, context.canvas.height);
  const slotWidth = (BATTLE_SLOT_WIDTH * context.canvas.width) / 896;
  const slotHeight = (BATTLE_SLOT_HEIGHT * context.canvas.height) / 640;
  const inset = Math.max(4, Math.round(slotWidth * 0.05));
  const left = center.x - slotWidth / 2 + inset;
  const top = center.y - slotHeight / 2 + inset;
  const width = slotWidth - inset * 2;
  const height = slotHeight - inset * 2;
  const isActive = state.battle?.activeUnitId === unit.id;
  const isLegalTarget = legalTargetUnitIds.includes(unit.id);
  const isSelectedTarget = selectedTargetUnitId === unit.id;
  const isDefending = state.battle?.defendStates.some((entry) => entry.unitId === unit.id && entry.isActive);
  const resolvedTemplate = resolveUnitVisualTemplate(unit, "battle");

  context.save();
  recordVisualTemplateDiagnostic({ subjectKind: "unit", subjectType: unit.name, sceneContext: "battle" }, resolvedTemplate);
  context.fillStyle = !isAlive ? "#9f9487" : "#eadbc7";
  context.fillRect(left, top, width, height);
  drawResolvedVisualTemplate(context, resolvedTemplate, { x: left, y: top, width, height });
  if (!isAlive) {
    context.fillStyle = "rgba(35, 23, 13, 0.35)";
    context.fillRect(left, top, width, height);
  }

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
  context.fillRect(left, top + height * 0.6, width, height * 0.4);
  context.fillStyle = "#23170d";
  context.font = `bold ${Math.max(11, Math.floor(slotHeight * 0.24))}px Georgia`;
  context.fillText(unit.name, left + 6, top + Math.max(18, Math.floor(slotHeight * 0.32)), width - 12);
  context.font = `${Math.max(10, Math.floor(slotHeight * 0.2))}px Georgia`;
  context.fillText(`${unit.currentHealth}/${unit.maxHealth} HP`, left + 6, top + Math.max(34, Math.floor(slotHeight * 0.62)));

  if (isAlive) {
    context.fillStyle = slot.side === "attacker" ? palette.attacker : palette.defender;
    context.fillText(getUnitAttackCategory(state, unit.id).toUpperCase(), left + 6, top + Math.max(48, Math.floor(slotHeight * 0.88)));
  }

  context.restore();
}

export function renderBattleScene(context: CanvasRenderingContext2D, state: GameState): void {
  const battle = state.battle;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f3e6d3";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  resetVisualTemplateDiagnostics("battle");

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
  context.font = `${Math.max(22, Math.floor(context.canvas.width / 32))}px Georgia`;
  context.fillText("Guard Battle", 24, Math.max(38, Math.floor(context.canvas.height * 0.07)));
  context.font = `${Math.max(13, Math.floor(context.canvas.width / 56))}px Georgia`;
  context.fillText(
    `${controlLabel}: ${actingUnit.name} (${actingSideLabel})`,
    24,
    Math.max(64, Math.floor(context.canvas.height * 0.11))
  );

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
  context.font = `${Math.max(13, Math.floor(context.canvas.width / 56))}px Georgia`;
  context.fillText("Attackers", Math.max(56, Math.floor(context.canvas.width * 0.11)), Math.floor(context.canvas.height * 0.93));
  context.fillText("Defenders", Math.floor(context.canvas.width * 0.72), Math.floor(context.canvas.height * 0.93));
}
