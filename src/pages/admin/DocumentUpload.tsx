import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminDocumentUpload() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate("/app/admin/documents")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Documents</button>
      <PageHeader title="Upload Document" subtitle="Add document metadata to the shared library" />
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Document uploaded"); navigate("/app/admin/documents"); }}>
        <FormSection title="Document Metadata">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>File Name</Label><Input required placeholder="e.g. Sales Playbook Q3.pdf" /></div>
            <div className="space-y-2"><Label>Storage Key</Label><Input required placeholder="e.g. docs/sales-playbook-q3.pdf" className="font-mono text-sm" /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {["Onboarding", "Sales", "Technical", "Finance", "Marketing"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit"><Save className="h-4 w-4 mr-1" /> Save Document</Button></div>
        </FormSection>
      </form>
    </div>
  );
}
