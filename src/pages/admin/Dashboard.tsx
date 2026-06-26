import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Vote,
  Users,
  UserCheck,
  Activity,
  PlusCircle,
  Settings,
  FileBarChart,
  ScrollText,
  TrendingUp,
  Trash2,
  Flag,
} from "lucide-react";
import {
  elections,
  voters,
  candidates,
  auditLogs,
  votesByDay,
  electionStatusBreakdown,
  resetVoteCounts,
  wipeAllElectionsAndVotes,
  restoreCleanDefaults,
  positions,
  partylists,
} from "@/lib/mock-data";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { formatDistanceToNow } from "date-fns";

const quick = [
  { label: "Create Election", to: "/admin/elections/create", icon: PlusCircle, color: "bg-brand" },
  { label: "Manage Voters", to: "/admin/voters", icon: Users, color: "bg-success" },
  {
    label: "View Results",
    to: "/admin/elections/e1/results",
    icon: TrendingUp,
    color: "bg-purple",
  },
  { label: "Generate Report", to: "/admin/reports", icon: FileBarChart, color: "bg-warning" },
];

export default function AdminDashboard() {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleDashboardAction = (action: "resetVotes" | "wipe" | "restoreClean") => {
    if (action === "resetVotes") {
      resetVoteCounts();
      toast.success("All votes reset successfully!");
    } else if (action === "wipe") {
      wipeAllElectionsAndVotes();
      toast.success("All elections, candidates, and positions wiped!");
    } else if (action === "restoreClean") {
      restoreCleanDefaults();
      toast.success("Clean sample elections and candidates restored!");
    }
    setConfirmReset(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const dynamicStats = [
    {
      label: "Active Elections",
      value: elections.filter((e) => e.status === "open").length,
      icon: Vote,
      color: "bg-success/15 text-success",
      trend: `${elections.filter((e) => e.status === "scheduled").length} scheduled`,
    },
    {
      label: "Total Voters",
      value: voters.length,
      icon: Users,
      color: "bg-brand/15 text-brand",
      trend: "Registered students",
    },
    {
      label: "Total Candidates",
      value: candidates.length,
      icon: UserCheck,
      color: "bg-purple/15 text-purple",
      trend: `${positions.length} portfolios`,
    },
    {
      label: "Recent Activity",
      value: auditLogs.length,
      icon: Activity,
      color: "bg-warning/15 text-warning",
      trend: "Action logs active",
    },
    {
      label: "Total Partylists",
      value: partylists.length,
      icon: Flag,
      color: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
      trend: "Political coalitions",
    },
  ];

  const totalVotesCast = elections.reduce((sum, e) => sum + e.votesCast, 0);
  const dynamicVotesByDay =
    totalVotesCast === 0
      ? [
          { day: "Mon", votes: 0 },
          { day: "Tue", votes: 0 },
          { day: "Wed", votes: 0 },
          { day: "Thu", votes: 0 },
          { day: "Fri", votes: 0 },
          { day: "Sat", votes: 0 },
          { day: "Sun", votes: 0 },
        ]
      : votesByDay;

  const openCount = elections.filter((e) => e.status === "open").length;
  const scheduledCount = elections.filter((e) => e.status === "scheduled").length;
  const closedCount = elections.filter((e) => e.status === "closed").length;
  const dynamicElectionStatusBreakdown = [
    { name: "Open", value: openCount, color: "var(--color-success)" },
    { name: "Scheduled", value: scheduledCount, color: "var(--color-brand)" },
    { name: "Closed", value: closedCount, color: "var(--color-danger)" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your election command center</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-danger/30 hover:bg-danger/10 hover:text-danger text-danger font-semibold"
            onClick={() => setConfirmReset(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear Data
          </Button>
          <Link to="/admin/elections/create">
            <Button className="bg-brand text-white hover:bg-brand/90 font-semibold">
              <PlusCircle className="w-4 h-4 mr-2" /> New Election
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dynamicStats.map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold">
                <AnimatedCounter value={s.value} />
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">Votes per Day</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dynamicVotesByDay}>
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
        </div>
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">Elections by Status</h3>
          <p className="text-xs text-muted-foreground mb-4">All-time breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={dynamicElectionStatusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
              >
                {dynamicElectionStatusBreakdown.map((e, i) => (
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
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Elections</h3>
            <Link to="/admin/elections" className="text-sm text-brand font-semibold">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {elections.map((e) => (
              <Link
                key={e.id}
                to={`/admin/elections/${e.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
              >
                <div>
                  <div className="font-semibold text-sm">{e.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.votesCast.toLocaleString()} / {e.totalEligible.toLocaleString()} votes
                  </div>
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
              <Link
                key={q.label}
                to={q.to}
                className={`p-4 rounded-lg text-white ${q.color} hover:opacity-90 transition`}
              >
                <q.icon className="w-5 h-5 mb-2" />
                <div className="text-xs font-semibold leading-tight">{q.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <ScrollText className="w-4 h-4" /> Recent Activity
          </h3>
          <Link to="/admin/audit-logs" className="text-sm text-brand font-semibold">
            View all logs
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {auditLogs.slice(0, 6).map((l) => (
            <li key={l.id} className="py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>
                  <strong>{l.user}</strong>{" "}
                  <span className="text-muted-foreground">{l.action.toLowerCase()}d</span>{" "}
                  {l.entity}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(l.timestamp), { addSuffix: true })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset or Wipe System Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you want to clear system data from the dashboard. This action will modify
              active elections, positions, candidates, and votes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3 py-3">
            <Button
              variant="outline"
              onClick={() => handleDashboardAction("resetVotes")}
              className="justify-start border-warning/30 hover:bg-warning/10 text-warning text-left h-auto py-3 px-4"
            >
              <div>
                <div className="font-bold">Reset Vote Counts</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Resets all candidate and election votes to 0. Keeps elections list.
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDashboardAction("wipe")}
              className="justify-start border-danger/30 hover:bg-danger/10 text-danger text-left h-auto py-3 px-4"
            >
              <div>
                <div className="font-bold">Wipe All Elections & Candidates</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Completely clears elections, positions, and candidates from the system.
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDashboardAction("restoreClean")}
              className="justify-start border-brand/30 hover:bg-brand/10 text-brand text-left h-auto py-3 px-4"
            >
              <div>
                <div className="font-bold">Restore Clean Sample Data</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Restores default elections/candidates with 0 votes cast.
                </div>
              </div>
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
