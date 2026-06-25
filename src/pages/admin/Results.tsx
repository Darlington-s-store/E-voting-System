import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Trophy,
  Download,
  FileText,
  RefreshCw,
  Crown,
  Sparkles,
  Users,
  Play,
  Pause,
  List,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import {
  getElection,
  getPositionsForElection,
  getCandidatesForPosition,
  type Candidate,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { toast } from "sonner";

const colors = [
  "var(--color-brand)",
  "var(--color-success)",
  "var(--color-purple)",
  "var(--color-warning)",
  "var(--color-destructive)",
];

export default function Results() {
  const { id = "e1" } = useParams();
  const election = getElection(id);
  const positions = useMemo(
    () => (election ? getPositionsForElection(election.id) : []),
    [election],
  );

  // States
  const [simulating, setSimulating] = useState(false);
  const [votesCast, setVotesCast] = useState(election?.votesCast ?? 0);
  const [activeTab, setActiveTab] = useState("all");
  const [viewModes, setViewModes] = useState<Record<string, "chart" | "list">>({});

  // Initialize candidates list for simulation
  const [localCandidates, setLocalCandidates] = useState<Record<string, Candidate[]>>(() => {
    const map: Record<string, Candidate[]> = {};
    if (election) {
      positions.forEach((p) => {
        map[p.id] = getCandidatesForPosition(election.id, p.id);
      });
    }
    return map;
  });

  // Calculate overall stats
  const totalEligible = election?.totalEligible ?? 0;
  const turnoutPercent = totalEligible > 0 ? Math.round((votesCast / totalEligible) * 100) : 0;

  // Live simulation removed

  // Handle early return check after all hooks
  if (!election) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-border">
        <h2 className="text-xl font-bold">Election not found</h2>
        <p className="text-muted-foreground mt-2">
          The requested election results could not be found.
        </p>
      </div>
    );
  }

  // Handle Mock refresh
  const handleRefresh = () => {
    if (election.status === "open") {
      // Add a small random burst of votes on manual refresh
      const burst = Math.floor(Math.random() * 45) + 10;
      positions.forEach((p) => {
        setLocalCandidates((prev) => {
          const list = prev[p.id] || [];
          if (list.length === 0) return prev;
          const updated = [...list];
          const randomIdx = Math.floor(Math.random() * list.length);
          updated[randomIdx] = { ...updated[randomIdx], votes: updated[randomIdx].votes + burst };
          return { ...prev, [p.id]: updated };
        });
      });
      setVotesCast((v) => v + burst * positions.length);
      toast.success("Results refreshed and updated!");
    } else {
      toast.success("Results loaded and up to date");
    }
  };

  const filteredPositions =
    activeTab === "all" ? positions : positions.filter((p) => p.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {election.name} — Live Results
            </h1>
            <StatusBadge status={election.status} />
            {election.status === "open" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> LIVE UPDATES
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Electoral analytics, turnout metrics, and winner projections.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {election.status === "open" && (
            <Button
              onClick={() => {
                setSimulating(!simulating);
                toast(
                  simulating
                    ? "Simulation paused"
                    : "Simulation started! Watching votes come in...",
                );
              }}
              variant={simulating ? "destructive" : "outline"}
              className="h-10 px-4"
            >
              {simulating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Pause Live Sim
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 text-success" /> Start Live Sim
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={handleRefresh} className="h-10">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" onClick={() => toast.success("PDF exported")} className="h-10">
            <FileText className="w-4 h-4 mr-2" /> PDF Report
          </Button>
          <Button
            onClick={() => toast.success("CSV exported")}
            className="h-10 bg-brand text-white hover:bg-brand/90"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Voter Turnout</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold">{turnoutPercent}%</div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${Math.min(100, turnoutPercent)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Target turnout: 85% based on previous elections
          </p>
        </div>

        <div className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Total Ballots Cast</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold">{votesCast.toLocaleString()}</div>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              out of {totalEligible.toLocaleString()}
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Remaining eligible: {(totalEligible - votesCast).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Active Positions</span>
            <Trophy className="w-4 h-4 text-warning" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold">{positions.length}</div>
            <p className="text-sm font-medium text-muted-foreground mt-1">Contested portfolios</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Total active candidates: {Object.values(localCandidates).flat().length}
          </p>
        </div>
      </div>

      {/* Position Filter Tabs */}
      <div className="border-b border-border flex items-center overflow-x-auto gap-2 pb-px scrollbar-none">
        <button
          onClick={() => setActiveTab("all")}
          className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition shrink-0 ${
            activeTab === "all"
              ? "border-brand text-brand"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          All Positions ({positions.length})
        </button>
        {positions.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition shrink-0 ${
              activeTab === p.id
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Detailed Position Results Cards */}
      <div className="space-y-6">
        {filteredPositions.map((p) => {
          const cands = localCandidates[p.id] || [];
          const totalVotes = cands.reduce((sum, c) => sum + c.votes, 0);
          const sorted = [...cands].sort((a, b) => b.votes - a.votes);
          const winner = sorted[0];
          const runnerUp = sorted[1];
          const margin = winner && runnerUp ? winner.votes - runnerUp.votes : 0;
          const viewMode = viewModes[p.id] ?? "chart";

          return (
            <div
              key={p.id}
              className="rounded-xl bg-card border border-border p-6 shadow-soft space-y-5"
            >
              {/* Card Header & Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{p.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {totalVotes.toLocaleString()} votes cast for this position
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant={viewMode === "chart" ? "secondary" : "ghost"}
                    onClick={() => setViewModes((prev) => ({ ...prev, [p.id]: "chart" }))}
                    className="h-8 px-2.5"
                  >
                    <BarChart2 className="w-4 h-4 mr-1.5" /> Chart
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    onClick={() => setViewModes((prev) => ({ ...prev, [p.id]: "list" }))}
                    className="h-8 px-2.5"
                  >
                    <List className="w-4 h-4 mr-1.5" /> Table
                  </Button>
                </div>
              </div>

              {/* Leader Spotlight / Projected Winner banner */}
              {winner && (
                <div
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    election.status === "closed"
                      ? "bg-gradient-to-r from-warning/10 to-success/15 border-warning/30"
                      : "bg-brand/5 border-brand/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={winner.photo}
                        className="w-14 h-14 rounded-full object-cover"
                        alt=""
                      />
                      <div className="absolute -top-1.5 -right-1.5 bg-card rounded-full p-1 border shadow-sm">
                        {election.status === "closed" ? (
                          <Trophy className="w-4 h-4 text-warning" />
                        ) : (
                          <Crown className="w-4 h-4 text-brand" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {election.status === "closed" ? "Winner Elect" : "Current Frontrunner"}
                        </span>
                        {simulating && (
                          <span
                            className="w-2 h-2 rounded-full bg-brand animate-ping"
                            title="Auto-updating"
                          />
                        )}
                      </div>
                      <div className="text-lg font-extrabold mt-0.5">{winner.name}</div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {winner.votes.toLocaleString()} votes (
                        {totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 100) : 0}%)
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Margin of Lead
                    </div>
                    <div className="text-md font-bold mt-0.5">+{margin.toLocaleString()} votes</div>
                    <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">
                      {runnerUp ? `Ahead of ${runnerUp.name.split(" ")[0]}` : "Unopposed"}
                    </span>
                  </div>
                </div>
              )}

              {/* Chart or Table/List content */}
              {viewMode === "chart" ? (
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          width={110}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                          {sorted.map((_, i) => (
                            <Cell key={i} fill={colors[i % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3.5">
                    {sorted.map((c, i) => {
                      const cpct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
                      return (
                        <div key={c.id} className="flex items-center gap-3">
                          <span className="text-xs font-extrabold w-5 text-muted-foreground text-center">
                            #{i + 1}
                          </span>
                          <img
                            src={c.photo}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline text-sm">
                              <span className="font-semibold text-foreground truncate">
                                {c.name}
                              </span>
                              <span className="font-mono text-xs font-bold">
                                {c.votes.toLocaleString()} votes ({cpct}%)
                              </span>
                            </div>
                            <div className="h-2 mt-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${cpct}%`, background: colors[i % colors.length] }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Beautiful Detailed Table view */
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-3 text-center w-14">Rank</th>
                        <th className="p-3 text-left">Candidate</th>
                        <th className="p-3 text-right">Votes</th>
                        <th className="p-3 text-right">Percentage</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sorted.map((c, i) => {
                        const cpct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
                        return (
                          <tr key={c.id} className="hover:bg-muted/20">
                            <td className="p-3 text-center font-bold text-muted-foreground">
                              #{i + 1}
                            </td>
                            <td className="p-3 flex items-center gap-3 font-medium text-foreground">
                              <img
                                src={c.photo}
                                className="w-7 h-7 rounded-full object-cover"
                                alt=""
                              />
                              <span>{c.name}</span>
                            </td>
                            <td className="p-3 text-right font-mono font-semibold">
                              {c.votes.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono font-semibold">{cpct}%</td>
                            <td className="p-3 text-right">
                              {i === 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                                  {election.status === "closed" ? (
                                    <>
                                      <Trophy className="w-3 h-3" /> Winner
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3 h-3" /> Leading
                                    </>
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground font-medium">
                                  Contending
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
