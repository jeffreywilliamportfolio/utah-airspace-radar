import { AircraftPoint } from "@/lib/types";

const SLC_BOUNDS = {
  lamin: 40.35,
  lomin: -112.45,
  lamax: 41.1,
  lomax: -111.3
};

type OpenSkyResponse = {
  states: Array<
    [
      string,
      string | null,
      string | null,
      number | null,
      number | null,
      number | null,
      number | null,
      number | null,
      boolean,
      number | null,
      number | null,
      number | null,
      number | null,
      number | null,
      number | null,
      boolean,
      number
    ]
  > | null;
};

export async function fetchSlcAircraft(): Promise<AircraftPoint[]> {
  const query = new URLSearchParams({
    lamin: String(SLC_BOUNDS.lamin),
    lomin: String(SLC_BOUNDS.lomin),
    lamax: String(SLC_BOUNDS.lamax),
    lomax: String(SLC_BOUNDS.lomax)
  });

  const response = await fetch(
    `https://opensky-network.org/api/states/all?${query.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return [];
  }

  const json = (await response.json()) as OpenSkyResponse;
  const states = json.states ?? [];

  return states.slice(0, 60).flatMap((state) => {
    const latitude = state[6];
    const longitude = state[5];
    if (!latitude || !longitude) {
      return [];
    }

    return [
      {
        id: state[0],
        callsign: state[1]?.trim() ?? null,
        latitude,
        longitude,
        altitude: state[7],
        heading: state[10],
        seenAt: new Date((state[3] ?? Date.now() / 1000) * 1000).toISOString()
      }
    ];
  });
}
