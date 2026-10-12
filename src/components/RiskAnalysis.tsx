import React, { useState } from 'react';
import {
  Calculator,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Ruler,
} from 'lucide-react';
import { calculateRisk, calculateUltrasonicWaterLevel, rainConditionToScore, riseRateToScore, normalizeWaterLevel } from '../services/riskEngine';
import { RainCondition } from '../types';
import { useSensorContext } from '../context/SensorContext';

export const RiskAnalysis: React.FC = () => {
  const {
    referenceHeightCm,
    measuredDistanceCm,
    setReferenceHeightCm,
    setMeasuredDistanceCm,
  } = useSensorContext();

  // Local state for Risk Assessment Engine Interactive Sandbox
  const [calcWaterCm, setCalcWaterCm] = useState<number>(45);
  const [calcRefCm, setCalcRefCm] = useState<number>(100);
  const [calcRain, setCalcRain] = useState<RainCondition>('Moderate');
  const [calcRiseRate, setCalcRiseRate] = useState<number>(3.5);

  // Local state for Ultrasonic Sensor Calculator
  const [localMountHeight, setLocalMountHeight] = useState<number>(referenceHeightCm);
  const [localEchoDist, setLocalEchoDist] = useState<number>(measuredDistanceCm);

  // Compute Risk
  const riskResult = calculateRisk(calcWaterCm, calcRefCm, calcRain, calcRiseRate);

  // Compute Ultrasonic
  const ultrasonicResult = calculateUltrasonicWaterLevel(localMountHeight, localEchoDist);

  const applyUltrasonicToRisk = () => {
    if (ultrasonicResult.isValid) {
      setCalcWaterCm(ultrasonicResult.waterLevelCm);
      setCalcRefCm(localMountHeight);
      setReferenceHeightCm(localMountHeight);
      setMeasuredDistanceCm(localEchoDist);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Scope Notice */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Risk Assessment Engine & Sensor Math
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explainable, rule-based flood weighting and ultrasonic distance-to-level transformations
            </p>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Prototype Disclaimer:</strong> This algorithm is an explainable, rule-based prototype risk engine. These weights and thresholds are preliminary demonstration assumptions, not scientifically calibrated or intended for real-world evacuation orders. This is <em>not</em> an AI or machine learning model.
          </div>
        </div>
      </div>

      {/* Grid: 1. Risk Engine Simulator, 2. Ultrasonic Level Geometry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Risk Assessment Engine Sandbox */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                1. Rule-Based Risk Engine Simulator
              </h3>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Formula: 0.50W + 0.30R + 0.20S
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Adjust parameters below to see real-time score normalization and explainability output.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Input 1: Water Level & Ref */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Water Level:</span>
                <span className="font-mono font-bold text-blue-700">
                  {calcWaterCm} cm (Ref: {calcRefCm} cm) → Score: {riskResult.waterScore}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={calcRefCm}
                value={calcWaterCm}
                onChange={e => setCalcWaterCm(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>0 cm (Dry bed)</span>
                <span>50 cm</span>
                <span>{calcRefCm} cm (Bank-full)</span>
              </div>
            </div>

            {/* Input 2: Rain Condition */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Rainfall Condition:</span>
                <span className="font-mono font-bold text-blue-700">
                  {calcRain} → Score: {riskResult.rainScore}/100
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['No Rain', 'Low', 'Moderate', 'High'] as RainCondition[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCalcRain(r)}
                    className={`py-1.5 px-2 rounded border text-xs font-medium transition-colors ${
                      calcRain === r
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Rise Rate */}
            <div>
              <div className="flex justify-between font-medium text-slate-700 mb-1">
                <span>Rate of Water-Level Rise:</span>
                <span className="font-mono font-bold text-blue-700">
                  {calcRiseRate} cm/hour → Score: {riskResult.riseScore}/100
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="0.5"
                value={calcRiseRate}
                onChange={e => setCalcRiseRate(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-0.5">
                <span>0 cm/h (Steady)</span>
                <span>15 cm/h</span>
                <span>35+ cm/h (Flash surge)</span>
              </div>
            </div>
          </div>

          {/* Engine Output & Scoreboard */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Final Evaluated Risk
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold font-mono text-slate-900">
                    {riskResult.riskScore}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded inline-block ${
                    riskResult.riskCategory === 'High Risk'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : riskResult.riskCategory === 'Caution'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {riskResult.riskCategory}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Updated: {riskResult.timestamp}
                </div>
              </div>
            </div>

            {/* Arithmetic Breakdown */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
              <div className="text-[11px] text-slate-400 font-sans font-semibold">
                Calculation Step-by-Step:
              </div>
              <div className="text-[11px] text-slate-600">
                0.50 × {riskResult.waterScore} [Water] = <strong className="text-slate-900">{(0.5 * riskResult.waterScore).toFixed(1)}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                0.30 × {riskResult.rainScore} [Rain] = <strong className="text-slate-900">{(0.3 * riskResult.rainScore).toFixed(1)}</strong>
              </div>
              <div className="text-[11px] text-slate-600">
                0.20 × {riskResult.riseScore} [Surge] = <strong className="text-slate-900">{(0.2 * riskResult.riseScore).toFixed(1)}</strong>
              </div>
              <div className="pt-1 border-t border-slate-100 font-bold text-slate-900 flex justify-between">
                <span>Summed Score:</span>
                <span>{riskResult.riskScore} / 100</span>
              </div>
            </div>

            {/* Explainability output */}
            <div className="text-xs text-slate-700 leading-relaxed bg-blue-50/60 p-3 rounded-lg border border-blue-100">
              <div className="font-semibold text-blue-900 mb-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Explainable Decision Output:</span>
              </div>
              <p className="text-[11px] text-blue-950 mt-1">
                {riskResult.explanation}
              </p>
              <div className="mt-2 text-[10px] text-blue-700">
                Primary Driving Factor: <strong>{riskResult.primaryFactor}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: HC-SR04 Ultrasonic Water-Level Formula */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                2. Ultrasonic Water-Level Calculation
              </h3>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Level = Height − Distance
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              HC-SR04 sensor measures distance to water surface from overhead fixed datum.
            </p>
          </div>

          {/* Interactive Geometry Tool */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Reference Mount Height (Datum from bed to sensor head):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={localMountHeight}
                  onChange={e => setLocalMountHeight(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-500 font-medium">cm</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Standard village bridge girder datum is typically 100 cm – 250 cm.
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Measured Echo Distance (Sensor to liquid meniscus):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={localEchoDist}
                  onChange={e => setLocalEchoDist(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-slate-500 font-medium">cm</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Time of flight formula: Distance = (Time × 0.0343) / 2
              </span>
            </div>

            {/* Validation Feedback */}
            {!ultrasonicResult.isValid ? (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{ultrasonicResult.errorMessage}</span>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Computed Output
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-blue-700 font-mono">
                    {ultrasonicResult.waterLevelCm}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">cm of water depth</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Formula: {localMountHeight} cm (Ref) − {localEchoDist} cm (Echo) = {ultrasonicResult.waterLevelCm} cm
                </div>

                <button
                  type="button"
                  onClick={applyUltrasonicToRisk}
                  className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Push Calculation to Live Dashboard & Context</span>
                </button>
              </div>
            )}
          </div>

          {/* Physical Deployment Instructions & Best Practices */}
          <div className="pt-4 border-t border-slate-100 text-xs space-y-2">
            <h4 className="font-bold text-slate-800">
              Field Installation & Protection Directives:
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>
                <strong>Rigid Overhead Mounting:</strong> Secure the HC-SR04 inside a downward-facing UV-resistant PVC casing with water-deflector flanges.
              </li>
              <li>
                <strong>Blind-Zone Clearance:</strong> Maintain at least 5 cm clearance between sensor transducer face and the highest possible flood surge (to prevent HC-SR04 2cm blind zone).
              </li>
              <li>
                <strong>Surface Turbulence Filtering:</strong> Apply running average filter (rolling 5-sample median) on the ESP32 to eliminate wave ripples.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
