/**
 * Calculate human-readable minutes remaining from ISO date string
 */
export function getMinutesUntil(isoDateStr?: string): {
  text: string;
  minutes: number;
  isArriving: boolean;
  isDeparted: boolean;
} {
  if (!isoDateStr) {
    return { text: "N/A", minutes: -1, isArriving: false, isDeparted: true };
  }

  const arrivalTime = new Date(isoDateStr).getTime();
  const now = Date.now();
  const diffMs = arrivalTime - now;
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 0 && diffMs > -90000) {
    return { text: "Arr", minutes: 0, isArriving: true, isDeparted: false };
  }
  if (diffMs <= -90000) {
    return { text: "Departed", minutes: diffMinutes, isArriving: false, isDeparted: true };
  }
  if (diffMinutes === 1) {
    return { text: "1 min", minutes: 1, isArriving: false, isDeparted: false };
  }
  return { text: `${diffMinutes} mins`, minutes: diffMinutes, isArriving: false, isDeparted: false };
}

/**
 * Format Bus Load into color, label and description
 */
export function getLoadDetails(loadCode?: string): {
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
} {
  switch (loadCode) {
    case "SEA":
      return {
        label: "Seats Available",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "Green (SEA)"
      };
    case "SDA":
      return {
        label: "Standing Available",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "Amber (SDA)"
      };
    case "LSD":
      return {
        label: "Limited Standing",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        text: "Red (LSD)"
      };
    default:
      return {
        label: "Unknown Load",
        color: "text-slate-400",
        bg: "bg-slate-800",
        border: "border-slate-700",
        text: loadCode || "N/A"
      };
  }
}

/**
 * Format Bus Type
 */
export function getBusTypeDetails(typeCode?: string): { label: string; short: string } {
  switch (typeCode) {
    case "SD":
      return { label: "Single Deck", short: "SD" };
    case "DD":
      return { label: "Double Deck", short: "DD" };
    case "BD":
      return { label: "Bendy Bus", short: "BD" };
    default:
      return { label: typeCode || "Bus", short: typeCode || "SD" };
  }
}

/**
 * Extract expressway code from traffic incident message
 */
export function extractExpressway(message: string): string | null {
  const match = message.match(/\b(PIE|CTE|AYE|KPE|ECP|SLE|BKE|TPE|MCE)\b/i);
  return match ? match[1].toUpperCase() : null;
}

/**
 * Popular Singapore Bus Stops for Quick Selection
 */
export const POPULAR_BUS_STOPS = [
  { code: "83139", name: "Sims Ave East (Blk 228)", area: "Eunos / Kembangan" },
  { code: "09048", name: "Orchard Stn / Tangs", area: "Orchard" },
  { code: "75009", name: "Tampines Int", area: "Tampines" },
  { code: "01012", name: "Hotel Grand Pacific / Bugis", area: "Bugis / Bras Basah" },
  { code: "03223", name: "Hub Synergy Point / Anson Rd", area: "Tanjong Pagar" },
  { code: "28009", name: "Jurong East Int", area: "Jurong East" },
  { code: "03511", name: "Marina Bay Sands Hotel", area: "Marina Bay" }
];
