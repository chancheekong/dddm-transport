export interface NextBusInfo {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: "SEA" | "SDA" | "LSD" | string; // Seats Available, Standing Available, Limited Standing
  Feature: "WAB" | string; // Wheelchair Accessible
  Type: "SD" | "DD" | "BD" | string; // Single Deck, Double Deck, Bendy
}

export interface BusService {
  ServiceNo: string;
  Operator: string;
  NextBus: NextBusInfo;
  NextBus2?: NextBusInfo;
  NextBus3?: NextBusInfo;
}

export interface BusArrivalResponse {
  "odata.metadata"?: string;
  BusStopCode: string;
  BusStopDescription?: string;
  RoadName?: string;
  Services: BusService[];
  _source?: "live" | "demo" | "demo_fallback";
  _error?: string;
  _message?: string;
}

export interface CarPark {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: "C" | "H" | "Y" | string; // C = Cars, H = Heavy Vehicles, Y = Motorcycles
  Agency: "LTA" | "HDB" | "URA" | string;
}

export interface CarParkResponse {
  "odata.metadata"?: string;
  value: CarPark[];
  _source?: "live" | "demo" | "demo_fallback";
  _error?: string;
  _message?: string;
}

export interface TrafficIncident {
  Type: "Accident" | "Road Works" | "Vehicle Breakdown" | "Heavy Traffic" | "Road Block" | "Diversion" | "Obstacle" | "Tree Fall" | string;
  Latitude: number;
  Longitude: number;
  Message: string;
}

export interface TrafficIncidentsResponse {
  "odata.metadata"?: string;
  value: TrafficIncident[];
  _source?: "live" | "demo" | "demo_fallback";
  _error?: string;
  _message?: string;
}

export interface AffectedSegment {
  Line: string;
  Direction: string;
  Stations: string;
  FreePublicBus: string;
  FreeMRTShuttle: string;
  MRTShuttleDirection: string;
}

export interface TrainAlertMessage {
  Content: string;
  CreatedDate: string;
}

export interface LineStatusItem {
  code: string;
  name: string;
  status: "Normal" | "Delayed" | "Disrupted";
  color: string;
}

export interface TrainServiceAlertsData {
  Status: number; // 1 = Normal, 2 = Disrupted
  AffectedSegments?: AffectedSegment[];
  Message?: TrainAlertMessage[];
  LinesStatus?: LineStatusItem[];
}

export interface TrainAlertsResponse {
  "odata.metadata"?: string;
  value: TrainServiceAlertsData;
  _source?: "live" | "demo" | "demo_fallback";
  _error?: string;
  _message?: string;
}

export interface LtaApiStatus {
  hasKey: boolean;
  keyPreview: string | null;
  source: string;
}

export type ActiveTab = "overview" | "bus" | "carpark" | "traffic" | "train";
