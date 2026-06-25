import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Save, PlusCircle, Vote, Star } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  positions,
  awardCategoriesPresets,
  savePositions,
  saveElections,
  elections,
  voters,
} from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const steps = ["Basic Info", "Positions", "Eligibility", "Schedule", "Review"];

export default function CreateElection() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "General",
    positions: [] as string[],
    eligibility: { faculty: "all", level: "all" },
    startDate: "",
    endDate: "",
  });
  const nav = useNavigate();

  const [availablePositions, setAvailablePositions] = useState(positions);
  const [createPosOpen, setCreatePosOpen] = useState(false);
  const [newPosName, setNewPosName] = useState("");
  const [newPosCode, setNewPosCode] = useState("");
  const [newPosDesc, setNewPosDesc] = useState("");
  const [newPosWinners, setNewPosWinners] = useState(1);
  const [newPosMethod, setNewPosMethod] = useState<
    "Single Choice" | "Multiple Choice" | "Ranked Choice"
  >("Single Choice");

  const saveNewPosition = () => {
    if (!newPosName || !newPosCode) {
      toast.error("Name and Code are required");
      return;
    }
    const newId = `p-new-${Date.now()}`;
    const newPos: (typeof positions)[0] = {
      id: newId,
      name: newPosName,
      code: newPosCode,
      description: newPosDesc,
      maxVotes: 1,
      winners: newPosWinners,
      votingMethod: newPosMethod,
      startDate: "2026-10-01T08:00",
      endDate: "2026-10-03T18:00",
      minLevel: "200",
      minGpa: 2.0,
      noDisciplinary: true,
      activeStudent: true,
      deptRestrictions: "",
      voterLevels: "All Levels",
      voterFaculties: "All Faculties",
      voterDepts: "All Departments",
      requirePoster: true,
      requireManifesto: true,
      requireVideo: false,
      publicVisibility: "Visible to everyone",
      resultVisibility: "Show after election closes",
      anonymousVoting: true,
      voteConfirmation: true,
    };

    setAvailablePositions([...availablePositions, newPos]);
    positions.push(newPos); // sync back to global mock store
    savePositions();

    setForm({
      ...form,
      positions: [...form.positions, newId],
    });

    toast.success(`Position "${newPosName}" created and auto-selected!`);
    setCreatePosOpen(false);

    // Reset fields
    setNewPosName("");
    setNewPosCode("");
    setNewPosDesc("");
    setNewPosWinners(1);
    setNewPosMethod("Single Choice");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Create New Election</h1>
        <p className="text-muted-foreground">Set up a secure election in 5 steps</p>
      </div>

      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
        {steps.map((s, i) => {
          const active = i === step,
            done = i < step;
          return (
            <div key={s} className="flex items-center gap-2 md:gap-4 shrink-0">
              <div
                className={`flex items-center gap-2 ${active ? "text-brand" : done ? "text-success" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    active
                      ? "border-brand bg-brand text-white"
                      : done
                        ? "border-success bg-success text-white"
                        : "border-border bg-card"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-semibold hidden md:block">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 md:w-12 h-0.5 ${done ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-card border border-border p-6 md:p-8 shadow-soft space-y-5">
        {step === 0 && (
          <>
            <div className="space-y-2">
              <Label>Election Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. 2026 Student Union Elections"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold">Event Type</Label>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Card 1: Student Election */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "General" })}
                  className={`flex flex-col text-left p-5 rounded-xl border-2 transition-all ${
                    form.type !== "Campus Awards"
                      ? "border-brand bg-brand/5 shadow-md"
                      : "border-border bg-card hover:border-brand/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <Vote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        Student / Organization Election
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        For electing positions like President, Secretary, Treasurer
                      </p>
                    </div>
                  </div>
                </button>

                {/* Card 2: Campus Awards */}
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "Campus Awards" })}
                  className={`flex flex-col text-left p-5 rounded-xl border-2 transition-all ${
                    form.type === "Campus Awards"
                      ? "border-[#F4C430] bg-[#F4C430]/5 shadow-md"
                      : "border-border bg-card hover:border-[#F4C430]/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F4C430]/10 text-[#F4C430] flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 fill-[#F4C430]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Campus Awards</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        For celebratory awards like Best Dressed, Face of Campus
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Sub-type for standard election if not Awards */}
              {form.type !== "Campus Awards" && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs">Election Sub-Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v: string) => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="By-Election">By-Election</SelectItem>
                      <SelectItem value="Referendum">Referendum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <Label className="text-sm font-semibold text-foreground">
                {form.type === "Campus Awards" ? "Award Categories" : "Select Election Positions"}
              </Label>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setCreatePosOpen(true)}
                className="h-8 border-brand/40 text-brand hover:bg-brand/5 text-xs font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1" />{" "}
                {form.type === "Campus Awards" ? "Create Category" : "Create Position"}
              </Button>
            </div>

            {/* Quick Add Award Categories presets */}
            {form.type === "Campus Awards" && (
              <div className="mb-4 space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground block">
                  Quick Add Preset Categories
                </Label>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-2 bg-muted/40 border border-border rounded-lg">
                  {awardCategoriesPresets.map((presetName) => {
                    const alreadyExists = availablePositions.some(
                      (p) => p.name.toLowerCase() === presetName.toLowerCase(),
                    );
                    const isSelected =
                      alreadyExists &&
                      availablePositions.find(
                        (p) => p.name.toLowerCase() === presetName.toLowerCase(),
                      )?.id &&
                      form.positions.includes(
                        availablePositions.find(
                          (p) => p.name.toLowerCase() === presetName.toLowerCase(),
                        )!.id,
                      );

                    return (
                      <button
                        key={presetName}
                        type="button"
                        onClick={() => {
                          const existing = availablePositions.find(
                            (p) => p.name.toLowerCase() === presetName.toLowerCase(),
                          );
                          if (existing) {
                            // If exists, toggle selection
                            setForm({
                              ...form,
                              positions: isSelected
                                ? form.positions.filter((id) => id !== existing.id)
                                : [...form.positions, existing.id],
                            });
                            return;
                          }
                          // Create position on-the-fly
                          const newId = `p-award-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                          const newPos = {
                            id: newId,
                            name: presetName,
                            code:
                              "AW-" + presetName.toUpperCase().replace(/\s+/g, "").substring(0, 5),
                            description: `Award for the ${presetName} category.`,
                            maxVotes: 1,
                            winners: 1,
                            votingMethod: "Single Choice" as const,
                            startDate: form.startDate || "2026-10-01T08:00",
                            endDate: form.endDate || "2026-10-03T18:00",
                            minLevel: "100" as const,
                            minGpa: 1.0,
                            noDisciplinary: false,
                            activeStudent: true,
                            deptRestrictions: "",
                            voterLevels: "All Levels",
                            voterFaculties: "All Faculties",
                            voterDepts: "All Departments",
                            requirePoster: true,
                            requireManifesto: false,
                            requireVideo: false,
                            publicVisibility: "Visible to everyone" as const,
                            resultVisibility: "Show after election closes" as const,
                            anonymousVoting: true,
                            voteConfirmation: true,
                          };
                          setAvailablePositions([...availablePositions, newPos]);
                          positions.push(newPos); // Sync back to global list
                          setForm({
                            ...form,
                            positions: [...form.positions, newId],
                          });
                          toast.success(`Added category: ${presetName}`);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition font-semibold ${
                          isSelected
                            ? "bg-brand/10 border-brand text-brand"
                            : alreadyExists
                              ? "bg-card border-border text-foreground hover:bg-muted"
                              : "bg-card border-dashed border-muted-foreground/30 text-muted-foreground hover:border-brand hover:text-brand"
                        }`}
                      >
                        {isSelected ? "✓ " : alreadyExists ? "" : "+ "} {presetName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              {availablePositions.map((p) => {
                const checked = form.positions.includes(p.id);
                // Filter out standard positions for awards type, or vice versa, to keep list clean
                const isAwardCategory = p.id.startsWith("a") || p.id.includes("award");
                if (form.type === "Campus Awards" && !isAwardCategory) return null;
                if (form.type !== "Campus Awards" && isAwardCategory) return null;

                return (
                  <label
                    key={p.id}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition ${checked ? "border-brand bg-brand/5" : "border-border hover:bg-muted/10"}`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) =>
                        setForm({
                          ...form,
                          positions: v
                            ? [...form.positions, p.id]
                            : form.positions.filter((x) => x !== p.id),
                        })
                      }
                    />
                    <div>
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label>Faculty</Label>
              <Select
                value={form.eligibility.faculty}
                onValueChange={(v) =>
                  setForm({ ...form, eligibility: { ...form.eligibility, faculty: v } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["all", "Science", "Business", "Engineering", "Law"].map((f) => (
                    <SelectItem key={f} value={f}>
                      {f === "all" ? "All faculties" : f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={form.eligibility.level}
                onValueChange={(v) =>
                  setForm({ ...form, eligibility: { ...form.eligibility, level: v } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["all", "100", "200", "300", "400", "500"].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l === "all" ? "All levels" : `Level ${l}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {step === 3 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start date & time</Label>
              <Input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End date & time</Label>
              <Input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-3">
            <h3 className="font-bold">Review your election</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <ReviewRow label="Name" value={form.name || "—"} />
              <ReviewRow label="Type" value={form.type} />
              <ReviewRow label="Positions" value={String(form.positions.length || "—")} />
              <ReviewRow
                label="Schedule"
                value={form.startDate ? `${form.startDate} → ${form.endDate}` : "—"}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast.success("Draft saved");
            }}
          >
            <Save className="w-4 h-4 mr-1" /> Save Draft
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-brand text-white">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Dynamically calculate matching active voters
                const matchingVoters = voters.filter((v) => {
                  if (v.status !== "active") return false;
                  if (
                    form.eligibility.faculty !== "all" &&
                    v.faculty.toLowerCase().trim() !== form.eligibility.faculty.toLowerCase().trim()
                  ) {
                    return false;
                  }
                  if (form.eligibility.level !== "all" && v.level !== form.eligibility.level) {
                    return false;
                  }
                  return true;
                });
                const computedEligibleCount = matchingVoters.length;

                const startDateVal = form.startDate ? new Date(form.startDate) : new Date();
                const now = new Date();
                const isPastOrPresent = startDateVal.getTime() <= now.getTime() + 60000;

                const newElection = {
                  id: `e-new-${Date.now()}`,
                  name: form.name || "Untitled Election",
                  description: form.description || "No description provided.",
                  type: form.type as "General" | "By-Election" | "Referendum" | "Campus Awards",
                  status: isPastOrPresent ? ("open" as const) : ("scheduled" as const),
                  startDate: startDateVal.toISOString(),
                  endDate: form.endDate
                    ? new Date(form.endDate).toISOString()
                    : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                  positionIds: form.positions,
                  totalEligible: computedEligibleCount,
                  votesCast: 0,
                };
                elections.push(newElection);
                saveElections();
                toast.success(
                  `Election created successfully! (${computedEligibleCount} eligible voters calculated)`,
                );
                nav("/admin/elections");
              }}
              className="bg-success text-white"
            >
              Create Election
            </Button>
          )}
        </div>
      </div>

      {/* Create Position Dialog */}
      <Dialog open={createPosOpen} onOpenChange={setCreatePosOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Position on the fly</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Position Name</Label>
              <Input
                value={newPosName}
                onChange={(e) => setNewPosName(e.target.value)}
                placeholder="e.g. Financial Secretary"
              />
            </div>
            <div className="space-y-2">
              <Label>Position Code</Label>
              <Input
                value={newPosCode}
                onChange={(e) => setNewPosCode(e.target.value)}
                placeholder="e.g. FINSEC001"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newPosDesc}
                onChange={(e) => setNewPosDesc(e.target.value)}
                placeholder="Responsibilities of this portfolio..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Number of Winners</Label>
                <Input
                  type="number"
                  min={1}
                  value={newPosWinners}
                  onChange={(e) => setNewPosWinners(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>Voting Method</Label>
                <Select
                  value={newPosMethod}
                  onValueChange={(v: "Single Choice" | "Multiple Choice" | "Ranked Choice") =>
                    setNewPosMethod(v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Choice">Single Choice</SelectItem>
                    <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                    <SelectItem value="Ranked Choice">Ranked Choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePosOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNewPosition} className="bg-brand text-white hover:bg-brand/90">
              Save Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-md bg-muted/40 border border-border">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
