import { useState, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { mockDocuments, type Document } from "@/lib/mock-data";
import { Plus, Download, Trash2, Upload, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadStart = () => {
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setShowUpload(false);
            setShowConfirmation(true);
          }, 300);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const handleConfirmOk = () => {
    if (uploadFile) {
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        fileName: uploadFile.name,
        storageKey: `docs/${uploadFile.name.toLowerCase().replace(/\s+/g, "-")}`,
        category: "General",
        uploadedBy: "Admin User",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setDocuments((prev) => [newDoc, ...prev]);
      toast.success("Document added to library");
    }
    setUploadFile(null);
    setUploadProgress(0);
    setShowConfirmation(false);
  };

  const handleOpenUpload = () => {
    setUploadFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setShowUpload(true);
  };

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
        action={{ label: "Upload Document", onClick: handleOpenUpload, icon: <Plus className="h-4 w-4" /> }}
      />
      <DataTable
        data={documents}
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
        onConfirm={() => {
          if (deleteTarget) {
            setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
            toast.success("Document deleted");
          }
          setDeleteTarget(null);
        }}
      />

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={(open) => { if (!isUploading) setShowUpload(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Select a file to upload to the document library.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            />
            {!uploadFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to select a file</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border">
                  <FileText className="h-8 w-8 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{uploadFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                {isUploading && (
                  <div className="space-y-1.5">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">{Math.round(uploadProgress)}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            {!isUploading && (
              <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
            )}
            <Button onClick={handleUploadStart} disabled={!uploadFile || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Upload Complete
            </DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{uploadFile?.name}</span> has been uploaded successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleConfirmOk}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
