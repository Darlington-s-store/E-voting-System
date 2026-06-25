import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Download, History, Award, Trophy, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { elections } from "@/lib/mock-data";

interface HistoryRecord {
  id: string;
  name: string;
  type: string;
  positionsCount: number;
  date: string;
  receiptId: string;
}

export default function VoterHistory() {
  const [activeTab, setActiveTab] = useState<"elections" | "awards">("elections");
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [currentTime] = useState(new Date());

  useEffect(() => {
    const val = localStorage.getItem("votesecure_voted_elections");
    if (val) {
      setVotedIds(JSON.parse(val));
    }
  }, []);

  // Compute records dynamically based on localStorage voted election ids
  const electionRecords = useMemo(() => {
    // Start with default mock records so there is pre-existing history
    const list: HistoryRecord[] = [];

    // Add dynamically voted elections
    elections.forEach((e) => {
      if (e.type !== "Campus Awards" && votedIds.includes(e.id)) {
        list.unshift({
          id: e.id,
          name: e.name,
          type: e.type,
          positionsCount: e.positionIds.length,
          date: currentTime.toISOString(),
          receiptId: `VR-${e.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
        });
      }
    });

    return list;
  }, [votedIds, currentTime]);

  const awardRecords = useMemo(() => {
    const list: HistoryRecord[] = [];

    // Add dynamically voted awards
    elections.forEach((e) => {
      if (e.type === "Campus Awards" && votedIds.includes(e.id)) {
        list.unshift({
          id: e.id,
          name: e.name,
          type: e.type,
          positionsCount: e.positionIds.length,
          date: currentTime.toISOString(),
          receiptId: `CA-${e.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
        });
      }
    });

    return list;
  }, [votedIds, currentTime]);

  const activeRecords = activeTab === "elections" ? electionRecords : awardRecords;

  const handleDownload = (record: HistoryRecord) => {
    toast.success(`Downloaded signed receipt: ${record.receiptId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Voting History</h1>
          <p className="text-muted-foreground mt-1">
            An immutable audit log of your digital ballot receipts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted p-1 rounded-lg border border-border w-fit">
        <button
          onClick={() => setActiveTab("elections")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-xs font-bold transition-all ${
            activeTab === "elections"
              ? "bg-brand text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Student Elections ({electionRecords.length})
        </button>
        <button
          onClick={() => setActiveTab("awards")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-xs font-bold transition-all ${
            activeTab === "awards"
              ? "bg-[#F4C430] text-black shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Campus Awards ({awardRecords.length})
        </button>
      </div>

      {/* Table grid */}
      {activeRecords.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/65 text-muted-foreground border-b border-border text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="text-left p-4">Event Description</th>
                  <th className="text-left p-4">Category Subtype</th>
                  <th className="text-left p-4">Selections Voted</th>
                  <th className="text-left p-4">Date & Time Signed</th>
                  <th className="text-right p-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {activeRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/15 transition-colors">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        {activeTab === "awards" ? (
                          <Star className="w-4 h-4 text-[#F4C430] fill-[#F4C430]/10 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
                        )}
                        {r.name}
                      </div>
                    </td>
                    <td className="p-4 text-xs font-semibold text-muted-foreground">{r.type}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground border border-border/30">
                        {r.positionsCount} portfolios
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {format(new Date(r.date), "PPP p")}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(r)}
                        className={`h-8 text-xs font-semibold border-border/80 ${
                          activeTab === "awards"
                            ? "hover:text-[#F4C430] hover:border-[#F4C430]/40"
                            : "hover:text-brand hover:border-brand/40"
                        }`}
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">No ballot records found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            You haven't participated in any events in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
