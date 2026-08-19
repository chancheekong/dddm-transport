import React from "react";
import { 
  Bus, 
  Car, 
  AlertTriangle, 
  TrainTrack, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Activity,
  Layers
} from "lucide-react";
import { 
  ActiveTab, 
  BusArrivalResponse, 
  CarParkResponse, 
  TrafficIncidentsResponse, 
  TrainAlertsResponse 
} from "../types";
import { getMinutesUntil, getLoadDetails, extractExpressway } from "../utils/formatters";

interface OverviewSectionProps {
  busData: BusArrivalResponse | null;
  carParkData: CarParkResponse | null;
  trafficData: TrafficIncidentsResponse | null;
  trainData: TrainAlertsResponse | null;
  onNavigateTab: (tab: ActiveTab) => void;
  busStopCode: string;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  busData,
  carParkData,
  trafficData,
  trainData,
  onNavigateTab,
  busStopCode
}) => {
  const services = busData?.Services || [];
  const carparks = carParkData?.value || [];
  const incidents = trafficData?.value || [];
  const isTrainNormal = !trainData?.value || trainData.value.Status === 1;

  // Car parks summary
  const topCarParks = carparks.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 4 Pillar Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bus Pillar */}
        <div 
          onClick={() => onNavigateTab("bus")}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Stop {busStopCode} <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 block">Bus Arrivals (v3)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {services.length}
            </span>
            <span className="text-xs text-slate-500">services at stop</span>
          </div>
        </div>

        {/* Car Parks Pillar */}
        <div 
          onClick={() => onNavigateTab("carpark")}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View All <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 block">Car Parks (v2)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-100 font-mono">
              {carparks.length}
            </span>
            <span className="text-xs text-slate-500">monitored hubs</span>
          </div>
        </div>

        {/* Traffic Incidents Pillar */}
        <div 
          onClick={() => onNavigateTab("traffic")}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Alerts <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 block">Traffic Incidents</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-400 font-mono">
              {incidents.length}
            </span>
            <span className="text-xs text-slate-500">live road notices</span>
          </div>
        </div>

        {/* Train Alerts Pillar */}
        <div 
          onClick={() => onNavigateTab("train")}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrainTrack className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-purple-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              MRT / LRT <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-400 block">Train Service Alerts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold ${isTrainNormal ? "text-emerald-400" : "text-rose-400"}`}>
              {isTrainNormal ? "Normal" : "Disrupted"}
            </span>
            <span className="text-xs text-slate-500">all rail lines</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bus Stop 83139 Live Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  Bus Stop {busStopCode} Arrival Feed
                </h3>
                <p className="text-[11px] text-slate-400">
                  {busData?.BusStopDescription || "Sims Ave East (Blk 228 / Eunos Area)"}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("bus")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              Full Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {services.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No services found.</p>
          ) : (
            <div className="space-y-2.5">
              {services.slice(0, 4).map((service) => {
                const nextBus = service.NextBus;
                const timing = nextBus?.EstimatedArrival
                  ? getMinutesUntil(nextBus.EstimatedArrival)
                  : null;
                const load = nextBus ? getLoadDetails(nextBus.Load) : null;

                return (
                  <div
                    key={service.ServiceNo}
                    className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600 font-bold text-white text-sm font-mono">
                        {service.ServiceNo}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        {service.Operator || "SBST"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {load && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${load.bg} ${load.color} ${load.border}`}
                        >
                          {nextBus?.Load || "SEA"}
                        </span>
                      )}
                      {timing && (
                        <span className="font-bold text-emerald-400 font-mono text-sm">
                          {timing.text}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Live Traffic Notices Snapshot */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">
                  Expressway & Road Alerts
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time EMAS alerts across Singapore
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("traffic")}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              All Alerts ({incidents.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {incidents.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No active traffic incidents reported.</p>
          ) : (
            <div className="space-y-2.5">
              {incidents.slice(0, 3).map((incident, idx) => {
                const exp = extractExpressway(incident.Message);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        {incident.Type || "Incident"}
                      </span>
                      {exp && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          {exp}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {incident.Message}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Car Parks Quick Snapshot Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Key Commercial & Mall Car Parks
              </h3>
              <p className="text-[11px] text-slate-400">
                Live availability from CarParkAvailabilityv2
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab("carpark")}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            Explore All ({carparks.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topCarParks.map((cp) => (
            <div
              key={`${cp.CarParkID}-${cp.Development}`}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {cp.Area}
                </span>
                <h4 className="font-semibold text-slate-200 text-xs truncate">
                  {cp.Development}
                </h4>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-850 flex items-center justify-between">
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {cp.AvailableLots}
                </span>
                <span className="text-[10px] text-slate-400">lots left</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
