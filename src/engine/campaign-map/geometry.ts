import type { Position } from "../scenario/types";
export const keyOf = ({ x, y }: Position): string => `${x},${y}`;
export const samePosition = (a: Position, b: Position): boolean => a.x === b.x && a.y === b.y;
export const inBounds = (p: Position, width: number, height: number): boolean => p.x >= 0 && p.y >= 0 && p.x < width && p.y < height;
export function neighbors8(p: Position, width: number, height: number): Position[] { const result: Position[] = []; for (let y = -1; y <= 1; y += 1) for (let x = -1; x <= 1; x += 1) if ((x || y) && inBounds({ x: p.x + x, y: p.y + y }, width, height)) result.push({ x: p.x + x, y: p.y + y }); return result; }
export const manhattan = (a: Position, b: Position): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
export function stableJson(value: unknown): string { return JSON.stringify(value); }
