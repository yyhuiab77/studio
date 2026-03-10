'use server';
/**
 * @fileOverview Provides AI-driven summaries and probable cause analysis for complex lift incidents.
 *
 * - summarizeIncident - A function that handles the AI summarization and probable cause analysis process.
 * - AiIncidentSummarizationInput - The input type for the summarizeIncident function.
 * - AiIncidentSummarizationOutput - The return type for the summarizeIncident function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiIncidentSummarizationInputSchema = z.object({
  incidentReport: z
    .string()
    .describe(
      'The full incident report detailing the event, symptoms, and any initial observations.'
    ),
});
export type AiIncidentSummarizationInput = z.infer<
  typeof AiIncidentSummarizationInputSchema
>;

const AiIncidentSummarizationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the incident report.'),
  probableCause: z
    .string()
    .describe(
      'An AI-driven analysis of the most probable cause(s) of the incident based on the report.'
    ),
});
export type AiIncidentSummarizationOutput = z.infer<
  typeof AiIncidentSummarizationOutputSchema
>;

export async function summarizeIncident(
  input: AiIncidentSummarizationInput
): Promise<AiIncidentSummarizationOutput> {
  return aiIncidentSummarizationFlow(input);
}

const aiIncidentSummarizationPrompt = ai.definePrompt({
  name: 'aiIncidentSummarizationPrompt',
  input: {schema: AiIncidentSummarizationInputSchema},
  output: {schema: AiIncidentSummarizationOutputSchema},
  prompt: `You are an expert in vertical transport (lift/elevator) incident analysis. Your task is to review an incident report, provide a concise summary, and identify the most probable cause(s) of the incident.

Incident Report:
{{{incidentReport}}}

Please provide your response in the following JSON format:
{{jsonSchema output.schema}}`,
});

const aiIncidentSummarizationFlow = ai.defineFlow(
  {
    name: 'aiIncidentSummarizationFlow',
    inputSchema: AiIncidentSummarizationInputSchema,
    outputSchema: AiIncidentSummarizationOutputSchema,
  },
  async (input) => {
    const {output} = await aiIncidentSummarizationPrompt(input);
    return output!;
  }
);
