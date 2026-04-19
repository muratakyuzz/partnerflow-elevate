import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockLeads, type Lead, type LeadStatus } from "@/lib/mock-data";
import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

const columns: Column<Lead>[] = [
  { key: "id", header: "ID", render: (l) => <span className="font-mono text-xs text-muted-foreground">{l.id}</span>, className: "w-24" },
  { key: "title", header: "Lead", render: (l) => (
    <div>
      <p className="font-medium text-foreground">{l.title}</p>
      <p className="text-xs text-muted-foreground">{l.companyName}</p>
    </div>
  )},
  { key: "partner", header: "Partner", render: (l) => <span className="text-sm">{l.partnerName}</span> },
  { key: "value", header: "Value", render: (l) => <span className="text-sm font-medium">${l.estimatedValue.toLocaleString()}</span> },
  { key: "status", header: "Status", render: (l) => <StatusBadge status={l.status} /> },
  { key: "date", header: "Updated", render: (l) => <span className="text-xs text-muted-foreground">{l.updatedAt}</span> },
];

const allStatuses: ("ALL" | LeadStatus)[] = ["ALL", "DRAFT", "SUBMITTED", "APPROVED", "REJECTED"];

export default function AdminLeads() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = filter === "ALL" ? mockLeads : mockLeads.filter((l) => l.status === filter);
  const tabs = allStatuses.map((s) => ({
    label: s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase(),
    value: s,
    count: s === "ALL" ? mockLeads.length : mockLeads.filter((l) => l.status === s).length,
  }));

  const handleExport = () => {
    const rows = filtered.map((l) => ({
      ID: l.id,
      Lead: l.title,
      Company: l.companyName,
      Partner: l.partnerName,
      Contact: l.contactName,
      "Estimated Value": l.estimatedValue,
      Status: l.status,
      Updated: l.updatedAt,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, `leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        subtitle="Review and manage partner-submitted leads"
        action={{
          label: "Export to Excel",
          onClick: handleExport,
          icon: <FileSpreadsheet className="h-4 w-4" />,
        }}
      />
      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search leads..."
        searchKey={(l) => `${l.title} ${l.companyName} ${l.partnerName} ${l.contactName}`}
        onRowClick={(l) => navigate(`/app/admin/leads/${l.id}`)}
        filterTabs={tabs}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}
