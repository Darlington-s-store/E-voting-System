import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";

type FormData = { indexNumber: string; password: string; remember: boolean };

export default function Login() {
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
      const isAdmin = data.indexNumber.toLowerCase().includes("admin");
      const role = isAdmin ? "admin" : "voter";
      login({
        id: "u-" + Date.now(),
        name: data.indexNumber,
        email: data.indexNumber + "@student.edu",
        role,
        token: "sess-" + Date.now(),
        studentId: data.indexNumber,
        department: "",
        faculty: "",
        level: "",
        phone: "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.indexNumber)}&background=1E3A5F&color=fff&bold=true`,
        twoFAEnabled: false,
      });
      toast.success("Signed in successfully");
      nav(isAdmin ? "/admin/dashboard" : "/voter/dashboard", { replace: true });
      setLoading(false);
    }, 600);
  };

  const onError = () => setAttempts((n) => n + 1);

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to your E-voting System account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-brand font-semibold hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        {attempts >= 3 && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-danger/10 text-danger text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>Too many attempts. Try again in 5 minutes.</div>
          </div>
        )}
        <div className="space-y-2">
          <Label>
            Index Number <span className="text-danger">*</span>
          </Label>
          <Input
            type="text"
            placeholder="e.g. SC/2022/01034"
            {...register("indexNumber", { required: "Index number is required" })}
          />
          {errors.indexNumber && (
            <p className="text-xs text-danger">{errors.indexNumber.message}</p>
          )}
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
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox {...register("remember")} /> Remember me
          </label>
          <Link to="/forgot-password" className="text-brand hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-brand text-white hover:bg-brand/90"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Hint: type "admin" in the index field to sign in as admin.
        </p>
      </form>
    </AuthShell>
  );
}
