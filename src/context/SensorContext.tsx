import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AlertItem, HazardReport, MonitoringNode, RainCondition, RiskCategory, SensorReading } from '../types';
import { calculateRisk, calculateUltrasonicWaterLevel } from '../services/riskEngine';
import { INITIAL_ALERTS, INITIAL_HAZARD_REPORTS, INITIAL_MONITORING_NODES } from '../services/mockData';

interface HistoryPoint {
  time: string;
  waterLevelCm: number;
  riskScore: number;
  rainfall: RainCondition;
}

interface SensorContextType {
  reading: SensorReading;
  previousWaterLevel: number;
  history: HistoryPoint[];
  isSimulating: boolean;
  activeScenario: 'normal' | 'caution' | 'high_risk' | 'custom';
  connectionStatus: 'connected' | 'disconnected' | 'stale';
  lastUpdateTime: Date;
  secondsSinceLastUpdate: number;
  
  // Ultrasonic parameters
  referenceHeightCm: number;
  measuredDistanceCm: number;
  setReferenceHeightCm: (val: number) => void;
  setMeasuredDistanceCm: (val: number) => void;
  
  // Actions
  selectScenario: (scenario: 'normal' | 'caution' | 'high_risk') => void;
  toggleSimulation: () => void;
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'stale') => void;
  updateCustomReadings: (water: number, rain: RainCondition, rise: number) => void;
  
  // Alerts
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  clearAlerts: () => void;
  generateTestAlert: () => void;
  
  // Hazard Reports
  hazardReports: HazardReport[];
  addHazardReport: (report: Omit<HazardReport, 'id' | 'timestamp'>) => void;
  deleteHazardReport: (id: string) => void;
  
  // Nodes
  nodes: MonitoringNode[];
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

const LOCAL_STORAGE_REPORTS_KEY = 'jal_drishti_hazard_reports_v1';
const LOCAL_STORAGE_ALERTS_KEY = 'jal_drishti_alerts_v1';

