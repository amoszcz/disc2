import { defineConfig } from "vite";
// @ts-expect-error Node runtime types are not part of the browser app's type set.
import { readFile, writeFile } from "node:fs/promises";
// @ts-expect-error Node runtime types are not part of the browser app's type set.
import { resolve } from "node:path";

declare const process: { cwd(): string };

const atlasJsonPath = resolve(process.cwd(), "wip/sprite-atlas/game-atlas.json");
const atlasImagePath = resolve(process.cwd(), "wip/sprite-atlas/a_sprite_sheet_sheet_in_2d_digital_art_displays_fa.png");

async function readPngDimensions(): Promise<{ width: number; height: number }> {
  const bytes = await readFile(atlasImagePath) as unknown as Uint8Array;
  if (bytes.length < 24 || bytes[12] !== 73 || bytes[13] !== 72 || bytes[14] !== 68 || bytes[15] !== 82) throw new Error("Configured atlas image is not a PNG.");
  const numberAt = (offset: number) => bytes[offset] * 2 ** 24 + bytes[offset + 1] * 2 ** 16 + bytes[offset + 2] * 2 ** 8 + bytes[offset + 3];
  return { width: numberAt(16), height: numberAt(20) };
}

function entryId(sprite: Record<string, unknown>, index: number): string { return `${typeof sprite.subject_id === "string" ? sprite.subject_id : `sprite-${index + 1}`}:${String(sprite.exact_state_name ?? "default")}:${String(sprite.direction ?? "none")}:${index}`; }
function assertValidSprites(sprites: Array<Record<string, unknown>>, changes: { bulkOffset: { x: number; y: number }; entryOverrides: Record<string, { x: number; y: number; width?: number; height?: number }> }, dimensions: { width: number; height: number }): Array<Record<string, unknown>> {
  const known = new Set(sprites.map(entryId)); for (const id of Object.keys(changes.entryOverrides)) if (!known.has(id)) throw new Error("An entry override does not identify a current atlas sprite.");
  return sprites.map((sprite, index) => { const override = changes.entryOverrides[entryId(sprite, index)]; const x = override ? override.x : Number(sprite.x) + changes.bulkOffset.x; const y = override ? override.y : Number(sprite.y) + changes.bulkOffset.y;
    const width = override?.width ?? Number(sprite.width);
    const height = override?.height ?? Number(sprite.height);
    if (![x, y, width, height].every(Number.isFinite) || !Number.isInteger(x) || !Number.isInteger(y) || width <= 0 || height <= 0 || x < 0 || y < 0 || x + width > dimensions.width || y + height > dimensions.height) {
      throw new Error(`Sprite ${index + 1} would be outside the configured atlas image.`);
    }
    return { ...sprite, x, y }; });
}

export default defineConfig({
  plugins: [{
    name: "sprite-mapping-local-save",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const request = req as unknown as { url?: string; method?: string; on(event: string, callback: (...args: any[]) => void): void };
        if (!request.url?.startsWith("/__sprite-mapping/")) return next();
        if (request.url === "/__sprite-mapping/image" && request.method === "GET") { res.setHeader("content-type", "image/png"); res.end(await readFile(atlasImagePath)); return; }
        if (request.url === "/__sprite-mapping/atlas" && request.method === "GET") { res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ atlas: JSON.parse(await readFile(atlasJsonPath, "utf8")), imageUrl: "/__sprite-mapping/image" })); return; }
        if (request.url === "/__sprite-mapping/atlas" && request.method === "POST") {
          let body = ""; request.on("data", (chunk: string) => { body += chunk; }); request.on("end", async () => { try { const payload = JSON.parse(body) as { bulkOffset?: { x?: unknown; y?: unknown }; entryOverrides?: Record<string, { x?: unknown; y?: unknown; width?: unknown; height?: unknown }> }; const bulk = payload.bulkOffset ?? { x: 0, y: 0 }; const overrides = payload.entryOverrides ?? {}; if (!Number.isInteger(bulk.x) || !Number.isInteger(bulk.y) || !overrides || typeof overrides !== "object") throw new Error("Integer mapping changes are required."); const entryOverrides: Record<string, { x: number; y: number; width?: number; height?: number }> = {}; for (const [id, value] of Object.entries(overrides)) { if (!value || !Number.isInteger(value.x) || !Number.isInteger(value.y) || (value.width !== undefined && (!Number.isInteger(value.width) || Number(value.width) < 1)) || (value.height !== undefined && (!Number.isInteger(value.height) || Number(value.height) < 1))) throw new Error("Entry overrides require integer crop values."); entryOverrides[id] = { x: Number(value.x), y: Number(value.y), width: value.width === undefined ? undefined : Number(value.width), height: value.height === undefined ? undefined : Number(value.height) }; } const atlas = JSON.parse(await readFile(atlasJsonPath, "utf8")) as { sprites?: Array<Record<string, unknown>> }; if (!Array.isArray(atlas.sprites)) throw new Error("Atlas sprites are missing."); atlas.sprites = assertValidSprites(atlas.sprites, { bulkOffset: { x: Number(bulk.x), y: Number(bulk.y) }, entryOverrides }, await readPngDimensions()); await writeFile(atlasJsonPath, `${JSON.stringify(atlas, null, 2)}\n`); res.statusCode = 204; res.end(); } catch (error) { res.statusCode = 400; res.end(error instanceof Error ? error.message : "Invalid atlas save."); } }); return;
        }
        res.statusCode = 404; res.end("Unknown sprite mapping endpoint.");
      });
    }
  }],
  server: {
    host: "127.0.0.1",
    port: 4173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  },
  test: {
    exclude: ["tests/acceptance/**"]
  }
});
