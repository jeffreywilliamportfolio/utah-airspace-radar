import { Card } from "@/components/ui/card";

const streams = [
  {
    label: "KSLC Tower / Approach Feed Search",
    url: "https://www.liveatc.net/search/?icao=KSLC"
  },
  {
    label: "Salt Lake Center Public Feed Search",
    url: "https://www.liveatc.net/search/?icao=ZLC"
  },
  {
    label: "KSLC Airport Operations",
    url: "https://slcairport.com/"
  }
];

export function AudioCard() {
  return (
    <Card className="h-full p-4">
      <h2 className="mb-3 text-lg font-semibold">SLC Comms Access</h2>
      <p className="mb-3 text-xs text-soft">
        Opens public feed providers directly to stay within platform terms.
      </p>
      <ul className="space-y-2">
        {streams.map((stream) => (
          <li key={stream.url}>
            <a
              href={stream.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-slate-700/70 bg-slate-900/70 p-2 text-sm text-accent hover:border-slate-500"
            >
              {stream.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
