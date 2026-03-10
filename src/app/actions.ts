"use server";

import { summarizeIncident } from "@/ai/flows/ai-incident-summarization-flow";
import type { AiIncidentSummarizationOutput } from "@/ai/flows/ai-incident-summarization-flow";

type ActionResult = {
  success: boolean;
  data?: AiIncidentSummarizationOutput;
  error?: string;
};

export async function getIncidentSummary(
  incidentReport: string
): Promise<ActionResult> {
  if (!incidentReport) {
    return { success: false, error: "Incident report cannot be empty." };
  }

  try {
    const result = await summarizeIncident({ incidentReport });
    return { success: true, data: result };
  } catch (error) {
    console.error("AI summarization failed:", error);
    return {
      success: false,
      error: "An error occurred while generating the AI summary.",
    };
  }
}
