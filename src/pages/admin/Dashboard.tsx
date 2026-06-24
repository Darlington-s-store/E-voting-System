import { Link } from "react-router-dom";
import {
  Vote, Users, UserCheck, Activity, PlusCircle, Settings, FileBarChart,
  ScrollText, TrendingUp,
} from "lucide-react";
import { elections, voters, candidates, auditLogs, votesByDay, electionStatusBreakdown } from "@/lib/mock-data";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import { formatDistanceToNow } from "date-fns";

const stats = [
  { label: "Active Elections", value: 1, icon: Vote, color: "bg-success/15 text-success", trend: "+1 this month" },
  { label: "Total Voters", value: voters.length, icon: Users, color: "bg-brand/15 text-brand", trend: "+12 this week" },
  { label: "Total Candidates", value: candidates.length, icon: UserCheck, color: "bg-purple/15 text-purple", trend: "Across 6 positions" },
  { label: "Recent Activity", value: auditLogs.length, icon: Activity, color: "bg-warning/15 text-warning", trend: "Last 24h" },
];

const quick = [
  { label: "Create Election", to: "/admin/elections/create", icon: PlusCircle, color: "bg-brand" },
  { label: "Manage Voters", to: "/admin/voters", icon: Users, color: "bg-success" },
  { label: "View Results", to: "/admin/elections/e1/results", icon: TrendingUp, color: "bg-purple" },
  { label: "Generate Report", to: "/admin/reports", icon: FileBarChart, color: "bg-warning" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your election command center</p>
        </div>
        <Link to="/admin/elections/create">
          <Button className="bg-brand text-white"><PlusCircle className="w-4 h-4 mr-2" /> New Election</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold"><AnimatedCounter value={s.value} /></div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="text-xs text-success mt-1">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">Votes per Day</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={votesByDay}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Bar dataKey="votes" fill="var(--color-brand)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">Elections by Status</h3>
          <p className="text-xs text-muted-foreground mb-4">All-time breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={electionStatusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {electionStatusBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Elections</h3>
            <Link to="/admin/elections" className="text-sm text-brand font-semibold">View all</Link>
          </div>
          <div className="space-y-2">
            {elections.map((e) => (
              <Link key={e.id} to={`/admin/elections/${e.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                <div>
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.votesCast.toLocaleString()} / {e.totalEligible.toLocaleString()} votes</div>
                </div>
                <StatusBadge status={e.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quick.map((q) => (
              <Link key={q.label} to={q.to} className={`p-4 rounded-lg text-white ${q.color} hover:opacity-90 transition`}>
                <q.icon className="w-5 h-5 mb-2" />
                <div className="text-xs font-semibold leading-tight">{q.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2"><ScrollText className="w-4 h-4" /> Recent Activity</h3>
          <Link to="/admin/audit-logs" className="text-sm text-brand font-semibold">View all logs</Link>
        </div>
        <ul className="divide-y divide-border">
          {auditLogs.slice(0, 6).map((l) => (
            <li key={l.id} className="py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span><strong>{l.user}</strong> <span className="text-muted-foreground">{l.action.toLowerCase()}d</span> {l.entity}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(l.timestamp), { addSuffix: true })}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
