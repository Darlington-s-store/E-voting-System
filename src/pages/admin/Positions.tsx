import { useState } from "react";
import { PlusCircle, Briefcase, Edit2, Trash2 } from "lucide-react";
import { positions as initial, type Position } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Positions() {
  const [items, setItems] = useState<Position[]>(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const add = () => {
    if (!name) return;
    setItems([...items, { id: `p${Date.now()}`, name, description: desc, maxVotes: 1 }]);
    setName(""); setDesc(""); setOpen(false);
    toast.success("Position added");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Positions</h1>
          <p className="text-muted-foreground">Manage election positions</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-brand text-white"><PlusCircle className="w-4 h-4 mr-2" /> Add Position</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="rounded-xl bg-card border border-border p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost"><Edit2 className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-danger" onClick={() => { setItems(items.filter((x) => x.id !== p.id)); toast.success("Removed"); }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <h3 className="mt-3 font-bold">{p.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
            <div className="mt-3 text-xs text-muted-foreground">Max votes: {p.maxVotes}</div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Position</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={add} className="bg-brand text-white">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
