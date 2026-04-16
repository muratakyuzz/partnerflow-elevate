import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus, Pencil, Trash2, GripVertical, Settings2, Users, Package, ClipboardList,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ─── Onboarding Types ────────────────────────────────────────
interface OnboardingStep {
  id: string;
  order: number;
  title: string;
  description: string;
}

// ─── Partner Config Types ────────────────────────────────────
interface PartnerType {
  id: string;
  name: string;
  description: string;
  tierEnabled: boolean;
}

interface PartnerTier {
  id: string;
  name: string;
  minRevenue: string;
  benefits: string;
}

// ─── Product Types ───────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  status: "active" | "inactive";
}

// ─── Initial Mock Data ───────────────────────────────────────
const initialSteps: OnboardingStep[] = [
  { id: "s1", order: 1, title: "Company Profile", description: "Fill in your company information and contact details." },
  { id: "s2", order: 2, title: "Agreement & Compliance", description: "Review and sign the partner agreement." },
  { id: "s3", order: 3, title: "Training & Certification", description: "Complete required training modules." },
  { id: "s4", order: 4, title: "Go Live", description: "Activate your partner portal and start submitting leads." },
];

const initialPartnerTypes: PartnerType[] = [
  { id: "pt1", name: "Referral", description: "Refers leads and earns commission", tierEnabled: false },
  { id: "pt2", name: "Reseller", description: "Sells products directly to end customers", tierEnabled: true },
  { id: "pt3", name: "Technology", description: "Integrates technology solutions", tierEnabled: false },
];

const initialPartnerTiers: PartnerTier[] = [
  { id: "tr1", name: "Silver", minRevenue: "$0", benefits: "Basic portal access, standard commission" },
  { id: "tr2", name: "Gold", minRevenue: "$50,000", benefits: "Priority support, higher commission rates" },
  { id: "tr3", name: "Platinum", minRevenue: "$200,000", benefits: "Dedicated manager, top-tier commission, co-marketing" },
];

const initialProducts: Product[] = [
  { id: "p1", name: "Cloud Suite Pro", category: "SaaS", price: "$499/mo", status: "active" },
  { id: "p2", name: "Data Analytics Platform", category: "Analytics", price: "$299/mo", status: "active" },
  { id: "p3", name: "Security Shield", category: "Security", price: "$199/mo", status: "inactive" },
];

