# Utah Airspace Monitor

Utah Airspace Monitor is a Vercel-hosted, non-monetized airspace intelligence dashboard focused on Utah and KSLC (Salt Lake City International Airport).  
It aggregates public reporting, produces source-cited summaries, tracks aviation signals, and presents both desktop and mobile browser experiences.

## Goal

Provide a near-realtime operational awareness surface for Utah airspace-related reporting by combining:

- source-grounded aviation news/event summaries,
- currently reported SLC/Utah NOTAM signals,
- live aircraft situational context around KSLC,
- and an auditable event history with exportable snapshots.

## Purpose

- Reduce time-to-awareness for public airspace updates tied to Utah.
- Preserve source transparency with direct citation links.
- Offer a fast, visual dashboard for desktop operators and a simplified mobile mode for on-the-go monitoring.
- Maintain a durable daily/point-in-time record via single-PDF export.

## Core Features

- **Agentic summarization pipeline**
  - Uses OpenAI Agents SDK (`@openai/agents`) with a GPT-5-series model configured by env.
  - Summaries are generated from retrieved sources and stored alongside citations.

- **Brave-powered source ingestion**
  - Brave Search API is the main retrieval tool for stories and third-party NOTAM discovery.
  - Dedupe and clustering happen in the ingestion pipeline before persistence.

- **SLC / Utah NOTAM signals**
  - NOTAM-like records are gathered from Brave-indexed public pages.
  - Each NOTAM card includes the originating source URL.

- **Live aircraft context (KSLC area)**
  - OpenSky state vectors provide map/contextual traffic around KSLC.
  - Aircraft snapshots are persisted for dashboard display.

- **SLC public comms access**
  - UI links out to public feed providers/resources for ATC comms.
  - No backend rebroadcasting is performed.

- **Dual-mode responsive UI**
  - Desktop: draggable/resizable `react-grid-layout` workspace.
  - Mobile: simplified stacked layout sharing the same data model.

- **Unconventional utility modules**
  - `Anomaly Radar`: lightweight trend scoring for unusual signal patterns.
  - `What Changed Since Last Sweep`: quick deltas from latest ingestion cycle.

- **Audit and archive output**
  - Event log of ingestion actions and system updates.
  - One-click single-PDF snapshot export of stories/NOTAMs/logs.

## Product Scope

### In Scope

- Utah airspace and related public reporting.
- Publicly discussable restricted airspace developments if publicly reported.
- Browser + mobile-browser optimized dashboard experience.
- Source-cited summarization and event logging.

### Out of Scope

- Safety-critical flight decision support.
- Collection of non-public restricted airspace data.
- Unauthorized stream rebroadcasting.

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS, `react-grid-layout`
- **Backend/API:** Next.js Route Handlers (Node runtime on Vercel)
- **Agent Layer:** OpenAI Agents SDK (`@openai/agents`)
- **Primary Retrieval Tool:** Brave Search API
- **Aviation Context:** OpenSky API
- **Persistence:** Prisma + PostgreSQL
- **Document Output:** PDFKit
- **Scheduling:** Vercel Cron

## System Overview

1. Scheduled/manual ingestion fetches candidate records from Brave.
2. Records are deduplicated and passed into the OpenAI agent for concise summaries.
3. Stories, citations, NOTAM signals, aircraft snapshots, and event logs are persisted.
4. Dashboard APIs serve unified data to desktop/mobile layouts.
5. PDF export endpoint generates a point-in-time report.

## API Surface (Current)

- `GET /api/dashboard` — aggregate dashboard payload.
- `POST /api/ingest` — on-demand ingestion (secret-protected).
- `GET /api/cron/ingest` — cron ingestion endpoint (secret-protected).
- `GET /api/export/pdf` — generate/download single snapshot PDF.

## Quick Start

1. Copy env template:
   - `cp .env.example .env.local`
2. Install dependencies:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Apply schema to your database:
   - `npm run db:push`
5. Run locally:
   - `npm run dev`

## Required Environment Variables

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default: `gpt-5-mini`)
- `BRAVE_API_KEY`
- `DATABASE_URL`
- `CRON_SECRET`
- `INGEST_SECRET`
- `NEXT_PUBLIC_REFRESH_INTERVAL_MS`

## Repository Layout

- `app/page.tsx` — root dashboard page
- `components/app-shell.tsx` — responsive view-mode orchestration
- `components/desktop-grid.tsx` — desktop grid implementation
- `components/mobile-stack.tsx` — mobile stacked implementation
- `lib/ingestion/pipeline.ts` — ingestion orchestration
- `lib/agents/airspace-agent.ts` — OpenAI Agents summarizer
- `lib/notams.ts` — Brave-based NOTAM signal fetch
- `lib/map/opensky.ts` — KSLC aircraft query adapter
- `app/api/export/pdf/route.ts` — PDF snapshot generation
- `prisma/schema.prisma` — relational data model

## Notes

- This application is an informational monitoring tool and should not be used as an authoritative operational control source.
- Production hardening should include source allowlists, confidence scoring, abuse/rate-limit controls, and legal/terms review for all third-party integrations.
