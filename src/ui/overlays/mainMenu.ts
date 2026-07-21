import type { GameState } from "../../engine/scenario/types";
import { renderButton } from "../components/button";

export function renderMainMenu(state: GameState): string {
  const isMobile = state.mobileLayoutState.layoutMode === "mobile";
  const options = state.availableScenarioOptions
    .map(
      (option) => renderButton({
        children: `<strong>${option.label}</strong><span>${option.description}</span>`,
        className: "menu-option",
        testId: `scenario-start-${option.id}`,
        data: { "scenario-id": option.id }
      })
    )
    .join("");

  return `
    <div class="overlay-box menu-panel" data-testid="main-menu-panel">
      <strong>${isMobile ? "Start Menu" : "Start Menu"}</strong>
      <p data-testid="main-menu-message">
        ${isMobile ? "Choose a scenario and tap to begin a new run, or open the asset storybook." : "Choose a scenario to begin a new run, or open the asset storybook."}
      </p>
      ${renderButton({ children: "<strong>Asset Storybook</strong><span>Preview current heroes, battle units, and map objects across their supported states.</span>", className: "menu-option", testId: "storybook-open-button", data: { "menu-action": "open-storybook" } })}
      ${renderButton({ children: "<strong>Settings</strong><span>Choose map movement and gameplay visual settings.</span>", className: "menu-option", testId: "settings-open-button", data: { "menu-action": "open-settings" } })}
      ${renderButton({ children: "<strong>Sprite Mapping Tool</strong><span>Review and align the WIP sprite atlas coordinate map.</span>", className: "menu-option", testId: "sprite-mapping-open-button", data: { "menu-action": "open-sprite-mapping" } })}
      <div data-testid="scenario-option-list">${options}</div>
    </div>
  `;
}
