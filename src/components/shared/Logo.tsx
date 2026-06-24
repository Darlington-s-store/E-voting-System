import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-lg ${
          light ? "bg-white/15" : "gradient-brand"
        } shadow-soft`}
      >
        <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <span
        className={`font-extrabold text-lg tracking-tight ${
          light ? "text-white" : "text-navy"
        }`}
      >
        SecureVote <span className="text-brand">Pro</span>
      </span>
    </Link>
  );
}
