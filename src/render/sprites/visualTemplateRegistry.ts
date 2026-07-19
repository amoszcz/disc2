import defaultImageUrl from "./templates/default-template.png";
import defaultMapUrl from "./templates/default-template.json?url";
import wipImageUrl from "./templates/wip-template.png";
import wipMapUrl from "./templates/wip-template.json?url";
import wipAtlas from "./templates/wip-template.json";
import highresImageUrl from "./templates/highres-template.png";
import highresMapUrl from "./templates/highres-template.json?url";
import highresAtlas from "./templates/highres-template.json";
import type { FacingDirection, VisualSpriteFrame } from "../../engine/scenario/types";

export interface VisualTemplateSource {
  templateId: string;
  label: string;
  imageUrl: string;
  mapUrl: string;
  availability: "ready";
}

/** The single source list consumed by game configuration and every UI surface. */
export const visualTemplateRegistry: readonly VisualTemplateSource[] = [
  { templateId: "default-template", label: "Default template", imageUrl: defaultImageUrl, mapUrl: defaultMapUrl, availability: "ready" },
  { templateId: "wip-template", label: "WIP template", imageUrl: wipImageUrl, mapUrl: wipMapUrl, availability: "ready" },
  { templateId: "highres-template", label: "High-resolution template", imageUrl: highresImageUrl, mapUrl: highresMapUrl, availability: "ready" }
];

export function getVisualTemplateSource(templateId: string): VisualTemplateSource | undefined {
  return visualTemplateRegistry.find((source) => source.templateId === templateId && source.availability === "ready");
}

export function getReadyVisualTemplateSources(): readonly VisualTemplateSource[] {
  return visualTemplateRegistry.filter((source) => source.availability === "ready");
}

const atlasByTemplateId: Readonly<Record<string, unknown>> = {
  "wip-template": wipAtlas,
  "highres-template": highresAtlas
};

/** Registered atlas entries are the source of crop coordinates whenever their template is active. */
export function getTemplateFrame(
  templateId: string,
  subjectId: string,
  stateName: string | null,
  direction: FacingDirection | null
): VisualSpriteFrame | null {
  const atlas = atlasByTemplateId[templateId] as { sprites?: Array<Record<string, unknown>> } | undefined;
  if (!atlas) return null;
  const sprites = atlas.sprites ?? [];
  const matchingSubject = sprites.filter((sprite) => sprite.subject_id === subjectId);
  const exact = matchingSubject.find((sprite) => sprite.exact_state_name === stateName && (direction === null || sprite.direction === direction));
  const state = matchingSubject.find((sprite) => sprite.exact_state_name === stateName);
  const sprite = exact ?? state ?? matchingSubject[0];
  if (!sprite || ![sprite.x, sprite.y, sprite.width, sprite.height].every((value) => typeof value === "number")) return null;
  return { sourceX: sprite.x as number, sourceY: sprite.y as number, sourceWidth: sprite.width as number, sourceHeight: sprite.height as number };
}
