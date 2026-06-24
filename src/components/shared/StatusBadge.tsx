import type { ElectionStatus } from "@/lib/mock-data";

const map: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", label: "Draft" },
  scheduled: { bg: "bg-brand/10", text: "text-brand", label: "Scheduled" },
  open: { bg: "bg-success/15", text: "text-success", label: "Open" },
  closed: { bg: "bg-danger/15", text: "text-danger", label: "Closed" },
  archived: { bg: "bg-warning/15", text: "text-warning", label: "Archived" },
  active: { bg: "bg-success/15", text: "text-success", label: "Active" },
  suspended: { bg: "bg-danger/15", text: "text-danger", label: "Suspended" },
};

export function StatusBadge({ status }: { status: ElectionStatus | string }) {
  const cfg = map[status] ?? map.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.text.replace("text-", "bg-")}`} />
      {cfg.label}
    </span>
  );
}
