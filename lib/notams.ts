import { braveWebSearch } from "@/lib/brave";

export type ParsedNotam = {
  title: string;
  body: string;
  sourceUrl: string;
};

export async function fetchBraveNotams(): Promise<ParsedNotam[]> {
  const queries = [
    "KSLC NOTAM current",
    "Salt Lake City airport NOTAM in effect",
    "Utah military airspace advisory NOTAM"
  ];

  const batches = await Promise.all(
    queries.map((query) => braveWebSearch({ query, count: 6, freshnessDays: 14 }))
  );

  const unique = new Map<string, ParsedNotam>();
  for (const result of batches.flat()) {
    if (!result.url || unique.has(result.url)) {
      continue;
    }

    unique.set(result.url, {
      title: result.title,
      body: result.description,
      sourceUrl: result.url
    });
  }

  return Array.from(unique.values()).slice(0, 20);
}
