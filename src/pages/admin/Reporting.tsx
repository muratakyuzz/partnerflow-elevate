import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, Handshake, ArrowUpRight, ArrowDownRight, Columns3, Search } from "lucide-react";

// ── Partner Performance (Summary) ──
const partnerPerformance = [
  { partner: "TechVision Ltd.", leads: 28, deals: 12, revenue: "$485,000", trend: "up" as const },
  { partner: "CloudNet Solutions", leads: 22, deals: 9, revenue: "$362,000", trend: "up" as const },
  { partner: "DataBridge Corp.", leads: 18, deals: 6, revenue: "$198,000", trend: "down" as const },
  { partner: "InnoSoft Inc.", leads: 15, deals: 8, revenue: "$310,000", trend: "up" as const },
  { partner: "SmartEdge Tech", leads: 12, deals: 4, revenue: "$145,000", trend: "down" as const },
];

type SummaryColumnKey = "partner" | "leads" | "deals" | "revenue" | "trend";
const allSummaryColumns: { key: SummaryColumnKey; label: string }[] = [
  { key: "partner", label: "Partner" },
  { key: "leads", label: "Leads" },
  { key: "deals", label: "Deals" },
  { key: "revenue", label: "Revenue" },
  { key: "trend", label: "Trend" },
];

// ── Transaction Details ──
interface Transaction {
  id: string;
  date: string;
  partner: string;
  type: "Lead" | "Deal";
  description: string;
  company: string;
  amount: string;
  status: string;
}

const transactionDetails: Transaction[] = [
  { id: "TXN-001", date: "2025-04-12", partner: "TechVision Ltd.", type: "Deal", description: "Enterprise CRM License", company: "GlobalTech Industries", amount: "$82,000", status: "Won" },
  { id: "TXN-002", date: "2025-04-10", partner: "CloudNet Solutions", type: "Lead", description: "Cloud Migration Assessment", company: "StartupXYZ", amount: "$32,000", status: "Approved" },
  { id: "TXN-003", date: "2025-04-08", partner: "DataBridge Corp.", type: "Deal", description: "Analytics Platform POC", company: "RetailMax", amount: "$25,000", status: "Open" },
  { id: "TXN-004", date: "2025-04-06", partner: "InnoSoft Inc.", type: "Lead", description: "Mobile App Development", company: "HealthPlus", amount: "$95,000", status: "Submitted" },
  { id: "TXN-005", date: "2025-04-04", partner: "SmartEdge Tech", type: "Deal", description: "Security Suite Deployment", company: "FinServe Bank", amount: "$110,000", status: "Lost" },
  { id: "TXN-006", date: "2025-04-02", partner: "TechVision Ltd.", type: "Lead", description: "ERP Integration Project", company: "ManuCo", amount: "$150,000", status: "Draft" },
  { id: "TXN-007", date: "2025-03-30", partner: "CloudNet Solutions", type: "Deal", description: "Cloud Infrastructure Setup", company: "EduTech Corp", amount: "$55,000", status: "Won" },
  { id: "TXN-008", date: "2025-03-28", partner: "InnoSoft Inc.", type: "Lead", description: "AI Chatbot Implementation", company: "ServiceFirst", amount: "$45,000", status: "Approved" },
  { id: "TXN-009", date: "2025-03-25", partner: "DataBridge Corp.", type: "Deal", description: "Data Warehouse Migration", company: "LogiCorp", amount: "$78,000", status: "Open" },
  { id: "TXN-010", date: "2025-03-22", partner: "SmartEdge Tech", type: "Lead", description: "IoT Monitoring Platform", company: "AgriTech Solutions", amount: "$62,000", status: "Rejected" },
];

