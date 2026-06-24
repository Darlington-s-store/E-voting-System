import { FileBarChart, FileText, Download, Users, TrendingUp, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const reports = [
  { icon: TrendingUp, title: "Election Results Report", desc: "Complete tally and rankings for a closed election." },
  { icon: Users, title: "Voter Turnout Report", desc: "Participation rates broken down by faculty, department, and level." },
  { icon: ListFilter, title: "Demographic Breakdown", desc: "Voting trends across demographic groups." },
  { icon: FileBarChart, title: "Full Audit Report", desc: "Compliance-grade activity log for the election period." },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Reports</h1>
        <p className="text-muted-foreground">Generate and export detailed election reports</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.title} className="rounded-xl bg-card border border-border p-6 shadow-soft">
            <div className="w-11 h-11 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-3">
              <r.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold">{r.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
            <div className="mt-5 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("PDF generated")}><FileText className="w-4 h-4 mr-1" /> PDF</Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("CSV generated")}><Download className="w-4 h-4 mr-1" /> CSV</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <h2 className="font-bold mb-4">Custom Report</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Election</Label>
            <Select defaultValue="e1"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="e1">Student Union 2025</SelectItem><SelectItem value="e3">Hostel Governors</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select defaultValue="pdf"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="csv">CSV</SelectItem><SelectItem value="xlsx">Excel</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label>Scope</Label>
            <Select defaultValue="all"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All positions</SelectItem><SelectItem value="winners">Winners only</SelectItem></SelectContent></Select>
          </div>
        </div>
        <Button onClick={() => toast.success("Report generated")} className="mt-5 bg-brand text-white">Generate Report</Button>
      </div>
    </div>
  );
}
