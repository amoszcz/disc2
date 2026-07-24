import type { GeneratedCampaignMap } from "../../engine/campaign-map/types";
import {
  getCampaignMapDiagnostics,
  setCampaignMapDiagnostics,
  toggleCampaignMapOverlay,
  type CampaignMapOverlay
} from "../../developer/campaign-map/campaignMapDiagnostics";

const overlays: CampaignMapOverlay[] = ["cells", "regions", "connections", "route-search", "placement", "validation", "cache"];

export function renderCampaignMapDiagnosticsPanel(map: GeneratedCampaignMap): string {
  if (!import.meta.env.DEV) return "";
  const diagnostics = getCampaignMapDiagnostics(map);
  return `<details class="overlay-box" data-testid="campaign-map-diagnostics"><summary>Campaign map diagnostics</summary><p>Seed: <strong>${diagnostics.seed}</strong></p>${overlays.map((overlay) => `<button type="button" class="menu-option" data-campaign-overlay="${overlay}" aria-pressed="${diagnostics.enabled.has(overlay)}">${overlay}</button>`).join("")}</details>`;
}

export function bindCampaignMapDiagnosticsPanel(container: HTMLElement, map: GeneratedCampaignMap, redraw: () => void): void {
  for (const button of container.querySelectorAll<HTMLButtonElement>("[data-campaign-overlay]")) button.addEventListener("click", () => {
    const overlay = button.dataset.campaignOverlay as CampaignMapOverlay;
    setCampaignMapDiagnostics(map.mapId, toggleCampaignMapOverlay(getCampaignMapDiagnostics(map), overlay));
    redraw();
  });
}