// ─── Reusable empty row ──────────────────────────────────────
function EmptyRow({ cols, text }: { cols: number; text: string }) {
  return (
    <TableRow>
      <TableCell colSpan={cols} className="text-center py-8 text-muted-foreground">
        {text}
      </TableCell>
    </TableRow>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB 1 — Onboarding Settings
// ═════════════════════════════════════════════════════════════
function OnboardingTab() {
  const [enabled, setEnabled] = useState(true);
  const [steps, setSteps] = useState<OnboardingStep[]>(initialSteps);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OnboardingStep | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (step: OnboardingStep) => {
    setEditing(step);
    setForm({ title: step.title, description: step.description });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setSteps((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, title: form.title, description: form.description } : s))
      );
      toast({ title: "Step updated" });
    } else {
      const newStep: OnboardingStep = {
        id: `s${Date.now()}`,
        order: steps.length + 1,
        title: form.title,
        description: form.description,
      };
      setSteps((prev) => [...prev, newStep]);
      toast({ title: "Step added" });
    }
    setDialogOpen(false);
  };

  const remove = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })));
    toast({ title: "Step removed" });
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Onboarding Flow</CardTitle>
            <CardDescription>Enable or disable the partner onboarding wizard.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="onb-toggle" className="text-sm text-muted-foreground">
              {enabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch id="onb-toggle" checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </CardHeader>
      </Card>

      {/* Steps table */}
      {enabled && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Onboarding Steps</CardTitle>
              <CardDescription>{steps.length} step{steps.length !== 1 && "s"} configured</CardDescription>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Step
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps.length === 0 ? (
                  <EmptyRow cols={4} text="No onboarding steps yet." />
                ) : (
                  steps.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <GripVertical className="h-3.5 w-3.5" />
                          <span className="font-mono text-xs">{step.order}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{step.title}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-xs truncate">
                        {step.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(step)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(step.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Step" : "Add Step"}</DialogTitle>
            <DialogDescription>Define the onboarding step details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Company Profile" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What happens in this step?" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save Changes" : "Add Step"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB 2 — Partner Types & Tiers
// ═════════════════════════════════════════════════════════════
function PartnerConfigTab() {
  const [types, setTypes] = useState<PartnerType[]>(initialPartnerTypes);
  const [tiers, setTiers] = useState<PartnerTier[]>(initialPartnerTiers);

  // Type dialog
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<PartnerType | null>(null);
  const [typeForm, setTypeForm] = useState({ name: "", description: "", tierEnabled: false });

  // Tier dialog
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<PartnerTier | null>(null);
  const [tierForm, setTierForm] = useState({ name: "", minRevenue: "", benefits: "" });

  const openAddType = () => { setEditingType(null); setTypeForm({ name: "", description: "", tierEnabled: false }); setTypeDialogOpen(true); };
  const openEditType = (t: PartnerType) => { setEditingType(t); setTypeForm({ name: t.name, description: t.description, tierEnabled: t.tierEnabled }); setTypeDialogOpen(true); };
  const saveType = () => {
    if (!typeForm.name.trim()) return;
    if (editingType) {
      setTypes((p) => p.map((t) => (t.id === editingType.id ? { ...t, ...typeForm } : t)));
    } else {
      setTypes((p) => [...p, { id: `pt${Date.now()}`, ...typeForm }]);
    }
    setTypeDialogOpen(false);
    toast({ title: editingType ? "Type updated" : "Type added" });
  };
  const removeType = (id: string) => { setTypes((p) => p.filter((t) => t.id !== id)); toast({ title: "Type removed" }); };

  const openAddTier = () => { setEditingTier(null); setTierForm({ name: "", minRevenue: "", benefits: "" }); setTierDialogOpen(true); };
  const openEditTier = (t: PartnerTier) => { setEditingTier(t); setTierForm({ name: t.name, minRevenue: t.minRevenue, benefits: t.benefits }); setTierDialogOpen(true); };
  const saveTier = () => {
    if (!tierForm.name.trim()) return;
    if (editingTier) {
      setTiers((p) => p.map((t) => (t.id === editingTier.id ? { ...t, ...tierForm } : t)));
    } else {
      setTiers((p) => [...p, { id: `tr${Date.now()}`, ...tierForm }]);
    }
    setTierDialogOpen(false);
    toast({ title: editingTier ? "Tier updated" : "Tier added" });
  };
  const removeTier = (id: string) => { setTiers((p) => p.filter((t) => t.id !== id)); toast({ title: "Tier removed" }); };

  const hasTierEnabledType = types.some((t) => t.tierEnabled);

  return (
    <div className="space-y-8">
      {/* Partner Types */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Partner Types</CardTitle>
            <CardDescription>Define categories for your partners.</CardDescription>
          </div>
          <Button size="sm" onClick={openAddType}><Plus className="h-4 w-4 mr-1" /> Add Type</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Tier Enabled</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.length === 0 ? <EmptyRow cols={4} text="No partner types." /> : types.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{t.description}</TableCell>
                  <TableCell>
                    <Badge variant={t.tierEnabled ? "default" : "secondary"}>{t.tierEnabled ? "Yes" : "No"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditType(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeType(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Partner Tiers — only shown when at least one type has tiers enabled */}
      {hasTierEnabledType && <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Partner Tiers</CardTitle>
            <CardDescription>Define performance tiers and their benefits.</CardDescription>
          </div>
          <Button size="sm" onClick={openAddTier}><Plus className="h-4 w-4 mr-1" /> Add Tier</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Min Revenue</TableHead>
                <TableHead className="hidden md:table-cell">Benefits</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.length === 0 ? <EmptyRow cols={4} text="No tiers defined." /> : tiers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="font-mono text-sm">{t.minRevenue}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm max-w-xs truncate">{t.benefits}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditTier(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeTier(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </Card>}

      {/* Type Dialog */}
      <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingType ? "Edit Partner Type" : "Add Partner Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Name</Label><Input value={typeForm.name} onChange={(e) => setTypeForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Reseller" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={typeForm.description} onChange={(e) => setTypeForm((f) => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div className="flex items-center gap-3">
              <Switch checked={typeForm.tierEnabled} onCheckedChange={(checked) => setTypeForm((f) => ({ ...f, tierEnabled: checked }))} />
              <Label>Enable Tier System</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTypeDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveType}>{editingType ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tier Dialog */}
      <Dialog open={tierDialogOpen} onOpenChange={setTierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTier ? "Edit Partner Tier" : "Add Partner Tier"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Tier Name</Label><Input value={tierForm.name} onChange={(e) => setTierForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Gold" /></div>
            <div className="space-y-2"><Label>Minimum Revenue</Label><Input value={tierForm.minRevenue} onChange={(e) => setTierForm((f) => ({ ...f, minRevenue: e.target.value }))} placeholder="e.g. $50,000" /></div>
            <div className="space-y-2"><Label>Benefits</Label><Textarea value={tierForm.benefits} onChange={(e) => setTierForm((f) => ({ ...f, benefits: e.target.value }))} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTierDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTier}>{editingTier ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB 3 — Products
// ═════════════════════════════════════════════════════════════
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", status: "active" as "active" | "inactive" });

  const openAdd = () => { setEditing(null); setForm({ name: "", category: "", price: "", status: "active" }); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, category: p.category, price: p.price, status: p.status }); setDialogOpen(true); };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
    } else {
      setProducts((prev) => [...prev, { id: `p${Date.now()}`, ...form }]);
    }
    setDialogOpen(false);
    toast({ title: editing ? "Product updated" : "Product added" });
  };

  const remove = (id: string) => { setProducts((p) => p.filter((x) => x.id !== id)); toast({ title: "Product removed" }); };

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p))
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Products</CardTitle>
            <CardDescription>Manage products available for lead submissions.</CardDescription>
          </div>
          <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Product</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? <EmptyRow cols={5} text="No products configured." /> : products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.category}</TableCell>
                  <TableCell className="font-mono text-sm">{p.price}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.status === "active" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(p.id)}
                    >
                      {p.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Product Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Cloud Suite Pro" /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. SaaS" /></div>
            <div className="space-y-2"><Label>Price</Label><Input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. $499/mo" /></div>
            <div className="flex items-center gap-2">
              <Label>Active</Label>
              <Switch checked={form.status === "active"} onCheckedChange={(c) => setForm((f) => ({ ...f, status: c ? "active" : "inactive" }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════
export default function Configure() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configure"
        subtitle="Manage platform settings, onboarding, partner configuration, and products."
      />

      <Tabs defaultValue="onboarding" className="space-y-6">
        <TabsList className="bg-muted/60 backdrop-blur-sm">
          <TabsTrigger value="onboarding" className="gap-1.5">
            <ClipboardList className="h-4 w-4" /> Onboarding
          </TabsTrigger>
          <TabsTrigger value="partners" className="gap-1.5">
            <Users className="h-4 w-4" /> Partner Types & Tiers
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding"><OnboardingTab /></TabsContent>
        <TabsContent value="partners"><PartnerConfigTab /></TabsContent>
        <TabsContent value="products"><ProductsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
