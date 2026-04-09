import { useParams, useNavigate } from "react-router-dom";
import { mockDeals } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/FormSection";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, DollarSign, Building2, FileText, Calendar } from "lucide-react";

export default function PartnerDealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deal = mockDeals.find((d) => d.id === id);

  if (!deal) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back</button>
        <p className="text-muted-foreground">Deal not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate("/app/partner/deals")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Deals</button>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{deal.title}</h1>
        <StatusBadge status={deal.status} />
      </div>

      <FormSection title="Deal Information (Read Only)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Building2, label: "Company", value: deal.companyName },
            { icon: DollarSign, label: "Value", value: `$${deal.value.toLocaleString()}` },
            { icon: Calendar, label: "Created", value: deal.createdAt },
            { icon: Calendar, label: "Updated", value: deal.updatedAt },
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
        {deal.notes && (
          <div className="flex items-start gap-3 pt-2 border-t">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="text-sm text-foreground">{deal.notes}</p>
            </div>
          </div>
        )}
      </FormSection>

      {deal.closedAt && (
        <Card className={deal.status === "WON" ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-foreground">
              Deal {deal.status === "WON" ? "won" : "lost"} on {deal.closedAt}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
