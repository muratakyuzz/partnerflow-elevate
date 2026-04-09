import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { mockLeads, type Lead, type LeadStatus } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const partnerId = "p1";

const columns: Column<Lead>[] = [
  { key: "id", header: "ID", render: (l) => <span className="font-mono text-xs text-muted-foreground">{l.id}</span>, className: "w-24" },
  { key: "title", header: "Lead", render: (l) => (
    <div>
      <p className="font-medium text-foreground">{l.title}</p>
      <p className="text-xs text-muted-foreground">{l.companyName}</p>
    </div>
  )},
  { key: "value", header: "Value", render: (l) => <span className="text-sm font-medium">${l.estimatedValue.toLocaleString()}</span> },
  { key: "status", header: "Status", render: (l) => <StatusBadge status={l.status} /> },
  { key: "date", header: "Updated", render: (l) => <span className="text-xs text-muted-foreground">{l.updatedAt}</span> },
];

export default function PartnerLeads() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("ALL");
  const myLeads = mockLeads.filter((l) => l.partnerId === partnerId);
  const filtered = filter === "ALL" ? myLeads : myLeads.filter((l) => l.status === filter);

  const tabs = (["ALL", "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] as const).map((s) => ({
    label: s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase(),
    value: s,
    count: s === "ALL" ? myLeads.length : myLeads.filter((l) => l.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Leads"
        subtitle="Track and manage your submitted leads"
        action={{ label: "New Lead", onClick: () => navigate("/app/partner/leads/new"), icon: <Plus className="h-4 w-4" /> }}
      />
      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search leads..."
        searchKey={(l) => `${l.title} ${l.companyName}`}
        onRowClick={(l) => navigate(`/app/partner/leads/${l.id}`)}
        filterTabs={tabs}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
