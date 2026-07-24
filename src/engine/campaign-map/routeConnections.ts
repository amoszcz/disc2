import type { CampaignCell, CampaignConnection, CampaignLocation } from "./types";

function manhattanPath(from: { x: number; y: number }, to: { x: number; y: number }): { x: number; y: number }[] {
  const path = [{ ...from }];
  let x = from.x;
  let y = from.y;
  while (x !== to.x) {
    x += Math.sign(to.x - x);
    path.push({ x, y });
  }
  while (y !== to.y) {
    y += Math.sign(to.y - y);
    path.push({ x, y });
  }
  return path;
}

export function routeStrategicConnections(locations: CampaignLocation[], cells: CampaignCell[]): CampaignConnection[] {
  const byPosition = new Map(cells.map((cell) => [`${cell.x},${cell.y}`, cell]));
  return locations.slice(1).map((location, index) => {
    const from = locations[index];
    const path = manhattanPath(from.position, location.position);
    const roadType = index === 0 ? "primary" : index % 3 === 0 ? "trail" : "secondary";
    for (const position of path) {
      const cell = byPosition.get(`${position.x},${position.y}`);
      if (!cell) continue;
      if (cell.biome === "water") {
        cell.crossing = "bridge";
        cell.tags.push("bridge");
      } else if (cell.biome === "mountains" || cell.biome === "snowPeaks") {
        cell.crossing = "pass";
        cell.tags.push("mountain-pass");
      }
      cell.biome = "road";
      cell.roadType = roadType;
      cell.walkable = true;
      cell.movementCost = cell.crossing === "pass" ? 2 : 1;
    }
    return { id: `connection-${index}`, fromLocationId: from.id, toLocationId: location.id, path, travelCost: path.length - 1, roadType };
  });
}
export function simplifyConnectionPath(connection: CampaignConnection): CampaignConnection { return { ...connection, path: connection.path.filter((point, index, path) => index === 0 || index === path.length - 1 || point.x !== path[index - 1].x || point.y !== path[index - 1].y) }; }
