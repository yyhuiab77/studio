import { PageHeader } from "@/components/page-header";
import { assets } from "@/lib/data";
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
import type { Asset } from "@/lib/types";
import { format } from "date-fns";

const statusVariantMap: Record<Asset["status"], "default" | "secondary" | "destructive" | "outline"> = {
  Operational: "secondary",
  Warning: "default",
  Fault: "destructive",
};


export default function AssetsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Asset Inventory" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead className="text-right">Uptime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[asset.status]}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(asset.nextMaintenance), "PPP")}</TableCell>
                    <TableCell className="text-right">{asset.uptime}%</TableCell>
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
