import React, { useState, useMemo } from "react";
import { 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Wrench, 
  Truck, 
  Car, 
  ShieldAlert, 
  Compass, 
  Activity, 
  Clock,
  Info,
  MapPin
} from "lucide-react";
import { TrafficIncident, TrafficIncidentsResponse } from "../types";
import { extractExpressway } from "../utils/formatters";

interface TrafficIncidentsSectionProps {
  trafficData: TrafficIncidentsResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const TrafficIncidentsSection: React.FC<TrafficIncidentsSectionProps> = ({
  trafficData,
  isLoading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedExpressway, setSelectedExpressway] = useState<string>("ALL");

  const incidents = trafficData?.value || [];

  // Unique incident types
  const uniqueTypes = useMemo(() => {
    const set = new Set<string>();
    incidents.forEach((inc) => {
      if (inc.Type) set.add(inc.Type);
    });
    return Array.from(set).sort();
  }, [incidents]);

  // Unique expressways detected
  const uniqueExpressways = useMemo(() => {
    const set = new Set<string>();
    incidents.forEach((inc) => {
      const exp = extractExpressway(inc.Message);
      if (exp) set.add(exp);
    });
    return Array.from(set).sort();
  }, [incidents]);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSearch = inc.Message?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "ALL" || inc.Type === selectedType;
      const expressway = extractExpressway(inc.Message);
      const matchesExpressway = selectedExpressway === "ALL" || expressway === selectedExpressway;

      return matchesSearch && matchesType && matchesExpressway;
    });
  }, [incidents, searchTerm, selectedType, selectedExpressway]);

  const getIncidentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "accident":
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case "road works":
      case "roadworks":
        return <Wrench className="w-5 h-5 text-amber-400" />;
      case "vehicle breakdown":
      case "breakdown":
        return <Truck className="w-5 h-5 text-orange-400" />;
      case "heavy traffic":
        return <Activity className="w-5 h-5 text-yellow-400" />;
      case "road block":
      case "obstacle":
      case "diversion":
        return <ShieldAlert className="w-5 h-5 text-purple-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case "accident":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      case "road works":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "vehicle breakdown":
        return "bg-orange-500/10 text-orange-300 border-orange-500/30";
      case "heavy traffic":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block">Active Incidents</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono">
              {incidents.length}
            </span>
            <span className="text-xs text-slate-500">reported</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block">Accidents & Roadworks</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
              {incidents.filter((i) => i.Type === "Accident" || i.Type === "Road Works").length}
            </span>
            <span className="text-xs text-amber-500/80">critical notices</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Traffic Source</span>
            <button
              id="btn-refresh-traffic"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition-all cursor-pointer"
              title="Refresh traffic incidents"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-slate-300 font-mono mt-2">
            LTA EMAS TrafficIncidents
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-traffic-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by road, expressway, advice (e.g. PIE, CTE, lane 1)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Incident Types</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedExpressway}
            onChange={(e) => setSelectedExpressway(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Expressways</option>
            {uniqueExpressways.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Expressway Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1 shrink-0">Expressways:</span>
          {["ALL", "PIE", "CTE", "AYE", "KPE", "ECP", "SLE", "BKE", "TPE", "MCE"].map((exp) => (
            <button
              key={exp}
              onClick={() => setSelectedExpressway(exp)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer border ${
                selectedExpressway === exp
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      {filteredIncidents.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Traffic Incidents Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchTerm || selectedType !== "ALL"
              ? "No incident matching your filter criteria."
              : "Expressways and major arterials are currently clear."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncidents.map((incident, idx) => {
            const exp = extractExpressway(incident.Message);
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-sm flex flex-col sm:flex-row items-start gap-4"
              >
                {/* Icon */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {getIncidentIcon(incident.Type)}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeBadgeStyle(
                        incident.Type
                      )}`}
                    >
                      {incident.Type || "Incident"}
                    </span>

                    {exp && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {exp}
                      </span>
                    )}

                    {incident.Latitude && incident.Longitude ? (
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {Number(incident.Latitude).toFixed(4)}, {Number(incident.Longitude).toFixed(4)}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-slate-200 font-medium leading-relaxed">
                    {incident.Message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Traffic Incidents are sourced directly from the Land Transport Authority Expressways Monitoring and Advisory System (EMAS), capturing live road obstructions, traffic bottlenecks, and accidents.
        </p>
      </div>
    </div>
  );
};
