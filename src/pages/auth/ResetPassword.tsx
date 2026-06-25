import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

export default function ResetPassword() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const nav = useNavigate();
  const s = strength(pwd);

  return (
    <AuthShell title="Reset password" subtitle="Choose a new password for your account">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pwd !== confirm) return toast.error("Passwords don't match");
          toast.success("Password reset successful");
          nav("/login");
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label>New password</Label>
          <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
          {pwd && (
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden flex gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`flex-1 ${i < s.score ? s.color : "bg-muted"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Strength: <span className="font-semibold">{s.label}</span>
              </p>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Confirm password</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <Button className="w-full h-11 bg-brand text-white hover:bg-brand/90">
          Reset Password
        </Button>
      </form>
    </AuthShell>
  );
}
