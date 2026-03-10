import { PageHeader } from "@/components/page-header";
import { IncidentTable } from "@/components/incidents/incident-table";
import { incidents, assets, users } from "@/lib/data";

export default function IncidentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Incidents" />
      <main className="flex-1 p-4 md:p-6">
        <IncidentTable incidents={incidents} assets={assets} users={users} />
      </main>
    </div>
  );
}
