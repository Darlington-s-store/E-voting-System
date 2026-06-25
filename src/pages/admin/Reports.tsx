import {
  FileBarChart,
  FileText,
  Download,
  Users,
  TrendingUp,
  ListFilter,
  Vote,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { votesByDay, electionStatusBreakdown, elections } from "@/lib/mock-data";

const reports = [
  {
    icon: TrendingUp,
    title: "Election Results Report",
    desc: "Complete tally and rankings for a closed election.",
  },
  {
    icon: Users,
    title: "Voter Turnout Report",
    desc: "Participation rates broken down by faculty, department, and level.",
  },
  {
    icon: ListFilter,
    title: "Demographic Breakdown",
    desc: "Voting trends across demographic groups.",
  },
  {
    icon: FileBarChart,
    title: "Full Audit Report",
    desc: "Compliance-grade activity log for the election period.",
  },
];

export default function Reports() {
  const totalVotes = votesByDay.reduce((s, d) => s + d.votes, 0);
  const totalEligible = elections.reduce((s, e) => s + e.totalEligible, 0);
  const totalVoted = elections.reduce((s, e) => s + e.votesCast, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Reports</h1>
        <p className="text-muted-foreground">Generate and export detailed election reports</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Vote, label: "Total Elections", value: elections.length, color: "bg-brand" },
          { icon: BarChart3, label: "Total Votes Cast", value: totalVoted, color: "bg-success" },
          { icon: Users, label: "Eligible Voters", value: totalEligible, color: "bg-warning" },
          {
            icon: PieChartIcon,
            label: "Avg Turnout",
            value: totalEligible ? `${Math.round((totalVoted / totalEligible) * 100)}%` : "—",
            color: "bg-danger",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-4 shadow-soft">
            <div
              className={`w-9 h-9 rounded-lg ${s.color}/10 text-${s.color.replace("bg-", "")} flex items-center justify-center mb-2`}
            >
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">Votes per Day</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
          {votesByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={votesByDay}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="votes" fill="var(--color-brand)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">
              No vote data available
            </div>
          )}
        </div>
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">Elections by Status</h3>
          <p className="text-xs text-muted-foreground mb-4">All-time breakdown</p>
          {electionStatusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={electionStatusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                >
                  {electionStatusBreakdown.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">
              No election data available
            </div>
          )}
        </div>
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
              <Button size="sm" variant="outline" onClick={() => toast.success("PDF generated")}>
                <FileText className="w-4 h-4 mr-1" /> PDF
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.success("CSV generated")}>
                <Download className="w-4 h-4 mr-1" /> CSV
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <h2 className="font-bold mb-4">Custom Report</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Election</Label>
            <Select defaultValue="e1">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="e1">Student Union 2025</SelectItem>
                <SelectItem value="e3">Hostel Governors</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Select defaultValue="pdf">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Scope</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                <SelectItem value="winners">Winners only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={() => toast.success("Report generated")}
          className="mt-5 bg-brand text-white"
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
}
