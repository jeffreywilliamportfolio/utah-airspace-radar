import { NextRequest } from "next/server";

type Coordinates = {
  lat: number;
  lon: number;
};

type OverpassElement = {
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: Record<string, string>;
};

const LIVE_ATC_BASE = "https://www.liveatc.net/search/?icao=";

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get("query")?.trim() ?? "";

  if (!rawQuery) {
    return Response.json(
      { error: "Missing query. Enter a ZIP or city/state." },
      { status: 400 }
    );
  }

  const directCode = normalizeAirportCode(rawQuery);
  if (directCode) {
    return Response.json({
      url: `${LIVE_ATC_BASE}${encodeURIComponent(directCode)}`,
      airportCode: directCode
    });
  }

  const coordinates = await resolveCoordinates(rawQuery);
  if (!coordinates) {
    return Response.json({
      url: `${LIVE_ATC_BASE}${encodeURIComponent(rawQuery)}`,
      airportCode: null
    });
  }

  const nearestAirportCode = await findNearestAirportCode(coordinates);
  if (!nearestAirportCode) {
    return Response.json({
      url: `${LIVE_ATC_BASE}${encodeURIComponent(rawQuery)}`,
      airportCode: null
    });
  }

  return Response.json({
    url: `${LIVE_ATC_BASE}${encodeURIComponent(nearestAirportCode)}`,
    airportCode: nearestAirportCode
  });
}

function normalizeAirportCode(input: string) {
  const normalized = input.trim().toUpperCase();
  if (/^[A-Z]{4}$/.test(normalized)) {
    return normalized;
  }
  if (/^[A-Z]{3}$/.test(normalized)) {
    return normalized;
  }
  return null;
}

async function resolveCoordinates(query: string) {
  const zip = extractZipCode(query);
  if (zip) {
    const zipCoordinates = await resolveZipCodeCoordinates(zip);
    if (zipCoordinates) {
      return zipCoordinates;
    }
  }

  return resolvePlaceCoordinates(query);
}

function extractZipCode(input: string) {
  const match = input.match(/\b\d{5}(?:-\d{4})?\b/);
  return match ? match[0].slice(0, 5) : null;
}

async function resolveZipCodeCoordinates(zip: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      cache: "no-store"
    });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      places?: Array<{ latitude?: string; longitude?: string }>;
    };

    const place = payload.places?.[0];
    if (!place?.latitude || !place.longitude) {
      return null;
    }

    return {
      lat: Number(place.latitude),
      lon: Number(place.longitude)
    };
  } catch {
    return null;
  }
}

async function resolvePlaceCoordinates(query: string): Promise<Coordinates | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "us");

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "User-Agent": "UtahAirspaceMonitor/1.0",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const firstMatch = payload[0];
    if (!firstMatch?.lat || !firstMatch.lon) {
      return null;
    }

    return {
      lat: Number(firstMatch.lat),
      lon: Number(firstMatch.lon)
    };
  } catch {
    return null;
  }
}

async function findNearestAirportCode(coordinates: Coordinates) {
  try {
    const query = buildOverpassQuery(coordinates);
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "text/plain"
      },
      body: query
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      elements?: OverpassElement[];
    };

    const candidates =
      payload.elements
        ?.map((element) => {
          const lat = element.lat ?? element.center?.lat;
          const lon = element.lon ?? element.center?.lon;
          if (lat == null || lon == null) {
            return null;
          }
          const tags = element.tags ?? {};
          const icao = normalizeAirportCode(tags.icao ?? "");
          const iata = normalizeAirportCode(tags.iata ?? "");
          if (!icao && !iata) {
            return null;
          }
          return {
            code: icao ?? iata,
            hasIcao: Boolean(icao),
            distanceKm: haversineDistanceKm(coordinates.lat, coordinates.lon, lat, lon)
          };
        })
        .filter((candidate): candidate is { code: string; hasIcao: boolean; distanceKm: number } =>
          Boolean(candidate)
        ) ?? [];

    if (!candidates.length) {
      return null;
    }

    candidates.sort((first, second) => {
      if (first.hasIcao !== second.hasIcao) {
        return first.hasIcao ? -1 : 1;
      }
      return first.distanceKm - second.distanceKm;
    });

    return candidates[0].code;
  } catch {
    return null;
  }
}

function buildOverpassQuery(coordinates: Coordinates) {
  const { lat, lon } = coordinates;
  return `
[out:json][timeout:20];
(
  node["aeroway"="aerodrome"]["icao"](around:120000,${lat},${lon});
  way["aeroway"="aerodrome"]["icao"](around:120000,${lat},${lon});
  relation["aeroway"="aerodrome"]["icao"](around:120000,${lat},${lon});
  node["aeroway"="aerodrome"]["iata"](around:120000,${lat},${lon});
  way["aeroway"="aerodrome"]["iata"](around:120000,${lat},${lon});
  relation["aeroway"="aerodrome"]["iata"](around:120000,${lat},${lon});
);
out center tags;
`;
}

function haversineDistanceKm(startLat: number, startLon: number, endLat: number, endLon: number) {
  const radians = Math.PI / 180;
  const deltaLat = (endLat - startLat) * radians;
  const deltaLon = (endLon - startLon) * radians;
  const latitudeStart = startLat * radians;
  const latitudeEnd = endLat * radians;

  const sinLat = Math.sin(deltaLat / 2);
  const sinLon = Math.sin(deltaLon / 2);
  const a =
    sinLat * sinLat + Math.cos(latitudeStart) * Math.cos(latitudeEnd) * sinLon * sinLon;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}
