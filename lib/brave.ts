import { env } from "@/lib/env";

export type BraveSearchResult = {
  title: string;
  url: string;
  description: string;
  pageAge?: string;
  thumbnail?: { src: string };
};

type BraveApiResponse = {
  web?: {
    results?: BraveSearchResult[];
  };
};

export async function braveWebSearch(params: {
  query: string;
  count?: number;
  freshnessDays?: number;
}): Promise<BraveSearchResult[]> {
  if (!env.BRAVE_API_KEY) {
    return [];
  }

  const count = params.count ?? 10;
  const freshness = params.freshnessDays
    ? `&freshness=pd${params.freshnessDays}`
    : "";
  const query = encodeURIComponent(params.query);
  const url = `https://api.search.brave.com/res/v1/web/search?q=${query}&count=${count}${freshness}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": env.BRAVE_API_KEY
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Brave API error: ${response.status}`);
  }

  const data = (await response.json()) as BraveApiResponse;
  return data.web?.results ?? [];
}
