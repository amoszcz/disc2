import type { GameState } from "../../engine/scenario/types";
import { canBattleStrike } from "../../engine/battle/battleTurnEngine";
import { getBattleUnit, getUnitAttackCategory, isPlayerControlledBattleUnit } from "../../engine/battle/battleTargeting";
import { renderButton } from "../components/button";

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
  const strikeUnavailableReason = !isPlayerTurn
    ? "Wait for the active player-controlled unit."
    : battle.isTransitioning
      ? "Wait for the current battle action to finish."
      : !strikeReady
        ? targetMessage
        : null;
  const defendUnavailableReason = !isPlayerTurn
    ? "Wait for the active player-controlled unit."
    : battle.isTransitioning
      ? "Wait for the current battle action to finish."
      : null;

  return `
    <div class="overlay-box" data-testid="battle-hud">
      <div class="hud-row"><strong>Battle</strong><span>Guard Encounter</span></div>
      <div class="hud-row"><strong>Active Unit</strong><span data-testid="battle-active-unit">${activeUnit.name}</span></div>
      <div class="hud-row"><strong>Attack Type</strong><span data-testid="battle-attack-category">${attackCategory}</span></div>
      <div class="hud-row"><strong>Selected Target</strong><span data-testid="battle-selected-target">${selectedTarget?.name ?? "None"}</span></div>
      <div class="hud-row"><strong>Status</strong><span data-testid="battle-defend-status">${defendState?.isActive ? "Defending" : "Ready"}</span></div>
      <p class="control-tip" data-testid="battle-control-tip">
        ${isMobile ? "Tap an enemy card to target it, then use Strike or Defend." : "Select a target on the canvas, then use Strike or Defend."}
      </p>
      <p data-testid="battle-target-message">${targetMessage}</p>
      ${strikeUnavailableReason ? `<p data-testid="battle-strike-unavailable-reason">Strike unavailable: ${strikeUnavailableReason}</p>` : ""}
      ${defendUnavailableReason ? `<p data-testid="battle-defend-unavailable-reason">Defend unavailable: ${defendUnavailableReason}</p>` : ""}
      <div class="hud-row action-row">
        ${renderButton({ id: "battle-attack-button", testId: "battle-attack-button", children: "Strike", disabled: !isPlayerTurn || !strikeReady || battle.isTransitioning })}
        ${renderButton({ id: "battle-defend-button", testId: "battle-defend-button", children: "Defend", variant: "secondary", disabled: !isPlayerTurn || battle.isTransitioning })}
      </div>
    </div>
  `;
}
