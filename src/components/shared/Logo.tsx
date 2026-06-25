import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function Logo({ light = false, hideIcon = false }: { light?: boolean; hideIcon?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      {!hideIcon && (
        <div
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${
            light
              ? "bg-[#10B981]/15 border border-[#10B981]/25"
              : "bg-[#F0FDF4] border border-[#059669]/20"
          } shadow-soft`}
        >
          <Shield
            className={`w-5 h-5 ${light ? "text-[#10B981]" : "text-[#059669]"}`}
            strokeWidth={2.5}
          />
        </div>
      )}
      <span
        className={`font-extrabold text-lg tracking-tight ${light ? "text-white" : "text-[#1E293B]"}`}
      >
        E-voting <span className={light ? "text-[#10B981]" : "text-[#059669]"}>System</span>
      </span>
    </Link>
  );
}
