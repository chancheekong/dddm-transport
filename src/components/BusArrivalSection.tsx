import React, { useState } from "react";
import { 
  Bus, 
  Search, 
  RefreshCw, 
  Clock, 
  Users, 
  Accessibility, 
  Layers, 
  Navigation,
  Info,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { BusArrivalResponse, BusService, NextBusInfo } from "../types";
import { getMinutesUntil, getLoadDetails, getBusTypeDetails, POPULAR_BUS_STOPS } from "../utils/formatters";

interface BusArrivalSectionProps {
  busData: BusArrivalResponse | null;
  isLoading: boolean;
  busStopCode: string;
  onSearchBusStop: (code: string) => void;
  onRefresh: () => void;
}

export const BusArrivalSection: React.FC<BusArrivalSectionProps> = ({
  busData,
  isLoading,
  busStopCode,
  onSearchBusStop,
  onRefresh
}) => {
  const [inputCode, setInputCode] = useState(busStopCode);
  const [filterService, setFilterService] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onSearchBusStop(inputCode.trim());
    }
  };

  const handleQuickSelect = (code: string) => {
    setInputCode(code);
    onSearchBusStop(code);
  };

  const services = busData?.Services || [];
  const filteredServices = services.filter((s) =>
    s.ServiceNo.toLowerCase().includes(filterService.trim().toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Stop Info Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Active Bus Stop Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/30">
                Stop {busStopCode}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                {busData?.BusStopDescription || (busStopCode === "83139" ? "Sims Ave East (Blk 228)" : `Bus Stop ${busStopCode}`)}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{busData?.RoadName || "Sims Avenue East / Eunos Area"}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">{services.length} Services Available</span>
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-bus-stop-code"
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter 5-digit Bus Stop (e.g. 83139)"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              id="btn-search-bus-stop"
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              id="btn-refresh-bus-stop"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Refresh arrivals"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </form>
        </div>

        {/* Quick Pick Popular Stops */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Quick Pick:</span>
          {POPULAR_BUS_STOPS.map((stop) => (
            <button
              key={stop.code}
              type="button"
              onClick={() => handleQuickSelect(stop.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer border ${
                busStopCode === stop.code
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <span className="font-mono text-emerald-400 mr-1.5">{stop.code}</span>
              <span>{stop.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Legend Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Service filter input */}
        <div className="relative w-full sm:w-48">
          <input
            type="text"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            placeholder="Filter bus service (e.g. 15)"
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>

        {/* Crowd Level Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 overflow-x-auto py-1">
          <span className="font-semibold text-slate-300">Crowd Level:</span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Seats (SEA)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Standing (SDA)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Crowded (LSD)
          </span>
        </div>
      </div>

      {/* Bus Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Bus className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Bus Services Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {filterService ? `No services matching "${filterService}" for stop ${busStopCode}` : `No live services currently reported for Bus Stop ${busStopCode}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <BusServiceCard key={service.ServiceNo} service={service} />
          ))}
        </div>
      )}

      {/* API Details Footer */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Bus Arrival v3 provides estimated arrival timings, vehicle occupancy levels (SEA, SDA, LSD), double-deck / bendy vehicle types, and wheelchair accessibility status for all public bus routes operating under Singapore LTA.
        </p>
      </div>
    </div>
  );
};

// Sub-component for individual Bus Service card
const BusServiceCard: React.FC<{ service: BusService }> = ({ service }) => {
  const arrivalList: { label: string; bus?: NextBusInfo }[] = [
    { label: "Next Bus", bus: service.NextBus },
    { label: "2nd Bus", bus: service.NextBus2 },
    { label: "3rd Bus", bus: service.NextBus3 }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4.5 transition-all shadow-sm">
      {/* Service Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-lg tracking-tight shadow-md">
            {service.ServiceNo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">
                {service.Operator || "SBST"}
              </span>
              {service.NextBus?.Feature === "WAB" && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20" title="Wheelchair Accessible Bus">
                  <Accessibility className="w-3 h-3" />
                  WAB
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Dest: {service.NextBus?.DestinationCode || "Terminal"}
            </p>
          </div>
        </div>

        {/* First Bus Fast Countdown */}
        {service.NextBus?.EstimatedArrival && (
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Next Arrival</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              {getMinutesUntil(service.NextBus.EstimatedArrival).text}
            </span>
          </div>
        )}
      </div>

      {/* Triple Arrival Slots */}
      <div className="grid grid-cols-3 gap-2">
        {arrivalList.map((slot, idx) => {
          const bus = slot.bus;
          const hasData = bus && bus.EstimatedArrival;
          const timing = hasData ? getMinutesUntil(bus.EstimatedArrival) : null;
          const load = hasData ? getLoadDetails(bus.Load) : null;
          const busType = hasData ? getBusTypeDetails(bus.Type) : null;

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                hasData
                  ? "bg-slate-950/60 border-slate-800/80"
                  : "bg-slate-950/20 border-slate-850/50 opacity-40"
              }`}
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                {slot.label}
              </span>

              {hasData && timing ? (
                <>
                  {/* Arrival timing */}
                  <div className="my-1.5">
                    <span
                      className={`text-sm font-bold font-mono ${
                        timing.isArriving
                          ? "text-emerald-400 animate-pulse"
                          : timing.minutes <= 3
                          ? "text-teal-300"
                          : "text-slate-200"
                      }`}
                    >
                      {timing.text}
                    </span>
                  </div>

                  {/* Load & Type Badges */}
                  <div className="flex flex-col gap-1 items-center">
                    {load && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${load.bg} ${load.color} ${load.border}`}
                        title={load.label}
                      >
                        {bus?.Load || "SEA"}
                      </span>
                    )}

                    {busType && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        {busType.short}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-3 text-xs text-slate-600 font-mono">-</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
