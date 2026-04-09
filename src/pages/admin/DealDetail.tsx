import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockDeals } from "@/lib/mock-data";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/FormSection";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trophy, XCircle, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminDealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const deal = mockDeals.find((d) => d.id === id);
  const [showWonDialog, setShowWonDialog] = useState(false);
  const [showLostDialog, setShowLostDialog] = useState(false);

  if (!deal) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-muted-foreground">Deal not found.</p>
      </div>
    );
  }

  const isOpen = deal.status === "OPEN";

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/app/admin/deals")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Deals
      </button>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{deal.title}</h1>
            <StatusBadge status={deal.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-mono">{deal.id}</span> · {deal.partnerName}
          </p>
        </div>
      </div>

      {/* Edit Section */}
      <FormSection title="Deal Details" description={isOpen ? "Edit deal information" : "Deal information (read-only)"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Deal Title</Label>
            <Input defaultValue={deal.title} disabled={!isOpen} />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input defaultValue={deal.companyName} disabled={!isOpen} />
          </div>
          <div className="space-y-2">
            <Label>Value ($)</Label>
            <Input type="number" defaultValue={deal.value} disabled={!isOpen} />
          </div>
          <div className="space-y-2">
            <Label>Partner</Label>
            <Input defaultValue={deal.partnerName} disabled />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea defaultValue={deal.notes} disabled={!isOpen} rows={3} />
        </div>
        {isOpen && (
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Deal updated")}>
              <Save className="h-4 w-4 mr-1" /> Save Changes
            </Button>
          </div>
        )}
      </FormSection>

      {/* Status Change Section */}
      {isOpen && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">Change Deal Status</h3>
            <p className="text-sm text-muted-foreground mb-4">Mark this deal as won or lost. This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button onClick={() => setShowWonDialog(true)} className="bg-success hover:bg-success/90 text-success-foreground">
                <Trophy className="h-4 w-4 mr-1" /> Mark as Won
              </Button>
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setShowLostDialog(true)}>
                <XCircle className="h-4 w-4 mr-1" /> Mark as Lost
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {deal.closedAt && (
        <Card className={deal.status === "WON" ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-foreground">
              Deal {deal.status === "WON" ? "won" : "lost"} on {deal.closedAt}
            </p>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={showWonDialog}
        onOpenChange={setShowWonDialog}
        title="Mark Deal as Won"
        description="Are you sure you want to mark this deal as won? This cannot be undone."
        confirmLabel="Confirm Won"
        onConfirm={() => { toast.success("Deal marked as Won"); setShowWonDialog(false); navigate("/app/admin/deals"); }}
      />
      <ConfirmDialog
        open={showLostDialog}
        onOpenChange={setShowLostDialog}
        title="Mark Deal as Lost"
        description="Are you sure you want to mark this deal as lost? This cannot be undone."
        confirmLabel="Confirm Lost"
        variant="destructive"
        onConfirm={() => { toast.success("Deal marked as Lost"); setShowLostDialog(false); navigate("/app/admin/deals"); }}
      />
    </div>
  );
}
