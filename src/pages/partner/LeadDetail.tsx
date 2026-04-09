import { useParams, useNavigate } from "react-router-dom";
import { mockLeads } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Save, Send, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function PartnerLeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find((l) => l.id === leadId);

  if (!lead) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back</button>
        <p className="text-muted-foreground">Lead not found.</p>
      </div>
    );
  }

  const canEdit = lead.status === "DRAFT" || lead.status === "REJECTED";
  const canSubmit = lead.status === "DRAFT" || lead.status === "REJECTED";

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate("/app/partner/leads")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Leads</button>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{lead.title}</h1>
        <StatusBadge status={lead.status} />
      </div>
      <p className="text-sm text-muted-foreground"><span className="font-mono">{lead.id}</span> · Updated {lead.updatedAt}</p>

      {lead.rejectionReason && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Rejection Reason</p>
                <p className="text-sm text-foreground mt-1">{lead.rejectionReason}</p>
                <p className="text-xs text-muted-foreground mt-2">You can edit and re-submit this lead.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <FormSection title="Lead Information" description={canEdit ? "Edit and re-submit this lead" : "View-only — this lead has been submitted"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Lead Title</Label><Input defaultValue={lead.title} disabled={!canEdit} /></div>
          <div className="space-y-2"><Label>Company Name</Label><Input defaultValue={lead.companyName} disabled={!canEdit} /></div>
          <div className="space-y-2"><Label>Contact Name</Label><Input defaultValue={lead.contactName} disabled={!canEdit} /></div>
          <div className="space-y-2"><Label>Contact Email</Label><Input defaultValue={lead.contactEmail} disabled={!canEdit} /></div>
          <div className="space-y-2"><Label>Contact Phone</Label><Input defaultValue={lead.contactPhone} disabled={!canEdit} /></div>
          <div className="space-y-2"><Label>Estimated Value ($)</Label><Input type="number" defaultValue={lead.estimatedValue} disabled={!canEdit} /></div>
        </div>
        <div className="space-y-2"><Label>Notes</Label><Textarea defaultValue={lead.notes} disabled={!canEdit} rows={3} /></div>
        {canEdit && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => toast.success("Draft saved")}><Save className="h-4 w-4 mr-1" /> Save Draft</Button>
            {canSubmit && (
              <Button onClick={() => { toast.success("Lead submitted"); navigate("/app/partner/leads"); }}>
                <Send className="h-4 w-4 mr-1" /> Submit for Review
              </Button>
            )}
          </div>
        )}
      </FormSection>
    </div>
  );
}
