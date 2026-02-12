import { env } from "@/lib/env";
import { AircraftPoint } from "@/lib/types";

const SLC_BOUNDS = {
  bl_lat: 40.35,
  bl_lng: -112.45,
  tr_lat: 41.1,
  tr_lng: -111.3
};

function getRapidApiKey() {
  return env.RAPID_API_KEY ?? env.RAPIDAPI_KEY;
}

export function isFlightRadar8Configured() {
  return Boolean(getRapidApiKey());
}

export async function fetchSlcAircraftFromFlightRadar8(): Promise<AircraftPoint[]> {
  const rapidApiKey = getRapidApiKey();
  if (!rapidApiKey) {
    return [];
  }

  const query = new URLSearchParams({
    bl_lat: String(SLC_BOUNDS.bl_lat),
    bl_lng: String(SLC_BOUNDS.bl_lng),
    tr_lat: String(SLC_BOUNDS.tr_lat),
    tr_lng: String(SLC_BOUNDS.tr_lng)
  });

  try {
    const response = await fetch(
      `https://${env.FLIGHT_RADAR8_HOST}/flights/boundary-list?${query.toString()}`,
      {
        cache: "no-store",
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": env.FLIGHT_RADAR8_HOST,
          accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as unknown;
    return normalizePayload(payload).slice(0, 60);
  } catch {
    return [];
  }
}

function normalizePayload(payload: unknown): AircraftPoint[] {
  const candidates = collectCandidates(payload);
  const seen = new Set<string>();
  const aircraft: AircraftPoint[] = [];

  for (const [index, candidate] of candidates.entries()) {
    const normalized = normalizeCandidate(candidate, index);
    if (!normalized) {
      continue;
    }

    const dedupeKey = `${normalized.id}|${normalized.latitude}|${normalized.longitude}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);
    aircraft.push(normalized);
  }

  return aircraft;
}

function collectCandidates(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const root = asRecord(payload);
  if (!root) {
    return [];
  }

  const priorityKeys = [
    "data",
    "result",
    "results",
    "response",
    "payload",
    "aircraft",
    "flights",
    "items",
    "list"
  ];

  for (const key of priorityKeys) {
    const value = root[key];
    if (Array.isArray(value)) {
      return value;
    }
    if (asRecord(value)) {
      return Object.values(value as Record<string, unknown>);
    }
  }

  return Object.values(root);
}

function normalizeCandidate(candidate: unknown, index: number): AircraftPoint | null {
  if (Array.isArray(candidate)) {
    return normalizeArrayCandidate(candidate, index);
  }

  const record = asRecord(candidate);
  if (!record) {
    return null;
  }

  const latitude = pickNumber(record, [
    "lat",
    "latitude",
    "position_lat",
    "aircraft_lat"
  ]);
  const longitude = pickNumber(record, [
    "lon",
    "lng",
    "longitude",
    "position_lng",
    "aircraft_lng"
  ]);

  if (latitude === null || longitude === null) {
    return null;
  }

  const callsign = pickString(record, [
    "callsign",
    "flight",
    "flight_number",
    "number",
    "identification",
    "iata",
    "icao"
  ]);
  const identifier = pickString(record, [
    "id",
    "hex",
    "icao24",
    "registration",
    "aircraft_id"
  ]);

  return {
    id: identifier ?? callsign ?? `fr8-${index}`,
    callsign: callsign?.trim() || null,
    latitude,
    longitude,
    altitude: pickNumber(record, [
      "altitude",
      "alt",
      "altitude_ft",
      "alt_baro",
      "baro_altitude"
    ]),
    heading: pickNumber(record, ["heading", "track", "hdg", "direction"]),
    seenAt: pickSeenAt(record)
  };
}

function normalizeArrayCandidate(candidate: unknown[], index: number): AircraftPoint | null {
  if (candidate.length < 4) {
    return null;
  }

  const latitude = toNumber(candidate[2]);
  const longitude = toNumber(candidate[3]);

  if (latitude === null || longitude === null) {
    return null;
  }

  const callsignValue = candidate[1];
  const callsign =
    typeof callsignValue === "string" && callsignValue.trim().length > 0
      ? callsignValue.trim()
      : null;
  const idValue = candidate[0];
  const id =
    typeof idValue === "string" && idValue.trim().length > 0
      ? idValue.trim()
      : callsign ?? `fr8-${index}`;

  return {
    id,
    callsign,
    latitude,
    longitude,
    altitude: toNumber(candidate[4]),
    heading: toNumber(candidate[5]),
    seenAt: timestampToIso(candidate[6])
  };
}

function pickNumber(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value !== null) {
      return value;
    }
  }
  return null;
}

function pickString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return null;
}

function pickSeenAt(record: Record<string, unknown>) {
  const rawValue =
    record.seenAt ??
    record.lastSeen ??
    record.seen ??
    record.updatedAt ??
    record.timestamp ??
    record.time;
  return timestampToIso(rawValue);
}

function timestampToIso(value: unknown) {
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  }

  const numeric = toNumber(value);
  if (numeric === null) {
    return new Date().toISOString();
  }

  const millis = numeric > 1e12 ? numeric : numeric * 1000;
  return new Date(millis).toISOString();
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const converted = Number(value);
    if (Number.isFinite(converted)) {
      return converted;
    }
  }
  return null;
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}
