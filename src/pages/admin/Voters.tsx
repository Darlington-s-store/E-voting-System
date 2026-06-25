import { useState } from "react";
import { Search, Upload, UserPlus, Trash2, MoreHorizontal, Download } from "lucide-react";
import { voters as initial, type Voter } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function Voters() {
  const [voters, setVoters] = useState<Voter[]>(initial);
  const [q, setQ] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const perPage = 10;

  const filtered = voters.filter(
    (v) =>
      (faculty === "all" || v.faculty === faculty) &&
      (v.name.toLowerCase().includes(q.toLowerCase()) ||
        v.studentId.includes(q) ||
        v.email.includes(q)),
  );
  const pages = Math.ceil(filtered.length / perPage);
  const view = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Voters</h1>
          <p className="text-muted-foreground">{voters.length} registered voters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" /> Bulk Import CSV
          </Button>
          <Button className="bg-brand text-white">
            <UserPlus className="w-4 h-4 mr-2" /> Add Voter
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="pl-9"
          />
        </div>
        <Select value={faculty} onValueChange={setFaculty}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "all",
              "Science",
              "Business",
              "Engineering",
              "Law",
              "Health Sciences",
              "Humanities",
            ].map((f) => (
              <SelectItem key={f} value={f}>
                {f === "all" ? "All faculties" : f}
              </SelectItem>
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
                setVoters(voters.filter((v) => !selected.includes(v.id)));
                setSelected([]);
                toast.success("Deleted");
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

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
                <td className="p-3 text-muted-foreground">{v.email}</td>
                <td className="p-3">{v.department}</td>
                <td className="p-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${v.status === "active" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
                  >
                    {v.status}
                  </span>
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
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

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page} of {pages}
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

      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete voter?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the voter and their voting record reference. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => {
                setVoters(voters.filter((v) => v.id !== toDelete));
                setToDelete(null);
                toast.success("Voter deleted");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
