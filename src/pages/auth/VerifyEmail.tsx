import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/shared/AuthShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(105);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handle = (i: number, v: string) => {
    const c = v.slice(-1).replace(/\D/, "");
    const next = [...code];
    next[i] = c;
    setCode(next);
    if (c && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d)) {
      setTimeout(() => { toast.success("Email verified!"); nav("/login"); }, 400);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <AuthShell title="Verify Your Email" subtitle="We sent a 6-digit code to a••••@institution.edu">
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
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {seconds > 0 ? <>Resend code in <span className="font-mono font-semibold">{mm}:{ss}</span></> : "Didn't receive it?"}
      </p>
      <Button disabled={seconds > 0} onClick={() => { setSeconds(105); toast.info("New code sent"); }} className="mt-4 w-full" variant="outline">
        Resend Code
      </Button>
    </AuthShell>
  );
}