type DetailColumnKey = "id" | "date" | "partner" | "type" | "description" | "company" | "amount" | "status";
const allDetailColumns: { key: DetailColumnKey; label: string }[] = [
  { key: "id", label: "Transaction ID" },
  { key: "date", label: "Date" },
  { key: "partner", label: "Partner" },
  { key: "type", label: "Type" },
  { key: "description", label: "Description" },
  { key: "company", label: "Company" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

// ── KPIs ──
const kpis = [
  { label: "Total Leads", value: "232", change: "+18%", icon: TrendingUp, positive: true },
  { label: "Active Partners", value: "24", change: "+3", icon: Users, positive: true },
  { label: "Closed Deals", value: "39", change: "+12%", icon: Handshake, positive: true },
  { label: "Total Revenue", value: "$1.5M", change: "+22%", icon: BarChart3, positive: true },
];

// ── Status badge helper ──
function StatusBadgeInline({ status }: { status: string }) {
  const map: Record<string, string> = {
    Won: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Open: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Submitted: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Draft: "bg-muted text-muted-foreground border-border",
    Lost: "bg-red-500/10 text-red-600 border-red-500/20",
    Rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  };
  return <Badge className={map[status] || ""}>{status}</Badge>;
}

// ── Reusable filtered table with column toggle ──
function FilterableTable<K extends string>({
  data,
  allColumns,
}: {
  data: Record<string, unknown>[];
  allColumns: { key: K; label: string }[];
}) {
  const [visibleColumns, setVisibleColumns] = useState<Set<K>>(
    new Set(allColumns.map((c) => c.key))
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  const toggleColumn = (key: K) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    return data.filter((row) => {
      for (const key of Object.keys(filters)) {
        const q = filters[key]?.toLowerCase();
        if (!q) continue;
        const val = String(row[key] ?? "").toLowerCase();
        if (!val.includes(q)) return false;
      }
      return true;
    });
  }, [data, filters]);

  const activeColumns = allColumns.filter((c) => visibleColumns.has(c.key));

  return (
    <>
      <div className="flex justify-end mb-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Columns3 className="h-4 w-4" />
              Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2">
            <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Toggle columns</p>
            {allColumns.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer text-sm"
              >
                <Checkbox
                  checked={visibleColumns.has(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                />
                {col.label}
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {activeColumns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
          <TableRow className="hover:bg-transparent border-b">
            {activeColumns.map((col) => (
              <TableHead key={`filter-${col.key}`} className="py-1.5 px-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Filter..."
                    value={filters[col.key] || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                    }
                    className="h-7 pl-7 text-xs"
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={activeColumns.length} className="text-center py-12 text-muted-foreground">
                No results found
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row, idx) => (
              <TableRow key={idx}>
                {activeColumns.map((col) => {
                  const val = String(row[col.key] ?? "");
                  // Special renderers
                  if (col.key === "trend") {
                    return (
                      <TableCell key={col.key} className="text-right">
                        {val === "up" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> Rising
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
                            <ArrowDownRight className="h-3 w-3 mr-1" /> Declining
                          </Badge>
                        )}
                      </TableCell>
                    );
                  }
                  if (col.key === "status" && col.label === "Status") {
                    return (
                      <TableCell key={col.key}>
                        <StatusBadgeInline status={val} />
                      </TableCell>
                    );
                  }
                  if (col.key === "type") {
                    return (
                      <TableCell key={col.key}>
                        <Badge variant="outline">{val}</Badge>
                      </TableCell>
                    );
                  }
                  const isNumeric = ["leads", "deals", "revenue", "amount"].includes(col.key);
                  return (
                    <TableCell
                      key={col.key}
                      className={isNumeric ? "text-right tabular-nums font-medium" : col.key === "id" ? "font-mono text-xs" : ""}
                    >
                      {val}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

// ── Main Component ──
export default function Reporting() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporting"
        subtitle="Partner ecosystem performance reports"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="group">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className="h-4 w-4 text-muted-foreground/60" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.positive ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={`text-xs font-medium ${kpi.positive ? "text-emerald-500" : "text-red-500"}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">this month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for two reports */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Partner Performance</TabsTrigger>
          <TabsTrigger value="details">Transaction Details</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Partner Performance Report</CardTitle>
              <CardDescription>Summary of each partner's leads, deals, and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <FilterableTable
                data={partnerPerformance as unknown as Record<string, unknown>[]}
                allColumns={allSummaryColumns}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Details Report</CardTitle>
              <CardDescription>Individual lead and deal transactions across all partners</CardDescription>
            </CardHeader>
            <CardContent>
              <FilterableTable
                data={transactionDetails as unknown as Record<string, unknown>[]}
                allColumns={allDetailColumns}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
