import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { mockAdminStats, mockLeads, mockDeals } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { Building2, Zap, Handshake, FolderOpen, TrendingUp, DollarSign } from "lucide-react";

const stats = [
  { label: "Active Partners", value: mockAdminStats.activePartners, total: mockAdminStats.totalPartners, icon: Building2, color: "text-primary" },
  { label: "Pending Leads", value: mockAdminStats.submittedLeads, total: mockAdminStats.totalLeads, icon: Zap, color: "text-warning" },
  { label: "Open Deals", value: mockAdminStats.openDeals, total: mockAdminStats.totalDeals, icon: Handshake, color: "text-info" },
  { label: "Pipeline Value", value: `$${(mockAdminStats.pipelineValue / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-success" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your partner ecosystem performance" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              {s.total !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">of {s.total} total</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Leads</h3>
              <button onClick={() => navigate("/app/admin/leads")} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {mockLeads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/app/admin/leads/${lead.id}`)}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.title}</p>
                    <p className="text-xs text-muted-foreground">{lead.partnerName} · {lead.companyName}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Deals</h3>
              <button onClick={() => navigate("/app/admin/deals")} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {mockDeals.slice(0, 4).map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => navigate(`/app/admin/deals/${deal.id}`)}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{deal.title}</p>
                    <p className="text-xs text-muted-foreground">{deal.partnerName} · ${deal.value.toLocaleString()}</p>
                  </div>
                  <StatusBadge status={deal.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
