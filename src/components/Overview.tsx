import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  CloudRain,
  MapPin,
  Home,
  Bell,
  ArrowRight,
  Clock,
  Compass,
} from 'lucide-react';
import { useSensorContext } from '../context/SensorContext';
import { NavSection } from './Sidebar';

interface OverviewProps {
  onNavigate: (section: NavSection) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const {
    reading,
    previousWaterLevel,
    connectionStatus,
    alerts,
    selectScenario,
    activeScenario,
    secondsSinceLastUpdate,
  } = useSensorContext();

  const isDisconnected = connectionStatus === 'disconnected';
  const diffWater = Math.round((reading.waterLevelCm - previousWaterLevel) * 10) / 10;
  const isRising = diffWater > 0.1;
  const isFalling = diffWater < -0.1;

  // Determine current display status
  const currentRiskStatus = isDisconnected ? 'Data Unavailable' : reading.riskCategory;

  // Recommended Action Configuration based on prompt
  const actionConfig = {
    'Normal': {
      title: 'Current Recommendation: Normal Baseline',
      text: 'Continue monitoring local conditions. Drainage paths and river levels are currently within safe limits. No emergency action is needed.',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      textCol: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: ShieldCheck,
      severityLabel: 'Low / Normal',
      meterWidth: '25%',
      meterColor: 'bg-emerald-500',
    },
    'Caution': {
      title: 'Current Recommendation: Stay Alert',
      text: 'Stay alert and follow official local updates. Water levels or rainfall are rising near low-lying crossings. Check your family emergency kit and keep informed.',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      textCol: 'text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: AlertTriangle,
      severityLabel: 'Moderate Caution',
      meterWidth: '55%',
      meterColor: 'bg-amber-500',
    },
    'High Risk': {
      title: 'Current Recommendation: Action Advised',
      text: 'Follow verified emergency instructions and move to safety when directed by authorities. Low causeways and river banks are at risk of overflowing.',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      textCol: 'text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: AlertTriangle,
      severityLabel: 'High Flood Risk',
      meterWidth: '90%',
      meterColor: 'bg-rose-600',
    },
    'Data Unavailable': {
      title: 'Current Recommendation: Exercise Prudence',
      text: 'Do not assume conditions are safe; check official local alerts and communicate with village wardens for in-person status updates.',
      bg: 'bg-slate-50',
      border: 'border-slate-300',
      textCol: 'text-slate-800',
      badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
      icon: HelpCircle,
      severityLabel: 'Data Unavailable',
      meterWidth: '0%',
      meterColor: 'bg-slate-400',
    },
  }[currentRiskStatus];

  const ActionIcon = actionConfig.icon;

