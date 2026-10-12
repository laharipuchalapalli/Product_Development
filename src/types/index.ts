export type RiskCategory = 'Normal' | 'Caution' | 'High Risk';

export type RainCondition = 'No Rain' | 'Low' | 'Moderate' | 'High';

export interface SensorReading {
  waterLevelCm: number;
  distanceCm: number;
  referenceHeightCm: number;
  rainfallCondition: RainCondition;
  riseRateCmPerHour: number;
  waterScore: number;
  rainScore: number;
  riseScore: number;
  riskScore: number;
  riskCategory: RiskCategory;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  isSimulated: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'stale';
}

export interface AlertItem {
  id: string;
  timestamp: string;
  location: string;
  riskCategory: RiskCategory;
  waterLevelCm: number;
  rainfallCondition: RainCondition;
  riskScore: number;
  description: string;
  precaution: string;
  isRead: boolean;
}

export interface HazardReport {
  id: string;
  reporterName?: string;
  hazardType: 'Flooding' | 'Waterlogging' | 'Blocked drainage' | 'Road obstruction' | 'Heavy rainfall' | 'Other';
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  imageUrl?: string;
  timestamp: string;
}

export interface MonitoringNode {
  id: string;
  name: string;
  type: 'River Monitoring' | 'Drainage Monitoring' | 'Flood-Prone Road';
  lat: number;
  lng: number;
  waterLevelCm: number;
  dangerLevelCm: number;
  cautionLevelCm: number;
  riskCategory: RiskCategory;
  lastUpdate: string;
  rainfall: RainCondition;
  riseRate: number;
}

export interface ShelterItem {
  id: string;
  name: string;
  type: 'Community Shelter' | 'Emergency Shelter';
  lat: number;
  lng: number;
  distanceKm: number;
  capacity: number;
  currentOccupancy: number;
  status: 'Open' | 'Standby' | 'Full';
  elevationMeters: number;
  amenities: string[];
  contactPerson: string;
  phone: string;
}

export interface RoadConditionItem {
  id: string;
  roadName: string;
  stretch: string;
  status: 'Open' | 'Caution' | 'Reported Flooding' | 'Unknown';
  lastReported: string;
  notes: string;
}
