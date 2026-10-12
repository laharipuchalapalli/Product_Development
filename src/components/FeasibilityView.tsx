import React from 'react';
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  DollarSign,
  BatteryCharging,
  WifiOff,
} from 'lucide-react';

export const FeasibilityView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title & Scope */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Feasibility, Challenges & Viability Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Practical engineering assessment for low-cost, decentralized community flood monitoring
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <strong>Engineering Integrity Disclosure:</strong> This appraisal reflects prototype bench evaluations. We do not claim that field deployment, solar harvesting, LoRaWAN networks, or government integration are currently active or operational.
        </div>
      </div>

      {/* 3 Core Analytical Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Technical Feasibility */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                1. Technical Feasibility
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              The architecture relies on high-availability, low-cost commercial off-the-shelf (COTS) electronics accessible in rural Indian markets.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Affordable Components:</strong> ESP32 micro-controller (~₹450), HC-SR04 ultrasonic (~₹120), rain sensor module (~₹80), LEDs, and buzzer total less than ₹1,200 per monitoring node.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Autonomous Edge Execution:</strong> ESP32 dual-core Xtensa LX6 processors calculate water levels and trigger buzzer/LEDs locally in under 5ms without needing cloud uptime.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Open Web Standards:</strong> Browser frontend operates using lightweight HTML5/CSS/JavaScript with zero paid SaaS licenses or proprietary runtime locks.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Rigorous Sensor Calibration:</strong> Requires physical water-channel baseline measurements to adjust for air temperature effects on speed of sound (331.3 + 0.606 × T m/s).
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Node BOM Cost: ~₹1,200 ($14 USD)
          </div>
        </div>

        {/* Card 2: Challenges and Mitigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Challenges & Mitigations
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Real riverbanks and rural drainage channels present physical environmental disturbances that require systematic firmware-level counter-measures.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Surface Turbulence & Noise:</strong> River ripples produce ultrasonic jitter. <br />
                  <span className="text-emerald-700 font-medium">Mitigation:</span> Rolling 7-sample median filter with outlier rejection.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong>False Alarms:</strong> Transient water splashes or animal passage. <br />
                  <span className="text-emerald-700 font-medium">Mitigation:</span> Multi-parameter weighting (water level + rain sensor + persistence duration).
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Cellular / Wi-Fi Outage:</strong> Severe storms frequently sever 4G base stations. <br />
                  <span className="text-emerald-700 font-medium">Mitigation:</span> Hardwired physical sirens and high-intensity strobe LEDs stay armed.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Power Supply Reliability:</strong> Grid dropouts during monsoon. <br />
                  <span className="text-emerald-700 font-medium">Mitigation:</span> 3.7V 18650 Li-ion battery with 5W solar trickle-charging circuit.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Resilience: Fail-safe local alerting
          </div>
        </div>

        {/* Card 3: Viability and Scalability */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Viability & Scalability
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Designed as a modular community asset that scales horizontally across panchayats and extends to adjacent environmental hazards.
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Panchayat Mesh Topology:</strong> Deploy sentinel nodes at choke points (bridges, culverts, spillways) that report to a central Gram Panchayat gateway.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Long-Range Low-Power Link:</strong> Planned migration to 868MHz LoRaWAN for 5km–10km coverage across dense tree canopy without SIM card costs.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Multi-Hazard Expansion:</strong> Modular hardware bus allows plugging in MQ-135 (air quality), flame IR detectors (forest fires), or tilt sensors (landslides).
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <strong>Official Warning Alignment:</strong> Serves strictly as a grassroots last-mile sensor array that complements official CWC and IMD warnings.
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Horizon: Multi-node community grid
          </div>
        </div>
      </div>
    </div>
  );
};
