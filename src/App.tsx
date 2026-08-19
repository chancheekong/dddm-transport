/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { OverviewSection } from "./components/OverviewSection";
import { BusArrivalSection } from "./components/BusArrivalSection";
import { CarParkSection } from "./components/CarParkSection";
import { TrafficIncidentsSection } from "./components/TrafficIncidentsSection";
import { TrainServiceAlertsSection } from "./components/TrainServiceAlertsSection";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { 
  ActiveTab, 
  BusArrivalResponse, 
  CarParkResponse, 
  TrafficIncidentsResponse, 
  TrainAlertsResponse, 
  LtaApiStatus 
} from "./types";
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, ExternalLink, RefreshCw } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [busStopCode, setBusStopCode] = useState<string>("83139");
  
  // Custom Key stored locally if user provided one in UI
  const [customKey, setCustomKey] = useState<string>(() => {
    return localStorage.getItem("lta_custom_account_key") || "";
  });
  
  // Data States
  const [apiStatus, setApiStatus] = useState<LtaApiStatus | null>(null);
  const [busData, setBusData] = useState<BusArrivalResponse | null>(null);
  const [carParkData, setCarParkData] = useState<CarParkResponse | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficIncidentsResponse | null>(null);
  const [trainData, setTrainData] = useState<TrainAlertsResponse | null>(null);
  
  // Loading & UI States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "info" | "error" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Build headers with custom key if present
  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (customKey.trim()) {
      headers["x-account-key"] = customKey.trim();
    }
    return headers;
  }, [customKey]);

  // Fetch API status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/lta/status", { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setApiStatus(data);
      }
    } catch (err) {
      console.error("Status fetch error:", err);
    }
  }, [getHeaders]);

  // Fetch Bus Arrival
  const fetchBusArrival = useCallback(async (stopCode: string = busStopCode) => {
    try {
      const res = await fetch(`/api/lta/bus-arrival?busStopCode=${encodeURIComponent(stopCode)}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setBusData(data);
      }
    } catch (err) {
      console.error("Bus fetch error:", err);
    }
  }, [busStopCode, getHeaders]);

  // Fetch Car Park Availability
  const fetchCarParks = useCallback(async () => {
    try {
      const res = await fetch("/api/lta/car-park-availability", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setCarParkData(data);
      }
    } catch (err) {
      console.error("CarPark fetch error:", err);
    }
  }, [getHeaders]);

  // Fetch Traffic Incidents
  const fetchTraffic = useCallback(async () => {
    try {
      const res = await fetch("/api/lta/traffic-incidents", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setTrafficData(data);
      }
    } catch (err) {
      console.error("Traffic fetch error:", err);
    }
  }, [getHeaders]);

  // Fetch Train Service Alerts
  const fetchTrainAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/lta/train-alerts", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setTrainData(data);
      }
    } catch (err) {
      console.error("Train fetch error:", err);
    }
  }, [getHeaders]);

  // Fetch all endpoints concurrently
  const refreshAllData = useCallback(async (showNotification: boolean = false) => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStatus(),
        fetchBusArrival(busStopCode),
        fetchCarParks(),
        fetchTraffic(),
        fetchTrainAlerts()
      ]);
      setLastUpdated(new Date());
      if (showNotification) {
        showToast("Transport feeds updated in real-time.", "success");
      }
    } catch (err) {
      console.error("Refresh error:", err);
      showToast("Error refreshing live data.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatus, fetchBusArrival, fetchCarParks, fetchTraffic, fetchTrainAlerts, busStopCode]);

  // Initial Load
  useEffect(() => {
    refreshAllData();
  }, [customKey]);

  // Auto-refresh interval (every 30 seconds for live transit countdowns)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBusArrival(busStopCode);
      fetchTraffic();
      fetchTrainAlerts();
    }, 30000);
    return () => clearInterval(interval);
  }, [busStopCode, fetchBusArrival, fetchTraffic, fetchTrainAlerts]);

  // Handle bus stop code search
  const handleSearchBusStop = (newCode: string) => {
    setBusStopCode(newCode);
    fetchBusArrival(newCode);
    showToast(`Loaded Bus Stop ${newCode}`, "info");
  };

  // Handle saving custom key
  const handleSaveCustomKey = (newKey: string) => {
    setCustomKey(newKey);
    if (newKey) {
      localStorage.setItem("lta_custom_account_key", newKey);
      showToast("Custom LTA AccountKey saved!", "success");
    } else {
      localStorage.removeItem("lta_custom_account_key");
      showToast("Using default server configuration.", "info");
    }
  };

  const incidentCount = trafficData?.value?.length || 0;
  const trainAlertStatus = trainData?.value?.Status ?? 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className={`px-4 py-2.5 rounded-xl text-xs font-medium border shadow-xl flex items-center gap-2 ${
            toastMessage.type === "success" 
              ? "bg-emerald-950 border-emerald-500 text-emerald-200"
              : toastMessage.type === "error"
              ? "bg-rose-950 border-rose-500 text-rose-200"
              : "bg-slate-900 border-slate-700 text-slate-200"
          }`}>
            {toastMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === "info" && <Sparkles className="w-4 h-4 text-cyan-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
        onRefreshAll={() => refreshAllData(true)}
        isLoading={isLoading}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        lastUpdated={lastUpdated}
        incidentCount={incidentCount}
        trainAlertStatus={trainAlertStatus}
      />

      {/* API Source Status Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        {busData?._source === "demo" || !apiStatus?.hasKey ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-semibold text-slate-200">Interactive Preview Active: </span>
                <span className="text-slate-400">
                  Ready to link your LTA AccountKey? Click "Configure Account Key" to provide your key for live DataMall streaming.
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors"
            >
              Enter AccountKey
            </button>
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Connected to Singapore LTA DataMall Live API stream.</span>
            </div>
            {lastUpdated && (
              <span className="text-[11px] text-emerald-400/80 font-mono">
                Updated {lastUpdated.toLocaleTimeString("en-SG")}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {activeTab === "overview" && (
          <OverviewSection
            busData={busData}
            carParkData={carParkData}
            trafficData={trafficData}
            trainData={trainData}
            onNavigateTab={setActiveTab}
            busStopCode={busStopCode}
          />
        )}

        {activeTab === "bus" && (
          <BusArrivalSection
            busData={busData}
            isLoading={isLoading}
            busStopCode={busStopCode}
            onSearchBusStop={handleSearchBusStop}
            onRefresh={() => fetchBusArrival(busStopCode)}
          />
        )}

        {activeTab === "carpark" && (
          <CarParkSection
            carParkData={carParkData}
            isLoading={isLoading}
            onRefresh={fetchCarParks}
          />
        )}

        {activeTab === "traffic" && (
          <TrafficIncidentsSection
            trafficData={trafficData}
            isLoading={isLoading}
            onRefresh={fetchTraffic}
          />
        )}

        {activeTab === "train" && (
          <TrainServiceAlertsSection
            trainData={trainData}
            isLoading={isLoading}
            onRefresh={fetchTrainAlerts}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Singapore Land Transport Authority (LTA) Open Data Feed</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <a
              href="https://datamall.lta.gov.sg"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>LTA DataMall Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-500">
              API v3 BusArrival • v2 CarPark • TrafficIncidents • TrainAlerts
            </span>
          </div>
        </div>
      </footer>

      {/* Account Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiStatus={apiStatus}
        onSaveCustomKey={handleSaveCustomKey}
        currentCustomKey={customKey}
      />
    </div>
  );
}