export const SensorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [referenceHeightCm, setReferenceHeightCmState] = useState<number>(100);
  const [measuredDistanceCm, setMeasuredDistanceCmState] = useState<number>(80);
  const [rainfallCondition, setRainfallCondition] = useState<RainCondition>('Low');
  const [riseRateCmPerHour, setRiseRateCmPerHour] = useState<number>(1.2);
  const [previousWaterLevel, setPreviousWaterLevel] = useState<number>(18.5);
  
  const [activeScenario, setActiveScenario] = useState<'normal' | 'caution' | 'high_risk' | 'custom'>('normal');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'stale'>('connected');
  
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [secondsSinceLastUpdate, setSecondsSinceLastUpdate] = useState<number>(0);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-01');
  const [nodes, setNodes] = useState<MonitoringNode[]>(INITIAL_MONITORING_NODES);

  // Initialize history with realistic trend
  const [history, setHistory] = useState<HistoryPoint[]>([
    { time: '06:00', waterLevelCm: 18, riskScore: 12, rainfall: 'No Rain' },
    { time: '06:30', waterLevelCm: 19, riskScore: 14, rainfall: 'Low' },
    { time: '07:00', waterLevelCm: 19.5, riskScore: 15, rainfall: 'Low' },
    { time: '07:30', waterLevelCm: 20, riskScore: 15, rainfall: 'Low' },
    { time: '08:00', waterLevelCm: 20.2, riskScore: 16, rainfall: 'Low' },
  ]);

  // Alerts state with localStorage persistence
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ALERTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ALERTS;
  });

  // Hazard Reports state with localStorage persistence
  const [hazardReports, setHazardReports] = useState<HazardReport[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_HAZARD_REPORTS;
  });

  // Save alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.warn('Failed to save alerts to LocalStorage:', e);
    }
  }, [alerts]);

  // Save reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(hazardReports));
    } catch (e) {
      console.warn('Failed to save hazard reports to LocalStorage:', e);
    }
  }, [hazardReports]);

  // Age ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diffSecs = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000);
      setSecondsSinceLastUpdate(diffSecs);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdateTime]);

  // Ultrasonic water level
  const ultraCalc = calculateUltrasonicWaterLevel(referenceHeightCm, measuredDistanceCm);
  const currentWaterLevel = ultraCalc.isValid ? ultraCalc.waterLevelCm : 0;

  // Calculate current risk
  const riskResult = calculateRisk(
    currentWaterLevel,
    referenceHeightCm,
    rainfallCondition,
    riseRateCmPerHour
  );

  const reading: SensorReading = {
    waterLevelCm: currentWaterLevel,
    distanceCm: measuredDistanceCm,
    referenceHeightCm: referenceHeightCm,
    rainfallCondition: rainfallCondition,
    riseRateCmPerHour: riseRateCmPerHour,
    waterScore: riskResult.waterScore,
    rainScore: riskResult.rainScore,
    riseScore: riskResult.riseScore,
    riskScore: riskResult.riskScore,
    riskCategory: riskResult.riskCategory,
    timestamp: lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    nodeId: selectedNodeId,
    nodeName: nodes.find(n => n.id === selectedNodeId)?.name || 'Sensor Node 1 — River Monitoring',
    isSimulated: true,
    connectionStatus: connectionStatus,
  };

  // Keep track of high risk alert generation to avoid duplicate spamming
  const hasTriggeredHighRiskRef = useRef<boolean>(false);

  // Scenario Switcher
  const selectScenario = (scenario: 'normal' | 'caution' | 'high_risk') => {
    setActiveScenario(scenario);
    setPreviousWaterLevel(currentWaterLevel);
    setLastUpdateTime(new Date());

    if (scenario === 'normal') {
      // Scenario A — Normal: Water level: 20 cm, Rainfall: Low, Risk score: ~15
      setReferenceHeightCmState(100);
      setMeasuredDistanceCmState(80); // 100 - 80 = 20 cm
      setRainfallCondition('Low');
      setRiseRateCmPerHour(0.5);
      hasTriggeredHighRiskRef.current = false;
    } else if (scenario === 'caution') {
      // Scenario B — Caution: Water level: 48 cm, Rainfall: Moderate, Risk score: ~52
      setReferenceHeightCmState(100);
      setMeasuredDistanceCmState(52); // 100 - 52 = 48 cm
      setRainfallCondition('Moderate');
      setRiseRateCmPerHour(4.8);
      hasTriggeredHighRiskRef.current = false;
    } else if (scenario === 'high_risk') {
      // Scenario C — High Risk: Water level: 82 cm, Rainfall: High, Risk score: ~87
      setReferenceHeightCmState(100);
      setMeasuredDistanceCmState(18); // 100 - 18 = 82 cm
      setRainfallCondition('High');
      setRiseRateCmPerHour(14.5);
      
      // Auto-generate High Risk Demo Alert
      if (!hasTriggeredHighRiskRef.current) {
        hasTriggeredHighRiskRef.current = true;
        const newAlert: AlertItem = {
          id: `ALT-DEMO-${Date.now().toString().slice(-4)}`,
          timestamp: 'Just now',
          location: 'Sensor Node 1 — River Monitoring',
          riskCategory: 'High Risk',
          waterLevelCm: 82,
          rainfallCondition: 'High',
          riskScore: 87,
          description: 'Simulated Scenario C entered High Risk threshold. Water level exceeded 80 cm with torrential rainfall.',
          precaution: 'Follow verified local authority instructions and check confirmed shelter and road information.',
          isRead: false,
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    }
  };

  // Custom reading updater
  const updateCustomReadings = (water: number, rain: RainCondition, rise: number) => {
    setActiveScenario('custom');
    setPreviousWaterLevel(currentWaterLevel);
    const validWater = Math.max(0, Math.min(referenceHeightCm, water));
    setMeasuredDistanceCmState(Math.round((referenceHeightCm - validWater) * 10) / 10);
    setRainfallCondition(rain);
    setRiseRateCmPerHour(rise);
    setLastUpdateTime(new Date());
  };

  const setReferenceHeightCm = (val: number) => {
    setActiveScenario('custom');
    setReferenceHeightCmState(val);
    setLastUpdateTime(new Date());
  };

  const setMeasuredDistanceCm = (val: number) => {
    setActiveScenario('custom');
    setPreviousWaterLevel(currentWaterLevel);
    setMeasuredDistanceCmState(val);
    setLastUpdateTime(new Date());
  };

  // Toggle simulation
  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  // Periodic realistic drift if simulation is active
  useEffect(() => {
    if (!isSimulating || connectionStatus === 'disconnected') return;

    const interval = setInterval(() => {
      // Minor realistic sensor noise jitter (+/- 0.3 to 0.7 cm)
      setMeasuredDistanceCmState(prev => {
        const jitter = (Math.random() - 0.48) * 0.8;
        const nextDist = Math.max(5, Math.min(referenceHeightCm - 5, prev + jitter));
        return Math.round(nextDist * 10) / 10;
      });

      const now = new Date();
      setLastUpdateTime(now);

      // Append to history buffer (up to 12 points)
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setHistory(prev => {
        const newPoint: HistoryPoint = {
          time: timeStr,
          waterLevelCm: currentWaterLevel,
          riskScore: riskResult.riskScore,
          rainfall: rainfallCondition,
        };
        const updated = [...prev, newPoint];
        if (updated.length > 12) {
          return updated.slice(updated.length - 12);
        }
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating, connectionStatus, referenceHeightCm, currentWaterLevel, riskResult.riskScore, rainfallCondition]);

  // Alert actions
  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const generateTestAlert = () => {
    const newAlert: AlertItem = {
      id: `ALT-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      location: reading.nodeName,
      riskCategory: reading.riskCategory,
      waterLevelCm: reading.waterLevelCm,
      rainfallCondition: reading.rainfallCondition,
      riskScore: reading.riskScore,
      description: `Manual test broadcast triggered for ${reading.nodeName}. Current calculated risk is ${reading.riskScore}/100.`,
      precaution: reading.riskCategory === 'High Risk' 
        ? 'Seek higher ground if instructed by district emergency team.' 
        : 'Continue to observe official announcements.',
      isRead: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Hazard Report actions
  const addHazardReport = (report: Omit<HazardReport, 'id' | 'timestamp'>) => {
    const newReport: HazardReport = {
      ...report,
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
    };
    setHazardReports(prev => [newReport, ...prev]);
  };

  const deleteHazardReport = (id: string) => {
    setHazardReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <SensorContext.Provider
      value={{
        reading,
        previousWaterLevel,
        history,
        isSimulating,
        activeScenario,
        connectionStatus,
        lastUpdateTime,
        secondsSinceLastUpdate,
        referenceHeightCm,
        measuredDistanceCm,
        setReferenceHeightCm,
        setMeasuredDistanceCm,
        selectScenario,
        toggleSimulation,
        setConnectionStatus,
        updateCustomReadings,
        alerts,
        markAlertRead,
        markAllAlertsRead,
        clearAlerts,
        generateTestAlert,
        hazardReports,
        addHazardReport,
        deleteHazardReport,
        nodes,
        selectedNodeId,
        setSelectedNodeId,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensorContext = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensorContext must be used within a SensorProvider');
  }
  return context;
};
