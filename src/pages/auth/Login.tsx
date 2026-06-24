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

type FormData = { email: string; password: string; remember: boolean };

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showPwd, setShowPwd] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const login = useAuth((s) => s.login);
  const nav = useNavigate();

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      const isAdmin = data.email.toLowerCase().includes("admin");
      const role = isAdmin ? "admin" : "voter";
      const name = isAdmin ? "Admin User" : "Amara Okeke";
      login({
        id: "u1",
        name,
        email: data.email,
        role,
        token: "mock-token-" + Date.now(),
        studentId: "SC/2022/01034",
        department: "Computer Science",
        faculty: "Science",
        level: "300",
        phone: "+233200000000",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E3A5F&color=fff&bold=true`,
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
      subtitle="Sign in to your SecureVote Pro account"
      footer={<>Don't have an account? <Link to="/register" className="text-brand font-semibold hover:underline">Create one</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        {attempts >= 3 && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-danger/10 text-danger text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>Too many attempts. Try again in 5 minutes.</div>
          </div>
        )}
        <div className="space-y-2">
          <Label>Email address <span className="text-danger">*</span></Label>
          <Input type="email" placeholder="you@institution.edu" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Password <span className="text-danger">*</span></Label>
          <div className="relative">
            <Input type={showPwd ? "text" : "password"} placeholder="••••••••" {...register("password", { required: "Password is required" })} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox {...register("remember")} /> Remember me
          </label>
          <Link to="/forgot-password" className="text-brand hover:underline">Forgot password?</Link>
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-brand text-white hover:bg-brand/90">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">Hint: include "admin" in email to sign in as admin.</p>
      </form>
    </AuthShell>
  );
}
