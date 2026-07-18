import type { GameState } from "../../engine/scenario/types";
import { createVisualTemplateThumbnailMarkup, resolveUnitVisualTemplate } from "../../render/sprites/visualTemplateResolver";

export function renderBattleTurnQueue(state: GameState): string {
  const battle = state.battle;
  if (!battle) {
    return "";
  }

  const entries = battle.turnQueue
    .map((unitId) => state.scenario.units.find((unit) => unit.id === unitId))
    .filter((unit): unit is NonNullable<typeof unit> => Boolean(unit))
    .filter((unit) => !unit.defeatState && unit.currentHealth > 0)
    .map((unit) => {
      const template = resolveUnitVisualTemplate(unit, "battle", state.visualStates.unitStates[unit.id]?.stateName);
      const active = unit.id === battle.activeUnitId;
      return `<div class="battle-queue-item ${active ? "active" : ""}" data-testid="battle-queue-item" data-unit-id="${unit.id}" data-template-id="${template.templateId}" data-template-kind="${template.assetKind}" aria-label="${unit.name}" title="${unit.name}">${createVisualTemplateThumbnailMarkup(template, unit.name)}<span class="sr-only">${unit.name}</span></div>`;
    })
    .join("");

  return `<section class="battle-turn-queue" data-testid="battle-turn-queue" aria-label="Battle turn queue"><span class="battle-queue-label">Turn order</span><div class="battle-queue-items" data-testid="battle-queue">${entries}</div></section>`;
}
