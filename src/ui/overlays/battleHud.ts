import type { GameState } from "../../engine/scenario/types";

export function renderBattleHud(state: GameState): string {
  const battle = state.battle;
  if (!battle) {
    return "";
  }

  const activeUnit = state.scenario.units.find((entry) => entry.id === battle.activeUnitId);
  const queueHtml = battle.turnQueue
    .map((unitId) => {
      const unit = state.scenario.units.find((entry) => entry.id === unitId);
      const isActive = unitId === battle.activeUnitId;
      return `<div class="queue-item ${isActive ? "active" : ""}" data-unit-id="${unitId}">${unit?.name ?? unitId}</div>`;
    })
    .join("");

  return `
    <div class="overlay-box" data-testid="battle-hud">
      <div class="hud-row"><strong>Battle</strong><span>Guard Encounter</span></div>
      <div class="hud-row"><strong>Active Unit</strong><span data-testid="battle-active-unit">${activeUnit?.name ?? "None"}</span></div>
      <div class="overlay-box">
        <strong>Turn Queue</strong>
        <div data-testid="battle-queue">${queueHtml}</div>
      </div>
      <button type="button" id="battle-attack-button" data-testid="battle-attack-button">Strike</button>
    </div>
  `;
}
