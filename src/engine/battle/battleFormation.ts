import type { Battle, BattleFormation, BattleFormationSlot, BattleSide, GameState, Position } from "../scenario/types";

export const BATTLE_FORMATION_ROWS = 3;
export const BATTLE_FORMATION_COLUMNS = 4;
export const BATTLE_SLOT_WIDTH = 76;
export const BATTLE_SLOT_HEIGHT = 56;

function createEmptySlot(side: BattleSide, rowIndex: number, columnIndex: number): BattleFormationSlot {
  return {
    side,
    rowIndex,
    columnIndex,
    unitId: null,
    isOccupied: false
  };
}

function createSlotsForSide(side: BattleSide, unitIds: string[]): BattleFormationSlot[] {
  const slots: BattleFormationSlot[] = [];

  for (let columnIndex = 0; columnIndex < BATTLE_FORMATION_COLUMNS; columnIndex += 1) {
    for (let rowIndex = 0; rowIndex < BATTLE_FORMATION_ROWS; rowIndex += 1) {
      slots.push(createEmptySlot(side, rowIndex, columnIndex));
    }
  }

  unitIds.slice(0, BATTLE_FORMATION_ROWS * BATTLE_FORMATION_COLUMNS).forEach((unitId, index) => {
    const slot = slots[index];
    if (!slot) {
      return;
    }

    slot.unitId = unitId;
    slot.isOccupied = true;
  });

  return slots;
}

export function createBattleFormation(attackerUnitIds: string[], defenderUnitIds: string[]): BattleFormation {
  return {
    rows: BATTLE_FORMATION_ROWS,
    columns: BATTLE_FORMATION_COLUMNS,
    attackerSlots: createSlotsForSide("attacker", attackerUnitIds),
    defenderSlots: createSlotsForSide("defender", defenderUnitIds)
  };
}

export function getBattleFormationSlotsForSide(formation: BattleFormation, side: BattleSide): BattleFormationSlot[] {
  return side === "attacker" ? formation.attackerSlots : formation.defenderSlots;
}

export function findBattleFormationSlotByUnitId(formation: BattleFormation, unitId: string): BattleFormationSlot | undefined {
  return [...formation.attackerSlots, ...formation.defenderSlots].find((slot) => slot.unitId === unitId);
}

export function getFormationSlotsInColumn(formation: BattleFormation, side: BattleSide, columnIndex: number): BattleFormationSlot[] {
  return getBattleFormationSlotsForSide(formation, side)
    .filter((slot) => slot.columnIndex === columnIndex)
    .sort((left, right) => left.rowIndex - right.rowIndex);
}

export function getLivingUnitIdsInColumn(state: GameState, battle: Battle, side: BattleSide, columnIndex: number): string[] {
  return getFormationSlotsInColumn(battle.formation, side, columnIndex)
    .map((slot) => slot.unitId)
    .filter((unitId): unitId is string => Boolean(unitId))
    .filter((unitId) => {
      const unit = state.scenario.units.find((entry) => entry.id === unitId);
      return Boolean(unit && !unit.defeatState && unit.currentHealth > 0);
    });
}

export function getBattleCanvasSlotCenter(slot: BattleFormationSlot): Position {
  const attackerOriginX = 56;
  const defenderOriginX = 508;
  const originY = 116;
  const columnSpacing = 92;
  const rowSpacing = 150;

  return {
    x:
      slot.side === "attacker"
        ? attackerOriginX + (BATTLE_FORMATION_COLUMNS - 1 - slot.columnIndex) * columnSpacing
        : defenderOriginX + slot.columnIndex * columnSpacing,
    y: originY + slot.rowIndex * rowSpacing
  };
}
