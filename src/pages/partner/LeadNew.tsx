import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";

export default function PartnerLeadNew() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate("/app/partner/leads")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Leads</button>
      <PageHeader title="New Lead" subtitle="Submit a new lead for review" />
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Lead saved as draft"); navigate("/app/partner/leads"); }}>
        <FormSection title="Lead Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Lead Title</Label><Input required /></div>
            <div className="space-y-2"><Label>Company Name</Label><Input required /></div>
            <div className="space-y-2"><Label>Contact Name</Label><Input required /></div>
            <div className="space-y-2"><Label>Contact Email</Label><Input type="email" required /></div>
            <div className="space-y-2"><Label>Contact Phone</Label><Input /></div>
            <div className="space-y-2"><Label>Estimated Value ($)</Label><Input type="number" /></div>
          </div>
          <div className="space-y-2"><Label>Notes</Label><Textarea rows={3} /></div>
          <div className="flex justify-end gap-2">
            <Button type="submit" variant="outline"><Save className="h-4 w-4 mr-1" /> Save Draft</Button>
            <Button type="button" onClick={() => { toast.success("Lead submitted for review"); navigate("/app/partner/leads"); }}>
              <Send className="h-4 w-4 mr-1" /> Submit for Review
            </Button>
          </div>
        </FormSection>
      </form>
    </div>
  );
}
