Plan
Build a Vercel-first, mobile-responsive Utah airspace dashboard that uses the OpenAI Agents SDK (TS) with Brave Search as the main tool for source-grounded summaries. Sequence is: lock data/legal constraints first, then ingestion + storage, then dual-mode UI, then deployment/ops so you avoid rework.

Scope
In: Responsive web app, sourced news cards, event log, KSLC-area aircraft map, SLC comms access, SLC NOTAM panel, one-click single-PDF archive.
Out: Rebroadcasting third-party ATC audio, operational/safety-critical guidance, non-public data collection.
Action items
[ ] Lock stack and scaffold: Next.js + TypeScript + Tailwind + shadcn/ui + react-grid-layout (desktop) with shared components for stacked mobile mode.
[ ] Implement server agent layer on Vercel Functions (Node runtime) with @openai/agents + Zod and GPT-5-series primary model (Agents quickstart, Tools guide, Streaming guide).
[ ] Build Brave tool adapters (web + news search, freshness filtering, citation capture) and enforce source URL per story (Brave API docs, Brave pricing).
[ ] Create ingestion pipeline: search → dedupe/cluster → summarize → extract citations → tag Utah/SLC relevance → store event entries.
[ ] Add persistence for dashboard/log (Postgres) and generate “save all as one PDF” snapshots from current dataset.
[ ] Build UI in two modes: draggable react-grid-layout desktop and simplified non-grid mobile feed using same data modules.
[ ] Integrate KSLC aircraft map using OpenSky state vectors with geofence filters (confirm usage terms fit your use) (OpenSky API).
[ ] Add SLC radio module as deep-link access only (no embedded/rebroadcast stream) due LiveATC restrictions (LiveATC, KSLC feed index).
[ ] Run NOTAM integration spike early: evaluate FAA Data/API access and SWIM path, then choose production source (FAA Data Portal, SWIM access, SWIFT support note).
[ ] Deploy + automate: Vercel Cron ingestion schedule, observability, error alerting, and source-health checks (Vercel Cron Jobs, Cron usage limits).

Open questions
Do you want FAA/SWIM-first for NOTAMs (more official, slower setup) or temporary third-party NOTAM feed first?
Are you launching on Vercel Hobby or Pro (this directly changes allowable refresh frequency)?
For the two unconventional modules, should I spec Anomaly Radar and What Changed Since Last Sweep first?

third party NOTAMs we can just get from a brave apio call

hobby

Sure

Perfect — great choices. Here’s the final execution order based on:Didnt

NOTAMs via Brave search aggregation
Vercel Hobby
Extra modules: Anomaly Radar + What Changed
Scaffold core stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + react-grid-layout + Prisma/Postgres.
Set env + secrets: OPENAI_API_KEY, BRAVE_API_KEY, DB URL, and feature flags for map/audio/NOTAM modules.
Build agent backend first (Vercel server routes): OpenAI Agents SDK with tools for Brave search, citation extraction, dedupe, and summarization.
Define data contracts: Story, Citation, EventLogItem, NotamItem, AircraftSnapshot, DigestSnapshot.
Implement ingestion pipeline: scheduled fetch → cluster/dedupe → summarize → store sources/citations → append event log.
NOTAM module (Brave-based): query FAA/public NOTAM pages, parse/normalize, label confidence, always show source links.
Map module: KSLC-centered aircraft map + nearby traffic panel (with refresh intervals compatible with Hobby limits).
ATC module: SLC comms as outbound links/player embeds only where terms allow (no rebroadcasting backend).
Desktop UI: react-grid-layout dashboard (cards: top stories, NOTAMs, map, comms, event log, anomaly radar, change feed).
Mobile UI: non-grid stacked feed using same data store/components, simplified controls, fast load.
PDF archive flow: “Save current state as single PDF” server action (stories + citations + NOTAMs + event log snapshot).
Deploy/ops on Hobby: Vercel deploy, cron cadence tuning, error logging, retry/backoff, stale-data indicators.