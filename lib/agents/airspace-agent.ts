import { Agent, run } from "@openai/agents";
import { env } from "@/lib/env";
import { z } from "zod";

const storySummarySchema = z.array(
  z.object({
    sourceUrl: z.string().url(),
    summary: z.string(),
    category: z.string(),
    severity: z.enum(["low", "medium", "high"])
  })
);

const summarizer = new Agent({
  name: "Utah Airspace Summarizer",
  model: env.OPENAI_MODEL,
  instructions:
    "Summarize only source-provided facts. Keep each summary under 2 sentences. Classify category and severity for Utah airspace monitoring."
});

export type CandidateStory = {
  title: string;
  description: string;
  sourceUrl: string;
};

export async function summarizeStoriesWithAgent(
  stories: CandidateStory[]
): Promise<
  Array<{
    sourceUrl: string;
    summary: string;
    category: string;
    severity: "low" | "medium" | "high";
  }>
> {
  if (!env.OPENAI_API_KEY || stories.length === 0) {
    return stories.map((story) => ({
      sourceUrl: story.sourceUrl,
      summary: story.description || story.title,
      category: "General",
      severity: "low"
    }));
  }

  const input = JSON.stringify(stories);
  const prompt = `Create JSON array with keys sourceUrl, summary, category, severity. Only use this data: ${input}`;
  const result = (await run(summarizer, prompt)) as {
    finalOutput?: unknown;
    outputText?: string;
  };

  const raw =
    typeof result.finalOutput === "string"
      ? result.finalOutput
      : typeof result.outputText === "string"
        ? result.outputText
        : "[]";

  const parsed = safeJson(raw);
  const validated = storySummarySchema.safeParse(parsed);
  if (validated.success) {
    return validated.data;
  }

  return stories.map((story) => ({
    sourceUrl: story.sourceUrl,
    summary: story.description || story.title,
    category: "General",
    severity: "low"
  }));
}

function safeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
