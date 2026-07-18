import { parseAtlasDocument, type AtlasDocument, type MappingChangeSet } from "./atlasMapping";

export interface LoadedAtlas { document: AtlasDocument; image: HTMLImageElement; }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Unable to load WIP atlas image.")); image.src = src; });
}

export async function loadAtlas(templateId: string): Promise<LoadedAtlas> {
  const response = await fetch(`/__sprite-mapping/atlas?templateId=${encodeURIComponent(templateId)}`);
  if (!response.ok) throw new Error(await response.text());
  const payload = await response.json() as { atlas: unknown; imageUrl: string };
  const [document, image] = [parseAtlasDocument(payload.atlas), await loadImage(payload.imageUrl)];
  return { document, image };
}

export async function saveAtlas(templateId: string, changes: MappingChangeSet): Promise<void> {
  const response = await fetch(`/__sprite-mapping/atlas?templateId=${encodeURIComponent(templateId)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(changes) });
  if (!response.ok) throw new Error(await response.text());
}
