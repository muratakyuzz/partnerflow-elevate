import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { mockPartnerStats, mockLeads, mockDeals } from "@/lib/mock-data";
import { Zap, Handshake, FolderOpen, DollarSign } from "lucide-react";

export default function PartnerDashboard() {
  const partnerId = "p1"; // Mock: current partner
  const stats = mockPartnerStats(partnerId);
  const navigate = useNavigate();
  const leads = mockLeads.filter((l) => l.partnerId === partnerId);
  const deals = mockDeals.filter((d) => d.partnerId === partnerId);

  const kpis = [
    { label: "My Leads", value: stats.totalLeads, icon: Zap, color: "text-warning" },
    { label: "Approved", value: stats.approvedLeads, icon: Zap, color: "text-success" },
    { label: "My Deals", value: stats.totalDeals, icon: Handshake, color: "text-info" },
    { label: "Won Revenue", value: `$${(stats.wonValue / 1000).toFixed(0)}k`, icon: DollarSign, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Your partner portal overview" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Leads</h3>
              <button onClick={() => navigate("/app/partner/leads")} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {leads.slice(0, 4).map((l) => (
                <div key={l.id} onClick={() => navigate(`/app/partner/leads/${l.id}`)} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{l.title}</p>
                    <p className="text-xs text-muted-foreground">{l.companyName}</p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">My Deals</h3>
              <button onClick={() => navigate("/app/partner/deals")} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {deals.slice(0, 4).map((d) => (
                <div key={d.id} onClick={() => navigate(`/app/partner/deals/${d.id}`)} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{d.title}</p>
                    <p className="text-xs text-muted-foreground">${d.value.toLocaleString()}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
