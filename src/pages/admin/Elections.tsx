import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Search, PlusCircle, Eye, BarChart3, MoreHorizontal, PlayCircle, StopCircle, Send, Trash2 } from "lucide-react";
import { elections, getPositionsForElection } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function AdminElections() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "draft" | "scheduled" | "open" | "closed">("all");
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string } | null>(null);
  const filtered = elections.filter((e) => (tab === "all" || e.status === tab) && e.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Elections</h1>
          <p className="text-muted-foreground">Manage all elections in your institution</p>
        </div>
        <Link to="/admin/elections/create">
          <Button className="bg-brand text-white"><PlusCircle className="w-4 h-4 mr-2" /> Create Election</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search elections..." className="pl-9" />
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
              const positions = getPositionsForElection(e.id);
              const pct = Math.round((e.votesCast / e.totalEligible) * 100);
              return (
                <tr key={e.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4 font-semibold">
                    <Link to={`/admin/elections/${e.id}`} className="hover:text-brand">{e.name}</Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{e.type}</td>
                  <td className="p-4 text-xs">
                    {format(new Date(e.startDate), "MMM d")} → {format(new Date(e.endDate), "MMM d, yyyy")}
                  </td>
                  <td className="p-4">{positions.length}</td>
                  <td className="p-4"><StatusBadge status={e.status} /></td>
                  <td className="p-4">
                    <div className="w-32">
                      <div className="text-xs mb-1">{pct}%</div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/elections/${e.id}`}>
                        <Button size="icon" variant="ghost"><Eye className="w-4 h-4" /></Button>
                      </Link>
                      <Link to={`/admin/elections/${e.id}/results`}>
                        <Button size="icon" variant="ghost"><BarChart3 className="w-4 h-4" /></Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {e.status === "draft" && (
                            <DropdownMenuItem onClick={() => setConfirmAction({ type: "open", id: e.id })}>
                              <PlayCircle className="w-4 h-4 mr-2" /> Open Election
                            </DropdownMenuItem>
                          )}
                          {e.status === "open" && (
                            <DropdownMenuItem onClick={() => setConfirmAction({ type: "close", id: e.id })}>
                              <StopCircle className="w-4 h-4 mr-2" /> Close Election
                            </DropdownMenuItem>
                          )}
                          {e.status === "closed" && (
                            <DropdownMenuItem onClick={() => setConfirmAction({ type: "publish", id: e.id })}>
                              <Send className="w-4 h-4 mr-2" /> Publish Results
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-danger" onClick={() => setConfirmAction({ type: "delete", id: e.id })}>
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

      <AlertDialog open={!!confirmAction} onOpenChange={(v) => !v && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {confirmAction?.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.type} this election? This action will be logged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { toast.success(`Election ${confirmAction?.type}d`); setConfirmAction(null); }}
              className={confirmAction?.type === "delete" ? "bg-danger text-white" : "bg-brand text-white"}
            >Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
