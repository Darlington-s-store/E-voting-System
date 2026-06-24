import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, ChevronLeft, ChevronRight, FileText, ShieldCheck,
  UserCheck, AlertTriangle, Download, Home, Loader2,
} from "lucide-react";
import {
  getElection, getPositionsForElection, getCandidatesForPosition,
  type Candidate,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Step = "verify" | "choose" | "confirm" | "done";

export default function VotingBooth() {
  const { id = "" } = useParams();
  const election = getElection(id);
  const positions = useMemo(() => getPositionsForElection(id), [id]);
  const user = useAuth((s) => s.user);
  const [step, setStep] = useState<Step>("verify");
  const [positionIdx, setPositionIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [manifestOpen, setManifestOpen] = useState<Candidate | null>(null);
  const [profileOpen, setProfileOpen] = useState<Candidate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  if (!election) {
    return (
      <div className="text-center py-20">
        <p>Election not found.</p>
        <Link to="/voter/elections"><Button className="mt-4">Back</Button></Link>
      </div>
    );
  }

  const currentPosition = positions[positionIdx];
  const candidates = currentPosition ? getCandidatesForPosition(election.id, currentPosition.id) : [];
  const selectedCandidateId = currentPosition ? selections[currentPosition.id] : undefined;

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setStep("done"); }, 1100);
  };

  const stepIndex = ["verify", "choose", "confirm", "done"].indexOf(step);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/voter/elections" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Exit booth
          </Link>
          <span className="text-xs font-mono text-muted-foreground">{election.id.toUpperCase()}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold">{election.name}</h1>

        <div className="mt-6 flex items-center gap-2 md:gap-4 overflow-x-auto pb-2">
          {[
            { key: "verify", label: "Verify", icon: ShieldCheck },
            { key: "choose", label: "Choose Candidates", icon: UserCheck },
            { key: "confirm", label: "Confirm", icon: CheckCircle2 },
            { key: "done", label: "Done", icon: CheckCircle2 },
          ].map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.key} className="flex items-center gap-2 md:gap-4 shrink-0">
                <div className={`flex items-center gap-2 ${active ? "text-brand" : done ? "text-success" : "text-muted-foreground"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-sm ${
                    active ? "border-brand bg-brand text-white" : done ? "border-success bg-success text-white" : "border-border bg-card"
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">{s.label}</span>
                </div>
                {i < 3 && <div className={`w-8 md:w-16 h-0.5 ${done ? "bg-success" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-card border border-border p-8 md:p-10 shadow-soft text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-brand" />
            </div>
            <h2 className="mt-5 text-xl font-bold">Verify your identity</h2>
            <p className="mt-2 text-sm text-muted-foreground">Confirm the details below before casting your vote.</p>
            <div className="mt-6 max-w-md mx-auto rounded-xl bg-muted/50 p-5 text-left space-y-2 text-sm">
              <Row label="Voter Name" value={user?.name ?? ""} />
              <Row label="Student ID" value={user?.studentId ?? ""} mono />
              <Row label="Election" value={election.name} />
              <Row label="Positions" value={`${positions.length} to vote on`} />
            </div>
            <Button onClick={() => setStep("choose")} className="mt-8 h-12 px-8 bg-brand text-white hover:bg-brand/90">
              Proceed to Vote <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {step === "choose" && currentPosition && (
          <motion.div
            key={`choose-${positionIdx}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">Position {positionIdx + 1} of {positions.length}</span>
                <div className="flex gap-1">
                  {positions.map((_, i) => (
                    <span key={i} className={`w-8 h-1 rounded-full ${i <= positionIdx ? "bg-brand" : "bg-muted"}`} />
                  ))}
                </div>
              </div>
              <h2 className="text-2xl font-extrabold">Voting for: <span className="text-brand">{currentPosition.name}</span></h2>
              <p className="text-sm text-muted-foreground mt-1">{currentPosition.description}</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {candidates.map((c) => {
                  const selected = selectedCandidateId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelections({ ...selections, [currentPosition.id]: c.id })}
                      className={`text-left rounded-xl p-5 border-2 transition-all ${
                        selected
                          ? "border-brand bg-brand/5 shadow-lift"
                          : "border-border bg-card hover:border-brand/40 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <img src={c.photo} alt={c.name} className="w-20 h-20 rounded-full ring-4 ring-card object-cover" />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selected ? "border-brand bg-brand" : "border-muted-foreground/40"
                        }`}>
                          {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <h3 className="mt-4 font-bold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{currentPosition.name}</p>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.bio}</p>
                      <div className="mt-4 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setProfileOpen(c); }} className="text-xs text-brand font-semibold hover:underline">
                          View Profile
                        </button>
                        <span className="text-muted-foreground">·</span>
                        <button onClick={(e) => { e.stopPropagation(); setManifestOpen(c); }} className="text-xs text-brand font-semibold hover:underline inline-flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Manifesto
                        </button>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (positionIdx === 0) setStep("verify");
                  else setPositionIdx(positionIdx - 1);
                }}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                disabled={!selectedCandidateId}
                onClick={() => {
                  if (positionIdx + 1 < positions.length) setPositionIdx(positionIdx + 1);
                  else setStep("confirm");
                }}
                className="bg-brand text-white hover:bg-brand/90 h-11 px-6"
              >
                {positionIdx + 1 < positions.length ? "Next Position" : "Review Choices"} <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft"
          >
            <h2 className="text-2xl font-extrabold mb-1">Review your ballot</h2>
            <p className="text-sm text-muted-foreground">Confirm your selections before submitting.</p>

            <div className="mt-6 space-y-3">
              {positions.map((p) => {
                const cid = selections[p.id];
                const c = candidates.length ? getCandidatesForPosition(election.id, p.id).find((x) => x.id === cid) : null;
                return (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="text-xs font-semibold text-muted-foreground uppercase w-32 shrink-0">{p.name}</div>
                    {c ? (
                      <div className="flex items-center gap-3 flex-1">
                        <img src={c.photo} className="w-10 h-10 rounded-full" alt="" />
                        <span className="font-semibold">{c.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-warning">Not selected</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-warning/10 text-warning border border-warning/20">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Your vote cannot be changed after submission.</strong> Please review carefully before confirming.
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setStep("choose")}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Go Back
              </Button>
              <Button
                disabled={submitting}
                onClick={submit}
                className="h-12 px-8 bg-success text-white hover:bg-success/90"
              >
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit My Vote"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-card border border-border p-10 md:p-14 shadow-soft text-center"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto rounded-full bg-success/15 flex items-center justify-center"
            >
              <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <CheckCircle2 className="w-14 h-14 text-success" />
              </motion.div>
            </motion.div>
            <h2 className="mt-6 text-3xl font-extrabold">Your vote has been recorded!</h2>
            <p className="mt-2 text-muted-foreground">Thank you for participating in {election.name}.</p>

            <div className="mt-8 max-w-md mx-auto rounded-xl bg-muted/40 p-5 text-left text-sm space-y-2">
              <div className="font-semibold mb-2">Vote summary</div>
              {positions.map((p) => {
                const cid = selections[p.id];
                const c = cid ? getCandidatesForPosition(election.id, p.id).find((x) => x.id === cid) : null;
                return (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{p.name}</span>
                    <span className="font-semibold">{c?.name ?? "—"}</span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-mono text-xs">
                <span className="text-muted-foreground">Receipt ID</span>
                <span>VR-{election.id.toUpperCase()}-{Date.now().toString(36).toUpperCase()}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => toast.success("Receipt downloaded")}>
                <Download className="w-4 h-4 mr-2" /> Download Receipt
              </Button>
              <Button onClick={() => nav("/voter/dashboard")} className="bg-brand text-white hover:bg-brand/90">
                <Home className="w-4 h-4 mr-2" /> Return to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={!!manifestOpen} onOpenChange={(v) => !v && setManifestOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{manifestOpen?.name} — Manifesto</DialogTitle></DialogHeader>
          <div className="aspect-[3/4] rounded-md bg-muted flex items-center justify-center text-muted-foreground">
            <div className="text-center"><FileText className="w-12 h-12 mx-auto mb-2" /><p className="text-sm">PDF manifesto preview</p></div>
          </div>
          <p className="text-sm">{manifestOpen?.campaignMessage}</p>
        </DialogContent>
      </Dialog>

      <Dialog open={!!profileOpen} onOpenChange={(v) => !v && setProfileOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Candidate Profile</DialogTitle></DialogHeader>
          {profileOpen && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={profileOpen.photo} className="w-20 h-20 rounded-full" alt="" />
                <div>
                  <div className="font-bold text-lg">{profileOpen.name}</div>
                  <div className="text-sm text-muted-foreground">{currentPosition?.name}</div>
                </div>
              </div>
              <p className="text-sm">{profileOpen.bio}</p>
              <p className="text-sm italic text-muted-foreground">"{profileOpen.campaignMessage}"</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${mono ? "font-mono text-sm" : ""}`}>{value}</span>
    </div>
  );
}
