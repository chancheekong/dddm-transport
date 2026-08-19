import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get LTA AccountKey from environment or request headers
function getAccountKey(req: Request): string | undefined {
  const headerKey = req.headers["x-account-key"] as string | undefined;
  return headerKey || process.env.LTA_ACCOUNT_KEY || undefined;
}

// Fallback sample data in case no key is provided or offline demo is needed
const SAMPLE_BUS_83139 = {
  "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrivalv3/@Element",
  "BusStopCode": "83139",
  "BusStopDescription": "Opp Blk 228 / Eunos Stn Area",
  "RoadName": "Sims Ave East",
  "Services": [
    {
      "ServiceNo": "15",
      "Operator": "GAS",
      "NextBus": {
        "OriginCode": "75009",
        "DestinationCode": "75009",
        "EstimatedArrival": new Date(Date.now() + 2 * 60000).toISOString(),
        "Latitude": "1.3195",
        "Longitude": "103.9015",
        "VisitNumber": "1",
        "Load": "SEA", // Seats Available
        "Feature": "WAB", // Wheelchair Accessible
        "Type": "SD" // Single Deck
      },
      "NextBus2": {
        "OriginCode": "75009",
        "DestinationCode": "75009",
        "EstimatedArrival": new Date(Date.now() + 11 * 60000).toISOString(),
        "Latitude": "1.3250",
        "Longitude": "103.9120",
        "VisitNumber": "1",
        "Load": "SDA", // Standing Available
        "Feature": "WAB",
        "Type": "DD" // Double Deck
      },
      "NextBus3": {
        "OriginCode": "75009",
        "DestinationCode": "75009",
        "EstimatedArrival": new Date(Date.now() + 22 * 60000).toISOString(),
        "Latitude": "1.3320",
        "Longitude": "103.9240",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "SD"
      }
    },
    {
      "ServiceNo": "24",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "55009",
        "DestinationCode": "95009",
        "EstimatedArrival": new Date(Date.now() + 4 * 60000).toISOString(),
        "Latitude": "1.3178",
        "Longitude": "103.8964",
        "VisitNumber": "1",
        "Load": "SDA",
        "Feature": "WAB",
        "Type": "DD"
      },
      "NextBus2": {
        "OriginCode": "55009",
        "DestinationCode": "95009",
        "EstimatedArrival": new Date(Date.now() + 16 * 60000).toISOString(),
        "Latitude": "1.3110",
        "Longitude": "103.8820",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "SD"
      },
      "NextBus3": {
        "OriginCode": "55009",
        "DestinationCode": "95009",
        "EstimatedArrival": new Date(Date.now() + 28 * 60000).toISOString(),
        "Latitude": "",
        "Longitude": "",
        "VisitNumber": "1",
        "Load": "LSD", // Limited Standing
        "Feature": "WAB",
        "Type": "DD"
      }
    },
    {
      "ServiceNo": "28",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "52009",
        "DestinationCode": "75009",
        "EstimatedArrival": new Date(Date.now() + 1 * 60000).toISOString(),
        "Latitude": "1.3188",
        "Longitude": "103.8992",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "DD"
      },
      "NextBus2": {
        "OriginCode": "52009",
        "DestinationCode": "75009",
        "EstimatedArrival": new Date(Date.now() + 14 * 60000).toISOString(),
        "Latitude": "1.3280",
        "Longitude": "103.8910",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "SD"
      },
      "NextBus3": {
        "OriginCode": "52009",
        "DestinationCode": "75009",
        "EstimatedArrival": new Date(Date.now() + 26 * 60000).toISOString(),
        "Latitude": "",
        "Longitude": "",
        "VisitNumber": "1",
        "Load": "SDA",
        "Feature": "WAB",
        "Type": "DD"
      }
    },
    {
      "ServiceNo": "76",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "54009",
        "DestinationCode": "84009",
        "EstimatedArrival": new Date(Date.now() + 8 * 60000).toISOString(),
        "Latitude": "1.3210",
        "Longitude": "103.9040",
        "VisitNumber": "1",
        "Load": "LSD",
        "Feature": "WAB",
        "Type": "DD"
      },
      "NextBus2": {
        "OriginCode": "54009",
        "DestinationCode": "84009",
        "EstimatedArrival": new Date(Date.now() + 19 * 60000).toISOString(),
        "Latitude": "1.3350",
        "Longitude": "103.9210",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "SD"
      },
      "NextBus3": {
        "OriginCode": "54009",
        "DestinationCode": "84009",
        "EstimatedArrival": new Date(Date.now() + 31 * 60000).toISOString(),
        "Latitude": "",
        "Longitude": "",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "SD"
      }
    },
    {
      "ServiceNo": "154",
      "Operator": "SBST",
      "NextBus": {
        "OriginCode": "22009",
        "DestinationCode": "83009",
        "EstimatedArrival": new Date(Date.now() + 6 * 60000).toISOString(),
        "Latitude": "1.3190",
        "Longitude": "103.8970",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "DD"
      },
      "NextBus2": {
        "OriginCode": "22009",
        "DestinationCode": "83009",
        "EstimatedArrival": new Date(Date.now() + 17 * 60000).toISOString(),
        "Latitude": "1.3295",
        "Longitude": "103.8825",
        "VisitNumber": "1",
        "Load": "SDA",
        "Feature": "WAB",
        "Type": "SD"
      },
      "NextBus3": {
        "OriginCode": "22009",
        "DestinationCode": "83009",
        "EstimatedArrival": new Date(Date.now() + 29 * 60000).toISOString(),
        "Latitude": "",
        "Longitude": "",
        "VisitNumber": "1",
        "Load": "SEA",
        "Feature": "WAB",
        "Type": "DD"
      }
    }
  ]
};

