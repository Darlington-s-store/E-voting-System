import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <AuthShell title="Check your email">
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/15 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <p className="mt-6 text-muted-foreground">If an account exists for that email, you'll receive a reset link shortly.</p>
          <Link to="/login" className="mt-6 inline-block text-brand font-semibold">Back to sign in</Link>
        </div>
      </AuthShell>
    );
  }
  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={<Link to="/login" className="text-brand font-semibold">Back to sign in</Link>}
    >
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
        <div className="space-y-2">
          <Label>Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="email" required placeholder="you@institution.edu" className="pl-9" />
          </div>
        </div>
        <Button className="w-full h-11 bg-brand text-white hover:bg-brand/90">Send Reset Link</Button>
      </form>
    </AuthShell>
  );
}
