import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPartners, mockLeads, mockDeals, mockDocuments } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { FormSection } from "@/components/FormSection";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft, Building2, Mail, Phone, Globe, Zap, Handshake,
  Trash2, Plus, FileText, Users, StickyNote, FolderOpen, Download,
} from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface PartnerDocument {
  id: string;
  fileName: string;
  type: string;
  uploadDate: string;
  uploadedBy: string;
}

// Mock data for contacts, notes, documents per partner
const mockPartnerContacts: Record<string, Contact[]> = {
  p1: [
    { id: "c1", firstName: "Alex", lastName: "Rivera", email: "alex@acme.io", phone: "+1 555-0110", jobTitle: "Account Manager" },
    { id: "c2", firstName: "Jamie", lastName: "Park", email: "jamie@acme.io", phone: "+1 555-0111", jobTitle: "Sales Director" },
  ],
  p2: [
    { id: "c3", firstName: "Priya", lastName: "Patel", email: "priya@techbridge.com", phone: "+1 555-0220", jobTitle: "Partner Lead" },
  ],
};

const mockPartnerNotes: Record<string, Note[]> = {
  p1: [
    { id: "n1", content: "Initial onboarding call completed. Partner is eager to start submitting leads.", createdAt: "2024-06-10", createdBy: "Sarah Chen" },
    { id: "n2", content: "Discussed commission structure and agreed on Q3 targets.", createdAt: "2024-06-05", createdBy: "Marcus Johnson" },
  ],
};

const mockPartnerDocuments: Record<string, PartnerDocument[]> = {
  p1: [
    { id: "pd1", fileName: "Partner Agreement.pdf", type: "PDF", uploadDate: "2024-01-15", uploadedBy: "Sarah Chen" },
    { id: "pd2", fileName: "Onboarding Checklist.docx", type: "DOCX", uploadDate: "2024-01-20", uploadedBy: "Marcus Johnson" },
  ],
};

export default function AdminPartnerDetail() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const partner = mockPartners.find((p) => p.id === partnerId);

  const [contacts, setContacts] = useState<Contact[]>(mockPartnerContacts[partnerId || ""] || []);
  const [notes, setNotes] = useState<Note[]>(mockPartnerNotes[partnerId || ""] || []);
  const [documents] = useState<PartnerDocument[]>(mockPartnerDocuments[partnerId || ""] || []);
  const [newNote, setNewNote] = useState("");

  if (!partner) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-muted-foreground">Partner not found.</p>
      </div>
    );
  }

  const leads = mockLeads.filter((l) => l.partnerId === partner.id);
  const deals = mockDeals.filter((d) => d.partnerId === partner.id);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      { id: `n-${Date.now()}`, content: newNote.trim(), createdAt: new Date().toISOString().split("T")[0], createdBy: "Sarah Chen" },
      ...prev,
    ]);
    setNewNote("");
    toast.success("Note added");
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Note deleted");
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success("Contact removed");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate("/app/admin/partners")} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Partners
      </button>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">{partner.name}</h1>
        <StatusBadge status={partner.status} />
      </div>

      <FormSection title="Organization Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: "Email", value: partner.contactEmail },
            { icon: Phone, label: "Phone", value: partner.contactPhone },
            { icon: Globe, label: "Website", value: partner.website },
            { icon: Building2, label: "Joined", value: partner.createdAt },
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
      </FormSection>

      {/* Tabs */}
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
          {[
            { value: "accounts", label: "Accounts", icon: Zap },
            { value: "contacts", label: "Contacts", icon: Users },
            { value: "notes", label: "Notes", icon: StickyNote },
            { value: "documents", label: "Documents", icon: FolderOpen },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-primary flex items-center gap-1.5"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-warning" />
                  <h3 className="font-semibold text-sm">Leads ({leads.length})</h3>
                </div>
                {leads.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No leads yet.</p>
                ) : (
                  leads.slice(0, 5).map((l) => (
                    <div key={l.id} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-foreground">{l.title}</span>
                      <StatusBadge status={l.status} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Handshake className="h-4 w-4 text-info" />
                  <h3 className="font-semibold text-sm">Deals ({deals.length})</h3>
                </div>
                {deals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No deals yet.</p>
                ) : (
                  deals.slice(0, 5).map((d) => (
                    <div key={d.id} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-foreground">{d.title}</span>
                      <StatusBadge status={d.status} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="mt-4">
          {contacts.length === 0 ? (
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="No contacts added yet"
              description="Add contacts associated with this partner organization."
            />
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Job Title</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr key={c.id} className="border-b border-border last:border-0">
                          <td className="p-3 font-medium text-foreground">{c.firstName} {c.lastName}</td>
                          <td className="p-3 text-muted-foreground">{c.email}</td>
                          <td className="p-3 text-muted-foreground">{c.phone}</td>
                          <td className="p-3 text-muted-foreground">{c.jobTitle}</td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(c.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardContent className="p-4 space-y-3">
              <Textarea
                placeholder="Write a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddNote} disabled={!newNote.trim()} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add Note
              </Button>
            </CardContent>
          </Card>

          {notes.length === 0 ? (
            <EmptyState
              icon={<StickyNote className="h-8 w-8 text-muted-foreground" />}
              title="No notes yet"
              description="Add notes to keep track of important partner context."
            />
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-foreground">{note.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {note.createdBy} · {note.createdAt}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          {documents.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
              title="No documents uploaded"
              description="Upload documents related to this partner."
            />
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">File Name</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Upload Date</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Uploaded By</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b border-border last:border-0">
                          <td className="p-3 font-medium text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {doc.fileName}
                          </td>
                          <td className="p-3 text-muted-foreground">{doc.type}</td>
                          <td className="p-3 text-muted-foreground">{doc.uploadDate}</td>
                          <td className="p-3 text-muted-foreground">{doc.uploadedBy}</td>
                          <td className="p-3 text-right space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => toast.info("Download not available in mock mode")}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => toast.info("Delete not available in mock mode")}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
