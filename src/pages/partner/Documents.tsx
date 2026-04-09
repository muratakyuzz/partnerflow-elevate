import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { mockDocuments, type Document } from "@/lib/mock-data";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const columns: Column<Document>[] = [
  { key: "name", header: "File Name", render: (d) => (
    <div>
      <p className="font-medium text-foreground">{d.fileName}</p>
      <p className="text-xs text-muted-foreground">{d.category}</p>
    </div>
  )},
  { key: "by", header: "Uploaded By", render: (d) => <span className="text-sm">{d.uploadedBy}</span> },
  { key: "date", header: "Date", render: (d) => <span className="text-xs text-muted-foreground">{d.createdAt}</span> },
  { key: "actions", header: "", render: () => (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); toast.info("Download started"); }}>
      <Download className="h-4 w-4" />
    </Button>
  ), className: "w-16" },
];

export default function PartnerDocuments() {
  return (
    <div className="space-y-6">
      <PageHeader title="Documents" subtitle="Access shared resources and documentation" />
      <DataTable
        data={mockDocuments}
        columns={columns}
        searchPlaceholder="Search documents..."
        searchKey={(d) => `${d.fileName} ${d.category}`}
      />
    </div>
  );
}
