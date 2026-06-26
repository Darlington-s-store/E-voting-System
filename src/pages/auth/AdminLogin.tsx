import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  // Progressive Lockout States loaded from localStorage
  const [attempts, setAttempts] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem("votesecure_admin_lockout");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.attempts || 0;
      }
    } catch {}
    return 0;
  });

  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("votesecure_admin_lockout");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.lockoutUntil) {
          const until = Number(parsed.lockoutUntil);
          if (until > Date.now()) return until;
        }
      }
    } catch {}
    return null;
  });

  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Lockout Countdown Timer
  useEffect(() => {
    if (!lockoutUntil) {
      setCooldownSeconds(0);
      return;
    }
    const updateCooldown = () => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setCooldownSeconds(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
        // Clear lockoutUntil but preserve attempts history
        const stored = localStorage.getItem("votesecure_admin_lockout");
        const parsed = stored ? JSON.parse(stored) : { attempts: 0 };
        localStorage.setItem(
          "votesecure_admin_lockout",
          JSON.stringify({ ...parsed, lockoutUntil: null }),
        );
      }
    };
    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLocked = cooldownSeconds > 0;

  const formatCooldown = (seconds: number) => {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h}h ${m}m ${s}s`;
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const handleFailedAttempt = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    let lockoutDuration = 0; // in milliseconds
    let lockoutLabel = "";

    if (nextAttempts === 5) {
      lockoutDuration = 15 * 60 * 1000; // 15 mins
      lockoutLabel = "15 minutes";
    } else if (nextAttempts === 10) {
      lockoutDuration = 60 * 60 * 1000; // 1 hour
      lockoutLabel = "1 hour";
    } else if (nextAttempts >= 15) {
      lockoutDuration = 24 * 60 * 60 * 1000; // 24 hours
      lockoutLabel = "24 hours";
    }

    let nextLockoutUntil: number | null = null;
    if (lockoutDuration > 0) {
      nextLockoutUntil = Date.now() + lockoutDuration;
      setLockoutUntil(nextLockoutUntil);
      toast.error(`Access Suspended: Too many failed attempts. Portal locked for ${lockoutLabel}.`);
    } else {
      const remainingBeforeLock = 5 - (nextAttempts % 5);
      toast.error(
        `Invalid administrator credentials. ${remainingBeforeLock} attempt(s) remaining before lockout.`,
      );
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "votesecure_admin_lockout",
        JSON.stringify({
          attempts: nextAttempts,
          lockoutUntil: nextLockoutUntil,
        }),
      );
    }
  };

  const onSubmit = (data: FormData) => {
    if (isLocked) {
      toast.error("Portal is currently locked.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Allow user if it contains "admin" (either username or email)
      const usernameLower = data.adminUser.toLowerCase();
      const isAdmin = usernameLower.includes("admin");

      if (!isAdmin) {
        handleFailedAttempt();
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

      // Clear lockout state on successful authentication
      setAttempts(0);
      setLockoutUntil(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("votesecure_admin_lockout");
      }

      toast.success("Administrator session initialized");
      nav("/admin/dashboard", { replace: true });
      setLoading(false);
    }, 800);
  };

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-brand/10 border border-brand/20 text-brand text-xs font-semibold leading-relaxed">
          <ShieldCheck className="w-4 h-4 shrink-0 text-brand" />
          <span>Authorized Personnel Only. All session activities are monitored and logged.</span>
        </div>

        {isLocked && (
          <div className="flex items-start gap-2.5 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs leading-normal">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 animate-pulse" />
            <div className="space-y-1">
              <strong className="font-bold block uppercase tracking-wide">
                Portal Access Suspended
              </strong>
              Too many failed authentication attempts. Access is locked for security. Please wait{" "}
              <span className="font-extrabold font-mono text-[13px] bg-danger/15 px-1.5 py-0.5 rounded border border-danger/25">
                {formatCooldown(cooldownSeconds)}
              </span>{" "}
              before trying again.
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>
            Administrator ID / Email <span className="text-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="e.g. admin or admin@votesecure.com"
            disabled={isLocked || loading}
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
              disabled={isLocked || loading}
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              disabled={isLocked || loading}
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground disabled:opacity-50"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label
            className={`flex items-center gap-2 cursor-pointer select-none ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Checkbox disabled={isLocked || loading} {...register("remember")} /> Keep session
            active
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLocked || loading}
          className="w-full h-11 bg-brand text-white hover:bg-brand/90 font-bold transition shadow-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authenticate Session"}
        </Button>
      </form>
    </AuthShell>
  );
}
