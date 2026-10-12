import React from 'react';
import {
  Activity,
  Droplets,
  CloudRain,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Radio,
  Volume2,
  VolumeX,
  MapPin,
} from 'lucide-react';
import { useSensorContext } from '../context/SensorContext';

export const LiveMonitoring: React.FC = () => {
  const {
    reading,
    previousWaterLevel,
    history,
    selectScenario,
    activeScenario,
    connectionStatus,
    secondsSinceLastUpdate,
  } = useSensorContext();

  const isDisconnected = connectionStatus === 'disconnected';
  const diffWater = Math.round((reading.waterLevelCm - previousWaterLevel) * 10) / 10;
  const isRising = diffWater > 0.1;
  const isFalling = diffWater < -0.1;

  // Village Siren & Warning Light state
  const isGreenLight = !isDisconnected && reading.riskCategory === 'Normal';
  const isYellowLight = !isDisconnected && reading.riskCategory === 'Caution';
  const isRedLight = !isDisconnected && reading.riskCategory === 'High Risk';
  const isSirenActive = !isDisconnected && reading.riskCategory === 'High Risk';

  return (
    <div className="space-y-6">
      {/* Header & Location */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Live Water & Weather Monitoring
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location: <strong>Village River Basin (Bridge Monitor)</strong></span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">Sample Data</span>
            </p>
          </div>

          {/* Test Scenarios */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Test Conditions:</span>
            <button
              onClick={() => selectScenario('normal')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeScenario === 'normal' && !isDisconnected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Normal (20 cm)
            </button>
            <button
              onClick={() => selectScenario('caution')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeScenario === 'caution' && !isDisconnected
                  ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Caution (48 cm)
            </button>
            <button
              onClick={() => selectScenario('high_risk')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeScenario === 'high_risk' && !isDisconnected
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              High Risk (82 cm)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Plain-Language Monitoring Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Water Level */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Water Level</span>
            <span className="text-[11px] text-slate-400 font-normal">Depth</span>
          </div>

          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {isDisconnected ? '—' : reading.waterLevelCm}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {isDisconnected ? '' : 'cm'}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-600">
            {isDisconnected ? (
              'Reading unavailable'
            ) : reading.waterLevelCm > 75 ? (
              <span className="text-rose-700 font-bold">Overtopping danger line (75 cm)</span>
            ) : reading.waterLevelCm > 40 ? (
              <span className="text-amber-700 font-bold">Caution level reached (40 cm)</span>
            ) : (
              <span className="text-emerald-700 font-medium">Safe channel level (&lt; 40 cm)</span>
            )}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Previous:</span>
            <span className="font-medium text-slate-700">{previousWaterLevel} cm</span>
          </div>
        </div>

        {/* Card 2: Rainfall Condition */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Rainfall</span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>

          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isDisconnected ? 'Unavailable' : reading.rainfallCondition}
          </div>

          <p className="mt-2 text-xs text-slate-600">
            {isDisconnected ? (
              'Gauge link resting'
            ) : reading.rainfallCondition === 'High' ? (
              'Heavy torrential rain'
            ) : reading.rainfallCondition === 'Moderate' ? (
              'Steady rainfall'
            ) : reading.rainfallCondition === 'Low' ? (
              'Light rain / mist'
            ) : (
              'No rain detected'
            )}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Condition:</span>
            <span className="text-slate-700 font-medium">Local Catchment</span>
          </div>
        </div>

        {/* Card 3: Water Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Water Trend</span>
            <div className="text-xs font-semibold">
              {isRising ? (
                <span className="text-rose-600 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Rising
                </span>
              ) : isFalling ? (
                <span className="text-emerald-600 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> Falling
                </span>
              ) : (
                <span className="text-slate-600 flex items-center">
                  <Minus className="w-3.5 h-3.5 mr-0.5" /> Steady
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isDisconnected ? '—' : isRising ? 'Rising' : isFalling ? 'Receding' : 'Steady'}
          </div>

          <p className="mt-2 text-xs text-slate-600">
            {isDisconnected
              ? 'Trend calculation paused'
              : isRising
              ? `Rising approx. ${reading.riseRateCmPerHour} cm/hour`
              : 'Water level remains stable'}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Rate of rise:</span>
            <span className="font-mono text-slate-700">{isDisconnected ? '—' : `${reading.riseRateCmPerHour} cm/h`}</span>
          </div>
        </div>

        {/* Card 4: Current Risk */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Current Risk</span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span
              className={`text-2xl font-bold ${
                isDisconnected
                  ? 'text-slate-600'
                  : reading.riskCategory === 'High Risk'
                  ? 'text-rose-600'
                  : reading.riskCategory === 'Caution'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {isDisconnected ? 'Data Unavailable' : reading.riskCategory}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-600">
            {isDisconnected
              ? 'Check official district alerts'
              : reading.riskCategory === 'High Risk'
              ? 'Immediate caution advised near river'
              : reading.riskCategory === 'Caution'
              ? 'Stay alert for rising runoff'
              : 'Normal village conditions'}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Last Updated:</span>
            <span className="font-mono text-slate-700">{reading.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Community Physical Warning Lights Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Village Physical Warning Lights & Siren Status
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            These physical beacons operate directly at the village river bridge and community center to warn residents even during power or internet outages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Green Beacon */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
              isGreenLight
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Green Beacon</span>
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isGreenLight
                    ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                    : 'bg-slate-300'
                }`}
              />
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-800">Normal Conditions</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isGreenLight ? 'Active: All channels safe' : 'Inactive'}
              </div>
            </div>
          </div>

          {/* Yellow Beacon */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
              isYellowLight
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Yellow Beacon</span>
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isYellowLight
                    ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                    : 'bg-slate-300'
                }`}
              />
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-800">Caution Standby</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isYellowLight ? 'Active: Water rising' : 'Inactive'}
              </div>
            </div>
          </div>

          {/* Red Beacon */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
              isRedLight
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Red Beacon</span>
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isRedLight
                    ? 'bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.8)] animate-pulse'
                    : 'bg-slate-300'
                }`}
              />
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-800">High Flood Warning</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isRedLight ? 'Active: Danger threshold crossed' : 'Inactive'}
              </div>
            </div>
          </div>

          {/* Siren */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
              isSirenActive
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Emergency Siren</span>
              {isSirenActive ? (
                <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-800">Audible Siren Horn</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {isSirenActive ? 'Active (Pulsing horn)' : 'Silent'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Recent Water Level Records
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Timeline (Sample Data)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Water Level</th>
                <th className="py-2 px-3">Rainfall</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {history.slice(-5).reverse().map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-600">{item.time}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{item.waterLevelCm} cm</td>
                  <td className="py-2.5 px-3">{item.rainfall}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.riskScore > 60
                          ? 'bg-rose-100 text-rose-800'
                          : item.riskScore > 30
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.riskScore > 60 ? 'High Risk' : item.riskScore > 30 ? 'Caution' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
