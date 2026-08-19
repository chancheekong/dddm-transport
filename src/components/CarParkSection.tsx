import React, { useState, useMemo } from "react";
import { 
  Car, 
  Search, 
  RefreshCw, 
  Building2, 
  MapPin, 
  Layers, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info
} from "lucide-react";
import { CarPark, CarParkResponse } from "../types";

interface CarParkSectionProps {
  carParkData: CarParkResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const CarParkSection: React.FC<CarParkSectionProps> = ({
  carParkData,
  isLoading,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("ALL");
  const [selectedAgency, setSelectedAgency] = useState<string>("ALL");
  const [selectedLotType, setSelectedLotType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"available_desc" | "available_asc" | "name">("available_desc");

  const carparks = carParkData?.value || [];

  // Extract unique areas and agencies
  const uniqueAreas = useMemo(() => {
    const set = new Set<string>();
    carparks.forEach((cp) => {
      if (cp.Area) set.add(cp.Area);
    });
    return Array.from(set).sort();
  }, [carparks]);

  const uniqueAgencies = useMemo(() => {
    const set = new Set<string>();
    carparks.forEach((cp) => {
      if (cp.Agency) set.add(cp.Agency);
    });
    return Array.from(set).sort();
  }, [carparks]);

  // Filter & Sort
  const filteredCarParks = useMemo(() => {
    return carparks
      .filter((cp) => {
        const matchesSearch =
          cp.Development?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cp.Area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cp.CarParkID?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesArea = selectedArea === "ALL" || cp.Area === selectedArea;
        const matchesAgency = selectedAgency === "ALL" || cp.Agency === selectedAgency;
        const matchesLotType = selectedLotType === "ALL" || cp.LotType === selectedLotType;

        return matchesSearch && matchesArea && matchesAgency && matchesLotType;
      })
      .sort((a, b) => {
        if (sortBy === "available_desc") return b.AvailableLots - a.AvailableLots;
        if (sortBy === "available_asc") return a.AvailableLots - b.AvailableLots;
        return (a.Development || "").localeCompare(b.Development || "");
      });
  }, [carparks, searchTerm, selectedArea, selectedAgency, selectedLotType, sortBy]);

  // Summary Metrics
  const totalAvailableLots = useMemo(() => {
    return filteredCarParks.reduce((sum, cp) => sum + (cp.AvailableLots || 0), 0);
  }, [filteredCarParks]);

  return (
    <div className="space-y-6">
      {/* Header & Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block">Total Car Parks Listed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
              {filteredCarParks.length}
            </span>
            <span className="text-xs text-slate-500">locations</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block">Total Available Lots</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              {totalAvailableLots.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-500/80">lots ready</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Data Source</span>
            <button
              id="btn-refresh-carparks"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition-all cursor-pointer"
              title="Refresh car park data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-slate-300 font-mono mt-2">
            LTA / HDB / URA CarParkAvailabilityv2
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-carpark-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mall, building, area (e.g. Suntec, Orchard, Bedok)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Area Select */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Areas</option>
            {uniqueAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          {/* Agency Select */}
          <select
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Agencies</option>
            {uniqueAgencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="available_desc">Highest Available Lots</option>
            <option value="available_asc">Lowest Available Lots</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Quick Area Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1 shrink-0">Popular:</span>
          {["ALL", "Marina", "Orchard", "Bugis", "Jurong", "Changi", "Sentosa"].map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer border ${
                selectedArea === area
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              {area === "ALL" ? "All Locations" : area}
            </button>
          ))}
        </div>
      </div>

      {/* Carpark Grid */}
      {filteredCarParks.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Car className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No Car Parks Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or area filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCarParks.map((cp) => (
            <CarParkCard key={`${cp.CarParkID}-${cp.Development}`} carpark={cp} />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Car Park Availability v2 updates lot numbers continuously across major shopping centers, commercial hubs, URA street/off-street carparks, and Housing & Development Board (HDB) residential estates.
        </p>
      </div>
    </div>
  );
};

// Sub-component for individual Car Park
const CarParkCard: React.FC<{ carpark: CarPark }> = ({ carpark }) => {
  const lots = carpark.AvailableLots;

  // Status color logic
  let lotBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  let statusText = "Plenty of Lots";

  if (lots < 20) {
    lotBadgeColor = "text-rose-400 bg-rose-500/10 border-rose-500/30";
    statusText = "Almost Full";
  } else if (lots <= 100) {
    lotBadgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    statusText = "Moderate Capacity";
  }

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4.5 flex flex-col justify-between transition-all shadow-sm group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <span className="text-[10px] font-mono text-slate-500 block mb-0.5">
              ID: {carpark.CarParkID} • {carpark.Agency || "LTA"}
            </span>
            <h4 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-emerald-400 transition-colors">
              {carpark.Development}
            </h4>
          </div>
          {carpark.Area && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
              {carpark.Area}
            </span>
          )}
        </div>

        {carpark.Location && (
          <p className="text-[11px] text-slate-500 flex items-center gap-1 mb-3 font-mono">
            <MapPin className="w-3 h-3 text-slate-600" />
            <span>GPS: {carpark.Location}</span>
          </p>
        )}
      </div>

      {/* Lots Display */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block">Available Lots</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-slate-100">
              {lots.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">
              ({carpark.LotType === "C" ? "Cars" : carpark.LotType === "Y" ? "Bikes" : "Heavy"})
            </span>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${lotBadgeColor}`}>
          {statusText}
        </span>
      </div>
    </div>
  );
};
