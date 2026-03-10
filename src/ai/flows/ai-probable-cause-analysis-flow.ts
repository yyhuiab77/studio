'use server';
/**
 * @fileOverview Provides an AI-driven probable cause analysis for lift incidents.
 *
 * - aiProbableCauseAnalysis - A function that suggests a probable cause based on incident details.
 * - IncidentDetailsInput - The input type for the aiProbableCauseAnalysis function.
 * - ProbableCauseAnalysisOutput - The return type for the aiProbableCauseAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IncidentDetailsInputSchema = z.object({
  incidentDescription: z.string().describe('A detailed description of the current incident.'),
  symptoms: z.array(z.string()).describe('A list of observed symptoms or error messages related to the incident.'),
  assetType: z.string().describe('The type of asset involved in the incident (e.g., "Elevator", "Escalator", "Dumbwaiter").'),
  assetId: z.string().describe('The unique identifier of the affected asset.'),
  lastMaintenanceDate: z.string().optional().describe('Optional: The date of the last maintenance performed on the asset (YYYY-MM-DD format).'),
  historicalIncidents: z.array(
    z.object({
      description: z.string().describe('Description of a past similar incident.'),
      cause: z.string().describe('The known cause of the past similar incident.'),
    })
  ).optional().describe('Optional: A list of similar past incidents with their descriptions and known causes.'),
});
export type IncidentDetailsInput = z.infer<typeof IncidentDetailsInputSchema>;

const ProbableCauseAnalysisOutputSchema = z.object({
  summary: z.string().describe('An AI-driven summary of the incident, highlighting key details and potential issues.'),
  probableCause: z.string().describe('The most likely technical cause of the incident.'),
  suggestedActions: z.array(z.string()).describe('A list of suggested immediate actions or diagnostic steps.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0 to 1, where 1 is highly confident) indicating the AI\'s certainty in the probable cause.'),
});
export type ProbableCauseAnalysisOutput = z.infer<typeof ProbableCauseAnalysisOutputSchema>;

export async function aiProbableCauseAnalysis(input: IncidentDetailsInput): Promise<ProbableCauseAnalysisOutput> {
  return aiProbableCauseAnalysisFlow(input);
}

const aiProbableCauseAnalysisPrompt = ai.definePrompt({
  name: 'aiProbableCauseAnalysisPrompt',
  input: { schema: IncidentDetailsInputSchema },
  output: { schema: ProbableCauseAnalysisOutputSchema },
  prompt: `You are an expert lift incident analyst for a vertical transport company. Your task is to analyze incident details, provide a concise summary, identify the most probable technical cause, suggest immediate diagnostic and resolution actions, and provide a confidence score for your diagnosis. Consider all provided information, especially historical incidents, to detect patterns.

Current Incident Details:
Description: {{{incidentDescription}}}
Symptoms:
{{#each symptoms}}- {{{this}}}
{{/each}}
Asset Type: {{{assetType}}}
Asset ID: {{{assetId}}}
{{#if lastMaintenanceDate}}Last Maintenance Date: {{{lastMaintenanceDate}}}{{/if}}

{{#if historicalIncidents.length}}
Historical Incidents (for context and pattern recognition):
{{#each historicalIncidents}}
- Description: {{{this.description}}}
  Known Cause: {{{this.cause}}}
{{/each}}
{{/if}}

Based on the information provided, analyze the incident thoroughly. Identify the single most likely root cause. Outline practical, immediate steps a technician should take for diagnosis and resolution. Finally, assign a confidence score to your probable cause determination. Ensure the output strictly adheres to the JSON schema, with the confidenceScore being a number between 0 and 1.`,
});

const aiProbableCauseAnalysisFlow = ai.defineFlow(
  {
    name: 'aiProbableCauseAnalysisFlow',
    inputSchema: IncidentDetailsInputSchema,
    outputSchema: ProbableCauseAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await aiProbableCauseAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to generate probable cause analysis.');
    }
    return output;
  }
);
