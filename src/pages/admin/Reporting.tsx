import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Handshake, ArrowUpRight, ArrowDownRight } from "lucide-react";

const monthlyLeadData = [
  { month: "Ocak 2025", submitted: 42, approved: 35, rejected: 7, conversionRate: "83%" },
  { month: "Şubat 2025", submitted: 56, approved: 48, rejected: 8, conversionRate: "86%" },
  { month: "Mart 2025", submitted: 63, approved: 51, rejected: 12, conversionRate: "81%" },
  { month: "Nisan 2025", submitted: 71, approved: 62, rejected: 9, conversionRate: "87%" },
];

const partnerPerformance = [
  { partner: "TechVision Ltd.", leads: 28, deals: 12, revenue: "₺485,000", trend: "up" },
  { partner: "CloudNet Solutions", leads: 22, deals: 9, revenue: "₺362,000", trend: "up" },
  { partner: "DataBridge Corp.", leads: 18, deals: 6, revenue: "₺198,000", trend: "down" },
  { partner: "InnoSoft A.Ş.", leads: 15, deals: 8, revenue: "₺310,000", trend: "up" },
  { partner: "SmartEdge Tech", leads: 12, deals: 4, revenue: "₺145,000", trend: "down" },
];

const kpis = [
  { label: "Toplam Lead", value: "232", change: "+18%", icon: TrendingUp, positive: true },
  { label: "Aktif Partner", value: "24", change: "+3", icon: Users, positive: true },
  { label: "Kapanan Deal", value: "39", change: "+12%", icon: Handshake, positive: true },
  { label: "Toplam Gelir", value: "₺1.5M", change: "+22%", icon: BarChart3, positive: true },
];

export default function Reporting() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reporting"
        subtitle="Partner ekosistemi performans raporları"
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
                <span className="text-xs text-muted-foreground ml-1">bu ay</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report 1: Monthly Lead Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aylık Lead Raporu</CardTitle>
          <CardDescription>Lead gönderim ve onay istatistikleri</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ay</TableHead>
                <TableHead className="text-right">Gönderilen</TableHead>
                <TableHead className="text-right">Onaylanan</TableHead>
                <TableHead className="text-right">Reddedilen</TableHead>
                <TableHead className="text-right">Dönüşüm Oranı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyLeadData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.submitted}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.approved}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.rejected}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-mono">{row.conversionRate}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report 2: Partner Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Partner Performans Raporu</CardTitle>
          <CardDescription>Partnerlerin lead, deal ve gelir bazlı sıralaması</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead className="text-right">Lead</TableHead>
                <TableHead className="text-right">Deal</TableHead>
                <TableHead className="text-right">Gelir</TableHead>
                <TableHead className="text-right">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerPerformance.map((row) => (
                <TableRow key={row.partner}>
                  <TableCell className="font-medium">{row.partner}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.leads}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.deals}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{row.revenue}</TableCell>
                  <TableCell className="text-right">
                    {row.trend === "up" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> Yükseliş
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
                        <ArrowDownRight className="h-3 w-3 mr-1" /> Düşüş
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
