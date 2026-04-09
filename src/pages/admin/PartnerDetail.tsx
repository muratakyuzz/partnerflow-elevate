import { useParams, useNavigate } from "react-router-dom";
import { mockPartners, mockLeads, mockDeals } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/FormSection";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Mail, Phone, Globe, Zap, Handshake } from "lucide-react";

export default function AdminPartnerDetail() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const partner = mockPartners.find((p) => p.id === partnerId);

  if (!partner) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-muted-foreground">Partner not found.</p>
      </div>
    );
  }

  const leads = mockLeads.filter((l) => l.partnerId === partner.id);
  const deals = mockDeals.filter((d) => d.partnerId === partner.id);

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/app/admin/partners")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Partners
      </button>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{partner.name}</h1>
        <StatusBadge status={partner.status} />
      </div>

      <FormSection title="Organization Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: "Email", value: partner.contactEmail },
            { icon: Phone, label: "Phone", value: partner.contactPhone },
            { icon: Globe, label: "Website", value: partner.website },
            { icon: Building2, label: "Joined", value: partner.createdAt },
          ].map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <f.icon className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm font-medium text-foreground">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-warning" />
              <h3 className="font-semibold text-sm">Leads ({leads.length})</h3>
            </div>
            {leads.slice(0, 3).map((l) => (
              <div key={l.id} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-foreground">{l.title}</span>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Handshake className="h-4 w-4 text-info" />
              <h3 className="font-semibold text-sm">Deals ({deals.length})</h3>
            </div>
            {deals.slice(0, 3).map((d) => (
              <div key={d.id} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-foreground">{d.title}</span>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
