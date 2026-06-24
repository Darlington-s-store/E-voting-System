import { useEffect, useState } from "react";

export function Countdown({ target, compact = false }: { target: string; compact?: boolean }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const items = [
    { v: d, l: "days" },
    { v: h, l: "hrs" },
    { v: m, l: "min" },
    { v: s, l: "sec" },
  ];

  if (compact) {
    return (
      <span className="font-mono text-sm font-semibold text-foreground">
        {d}d {String(h).padStart(2, "0")}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {items.map((it) => (
        <div
          key={it.l}
          className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-navy text-white"
        >
          <span className="font-mono text-xl font-bold">{String(it.v).padStart(2, "0")}</span>
          <span className="text-[10px] uppercase tracking-wider opacity-80">{it.l}</span>
        </div>
      ))}
    </div>
  );
}
