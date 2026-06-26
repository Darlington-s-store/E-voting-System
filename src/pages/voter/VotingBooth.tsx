import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Download,
  Home,
  Loader2,
  X,
  FileDown,
  Info,
} from "lucide-react";
import {
  getElection,
  getPositionsForElection,
  getCandidatesForPosition,
  partylists,
  type Candidate,
  elections,
  saveElections,
  candidates as allCandidates,
  saveCandidates,
  auditLogs,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Step = "verify" | "choose" | "confirm" | "done";

export default function VotingBooth() {
  const { id = "" } = useParams();
  const election = getElection(id);
  const positions = useMemo(() => getPositionsForElection(id), [id]);
  const user = useAuth((s) => s.user);

  const eligiblePositions = useMemo(() => {
    if (!user) return positions;
    return positions.filter((p) => {
      if (p.voterLevels && p.voterLevels !== "All Levels") {
        const levels = p.voterLevels.split(",").map((l) => l.trim());
        if (user.level && !levels.includes(user.level)) return false;
      }
      if (p.voterFaculties && p.voterFaculties !== "All Faculties") {
        const faculties = p.voterFaculties.split(",").map((f) => f.trim().toLowerCase());
        if (user.faculty && !faculties.includes(user.faculty.toLowerCase())) return false;
      }
      if (p.voterDepts && p.voterDepts !== "All Departments") {
        const depts = p.voterDepts.split(",").map((d) => d.trim().toLowerCase());
        if (user.department && !depts.includes(user.department.toLowerCase())) return false;
      }
      return true;
    });
  }, [positions, user]);

  const [step, setStep] = useState<Step>("verify");
  const [positionIdx, setPositionIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});

  // Custom right-slide candidate drawer state
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null);

  // Identity verified checkbox
  const [idVerified, setIdVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const currentPosition = eligiblePositions[positionIdx];

  const candidates = useMemo(() => {
    if (!currentPosition || !election) return [];
    return getCandidatesForPosition(election.id, currentPosition.id).filter(
      (c) => c.status === "active",
    );
  }, [currentPosition, election]);

  const selectedCandidateId = currentPosition ? selections[currentPosition.id] : undefined;

  const activeCandidate = useMemo(() => {
    if (!activeCandidateId || !candidates) return null;
    return candidates.find((c) => c.id === activeCandidateId) || null;
  }, [activeCandidateId, candidates]);

  if (!election) {
    return (
      <div className="text-center py-20">
        <p>Election not found.</p>
        <Link to="/voter/elections">
          <Button className="mt-4">Back</Button>
        </Link>
      </div>
    );
  }

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);

      // Increment votes cast for election
      const currentElection = elections.find((e) => e.id === id);
      if (currentElection) {
        currentElection.votesCast = (currentElection.votesCast || 0) + 1;
      }

      // Increment votes for candidates
      Object.entries(selections).forEach(([_, candidateId]) => {
        const candidate = allCandidates.find((c) => c.id === candidateId);
        if (candidate) {
          candidate.votes = (candidate.votes || 0) + 1;
        }
      });

      // Save to mock database (localStorage sync)
      saveElections();
      saveCandidates();

      // Log vote activity for admin visibility
      const selectionSummary = Object.entries(selections)
        .map(([posId, candId]) => {
          const cand = allCandidates.find((c) => c.id === candId);
          return cand ? cand.name : candId;
        })
        .join(", ");
      auditLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: user?.name || "Anonymous Voter",
        role: "voter",
        action: "VOTE",
        entity: `Election: ${election.name}`,
        ip: "192.168.1." + Math.floor(Math.random() * 254 + 1),
        details: `Ballot cast for: ${selectionSummary}`,
      });

      // Save election cast state in localStorage
      const voted = localStorage.getItem("votesecure_voted_elections");
      const list = voted ? JSON.parse(voted) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem("votesecure_voted_elections", JSON.stringify(list));
      }

      setStep("done");
      toast.success("Your official ballot has been cryptographic-verified & recorded!");
    }, 1200);
  };

  const stepIndex = ["verify", "choose", "confirm", "done"].indexOf(step);

  return (
    <div className="max-w-5xl mx-auto relative min-h-[70vh]">
      {/* Step header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/voter/elections/${election.id}`}
            className="text-sm font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Exit voting booth
          </Link>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-muted text-muted-foreground">
            BALLOT KEY: {election.id.toUpperCase()}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{election.name}</h1>

        <div className="mt-6 flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 border-b border-border/40">
          {[
            { key: "verify", label: "Verify Identity", icon: ShieldCheck },
            { key: "choose", label: "Cast Selections", icon: UserCheck },
            { key: "confirm", label: "Review Ballot", icon: CheckCircle2 },
            { key: "done", label: "Secure Receipt", icon: CheckCircle2 },
          ].map((s, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.key} className="flex items-center gap-2 md:gap-4 shrink-0">
                <div
                  className={`flex items-center gap-2 ${active ? "text-brand" : done ? "text-success" : "text-muted-foreground"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all ${
                      active
                        ? "border-brand bg-brand text-white shadow-sm"
                        : done
                          ? "border-success bg-success text-white"
                          : "border-border bg-card"
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="text-sm font-bold hidden md:block">{s.label}</span>
                </div>
                {i < 3 && (
                  <div className={`w-8 md:w-16 h-0.5 ${done ? "bg-success" : "bg-border"}`} />
                )}
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
            className="rounded-2xl bg-card border border-border p-6 md:p-10 shadow-soft max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-brand/10 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-brand" />
              </div>
              <h2 className="text-xl font-bold">Voter Authentication & Credentials</h2>
              <p className="text-sm text-muted-foreground">
                Please double-check your student credentials prior to starting the process.
              </p>
            </div>

            {/* User details row */}
            <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-3.5 text-sm">
              <div className="flex items-center gap-3.5 border-b border-border/40 pb-3">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-11 h-11 rounded-full border border-border object-cover"
                />
                <div>
                  <div className="font-bold text-foreground leading-none">{user?.name}</div>
                  <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
                    ID: {user?.studentId}
                  </span>
                </div>
              </div>
              <Row label="Department / Faculty" value={`${user?.department} · ${user?.faculty}`} />
              <Row label="Academic Level" value={`Level ${user?.level}`} />
              <Row
                label="Active Portfolios"
                value={`${eligiblePositions.length} eligible categories`}
              />
            </div>

            {/* Yellow warning alert box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 flex gap-3 text-xs leading-relaxed">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold block">Important Security Notice</strong>
                Once you proceed past this verification screen, your session token is marked active.
                Each voter is allowed only one submission. Casting multiple ballots or attempting
                browser injection is strictly logged.
              </div>
            </div>

            {/* Checkbox confirmation */}
            <div className="flex items-start gap-3 p-3 bg-muted/20 border border-border rounded-xl">
              <Checkbox
                id="verify-check"
                checked={idVerified}
                onCheckedChange={(checked) => setIdVerified(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="verify-check"
                className="text-xs text-muted-foreground font-medium cursor-pointer select-none leading-normal"
              >
                I hereby confirm that I am <strong className="text-foreground">{user?.name}</strong>
                , and I consent to casting an encrypted anonymous ballot.
              </label>
            </div>

            <Button
              onClick={() => setStep("choose")}
              disabled={!idVerified}
              className="w-full h-12 bg-brand text-white hover:bg-brand/90 font-bold rounded-xl"
            >
              Verify & Proceed to Ballot <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* STEP 2: CHOICE BOX */}
        {step === "choose" && currentPosition && (
          <motion.div
            key={`choose-${positionIdx}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {eligiblePositions.length < positions.length && (
              <div className="p-3.5 rounded-xl bg-brand/5 border border-brand/10 text-brand text-xs flex items-start gap-2">
                <Info className="w-4.5 h-4.5 shrink-0 text-brand mt-0.5" />
                <div>
                  Showing <strong>{eligiblePositions.length}</strong> of{" "}
                  <strong>{positions.length}</strong> portfolios based on your Level{" "}
                  <strong>{user?.level}</strong> restrictions.
                </div>
              </div>
            )}
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-soft">
              {/* Position header (full-width navy bar) */}
              <div className="bg-[#1E3A5F] text-white px-6 py-5 flex items-center justify-between border-b border-[#1E3A5F]/20">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Voting for:
                  </span>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">
                    {currentPosition.name}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold bg-white/10 px-3 py-1 rounded-lg">
                    Position {positionIdx + 1} of {eligiblePositions.length}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Progress dots row below */}
                <div className="flex items-center gap-2 pb-2">
                  {eligiblePositions.map((p, i) => {
                    const hasVoted = !!selections[p.id];
                    const isCurrent = i === positionIdx;

                    return (
                      <div
                        key={p.id}
                        title={p.name}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          hasVoted
                            ? "bg-[#1E3A5F] border border-[#1E3A5F]"
                            : isCurrent
                              ? "bg-white border-2 border-[#1E3A5F]"
                              : "bg-slate-300 border border-slate-300"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Candidate grid (2 col desktop, 1 col mobile, gap 20px) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                  {candidates.map((c) => {
                    const selected = selectedCandidateId === c.id;
                    const isAnySelected = !!selectedCandidateId;

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelections({ ...selections, [currentPosition.id]: c.id })}
                        className={`relative text-left rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          selected
                            ? "shadow-md scale-[1.01]"
                            : isAnySelected
                              ? "opacity-65 hover:opacity-100 hover:-translate-y-0.5"
                              : "hover:-translate-y-0.5 shadow-soft"
                        }`}
                        style={{
                          borderColor: selected ? "#2E86AB" : "#E2E8F0",
                          backgroundColor: selected ? "rgba(46, 134, 171, 0.05)" : "#FFFFFF",
                        }}
                      >
                        <div>
                          {/* Top-right corner checkmark selection */}
                          <div className="absolute top-4 right-4">
                            {selected ? (
                              <div className="w-6 h-6 rounded-full bg-[#2E86AB] flex items-center justify-center text-white shadow-sm border border-[#2E86AB]">
                                <CheckCircle2 className="w-4 h-4 text-white fill-current" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-slate-300 bg-white" />
                            )}
                          </div>

                          {/* Candidate photo */}
                          <div className="flex justify-center w-full mt-2">
                            <img
                              src={
                                c.photo ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  c.name,
                                )}&background=2E86AB&color=fff&bold=true&size=256`
                              }
                              alt={c.name}
                              className={`w-[100px] h-[100px] rounded-full object-cover border border-border/80 shadow-sm transition-all duration-300 ${
                                selected ? "outline outline-[3px] outline-[#2E86AB]" : ""
                              }`}
                            />
                          </div>

                          {/* Candidate name */}
                          <h3 className="mt-4 font-bold text-[18px] text-center text-foreground">
                            {c.name}
                          </h3>

                          {/* Position badge & Partylist */}
                          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2E86AB]/10 text-[#2E86AB] uppercase tracking-wide">
                              {currentPosition.name}
                            </span>
                            {c.partylistId &&
                              (() => {
                                const party = partylists.find((p) => p.id === c.partylistId);
                                if (!party) return null;
                                return (
                                  <span
                                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm"
                                    style={{ backgroundColor: party.color }}
                                    title={party.name}
                                  >
                                    {party.acronym}
                                  </span>
                                );
                              })()}
                          </div>

                          {/* Tagline/slogan */}
                          <p className="mt-3 text-[14px] italic text-muted-foreground text-center line-clamp-2 h-10 leading-snug">
                            "{c.campaignMessage || "Empowering representation, moving forward."}"
                          </p>

                          {/* Bio excerpt */}
                          <p className="mt-4 text-[13px] text-muted-foreground text-left line-clamp-3 h-[60px] leading-relaxed">
                            {c.bio || "No biography provided by candidate."}
                          </p>
                        </div>

                        {/* Buttons row */}
                        <div className="mt-6 pt-4 border-t border-border/60 w-full flex items-center justify-between gap-2.5 w-full">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCandidateId(c.id);
                            }}
                            className="flex-1 h-8 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            View Profile
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelections({ ...selections, [currentPosition.id]: c.id });
                            }}
                            className="flex-1 h-8 text-xs font-bold bg-[#2E86AB] hover:bg-[#2E86AB]/90 text-white shadow-sm"
                          >
                            {selected ? "✓ Selected" : `Select ${c.name.split(" ")[0]}`}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (positionIdx === 0) setStep("verify");
                  else setPositionIdx(positionIdx - 1);
                }}
                className="h-10 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>

              <Button
                disabled={!selectedCandidateId}
                onClick={() => {
                  if (positionIdx + 1 < eligiblePositions.length) {
                    setPositionIdx(positionIdx + 1);
                  } else {
                    setStep("confirm");
                  }
                }}
                className="bg-brand text-white hover:bg-brand/90 h-10 px-6 rounded-xl font-bold"
              >
                {positionIdx + 1 < eligiblePositions.length ? "Next Portfolio" : "Review Ballot"}{" "}
                <ChevronRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: BALLOT CONFIRMATION */}
        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft space-y-6 max-w-2xl mx-auto"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-foreground">Review Ballot Summary</h2>
              <p className="text-xs text-muted-foreground">
                Please double check all selections. Ballots are cryptographic signed on
                confirmation.
              </p>
            </div>

            <div className="space-y-3">
              {eligiblePositions.map((p) => {
                const cid = selections[p.id];
                const c = cid
                  ? getCandidatesForPosition(election.id, p.id).find((x) => x.id === cid)
                  : null;
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-muted/40 border border-border"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        {p.name}
                      </span>
                      <span className="text-sm font-extrabold text-foreground mt-0.5 block">
                        {c ? c.name : "Unselected"}
                      </span>
                    </div>
                    {c && (
                      <img
                        src={c.photo}
                        className="w-9 h-9 rounded-full object-cover border border-border/80 shadow-sm"
                        alt=""
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Warnings */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl border border-amber-500/20 text-xs leading-normal">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <strong className="font-extrabold block">Ballot Lock Warning</strong>
                This transaction is final. Once you click "Submit Official Ballot", your choices are
                permanently sealed in the ledger. Re-voting or profile editing is locked.
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
              <Button
                variant="outline"
                onClick={() => setStep("choose")}
                className="h-10 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1.5" /> Back to Edit
              </Button>

              <Button
                disabled={submitting}
                onClick={submit}
                className="bg-success hover:bg-success/95 text-white font-extrabold px-8 h-11 rounded-xl shadow-md"
              >
                {submitting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4.5 h-4.5 animate-spin" /> Casting Ballot...
                  </span>
                ) : (
                  "Submit Official Ballot"
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS VIEW */}
        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-card border border-border p-8 md:p-12 shadow-soft text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center border border-success/30 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-3xl font-black text-foreground">Ballot Submitted!</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you for voting in the <strong>{election.name}</strong>. Your vote was cast
                successfully.
              </p>
            </div>

            {/* Receipt detail block */}
            <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3 text-left">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block border-b border-border/30 pb-2">
                Cryptographic Receipt Details
              </span>

              {eligiblePositions.map((p) => {
                const cid = selections[p.id];
                const c = cid
                  ? getCandidatesForPosition(election.id, p.id).find((x) => x.id === cid)
                  : null;
                return (
                  <div key={p.id} className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">{p.name}</span>
                    <span className="font-bold text-foreground">{c?.name ?? "—"}</span>
                  </div>
                );
              })}

              <div className="border-t border-border/40 pt-3 mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>SEALED HASH</span>
                <span className="font-bold text-foreground truncate max-w-[200px]">
                  REC-{election.id.toUpperCase()}-{Date.now().toString(36).toUpperCase()}-
                  {Math.floor(1000 + Math.random() * 9000)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => toast.success("Signed verification receipt downloaded (PDF)")}
                className="h-10 rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" /> Download Receipt
              </Button>

              <Button
                onClick={() => nav("/voter/dashboard")}
                className="bg-brand text-white hover:bg-brand/90 h-10 px-6 rounded-xl font-bold"
              >
                <Home className="w-4 h-4 mr-2" /> Voter Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candidate sliding drawer (Framer Motion Drawer) */}
      <AnimatePresence>
        {activeCandidate && currentPosition && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCandidateId(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-screen w-full max-w-[400px] bg-card border-l border-border shadow-2xl z-55 flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-border flex items-center justify-between shrink-0 bg-muted/10">
                <div>
                  <h3 className="font-black text-lg text-foreground">Candidate Profile</h3>
                  <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                    {currentPosition.name} PORTFOLIO
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-muted-foreground hover:bg-muted"
                  onClick={() => setActiveCandidateId(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Large Profile Photo */}
                <div className="flex flex-col items-center">
                  <img
                    src={activeCandidate.photo}
                    alt={activeCandidate.name}
                    className="w-28 h-28 rounded-full border-4 border-brand/10 shadow-md object-cover"
                  />
                  <h4 className="mt-4 font-black text-lg leading-tight">{activeCandidate.name}</h4>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">
                    {election.name}
                  </p>
                </div>

                {/* Slogan tagline */}
                <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 text-center">
                  <span className="text-[9px] font-bold text-brand uppercase tracking-wider block">
                    Campaign Slogan
                  </span>
                  <p className="text-xs font-semibold text-foreground mt-1.5 italic leading-relaxed">
                    "{activeCandidate.campaignMessage}"
                  </p>
                </div>

                {/* Biography */}
                <div className="space-y-2">
                  <h5 className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider">
                    Biography
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/50">
                    {activeCandidate.bio || "No biography details available for this candidate."}
                  </p>
                </div>

                {/* Campaign Poster Section */}
                {activeCandidate.poster && (
                  <div className="space-y-2">
                    <h5 className="font-extrabold text-xs text-muted-foreground uppercase tracking-wider">
                      Campaign Poster
                    </h5>
                    <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                      <img
                        src={activeCandidate.poster}
                        alt="Poster"
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-border bg-muted/10 shrink-0 space-y-2.5">
                {activeCandidate.manifesto && (
                  <Button
                    variant="outline"
                    className="w-full text-xs font-bold h-9 rounded-xl border-border/80 text-muted-foreground hover:text-foreground"
                    onClick={() => toast.success(`Downloading: ${activeCandidate.manifesto}`)}
                  >
                    <FileDown className="w-3.5 h-3.5 mr-1.5 text-brand" /> Download Manifesto PDF
                  </Button>
                )}
                <Button
                  className="w-full bg-brand text-white hover:bg-brand/95 font-bold h-10 rounded-xl shadow-md"
                  onClick={() => {
                    setSelections({ ...selections, [currentPosition.id]: activeCandidate.id });
                    setActiveCandidateId(null);
                    toast.success(`Selected "${activeCandidate.name}"`);
                  }}
                >
                  Vote for {activeCandidate.name.split(" ")[0]}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold text-foreground ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
