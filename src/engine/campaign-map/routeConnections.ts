import type { CampaignConnection } from "./types";
export function simplifyConnectionPath(connection: CampaignConnection): CampaignConnection { return { ...connection, path: connection.path.filter((point, index, path) => index === 0 || index === path.length - 1 || point.x !== path[index - 1].x || point.y !== path[index - 1].y) }; }
