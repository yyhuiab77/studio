import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { incidents, assets, users } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import type { Incident } from "@/lib/types";
import { Building, User, Calendar, Tag, ShieldAlert } from "lucide-react";

export async function generateStaticParams() {
  return incidents.map((incident) => ({
    id: incident.id,
  }));
}

const statusVariantMap: Record<Incident["status"], "default" | "secondary" | "destructive" | "outline"> = {
  "Pending": "default",
  "In Progress": "outline",
  "Resolved": "secondary",
  "Unresolved": "destructive"
};

const priorityVariantMap: Record<Incident["priority"], "default" | "secondary" | "destructive"> = {
  "Low": "secondary",
  "Medium": "default",
  "High": "destructive",
  "Critical": "destructive",
};

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = incidents.find((i) => i.id === params.id);

  if (!incident) {
    notFound();
  }

  const asset = assets.find((a) => a.id === incident.assetId);
  const reporter = users.find((u) => u.id === incident.reportedBy);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title={`Incident: ${incident.id}`} />
      <main className="flex-1 grid gap-6 p-4 md:p-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{incident.title}</CardTitle>
              <CardDescription>
                Reported on {format(new Date(incident.reportedAt), 'PPP p')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none text-foreground">
                <p>{incident.description}</p>
              </div>
              {incident.resolutionNotes && (
                 <>
                  <Separator className="my-6" />
                  <h3 className="font-semibold text-lg mb-2">Resolution Notes</h3>
                  <div className="prose prose-invert max-w-none text-muted-foreground">
                    <p>{incident.resolutionNotes}</p>
                    <p className="text-sm">Resolved on {format(new Date(incident.resolvedAt!), 'PPP p')}</p>
                  </div>
                 </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center">
                  <ShieldAlert className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="font-medium mr-2">Status:</span>
                  <Badge variant={statusVariantMap[incident.status]}>{incident.status}</Badge>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="font-medium mr-2">Priority:</span>
                  <Badge variant={priorityVariantMap[incident.priority]}>{incident.priority}</Badge>
                </div>
                <Separator/>
                <div className="flex items-start">
                  <Building className="h-4 w-4 mr-3 mt-1 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Asset:</span>
                    <p>{asset?.name || 'N/A'} ({asset?.id})</p>
                    <p className="text-muted-foreground">{asset?.location}</p>
                  </div>
                </div>
                 <div className="flex items-center">
                  <User className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="font-medium mr-2">Reported By:</span>
                  <span>{reporter?.name || 'Unknown'}</span>
                </div>
                 <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="font-medium mr-2">Reported At:</span>
                  <span>{format(new Date(incident.reportedAt), 'PPp')}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
