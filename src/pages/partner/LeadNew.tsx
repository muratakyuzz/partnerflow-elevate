import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = ["Account", "Contacts", "Product"] as const;

const INDUSTRIES = ["Technology", "Finance", "Retail", "Healthcare", "Manufacturing", "Education", "Other"];
const EMPLOYEE_COUNTS = ["1–10", "10–50", "50–200", "200–500", "500+"];
const COUNTRIES = ["United States", "United Kingdom", "Germany", "France", "Canada", "Australia", "Netherlands", "Spain", "Italy", "Brazil", "India", "Japan", "Other"];
const GENDERS = ["Male", "Female", "Other"];

interface Contact {
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
}

interface AccountData {
  companyName: string;
  industry: string;
  employeeCount: string;
  website: string;
  address: string;
  city: string;
  country: string;
}

interface PackageInfo {
  name: string;
  teamSize: string;
  requirements: number;
  pbiGeneration: number;
  analysis: number;
  monthlyRQP: number;
}

const PACKAGES: PackageInfo[] = [
  { name: "Small", teamSize: "5–10", requirements: 15, pbiGeneration: 40, analysis: 20, monthlyRQP: 1800 },
  { name: "Medium", teamSize: "10–20", requirements: 35, pbiGeneration: 90, analysis: 50, monthlyRQP: 4100 },
  { name: "Large", teamSize: "20+", requirements: 100, pbiGeneration: 250, analysis: 150, monthlyRQP: 11000 },
];

const ADDONS = ["Accessibility WCAG 2.2", "HealthCheck", "Devicer"];

const emptyContact: Contact = { jobTitle: "", firstName: "", lastName: "", email: "", mobile: "", gender: "" };

