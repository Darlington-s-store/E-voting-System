import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  FileText,
  Instagram,
  Twitter,
  Sparkles,
  User,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  Vote,
  GraduationCap,
  ShieldCheck,
  Activity,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import {
  positions,
  elections,
  candidates,
  saveCandidates,
  type Candidate,
  type Position,
  type Election,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ApplyCandidacy() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Wizard Steps: 1 = Office, 2 = Eligibility, 3 = Campaign, 4 = Review/Success
  const [step, setStep] = useState(1);

  // Form states
  const [electionId, setElectionId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [bio, setBio] = useState("");
  const [campaignMessage, setCampaignMessage] = useState("");
  const [funFact, setFunFact] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  // Media states
  const [photoUrl, setPhotoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<{ name: string; size: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Selections
  const selectedElection = elections.find((e) => e.id === electionId);
  const selectedPosition = positions.find((p) => p.id === positionId);
  const isAwards = selectedElection?.type === "Campus Awards";

  // Filter positions based on selected election
  const filteredPositions = positions.filter((pos) => {
    if (!electionId) return false;
    return selectedElection?.positionIds.includes(pos.id);
  });

  // Reset positionId when election changes
  useEffect(() => {
    setPositionId("");
  }, [electionId]);

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG/JPG/WEBP)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    setPhotoUrl(await readAsDataUrl(file));
    toast.success("Profile photo uploaded!");
  };

  // Poster Upload
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG/JPG/WEBP)");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Poster must be less than 3MB");
      return;
    }
    setPosterUrl(await readAsDataUrl(file));
    toast.success("Campaign poster uploaded!");
  };

  // PDF Manifesto Upload
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF documents are allowed for the manifesto");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Manifesto size must be less than 5MB");
      return;
    }
    setPdfFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    });
    toast.success("Manifesto PDF uploaded!");
  };

  // Check Eligibility
  const checkEligibility = () => {
    if (!selectedPosition) return { eligible: false, checks: [] };

    const checks = [];
    let eligible = true;

    // Academic Level Check
    const userLevelNum = parseInt(user?.level || "100", 10);
    const requiredLevelNum = parseInt(selectedPosition.minLevel || "100", 10);
    const levelPassed = userLevelNum >= requiredLevelNum;
    if (!levelPassed) eligible = false;
    checks.push({
      id: "level",
      name: "Academic Level Requirement",
      detail: `Your Level: ${user?.level || "N/A"}, Required: ${selectedPosition.minLevel}+`,
      passed: levelPassed,
    });

    // GPA Check (Mock CGPA: 3.45)
    const voterGpa = 3.45;
    const gpaPassed = voterGpa >= selectedPosition.minGpa;
    if (!gpaPassed) eligible = false;
    checks.push({
      id: "gpa",
      name: "CGPA Requirement",
      detail: `Your GPA: ${voterGpa.toFixed(2)}, Required: ${selectedPosition.minGpa.toFixed(2)}+`,
      passed: gpaPassed,
    });

    // Disciplinary Status Check (Mock: Clean)
    const disciplinaryPassed = !selectedPosition.noDisciplinary; // If noDisciplinary is true, mock Clean passes
    checks.push({
      id: "disciplinary",
      name: "Disciplinary Record",
      detail: `Your Status: Clean, Required: ${
        selectedPosition.noDisciplinary ? "No disciplinary records" : "No restrictions"
      }`,
      passed: true, // Always passes since student's mock record is Clean
    });

    // Active Student Check
    const activeStudentPassed = selectedPosition.activeStudent;
    checks.push({
      id: "active",
      name: "Active Enrollment Status",
      detail: "Your Status: Active student, Required: Active student",
      passed: activeStudentPassed,
    });

    // Faculty Check
    if (selectedPosition.voterFaculties && selectedPosition.voterFaculties !== "All Faculties") {
      const userFaculty = user?.faculty || "";
      const facultyPassed =
        selectedPosition.voterFaculties.toLowerCase().trim() === userFaculty.toLowerCase().trim();
      if (!facultyPassed) eligible = false;
      checks.push({
        id: "faculty",
        name: "Faculty Restriction Check",
        detail: `Your Faculty: ${userFaculty || "N/A"}, Required: ${selectedPosition.voterFaculties}`,
        passed: facultyPassed,
      });
    }

    // Department Check
    if (selectedPosition.voterDepts && selectedPosition.voterDepts !== "All Departments") {
      const userDept = user?.department || "";
      const deptPassed =
        selectedPosition.voterDepts.toLowerCase().trim() === userDept.toLowerCase().trim();
      if (!deptPassed) eligible = false;
      checks.push({
        id: "dept",
        name: "Department Restriction Check",
        detail: `Your Dept: ${userDept || "N/A"}, Required: ${selectedPosition.voterDepts}`,
        passed: deptPassed,
      });
    }

    return { eligible, checks };
  };

  const { eligible: isEligible, checks: eligibilityChecks } = checkEligibility();

  // Handle Form Submission
  const handleSubmitApplication = () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    if (!electionId || !positionId) {
      toast.error("Office selection is incomplete");
      return;
    }
    if (!isEligible) {
      toast.error("You do not meet the eligibility requirements for this position");
      return;
    }
    if (!bio.trim()) {
      toast.error("Biography is required");
      return;
    }
    if (!campaignMessage.trim()) {
      toast.error("Campaign message/tagline is required");
      return;
    }
    if (selectedPosition?.requirePoster && !posterUrl) {
      toast.error("Campaign poster is required for this position");
      return;
    }
    if (selectedPosition?.requireManifesto && !pdfFile) {
      toast.error("Manifesto PDF is required for this position");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create new candidate application with "pending" status
      const newCandidate: Candidate = {
        id: `c-${positionId}-${Date.now()}`,
        name: user.name,
        positionId,
        electionId,
        bio,
        campaignMessage,
        photo:
          photoUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name,
          )}&background=059669&color=fff&bold=true&size=256`,
        votes: 0,
        poster: posterUrl || undefined,
        manifesto: pdfFile ? pdfFile.name : undefined,
        funFact: isAwards ? funFact : undefined,
        instagram: instagram.trim() ? instagram.trim() : undefined,
        twitter: twitter.trim() ? twitter.trim() : undefined,
        status: "pending",
      };

      candidates.push(newCandidate);
      saveCandidates();

      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setStep(4);
      toast.success("Candidacy application submitted successfully!");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Register Candidacy
        </h1>
        <p className="text-muted-foreground mt-1">
          Apply to run for student offices, verify your eligibility, and submit your campaign
          details.
        </p>
      </div>

      {/* Steper navigation */}
      <div className="flex items-center justify-between border border-border/80 bg-card rounded-2xl p-4 shadow-sm">
        {[
          { num: 1, label: "Select Office" },
          { num: 2, label: "Eligibility Check" },
          { num: 3, label: "Campaign Profile" },
          { num: 4, label: "Status & Review" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s.num
                  ? "bg-[#059669] text-white ring-4 ring-emerald-500/20"
                  : step > s.num || (submissionSuccess && s.num === 4)
                    ? "bg-emerald-500/20 text-[#059669]"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num || (submissionSuccess && s.num === 4) ? (
                <Check className="w-4 h-4" />
              ) : (
                s.num
              )}
            </div>
            <span
              className={`text-xs font-bold hidden md:inline ${
                step === s.num ? "text-[#065F46]" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {s.num < 4 && <div className="h-0.5 w-10 sm:w-16 bg-border/40 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* STEP 1: SELECT OFFICE */}
      {step === 1 && (
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="space-y-2 border-b border-border/80 pb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Vote className="w-5 h-5 text-[#047857]" /> Contested Office Selection
            </h2>
            <p className="text-xs text-muted-foreground">
              Choose the election event and target position or category you want to apply for.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Election Event <span className="text-danger">*</span>
              </Label>
              <Select value={electionId} onValueChange={setElectionId}>
                <SelectTrigger className="hover:border-emerald-600/40">
                  <SelectValue placeholder="Select election event" />
                </SelectTrigger>
                <SelectContent>
                  {elections
                    .filter((e) => e.status === "open" || e.status === "scheduled")
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name} ({e.status.toUpperCase()})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Target Position / Category <span className="text-danger">*</span>
              </Label>
              <Select value={positionId} onValueChange={setPositionId} disabled={!electionId}>
                <SelectTrigger className="hover:border-emerald-600/40">
                  <SelectValue
                    placeholder={electionId ? "Select a position" : "Choose election event first"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredPositions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPosition && (
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-emerald-200/50 mt-4 space-y-2 animate-fade-in">
              <h3 className="text-xs font-bold text-[#065F46]">Position Rules & Requirements:</h3>
              <p className="text-xs text-[#065F46]/80 leading-relaxed">
                {selectedPosition.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-semibold">
                <div className="text-muted-foreground">
                  Min CGPA:{" "}
                  <span className="text-[#065F46] font-bold">
                    {selectedPosition.minGpa.toFixed(2)}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Min Level:{" "}
                  <span className="text-[#065F46] font-bold">{selectedPosition.minLevel}</span>
                </div>
                <div className="text-muted-foreground">
                  Manifesto PDF:{" "}
                  <span className="text-[#065F46] font-bold">
                    {selectedPosition.requireManifesto ? "Required" : "Optional"}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Poster Image:{" "}
                  <span className="text-[#065F46] font-bold">
                    {selectedPosition.requirePoster ? "Required" : "Optional"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-border/60">
            <Button
              onClick={() => setStep(2)}
              disabled={!electionId || !positionId}
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold"
            >
              Continue to Eligibility Check <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: ELIGIBILITY CHECK */}
      {step === 2 && (
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft space-y-6 animate-fade-in">
          <div className="space-y-2 border-b border-border/80 pb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#047857]" /> Academic & Disciplinary Review
            </h2>
            <p className="text-xs text-muted-foreground">
              We verify your student credentials against constraints defined for this position.
            </p>
          </div>

          <div className="space-y-4">
            {eligibilityChecks.map((check) => (
              <div
                key={check.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                  check.passed
                    ? "bg-[#F0FDF4] border-emerald-200/50 text-[#065F46]"
                    : "bg-danger/5 border-danger/20 text-danger"
                }`}
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">{check.name}</h4>
                  <p className="text-xs opacity-80 font-mono">{check.detail}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    check.passed ? "bg-[#059669] text-white" : "bg-danger text-white"
                  }`}
                >
                  {check.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>

          {isEligible ? (
            <div className="p-4 rounded-xl bg-[#F0FDF4] border border-emerald-200 text-[#065F46] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#047857] shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold block">All Requirements Satisfied</span>
                You meet all constraints. You are cleared to submit campaign materials.
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 text-danger flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold block">Eligibility Check Failed</span>
                You do not meet one or more constraints to contest for this position. Please contact
                the administrator.
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-border/60">
            <Button variant="outline" onClick={() => setStep(1)} className="border-border">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Change Office
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!isEligible}
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold"
            >
              Setup Campaign Profile <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CAMPAIGN PROFILE */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Media Attachments */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
              <h2 className="font-bold text-lg border-b border-border pb-3 text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#047857]" /> Campaign Media
              </h2>

              {/* Profile Photo */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Campaign Avatar</Label>
                <div className="flex flex-col items-center p-4 rounded-xl border border-dashed border-border hover:border-emerald-600/40 bg-muted/20 transition-all">
                  <div className="relative mb-4">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Profile preview"
                        className={`w-28 h-28 object-cover shadow-md ${
                          isAwards
                            ? "rounded-[24px] ring-4 ring-[#F4C430]/30"
                            : "rounded-full ring-4 ring-emerald-500/10"
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-28 h-28 bg-muted flex flex-col items-center justify-center text-muted-foreground border border-border shadow-inner ${
                          isAwards ? "rounded-[24px]" : "rounded-full"
                        }`}
                      >
                        <User className="w-8 h-8" />
                        <span className="text-[10px] mt-1">No Image</span>
                      </div>
                    )}
                    {photoUrl && (
                      <button
                        onClick={() => setPhotoUrl("")}
                        className="absolute -top-1 -right-1 bg-danger text-white rounded-full p-1 shadow-md hover:bg-danger/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold border-border"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> Select Photo
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-2">Max 2MB. JPG, PNG, WEBP.</p>
                </div>
              </div>

              {/* Campaign Poster */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Campaign Poster (Landscape){" "}
                  {selectedPosition?.requirePoster && <span className="text-danger">*</span>}
                </Label>
                <div className="flex flex-col items-center p-4 rounded-xl border border-dashed border-border hover:border-emerald-600/40 bg-muted/20 transition-all">
                  {posterUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border mb-3 shadow-sm">
                      <img
                        src={posterUrl}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setPosterUrl("")}
                        className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 shadow-md hover:bg-danger/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-muted border border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground mb-3 shadow-inner">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/60" />
                      <span className="text-[11px] mt-1 font-medium">Add Landscape Poster</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={posterInputRef}
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => posterInputRef.current?.click()}
                    className="text-xs font-semibold border-border"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> Choose Poster Image
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Max 3MB. PNG, JPG (16:9 ratio).
                  </p>
                </div>
              </div>

              {/* PDF Manifesto */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">
                  Manifesto Document (PDF){" "}
                  {selectedPosition?.requireManifesto && <span className="text-danger">*</span>}
                </Label>
                {pdfFile ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-[#F0FDF4] shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#059669] shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{pdfFile.name}</p>
                        <p className="text-[10px] text-muted-foreground">{pdfFile.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-danger hover:bg-danger/5"
                      onClick={() => setPdfFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-4 rounded-xl border border-dashed border-border hover:border-emerald-600/40 bg-muted/20 transition-all">
                    <input
                      type="file"
                      ref={pdfInputRef}
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => pdfInputRef.current?.click()}
                      className="text-xs font-semibold border-border"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1" /> Select Manifesto PDF
                    </Button>
                    <p className="text-[10px] text-muted-foreground mt-2">PDF file up to 5MB.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft space-y-5">
              <h2 className="font-bold text-lg border-b border-border pb-3 text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#047857]" /> Campaign Pitch & Info
              </h2>

              {/* Bio */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold text-foreground">
                    Biography <span className="text-danger">*</span>
                  </Label>
                  <span
                    className={`text-[10px] ${
                      bio.length > 500 ? "text-danger" : "text-muted-foreground"
                    }`}
                  >
                    {bio.length}/500 chars
                  </span>
                </div>
                <Textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Introduce yourself, your academic year, activities, and track record..."
                  maxLength={520}
                  className="hover:border-emerald-600/40"
                />
              </div>

              {/* Tagline / Message */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-semibold text-foreground">
                    Campaign Tagline / Slogan <span className="text-danger">*</span>
                  </Label>
                  <span
                    className={`text-[10px] ${
                      campaignMessage.length > 120 ? "text-danger" : "text-muted-foreground"
                    }`}
                  >
                    {campaignMessage.length}/120 chars
                  </span>
                </div>
                <Input
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="e.g. Empowering Students, Elevating Representation."
                  maxLength={130}
                  className="hover:border-emerald-600/40"
                />
              </div>

              {/* Fun Fact (Campus Awards) */}
              {isAwards && (
                <div className="space-y-2 p-4 rounded-xl bg-[#F4C430]/5 border border-[#F4C430]/20 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4A017]">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Awards Nominee Fun Fact
                  </div>
                  <Label className="text-xs text-muted-foreground mt-1">
                    What is a fun, lighthearted fact about you that voters would love to know?
                  </Label>
                  <Input
                    value={funFact}
                    onChange={(e) => setFunFact(e.target.value)}
                    placeholder="e.g. Speaks 4 languages or plays the saxophone."
                    className="bg-card border-border hover:border-[#F4C430]/40 focus:border-[#F4C430]"
                  />
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-4 pt-3 border-t border-border/80">
                <h3 className="text-sm font-bold text-foreground">Social Links (Optional)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <Instagram className="w-3.5 h-3.5 text-[#E1306C]" /> Instagram Handle
                    </Label>
                    <Input
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@username"
                      className="h-9 text-xs hover:border-emerald-600/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                      <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" /> Twitter Handle
                    </Label>
                    <Input
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="@username"
                      className="h-9 text-xs hover:border-emerald-600/40"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-6 border-t border-border/60">
                <Button variant="outline" onClick={() => setStep(2)} className="border-border">
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Eligibility
                </Button>
                <Button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting}
                  className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-6 shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <>
                      Submit Application <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & SUCCESS */}
      {step === 4 && submissionSuccess && (
        <div className="rounded-2xl border border-border bg-card p-6 md:p-10 shadow-soft text-center space-y-6 animate-fade-in max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-[#059669] mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground">Application Received!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Your candidacy application for <strong>{selectedPosition?.name}</strong> in the{" "}
              <strong>{selectedElection?.name}</strong> has been submitted successfully and is
              currently <span className="font-extrabold text-[#F97316]">PENDING</span>{" "}
              administrative moderation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border/80 text-left space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-2.5 border-b border-border/80">
              <div>
                <span className="text-muted-foreground block">Contesting Office</span>
                <span className="font-bold text-foreground">{selectedPosition?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Election Period</span>
                <span className="font-bold text-foreground">{selectedElection?.name}</span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Campaign Slogan</span>
              <p className="font-bold italic text-foreground">"{campaignMessage}"</p>
            </div>
            {pdfFile && (
              <div className="flex items-center gap-2 text-[#059669] font-semibold bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Manifesto Attached: {pdfFile.name}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[#065F46] text-xs flex gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-foreground">
                Next Steps: Moderation Phase
              </span>
              The Election Commission will audit your submission. You will be notified via email or
              dashboard alert when your profile is approved and set to{" "}
              <span className="text-[#059669] font-bold">Active</span> status, allowing voters to
              see and vote for you.
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              onClick={() => navigate("/voter/dashboard")}
              className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 shadow-md"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
