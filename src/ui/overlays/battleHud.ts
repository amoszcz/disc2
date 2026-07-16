import type { GameState } from "../../engine/scenario/types";
import { canBattleStrike } from "../../engine/battle/battleTurnEngine";
import { getBattleUnit, getUnitAttackCategory, isPlayerControlledBattleUnit } from "../../engine/battle/battleTargeting";

export function renderBattleHud(state: GameState): string {
  const battle = state.battle;
  if (!battle) {
    return "";
  }

  const activeUnit = getBattleUnit(state, battle.activeUnitId);
  const attackCategory = getUnitAttackCategory(state, activeUnit.id);
  const targetingState = battle.targetingState;
  const selectedTarget = targetingState?.selectedTargetUnitId ? getBattleUnit(state, targetingState.selectedTargetUnitId) : null;
  const defendState = battle.defendStates.find((entry) => entry.unitId === activeUnit.id && entry.isActive);
  const isPlayerTurn = isPlayerControlledBattleUnit(state, activeUnit.id);
  const strikeReady = isPlayerTurn ? canBattleStrike(state, battle) : false;
  const isMobile = state.mobileLayoutState.layoutMode === "mobile";
  const queueHtml = battle.turnQueue
    .map((unitId) => {
      const unit = state.scenario.units.find((entry) => entry.id === unitId);
      const isActive = unitId === battle.activeUnitId;
      return `<div class="queue-item ${isActive ? "active" : ""}" data-unit-id="${unitId}">${unit?.name ?? unitId}</div>`;
    })
    .join("");

  const targetMessage =
    attackCategory === "area"
      ? targetingState?.legalTargetUnitIds.length
        ? `Area strike will hit ${targetingState.legalTargetUnitIds.length} living enemies.`
        : "No living enemies remain in range."
      : selectedTarget
        ? `${selectedTarget.name} selected.`
        : targetingState?.legalTargetUnitIds.length
          ? isMobile
            ? "Tap a highlighted enemy to select a strike target."
            : "Click a highlighted enemy to select a strike target."
          : "No legal strike target is available.";

  return `
    <div class="overlay-box" data-testid="battle-hud">
      <div class="hud-row"><strong>Battle</strong><span>Guard Encounter</span></div>
      <div class="hud-row"><strong>Active Unit</strong><span data-testid="battle-active-unit">${activeUnit.name}</span></div>
      <div class="hud-row"><strong>Attack Type</strong><span data-testid="battle-attack-category">${attackCategory}</span></div>
      <div class="hud-row"><strong>Selected Target</strong><span data-testid="battle-selected-target">${selectedTarget?.name ?? "None"}</span></div>
      <div class="hud-row"><strong>Status</strong><span data-testid="battle-defend-status">${defendState?.isActive ? "Defending" : "Ready"}</span></div>
      <div class="overlay-box">
        <strong>Turn Queue</strong>
        <div data-testid="battle-queue">${queueHtml}</div>
      </div>
      <p class="control-tip" data-testid="battle-control-tip">
        ${isMobile ? "Tap an enemy card to target it, then use Strike or Defend." : "Select a target on the canvas, then use Strike or Defend."}
      </p>
      <p data-testid="battle-target-message">${targetMessage}</p>
      <div class="hud-row action-row">
        <button type="button" id="battle-attack-button" data-testid="battle-attack-button" ${!isPlayerTurn || !strikeReady ? "disabled" : ""}>Strike</button>
        <button type="button" id="battle-defend-button" data-testid="battle-defend-button" ${!isPlayerTurn ? "disabled" : ""}>Defend</button>
      </div>
    </div>
  `;
}
