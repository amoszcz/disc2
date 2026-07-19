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
        ${isMobile ? "Choose a scenario and tap to begin a new run, or open the asset storybook." : "Choose a scenario to begin a new run, or open the asset storybook."}
      </p>
      <button
        type="button"
        class="menu-option"
        data-testid="storybook-open-button"
        data-menu-action="open-storybook">
        <strong>Asset Storybook</strong>
        <span>Preview current heroes, battle units, and map objects across their supported states.</span>
      </button>
      <button type="button" class="menu-option" data-testid="settings-open-button" data-menu-action="open-settings">
        <strong>Settings</strong>
        <span>Choose map movement and gameplay visual settings.</span>
      </button>
      <button type="button" class="menu-option" data-testid="sprite-mapping-open-button" data-menu-action="open-sprite-mapping">
        <strong>Sprite Mapping Tool</strong>
        <span>Review and align the WIP sprite atlas coordinate map.</span>
      </button>
      <div data-testid="scenario-option-list">${options}</div>
    </div>
  `;
}
