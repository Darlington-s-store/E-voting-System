import { useParams } from "react-router-dom";
import { Trophy, Download, FileText, RefreshCw } from "lucide-react";
import {
  getElection, getPositionsForElection, getCandidatesForPosition,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { toast } from "sonner";

const colors = ["var(--color-brand)", "var(--color-success)", "var(--color-purple)", "var(--color-warning)", "var(--color-accent)"];

export default function Results() {
  const { id = "e1" } = useParams();
  const election = getElection(id);
  if (!election) return <div>Election not found</div>;
  const positions = getPositionsForElection(election.id);
  const pct = Math.round((election.votesCast / election.totalEligible) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold">{election.name} — Results</h1>
            <StatusBadge status={election.status} />
            {election.status === "open" && (
              <span className="inline-flex items-center gap-1 text-xs text-success font-semibold">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> LIVE
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">Turnout {pct}% · {election.votesCast.toLocaleString()} votes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Refreshed")}><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
          <Button variant="outline" onClick={() => toast.success("PDF exported")}><FileText className="w-4 h-4 mr-2" /> PDF</Button>
          <Button onClick={() => toast.success("CSV exported")} className="bg-brand text-white"><Download className="w-4 h-4 mr-2" /> CSV</Button>
        </div>
      </div>

      <div className="space-y-6">
        {positions.map((p) => {
          const cands = getCandidatesForPosition(election.id, p.id);
          const totalVotes = cands.reduce((s, c) => s + c.votes, 0);
          const sorted = [...cands].sort((a, b) => b.votes - a.votes);
          const winner = sorted[0];
          return (
            <div key={p.id} className="rounded-xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">{p.name}</h2>
                <span className="text-xs text-muted-foreground">{totalVotes.toLocaleString()} votes cast</span>
              </div>

              {election.status === "closed" && winner && (
                <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-warning/10 to-success/10 border border-warning/20 flex items-center gap-4">
                  <Trophy className="w-10 h-10 text-warning" />
                  <div>
                    <div className="text-xs text-muted-foreground">Winner</div>
                    <div className="text-lg font-extrabold">{winner.name}</div>
                    <div className="text-sm text-muted-foreground">{winner.votes.toLocaleString()} votes ({Math.round((winner.votes / totalVotes) * 100)}%)</div>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={Math.max(200, cands.length * 50)}>
                  <BarChart data={sorted} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} width={110} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                    <Bar dataKey="votes" radius={[0, 6, 6, 0]}>
                      {sorted.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {sorted.map((c, i) => {
                    const cpct = Math.round((c.votes / totalVotes) * 100);
                    return (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-sm font-bold w-6 text-muted-foreground">#{i + 1}</span>
                        <img src={c.photo} className="w-8 h-8 rounded-full" alt="" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold truncate">{c.name}</span>
                            <span className="font-mono">{c.votes.toLocaleString()} · {cpct}%</span>
                          </div>
                          <div className="h-1.5 mt-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full" style={{ width: `${cpct}%`, background: colors[i % colors.length] }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
