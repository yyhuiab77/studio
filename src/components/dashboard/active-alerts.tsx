"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import type { Incident, Asset } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const priorityVariantMap: Record<Incident["priority"], "default" | "secondary" | "destructive"> = {
  "Low": "secondary",
  "Medium": "default",
  "High": "destructive",
  "Critical": "destructive",
};

export function ActiveAlerts({
  incidents,
  assets,
}: {
  incidents: Incident[];
  assets: Asset[];
}) {
  const router = useRouter();
  const activeIncidents = incidents
    .filter((i) => ["Pending", "In Progress"].includes(i.status) && ["High", "Critical"].includes(i.priority))
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5);

  const getAssetName = (assetId: string) => {
    return assets.find((a) => a.id === assetId)?.name || assetId;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            High-priority incidents requiring immediate attention.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1" variant="outline">
          <Link href="/incidents">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident</TableHead>
              <TableHead className="hidden sm:table-cell">Asset</TableHead>
              <TableHead className="hidden md:table-cell">Priority</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeIncidents.length > 0 ? (
              activeIncidents.map((incident) => (
                <TableRow key={incident.id} className="cursor-pointer" onClick={() => router.push(`/incidents/${incident.id}`)}>
                  <TableCell>
                    <div className="font-medium">{incident.title}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {incident.id}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{getAssetName(incident.assetId)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={priorityVariantMap[incident.priority]}>
                      {incident.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDistanceToNow(new Date(incident.reportedAt), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No critical alerts. All systems normal.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
