import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TwoFactor() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const nav = useNavigate();
  const handle = (i: number, v: string) => {
    const c = v.slice(-1).replace(/\D/, "");
    const next = [...code];
    next[i] = c;
    setCode(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <AuthShell title="Two-Factor Authentication" subtitle="Enter the 6-digit code from your authenticator app">
      <div className="flex justify-center gap-2">
        {code.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={d}
            onChange={(e) => handle(i, e.target.value)}
            onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()}
            className="w-12 h-14 text-center text-2xl font-bold rounded-md border border-input bg-card focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none"
            maxLength={1}
            inputMode="numeric"
          />
        ))}
      </div>
      <Button
        onClick={() => { toast.success("Verified"); nav("/voter/dashboard"); }}
        className="mt-6 w-full h-11 bg-brand text-white hover:bg-brand/90"
      >Verify</Button>
      <p className="mt-4 text-center text-sm">
        <a href="#" className="text-brand hover:underline">Use a backup code</a>
      </p>
    </AuthShell>
  );
}
