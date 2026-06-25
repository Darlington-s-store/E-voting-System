import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Home,
  Instagram,
  Twitter,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  getElection,
  getPositionsForElection,
  getCandidatesForPosition,
  type Candidate,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Step = "welcome" | "nominate" | "confirm" | "done";

export default function AwardsVotingBooth() {
  const { id = "" } = useParams();
  const election = getElection(id);
  const categories = useMemo(() => getPositionsForElection(id), [id]);
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("welcome");
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Verification redirect
  useEffect(() => {
    if (!election || election.type !== "Campus Awards") {
      toast.error("Invalid awards show event");
      navigate("/voter/dashboard");
    }
  }, [election, navigate]);

  if (!election) return null;

  const currentCategory = categories[categoryIdx];
  const nominees = currentCategory ? getCandidatesForPosition(election.id, currentCategory.id) : [];
  const selectedNomineeId = currentCategory ? selections[currentCategory.id] : undefined;

  const submitVotes = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);

      // Save election cast state in localStorage
      const voted = localStorage.getItem("votesecure_voted_elections");
      const list = voted ? JSON.parse(voted) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem("votesecure_voted_elections", JSON.stringify(list));
      }

      setStep("done");
      toast.success("Congratulations! Your nominations have been officially recorded!");
    }, 1500);
  };

  // Generate dynamic canvas certificate and trigger download
  const downloadCertificate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient (Dark purple to navy)
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, "#1A0533");
    grad.addColorStop(1, "#1E3A5F");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);

    // Decorative Gold border
    ctx.strokeStyle = "#F4C430";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 560);

    ctx.strokeStyle = "#F4C430";
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 730, 530);

    // Draw Gold Stars in Corners
    ctx.fillStyle = "#F4C430";
    ctx.font = "24px serif";
    ctx.fillText("★", 60, 80);
    ctx.fillText("★", 720, 80);
    ctx.fillText("★", 60, 520);
    ctx.fillText("★", 720, 520);

    // Certificate Header text
    ctx.fillStyle = "#F4C430";
    ctx.textAlign = "center";
    ctx.font = "bold 28px Georgia, serif";
    ctx.fillText("CAMPUS AWARDS 2025", 400, 130);

    ctx.fillStyle = "#ffffff";
    ctx.font = "italic 20px sans-serif";
    ctx.fillText("OFFICIAL VOTING CERTIFICATE", 400, 180);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "14px sans-serif";
    ctx.fillText("This certificate confirms that", 400, 240);

    // Voter Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(user?.name || "Kwame Asante", 400, 295);

    // Divider line
    ctx.strokeStyle = "rgba(244, 196, 48, 0.3)";
    ctx.beginPath();
    ctx.moveTo(200, 325);
    ctx.lineTo(600, 325);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = "15px sans-serif";
    ctx.fillText(
      "has successfully cast their encrypted ballot in all nominated categories.",
      400,
      370,
    );
    ctx.fillText("Your vote helps celebrate student excellence across our campus.", 400, 395);

    // Election Details
    ctx.fillStyle = "#F4C430";
    ctx.font = "bold 15px monospace";
    ctx.fillText(
      `RECEIPT: CA-${election.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      400,
      455,
    );

    // Digital signature marker
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "11px monospace";
    ctx.fillText("VERIFIED BY VOTESECURE PROTOCOL", 400, 510);

    // Trigger PNG Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Voter_Certificate_${election.name.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();
    toast.success("Your official Awards Voting Certificate has been downloaded!");
  };

  const stepIndex = ["welcome", "nominate", "confirm", "done"].indexOf(step);

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#1A0533] to-[#1E3A5F] text-white rounded-2xl p-6 md:p-10 shadow-xl border border-[#F4C430]/15 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative stars overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10">
          <Sparkles className="w-16 h-16 text-[#F4C430]" />
        </div>
        <div className="absolute bottom-20 right-10">
          <Sparkles className="w-24 h-24 text-[#F4C430]" />
        </div>
        <div className="absolute top-1/2 right-1/3">
          <Sparkles className="w-12 h-12 text-[#F4C430]" />
        </div>
      </div>

      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/voter/dashboard"
            className="text-xs font-bold text-purple-200 hover:text-[#F4C430] flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Exit Awards Show
          </Link>
          <span className="text-[10px] font-bold font-mono px-3 py-1 rounded-full bg-[#F4C430]/10 border border-[#F4C430]/35 text-[#F4C430] tracking-wider uppercase">
            AWARDS NIGHT 2025
          </span>
        </div>

        {/* Step dots */}
        {step !== "done" && (
          <div className="flex items-center gap-2 mb-6 bg-black/20 p-2 rounded-xl border border-white/5 w-fit">
            {["welcome", "nominate", "confirm"].map((s, i) => {
              const active = step === s;
              const completed = stepIndex > i;
              return (
                <div
                  key={s}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1"
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      active
                        ? "bg-[#F4C430] border-[#F4C430] text-black"
                        : completed
                          ? "bg-success border-success text-white"
                          : "border-white/20 text-white/40"
                    }`}
                  >
                    {completed ? "✓" : i + 1}
                  </span>
                  <span
                    className={`hidden sm:inline capitalize ${active ? "text-white" : "text-white/40"}`}
                  >
                    {s === "nominate" ? "Nominations" : s}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTENT PANEL */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME SCREEN */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6 max-w-xl mx-auto py-6"
            >
              <div className="relative w-20 h-20 mx-auto bg-[#F4C430]/10 border border-[#F4C430]/30 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-[#F4C430] animate-bounce" />
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#F4C430] animate-pulse" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-white">
                  Welcome to the <span className="text-[#F4C430]">{election.name}</span>
                </h1>
                <p className="text-sm text-purple-200/80 leading-relaxed">
                  Celebrate and reward student leadership, style, and resilience. As an authorized
                  voter, you will cast nominations across{" "}
                  <strong className="text-[#F4C430]">{categories.length} categories</strong>.
                </p>
              </div>

              {/* Security note */}
              <div className="bg-black/25 border border-[#F4C430]/10 p-4 rounded-xl text-left text-xs text-purple-200/75 leading-relaxed space-y-2">
                <div className="font-bold text-[#F4C430] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> SECURE VOTING PROTOCOL
                </div>
                <p>
                  Your choices are cryptographically signed. To submit a valid ballot, you must cast
                  a selection in each category. You will receive an official voting certificate at
                  completion.
                </p>
              </div>

              <Button
                onClick={() => setStep("nominate")}
                className="bg-[#F4C430] hover:bg-[#F4C430]/95 text-black font-extrabold px-8 h-12 rounded-xl transition-all shadow-md hover:-translate-y-0.5"
              >
                Begin Nominations <ArrowRight className="ml-2 w-4.5 h-4.5" />
              </Button>
            </motion.div>
          )}

          {/* STEP 2: NOMINATIONS SLIDES */}
          {step === "nominate" && currentCategory && (
            <motion.div
              key={`nominate-${categoryIdx}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-6"
            >
              {/* Category info */}
              <div className="flex justify-between items-end flex-wrap gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#F4C430] uppercase tracking-wider block">
                    Category {categoryIdx + 1} of {categories.length}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    Nominate for: <span className="text-[#F4C430]">{currentCategory.name}</span>
                  </h2>
                  <p className="text-xs text-purple-200/80 mt-1">{currentCategory.description}</p>
                </div>

                {/* Progress bar dots */}
                <div className="flex gap-1.5 shrink-0 bg-black/20 p-1.5 rounded-lg border border-white/5">
                  {categories.map((_, i) => (
                    <span
                      key={i}
                      className={`w-5 h-1.5 rounded-full transition-all ${
                        i === categoryIdx
                          ? "bg-[#F4C430] w-8"
                          : i < categoryIdx
                            ? "bg-success"
                            : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Nominees Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nominees.map((n) => {
                  const selected = selectedNomineeId === n.id;
                  const isAnySelected = !!selectedNomineeId;
                  return (
                    <div
                      key={n.id}
                      onClick={() => setSelections({ ...selections, [currentCategory.id]: n.id })}
                      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 cursor-pointer flex flex-col justify-between ${
                        selected
                          ? "border-[#F4C430] bg-[#F4C430]/10 shadow-lg shadow-[#F4C430]/5 scale-[1.01]"
                          : isAnySelected
                            ? "border-white/5 bg-white/5 opacity-50 hover:opacity-100 hover:border-white/20"
                            : "border-white/10 bg-white/5 hover:border-[#F4C430]/40 hover:-translate-y-0.5 shadow-md"
                      }`}
                    >
                      {/* Selection gold check */}
                      {selected && (
                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#F4C430] flex items-center justify-center text-black shadow-md border border-white/10">
                          <CheckCircle2 className="w-4 h-4 text-black fill-current" />
                        </div>
                      )}

                      <div>
                        {/* Profile Photo */}
                        <div className="flex justify-center mb-4">
                          <img
                            src={n.photo}
                            alt={n.name}
                            className="w-20 h-20 rounded-[18px] object-cover border-2 border-white/10 shadow-inner"
                          />
                        </div>

                        <h3 className="font-bold text-base text-white text-center">{n.name}</h3>

                        {/* Tagline / Message */}
                        <p className="text-[10px] text-center text-purple-200/70 mt-1 italic leading-snug px-2">
                          "{n.campaignMessage || "Dedicated to candidate success."}"
                        </p>

                        {/* Bio */}
                        <p className="text-xs text-purple-200/60 mt-3 leading-relaxed text-center line-clamp-3">
                          {n.bio}
                        </p>

                        {/* Fun fact badge */}
                        {n.funFact && (
                          <div className="mt-3 p-2 bg-black/35 rounded-lg border border-white/5 text-[10px] text-purple-200 flex items-start gap-1">
                            <Sparkles className="w-3 h-3 text-[#F4C430] shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-[#F4C430]">Fact:</strong> {n.funFact}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Social handles */}
                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-center gap-3 text-[10px] text-purple-200/80 font-semibold shrink-0">
                        {n.instagram && (
                          <span className="flex items-center gap-1 hover:text-white">
                            <Instagram className="w-3 h-3 text-[#E1306C]" /> {n.instagram}
                          </span>
                        )}
                        {n.twitter && (
                          <span className="flex items-center gap-1 hover:text-white">
                            <Twitter className="w-3 h-3 text-[#1DA1F2]" /> {n.twitter}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nomination Flow Action buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (categoryIdx === 0) setStep("welcome");
                    else setCategoryIdx(categoryIdx - 1);
                  }}
                  className="h-10 text-xs font-bold text-purple-200 hover:text-white hover:bg-white/5 rounded-xl border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>

                <Button
                  disabled={!selectedNomineeId}
                  onClick={() => {
                    if (categoryIdx + 1 < categories.length) {
                      setCategoryIdx(categoryIdx + 1);
                    } else {
                      setStep("confirm");
                    }
                  }}
                  className="bg-[#F4C430] hover:bg-[#F4C430]/95 text-black font-extrabold h-10 px-6 rounded-xl transition-all shadow-md"
                >
                  {categoryIdx + 1 < categories.length ? "Next Category" : "Review Choices"}{" "}
                  <ChevronRight className="ml-1.5 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: BALLOT REVIEW */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-white">Review Your Ballots</h2>
                <p className="text-xs text-purple-200/80">
                  Please review your campus awards choices before finalizing.
                </p>
              </div>

              <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                {categories.map((p) => {
                  const cid = selections[p.id];
                  const c = cid
                    ? getCandidatesForPosition(election.id, p.id).find((x) => x.id === cid)
                    : null;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#F4C430] uppercase tracking-wider block">
                          {p.name}
                        </span>
                        <span className="text-sm font-extrabold text-white mt-0.5 block">
                          {c ? c.name : "Unselected"}
                        </span>
                      </div>
                      {c && (
                        <img
                          src={c.photo}
                          className="w-9 h-9 rounded-[10px] object-cover border border-white/10"
                          alt=""
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={() => setStep("nominate")}
                  className="h-10 text-xs font-bold text-purple-200 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1.5" /> Back to Nominate
                </Button>

                <Button
                  disabled={submitting}
                  onClick={submitVotes}
                  className="bg-[#F4C430] hover:bg-[#F4C430]/95 text-black font-extrabold px-8 h-11 rounded-xl shadow-md"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-4.5 h-4.5 animate-spin" /> Sealing Ballot...
                    </span>
                  ) : (
                    "Submit Official Choices"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CELEBRATION SUCCESS SCREEN */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 max-w-xl mx-auto py-6"
            >
              {/* Confetti star cluster illustration */}
              <div className="relative w-20 h-20 mx-auto bg-green-500/10 border border-green-500/35 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-9 h-9 text-[#F4C430]" />
                <CheckCircle2 className="absolute bottom-0 right-0 w-6 h-6 text-success bg-black rounded-full" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-black text-white">Ballot Submitted!</h1>
                <p className="text-xs text-purple-200/80 max-w-md mx-auto leading-relaxed">
                  Thank you for casting your choices in the <strong>{election.name}</strong>. Your
                  vote is verified and sealed.
                </p>
              </div>

              {/* HTML visual preview of Certificate */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#240A44] to-[#1E3A5F] border-2 border-[#F4C430]/40 text-left shadow-lg overflow-hidden space-y-3">
                <div className="absolute top-2 right-2 text-white/5 pointer-events-none">
                  <Star className="w-20 h-20 fill-current" />
                </div>
                <div className="text-center border-b border-white/10 pb-3">
                  <span className="text-[10px] font-bold text-[#F4C430] uppercase tracking-wider font-mono">
                    Official Verification Token
                  </span>
                  <h3 className="font-extrabold text-sm text-white mt-1">
                    CAMPUS AWARDS CERTIFICATE
                  </h3>
                </div>
                <div className="space-y-1.5 text-xs text-purple-200/80">
                  <Row label="Nominated Voter" value={user?.name || ""} />
                  <Row label="Verification Date" value={format(new Date(), "PPP p")} />
                  <Row label="Categories Cast" value={`${categories.length} award preset lists`} />
                </div>
                <div className="border-t border-white/15 pt-2 flex justify-between font-mono text-[9px] text-[#F4C430]">
                  <span>VERIFICATION HASH</span>
                  <span className="truncate max-w-[180px]">
                    CA-{election.id.toUpperCase()}-{Date.now().toString(36).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Download actions */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={downloadCertificate}
                  className="h-10 rounded-xl border-white/20 text-[#F4C430] hover:text-[#F4C430] hover:bg-white/5 bg-transparent font-bold"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Voting Certificate
                </Button>

                <Button
                  onClick={() => navigate("/voter/dashboard")}
                  className="bg-white hover:bg-white/95 text-black font-extrabold h-10 px-6 rounded-xl shadow-md"
                >
                  <Home className="w-4 h-4 mr-1.5" /> Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-xs leading-normal">
      <span className="text-purple-200/60 font-semibold">{label}</span>
      <span className="font-bold text-white text-right">{value}</span>
    </div>
  );
}
