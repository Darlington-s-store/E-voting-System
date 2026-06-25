import { useState } from "react";
import { format } from "date-fns";
import { Search, Download, LogIn, Vote, PlusCircle, Edit, Trash } from "lucide-react";
import { auditLogs } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const icons = { LOGIN: LogIn, VOTE: Vote, CREATE: PlusCircle, UPDATE: Edit, DELETE: Trash };
const colors = {
  LOGIN: "bg-brand/10 text-brand",
  VOTE: "bg-success/10 text-success",
  CREATE: "bg-purple/10 text-purple",
  UPDATE: "bg-warning/10 text-warning",
  DELETE: "bg-danger/10 text-danger",
};

export default function AuditLogs() {
  const [q, setQ] = useState("");
  const [action, setAction] = useState("all");
  const filtered = auditLogs.filter(
    (l) =>
      (action === "all" || l.action === action) &&
      (l.user + l.entity).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Audit Logs</h1>
          <p className="text-muted-foreground">Immutable record of every action on the platform</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("CSV exported")}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by user or entity..."
            className="pl-9"
          />
        </div>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "LOGIN", "VOTE", "CREATE", "UPDATE", "DELETE"].map((a) => (
              <SelectItem key={a} value={a}>
                {a === "all" ? "All actions" : a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left p-3">Timestamp</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Action</th>
              <th className="text-left p-3">Entity</th>
              <th className="text-left p-3">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const Icon = icons[l.action];
              return (
                <tr key={l.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs whitespace-nowrap">
                    {format(new Date(l.timestamp), "MMM d, HH:mm:ss")}
                  </td>
                  <td className="p-3 font-semibold">{l.user}</td>
                  <td className="p-3">
                    <span className="text-xs text-muted-foreground capitalize">{l.role}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${colors[l.action]}`}
                    >
                      <Icon className="w-3 h-3" /> {l.action}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">{l.entity}</td>
                  <td className="p-3 font-mono text-xs">{l.ip}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
