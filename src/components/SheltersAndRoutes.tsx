import React, { useState } from 'react';
import {
  Home,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Phone,
  User,
  Info,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_ROAD_CONDITIONS, INITIAL_SHELTERS } from '../services/mockData';
import { NavSection } from './Sidebar';
import { ShelterItem } from '../types';

interface SheltersAndRoutesProps {
  onNavigate: (section: NavSection) => void;
}

export const SheltersAndRoutes: React.FC<SheltersAndRoutesProps> = ({ onNavigate }) => {
  const [selectedShelterForRoute, setSelectedShelterForRoute] = useState<ShelterItem | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Title & Critical Disclaimer */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Community Shelters & Safe Evacuation Corridors
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified elevation sanctuaries and road accessibility reports for village clusters
            </p>
          </div>
        </div>

        {/* Mandatory Safety Warning Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Critical Life-Safety Protocol:</strong> Do not automatically claim that a route is safe based solely on flood sensor telemetry. Road passability during cyclones or storm surges can be severed by washed-out culverts, fallen trees, or live powerlines. Always heed verified directives issued by the District Disaster Management Authority (DDMA) or NDRF.
          </div>
        </div>
      </div>

      {/* Shelters Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Designated Local Shelters
          </h3>
          <span className="text-xs text-slate-500">
            Reference Point: Village River Basin (Node 1)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_SHELTERS.map(shelter => (
            <div
              key={shelter.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {shelter.name}
                    </h4>
                    <span className="text-xs font-semibold text-blue-600">
                      {shelter.type} · Elevation {shelter.elevationMeters}m MSL
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      shelter.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {shelter.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Distance:</span>
                    <strong className="text-slate-900 font-mono text-sm">{shelter.distanceKm} km</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Capacity:</span>
                    <strong className="text-slate-900 font-mono text-sm">
                      {shelter.currentOccupancy} / {shelter.capacity}
                    </strong>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Shelter Facilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {shelter.amenities.map(amenity => (
                      <span
                        key={amenity}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>In-Charge: <strong>{shelter.contactPerson}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{shelter.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('flood-map')}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View on Map
                </button>
                <button
                  onClick={() => setSelectedShelterForRoute(shelter)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Route Guidance</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Road Accessibility Conditions Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Village Road Network & Bridge Status
            </h3>
            <p className="text-xs text-slate-500">
              Field observer logs and culvert passability assessments (Sample Community Data)
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Reported via Village Volunteer Network
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Road Name & Sector</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Reported Notes</th>
                <th className="py-2.5 px-3 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {INITIAL_ROAD_CONDITIONS.map(road => {
                const badgeClass = {
                  'Open': 'bg-emerald-100 text-emerald-800',
                  'Caution': 'bg-amber-100 text-amber-800',
                  'Reported Flooding': 'bg-rose-100 text-rose-800',
                  'Unknown': 'bg-slate-100 text-slate-700',
                }[road.status];

                return (
                  <tr key={road.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">
                        {road.roadName}
                      </div>
                      <div className="text-[11px] text-slate-400">{road.stretch}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${badgeClass}`}>
                        {road.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 leading-relaxed max-w-xs">
                      {road.notes}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                      {road.lastReported}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Guidance Modal / Drawer if user clicked Route Guidance */}
      {selectedShelterForRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Route Assessment: {selectedShelterForRoute.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Approx. {selectedShelterForRoute.distanceKm} km via Panchayat North Access Road
                </p>
              </div>
              <button
                onClick={() => setSelectedShelterForRoute(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <strong>Recommended Corridor:</strong> Proceed via Panchayat North Access Road (currently reported <span className="font-bold text-emerald-700">OPEN</span>). Do NOT use the Canal Bund Lower Road or Main Causeway.
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-800">
                  Pre-departure Checklist:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li>Carry personal identification, dry rations, and critical medications.</li>
                  <li>Do not attempt to cross moving water deeper than 15 cm on foot.</li>
                  <li>Turn off main domestic power breakers before vacating premises.</li>
                  <li>Verify destination shelter space with In-Charge: {selectedShelterForRoute.contactPerson} ({selectedShelterForRoute.phone}).</li>
                </ul>
              </div>

              <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200">
                ⚠️ Notice: Advisory routing information only. Always follow official road closure barriers and verified instructions from local emergency personnel.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedShelterForRoute(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedShelterForRoute(null);
                  onNavigate('flood-map');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Inspect on Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