  return (
    <div className="space-y-6">
      {/* 3 Core Questions Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Village Flood Status & Safety Guide
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Location: <strong>Village River Basin (Primary Monitor)</strong>
            </p>
          </div>

          {/* Quick Scenario Simulator for Evaluation */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Test Condition:</span>
            <button
              onClick={() => selectScenario('normal')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeScenario === 'normal' && !isDisconnected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Normal (Safe)
            </button>
            <button
              onClick={() => selectScenario('caution')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeScenario === 'caution' && !isDisconnected
                  ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Caution
            </button>
            <button
              onClick={() => selectScenario('high_risk')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeScenario === 'high_risk' && !isDisconnected
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              High Risk
            </button>
          </div>
        </div>

        {/* 3 Questions Immediate Overview */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question 1: What is happening? */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              1. What is happening?
            </span>
            <div className="mt-2 text-sm text-slate-800 leading-snug">
              {isDisconnected ? (
                <span className="text-slate-600">
                  Sensor link is currently resting. Local village field checks in progress.
                </span>
              ) : currentRiskStatus === 'High Risk' ? (
                <span className="text-rose-900 font-medium">
                  Rapid water rise observed at the village river gauge with heavy rainfall.
                </span>
              ) : currentRiskStatus === 'Caution' ? (
                <span className="text-amber-900 font-medium">
                  Moderate rainfall has caused water to reach 48 cm. Culverts flowing fast.
                </span>
              ) : (
                <span className="text-emerald-900 font-medium">
                  Water level is stable at 20 cm with calm conditions and low runoff.
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Checked: {secondsSinceLastUpdate < 5 ? 'Just now' : `${secondsSinceLastUpdate}s ago`}</span>
            </div>
          </div>

          {/* Question 2: How serious is the risk? */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              2. How serious is the risk?
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-sm font-bold px-2.5 py-1 rounded border ${actionConfig.badgeBg}`}>
                {actionConfig.severityLabel}
              </span>
              <span className="text-xs text-slate-500">(Sample Data)</span>
            </div>
            {/* Visual Risk Bar */}
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${actionConfig.meterColor}`}
                style={{ width: actionConfig.meterWidth }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-400">
              <span>Safe</span>
              <span>Caution</span>
              <span>High Risk</span>
            </div>
          </div>

          {/* Question 3: What should I do now? */}
          <div className={`rounded-xl p-4 border ${actionConfig.bg} ${actionConfig.border}`}>
            <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${actionConfig.textCol}`}>
              3. What should I do now?
            </span>
            <p className={`mt-2 text-xs leading-relaxed ${actionConfig.textCol} font-medium`}>
              {actionConfig.text}
            </p>
            <div className="mt-3">
              <button
                onClick={() => onNavigate(currentRiskStatus === 'High Risk' ? 'shelters-routes' : 'alerts')}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 shadow-2xs"
              >
                <span>{currentRiskStatus === 'High Risk' ? 'Find Safe Shelters' : 'View Safety Alerts'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Local Conditions Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Water Level */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Water Level
            </span>
            <span className="text-xs text-slate-400">Sample Data</span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {isDisconnected ? '—' : `${reading.waterLevelCm}`}
            </span>
            <span className="text-sm font-semibold text-slate-600">
              {isDisconnected ? '' : 'cm'}
            </span>
          </div>

          <div className="mt-2 text-xs text-slate-600">
            {isDisconnected ? (
              <span className="text-slate-400">Sensor data unavailable</span>
            ) : reading.waterLevelCm > 75 ? (
              <span className="text-rose-700 font-semibold">Overtopping danger stage (High)</span>
            ) : reading.waterLevelCm > 40 ? (
              <span className="text-amber-700 font-semibold">Elevated / Nearing bank warning</span>
            ) : (
              <span className="text-emerald-700 font-semibold">Normal baseline depth</span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Water Trend:</span>
            <span className="font-semibold text-slate-800 flex items-center">
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
            </span>
          </div>
        </div>

        {/* Card 2: Rainfall Condition */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rainfall Condition
            </span>
            <CloudRain className="w-4 h-4 text-blue-600" />
          </div>

          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isDisconnected ? 'Unavailable' : reading.rainfallCondition}
          </div>

          <div className="mt-2 text-xs text-slate-600">
            {isDisconnected ? (
              <span className="text-slate-400">Rain gauge offline</span>
            ) : reading.rainfallCondition === 'High' ? (
              <span className="text-rose-700 font-medium">Heavy downpour detected in catchment</span>
            ) : reading.rainfallCondition === 'Moderate' ? (
              <span className="text-amber-700 font-medium">Steady showers continuing</span>
            ) : reading.rainfallCondition === 'Low' ? (
              <span className="text-slate-700 font-medium">Light intermittent drizzle</span>
            ) : (
              <span className="text-slate-700 font-medium">Dry / No rainfall detected</span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Status:</span>
            <span className="text-slate-700 font-medium">Continuous Monitoring</span>
          </div>
        </div>

        {/* Card 3: Monitoring Point */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Monitoring Station
            </span>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>

          <div className="mt-3 text-lg font-bold text-slate-900">
            River Bridge Node
          </div>

          <div className="mt-2 text-xs text-slate-600">
            Covering village river corridor, primary road bridge, and agricultural sluice.
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Last Update:</span>
            <span className="font-mono text-slate-700 font-medium">{reading.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3">
          Quick Actions & Resources
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('flood-map')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">View Flood Map</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Check water stations & roads</div>
          </button>

          <button
            onClick={() => onNavigate('shelters-routes')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">Find Shelters</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Elevated halls & contacts</div>
          </button>

          <button
            onClick={() => onNavigate('alerts')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">View Alerts</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Latest community warnings</div>
          </button>

          <button
            onClick={() => onNavigate('report-hazard')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-900">Report Flooding</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Log blocked drain or water</div>
          </button>
        </div>
      </div>

      {/* Recent Community Notices Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Recent Flood Notices & Warnings
          </h2>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            All Alerts ({alerts.length})
          </button>
        </div>

        <div className="space-y-3">
          {alerts.slice(0, 2).map(alert => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                alert.riskCategory === 'High Risk'
                  ? 'bg-rose-50/60 border-rose-200'
                  : alert.riskCategory === 'Caution'
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  {alert.location}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    alert.riskCategory === 'High Risk'
                      ? 'bg-rose-100 text-rose-800'
                      : alert.riskCategory === 'Caution'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {alert.riskCategory}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed text-xs">
                {alert.description}
              </p>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                <span>Action: {alert.precaution}</span>
                <span className="font-mono text-slate-400">{alert.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
