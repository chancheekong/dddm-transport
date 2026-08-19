import React, { useState, useEffect } from "react";
import { 
  Bus, 
  Car, 
  AlertTriangle, 
  TrainTrack, 
  RefreshCw, 
  Key, 
  Clock, 
  CheckCircle2, 
  LayoutDashboard,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { ActiveTab, LtaApiStatus } from "../types";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  apiStatus: LtaApiStatus | null;
  onRefreshAll: () => void;
  isLoading: boolean;
  onOpenKeyModal: () => void;
  lastUpdated: Date | null;
  incidentCount: number;
  trainAlertStatus: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  apiStatus,
  onRefreshAll,
  isLoading,
  onOpenKeyModal,
  lastUpdated,
  incidentCount,
  trainAlertStatus
}) => {
  const [sgTime, setSgTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSgTime(
        now.toLocaleTimeString("en-SG", {
          timeZone: "Asia/Singapore",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bus", label: "Bus Arrivals (v3)", icon: Bus },
    { id: "carpark", label: "Car Parks (v2)", icon: Car },
    { 
      id: "traffic", 
      label: "Traffic Alerts", 
      icon: AlertTriangle, 
      badge: incidentCount > 0 ? incidentCount : undefined,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
    },
    { 
      id: "train", 
      label: "Train Alerts", 
      icon: TrainTrack,
      badge: trainAlertStatus === 2 ? "Alert" : "Normal",
      badgeColor: trainAlertStatus === 2 ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Singapore Live Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/30">
              <span className="font-bold text-white text-base tracking-tighter">SG</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-100 tracking-tight">Singapore Transport Live</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                  LTA DataMall
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Real-Time Public Transport & Traffic Services</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  SGT {sgTime || "14:30:00"}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons & Status */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Account Key Status Indicator Button */}
            <button
              id="btn-account-key-status"
              onClick={onOpenKeyModal}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                apiStatus?.hasKey
                  ? "bg-slate-800/80 hover:bg-slate-800 text-emerald-300 border-emerald-500/40 shadow-sm"
                  : "bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-500/40"
              }`}
              title="Click to view or configure LTA DataMall AccountKey"
            >
              <Key className="w-3.5 h-3.5" />
              <span>
                {apiStatus?.hasKey ? `Key Active (${apiStatus.keyPreview})` : "Configure Account Key"}
              </span>
              {apiStatus?.hasKey ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>

            {/* Refresh Button */}
            <button
              id="btn-refresh-all"
              onClick={onRefreshAll}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Refreshing..." : "Refresh Live"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 mt-4 pt-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold border ${item.badgeColor || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
