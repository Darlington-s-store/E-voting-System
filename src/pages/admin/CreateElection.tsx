import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { positions } from "@/lib/mock-data";
import { toast } from "sonner";

const steps = ["Basic Info", "Positions", "Eligibility", "Schedule", "Review"];

export default function CreateElection() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", description: "", type: "General",
    positions: [] as string[],
    eligibility: { faculty: "all", level: "all" },
    startDate: "", endDate: "",
  });
  const nav = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Create New Election</h1>
        <p className="text-muted-foreground">Set up a secure election in 5 steps</p>
      </div>

      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
        {steps.map((s, i) => {
          const active = i === step, done = i < step;
          return (
            <div key={s} className="flex items-center gap-2 md:gap-4 shrink-0">
              <div className={`flex items-center gap-2 ${active ? "text-brand" : done ? "text-success" : "text-muted-foreground"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                  active ? "border-brand bg-brand text-white" : done ? "border-success bg-success text-white" : "border-border bg-card"
                }`}>{i + 1}</div>
                <span className="text-sm font-semibold hidden md:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 md:w-12 h-0.5 ${done ? "bg-success" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-card border border-border p-6 md:p-8 shadow-soft space-y-5">
        {step === 0 && (
          <>
            <div className="space-y-2">
              <Label>Election Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 2026 Student Union Elections" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="By-Election">By-Election</SelectItem>
                  <SelectItem value="Referendum">Referendum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <Label>Select positions</Label>
            <div className="grid sm:grid-cols-2 gap-3">
              {positions.map((p) => {
                const checked = form.positions.includes(p.id);
                return (
                  <label key={p.id} className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer ${checked ? "border-brand bg-brand/5" : "border-border"}`}>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => setForm({
                        ...form,
                        positions: v ? [...form.positions, p.id] : form.positions.filter((x) => x !== p.id),
                      })}
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
              <Select value={form.eligibility.faculty} onValueChange={(v) => setForm({ ...form, eligibility: { ...form.eligibility, faculty: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["all", "Science", "Business", "Engineering", "Law"].map((f) => <SelectItem key={f} value={f}>{f === "all" ? "All faculties" : f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.eligibility.level} onValueChange={(v) => setForm({ ...form, eligibility: { ...form.eligibility, level: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["all", "100", "200", "300", "400", "500"].map((l) => <SelectItem key={l} value={l}>{l === "all" ? "All levels" : `Level ${l}`}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {step === 3 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start date & time</Label>
              <Input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>End date & time</Label>
              <Input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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
              <ReviewRow label="Schedule" value={form.startDate ? `${form.startDate} → ${form.endDate}` : "—"} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { toast.success("Draft saved"); }}>
            <Save className="w-4 h-4 mr-1" /> Save Draft
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-brand text-white">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={() => { toast.success("Election created"); nav("/admin/elections"); }} className="bg-success text-white">
              Create Election
            </Button>
          )}
        </div>
      </div>
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
