import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { mockUsers, type User } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const columns: Column<User>[] = [
  { key: "name", header: "User", render: (u) => (
    <div>
      <p className="font-medium text-foreground">{u.name}</p>
      <p className="text-xs text-muted-foreground">{u.email}</p>
    </div>
  )},
  { key: "role", header: "Role", render: (u) => (
    <Badge variant={u.role === "admin" ? "default" : "secondary"} className="capitalize text-xs">{u.role}</Badge>
  )},
  { key: "partner", header: "Partner", render: (u) => <span className="text-sm">{u.partnerName || "—"}</span> },
  { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
  { key: "date", header: "Created", render: (u) => <span className="text-xs text-muted-foreground">{u.createdAt}</span> },
];

export default function AdminUsers() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage platform users and access"
        action={{ label: "Add User", onClick: () => navigate("/app/admin/users/new"), icon: <Plus className="h-4 w-4" /> }}
      />
      <DataTable
        data={mockUsers}
        columns={columns}
        searchPlaceholder="Search users..."
        searchKey={(u) => `${u.name} ${u.email} ${u.partnerName || ""}`}
        onRowClick={(u) => navigate(`/app/admin/users/${u.id}`)}
      />
    </div>
  );
}
