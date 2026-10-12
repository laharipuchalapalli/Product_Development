import { RainCondition, RiskCategory } from '../types';

export interface RiskCalculationResult {
  waterScore: number;
  rainScore: number;
  riseScore: number;
  riskScore: number;
  riskCategory: RiskCategory;
  primaryFactor: string;
  explanation: string;
  breakdownFormula: string;
  timestamp: string;
}

export function rainConditionToScore(condition: RainCondition): number {
  switch (condition) {
    case 'No Rain':
      return 0;
    case 'Low':
      return 25;
    case 'Moderate':
      return 60;
    case 'High':
      return 95;
    default:
      return 0;
  }
}

export function riseRateToScore(riseRateCmPerHour: number): number {
  if (riseRateCmPerHour <= 0) return 0;
  if (riseRateCmPerHour <= 5) return 20;
  if (riseRateCmPerHour <= 15) return 50;
  if (riseRateCmPerHour <= 30) return 80;
  return 100;
}

export function normalizeWaterLevel(waterLevelCm: number, referenceHeightCm: number = 100): number {
  if (referenceHeightCm <= 0) return 0;
  const ratio = (waterLevelCm / referenceHeightCm) * 100;
  return Math.max(0, Math.min(100, Math.round(ratio)));
}

export function determineRiskCategory(score: number): RiskCategory {
  if (score <= 30) return 'Normal';
  if (score <= 60) return 'Caution';
  return 'High Risk';
}

/**
 * Prototype Rule-Based Risk Engine
 * Formula: Risk Score = (0.50 * Water Score) + (0.30 * Rain Score) + (0.20 * Rise Score)
 * 
 * Note: Preliminary demonstration assumptions.
 * Not scientifically calibrated or certified for actual evacuations.
 */
export function calculateRisk(
  waterLevelCm: number,
  referenceHeightCm: number,
  rainCondition: RainCondition,
  riseRateCmPerHour: number
): RiskCalculationResult {
  const safeWater = Math.max(0, Number(waterLevelCm) || 0);
  const safeRef = Math.max(1, Number(referenceHeightCm) || 100);
  const safeRise = Number(riseRateCmPerHour) || 0;

  const waterScore = normalizeWaterLevel(safeWater, safeRef);
  const rainScore = rainConditionToScore(rainCondition);
  const riseScore = riseRateToScore(safeRise);

  const weightedWater = 0.50 * waterScore;
  const weightedRain = 0.30 * rainScore;
  const weightedRise = 0.20 * riseScore;

  const rawScore = weightedWater + weightedRain + weightedRise;
  const riskScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const riskCategory = determineRiskCategory(riskScore);

  // Determine primary contributing factor
  let primaryFactor = 'Water Level';
  if (weightedRain >= weightedWater && weightedRain >= weightedRise) {
    primaryFactor = 'Rainfall Intensity';
  } else if (weightedRise >= weightedWater && weightedRise >= weightedRain) {
    primaryFactor = 'Rate of Water-Level Rise';
  }

  // Generate explainability statement
  let explanation = '';
  if (riskCategory === 'High Risk') {
    explanation = `High risk triggered primarily by ${primaryFactor.toLowerCase()} (Score: ${riskScore}/100). Sensor readings show elevated water level (${safeWater} cm) combined with ${rainCondition.toLowerCase()} rainfall and a rise rate of ${safeRise} cm/h.`;
  } else if (riskCategory === 'Caution') {
    explanation = `Caution state active (Score: ${riskScore}/100). Environmental indicators show rising baseline or moderate rainfall (${safeWater} cm water level). Continued monitoring recommended.`;
  } else {
    explanation = `Normal baseline condition (Score: ${riskScore}/100). Water level is at a safe reserve (${safeWater} cm) and precipitation is low or absent.`;
  }

  const breakdownFormula = `Risk = (0.50 × ${waterScore}) + (0.30 × ${rainScore}) + (0.20 × ${riseScore}) = ${riskScore}`;

  return {
    waterScore,
    rainScore,
    riseScore,
    riskScore,
    riskCategory,
    primaryFactor,
    explanation,
    breakdownFormula,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * Ultrasonic Sensor Calculation
 * Formula: Water Level = Reference Height - Measured Distance
 */
export function calculateUltrasonicWaterLevel(
  referenceHeightCm: number,
  measuredDistanceCm: number
): {
  waterLevelCm: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (referenceHeightCm <= 0) {
    return {
      waterLevelCm: 0,
      isValid: false,
      errorMessage: 'Reference height must be greater than 0 cm.',
    };
  }

  if (measuredDistanceCm < 0) {
    return {
      waterLevelCm: 0,
      isValid: false,
      errorMessage: 'Measured distance cannot be negative.',
    };
  }

  if (measuredDistanceCm > referenceHeightCm) {
    return {
      waterLevelCm: 0,
      isValid: false,
      errorMessage: `Measured distance (${measuredDistanceCm} cm) exceeds reference mount height (${referenceHeightCm} cm). Check sensor positioning or bed erosion.`,
    };
  }

  const waterLevelCm = referenceHeightCm - measuredDistanceCm;
  return {
    waterLevelCm: Math.round(waterLevelCm * 10) / 10,
    isValid: true,
  };
}
