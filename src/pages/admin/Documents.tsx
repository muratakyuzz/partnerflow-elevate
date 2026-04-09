import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { mockDocuments, type Document } from "@/lib/mock-data";
import { Plus, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDocuments() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);

  const columns: Column<Document>[] = [
    { key: "name", header: "File Name", render: (d) => (
      <div>
        <p className="font-medium text-foreground">{d.fileName}</p>
        <p className="text-xs text-muted-foreground font-mono">{d.storageKey}</p>
      </div>
    )},
    { key: "cat", header: "Category", render: (d) => <span className="text-sm">{d.category}</span> },
    { key: "by", header: "Uploaded By", render: (d) => <span className="text-sm">{d.uploadedBy}</span> },
    { key: "date", header: "Date", render: (d) => <span className="text-xs text-muted-foreground">{d.createdAt}</span> },
    { key: "actions", header: "", render: (d) => (
      <div className="flex gap-1 justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); toast.info("Download started"); }}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteTarget(d); }}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ), className: "w-24" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        subtitle="Manage shared documents and resources"
        action={{ label: "Upload Document", onClick: () => navigate("/app/admin/documents/upload"), icon: <Plus className="h-4 w-4" /> }}
      />
      <DataTable
        data={mockDocuments}
        columns={columns}
        searchPlaceholder="Search documents..."
        searchKey={(d) => `${d.fileName} ${d.category} ${d.uploadedBy}`}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteTarget?.fileName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => { toast.success("Document deleted"); setDeleteTarget(null); }}
      />
    </div>
  );
}
