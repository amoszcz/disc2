export const palette = {
  tile: "#d5be8b",
  tileBorder: "#8a6b3f",
  hero: "#3466af",
  pickup: "#d7a31d",
  guardBlocked: "#7a2d2d",
  guardOpen: "#447748",
  attacker: "#5376cc",
  defender: "#8b3d3d",
  text: "#23170d",
  panel: "#fff8e6",
  viewportAccent: "#2f4f74"
} as const;

export const terrainPalette = {
  road: "#c8b27a",
  grass: "#a7c47f",
  plains: "#d7c98b",
  mud: "#8f6a46",
  woods: "#5e7b49",
  mountains: "#7b7b87",
  lakes: "#6ca8d9",
  rivers: "#4f7db6"
} as const;

export const movementObjectPalette = {
  bridge: "#f5f1dd",
  milestone: "#fff4bf",
  rubble: "#6a4f3b"
} as const;

export const movementObjectGlyph = {
  bridge: "=",
  milestone: "+",
  rubble: "x"
} as const;

export const routePreviewPalette = {
  line: "#f3f0d1",
  dot: "#d46a3d",
  flag: "#b33636",
  pole: "#f1e7c7"
} as const;
