import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const commissionData = [
  { deal: "D-003", customer: "InnoSoft SRL", revenue: 24000, commission: 4800, status: "Paid" as const, date: "2024-03-15" },
  { deal: "D-001", customer: "TechCorp GmbH", revenue: 48000, commission: 9600, status: "Pending" as const, date: "2024-04-15" },
  { deal: "D-002", customer: "SecureNet Ltd", revenue: 72000, commission: 14400, status: "Processing" as const, date: "2024-05-01" },
  { deal: "D-005", customer: "CloudBase AG", revenue: 36000, commission: 7200, status: "Paid" as const, date: "2024-02-20" },
  { deal: "D-006", customer: "DataVault Inc", revenue: 60000, commission: 12000, status: "Pending" as const, date: "2024-05-10" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-success/10 text-success border-success/20 glow-success",
  Pending: "bg-warning/10 text-warning border-warning/20 glow-warning",
  Processing: "bg-info/10 text-info border-info/20 glow-primary",
};

const kpiCards = [
  {
    label: "Total Earnings",
    icon: DollarSign,
    trend: "+12.5%",
    trendUp: true,
    colorClass: "from-success/20 to-success/5",
    iconBg: "bg-success/15",
    iconColor: "text-success",
    getValue: (data: typeof commissionData) =>
      data.filter((c) => c.status === "Paid").reduce((s, c) => s + c.commission, 0),
  },
  {
    label: "Pending Commissions",
    icon: Clock,
    trend: "+8.2%",
    trendUp: true,
    colorClass: "from-warning/20 to-warning/5",
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    getValue: (data: typeof commissionData) =>
      data.filter((c) => c.status !== "Paid").reduce((s, c) => s + c.commission, 0),
  },
  {
    label: "Commission Rate",
    icon: TrendingUp,
    trend: "Stable",
    trendUp: true,
    colorClass: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    getValue: () => null,
    display: "20%",
  },
];

export default function PartnerFinance() {
  return (
    <div className="space-y-6">
      <PageHeader title="Finance" subtitle="Your earnings and commission history" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiCards.map((kpi, i) => {
          const value = kpi.getValue(commissionData);
          return (
            <Card
              key={kpi.label}
              className="overflow-hidden animate-fade-in-scale"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
            >
              <CardContent className="p-6">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 rounded-xl pointer-events-none", kpi.colorClass)} />
                <div className="relative flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground">
                      {value !== null ? `€${value.toLocaleString()}` : kpi.display}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-medium">
                      {kpi.trendUp ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                      )}
                      <span className={kpi.trendUp ? "text-success" : "text-destructive"}>
                        {kpi.trend}
                      </span>
                      <span className="text-muted-foreground ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={cn("flex items-center justify-center h-12 w-12 rounded-xl", kpi.iconBg)}>
                    <kpi.icon className={cn("h-6 w-6", kpi.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="animate-fade-in" style={{ animationDelay: "240ms", animationFillMode: "backwards" }}>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Commission History</h3>
          <div className="rounded-lg overflow-hidden border border-border/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Deal</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold text-right">Revenue</TableHead>
                  <TableHead className="font-semibold text-right">Commission</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionData.map((row) => (
                  <TableRow key={row.deal} className="transition-colors duration-200 hover:bg-accent/50">
                    <TableCell className="font-mono text-sm text-primary font-medium">{row.deal}</TableCell>
                    <TableCell className="font-medium text-foreground">{row.customer}</TableCell>
                    <TableCell className="text-right tabular-nums text-foreground">€{row.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-foreground">€{row.commission.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-shadow",
                        statusStyles[row.status]
                      )}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
