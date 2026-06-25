import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  PlayCircle,
  StopCircle,
  Send,
  BarChart3,
  Users,
  Briefcase,
} from "lucide-react";
import { getElection, getPositionsForElection, elections, saveElections } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";

export default function ElectionDetail() {
  const { id = "" } = useParams();
  const [election, setElection] = useState(() => getElection(id));

  if (!election) return <div>Election not found</div>;

  const positions = getPositionsForElection(election.id);
  const pct =
    election.totalEligible > 0
      ? Math.round((election.votesCast / election.totalEligible) * 100)
      : 0;

  const updateStatus = (newStatus: "open" | "closed" | "archived") => {
    const idx = elections.findIndex((x) => x.id === election.id);
    if (idx !== -1) {
      elections[idx] = { ...elections[idx], status: newStatus };
      saveElections();
      setElection(elections[idx]);
      toast.success(`Election status updated to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        to="/admin/elections"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" /> Back to elections
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold">{election.name}</h1>
            <StatusBadge status={election.status} />
          </div>
          <p className="text-muted-foreground mt-1">{election.description}</p>
        </div>
        <div className="flex gap-2">
          {(election.status === "draft" || election.status === "scheduled") && (
            <Button className="bg-success text-white" onClick={() => updateStatus("open")}>
              <PlayCircle className="w-4 h-4 mr-2" /> Open Election
            </Button>
          )}
          {election.status === "open" && (
            <Button className="bg-warning text-white" onClick={() => updateStatus("closed")}>
              <StopCircle className="w-4 h-4 mr-2" /> Close Election
            </Button>
          )}
          {election.status === "closed" && (
            <Button className="bg-brand text-white" onClick={() => updateStatus("archived")}>
              <Send className="w-4 h-4 mr-2" /> Publish Results
            </Button>
          )}
          <Link to={`/admin/elections/${election.id}/results`}>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" /> View Results
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="Total Eligible" value={election.totalEligible.toLocaleString()} icon={Users} />
        <Stat label="Votes Cast" value={election.votesCast.toLocaleString()} icon={BarChart3} />
        <Stat label="Turnout" value={`${pct}%`} icon={BarChart3} />
        <Stat label="Positions" value={String(positions.length)} icon={Briefcase} />
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <h2 className="font-bold mb-4">Schedule</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Starts: </span>
            <span className="font-semibold">{format(new Date(election.startDate), "PPp")}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Ends: </span>
            <span className="font-semibold">{format(new Date(election.endDate), "PPp")}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <h2 className="font-bold mb-4">Positions</h2>
        <ul className="divide-y divide-border">
          {positions.map((p) => (
            <li key={p.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-soft">
      <Icon className="w-5 h-5 text-brand mb-2" />
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
