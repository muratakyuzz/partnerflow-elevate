import { useParams, useNavigate } from "react-router-dom";
import { mockUsers } from "@/lib/mock-data";
import { FormSection } from "@/components/FormSection";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, User, Building2, Calendar } from "lucide-react";

export default function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back</button>
        <p className="text-muted-foreground">User not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate("/app/admin/users")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Users</button>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">{user.role}</Badge>
        <StatusBadge status={user.status} />
      </div>
      <FormSection title="User Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: "Email", value: user.email },
            { icon: User, label: "Role", value: user.role },
            { icon: Building2, label: "Partner", value: user.partnerName || "N/A" },
            { icon: Calendar, label: "Created", value: user.createdAt },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <f.icon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm font-medium text-foreground capitalize">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </FormSection>
    </div>
  );
}
