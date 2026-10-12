import React from 'react';
import {
  Info,
  Shield,
  Layers,
  Cpu,
  Brain,
  CheckCircle,
  Flame,
  Wind,
  ThermometerSnowflake,
  Mountain,
  Droplets,
  ExternalLink,
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Project Banner & Project Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                FloodSafe Village
              </span>
              <span className="text-xs font-medium text-slate-500">
                Disaster Management & Resilience
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-950 mt-1">
              Jal Drishti — FloodSafe Village
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Community Flood Monitoring & Early Warning Initiative
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
            <div>Project: <strong className="text-slate-900">Jal Drishti</strong></div>
            <div>Focus: <span className="text-blue-700 font-semibold">Localized Early Warning & Community Resilience</span></div>
            <div>Phase: <span className="text-emerald-700 font-semibold">Community Information System</span></div>
          </div>
        </div>

        {/* Project Vision Statement */}
        <div className="mt-5 space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
            <img
              src="/src/assets/images/jal_drishti_flood_node_1791810795185.jpg"
              alt="Jal Drishti Localized Flood Monitoring Station Architecture"
              className="w-full h-auto max-h-80 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Figure 1: Jal Drishti bridge-mounted telemetry node and water datum measuring geometry.</span>
              <span className="font-mono text-slate-400">System Architecture</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900">
            Concept & Core Mission
          </h3>
          <blockquote className="p-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-lg text-slate-700 text-xs sm:text-sm italic leading-relaxed">
            &quot;Jal Drishti is a localized environmental monitoring concept that aims to detect developing hazards, assess risk close to the source, and provide timely, actionable information to communities.&quot;
          </blockquote>
          <p className="text-xs text-slate-600 leading-relaxed">
            While national agencies like the Central Water Commission (CWC) and India Meteorological Department (IMD) issue macro-basin synoptic advisories, flash floods and drainage chokes in rural villages develop within minutes. Jal Drishti bridges this &quot;last-mile gap&quot; by embedding low-cost, self-sufficient monitoring stations at vulnerable culverts and river bends to give villagers 30 to 60 minutes of critical lead time.
          </p>
        </div>
      </div>

      {/* Modular Multi-Hazard Architecture Roadmap */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Modular Environmental Hazard Expansion Matrix
          </h3>
          <p className="text-xs text-slate-500">
            The core ESP32 edge platform is architected to accommodate pluggable multi-sensor pods
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Module 1: Flood Monitoring */}
          <div className="p-3.5 rounded-xl border-2 border-blue-500 bg-blue-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                Active
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Flood Monitoring
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Current Prototype: Ultrasonic HC-SR04 depth datum + conductive rain gauge.
            </p>
          </div>

          {/* Module 2: Forest Fire */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <Flame className="w-5 h-5 text-amber-600" />
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                Future
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Forest Fire Monitoring
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Thermal IR flame array + CO2 / smoke particle threshold detection for dry brush.
            </p>
          </div>

          {/* Module 3: Air Pollution */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <Wind className="w-5 h-5 text-teal-600" />
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                Future
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Air Quality & Smog
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              PMS5003 laser particulate sensor (PM2.5 / PM10) + MQ-135 agricultural ammonia detector.
            </p>
          </div>

          {/* Module 4: Extreme Heat */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <ThermometerSnowflake className="w-5 h-5 text-rose-600" />
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                Future
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Extreme Heat & Wet-Bulb
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              SHT31 high-precision RH & heat index computation for rural outdoor agricultural labor.
            </p>
          </div>

          {/* Module 5: Landslide */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 opacity-85">
            <div className="flex items-center justify-between">
              <Mountain className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                Future
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              Slope & Landslide
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              MPU6050 6-axis gyro/accelerometer for embankment tilt and soil saturation creep.
            </p>
          </div>
        </div>
      </div>

      {/* Honest AI Statement & Scientific Roadmap */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Transparent AI Positioning & Machine Learning Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scientific integrity statement regarding algorithmic classification vs. deep learning
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="text-xs font-bold text-slate-900">
            Current Technical Reality:
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            &quot;The current prototype uses an explainable, rule-based risk engine. A trained AI model has not yet been implemented because sufficient local sensor data is needed for responsible training and validation.&quot;
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            In disaster-management engineering, deploying an uncalibrated black-box neural network without empirical ground-truth data leads to dangerous false negatives or alert fatigue. We deliberately choose a deterministic, mathematically transparent weighting equation that can be audited by any village engineer.
          </p>
        </div>

        {/* 6-Step Roadmap */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-3">
            Structured 6-Stage Roadmap to Edge AI Integration:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-blue-700 font-mono text-[11px]">Step 01</div>
              <div className="font-semibold text-slate-900 mt-0.5">Empirical Data Collection</div>
              <p className="text-slate-600 text-[11px] mt-1">
                Deploy 5 bench-tested nodes to record baseline monsoon discharge at 30-second logging intervals.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-blue-700 font-mono text-[11px]">Step 02</div>
              <div className="font-semibold text-slate-900 mt-0.5">Physical Calibration</div>
              <p className="text-slate-600 text-[11px] mt-1">
                Establish exact cross-sectional riverbed geometry, spillway elevations, and ultrasonic temperature correction.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-blue-700 font-mono text-[11px]">Step 03</div>
              <div className="font-semibold text-slate-900 mt-0.5">Labelled Historical Corpus</div>
              <p className="text-slate-600 text-[11px] mt-1">
                Tag historical flood crests with meteorological radar archives and ground observer logs.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-blue-700 font-mono text-[11px]">Step 04</div>
              <div className="font-semibold text-slate-900 mt-0.5">Predictive Model Evaluation</div>
              <p className="text-slate-600 text-[11px] mt-1">
                Evaluate lightweight ARIMA and 1D-CNN anomaly-detection classifiers for 2-hour surge lookaheads.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-blue-700 font-mono text-[11px]">Step 05</div>
              <div className="font-semibold text-slate-900 mt-0.5">TinyML On-Device Quantization</div>
              <p className="text-slate-600 text-[11px] mt-1">
                Compile TensorFlow Lite for Microcontrollers (TFLM) to run quantized INT8 inference directly on ESP32 SRAM.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="font-bold text-blue-700 font-mono text-[11px]">Step 06</div>
              <div className="font-semibold text-slate-900 mt-0.5">Multi-Season Field Validation</div>
              <p className="text-slate-600 text-[11px] mt-1">
                Conduct stress tests across pre-monsoon, active monsoon, and cyclonic rainfall prior to real alert dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