export default function PartnerLeadNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Step 1
  const [account, setAccount] = useState<AccountData>({
    companyName: "", industry: "", employeeCount: "", website: "", address: "", city: "", country: "",
  });

  // Step 2
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactForm, setContactForm] = useState<Contact>({ ...emptyContact });

  // Step 3
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [addons, setAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const canNext = () => {
    if (step === 0) return account.companyName.trim().length > 0;
    if (step === 1) return contacts.length > 0;
    if (step === 2) return selectedPackage.length > 0;
    return false;
  };

  const addContact = () => {
    if (!contactForm.firstName.trim() || !contactForm.lastName.trim() || !contactForm.email.trim()) {
      toast.error("First Name, Last Name and Email are required");
      return;
    }
    setContacts((prev) => [...prev, { ...contactForm }]);
    setContactForm({ ...emptyContact });
  };

  const removeContact = (idx: number) => {
    setContacts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    toast.success("Lead created successfully");
    navigate("/app/partner/leads");
  };

  const toggleAddon = (addon: string) => {
    setAddons((prev) => prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate("/app/partner/leads")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </button>
      <PageHeader title="New Lead" subtitle="Submit a new lead for review" />

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors",
                  i < step && "bg-primary text-primary-foreground",
                  i === step && "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                  i > step && "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-sm font-medium hidden sm:inline", i <= step ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px flex-1 mx-3", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Account */}
      {step === 0 && (
        <FormSection title="Account Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name <span className="text-destructive">*</span></Label>
              <Input value={account.companyName} onChange={(e) => setAccount((a) => ({ ...a, companyName: e.target.value }))} placeholder="Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={account.industry} onValueChange={(v) => setAccount((a) => ({ ...a, industry: v }))}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>{INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Employee Count</Label>
              <Select value={account.employeeCount} onValueChange={(v) => setAccount((a) => ({ ...a, employeeCount: v }))}>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>{EMPLOYEE_COUNTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={account.website} onChange={(e) => setAccount((a) => ({ ...a, website: e.target.value }))} placeholder="https://example.com" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={account.address} onChange={(e) => setAccount((a) => ({ ...a, address: e.target.value }))} placeholder="123 Main St" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={account.city} onChange={(e) => setAccount((a) => ({ ...a, city: e.target.value }))} placeholder="San Francisco" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={account.country} onValueChange={(v) => setAccount((a) => ({ ...a, country: v }))}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </FormSection>
      )}

      {/* Step 2: Contacts */}
      {step === 1 && (
        <FormSection title="Contacts">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input value={contactForm.jobTitle} onChange={(e) => setContactForm((c) => ({ ...c, jobTitle: e.target.value }))} placeholder="CTO" />
            </div>
            <div className="space-y-2">
              <Label>First Name <span className="text-destructive">*</span></Label>
              <Input value={contactForm.firstName} onChange={(e) => setContactForm((c) => ({ ...c, firstName: e.target.value }))} placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label>Last Name <span className="text-destructive">*</span></Label>
              <Input value={contactForm.lastName} onChange={(e) => setContactForm((c) => ({ ...c, lastName: e.target.value }))} placeholder="Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input type="email" value={contactForm.email} onChange={(e) => setContactForm((c) => ({ ...c, email: e.target.value }))} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Mobile No</Label>
              <Input value={contactForm.mobile} onChange={(e) => setContactForm((c) => ({ ...c, mobile: e.target.value }))} placeholder="+1 555 0123" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={contactForm.gender} onValueChange={(v) => setContactForm((c) => ({ ...c, gender: v }))}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={addContact}>
              <Plus className="h-4 w-4 mr-1" /> Add Contact
            </Button>
          </div>

          {contacts.length > 0 && (
            <div className="rounded-lg border bg-background overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Job Title</th>
                    <th className="px-4 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="px-4 py-2.5 font-medium text-foreground">{c.firstName} {c.lastName}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{c.email}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{c.jobTitle || "—"}</td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => removeContact(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {contacts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No contacts added yet. Add at least one contact to proceed.</p>
          )}
        </FormSection>
      )}

      {/* Step 3: Product */}
      {step === 2 && (
        <div className="space-y-6">
          <FormSection title="Product Selection">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.name}
                  type="button"
                  onClick={() => {
                    setSelectedPackage(pkg.name);
                    if (pkg.name === "Small") setAddons([]);
                  }}
                  className={cn(
                    "rounded-lg border-2 p-5 text-left transition-all hover:shadow-md",
                    selectedPackage === pkg.name
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground text-base">{pkg.name}</h4>
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedPackage === pkg.name ? "border-primary bg-primary" : "border-muted-foreground/40"
                    )}>
                      {selectedPackage === pkg.name && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Team Size</span><span className="font-medium text-foreground">{pkg.teamSize}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Requirements</span><span className="font-medium text-foreground">{pkg.requirements}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">PBI Generation</span><span className="font-medium text-foreground">{pkg.pbiGeneration}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Analysis</span><span className="font-medium text-foreground">{pkg.analysis}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Lorem Metric 1</span><span className="font-medium text-foreground">—</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Lorem Metric 2</span><span className="font-medium text-foreground">—</span></div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="text-muted-foreground font-medium">Monthly RQP</span>
                      <span className="font-bold text-foreground">${pkg.monthlyRQP.toLocaleString()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </FormSection>

          {selectedPackage && selectedPackage !== "Small" && (
            <FormSection title="Add-ons">
              <div className="space-y-3">
                {ADDONS.map((addon) => (
                  <label key={addon} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={addons.includes(addon)}
                      onCheckedChange={() => toggleAddon(addon)}
                    />
                    <span className="text-sm text-foreground">{addon}</span>
                  </label>
                ))}
              </div>
            </FormSection>
          )}

          <FormSection title="Notes">
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes or context..."
            />
          </FormSection>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <div>
          {step > 0 && (
            <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
        </div>
        <div>
          {step < 2 ? (
            <Button type="button" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" disabled={!canNext()} onClick={handleSubmit}>
              Create Lead
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
