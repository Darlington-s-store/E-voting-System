import { useState } from "react";
import { PlusCircle, Edit2, Trash2, ShieldAlert, Flag, AlertTriangle, Link } from "lucide-react";
import {
  partylists as initialPartylists,
  savePartylists,
  candidates,
  saveCandidates,
  type Partylist,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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

export default function Partylists() {
  const [lists, setLists] = useState<Partylist[]>(initialPartylists);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [color, setColor] = useState("#2E86AB");

  // Delete cascade warning dialog states
  const [deleteTarget, setDeleteTarget] = useState<Partylist | null>(null);
  const [assignedCount, setAssignedCount] = useState(0);

  const resetForm = () => {
    setName("");
    setAcronym("");
    setDescription("");
    setLogo("");
    setColor("#2E86AB");
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (party: Partylist) => {
    setEditingId(party.id);
    setName(party.name);
    setAcronym(party.acronym);
    setDescription(party.description);
    setLogo(party.logo);
    setColor(party.color);
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !acronym.trim()) {
      toast.error("Name and Acronym are required fields.");
      return;
    }

    // Duplicate validation (ignoring self if editing)
    const normalizedName = name.trim().toLowerCase();
    const normalizedAcronym = acronym.trim().toLowerCase();

    const isDuplicate = lists.some(
      (p) =>
        p.id !== editingId &&
        (p.name.toLowerCase() === normalizedName || p.acronym.toLowerCase() === normalizedAcronym),
    );

    if (isDuplicate) {
      toast.error("A partylist with this Name or Acronym already exists.");
      return;
    }

    const finalLogo =
      logo.trim() ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(acronym)}&background=${color.replace("#", "")}&color=fff&bold=true`;

    if (editingId) {
      // Edit mode
      const updated = lists.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: name.trim(),
              acronym: acronym.trim().toUpperCase(),
              description: description.trim(),
              logo: finalLogo,
              color,
            }
          : p,
      );
      setLists(updated);
      initialPartylists.length = 0;
      updated.forEach((u) => initialPartylists.push(u));
      savePartylists();
      toast.success("Partylist updated successfully!");
    } else {
      // Create mode
      const newParty: Partylist = {
        id: `party-${Date.now()}`,
        name: name.trim(),
        acronym: acronym.trim().toUpperCase(),
        description: description.trim(),
        logo: finalLogo,
        color,
      };
      const updated = [...lists, newParty];
      setLists(updated);
      initialPartylists.length = 0;
      updated.forEach((u) => initialPartylists.push(u));
      savePartylists();
      toast.success("Partylist created successfully!");
    }

    setOpen(false);
    resetForm();
  };

  const handleDeleteRequest = (party: Partylist) => {
    // Check for assigned nominees
    const count = candidates.filter((c) => c.partylistId === party.id).length;
    setDeleteTarget(party);
    setAssignedCount(count);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    // Delete partylist
    const updated = lists.filter((p) => p.id !== deleteTarget.id);
    setLists(updated);
    initialPartylists.length = 0;
    updated.forEach((u) => initialPartylists.push(u));
    savePartylists();

    // Cascade: clear candidate partylistId association
    let cascadeCount = 0;
    candidates.forEach((c) => {
      if (c.partylistId === deleteTarget.id) {
        c.partylistId = undefined;
        cascadeCount++;
      }
    });

    if (cascadeCount > 0) {
      saveCandidates();
      toast.success(`Partylist deleted. ${cascadeCount} candidates reassigned as Independent.`);
    } else {
      toast.success("Partylist deleted successfully!");
    }

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Partylists</h1>
          <p className="text-muted-foreground">
            Manage student partylists and political coalitions
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-brand text-white hover:bg-brand/90 font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Add Partylist
        </Button>
      </div>

      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed bg-muted/40 min-h-[300px]">
          <Flag className="w-12 h-12 text-muted-foreground/60 mb-4 stroke-[1.5]" />
          <h3 className="font-bold text-lg mb-1">No Partylists Found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Partylists represent political groups or coalitions student nominees campaign under.
          </p>
          <Button
            onClick={handleOpenAdd}
            className="bg-brand text-white hover:bg-brand/90 font-semibold shadow-sm"
          >
            Create First Partylist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((party) => {
            const nomineesCount = candidates.filter((c) => c.partylistId === party.id).length;
            return (
              <div
                key={party.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md hover:border-brand/35"
              >
                <div
                  className="absolute top-0 left-0 w-full h-[6px]"
                  style={{ backgroundColor: party.color }}
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-muted-foreground/10 group-hover:scale-105 transition">
                      <img
                        src={party.logo}
                        alt={`${party.name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(party.acronym)}&background=${party.color.replace("#", "")}&color=fff&bold=true`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 text-xs font-extrabold rounded-md text-white shadow-sm"
                          style={{ backgroundColor: party.color }}
                        >
                          {party.acronym}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {nomineesCount} {nomineesCount === 1 ? "nominee" : "nominees"}
                        </span>
                      </div>
                      <h3 className="font-bold text-base leading-tight mt-1 text-foreground">
                        {party.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {party.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t pt-4 mt-5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(party)}
                    className="h-8 px-3 font-semibold text-xs text-muted-foreground hover:text-brand hover:border-brand flex items-center gap-1.5 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRequest(party)}
                    className="h-8 px-3 font-semibold text-xs text-muted-foreground hover:text-danger hover:border-danger flex items-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingId ? "Edit Partylist" : "Add New Partylist"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the partylist identity, acronym, representation color, and description.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="party-name" className="text-xs font-semibold">
                  Partylist Name <span className="text-danger">*</span>
                </Label>
                <Input
                  id="party-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Students First Party"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="party-acronym" className="text-xs font-semibold">
                  Acronym <span className="text-danger">*</span>
                </Label>
                <Input
                  id="party-acronym"
                  value={acronym}
                  onChange={(e) => setAcronym(e.target.value)}
                  placeholder="e.g. SFP"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="party-description" className="text-xs font-semibold">
                Description
              </Label>
              <Textarea
                id="party-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly state the partylist's objectives or core manifesto themes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="party-logo" className="text-xs font-semibold">
                  Logo URL (Optional)
                </Label>
                <Input
                  id="party-logo"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://example.com/logo.jpg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="party-color" className="text-xs font-semibold">
                  Color Theme
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="party-color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-10 p-0 border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#2E86AB"
                    className="h-10 text-xs px-2 font-mono"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-brand text-white hover:bg-brand/90 font-semibold shadow-sm"
              >
                {editingId ? "Save Changes" : "Create Partylist"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(isOpen) => !isOpen && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-2.5 text-warning mb-1">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <AlertDialogTitle className="text-lg font-bold">Delete Partylist?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to delete the partylist{" "}
              <strong className="text-foreground">"{deleteTarget?.name}"</strong> (
              {deleteTarget?.acronym})?
              {assignedCount > 0 && (
                <div className="mt-3 p-3.5 bg-warning/10 border border-warning/20 text-warning text-xs font-semibold rounded-xl leading-normal">
                  <ShieldAlert className="w-4 h-4 inline mr-1.5 -mt-0.5 text-warning" />
                  Warning: There are {assignedCount} nominee{assignedCount > 1 ? "s" : ""} assigned
                  to this partylist. Deleting this partylist will set their affiliation to
                  Independent. This action cannot be undone.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-danger text-white hover:bg-danger/90 font-semibold shadow-sm"
            >
              Proceed & Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
