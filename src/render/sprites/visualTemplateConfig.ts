import { getVisualTemplateSource } from "./visualTemplateRegistry";

/** Game policy intentionally names only a catalog identifier, never asset paths. */
export const gameVisualTemplateConfig = { defaultTemplateId: "default-template" } as const;

export function getDefaultVisualTemplateId(): string {
  if (!getVisualTemplateSource(gameVisualTemplateConfig.defaultTemplateId)) {
    throw new Error(`Configured default template '${gameVisualTemplateConfig.defaultTemplateId}' is unavailable.`);
  }
  return gameVisualTemplateConfig.defaultTemplateId;
}
