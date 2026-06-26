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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ElectionDetail() {
  const { id = "" } = useParams();
  const [election, setElection] = useState(() => getElection(id));
  const [confirmAction, setConfirmAction] = useState<"open" | "close" | "publish" | null>(null);
  const [confirmText, setConfirmText] = useState("");

  if (!election) return <div className="p-8 text-center font-bold">Election not found</div>;

  const positions = getPositionsForElection(election.id);
  const pct =
    election.totalEligible > 0
      ? Math.round((election.votesCast / election.totalEligible) * 100)
      : 0;

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    let newStatus: "open" | "closed" | "archived" = "open";
    if (confirmAction === "close") {
      newStatus = "closed";
    } else if (confirmAction === "publish") {
      newStatus = "archived";
    }

    const idx = elections.findIndex((x) => x.id === election.id);
    if (idx !== -1) {
      elections[idx] = { ...elections[idx], status: newStatus };
      saveElections();
      setElection(elections[idx]);
      toast.success(`Election status updated to ${newStatus}`);
    }

    setConfirmAction(null);
    setConfirmText("");
  };

  const handleOpenModal = (action: "open" | "close" | "publish") => {
    setConfirmText("");
    setConfirmAction(action);
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
            <Button
              className="bg-success text-white hover:bg-success/90 font-semibold"
              onClick={() => handleOpenModal("open")}
            >
              <PlayCircle className="w-4 h-4 mr-2" /> Open Election
            </Button>
          )}
          {election.status === "open" && (
            <Button
              className="bg-warning text-white hover:bg-warning/90 font-semibold"
              onClick={() => handleOpenModal("close")}
            >
              <StopCircle className="w-4 h-4 mr-2" /> Close Election
            </Button>
          )}
          {election.status === "closed" && (
            <Button
              className="bg-brand text-white hover:bg-brand/90 font-semibold"
              onClick={() => handleOpenModal("publish")}
            >
              <Send className="w-4 h-4 mr-2" /> Publish Results
            </Button>
          )}
          <Link to={`/admin/elections/${election.id}/results`}>
            <Button variant="outline" className="font-semibold">
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

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(isOpen) => !isOpen && setConfirmAction(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            {confirmAction === "open" && (
              <>
                <div className="flex items-center gap-2 text-success mb-1">
                  <PlayCircle className="w-5 h-5 shrink-0" />
                  <AlertDialogTitle className="text-lg font-bold">
                    Start Election Confirmation
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground space-y-3">
                  <div>
                    You are about to open voting for the election:{" "}
                    <strong className="text-foreground">"{election.name}"</strong>.
                  </div>
                  <div className="p-3 bg-success/5 border border-success/10 rounded-xl space-y-1.5 text-xs text-success font-medium">
                    <div>✅ Allow eligible voters to cast votes immediately</div>
                    <div>✅ Make the voting booth live immediately</div>
                    <div>⚠️ Once started, candidates cannot be added or removed.</div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="type-start" className="text-xs font-semibold text-foreground">
                      Type <span className="font-extrabold">"START"</span> to confirm:
                    </Label>
                    <Input
                      id="type-start"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="START"
                      className="h-10 text-sm font-bold uppercase tracking-wider"
                    />
                  </div>
                </AlertDialogDescription>
              </>
            )}

            {confirmAction === "close" && (
              <>
                <div className="flex items-center gap-2 text-warning mb-1">
                  <StopCircle className="w-5 h-5 shrink-0" />
                  <AlertDialogTitle className="text-lg font-bold">
                    Close Election Confirmation
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground space-y-3">
                  <div>
                    You are about to CLOSE voting for the election:{" "}
                    <strong className="text-foreground">"{election.name}"</strong>.
                  </div>
                  <div className="p-3 bg-warning/5 border border-warning/10 rounded-xl space-y-1.5 text-xs text-warning font-medium">
                    <div>🔒 Immediately stop all vote submissions</div>
                    <div>🔒 Lock all vote counts permanently</div>
                    <div>⚠️ This action CANNOT be undone.</div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="type-close" className="text-xs font-semibold text-foreground">
                      Type <span className="font-extrabold">"CLOSE"</span> to confirm:
                    </Label>
                    <Input
                      id="type-close"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="CLOSE"
                      className="h-10 text-sm font-bold uppercase tracking-wider"
                    />
                  </div>
                </AlertDialogDescription>
              </>
            )}

            {confirmAction === "publish" && (
              <>
                <div className="flex items-center gap-2 text-brand mb-1">
                  <Send className="w-5 h-5 shrink-0" />
                  <AlertDialogTitle className="text-lg font-bold">
                    Publish Election Results?
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  Are you sure you want to publish the final results for{" "}
                  <strong className="text-foreground">"{election.name}"</strong>? This will make the
                  results visible to voters on their panels.
                </AlertDialogDescription>
              </>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={
                (confirmAction === "open" && confirmText !== "START") ||
                (confirmAction === "close" && confirmText !== "CLOSE")
              }
              className={`font-semibold shadow-sm ${
                confirmAction === "open"
                  ? "bg-success text-white hover:bg-success/90"
                  : confirmAction === "close"
                    ? "bg-warning text-white hover:bg-warning/90"
                    : "bg-brand text-white hover:bg-brand/90"
              }`}
            >
              Confirm Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
