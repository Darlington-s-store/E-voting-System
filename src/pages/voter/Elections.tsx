import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Search, ArrowRight, Star, Trophy, Sparkles, Award } from "lucide-react";
import { elections, getPositionsForElection } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function VoterElections() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get("tab");

  const [q, setQ] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "election" | "awards" | "completed">("all");

  // Read tab parameter from URL query state
  useEffect(() => {
    if (tabParam === "awards") {
      setActiveTab("awards");
    } else if (tabParam === "election") {
      setActiveTab("election");
    } else if (tabParam === "completed") {
      setActiveTab("completed");
    } else {
      setActiveTab("all");
    }
  }, [tabParam]);

  // Read voted election IDs from localStorage
  const getVotedElections = (): string[] => {
    if (typeof window === "undefined") return [];
    const val = localStorage.getItem("votesecure_voted_elections");
    return val ? JSON.parse(val) : [];
  };

  const votedElectionIds = getVotedElections();

  // Filter based on tab & search
  const filtered = elections.filter((e) => {
    const isAwards = e.type === "Campus Awards";
    const hasVoted = votedElectionIds.includes(e.id);

    // Tab filter
    if (activeTab === "election" && isAwards) return false;
    if (activeTab === "awards" && !isAwards) return false;
    if (activeTab === "completed" && !hasVoted) return false;

    // Search query
    return e.name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Elections & Awards</h1>
        <p className="text-muted-foreground mt-1">
          Browse active, upcoming, and completed election events and campus awards.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-soft">
        {/* Tab Buttons */}
        <div className="flex flex-wrap bg-muted p-1 rounded-lg border border-border">
          {[
            { value: "all", label: "All Events" },
            { value: "election", label: "Student Elections" },
            { value: "awards", label: "Campus Awards" },
            { value: "completed", label: "Completed" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => navigate(`/voter/elections?tab=${t.value}`)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === t.value
                  ? t.value === "awards"
                    ? "bg-[#F4C430] text-black shadow-sm"
                    : "bg-brand text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search elections or awards..."
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Elections Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e) => {
            const positionsList = getPositionsForElection(e.id);
            const isAwards = e.type === "Campus Awards";
            const hasVoted = votedElectionIds.includes(e.id);

            return (
              <div
                key={e.id}
                className={`group relative rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between shadow-soft hover:shadow-md hover:-translate-y-1 ${
                  isAwards
                    ? "bg-gradient-to-br from-[#1A0533] to-[#1E3A5F] border-[#F4C430]/15 hover:border-[#F4C430]/40 text-white"
                    : "bg-card border-border hover:border-brand/40"
                }`}
              >
                {/* Visual badges or stars */}
                {isAwards && (
                  <div className="absolute top-4 right-4 text-white/5 pointer-events-none group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-16 h-16 text-[#F4C430] fill-[#F4C430]/5" />
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className={`font-extrabold text-base leading-tight group-hover:text-brand transition-colors ${
                        isAwards ? "text-[#F4C430] group-hover:text-[#F4C430]" : "text-foreground"
                      }`}
                    >
                      {e.name}
                    </h3>
                  </div>

                  {/* Sub-label */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        isAwards
                          ? "bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]/30"
                          : "bg-brand/10 text-brand border border-brand/20"
                      }`}
                    >
                      {e.type}
                    </span>
                    <StatusBadge status={hasVoted ? "submitted" : e.status} />
                  </div>

                  {/* Date details */}
                  <p
                    className={`text-xs ${isAwards ? "text-purple-200/60" : "text-muted-foreground"}`}
                  >
                    Window: {format(new Date(e.startDate), "MMM d")} –{" "}
                    {format(new Date(e.endDate), "MMM d, yyyy")}
                  </p>

                  {/* Dynamic Progress indicator */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                      <span className={isAwards ? "text-purple-200/70" : "text-muted-foreground"}>
                        Ballot Progress
                      </span>
                      <span className={isAwards ? "text-[#F4C430]" : "text-brand"}>
                        {hasVoted ? "100%" : "0%"}
                      </span>
                    </div>
                    <div
                      className={`h-1.5 rounded-full overflow-hidden ${isAwards ? "bg-black/35" : "bg-muted"}`}
                    >
                      <div
                        className={`h-full transition-all duration-500 ${isAwards ? "bg-[#F4C430]" : "bg-brand"}`}
                        style={{ width: hasVoted ? "100%" : "0%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit / View details CTA */}
                <div className="mt-6 pt-4 border-t border-border/40 w-full flex items-center justify-between gap-3 flex-wrap">
                  <span
                    className={`text-[10px] font-bold ${isAwards ? "text-purple-200/50" : "text-muted-foreground/60"}`}
                  >
                    {positionsList.length} Portfolios listed
                  </span>

                  <Link to={`/voter/elections/${e.id}`}>
                    <Button
                      size="sm"
                      className={`font-bold text-xs h-8.5 rounded-lg px-4 shadow-sm transition-all flex items-center gap-1.5 ${
                        isAwards
                          ? "bg-[#F4C430] hover:bg-[#F4C430]/95 text-black"
                          : "bg-brand text-white hover:bg-brand/90"
                      }`}
                    >
                      View details <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">No election events found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            There are no campaigns matching your selected filter tab or query.
          </p>
        </div>
      )}
    </div>
  );
}
