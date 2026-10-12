import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  AlertTriangle,
  Info,
  ShieldCheck,
  Home,
  CheckCircle,
} from 'lucide-react';
import { useSensorContext } from '../context/SensorContext';
import { INITIAL_ROAD_CONDITIONS, INITIAL_SHELTERS } from '../services/mockData';

type MapFilter = 'all' | 'sensors' | 'hazards' | 'shelters';

export const FloodMap: React.FC = () => {
  const { nodes, reading, hazardReports } = useSensorContext();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filter, setFilter] = useState<MapFilter>('all');
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    category: string;
    status: string;
    description: string;
    verificationStatus: string;
  } | null>(null);

  const [hasMapError, setHasMapError] = useState<boolean>(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      try {
        const centerLat = 10.8284;
        const centerLng = 78.8250;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomControl: true,
        });

        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors | Jal Drishti',
          maxZoom: 18,
        });

        tileLayer.on('tileerror', () => {
          console.warn('Leaflet tile loading error.');
        });

        tileLayer.addTo(map);
        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Failed to initialize Leaflet map:', err);
        setHasMapError(true);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    // 1. Water Monitoring Locations
    if (filter === 'all' || filter === 'sensors') {
      nodes.forEach(node => {
        const isLiveNode = node.id === 'node-01';
        const water = isLiveNode ? reading.waterLevelCm : node.waterLevelCm;
        const risk = isLiveNode ? reading.riskCategory : node.riskCategory;
        const markerColor = risk === 'High Risk' ? '#dc2626' : risk === 'Caution' ? '#d97706' : '#16a34a';

        const sensorIcon = L.divIcon({
          className: 'custom-sensor-icon',
          html: `
            <div style="background-color: ${markerColor}; width: 30px; height: 30px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([node.lat, node.lng], { icon: sensorIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 170px;">
            <div style="font-weight: 700; color: #0f172a;">${node.name}</div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 4px;">Water Monitoring Point</div>
            <div style="padding: 4px; background: #f8fafc; border-radius: 4px;">
              <strong>Water Level:</strong> ${water} cm<br/>
              <strong>Status:</strong> <span style="font-weight:bold; color: ${markerColor}">${risk}</span>
            </div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Updated: ${node.lastUpdate}</div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedItem({
            id: node.id,
            name: node.name,
            category: 'Water Monitoring Station',
            status: risk,
            description: `Current water level is ${water} cm. Caution line at ${node.cautionLevelCm} cm, Danger threshold at ${node.dangerLevelCm} cm.`,
            verificationStatus: 'Automated Gauge (Sample Data)',
          });
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Shelters
    if (filter === 'all' || filter === 'shelters') {
      INITIAL_SHELTERS.forEach(shelter => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-icon',
          html: `
            <div style="background-color: #2563eb; width: 30px; height: 30px; border-radius: 6px; border: 2.5px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 180px;">
            <div style="font-weight: 700; color: #0f172a;">${shelter.name}</div>
            <div style="color: #2563eb; font-size: 11px;">${shelter.type}</div>
            <div style="padding: 4px; background: #eff6ff; border-radius: 4px; margin-top: 4px;">
              <strong>Distance:</strong> ${shelter.distanceKm} km<br/>
              <strong>Capacity:</strong> ${shelter.capacity} people<br/>
              <strong>Status:</strong> ${shelter.status}
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Contact: ${shelter.phone}</div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedItem({
            id: shelter.id,
            name: shelter.name,
            category: shelter.type,
            status: shelter.status,
            description: `Elevated shelter located ${shelter.distanceKm} km away. Amenities include: ${shelter.amenities.join(', ')}. Contact in-charge: ${shelter.contactPerson} (${shelter.phone}).`,
            verificationStatus: 'Designated Shelter (Confirm with administration before departure)',
          });
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 3. Flooded Roads & Community Hazard Reports
    if (filter === 'all' || filter === 'hazards') {
      hazardReports.forEach((report, idx) => {
        const hazardLat = 10.8250 + (idx * 0.006) - 0.003;
        const hazardLng = 78.8220 + (idx * 0.005);

        const hazardIcon = L.divIcon({
          className: 'custom-hazard-icon',
          html: `
            <div style="background-color: #e11d48; width: 26px; height: 26px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([hazardLat, hazardLng], { icon: hazardIcon });
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 170px;">
            <div style="font-weight: 700; color: #0f172a;">${report.hazardType}</div>
            <div style="color: #e11d48; font-size: 11px;">${report.location}</div>
            <p style="margin: 4px 0; color: #475569;">${report.description}</p>
            <div style="font-size: 10px; color: #94a3b8;">Severity: ${report.severity} · ${report.timestamp}</div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedItem({
            id: report.id,
            name: `${report.hazardType} - ${report.location}`,
            category: 'Community Hazard Report',
            status: `${report.severity} Severity`,
            description: report.description,
            verificationStatus: 'Unverified Community Report (Awaiting ground inspection)',
          });
        });

        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [filter, nodes, reading, hazardReports]);

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Village Flood Map
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Interactive map showing water monitoring stations, reported flooded roads, and shelters
            </p>
          </div>

          {/* Simple Filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('sensors')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'sensors'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Water Monitors
            </button>
            <button
              onClick={() => setFilter('hazards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'hazards'
                  ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reported Flooding
            </button>
            <button
              onClick={() => setFilter('shelters')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === 'shelters'
                  ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shelters
            </button>
          </div>
        </div>

        {/* Clear community notice */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Safety Notice:</strong> Map data shows sample monitoring locations and unverified community reports. Official road closures and evacuation instructions are issued by local authorities. Never attempt to cross flooded roadways.
          </span>
        </div>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
          {/* Map Legend */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Normal Water
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Caution
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                High Risk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                Shelter
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" />
                Reported Hazard
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Click any marker to inspect</span>
          </div>

          <div className="relative w-full h-[460px]">
            {hasMapError ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-600 mb-2" />
                <h3 className="text-sm font-bold text-slate-800">Map Unavailable</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Could not load online map tiles. Please check your internet connection.
                </p>
              </div>
            ) : (
              <div ref={mapContainerRef} className="w-full h-full z-10" />
            )}
          </div>
        </div>

        {/* Selected Location Details Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                Selected Location Information
              </h2>
              <span className="text-xs text-slate-400">
                {selectedItem ? 'Details' : 'Select a Marker'}
              </span>
            </div>

            {selectedItem ? (
              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {selectedItem.category}
                  </span>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedItem.name}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Status:</span>
                    <span className="font-bold text-slate-900">{selectedItem.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Source:</span>
                    <span className="text-slate-700 font-medium">{selectedItem.verificationStatus}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Description & Observations
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                    {selectedItem.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center text-xs text-slate-500 space-y-2">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Click on any marker on the map to see its current status, water readings, or shelter details.</p>
                <div className="pt-4 text-left space-y-2 text-[11px] text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <strong>Water Monitoring Station:</strong> River Bridge Node
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <strong>Community Shelters:</strong> Village Hall & Relief Centre
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <strong>Hazard Reports:</strong> Reported waterlogging & blocked culverts
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            OpenStreetMap Cartography
          </div>
        </div>
      </div>
    </div>
  );
};
