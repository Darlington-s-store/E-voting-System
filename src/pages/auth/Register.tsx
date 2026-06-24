import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

type FormData = {
  name: string; studentId: string; email: string; phone: string;
  department: string; faculty: string; level: string;
  password: string; confirmPassword: string; terms: boolean;
};

function strength(pwd: string) {
  let n = 0;
  if (pwd.length >= 8) n++;
  if (/[A-Z]/.test(pwd)) n++;
  if (/[0-9]/.test(pwd)) n++;
  if (/[^A-Za-z0-9]/.test(pwd)) n++;
  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["bg-danger", "bg-warning", "bg-warning", "bg-brand", "bg-success"];
  return { score: n, label: labels[n], color: colors[n] };
}

export default function Register() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const pwd = watch("password") || "";
  const s = strength(pwd);

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); setTimeout(() => nav("/verify-email"), 1500); }, 700);
  };

  if (done) {
    return (
      <AuthShell title="Account created!">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/15 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <p className="mt-6 text-muted-foreground">Check your email to verify your account.</p>
        </motion.div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Join your institution's secure voting platform"
      footer={<>Already have one? <Link to="/login" className="text-brand font-semibold hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Full Name" error={errors.name?.message}>
            <Input {...register("name", { required: "Required" })} />
          </Field>
          <Field label="Student/Staff ID" error={errors.studentId?.message}>
            <Input {...register("studentId", { required: "Required" })} />
          </Field>
        </div>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email", { required: "Required" })} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Phone Number" error={errors.phone?.message}>
            <Input {...register("phone", { required: "Required" })} />
          </Field>
          <Field label="Department" error={errors.department?.message}>
            <Input {...register("department", { required: "Required" })} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Faculty/School" error={errors.faculty?.message}>
            <Input {...register("faculty", { required: "Required" })} />
          </Field>
          <Field label="Level/Year" error={errors.level?.message}>
            <Select onValueChange={(v) => setValue("level", v)}>
              <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
              <SelectContent>
                {["100", "200", "300", "400", "500"].map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" {...register("password", { required: "Required", minLength: { value: 8, message: "8+ characters" } })} />
          {pwd && (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden flex gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`flex-1 transition-all ${i < s.score ? s.color : "bg-muted"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Strength: <span className="font-semibold">{s.label}</span></p>
            </div>
          )}
        </Field>
        <Field label="Confirm Password" error={errors.confirmPassword?.message}>
          <Input type="password" {...register("confirmPassword", { required: "Required", validate: (v) => v === pwd || "Passwords don't match" })} />
        </Field>
        <label className="flex items-start gap-2 text-sm">
          <Checkbox {...register("terms", { required: true })} className="mt-0.5" />
          <span>I agree to the <a href="#" className="text-brand hover:underline">Terms of Service</a> and <a href="#" className="text-brand hover:underline">Privacy Policy</a></span>
        </label>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-brand text-white hover:bg-brand/90">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label} <span className="text-danger">*</span></Label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