const SAMPLE_CARPARKS = [
  { CarParkID: "1", Area: "Marina", Development: "Suntec City", Location: "1.2933 103.8572", AvailableLots: 428, LotType: "C", Agency: "LTA" },
  { CarParkID: "2", Area: "Marina", Development: "Marina Square", Location: "1.2912 103.8560", AvailableLots: 195, LotType: "C", Agency: "LTA" },
  { CarParkID: "3", Area: "Marina", Development: "Millenia Walk", Location: "1.2925 103.8596", AvailableLots: 88, LotType: "C", Agency: "LTA" },
  { CarParkID: "4", Area: "Orchard", Development: "ION Orchard", Location: "1.3040 103.8320", AvailableLots: 312, LotType: "C", Agency: "LTA" },
  { CarParkID: "5", Area: "Orchard", Development: "Ngee Ann City (Takashimaya)", Location: "1.3023 103.8354", AvailableLots: 240, LotType: "C", Agency: "LTA" },
  { CarParkID: "6", Area: "Orchard", Development: "Paragon Shopping Centre", Location: "1.3039 103.8358", AvailableLots: 14, LotType: "C", Agency: "LTA" },
  { CarParkID: "7", Area: "Orchard", Development: "313@Somerset", Location: "1.3011 103.8385", AvailableLots: 62, LotType: "C", Agency: "LTA" },
  { CarParkID: "8", Area: "HarbourFront", Development: "VivoCity", Location: "1.2644 103.8223", AvailableLots: 560, LotType: "C", Agency: "LTA" },
  { CarParkID: "9", Area: "Jurong", Development: "Jurong Point", Location: "1.3402 103.7063", AvailableLots: 182, LotType: "C", Agency: "LTA" },
  { CarParkID: "10", Area: "Jurong", Development: "Jem / Westgate", Location: "1.3331 103.7436", AvailableLots: 94, LotType: "C", Agency: "LTA" },
  { CarParkID: "11", Area: "Tampines", Development: "Tampines Mall / Century Square", Location: "1.3532 103.9452", AvailableLots: 110, LotType: "C", Agency: "LTA" },
  { CarParkID: "12", Area: "Woodlands", Development: "Causeway Point", Location: "1.4361 103.7865", AvailableLots: 77, LotType: "C", Agency: "LTA" },
  { CarParkID: "13", Area: "Bugis", Development: "Bugis Junction", Location: "1.2995 103.8554", AvailableLots: 145, LotType: "C", Agency: "LTA" },
  { CarParkID: "14", Area: "Changi", Development: "Jewel Changi Airport (T1/T2)", Location: "1.3602 103.9898", AvailableLots: 890, LotType: "C", Agency: "LTA" },
  { CarParkID: "15", Area: "Marina", Development: "Marina Bay Sands", Location: "1.2834 103.8607", AvailableLots: 620, LotType: "C", Agency: "LTA" },
  { CarParkID: "16", Area: "HDB-Bedok", Development: "Blk 214-220 Bedok North St 1", Location: "1.3255 103.9312", AvailableLots: 45, LotType: "C", Agency: "HDB" },
  { CarParkID: "17", Area: "HDB-Eunos", Development: "Blk 831 Sims Avenue", Location: "1.3190 103.9010", AvailableLots: 28, LotType: "C", Agency: "HDB" },
  { CarParkID: "18", Area: "URA-Chinatown", Development: "Chinatown Complex Car Park", Location: "1.2825 103.8432", AvailableLots: 36, LotType: "C", Agency: "URA" },
  { CarParkID: "19", Area: "URA-Tanjong Pagar", Development: "Amoy Street / Telok Ayer", Location: "1.2798 103.8475", AvailableLots: 12, LotType: "C", Agency: "URA" },
  { CarParkID: "20", Area: "Sentosa", Development: "Resorts World Sentosa", Location: "1.2568 103.8202", AvailableLots: 780, LotType: "C", Agency: "LTA" }
];

