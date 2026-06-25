import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Edit2, Star, Award, User, Search } from "lucide-react";
import {
  candidates as mockCandidates,
  positions,
  elections,
  saveCandidates,
  type Candidate,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Candidates() {
  const [items, setItems] = useState<Candidate[]>(() => mockCandidates);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "election" | "awards">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!toDelete) return;
    const index = mockCandidates.findIndex((c) => c.id === toDelete);
    if (index !== -1) {
      mockCandidates.splice(index, 1);
      saveCandidates();
      setItems([...mockCandidates]);
      toast.success("Candidate removed successfully");
    }
    setToDelete(null);
  };

  // Filter candidates based on tab, search, and position
  const filteredCandidates = items.filter((c) => {
    const isAwards = c.electionId === "e-awards";

    // Tab filter
    if (activeTab === "election" && isAwards) return false;
    if (activeTab === "awards" && !isAwards) return false;

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const posName = positions.find((p) => p.id === c.positionId)?.name || "";
      return (
        c.name.toLowerCase().includes(query) ||
        c.bio.toLowerCase().includes(query) ||
        posName.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Group filtered candidates by position
  const activePositionIds = Array.from(new Set(filteredCandidates.map((c) => c.positionId)));
  const grouped = activePositionIds.map((pId) => {
    const pos = positions.find((p) => p.id === pId);
    return {
      position: pos || { id: pId, name: "Unknown Position", description: "" },
      candidates: filteredCandidates.filter((c) => c.positionId === pId),
    };
  });

  const getElectionName = (electionId: string) => {
    return elections.find((e) => e.id === electionId)?.name || "Unknown Event";
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Candidates & Nominees</h1>
          <p className="text-muted-foreground mt-1">
            Manage profiles, posters, and manifestos for elections and awards.
          </p>
        </div>
        <Button
          className="bg-brand text-white hover:bg-brand/90 shrink-0 shadow-md transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => navigate("/admin/candidates/create")}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Candidate / Nominee
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-soft">
        {/* Tabs */}
        <div className="flex bg-muted p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveTab("election")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "election"
                ? "bg-brand text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Elections ({items.filter((c) => c.electionId !== "e-awards").length})
          </button>
          <button
            onClick={() => setActiveTab("awards")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === "awards"
                ? "bg-[#F4C430] text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Campus Awards ({items.filter((c) => c.electionId === "e-awards").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, bio, or category..."
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Candidates Grid Grouped by Position */}
      {grouped.length > 0 ? (
        <div className="space-y-10">
          {grouped.map(({ position, candidates }) => {
            const isAwardsPosition = position.id.startsWith("a") || position.id.includes("award");
            return (
              <div key={position.id} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-2">
                  <h2 className="font-extrabold text-xl tracking-tight text-foreground flex items-center gap-2">
                    {isAwardsPosition ? (
                      <Star className="w-5 h-5 text-[#F4C430] fill-[#F4C430]" />
                    ) : (
                      <Award className="w-5 h-5 text-brand" />
                    )}
                    {position.name}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {candidates.length} {candidates.length === 1 ? "nominee" : "nominees"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">
                    {position.description}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {candidates.map((c) => {
                    const isAward = c.electionId === "e-awards";
                    return (
                      <div
                        key={c.id}
                        className={`group relative rounded-2xl bg-card border transition-all duration-300 p-6 flex flex-col items-center text-center shadow-soft hover:shadow-md hover:-translate-y-1 ${
                          isAward
                            ? "hover:border-[#F4C430] border-border/80"
                            : "hover:border-brand border-border/80"
                        }`}
                      >
                        {/* Gold Star / Status Tag */}
                        {isAward && (
                          <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#F4C430]/10 flex items-center justify-center text-[#F4C430] border border-[#F4C430]/30 shadow-sm animate-pulse">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        )}

                        {/* Candidate Image */}
                        <div className="relative">
                          <img
                            src={c.photo}
                            alt={c.name}
                            className={`w-24 h-24 object-cover shadow-inner transition-transform duration-300 group-hover:scale-105 ${
                              isAward
                                ? "rounded-[20px] ring-4 ring-[#F4C430]/20"
                                : "rounded-full ring-4 ring-brand/10"
                            }`}
                          />
                          <span
                            className={`absolute bottom-0 right-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              c.status === "active"
                                ? "bg-success/10 text-success border-success/30"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>

                        {/* Info details */}
                        <h3 className="mt-4 font-bold text-base leading-tight group-hover:text-brand transition-colors">
                          {c.name}
                        </h3>
                        <span className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                          {getElectionName(c.electionId)}
                        </span>

                        <p className="text-xs text-muted-foreground line-clamp-3 mt-2 px-1 text-center h-12 leading-relaxed">
                          {c.bio || "No biography provided."}
                        </p>

                        {/* Sticky Social Icons Preview if present */}
                        {(c.instagram || c.twitter) && (
                          <div className="flex gap-2.5 mt-3 text-muted-foreground text-xs font-semibold">
                            {c.instagram && (
                              <span className="hover:text-foreground">{c.instagram}</span>
                            )}
                            {c.twitter && (
                              <span className="hover:text-foreground">{c.twitter}</span>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="mt-5 pt-4 border-t border-border/60 w-full flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold border-border/80 hover:bg-muted/10 shrink-0"
                            onClick={() => navigate(`/admin/candidates/${c.id}/edit`)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs font-semibold text-danger hover:bg-danger/5 shrink-0"
                            onClick={() => setToDelete(c.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">No candidates found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search query or tab filters, or create a new candidate.
          </p>
          <Button
            className="mt-4 bg-brand text-white"
            onClick={() => navigate("/admin/candidates/create")}
          >
            Add New Candidate
          </Button>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove candidate/nominee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this candidate? They will be removed from all ballots
              and voter views. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={handleDelete}
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
