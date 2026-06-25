import { useState } from "react";
import { Search, UserPlus, Trash2, MoreHorizontal, Edit2, Download } from "lucide-react";
import {
  voters as mockVoters,
  saveVoters,
  departments,
  faculties,
  levels,
  type Voter,
} from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const defaultAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1E3A5F&color=fff&bold=true&size=256`;

const emptyForm = (): Partial<Voter> => ({
  name: "",
  studentId: "",
  email: "",
  department: departments[0],
  faculty: faculties[0],
  level: levels[0],
  phoneNumber: "",
});

export default function Voters() {
  const [voters, setVoters] = useState<Voter[]>(() => mockVoters);
  const [q, setQ] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Voter>>(emptyForm());
  const perPage = 10;

  const filtered = voters.filter(
    (v) =>
      (faculty === "all" || v.faculty === faculty) &&
      (v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.studentId.toLowerCase().includes(q.toLowerCase()) ||
        v.email.toLowerCase().includes(q.toLowerCase())),
  );
  const pages = Math.ceil(filtered.length / perPage);
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  const sync = (updated: Voter[]) => {
    setVoters(updated);
    mockVoters.length = 0;
    updated.forEach((v) => mockVoters.push(v));
    saveVoters();
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (v: Voter) => {
    setEditingId(v.id);
    setForm({ ...v });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.studentId?.trim()) {
      toast.error("Student ID is required");
      return;
    }
    if (!form.email?.trim()) {
      toast.error("Email is required");
      return;
    }

    if (editingId) {
      const updated = voters.map((v) =>
        v.id === editingId ? ({ ...v, ...form } as Voter) : v,
      );
      sync(updated);
      toast.success("Voter updated");
    } else {
      const newVoter: Voter = {
        id: `v${Date.now()}`,
        name: form.name.trim(),
        studentId: form.studentId.trim(),
        email: form.email.trim(),
        department: form.department || departments[0],
        faculty: form.faculty || faculties[0],
        level: form.level || levels[0],
        status: "active",
        lastLogin: new Date().toISOString(),
        avatar: defaultAvatar(form.name.trim()),
        phoneNumber: form.phoneNumber?.trim() || undefined,
      };
      sync([...voters, newVoter]);
      toast.success("Voter added");
    }
    setDialogOpen(false);
    setForm(emptyForm());
    setEditingId(null);
    setSelected([]);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    sync(voters.filter((v) => v.id !== toDelete));
    setToDelete(null);
    setSelected([]);
    toast.success("Voter deleted");
  };

  const toggleStatus = (v: Voter) => {
    const nextStatus = v.status === "active" ? "suspended" : "active";
    sync(voters.map((x) => (x.id === v.id ? { ...x, status: nextStatus } : x)));
    toast.success(`Voter ${nextStatus === "active" ? "activated" : "suspended"}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Voters</h1>
          <p className="text-muted-foreground mt-1">
            {voters.length} registered voter{voters.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="shrink-0">
            <Download className="w-4 h-4 mr-2" /> Bulk Import CSV
          </Button>
          <Button
            className="bg-brand text-white hover:bg-brand/90 shrink-0 shadow-md"
            onClick={openAdd}
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add Voter
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, ID, or email..."
            className="pl-9"
          />
        </div>
        <Select value={faculty} onValueChange={(v) => { setFaculty(v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faculties</SelectItem>
            {faculties.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-md bg-brand/10 border border-brand/20">
          <span className="text-sm font-semibold">{selected.length} selected</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success(`${selected.length} voters exported`)}
            >
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                sync(voters.filter((v) => !selected.includes(v.id)));
                setSelected([]);
                toast.success("Deleted selected voters");
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

      {view.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">No voters found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {q || faculty !== "all"
              ? "Try adjusting your search or filter."
              : "Start by adding your first voter."}
          </p>
          {!q && faculty === "all" && (
            <Button className="mt-4 bg-brand text-white" onClick={openAdd}>
              Add Voter
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3 w-10">
                  <Checkbox
                    checked={view.every((v) => selected.includes(v.id)) && view.length > 0}
                    onCheckedChange={(c) =>
                      setSelected(
                        c
                          ? [...new Set([...selected, ...view.map((v) => v.id)])]
                          : selected.filter((id) => !view.find((v) => v.id === id)),
                      )
                    }
                  />
                </th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Index Number</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Department</th>
                <th className="text-left p-3">Level</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Last Login</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {view.map((v) => (
                <tr key={v.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3">
                    <Checkbox
                      checked={selected.includes(v.id)}
                      onCheckedChange={(c) =>
                        setSelected(c ? [...selected, v.id] : selected.filter((x) => x !== v.id))
                      }
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={v.avatar} className="w-8 h-8 rounded-full" alt="" />
                      <span className="font-semibold">{v.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs">{v.studentId}</td>
                  <td className="p-3 text-muted-foreground max-w-[180px] truncate">{v.email}</td>
                  <td className="p-3">{v.department}</td>
                  <td className="p-3">Level {v.level}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleStatus(v)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border transition-colors ${
                        v.status === "active"
                          ? "bg-success/10 text-success border-success/30 hover:bg-success/20"
                          : "bg-danger/10 text-danger border-danger/30 hover:bg-danger/20"
                      }`}
                    >
                      {v.status}
                    </button>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(v.lastLogin), { addSuffix: true })}
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(v)}>
                          <Edit2 className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(v)}>
                          {v.status === "active" ? "Suspend" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-danger" onClick={() => setToDelete(v.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {pages} ({filtered.length} total)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { if (!v) { setDialogOpen(false); setEditingId(null); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Voter" : "Add Voter"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kwame Asante"
                />
              </div>
              <div className="space-y-2">
                <Label>Student ID</Label>
                <Input
                  value={form.studentId || ""}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  placeholder="e.g. SC/2022/12345"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. kwame@uni.edu"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Faculty</Label>
                <Select
                  value={form.faculty || faculties[0]}
                  onValueChange={(v) => setForm({ ...form, faculty: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={form.department || departments[0]}
                  onValueChange={(v) => setForm({ ...form, department: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={form.level || levels[0]}
                  onValueChange={(v) => setForm({ ...form, level: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((l) => (
                      <SelectItem key={l} value={l}>Level {l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={form.phoneNumber || ""}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  placeholder="e.g. +233 50 123 4567"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-brand text-white" onClick={handleSave}>
              {editingId ? "Save Changes" : "Add Voter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete voter?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the voter and their voting record references. This action
              cannot be undone.
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
