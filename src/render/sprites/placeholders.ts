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
  viewportAccent: "#2f4f74",
  battleSlot: "#e8d6b8",
  battleSlotBorder: "#8e7351",
  battleActive: "#ffd166",
  battleLegal: "#69a96f",
  battleSelected: "#f25f5c",
  battleDefending: "#7bdff2"
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
  rubble: "#6a4f3b",
  cave: "#70543b",
  teleport: "#7ec8e3",
  exit: "#d6f0c0"
} as const;

export const movementObjectGlyph = {
  bridge: "=",
  milestone: "+",
  rubble: "x",
  cave: "C",
  teleport: "T",
  exit: "E"
} as const;

export const visualFallbackGlyph = {
  unit: "U",
  hero: "H",
  "movement-object": "O",
  "guarded-location": "G",
  terrain: "",
  "resource-pickup": "$"
} as const;

export const visualFallbackPalette = {
  unit: { fillColor: palette.attacker, accentColor: "#ffffff", borderColor: "#ffffff", textColor: "#ffffff", shape: "slot" as const },
  hero: { fillColor: palette.hero, accentColor: "#ffffff", borderColor: "#ffffff", textColor: "#ffffff", shape: "circle" as const },
  "movement-object": {
    fillColor: palette.tileBorder,
    accentColor: "#fff4bf",
    borderColor: palette.text,
    textColor: "#ffffff",
    shape: "rect" as const
  },
  "guarded-location": {
    fillColor: palette.guardBlocked,
    accentColor: "#ffffff",
    borderColor: palette.text,
    textColor: "#ffffff",
    shape: "rect" as const
  },
  terrain: {
    fillColor: palette.tile,
    accentColor: "#f6ecd0",
    borderColor: palette.tileBorder,
    textColor: palette.text,
    shape: "tile" as const
  },
  "resource-pickup": {
    fillColor: palette.pickup,
    accentColor: "#fff4bf",
    borderColor: palette.tileBorder,
    textColor: palette.text,
    shape: "circle" as const
  }
} as const;

export const visualFallbackStateNames = {
  unit: "idle",
  hero: "idle",
  "movement-object": "idle",
  "guarded-location": "blocked",
  terrain: "",
  "resource-pickup": "idle"
} as const;

export const routePreviewPalette = {
  line: "#f3f0d1",
  dot: "#d46a3d",
  flag: "#b33636",
  pole: "#f1e7c7"
} as const;
