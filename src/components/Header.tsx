import React, { useState, useEffect } from 'react';
import { Droplets, Bell, Wifi, WifiOff, Menu, X, Activity } from 'lucide-react';
import { useSensorContext } from '../context/SensorContext';

interface HeaderProps {
  onOpenAlerts: () => void;
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAlerts,
  onOpenMobileMenu,
  isMobileMenuOpen,
}) => {
  const { connectionStatus, setConnectionStatus, alerts } = useSensorContext();
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-slate-950 tracking-tight leading-none">
                  JAL DRISHTI
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  FloodSafe Village
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                Flood Monitoring & Community Early Warning System
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick Controls & Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Date & Time */}
          <div className="hidden lg:block text-right pr-2 border-r border-slate-200">
            <div className="text-xs font-medium text-slate-700">
              {currentDateTime}
            </div>
            <div className="text-[11px] text-slate-400">
              Village Monitoring Network
            </div>
          </div>

          {/* Simple Data Mode Indicator */}
          <button
            onClick={() => {
              if (connectionStatus === 'connected') setConnectionStatus('disconnected');
              else setConnectionStatus('connected');
            }}
            title="Click to toggle test status: Sample Data vs Sensor Unavailable"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              connectionStatus === 'connected'
                ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {connectionStatus === 'connected' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Sample Data</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Sensor Data Unavailable</span>
              </>
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="View Flood Warnings & Alerts"
            aria-label="View Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