const SAMPLE_TRAFFIC_INCIDENTS = [
  {
    Type: "Accident",
    Latitude: 1.3412,
    Longitude: 103.8465,
    Message: "(19/8)14:48 Accident on PIE (towards Changi Airport) before Toa Payoh Ext Exit 15A. Lane 1 blocked. Heavy traffic."
  },
  {
    Type: "Road Works",
    Latitude: 1.3082,
    Longitude: 103.8540,
    Message: "(19/8)13:30 Road Works on CTE (towards AYE) before Cairnhill Road Exit. Lane 4 closed until 18:00."
  },
  {
    Type: "Vehicle Breakdown",
    Latitude: 1.2855,
    Longitude: 103.8342,
    Message: "(19/8)14:15 Vehicle breakdown on AYE (towards Tuas) after Keppel Rd. Avoid lane 3."
  },
  {
    Type: "Heavy Traffic",
    Latitude: 1.4420,
    Longitude: 103.7710,
    Message: "(19/8)14:50 Heavy traffic on BKE (towards Woodlands Checkpoint) from Mandai Rd Exit. Expect 25 mins delay."
  },
  {
    Type: "Road Block",
    Latitude: 1.2965,
    Longitude: 103.8520,
    Message: "(19/8)12:00 Road maintenance on Bras Basah Road. Pass with care."
  },
  {
    Type: "Accident",
    Latitude: 1.3325,
    Longitude: 103.7480,
    Message: "(19/8)14:05 Minor collision on AYE (towards City) after Jurong Town Hall Exit. Cleared to shoulder."
  }
];

const SAMPLE_TRAIN_ALERTS = {
  Status: 1, // 1 = Normal, 2 = Disrupted
  AffectedSegments: [],
  Message: [
    {
      Content: "Train services across North-South, East-West, Circle, North-East, Downtown, and Thomson-East Coast Lines are operating normally.",
      CreatedDate: new Date().toISOString()
    }
  ],
  LinesStatus: [
    { code: "NSL", name: "North-South Line", status: "Normal", color: "#D42E12" },
    { code: "EWL", name: "East-West Line", status: "Normal", color: "#009530" },
    { code: "NEL", name: "North-East Line", status: "Normal", color: "#9B1780" },
    { code: "CCL", name: "Circle Line", status: "Normal", color: "#FA9E0D" },
    { code: "DTL", name: "Downtown Line", status: "Normal", color: "#005EC4" },
    { code: "TEL", name: "Thomson-East Coast Line", status: "Normal", color: "#9D5B25" },
    { code: "BPLRT", name: "Bukit Panjang LRT", status: "Normal", color: "#748577" },
    { code: "SKPGLRT", name: "Sengkang-Punggol LRT", status: "Normal", color: "#748577" }
  ]
};

// API Route: Configuration & Key Check
app.get("/api/lta/status", (req: Request, res: Response) => {
  const key = getAccountKey(req);
  res.json({
    hasKey: !!key,
    keyPreview: key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : null,
    source: key ? "LTA DataMall (Live Key Detected)" : "Demo Mode (Add LTA AccountKey to activate live data)"
  });
});

