import type { GameState } from "../../engine/scenario/types";

export function renderMainMenu(state: GameState): string {
  const isMobile = state.mobileLayoutState.layoutMode === "mobile";
  const options = state.availableScenarioOptions
    .map(
      (option) => `
        <button
          type="button"
          class="menu-option"
          data-testid="scenario-start-${option.id}"
          data-scenario-id="${option.id}">
          <strong>${option.label}</strong>
          <span>${option.description}</span>
        </button>
      `
    )
    .join("");

  return `
    <div class="overlay-box menu-panel" data-testid="main-menu-panel">
      <strong>${isMobile ? "Start Menu" : "Start Menu"}</strong>
      <p data-testid="main-menu-message">
        ${isMobile ? "Choose a scenario and tap to begin a new run." : "Choose a scenario to begin a new run."}
      </p>
      <div data-testid="scenario-option-list">${options}</div>
    </div>
  `;
}
