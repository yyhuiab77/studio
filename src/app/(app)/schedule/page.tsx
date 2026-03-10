import { PageHeader } from "@/components/page-header";
import { assets, maintenanceSchedule } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Maintenance } from "@/lib/types";
import { format } from "date-fns";

const statusVariantMap: Record<Maintenance["status"], "default" | "secondary" | "destructive" | "outline"> = {
  "Scheduled": "default",
  "In Progress": "outline",
  "Completed": "secondary",
};


export default function SchedulePage() {
  const scheduleWithAsset = maintenanceSchedule.map(m => {
    const asset = assets.find(a => a.id === m.assetId);
    return { ...m, assetName: asset?.name, assetLocation: asset?.location };
  }).sort((a,b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Maintenance Schedule" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Maintenance Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleWithAsset.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{format(new Date(item.scheduledDate), "PPP")}</TableCell>
                    <TableCell>
                      <div>{item.assetName} ({item.assetId})</div>
                      <div className="text-sm text-muted-foreground">{item.assetLocation}</div>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[item.status]}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
