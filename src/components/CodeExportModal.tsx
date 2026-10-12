import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  CheckCircle,
  Clock,
  Layers,
  Terminal,
  X,
  ExternalLink,
} from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'checklist' | 'vanilla'>('guide');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 3000);
  };

  const vanillaHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jal Drishti — FloodSafe Village</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body>
  <header class="app-header">
    <div class="brand">
      <h1>JAL DRISHTI</h1>
      <span class="badge">FloodSafe Village</span>
    </div>
    <div class="status-clock" id="clock">08:30:00 AM</div>
  </header>

  <!-- Main Container -->
  <div class="layout">
    <nav class="sidebar">
      <button class="nav-btn active" onclick="switchTab('overview')">Overview</button>
      <button class="nav-btn" onclick="switchTab('monitoring')">Live Monitoring</button>
      <button class="nav-btn" onclick="switchTab('risk')">Risk Analysis</button>
      <button class="nav-btn" onclick="switchTab('map')">Flood Map</button>
      <button class="nav-btn" onclick="switchTab('shelters')">Shelters & Routes</button>
      <button class="nav-btn" onclick="switchTab('alerts')">Alerts</button>
      <button class="nav-btn" onclick="switchTab('report')">Report Hazard</button>
    </nav>
    <main class="content" id="main-content">
      <!-- Dynamic views managed by script.js -->
    </main>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="script.js"></script>
</body>
</html>`;

  const vanillaCss = `/* Jal Drishti Vanilla CSS */
:root {
  --primary: #2563eb;
  --navy: #0f172a;
  --bg: #f8fafc;
  --card-bg: #ffffff;
  --border: #e2e8f0;
  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--navy);
}
.demo-banner {
  background: #fef3c7;
  color: #92400e;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #fde68a;
}
.app-header {
  background: #ffffff;
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layout {
  display: flex;
  height: calc(100vh - 80px);
}
.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid var(--border);
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-btn {
  border: none;
  background: none;
  padding: 10px 14px;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.nav-btn.active {
  background: var(--primary);
  color: #ffffff;
}
.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                VS Code Live Server Instructions & Prototype Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Setup guide, file structure, and implementation status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 border-b border-slate-200 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Running in VS Code Live Server
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'checklist'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Implemented vs. Planned Checklist
          </button>
          <button
            onClick={() => setActiveTab('vanilla')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'vanilla'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Pure HTML/CSS/JS Source Code
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-950">
                <h4 className="font-bold">Visual Studio Code Live Server Setup:</h4>
                <p className="text-[11px] leading-relaxed">
                  Jal Drishti is built to run directly on modern browsers without requiring any paid cloud APIs, backend databases, or API keys.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">
                    Step 1: Install Live Server in Visual Studio Code
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Open VS Code, press <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">Ctrl + Shift + X</code> (or Cmd + Shift + X on macOS), search for <strong>&quot;Live Server&quot;</strong> by Ritwick Dey, and click Install.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">
                    Step 2: Project Workspace Structure
                  </div>
                  <pre className="p-2.5 bg-slate-900 text-cyan-300 rounded font-mono text-[11px] mt-1">
{`jal-drishti/
├── index.html       # Single page application entry & Leaflet loader
├── style.css        # Clean responsive styles & color-coded tokens
└── script.js        # Rule-based risk engine & simulation loop`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">
                    Step 3: Launch Live Server
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Right-click on <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">index.html</code> in the VS Code file explorer and click <strong>&quot;Open with Live Server&quot;</strong>. The app will open at <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">http://127.0.0.1:5500/index.html</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900">
                Jal Drishti Deliverables & Implementation Status:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Implemented Features */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Implemented & Fully Functional</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-950 leading-relaxed">
                    <li>Complete responsive 8-page dashboard layout.</li>
                    <li>3 selectable demo scenarios (Normal, Caution, High Risk).</li>
                    <li>Live simulation loop with real-time sensor drift.</li>
                    <li>Rule-based risk engine: 0.50W + 0.30R + 0.20S.</li>
                    <li>HC-SR04 ultrasonic distance-to-water level formula with validation.</li>
                    <li>Interactive OpenStreetMap Leaflet GIS map with node filters.</li>
                    <li>Designated shelter cards & unverified road condition logs.</li>
                    <li>Automated alert queuing & notification management.</li>
                    <li>Community hazard incident reporter with LocalStorage persistence.</li>
                    <li>Virtual ESP32 enclosure with OLED replica, 3 LEDs & piezo buzzer.</li>
                    <li>Tested Arduino C++ firmware script ready for hardware flashing.</li>
                  </ul>
                </div>

                {/* Planned / Future Features */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Planned for Phase 2 Deployment</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 leading-relaxed">
                    <li>Long-range LoRaWAN 868MHz transceiver radio link.</li>
                    <li>Solar 5W panel + LiFePO4 battery management circuit.</li>
                    <li>Weatherproof IP67 PVC enclosure field mounting.</li>
                    <li>TinyML / Edge AI TensorFlow Lite model on ESP32.</li>
                    <li>Direct SMS / GSM siren gateway broadcast integration.</li>
                    <li>Expansion to forest fire, air pollution, and landslides.</li>
                    <li>Formal liaison protocol with District Disaster Management Authorities.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vanilla' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Pure HTML5 / CSS3 / Vanilla JS Source</h4>
                  <p className="text-[11px] text-slate-500">Copy these boilerplate snippets if you prefer running in VS Code with zero npm dependencies.</p>
                </div>
                <button
                  onClick={() => copySnippet(vanillaHtml, 'html')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  {copiedFile === 'html' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy index.html</span>
                </button>
              </div>

              <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg max-h-56 overflow-x-auto border border-slate-800">
                {vanillaHtml}
              </pre>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-800">style.css</span>
                <button
                  onClick={() => copySnippet(vanillaCss, 'css')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200"
                >
                  {copiedFile === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy style.css</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg max-h-40 overflow-x-auto border border-slate-800">
                {vanillaCss}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
