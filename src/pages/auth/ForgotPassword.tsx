import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  if (sent) {
    return (
      <AuthShell title="Check your email">
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand/10 flex items-center justify-center">
            <Mail className="w-12 h-12 text-brand" />
          </div>
          <p className="mt-6 text-muted-foreground">
            We've sent a password reset link to{" "}
            <span className="font-semibold text-foreground">{email}</span>. Please check your inbox
            and follow the instructions to reset your password.
          </p>
          <Link to="/login" className="mt-6 inline-block text-brand font-semibold hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }
  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link to="/login" className="text-brand font-semibold hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const target = e.currentTarget;
          const emailInput = target.elements.namedItem("email") as HTMLInputElement;
          setEmail(emailInput.value);
          setSent(true);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label>Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              name="email"
              type="email"
              required
              placeholder="you@institution.edu"
              className="pl-9"
            />
          </div>
        </div>
        <Button className="w-full h-11 bg-brand text-white hover:bg-brand/90">
          Send Reset Link
        </Button>
      </form>
    </AuthShell>
  );
}
