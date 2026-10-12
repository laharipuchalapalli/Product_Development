import React from 'react';
import {
  Home,
  Activity,
  MapPin,
  ShieldCheck,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { useSensorContext } from '../context/SensorContext';

export type NavSection =
  | 'overview'
  | 'live-monitoring'
  | 'flood-map'
  | 'shelters-routes'
  | 'alerts'
  | 'report-hazard';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { alerts, reading, connectionStatus } = useSensorContext();
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  const navItems = [
    { id: 'overview' as NavSection, label: 'Home', icon: Home },
    { id: 'live-monitoring' as NavSection, label: 'Live Monitoring', icon: Activity },
    { id: 'flood-map' as NavSection, label: 'Flood Map', icon: MapPin },
    { id: 'shelters-routes' as NavSection, label: 'Shelters & Safe Routes', icon: ShieldCheck },
    {
      id: 'alerts' as NavSection,
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
    },
    { id: 'report-hazard' as NavSection, label: 'Report a Hazard', icon: AlertTriangle },
  ];

  const handleNavClick = (id: NavSection) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Community Status Quick Pill */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 space-y-2">
        <div className="text-xs text-slate-600 flex items-center justify-between">
          <span className="text-slate-500">Location:</span>
          <span className="font-medium text-slate-800">Village River Point</span>
        </div>
        <div className="text-xs text-slate-600 flex items-center justify-between">
          <span>Status:</span>
          {connectionStatus === 'disconnected' ? (
            <span className="font-semibold text-slate-500">Data Unavailable</span>
          ) : (
            <span
              className={`font-semibold ${
                reading.riskCategory === 'High Risk'
                  ? 'text-rose-600'
                  : reading.riskCategory === 'Caution'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {reading.riskCategory}
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 flex items-center justify-between">
          <span>Updated:</span>
          <span>{reading.timestamp}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex flex-col w-64 max-w-xs bg-white shadow-xl h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
