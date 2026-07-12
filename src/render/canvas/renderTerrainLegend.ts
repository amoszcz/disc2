import type { GameState, TerrainTypeName } from "../../engine/scenario/types";
import { terrainLabel } from "../../engine/map/terrainLookup";
import { palette, terrainPalette } from "../sprites/placeholders";

const LEGEND_ENTRIES: Array<{ terrainType: TerrainTypeName; note: string }> = [
  { terrainType: "road", note: "1 move" },
  { terrainType: "plains", note: "2 move" },
  { terrainType: "mud", note: "3 move" },
  { terrainType: "rivers", note: "blocked" }
];

export function renderTerrainLegend(state: GameState): string {
  if (!state.scenario.terrainRegions?.length) {
    return "";
  }

  const entries = LEGEND_ENTRIES.map(({ terrainType, note }) => {
    const color = terrainPalette[terrainType];
    return `<div class="hud-row"><span><span style="display:inline-block;width:12px;height:12px;background:${color};border:1px solid ${palette.tileBorder};margin-right:8px;vertical-align:middle;"></span>${terrainLabel(terrainType)}</span><span>${note}</span></div>`;
  }).join("");

  return `
    <div class="overlay-box" data-testid="terrain-legend">
      <strong>Terrain Legend</strong>
      ${entries}
    </div>
  `;
}
