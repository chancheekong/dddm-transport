import React from "react";
import { 
  TrainTrack, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Bus, 
  ArrowRight, 
  Clock, 
  Info,
  Layers
} from "lucide-react";
import { TrainAlertsResponse, LineStatusItem } from "../types";

interface TrainServiceAlertsSectionProps {
  trainData: TrainAlertsResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const DEFAULT_LINES: LineStatusItem[] = [
  { code: "NSL", name: "North-South Line", status: "Normal", color: "#D42E12" },
  { code: "EWL", name: "East-West Line", status: "Normal", color: "#009530" },
  { code: "NEL", name: "North-East Line", status: "Normal", color: "#9B1780" },
  { code: "CCL", name: "Circle Line", status: "Normal", color: "#FA9E0D" },
  { code: "DTL", name: "Downtown Line", status: "Normal", color: "#005EC4" },
  { code: "TEL", name: "Thomson-East Coast Line", status: "Normal", color: "#9D5B25" },
  { code: "BPLRT", name: "Bukit Panjang LRT", status: "Normal", color: "#748577" },
  { code: "SKPGLRT", name: "Sengkang-Punggol LRT", status: "Normal", color: "#748577" }
];

export const TrainServiceAlertsSection: React.FC<TrainServiceAlertsSectionProps> = ({
  trainData,
  isLoading,
  onRefresh
}) => {
  const trainValue = trainData?.value;
  const isNormal = !trainValue || trainValue.Status === 1;
  const messages = trainValue?.Message || [];
  const affectedSegments = trainValue?.AffectedSegments || [];
  const linesStatus = trainValue?.LinesStatus || DEFAULT_LINES;

  return (
    <div className="space-y-6">
      {/* System Status Banner */}
      <div
        className={`rounded-2xl p-6 border shadow-md transition-all ${
          isNormal
            ? "bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30"
            : "bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`p-3.5 rounded-2xl border ${
                isNormal
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}
            >
              {isNormal ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isNormal
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                  }`}
                >
                  Status Code {trainValue?.Status ?? 1}
                </span>
                <span className="text-xs text-slate-400">MRT & LRT System</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                {isNormal
                  ? "Train Services Operating Normally"
                  : "Train Service Disruptions Detected"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {isNormal
                  ? "No major train delays or station closures reported by SMRT & SBS Transit."
                  : "Please review affected lines and bridging shuttle buses below."}
              </p>
            </div>
          </div>

          <button
            id="btn-refresh-trains"
            onClick={onRefresh}
            disabled={isLoading}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Check Status</span>
          </button>
        </div>
      </div>

      {/* Affected Segments (if any) */}
      {affectedSegments.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-rose-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Affected Rail Segments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {affectedSegments.map((segment, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-rose-500/20 rounded-xl p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 font-mono text-sm">
                    {segment.Line} Line
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">
                    Dir: {segment.Direction}
                  </span>
                </div>
                <p className="text-slate-300">
                  <span className="text-slate-500">Affected Stations:</span> {segment.Stations}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px]">
                  {segment.FreePublicBus === "Y" && (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <Bus className="w-3.5 h-3.5" /> Free Regular Bus Available
                    </span>
                  )}
                  {segment.FreeMRTShuttle === "Y" && (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <TrainTrack className="w-3.5 h-3.5" /> Free Rail Shuttle Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MRT / LRT Line Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
            <TrainTrack className="w-4 h-4 text-emerald-400" />
            Singapore Rail Network Status
          </h3>
          <span className="text-xs text-slate-400">8 Lines Monitored</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {linesStatus.map((line) => (
            <div
              key={line.code}
              className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-9 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: line.color }}
                />
                <div>
                  <span className="font-bold text-slate-100 text-xs font-mono block">
                    {line.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {line.name}
                  </span>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  line.status === "Normal"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}
              >
                {line.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Official Train Broadcast Bulletins
        </h3>

        {messages.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No active broadcast announcements at this moment. All train lines running smoothly.
          </p>
        ) : (
          <div className="space-y-2.5">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-1"
              >
                <p className="font-medium text-slate-200 leading-relaxed">{msg.Content}</p>
                {msg.CreatedDate && (
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Broadcasted: {new Date(msg.CreatedDate).toLocaleString("en-SG")}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Train Service Alerts stream official alerts from LTA OData Service regarding rail operations across SMRT Trains and SBS Transit, alerting commuters of delays &gt; 10 minutes, station bypasses, or bridging bus provisions.
        </p>
      </div>
    </div>
  );
};
