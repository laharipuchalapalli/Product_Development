import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Trash2,
  CheckCheck,
  PlusCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useSensorContext } from '../context/SensorContext';
import { AlertItem, RiskCategory } from '../types';

export const AlertsView: React.FC = () => {
  const {
    alerts,
    markAlertRead,
    markAllAlertsRead,
    clearAlerts,
    generateTestAlert,
  } = useSensorContext();

  const [categoryFilter, setCategoryFilter] = useState<'All' | RiskCategory>('All');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const filteredAlerts = alerts.filter(a => {
    if (categoryFilter === 'All') return true;
    return a.riskCategory === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Community Flood Warnings & Notices
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Current and recent warnings triggered by automated monitors and verified village reports
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={generateTestAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Test Alert</span>
            </button>
            <button
              onClick={markAllAlertsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={clearAlerts}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {(['All', 'High Risk', 'Caution', 'Normal'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat} {cat === 'All' ? `(${alerts.length})` : `(${alerts.filter(a => a.riskCategory === cat).length})`}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            Click any warning to view detailed response advice
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h2 className="text-sm font-bold text-slate-800">
              No Active Warnings in this Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Water levels are stable or all previous notices have been cleared.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isHigh = alert.riskCategory === 'High Risk';
            const isCaution = alert.riskCategory === 'Caution';

            return (
              <div
                key={alert.id}
                onClick={() => {
                  markAlertRead(alert.id);
                  setSelectedAlert(alert);
                }}
                className={`cursor-pointer bg-white rounded-xl border p-4 sm:p-5 transition-all hover:border-slate-400 ${
                  !alert.isRead ? 'border-l-4' : ''
                } ${
                  isHigh
                    ? !alert.isRead ? 'border-l-rose-600 bg-rose-50/20' : 'border-slate-200'
                    : isCaution
                    ? !alert.isRead ? 'border-l-amber-500 bg-amber-50/20' : 'border-slate-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isHigh
                          ? 'bg-rose-100 text-rose-700'
                          : isCaution
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {isHigh ? 'HIGH RISK FLOOD WARNING' : isCaution ? 'CAUTION ADVISORY' : 'NORMAL CONDITIONS UPDATE'}
                        </span>
                        {!alert.isRead && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-600 mt-0.5">
                        Location: <strong className="text-slate-800">{alert.location}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp & Risk Badge */}
                  <div className="sm:text-right text-xs">
                    <div className="text-slate-400 text-[11px] font-mono flex items-center gap-1 sm:justify-end">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                    <div className="mt-1">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isHigh
                            ? 'bg-rose-100 text-rose-800'
                            : isCaution
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {alert.riskCategory}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plain-Language Conditions Strip */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Water Level:</span>
                    <strong className="font-mono">{alert.waterLevelCm} cm</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rainfall:</span>
                    <strong>{alert.rainfallCondition}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Source:</span>
                    <span className="text-slate-600">Automated River Monitor</span>
                  </div>
                </div>

                {/* Explanation & Recommended Action */}
                <div className="mt-3 text-xs text-slate-700 space-y-1">
                  <p className="leading-relaxed">
                    {alert.description}
                  </p>
                  <p className="text-slate-900 font-medium pt-1">
                    <span className="text-slate-500 font-normal">Recommended Action:</span> {alert.precaution}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-mono">{selectedAlert.id}</span>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedAlert.riskCategory} Notice Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-900">{selectedAlert.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Recorded:</span>
                  <span className="font-mono text-slate-700">{selectedAlert.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Water Depth:</span>
                  <span className="font-mono font-bold text-blue-700">{selectedAlert.waterLevelCm} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rainfall:</span>
                  <span className="font-semibold text-slate-800">{selectedAlert.rainfallCondition}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block mb-1">
                  Situation Overview:
                </span>
                <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
                <strong className="block mb-0.5">Recommended Precaution:</strong>
                {selectedAlert.precaution}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
