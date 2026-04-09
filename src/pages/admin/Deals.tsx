import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDeals, type Deal, type DealStatus } from "@/lib/mock-data";

const columns: Column<Deal>[] = [
  { key: "id", header: "ID", render: (d) => <span className="font-mono text-xs text-muted-foreground">{d.id}</span>, className: "w-24" },
  { key: "title", header: "Deal", render: (d) => (
    <div>
      <p className="font-medium text-foreground">{d.title}</p>
      <p className="text-xs text-muted-foreground">{d.companyName}</p>
    </div>
  )},
  { key: "partner", header: "Partner", render: (d) => <span className="text-sm">{d.partnerName}</span> },
  { key: "value", header: "Value", render: (d) => <span className="text-sm font-medium">${d.value.toLocaleString()}</span> },
  { key: "status", header: "Status", render: (d) => <StatusBadge status={d.status} /> },
  { key: "date", header: "Updated", render: (d) => <span className="text-xs text-muted-foreground">{d.updatedAt}</span> },
];

const allStatuses: ("ALL" | DealStatus)[] = ["ALL", "OPEN", "WON", "LOST"];

export default function AdminDeals() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = filter === "ALL" ? mockDeals : mockDeals.filter((d) => d.status === filter);
  const tabs = allStatuses.map((s) => ({
    label: s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase(),
    value: s,
    count: s === "ALL" ? mockDeals.length : mockDeals.filter((d) => d.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        subtitle="Manage deal pipeline and track outcomes"
        action={{ label: "New Deal", onClick: () => {}, icon: null }}
      />
      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search deals..."
        searchKey={(d) => `${d.title} ${d.companyName} ${d.partnerName}`}
        onRowClick={(d) => navigate(`/app/admin/deals/${d.id}`)}
        filterTabs={tabs}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
