import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { mockPartners } from "@/lib/mock-data";
import { toast } from "sonner";

export default function AdminUserNew() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => navigate("/app/admin/users")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back to Users</button>
      <PageHeader title="New User" subtitle="Add a new platform user" />
      <form onSubmit={(e) => { e.preventDefault(); toast.success("User created"); navigate("/app/admin/users"); }}>
        <FormSection title="User Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" required /></div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Partner Organization</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
                <SelectContent>
                  {mockPartners.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end"><Button type="submit"><Save className="h-4 w-4 mr-1" /> Create User</Button></div>
        </FormSection>
      </form>
    </div>
  );
}
