"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getIncidentSummary } from "@/app/actions";
import { Loader2, Sparkles } from "lucide-react";
import type { Incident } from "@/lib/types";
import type { AiIncidentSummarizationOutput } from "@/ai/flows/ai-incident-summarization-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "../ui/separator";

export function AiAnalysis({ incident }: { incident: Incident }) {
  const [report, setReport] = useState(incident.description);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiIncidentSummarizationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const actionResult = await getIncidentSummary(report);
    if (actionResult.success && actionResult.data) {
      setResult(actionResult.data);
    } else {
      setError(actionResult.error || "An unknown error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Analysis</CardTitle>
        <CardDescription>
          Generate a summary and probable cause analysis for this incident. You can edit the report before submitting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter incident details..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          rows={6}
        />
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && (
            <div className="space-y-4 rounded-md border p-4">
                <div>
                    <h3 className="font-semibold text-lg mb-2">AI Summary</h3>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                </div>
                <Separator />
                <div>
                    <h3 className="font-semibold text-lg mb-2">Probable Cause</h3>
                    <p className="text-sm text-muted-foreground">{result.probableCause}</p>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Analyzing...' : 'Generate Analysis'}
        </Button>
      </CardFooter>
    </Card>
  );
}