// API Route: Bus Arrival v3
// https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
app.get("/api/lta/bus-arrival", async (req: Request, res: Response) => {
  const busStopCode = (req.query.busStopCode as string) || "83139";
  const serviceNo = req.query.serviceNo as string | undefined;
  const key = getAccountKey(req);

  if (!key) {
    // Return sample data
    let services = SAMPLE_BUS_83139.Services;
    if (serviceNo) {
      services = services.filter(s => s.ServiceNo.toLowerCase() === serviceNo.toLowerCase());
    }
    return res.json({
      ...SAMPLE_BUS_83139,
      BusStopCode: busStopCode,
      Services: services,
      _source: "demo",
      _message: "Showing simulated data. Add LTA_ACCOUNT_KEY in .env or settings for live LTA DataMall v3 response."
    });
  }

  try {
    let url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(url, {
      headers: {
        AccountKey: key,
        accept: "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LTA Bus Arrival API error: ${response.status} - ${errorText}`);
      // Fallback gracefully with error indicator
      return res.status(200).json({
        ...SAMPLE_BUS_83139,
        BusStopCode: busStopCode,
        _source: "demo_fallback",
        _error: `LTA API responded with status ${response.status}. Showing fallback demo data. Check your AccountKey.`
      });
    }

    const data = await response.json();
    return res.json({
      ...data,
      _source: "live"
    });
  } catch (err: any) {
    console.error("Error fetching Bus Arrival:", err);
    return res.status(200).json({
      ...SAMPLE_BUS_83139,
      BusStopCode: busStopCode,
      _source: "demo_fallback",
      _error: err.message || "Failed to reach LTA DataMall."
    });
  }
});

// API Route: Car Park Availability v2
// https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
app.get("/api/lta/car-park-availability", async (req: Request, res: Response) => {
  const key = getAccountKey(req);
  const skip = req.query.$skip ? Number(req.query.$skip) : 0;

  if (!key) {
    return res.json({
      "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/$metadata#CarParkAvailabilityv2",
      value: SAMPLE_CARPARKS,
      _source: "demo",
      _message: "Showing simulated carparks. Add LTA_ACCOUNT_KEY for live Singapore carpark availability."
    });
  }

  try {
    const url = `https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2${skip ? `?$skip=${skip}` : ""}`;
    const response = await fetch(url, {
      headers: {
        AccountKey: key,
        accept: "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LTA CarPark API error: ${response.status} - ${errorText}`);
      return res.status(200).json({
        value: SAMPLE_CARPARKS,
        _source: "demo_fallback",
        _error: `LTA API error ${response.status}. Showing fallback carparks.`
      });
    }

    const data = await response.json();
    return res.json({
      ...data,
      _source: "live"
    });
  } catch (err: any) {
    console.error("Error fetching CarPark Availability:", err);
    return res.status(200).json({
      value: SAMPLE_CARPARKS,
      _source: "demo_fallback",
      _error: err.message
    });
  }
});

// API Route: Traffic Incidents
// https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents
app.get("/api/lta/traffic-incidents", async (req: Request, res: Response) => {
  const key = getAccountKey(req);

  if (!key) {
    return res.json({
      "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/$metadata#TrafficIncidents",
      value: SAMPLE_TRAFFIC_INCIDENTS,
      _source: "demo",
      _message: "Showing simulated traffic incidents. Add LTA_ACCOUNT_KEY for live real-time expressway incidents."
    });
  }

  try {
    const url = "https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents";
    const response = await fetch(url, {
      headers: {
        AccountKey: key,
        accept: "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LTA TrafficIncidents API error: ${response.status} - ${errorText}`);
      return res.status(200).json({
        value: SAMPLE_TRAFFIC_INCIDENTS,
        _source: "demo_fallback",
        _error: `LTA API error ${response.status}. Showing fallback traffic incidents.`
      });
    }

    const data = await response.json();
    return res.json({
      ...data,
      _source: "live"
    });
  } catch (err: any) {
    console.error("Error fetching Traffic Incidents:", err);
    return res.status(200).json({
      value: SAMPLE_TRAFFIC_INCIDENTS,
      _source: "demo_fallback",
      _error: err.message
    });
  }
});

// API Route: Train Service Alerts
// https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts
app.get("/api/lta/train-alerts", async (req: Request, res: Response) => {
  const key = getAccountKey(req);

  if (!key) {
    return res.json({
      "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/$metadata#TrainServiceAlerts",
      value: SAMPLE_TRAIN_ALERTS,
      _source: "demo",
      _message: "Showing simulated train status. Add LTA_ACCOUNT_KEY for live MRT/LRT disruption alerts."
    });
  }

  try {
    const url = "https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts";
    const response = await fetch(url, {
      headers: {
        AccountKey: key,
        accept: "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`LTA TrainServiceAlerts API error: ${response.status} - ${errorText}`);
      return res.status(200).json({
        value: SAMPLE_TRAIN_ALERTS,
        _source: "demo_fallback",
        _error: `LTA API error ${response.status}. Showing fallback train status.`
      });
    }

    const data = await response.json();
    // Normalize data if value is structured differently
    let normalized = data.value || data;
    if (typeof normalized === "object" && !normalized.LinesStatus) {
      normalized = {
        ...normalized,
        LinesStatus: SAMPLE_TRAIN_ALERTS.LinesStatus
      };
    }
    return res.json({
      value: normalized,
      _source: "live"
    });
  } catch (err: any) {
    console.error("Error fetching Train Service Alerts:", err);
    return res.status(200).json({
      value: SAMPLE_TRAIN_ALERTS,
      _source: "demo_fallback",
      _error: err.message
    });
  }
});

// Start server and mount Vite
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Singapore Transport Live Server running on port ${PORT}`);
  });
}

start();
