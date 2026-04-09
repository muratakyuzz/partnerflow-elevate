import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminPartnerNew() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Partner created successfully");
    navigate("/app/admin/partners");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate("/app/admin/partners")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Partners
      </button>
      <PageHeader title="New Partner" subtitle="Add a new partner organization" />
      <form onSubmit={handleSubmit}>
        <FormSection title="Organization Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Organization Name</Label><Input required /></div>
            <div className="space-y-2"><Label>Website</Label><Input type="url" /></div>
            <div className="space-y-2"><Label>Contact Email</Label><Input type="email" required /></div>
            <div className="space-y-2"><Label>Contact Phone</Label><Input /></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit"><Save className="h-4 w-4 mr-1" /> Create Partner</Button>
          </div>
        </FormSection>
      </form>
    </div>
  );
}
