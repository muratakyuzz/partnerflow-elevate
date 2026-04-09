import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockLeads } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/FormSection";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, DollarSign, Building2, User, Mail, Phone, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AdminLeadDetail() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const lead = mockLeads.find((l) => l.id === leadId);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  if (!lead) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-muted-foreground">Lead not found.</p>
      </div>
    );
  }

  const canDecide = lead.status === "SUBMITTED";

  const handleApprove = () => {
    toast.success("Lead approved successfully");
    navigate("/app/admin/leads");
  };

  const handleReject = () => {
    toast.success("Lead rejected");
    setShowRejectDialog(false);
    navigate("/app/admin/leads");
  };

  const infoFields = [
    { icon: Building2, label: "Company", value: lead.companyName },
    { icon: User, label: "Contact", value: lead.contactName },
    { icon: Mail, label: "Email", value: lead.contactEmail },
    { icon: Phone, label: "Phone", value: lead.contactPhone },
    { icon: DollarSign, label: "Estimated Value", value: `$${lead.estimatedValue.toLocaleString()}` },
    { icon: Building2, label: "Partner", value: lead.partnerName },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/app/admin/leads")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{lead.title}</h1>
            <StatusBadge status={lead.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-mono">{lead.id}</span> · Created {lead.createdAt} · Updated {lead.updatedAt}
          </p>
        </div>
      </div>

      <FormSection title="Lead Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoFields.map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <f.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm font-medium text-foreground">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
        {lead.notes && (
          <div className="flex items-start gap-3 pt-2 border-t">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="text-sm text-foreground">{lead.notes}</p>
            </div>
          </div>
        )}
      </FormSection>

      {lead.rejectionReason && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-destructive">Rejection Reason</p>
                <p className="text-sm text-foreground mt-1">{lead.rejectionReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decision Zone */}
      {canDecide && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">Decision Required</h3>
            <p className="text-sm text-muted-foreground mb-4">Review the lead details and approve or reject this submission.</p>
            <div className="flex gap-3">
              <Button onClick={handleApprove} className="bg-success hover:bg-success/90 text-success-foreground">
                <CheckCircle className="h-4 w-4 mr-1" /> Approve Lead
              </Button>
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setShowRejectDialog(true)}>
                <XCircle className="h-4 w-4 mr-1" /> Reject Lead
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reject dialog with reason */}
      <ConfirmDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject Lead"
        description="Please provide a reason for rejecting this lead. The partner will see this reason."
        confirmLabel="Reject Lead"
        variant="destructive"
        onConfirm={handleReject}
      />
      {showRejectDialog && (
        <div className="hidden">
          {/* Reason is captured via the dialog — simplified for MVP mock */}
        </div>
      )}
    </div>
  );
}
