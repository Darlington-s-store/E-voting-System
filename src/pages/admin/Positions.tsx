import { useState } from "react";
import { format } from "date-fns";
import {
  PlusCircle,
  Briefcase,
  Edit2,
  Trash2,
  Eye,
  ShieldAlert,
  Award,
  Users2,
  FileText,
  Calendar,
  Lock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { positions as initial, type Position, savePositions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// We now use the standard Position interface from mock-data.ts directly.

const preDefinedPositions = [
  "SRC President",
  "SRC Vice President",
  "General Secretary",
  "Financial Secretary",
  "Treasurer",
  "Women's Commissioner",
  "Organizing Secretary",
  "Public Relations Officer",
  "Hall President",
  "Hall Secretary",
  "Department President",
  "Department Secretary",
  "Class Representative",
  "Faculty Representative",
  "Judicial Board Representative",
  "Parliament Representative",
];

const formTabs = [
  "Basic Info",
  "Voting Settings",
  "Candidate Rules",
  "Voter Rules",
  "Security & Profile",
];

export default function Positions() {
  const [items, setItems] = useState<Position[]>(initial);
  const [open, setOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [inspectItem, setInspectItem] = useState<Position | null>(null);
  const [formTab, setFormTab] = useState(0);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [winners, setWinners] = useState(1);
  const [votingMethod, setVotingMethod] = useState<
    "Single Choice" | "Multiple Choice" | "Ranked Choice"
  >("Single Choice");
  const [maxVotes, setMaxVotes] = useState(1);
  const [startDate, setStartDate] = useState("2026-10-01T08:00");
  const [endDate, setEndDate] = useState("2026-10-03T18:00");
  const [minLevel, setMinLevel] = useState<"100" | "200" | "300" | "400" | "500">("200");
  const [minGpa, setMinGpa] = useState(2.0);
  const [noDisciplinary, setNoDisciplinary] = useState(true);
  const [activeStudent, setActiveStudent] = useState(true);
  const [deptRestrictions, setDeptRestrictions] = useState("");
  const [voterLevels, setVoterLevels] = useState("All Levels");
  const [voterFaculties, setVoterFaculties] = useState("All Faculties");
  const [voterDepts, setVoterDepts] = useState("All Departments");
  const [requirePoster, setRequirePoster] = useState(true);
  const [requireManifesto, setRequireManifesto] = useState(true);
  const [requireVideo, setRequireVideo] = useState(false);
  const [publicVisibility, setPublicVisibility] = useState<
    "Visible to everyone" | "Visible only during election"
  >("Visible to everyone");
  const [resultVisibility, setResultVisibility] = useState<
    "Show results immediately" | "Show after election closes" | "Only admins can view"
  >("Show after election closes");
  const [anonymousVoting, setAnonymousVoting] = useState(true);
  const [voteConfirmation, setVoteConfirmation] = useState(true);

  const save = () => {
    if (!name) {
      toast.error("Position name is required");
      return;
    }
    if (!code) {
      toast.error("Position code is required");
      return;
    }

    const payload: Position = {
      id: editingId || `p${Date.now()}`,
      name,
      code,
      description: desc,
      winners,
      votingMethod,
      maxVotes,
      startDate,
      endDate,
      minLevel,
      minGpa,
      noDisciplinary,
      activeStudent,
      deptRestrictions,
      voterLevels,
      voterFaculties,
      voterDepts,
      requirePoster,
      requireManifesto,
      requireVideo,
      publicVisibility,
      resultVisibility,
      anonymousVoting,
      voteConfirmation,
    };

    if (editingId) {
      const updated = items.map((x) => (x.id === editingId ? payload : x));
      initial.length = 0;
      updated.forEach((p) => initial.push(p));
      savePositions();
      setItems(updated);
      toast.success("Position configuration updated");
    } else {
      const updated = [...items, payload];
      initial.length = 0;
      updated.forEach((p) => initial.push(p));
      savePositions();
      setItems(updated);
      toast.success("Advanced Position added");
    }

    resetForm();
  };

  const handleEdit = (p: Position) => {
    setEditingId(p.id);
    setName(p.name);
    setCode(p.code);
    setDesc(p.description);
    setWinners(p.winners);
    setVotingMethod(p.votingMethod);
    setMaxVotes(p.maxVotes);
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setMinLevel(p.minLevel);
    setMinGpa(p.minGpa);
    setNoDisciplinary(p.noDisciplinary);
    setActiveStudent(p.activeStudent);
    setDeptRestrictions(p.deptRestrictions);
    setVoterLevels(p.voterLevels);
    setVoterFaculties(p.voterFaculties);
    setVoterDepts(p.voterDepts);
    setRequirePoster(p.requirePoster);
    setRequireManifesto(p.requireManifesto);
    setRequireVideo(p.requireVideo);
    setPublicVisibility(p.publicVisibility);
    setResultVisibility(p.resultVisibility);
    setAnonymousVoting(p.anonymousVoting);
    setVoteConfirmation(p.voteConfirmation);
    setFormTab(0);
    setOpen(true);
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setDesc("");
    setWinners(1);
    setVotingMethod("Single Choice");
    setMaxVotes(1);
    setStartDate("2026-10-01T08:00");
    setEndDate("2026-10-03T18:00");
    setMinLevel("200");
    setMinGpa(2.0);
    setNoDisciplinary(true);
    setActiveStudent(true);
    setDeptRestrictions("");
    setVoterLevels("All Levels");
    setVoterFaculties("All Faculties");
    setVoterDepts("All Departments");
    setRequirePoster(true);
    setRequireManifesto(true);
    setRequireVideo(false);
    setPublicVisibility("Visible to everyone");
    setResultVisibility("Show after election closes");
    setAnonymousVoting(true);
    setVoteConfirmation(true);
    setEditingId(null);
    setFormTab(0);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">SRC Positions</h1>
          <p className="text-muted-foreground text-sm">
            Configure advanced election rules and requirements for university portfolios.
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-brand text-white hover:bg-brand/90 h-10 px-4"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Position
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between hover:border-brand/40 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold">
                  {p.code.substring(0, 3)}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(p)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-danger hover:bg-danger/10 h-8 w-8"
                    onClick={() => {
                      const updated = items.filter((x) => x.id !== p.id);
                      initial.length = 0;
                      updated.forEach((x) => initial.push(x));
                      savePositions();
                      setItems(updated);
                      toast.success("Position deleted");
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base flex items-baseline gap-2">
                  {p.name}
                  <span className="text-[10px] font-mono text-muted-foreground">({p.code})</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
              </div>
            </div>

            {/* Quick Rule Badges */}
            <div className="mt-4 pt-4 border-t border-border space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                  Winners: {p.winners}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                  GPA: {p.minGpa.toFixed(1)}+
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple/10 text-purple">
                  Min Lvl: {p.minLevel}
                </span>
                {p.anonymousVoting && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                    Anonymous
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInspectItem(p);
                  setInspectOpen(true);
                }}
                className="w-full text-xs h-8"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Configuration
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Wizard Creation Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {editingId ? "Edit Position Configuration" : "Add Advanced Position"}
            </DialogTitle>
          </DialogHeader>

          {/* Form Tabs Header */}
          <div className="flex border-b border-border overflow-x-auto gap-1 mb-4 pb-px scrollbar-none">
            {formTabs.map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormTab(i)}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition shrink-0 ${
                  formTab === i
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4 py-1">
            {/* Tab 0: Basic Info */}
            {formTab === 0 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Position Name</Label>
                  <Select value={name} onValueChange={setName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select standard position or type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {preDefinedPositions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-1.5 flex gap-2">
                    <Input
                      placeholder="Or enter custom position name..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Position Code</Label>
                  <Input
                    placeholder="e.g. PRES001, VP001"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Unique identifier used for mapping ballots.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Position Description</Label>
                  <Textarea
                    placeholder="Describe the duties and responsibilities..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Tab 1: Voting Settings */}
            {formTab === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Number of Winners</Label>
                    <Input
                      type="number"
                      min={1}
                      value={winners}
                      onChange={(e) => setWinners(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Max Votes Allowed</Label>
                    <Input
                      type="number"
                      min={1}
                      value={maxVotes}
                      onChange={(e) => setMaxVotes(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Voting Method</Label>
                  <Select
                    value={votingMethod}
                    onValueChange={(v) => setVotingMethod(v as typeof votingMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Choice">Single Choice (Recommended)</SelectItem>
                      <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      <SelectItem value="Ranked Choice">Ranked Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Election Start Date</Label>
                    <Input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Election End Date</Label>
                    <Input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Candidate Eligibility */}
            {formTab === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Minimum Academic Level</Label>
                    <Select
                      value={minLevel}
                      onValueChange={(v) => setMinLevel(v as typeof minLevel)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["100", "200", "300", "400", "500"].map((lvl) => (
                          <SelectItem key={lvl} value={lvl}>
                            Level {lvl}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Minimum GPA Requirement</Label>
                    <Input
                      type="number"
                      step={0.1}
                      min={0.0}
                      max={4.0}
                      value={minGpa}
                      onChange={(e) => setMinGpa(parseFloat(e.target.value) || 0.0)}
                    />
                  </div>
                </div>

                <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    Academic Checks
                  </span>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <Checkbox
                      checked={noDisciplinary}
                      onCheckedChange={(v) => setNoDisciplinary(!!v)}
                    />
                    No Disciplinary Records Required
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer mt-2.5">
                    <Checkbox
                      checked={activeStudent}
                      onCheckedChange={(v) => setActiveStudent(!!v)}
                    />
                    Must be Active Registered Student
                  </label>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Department Restrictions</Label>
                  <Input
                    placeholder="e.g. Computer Science, Information Technology (leave empty for none)"
                    value={deptRestrictions}
                    onChange={(e) => setDeptRestrictions(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Voter Eligibility */}
            {formTab === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Eligible Levels</Label>
                  <Input
                    placeholder="e.g. All Levels, or 300, 400"
                    value={voterLevels}
                    onChange={(e) => setVoterLevels(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Eligible Faculties</Label>
                  <Input
                    placeholder="e.g. All Faculties, or Engineering, Business"
                    value={voterFaculties}
                    onChange={(e) => setVoterFaculties(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold">Eligible Departments</Label>
                  <Input
                    placeholder="e.g. All Departments, or Computer Science"
                    value={voterDepts}
                    onChange={(e) => setVoterDepts(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Security & Profile */}
            {formTab === 4 && (
              <div className="space-y-4">
                <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                    Required Candidate Uploads
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <Checkbox
                        checked={requirePoster}
                        onCheckedChange={(v) => setRequirePoster(!!v)}
                      />
                      Campaign Poster
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <Checkbox
                        checked={requireManifesto}
                        onCheckedChange={(v) => setRequireManifesto(!!v)}
                      />
                      Manifesto Text/PDF
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer col-span-2">
                      <Checkbox
                        checked={requireVideo}
                        onCheckedChange={(v) => setRequireVideo(!!v)}
                      />
                      Campaign Video (Optional)
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Public Visibility</Label>
                    <Select
                      value={publicVisibility}
                      onValueChange={(v) => setPublicVisibility(v as typeof publicVisibility)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Visible to everyone">Visible to everyone</SelectItem>
                        <SelectItem value="Visible only during election">
                          Visible only during election
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Result Visibility</Label>
                    <Select
                      value={resultVisibility}
                      onValueChange={(v) => setResultVisibility(v as typeof resultVisibility)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Show results immediately">
                          Show results immediately
                        </SelectItem>
                        <SelectItem value="Show after election closes">
                          Show after election closes
                        </SelectItem>
                        <SelectItem value="Only admins can view">Only admins can view</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 border border-warning/20 rounded-lg p-3 bg-warning/5">
                  <span className="text-xs font-semibold text-warning uppercase tracking-wider block mb-2">
                    Ballot Security
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <Checkbox
                        checked={anonymousVoting}
                        onCheckedChange={(v) => setAnonymousVoting(!!v)}
                      />
                      Anonymous Voting
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <Checkbox
                        checked={voteConfirmation}
                        onCheckedChange={(v) => setVoteConfirmation(!!v)}
                      />
                      Vote Confirmation
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="flex gap-1.5 mr-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={formTab === 0}
                onClick={() => setFormTab((t) => t - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={formTab === formTabs.length - 1}
                onClick={() => setFormTab((t) => t + 1)}
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={save} size="sm" className="bg-brand text-white hover:bg-brand/90">
                {editingId ? "Save Changes" : "Create Position"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Position Configuration Profile Inspector */}
      <Dialog open={inspectOpen} onOpenChange={setInspectOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          {inspectItem && (
            <>
              <DialogHeader className="pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold text-lg">
                    {inspectItem.code.substring(0, 3)}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-extrabold tracking-tight">
                      {inspectItem.name}
                    </DialogTitle>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      Code: {inspectItem.code}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 py-3 text-sm">
                <div>
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-1">
                    Description
                  </h4>
                  <p className="text-muted-foreground text-xs leading-relaxed bg-muted/30 p-3 rounded-lg border">
                    {inspectItem.description || "No description provided."}
                  </p>
                </div>

                {/* 2-Column Rules Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Panel 1: Election & Voting Rules */}
                  <div className="border rounded-xl p-4 bg-card space-y-3">
                    <h4 className="font-bold text-xs flex items-center gap-1.5 text-brand uppercase tracking-wider">
                      <Award className="w-4 h-4 text-brand" /> Voting Rules
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">Winners</span>
                        <span className="font-semibold">{inspectItem.winners}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">Voting Method</span>
                        <span className="font-semibold">{inspectItem.votingMethod}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">Max Votes</span>
                        <span className="font-semibold">{inspectItem.maxVotes}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block">Duration</span>
                        <span className="font-mono text-[10px] font-semibold text-foreground block">
                          {format(new Date(inspectItem.startDate), "PPp")}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground block">
                          to {format(new Date(inspectItem.endDate), "PPp")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 2: Candidate Eligibility */}
                  <div className="border rounded-xl p-4 bg-card space-y-3">
                    <h4 className="font-bold text-xs flex items-center gap-1.5 text-warning uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-warning" /> Candidate Rules
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">Minimum Level</span>
                        <span className="font-semibold">L-{inspectItem.minLevel}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">Minimum GPA</span>
                        <span className="font-semibold">{inspectItem.minGpa.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">No Disciplinary</span>
                        <span className="font-semibold">
                          {inspectItem.noDisciplinary ? "Required" : "Not Required"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">Active Student</span>
                        <span className="font-semibold">
                          {inspectItem.activeStudent ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-muted-foreground block">Dept. Restriction</span>
                        <span className="font-semibold text-foreground block truncate">
                          {inspectItem.deptRestrictions || "None (Open to all)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 3: Voter Eligibility */}
                  <div className="border rounded-xl p-4 bg-card space-y-3 col-span-2">
                    <h4 className="font-bold text-xs flex items-center gap-1.5 text-success uppercase tracking-wider">
                      <Users2 className="w-4 h-4 text-success" /> Voter Eligibility
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                          Levels
                        </span>
                        <span className="font-semibold text-foreground">
                          {inspectItem.voterLevels}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                          Faculties
                        </span>
                        <span
                          className="font-semibold text-foreground truncate block"
                          title={inspectItem.voterFaculties}
                        >
                          {inspectItem.voterFaculties}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                          Departments
                        </span>
                        <span
                          className="font-semibold text-foreground truncate block"
                          title={inspectItem.voterDepts}
                        >
                          {inspectItem.voterDepts}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Panel 4: Security & Uploads */}
                  <div className="border rounded-xl p-4 bg-card space-y-3 col-span-2 grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <h5 className="font-semibold text-xs flex items-center gap-1.5 text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" /> Candidate Profile
                      </h5>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Poster</span>
                          <span className="font-semibold text-success">
                            {inspectItem.requirePoster ? "Required" : "Optional"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Manifesto</span>
                          <span className="font-semibold text-success">
                            {inspectItem.requireManifesto ? "Required" : "Optional"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Video</span>
                          <span className="font-semibold text-muted-foreground">
                            {inspectItem.requireVideo ? "Required" : "Optional"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <h5 className="font-semibold text-xs flex items-center gap-1.5 text-muted-foreground">
                        <Lock className="w-3.5 h-3.5" /> Ballot Security
                      </h5>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Anonymous Voting</span>
                          <span className="font-semibold text-foreground">
                            {inspectItem.anonymousVoting ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vote Confirmation</span>
                          <span className="font-semibold text-foreground">
                            {inspectItem.voteConfirmation ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visibility</span>
                          <span
                            className="font-semibold text-foreground truncate w-24 block text-right"
                            title={inspectItem.resultVisibility}
                          >
                            {inspectItem.resultVisibility}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-border pt-3 mt-3">
                <Button
                  onClick={() => setInspectOpen(false)}
                  className="bg-brand text-white hover:bg-brand/90"
                >
                  Close Inspector
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
