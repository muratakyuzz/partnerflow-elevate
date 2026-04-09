import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDeals, type Deal } from "@/lib/mock-data";

const partnerId = "p1";

const columns: Column<Deal>[] = [
  { key: "id", header: "ID", render: (d) => <span className="font-mono text-xs text-muted-foreground">{d.id}</span>, className: "w-24" },
  { key: "title", header: "Deal", render: (d) => (
    <div>
      <p className="font-medium text-foreground">{d.title}</p>
      <p className="text-xs text-muted-foreground">{d.companyName}</p>
    </div>
  )},
  { key: "value", header: "Value", render: (d) => <span className="text-sm font-medium">${d.value.toLocaleString()}</span> },
  { key: "status", header: "Status", render: (d) => <StatusBadge status={d.status} /> },
  { key: "date", header: "Updated", render: (d) => <span className="text-xs text-muted-foreground">{d.updatedAt}</span> },
];

export default function PartnerDeals() {
  const navigate = useNavigate();
  const myDeals = mockDeals.filter((d) => d.partnerId === partnerId);

  return (
    <div className="space-y-6">
      <PageHeader title="My Deals" subtitle="View your deals (read-only)" />
      <DataTable
        data={myDeals}
        columns={columns}
        searchPlaceholder="Search deals..."
        searchKey={(d) => `${d.title} ${d.companyName}`}
        onRowClick={(d) => navigate(`/app/partner/deals/${d.id}`)}
      />
    </div>
  );
}
