import { Unit, UnitValue, Wall, Wallpaper, CalculationResult } from '../types';

export const CONVERSION_FACTORS = {
  cm: 1,
  inch: 2.54,
  ft: 30.48,
};

export const toCm = (uv: UnitValue): number => {
  return uv.value * CONVERSION_FACTORS[uv.unit];
};

export const fromCm = (value: number, to: Unit): number => {
  return value / CONVERSION_FACTORS[to];
};

export const formatValue = (uv: UnitValue): string => {
  return `${uv.value} ${uv.unit}`;
};

export const calculateWallpaper = (wallpaper: Wallpaper, walls: Wall[]): CalculationResult => {
  const rollWidthCm = toCm(wallpaper.width);
  const rollLengthCm = toCm(wallpaper.length);
  const patternRepeatCm = toCm(wallpaper.patternRepeat);

  let totalStrips = 0;
  const stripsPerWall: CalculationResult['stripsPerWall'] = [];
  const details: CalculationResult['details'] = [];

  walls.forEach(wall => {
    const wallWidthCm = toCm(wall.width);
    const wallHeightCm = toCm(wall.height);

    // 1. Adjusted strip length (per wall height)
    // We add a standard 10cm trimming allowance (5cm top, 5cm bottom)
    const trimmingAllowanceCm = 10; 
    const baseLength = wallHeightCm + trimmingAllowanceCm;
    
    let adjustedStripLength = baseLength;
    if (patternRepeatCm > 0) {
      // For offset match, we might need more, but standard logic is round up to repeat
      // If match is offset, we add half repeat to the base length calculation usually
      const matchOffset = wallpaper.match === 'offset' ? patternRepeatCm / 2 : 0;
      adjustedStripLength = Math.ceil((baseLength + matchOffset) / patternRepeatCm) * patternRepeatCm;
    }

    // 2. Strips per roll
    const stripsPerRoll = rollLengthCm > 0 && adjustedStripLength > 0 
      ? Math.floor(rollLengthCm / adjustedStripLength) 
      : 0;

    // 3. Strips for this wall
    // Subtract opening widths if they are full height? 
    // Usually we just subtract the total width of openings for a rough estimate, 
    // but strip-based calculation usually ignores openings unless they are very large.
    // Let's subtract opening width from wall width for the calculation.
    const openingsWidthCm = wall.openings.reduce((sum, op) => sum + toCm(op.width), 0);
    const netWidthCm = Math.max(0, wallWidthCm - openingsWidthCm);
    const strips = rollWidthCm > 0 ? Math.ceil(netWidthCm / rollWidthCm) : 0;

    totalStrips += strips;
    
    const rollsForThisWall = stripsPerRoll > 0 ? Math.ceil(strips / stripsPerRoll) : 0;

    stripsPerWall.push({ wallId: wall.id, strips, rollsForThisWall });
    details.push({ wallId: wall.id, adjustedStripLength, stripsPerRoll });
  });

  // Total rolls is the sum of rolls needed if we calculate per wall, 
  // OR we can sum all strips and divide by strips per roll if rolls are shared.
  // Usually, rolls are shared across walls.
  // But since each wall can have different height, stripsPerRoll can vary.
  // Let's calculate total rolls by summing strips and using an average or the worst-case stripsPerRoll.
  // Actually, a more accurate way is to see how many strips we get from each roll.
  
  // Simplified: Sum of rolls needed per wall (safer estimate)
  const totalRolls = stripsPerWall.reduce((sum, s) => sum + s.rollsForThisWall, 0);

  return {
    stripsPerWall,
    totalStrips,
    totalRolls,
    details,
  };
};
