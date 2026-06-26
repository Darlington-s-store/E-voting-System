import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";
import { Logo } from "@/components/shared/Logo";
import { voters } from "@/lib/mock-data";

type FormData = { indexNumber: string; password: string };

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      const input = data.indexNumber.trim().toLowerCase();
      // Look up voter in the database (by student ID, email, or internal voter ID)
      const voter = voters.find(
        (v) =>
          v.studentId.toLowerCase() === input ||
          v.email.toLowerCase() === input ||
          v.id.toLowerCase() === input,
      );

      if (voter) {
        if (voter.status === "suspended") {
          toast.error("Your voter account has been suspended. Please contact the administrator.");
          setLoading(false);
          return;
        }

        login({
          id: voter.id,
          name: voter.name,
          email: voter.email,
          role: "voter",
          token: "sess-" + Date.now(),
          studentId: voter.studentId,
          department: voter.department,
          faculty: voter.faculty,
          level: voter.level,
          phone: voter.phoneNumber || "",
          avatar: voter.avatar,
          twoFAEnabled: voter.twoFactorEnabled || false,
        });
      } else {
        // Fallback for demo convenience: auto-create voter if not found
        toast.info("ID not found in voter registry. Creating a guest voter profile...");
        login({
          id: "u-" + Date.now(),
          name: data.indexNumber,
          email: data.indexNumber + "@student.edu",
          role: "voter",
          token: "sess-" + Date.now(),
          studentId: data.indexNumber,
          department: "Computer Science",
          faculty: "Science",
          level: "300",
          phone: "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.indexNumber,
          )}&background=1E3A5F&color=fff&bold=true`,
          twoFAEnabled: false,
        });
      }

      toast.success("Signed in successfully");
      nav("/voter/dashboard", { replace: true });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Logo />
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">Student Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Use your index number and password to vote
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-soft p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="indexNumber" className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                Index Number
              </Label>
              <Input
                id="indexNumber"
                type="text"
                placeholder="e.g. SC/2022/01034"
                autoComplete="username"
                {...register("indexNumber", { required: "Index number is required" })}
              />
              {errors.indexNumber && (
                <p className="text-xs text-danger">{errors.indexNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Toggle password"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-brand hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand text-white hover:bg-brand/90"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-brand transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Administrator sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
