import { useState, useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart3, TrendingUp, Users, Handshake, ArrowUpRight, ArrowDownRight, SlidersHorizontal, Columns3, Search } from "lucide-react";

const partnerPerformance = [
  { partner: "TechVision Ltd.", leads: 28, deals: 12, revenue: "$485,000", trend: "up" as const },
  { partner: "CloudNet Solutions", leads: 22, deals: 9, revenue: "$362,000", trend: "up" as const },
  { partner: "DataBridge Corp.", leads: 18, deals: 6, revenue: "$198,000", trend: "down" as const },
  { partner: "InnoSoft Inc.", leads: 15, deals: 8, revenue: "$310,000", trend: "up" as const },
  { partner: "SmartEdge Tech", leads: 12, deals: 4, revenue: "$145,000", trend: "down" as const },
];

type ColumnKey = "partner" | "leads" | "deals" | "revenue" | "trend";

const allColumns: { key: ColumnKey; label: string }[] = [
  { key: "partner", label: "Partner" },
  { key: "leads", label: "Leads" },
  { key: "deals", label: "Deals" },
  { key: "revenue", label: "Revenue" },
  { key: "trend", label: "Trend" },
];

const kpis = [
  { label: "Total Leads", value: "232", change: "+18%", icon: TrendingUp, positive: true },
  { label: "Active Partners", value: "24", change: "+3", icon: Users, positive: true },
  { label: "Closed Deals", value: "39", change: "+12%", icon: Handshake, positive: true },
  { label: "Total Revenue", value: "$1.5M", change: "+22%", icon: BarChart3, positive: true },
];

export default function Reporting() {
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(allColumns.map((c) => c.key))
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  const toggleColumn = (key: ColumnKey) => {
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
    return partnerPerformance.filter((row) => {
      for (const key of Object.keys(filters) as ColumnKey[]) {
        const q = filters[key]?.toLowerCase();
        if (!q) continue;
        const val = String(row[key]).toLowerCase();
        if (!val.includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const activeColumns = allColumns.filter((c) => visibleColumns.has(c.key));

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

      {/* Partner Performance Report */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">Partner Performance Report</CardTitle>
            <CardDescription>Partner ranking by leads, deals and revenue</CardDescription>
          </div>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {activeColumns.map((col) => (
                  <TableHead key={col.key} className={col.key !== "partner" ? "text-right" : ""}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow className="hover:bg-transparent border-b">
                {activeColumns.map((col) => (
                  <TableHead key={`filter-${col.key}`} className="py-1.5 px-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder={`Filter...`}
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
                filtered.map((row) => (
                  <TableRow key={row.partner}>
                    {activeColumns.map((col) => {
                      if (col.key === "partner") {
                        return <TableCell key={col.key} className="font-medium">{row.partner}</TableCell>;
                      }
                      if (col.key === "trend") {
                        return (
                          <TableCell key={col.key} className="text-right">
                            {row.trend === "up" ? (
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
                      return (
                        <TableCell key={col.key} className="text-right tabular-nums font-medium">
                          {String(row[col.key])}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
