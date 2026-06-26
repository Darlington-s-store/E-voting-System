import { useState, useMemo } from "react";
import { PlusCircle, Search, Edit2, Trash2, ArrowUpDown } from "lucide-react";
import { positions as initial, candidates, savePositions, type Position } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

export default function Positions() {
  const [items, setItems] = useState<Position[]>(() => initial);
  const [search, setSearch] = useState("");
  const [nomineeFilter, setNomineeFilter] = useState<"all" | "with" | "empty">("all");
  const [sortCol, setSortCol] = useState<"name" | "order">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const nomineeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    candidates.forEach((c) => {
      map[c.positionId] = (map[c.positionId] || 0) + 1;
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    let result = [...items];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (nomineeFilter === "with") {
      result = result.filter((p) => (nomineeCounts[p.id] || 0) > 0);
    } else if (nomineeFilter === "empty") {
      result = result.filter((p) => !nomineeCounts[p.id]);
    }
    result.sort((a, b) => {
      if (sortCol === "order") {
        const aOrder = a.displayOrder ?? 0;
        const bOrder = b.displayOrder ?? 0;
        return sortDir === "asc" ? aOrder - bOrder : bOrder - aOrder;
      }
      return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    return result;
  }, [items, search, nomineeFilter, sortCol, sortDir, nomineeCounts]);

  const resetForm = () => {
    setName("");
    setDesc("");
    setDisplayOrder(items.length + 1);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setDisplayOrder(items.length + 1);
    setDialogOpen(true);
  };

  const openEdit = (p: Position) => {
    setEditingId(p.id);
    setName(p.name);
    setDesc(p.description);
    setDisplayOrder(p.displayOrder ?? items.indexOf(p));
    setDialogOpen(true);
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Position name is required");
      return;
    }

    const duplicate = items.find(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase() && p.id !== editingId,
    );
    if (duplicate) {
      toast.error(`Position "${trimmed}" already exists`);
      return;
    }

    if (editingId) {
      const updated = items.map((p) =>
        p.id === editingId ? { ...p, name: trimmed, description: desc, displayOrder } : p,
      );
      initial.length = 0;
      updated.forEach((p) => initial.push(p));
      savePositions();
      setItems(updated);
      toast.success("Position updated");
    } else {
      const now = new Date().toISOString();
      const pos: Position = {
        id: `p${Date.now()}`,
        name: trimmed,
        code: trimmed.substring(0, 4).toUpperCase() + "001",
        description: desc,
        winners: 1,
        votingMethod: "Single Choice",
        maxVotes: 1,
        startDate: now,
        endDate: now,
        minLevel: "100",
        minGpa: 1.0,
        noDisciplinary: false,
        activeStudent: true,
        deptRestrictions: "",
        voterLevels: "All Levels",
        voterFaculties: "All Faculties",
        voterDepts: "All Departments",
        requirePoster: false,
        requireManifesto: false,
        requireVideo: false,
        publicVisibility: "Visible to everyone",
        resultVisibility: "Show after election closes",
        anonymousVoting: true,
        voteConfirmation: true,
      };
      const updated = [...items, pos];
      initial.length = 0;
      updated.forEach((p) => initial.push(p));
      savePositions();
      setItems(updated);
      toast.success("Position created");
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!toDelete) return;
    const updated = items.filter((p) => p.id !== toDelete);
    initial.length = 0;
    updated.forEach((p) => initial.push(p));
    savePositions();
    setItems(updated);
    toast.success("Position deleted");
    setToDelete(null);
  };

  const toggleSort = (col: "name" | "order") => {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Positions</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} position{items.length !== 1 ? "s" : ""} defined
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-brand text-white hover:bg-brand/90 shrink-0 shadow-md"
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Create Position
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search positions by name..."
            className="pl-9"
          />
        </div>
        <Select
          value={nomineeFilter}
          onValueChange={(v) => setNomineeFilter(v as typeof nomineeFilter)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="with">With Nominees</SelectItem>
            <SelectItem value="empty">No Nominees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">No positions found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search || nomineeFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Create your first position to get started."}
          </p>
          {!search && nomineeFilter === "all" && (
            <Button className="mt-4 bg-brand text-white" onClick={openAdd}>
              Create Position
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="rounded-xl bg-card border border-border overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3 text-left w-10">#</th>
                <th className="p-3 text-left">
                  <button
                    className="flex items-center gap-1 font-semibold hover:text-foreground"
                    onClick={() => toggleSort("name")}
                  >
                    Position Name
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Nominees</th>
                <th className="p-3 text-left">
                  <button
                    className="flex items-center gap-1 font-semibold hover:text-foreground"
                    onClick={() => toggleSort("order")}
                  >
                    Display Order
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const count = nomineeCounts[p.id] || 0;
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3 text-muted-foreground text-xs font-mono">{idx + 1}</td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3 text-muted-foreground max-w-[280px] truncate">
                      {p.description || <span className="italic">No description</span>}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          count > 0 ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count} nominee{count !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground font-mono text-xs">
                      {p.displayOrder ?? idx + 1}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEdit(p)}
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-danger hover:bg-danger/10"
                          onClick={() => setToDelete(p.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(v) => {
          if (!v) {
            setDialogOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Position" : "Create Position"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Position Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. President, Vice President"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe the role and responsibilities..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              />
              <p className="text-[10px] text-muted-foreground">
                Controls the sorting order on ballot views (lower = first).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button className="bg-brand text-white" onClick={handleSave}>
              {editingId ? "Save Changes" : "Create Position"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete position?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this position from the system. Candidates assigned to this position
              may become orphaned. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
