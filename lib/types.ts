export type StoryItem = {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  imageUrl: string | null;
  publishedAt: string;
  category: string;
  citations: Array<{ label: string; url: string }>;
};

export type EventLogEntry = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type NotamItem = {
  id: string;
  title: string;
  body: string;
  sourceUrl: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
};

export type AircraftPoint = {
  id: string;
  callsign: string | null;
  latitude: number;
  longitude: number;
  altitude: number | null;
  heading: number | null;
  seenAt: string;
};

export type DashboardData = {
  generatedAt: string;
  stories: StoryItem[];
  eventLog: EventLogEntry[];
  notams: NotamItem[];
  aircraft: AircraftPoint[];
  sources: string[];
};
