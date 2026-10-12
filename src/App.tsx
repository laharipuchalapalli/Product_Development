import React, { useState } from 'react';
import { SensorProvider } from './context/SensorContext';
import { Header } from './components/Header';
import { Sidebar, NavSection } from './components/Sidebar';
import { Overview } from './components/Overview';
import { LiveMonitoring } from './components/LiveMonitoring';
import { FloodMap } from './components/FloodMap';
import { SheltersAndRoutes } from './components/SheltersAndRoutes';
import { AlertsView } from './components/AlertsView';
import { ReportHazard } from './components/ReportHazard';

export function DashboardContent() {
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Application Header */}
      <Header
        onOpenAlerts={() => setCurrentSection('alerts')}
        onOpenMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Workspace: Sidebar + Community Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentSection === 'overview' && (
            <Overview onNavigate={setCurrentSection} />
          )}
          {currentSection === 'live-monitoring' && (
            <LiveMonitoring />
          )}
          {currentSection === 'flood-map' && (
            <FloodMap />
          )}
          {currentSection === 'shelters-routes' && (
            <SheltersAndRoutes onNavigate={setCurrentSection} />
          )}
          {currentSection === 'alerts' && (
            <AlertsView />
          )}
          {currentSection === 'report-hazard' && (
            <ReportHazard />
          )}
        </main>
      </div>

      {/* Community Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-900">JAL DRISHTI</span>
            <span className="mx-2 text-slate-300">·</span>
            <span>FloodSafe Village Community Early Warning System</span>
          </div>
          <div className="text-[11px] text-slate-500">
            For urgent flood emergency rescue, dial <strong className="text-slate-800 font-mono">112</strong> or contact local disaster wardens.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SensorProvider>
      <DashboardContent />
    </SensorProvider>
  );
}
