import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { DollarSign, Clock } from "lucide-react";
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
];

const statusColorMap: Record<string, "success" | "warning" | "info"> = {
  Paid: "success",
  Pending: "warning",
  Processing: "info",
};

export default function PartnerFinance() {
  const totalEarnings = commissionData
    .filter((c) => c.status === "Paid")
    .reduce((sum, c) => sum + c.commission, 0);
  const pendingCommissions = commissionData
    .filter((c) => c.status !== "Paid")
    .reduce((sum, c) => sum + c.commission, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Finance" subtitle="Your earnings and commission history" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-success/10">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">
                €{totalEarnings.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Commissions</p>
              <p className="text-2xl font-bold text-foreground">
                €{pendingCommissions.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Commission History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionData.map((row) => (
                <TableRow key={row.deal}>
                  <TableCell className="font-medium text-foreground">{row.deal}</TableCell>
                  <TableCell className="text-foreground">{row.customer}</TableCell>
                  <TableCell className="text-foreground">€{row.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-foreground">€{row.commission.toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={statusColorMap[row.status] === "success" ? "active" : statusColorMap[row.status] === "warning" ? "SUBMITTED" : "OPEN"} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
