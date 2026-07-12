import type { MapDefinition, Position } from "../scenario/types";

export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isWithinBounds(map: MapDefinition, position: Position): boolean {
  return position.x >= 0 && position.y >= 0 && position.x < map.width && position.y < map.height;
}

export function movementCost(from: Position, to: Position): number {
  return Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
}

export function isValidMove(map: MapDefinition, from: Position, to: Position, remainingMovement: number): boolean {
  const cost = movementCost(from, to);
  return isWithinBounds(map, to) && cost > 0 && cost <= remainingMovement;
}
