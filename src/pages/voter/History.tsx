import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const history = [
  { id: "h1", election: "Hostel Governor Elections", positions: 2, date: "2026-05-04T14:32:00Z" },
  { id: "h2", election: "Class Representative Polls", positions: 1, date: "2026-02-15T10:12:00Z" },
];

export default function History() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">My Voting History</h1>
        <p className="text-muted-foreground">A record of every vote you've cast</p>
      </div>
      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left p-4">Election</th>
              <th className="text-left p-4">Positions Voted</th>
              <th className="text-left p-4">Date & Time</th>
              <th className="text-right p-4">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4 font-medium">{h.election}</td>
                <td className="p-4 text-muted-foreground">{h.positions}</td>
                <td className="p-4 font-mono text-xs">{format(new Date(h.date), "PPpp")}</td>
                <td className="p-4 text-right">
                  <Button size="sm" variant="outline" onClick={() => toast.success("Receipt downloaded")}>
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
