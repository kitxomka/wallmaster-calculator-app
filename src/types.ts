export type Unit = 'cm' | 'inch' | 'ft';

export interface UnitValue {
  value: number;
  unit: Unit;
}

export type MatchType = 'straight' | 'offset' | 'random';

export interface Wallpaper {
  id: string;
  sku: string;
  width: UnitValue;
  length: UnitValue;
  patternRepeat: UnitValue;
  match: MatchType;
  updatedAt: number;
}

export interface Opening {
  id: string;
  width: UnitValue;
  height: UnitValue;
}

export interface Wall {
  id: string;
  name: string;
  width: UnitValue;
  height: UnitValue;
  openings: Opening[];
}

export interface CalculationResult {
  stripsPerWall: { wallId: string; strips: number; rollsForThisWall: number }[];
  totalStrips: number;
  totalRolls: number;
  details: {
    wallId: string;
    adjustedStripLength: number;
    stripsPerRoll: number;
  }[];
}
