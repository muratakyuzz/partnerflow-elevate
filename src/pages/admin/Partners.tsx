import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { mockPartners, type Partner } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const columns: Column<Partner>[] = [
  { key: "name", header: "Partner", render: (p) => (
    <div>
      <p className="font-medium text-foreground">{p.name}</p>
      <p className="text-xs text-muted-foreground">{p.contactEmail}</p>
    </div>
  )},
  { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
  { key: "leads", header: "Leads", render: (p) => <span className="text-sm">{p.leadsCount}</span> },
  { key: "deals", header: "Deals", render: (p) => <span className="text-sm">{p.dealsCount}</span> },
  { key: "date", header: "Joined", render: (p) => <span className="text-xs text-muted-foreground">{p.createdAt}</span> },
];

export default function AdminPartners() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partners"
        subtitle="Manage your partner organizations"
        action={{ label: "Add Partner", onClick: () => navigate("/app/admin/partners/new"), icon: <Plus className="h-4 w-4" /> }}
      />
      <DataTable
        data={mockPartners}
        columns={columns}
        searchPlaceholder="Search partners..."
        searchKey={(p) => `${p.name} ${p.contactEmail}`}
        onRowClick={(p) => navigate(`/app/admin/partners/${p.id}`)}
      />
    </div>
  );
}
