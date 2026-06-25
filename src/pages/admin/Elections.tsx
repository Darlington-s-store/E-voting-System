import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Search,
  PlusCircle,
  Eye,
  BarChart3,
  MoreHorizontal,
  PlayCircle,
  StopCircle,
  Send,
  Trash2,
  Edit2,
} from "lucide-react";
import {
  elections as initialElections,
  getPositionsForElection,
  positions,
  saveElections,
} from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminElections() {
  const [items, setItems] = useState(initialElections);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "draft" | "scheduled" | "open" | "closed">("all");
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string } | null>(null);

  // Edit election states
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editType, setEditType] = useState("General");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editPositions, setEditPositions] = useState<string[]>([]);

  const filtered = items.filter(
    (e) => (tab === "all" || e.status === tab) && e.name.toLowerCase().includes(q.toLowerCase()),
  );

  const startEdit = (e: (typeof initialElections)[0]) => {
    setEditId(e.id);
    setEditName(e.name);
    setEditDesc(e.description);
    setEditType(e.type);
    setEditStartDate(e.startDate.substring(0, 16));
    setEditEndDate(e.endDate.substring(0, 16));
    setEditPositions(e.positionIds || []);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editName) {
      toast.error("Election name is required");
      return;
    }
    const updatedElections = items.map((x) =>
      x.id === editId
        ? {
            ...x,
            name: editName,
            description: editDesc,
            type: editType as "General" | "By-Election" | "Referendum" | "Campus Awards",
            startDate: new Date(editStartDate).toISOString(),
            endDate: new Date(editEndDate).toISOString(),
            positionIds: editPositions,
          }
        : x,
    );

    // Sync to global mock elections list
    initialElections.length = 0;
    updatedElections.forEach((e) => initialElections.push(e));
    saveElections();

    setItems(updatedElections);
    setEditOpen(false);
    toast.success("Election updated successfully");
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;

    let updatedElections = [...items];

    if (type === "delete") {
      updatedElections = items.filter((x) => x.id !== id);
      toast.success("Election deleted");
    } else if (type === "open") {
      updatedElections = items.map((x) => (x.id === id ? { ...x, status: "open" as const } : x));
      toast.success("Election is now open");
    } else if (type === "close") {
      updatedElections = items.map((x) => (x.id === id ? { ...x, status: "closed" as const } : x));
      toast.success("Election is now closed");
    } else if (type === "publish") {
      updatedElections = items.map((x) =>
        x.id === id ? { ...x, status: "archived" as const } : x,
      );
      toast.success("Results published successfully");
    }

    // Sync to global mock elections list
    initialElections.length = 0;
    updatedElections.forEach((e) => initialElections.push(e));
    saveElections();

    setItems(updatedElections);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Elections</h1>
          <p className="text-muted-foreground">Manage all elections in your institution</p>
        </div>
        <Link to="/admin/elections/create">
          <Button className="bg-brand text-white">
            <PlusCircle className="w-4 h-4 mr-2" /> Create Election
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search elections..."
            className="pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Schedule</th>
              <th className="text-left p-4">Positions</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Turnout</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const positionsList = getPositionsForElection(e.id);
              const pct = Math.round((e.votesCast / e.totalEligible) * 100);
              return (
                <tr key={e.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4 font-semibold">
                    <Link to={`/admin/elections/${e.id}`} className="hover:text-brand">
                      {e.name}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{e.type}</td>
                  <td className="p-4 text-xs font-mono">
                    {format(new Date(e.startDate), "MMM d")} →{" "}
                    {format(new Date(e.endDate), "MMM d, yyyy")}
                  </td>
                  <td className="p-4">{positionsList.length}</td>
                  <td className="p-4">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="p-4">
                    <div className="w-32">
                      <div className="text-xs mb-1 font-semibold">{pct}%</div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-brand animate-pulse"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/elections/${e.id}`}>
                        <Button size="icon" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/elections/${e.id}/results`}>
                        <Button size="icon" variant="ghost">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(e)}>
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          {e.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() => setConfirmAction({ type: "open", id: e.id })}
                            >
                              <PlayCircle className="w-4 h-4 mr-2 text-success" /> Open Election
                            </DropdownMenuItem>
                          )}
                          {e.status === "open" && (
                            <DropdownMenuItem
                              onClick={() => setConfirmAction({ type: "close", id: e.id })}
                            >
                              <StopCircle className="w-4 h-4 mr-2 text-warning" /> Close Election
                            </DropdownMenuItem>
                          )}
                          {e.status === "closed" && (
                            <DropdownMenuItem
                              onClick={() => setConfirmAction({ type: "publish", id: e.id })}
                            >
                              <Send className="w-4 h-4 mr-2 text-brand" /> Publish Results
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-danger"
                            onClick={() => setConfirmAction({ type: "delete", id: e.id })}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Election Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Election</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Election Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={editType} onValueChange={setEditType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="By-Election">By-Election</SelectItem>
                  <SelectItem value="Referendum">Referendum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="datetime-local"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Contested Positions Selection */}
            <div className="space-y-2 pt-1">
              <Label className="text-sm font-semibold">Contested Positions</Label>
              <div className="border border-border rounded-lg p-3 bg-muted/20 max-h-[160px] overflow-y-auto space-y-2.5">
                {positions.map((p) => {
                  const checked = editPositions.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-start gap-2.5 text-xs cursor-pointer select-none font-medium text-foreground hover:text-brand transition"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) =>
                          setEditPositions(
                            v ? [...editPositions, p.id] : editPositions.filter((x) => x !== p.id),
                          )
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <div className="font-semibold text-xs leading-none mb-1">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground leading-snug">
                          {p.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} className="bg-brand text-white hover:bg-brand/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Status Change Action Alert */}
      <AlertDialog open={!!confirmAction} onOpenChange={(v) => !v && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {confirmAction?.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.type} this election? This action will be
              logged and can impact voter access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmAction?.type === "delete"
                  ? "bg-danger text-white hover:bg-danger/90"
                  : "bg-brand text-white hover:bg-brand/90"
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
