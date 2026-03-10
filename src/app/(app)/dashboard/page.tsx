import { PageHeader } from "@/components/page-header";
import { assets, incidents, users } from "@/lib/data";
import { SystemStatus } from "@/components/dashboard/system-status";
import { AssetStatusChart } from "@/components/dashboard/asset-status-chart";
import { ActiveAlerts } from "@/components/dashboard/active-alerts";
import { PersonnelStatus } from "@/components/dashboard/personnel-status";

export default function DashboardPage() {
  const totalAssets = assets.length;
  const overallUptime = (assets.reduce((acc, asset) => acc + asset.uptime, 0) / totalAssets).toFixed(1);
  const activeIncidents = incidents.filter(i => i.status === 'Pending' || i.status === 'In Progress').length;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Command Center" />
      <main className="flex-1 grid gap-6 p-4 md:p-6 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-3 xl:col-span-4">
          <SystemStatus
            totalAssets={totalAssets}
            overallUptime={parseFloat(overallUptime)}
            activeIncidents={activeIncidents}
          />
        </div>
        
        <div className="lg:col-span-2 xl:col-span-2">
          <ActiveAlerts incidents={incidents} assets={assets} />
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <AssetStatusChart assets={assets} />
        </div>
        
        <div className="lg:col-span-3 xl:col-span-1">
          <PersonnelStatus users={users} />
        </div>
      </main>
    </div>
  );
}
