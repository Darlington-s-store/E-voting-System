import { useState } from "react";
import { PlusCircle, Trash2, Edit2 } from "lucide-react";
import { candidates as initial, positions, elections, type Candidate } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Candidates() {
  const [items, setItems] = useState<Candidate[]>(initial);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const grouped = positions.map((p) => ({
    position: p,
    candidates: items.filter((c) => c.positionId === p.id),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Candidates</h1>
          <p className="text-muted-foreground">{items.length} candidates across {positions.length} positions · {elections[0].name}</p>
        </div>
        <Button className="bg-brand text-white"><PlusCircle className="w-4 h-4 mr-2" /> Add Candidate</Button>
      </div>

      <div className="space-y-6">
        {grouped.map(({ position, candidates }) => (
          <div key={position.id} className="space-y-3">
            <h2 className="font-bold text-lg">{position.name} <span className="text-sm text-muted-foreground">({candidates.length})</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {candidates.map((c) => (
                <div key={c.id} className="rounded-xl bg-card border border-border p-5 shadow-soft text-center">
                  <img src={c.photo} alt={c.name} className="w-20 h-20 rounded-full mx-auto ring-4 ring-muted" />
                  <h3 className="mt-3 font-bold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{c.bio}</p>
                  <div className="mt-4 flex gap-2 justify-center">
                    <Button size="sm" variant="outline"><Edit2 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                    <Button size="sm" variant="ghost" className="text-danger" onClick={() => setToDelete(c.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove candidate?</AlertDialogTitle>
            <AlertDialogDescription>This candidate will no longer appear on ballots.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger text-white hover:bg-danger/90"
              onClick={() => { setItems(items.filter((c) => c.id !== toDelete)); setToDelete(null); toast.success("Candidate removed"); }}
            >Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
