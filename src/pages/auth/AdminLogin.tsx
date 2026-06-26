import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";

type FormData = { adminUser: string; password: string; remember: boolean };

export default function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPwd, setShowPwd] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      // Allow user if it contains "admin" (either username or email)
      const usernameLower = data.adminUser.toLowerCase();
      const isAdmin = usernameLower.includes("admin");

      if (!isAdmin) {
        toast.error("Invalid administrator credentials. Access denied.");
        setAttempts((n) => n + 1);
        setLoading(false);
        return;
      }

      // Detect adminRole based on user input
      let adminRole: "super" | "sub" = "super";
      if (usernameLower.includes("sub")) {
        adminRole = "sub";
      } else if (usernameLower.includes("super")) {
        adminRole = "super";
      }

      login({
        id: "admin-" + Date.now(),
        name: data.adminUser,
        email: data.adminUser + "@votesecure.admin",
        role: "admin",
        adminRole,
        token: "admin-sess-" + Date.now(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.adminUser)}&background=022C22&color=34D399&bold=true`,
        twoFAEnabled: false,
      });

      toast.success("Administrator session initialized");
      nav("/admin/dashboard", { replace: true });
      setLoading(false);
    }, 800);
  };

  const onError = () => setAttempts((n) => n + 1);

  return (
    <AuthShell
      title="Admin Portal"
      subtitle="Sign in to E-voting System command center"
      footer={
        <>
          Are you a Student?{" "}
          <Link to="/login" className="text-brand font-semibold hover:underline">
            Go to Student Portal
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-brand/10 border border-brand/20 text-brand text-xs font-semibold leading-relaxed">
          <ShieldCheck className="w-4 h-4 shrink-0 text-brand" />
          <span>Authorized Personnel Only. All session activities are monitored and logged.</span>
        </div>

        {attempts >= 3 && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-danger/10 text-danger text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>Security alert: too many failed login attempts.</div>
          </div>
        )}

        <div className="space-y-2">
          <Label>
            Administrator ID / Email <span className="text-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="e.g. admin or admin@votesecure.com"
            {...register("adminUser", { required: "Administrator ID is required" })}
          />
          {errors.adminUser && <p className="text-xs text-danger">{errors.adminUser.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>
            Password <span className="text-danger">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox {...register("remember")} /> Keep session active
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-brand text-white hover:bg-brand/90 font-bold transition shadow-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authenticate Session"}
        </Button>
      </form>
    </AuthShell>
  );
}
