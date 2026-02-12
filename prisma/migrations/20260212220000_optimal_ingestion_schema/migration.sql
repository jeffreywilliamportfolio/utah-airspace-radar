-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('INGESTION', 'ERROR', 'SYSTEM');

-- CreateEnum
CREATE TYPE "IngestionStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateTable
CREATE TABLE "IngestionRun" (
    "id" TEXT NOT NULL,
    "status" "IngestionStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,
    "metadata" JSONB,
    "storyCount" INTEGER NOT NULL DEFAULT 0,
    "notamCount" INTEGER NOT NULL DEFAULT 0,
    "aircraftCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "IngestionRun_pkey" PRIMARY KEY ("id")
);

-- AddColumn
ALTER TABLE "Story" ADD COLUMN "ingestionRunId" TEXT;
ALTER TABLE "EventLogItem" ADD COLUMN "ingestionRunId" TEXT;
ALTER TABLE "NotamItem" ADD COLUMN "ingestionRunId" TEXT;
ALTER TABLE "AircraftSnapshot" ADD COLUMN "ingestionRunId" TEXT;
ALTER TABLE "DigestSnapshot" ADD COLUMN "ingestionRunId" TEXT;

-- Alter EventLogItem.type TEXT -> ENUM with safe mapping
ALTER TABLE "EventLogItem" ADD COLUMN "type_new" "EventType";
UPDATE "EventLogItem"
SET "type_new" = CASE
  WHEN "type" = 'INGESTION' THEN 'INGESTION'::"EventType"
  WHEN "type" = 'ERROR' THEN 'ERROR'::"EventType"
  ELSE 'SYSTEM'::"EventType"
END;
ALTER TABLE "EventLogItem" ALTER COLUMN "type_new" SET NOT NULL;
ALTER TABLE "EventLogItem" DROP COLUMN "type";
ALTER TABLE "EventLogItem" RENAME COLUMN "type_new" TO "type";

-- Alter Incident date+time -> occurredAt
ALTER TABLE "Incident" ADD COLUMN "occurredAt" TIMESTAMP(3);
UPDATE "Incident"
SET "occurredAt" = ("date"::timestamp + "time");
ALTER TABLE "Incident" ALTER COLUMN "occurredAt" SET NOT NULL;
ALTER TABLE "Incident" DROP COLUMN "date";
ALTER TABLE "Incident" DROP COLUMN "time";

-- CreateIndex
CREATE INDEX "Story_publishedAt_idx" ON "Story"("publishedAt");
CREATE INDEX "Story_createdAt_idx" ON "Story"("createdAt");
CREATE INDEX "Story_ingestionRunId_idx" ON "Story"("ingestionRunId");

CREATE INDEX "Citation_storyId_idx" ON "Citation"("storyId");
CREATE UNIQUE INDEX "Citation_storyId_url_key" ON "Citation"("storyId", "url");

CREATE INDEX "EventLogItem_createdAt_idx" ON "EventLogItem"("createdAt");
CREATE INDEX "EventLogItem_type_createdAt_idx" ON "EventLogItem"("type", "createdAt");
CREATE INDEX "EventLogItem_ingestionRunId_idx" ON "EventLogItem"("ingestionRunId");

CREATE INDEX "NotamItem_sourceUrl_idx" ON "NotamItem"("sourceUrl");
CREATE INDEX "NotamItem_createdAt_idx" ON "NotamItem"("createdAt");
CREATE INDEX "NotamItem_ingestionRunId_idx" ON "NotamItem"("ingestionRunId");

CREATE INDEX "AircraftSnapshot_seenAt_idx" ON "AircraftSnapshot"("seenAt");
CREATE INDEX "AircraftSnapshot_latitude_longitude_idx" ON "AircraftSnapshot"("latitude", "longitude");
CREATE INDEX "AircraftSnapshot_source_seenAt_idx" ON "AircraftSnapshot"("source", "seenAt");
CREATE INDEX "AircraftSnapshot_ingestionRunId_idx" ON "AircraftSnapshot"("ingestionRunId");

CREATE INDEX "DigestSnapshot_generatedAt_idx" ON "DigestSnapshot"("generatedAt");
CREATE INDEX "DigestSnapshot_ingestionRunId_idx" ON "DigestSnapshot"("ingestionRunId");

CREATE INDEX "IngestionRun_status_startedAt_idx" ON "IngestionRun"("status", "startedAt");
CREATE INDEX "IngestionRun_startedAt_idx" ON "IngestionRun"("startedAt");

CREATE INDEX "Incident_occurredAt_idx" ON "Incident"("occurredAt");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_ingestionRunId_fkey" FOREIGN KEY ("ingestionRunId") REFERENCES "IngestionRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EventLogItem" ADD CONSTRAINT "EventLogItem_ingestionRunId_fkey" FOREIGN KEY ("ingestionRunId") REFERENCES "IngestionRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "NotamItem" ADD CONSTRAINT "NotamItem_ingestionRunId_fkey" FOREIGN KEY ("ingestionRunId") REFERENCES "IngestionRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AircraftSnapshot" ADD CONSTRAINT "AircraftSnapshot_ingestionRunId_fkey" FOREIGN KEY ("ingestionRunId") REFERENCES "IngestionRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DigestSnapshot" ADD CONSTRAINT "DigestSnapshot_ingestionRunId_fkey" FOREIGN KEY ("ingestionRunId") REFERENCES "IngestionRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
