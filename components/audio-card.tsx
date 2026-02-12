"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";

const quickLinks = [
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
  const [locationQuery, setLocationQuery] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = locationQuery.trim();
    if (!trimmedQuery) {
      setFeedback("Enter a ZIP code or city/state.");
      return;
    }

    setIsResolving(true);
    setFeedback("");

    const popup = window.open("about:blank", "_blank");
    const popupWasBlocked = popup === null;
    if (popup) {
      popup.opener = null;
      if (!popup.closed) {
        const popupDocument = popup.document;
        popupDocument.title = "Resolving LiveATC feed...";
        popupDocument.body.style.margin = "0";
        popupDocument.body.style.minHeight = "100vh";
        popupDocument.body.style.display = "grid";
        popupDocument.body.style.placeItems = "center";
        popupDocument.body.style.fontFamily = "system-ui, -apple-system, sans-serif";
        popupDocument.body.style.background = "#020617";
        popupDocument.body.style.color = "#e2e8f0";

        const message = popupDocument.createElement("p");
        message.textContent = `Resolving LiveATC feed for ${trimmedQuery}...`;
        message.style.margin = "0";
        message.style.padding = "16px";
        message.style.fontSize = "14px";
        popupDocument.body.replaceChildren(message);
      }
    }

    try {
      const response = await fetch(
        `/api/liveatc/resolve?query=${encodeURIComponent(trimmedQuery)}`,
        { cache: "no-store" }
      );

      const payload = (await response.json()) as {
        url?: string;
        airportCode?: string | null;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Unable to resolve LiveATC feed.");
      }

      if (popup && !popup.closed) {
        popup.location.replace(payload.url);
      } else if (popupWasBlocked) {
        window.location.href = payload.url;
      } else {
        setFeedback("Feed resolved, but the helper tab was closed before navigation. Try Open again.");
        return;
      }

      if (payload.airportCode) {
        setFeedback(`Opened LiveATC for ${payload.airportCode}.`);
      } else {
        setFeedback("Opened LiveATC search results.");
      }
    } catch {
      if (popup && !popup.closed) {
        popup.close();
      }
      setFeedback("Could not resolve that location. Try ZIP, city/state, or airport code.");
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <Card className="h-full p-4">
      <h2 className="mb-3 text-lg font-semibold">SLC Comms Access</h2>
      <p className="mb-3 text-xs text-soft">
        Enter a ZIP code or city/state to open a matching LiveATC feed search.
      </p>

      <form onSubmit={handleSubmit} className="mb-3 space-y-2">
        <label htmlFor="liveatc-location" className="text-xs text-soft">
          ZIP or city/state
        </label>
        <div className="flex gap-2">
          <input
            id="liveatc-location"
            type="text"
            value={locationQuery}
            onChange={(event) => setLocationQuery(event.target.value)}
            placeholder="84101 or Salt Lake City, UT"
            className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          />
          <button
            type="submit"
            disabled={isResolving}
            className="shrink-0 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {isResolving ? "Opening..." : "Open"}
          </button>
        </div>
      </form>

      {feedback ? <p className="mb-3 text-xs text-soft">{feedback}</p> : null}

      <ul className="space-y-2">
        {quickLinks.map((stream) => (
          <li key={stream.url}>
            <a
              href={stream.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-slate-700/70 bg-slate-900/70 p-2 text-sm text-accent hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {stream.label}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
