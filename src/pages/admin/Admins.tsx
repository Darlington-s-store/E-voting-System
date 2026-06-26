import { useState } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Mail,
  Phone,
  Calendar,
  Lock,
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminAccounts as initialAdmins,
  saveAdminAccounts,
  type AdminAccount,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function Admins() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSuper = user?.adminRole === "super";

  const [admins, setAdmins] = useState<AdminAccount[]>(initialAdmins);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"super" | "sub">("sub");
  const [status, setStatus] = useState<"active" | "suspended">("active");

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);

  // If NOT Super Admin, render the Access Denied UI
  if (!isSuper) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[70vh]">
        <div className="max-w-md w-full p-8 rounded-3xl border border-danger/10 bg-danger/5 backdrop-blur-md shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center text-danger mb-6 animate-pulse">
            <Lock className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mb-2 text-foreground">
            Access Restricted
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            This module manages system-level administrator privileges and audit profiles. Access is
            strictly limited to <strong>Super Administrators</strong>.
          </p>
          <div className="w-full space-y-3">
            <Button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full bg-brand text-white hover:bg-brand/90 font-bold transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
            <p className="text-xs text-muted-foreground">
              Logged in as: <span className="font-semibold">{user?.name}</span> ({user?.adminRole}{" "}
              admin)
            </p>
          </div>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("sub");
    setStatus("active");
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = (admin: AdminAccount) => {
    setEditingId(admin.id);
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone);
    setRole(admin.role);
    setStatus(admin.status);
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email are required fields.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Duplicate validation (ignoring self if editing)
    const isDuplicate = admins.some(
      (a) => a.id !== editingId && a.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("An administrator account with this email already exists.");
      return;
    }

    if (editingId) {
      // Edit mode
      // Prevent editing yourself to suspend yourself or demote yourself
      if (editingId === user?.id && (status === "suspended" || role !== "super")) {
        toast.error("You cannot suspend or change the role of your active session account.");
        return;
      }

      const updated = admins.map((a) =>
        a.id === editingId
          ? {
              ...a,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              role,
              status,
            }
          : a,
      );
      setAdmins(updated);
      initialAdmins.length = 0;
      updated.forEach((u) => initialAdmins.push(u));
      saveAdminAccounts();
      toast.success("Administrator account updated successfully!");
    } else {
      // Create mode
      const newAdmin: AdminAccount = {
        id: `admin-acc-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        status,
        lastLogin: "Never logged in",
        dateCreated: new Date().toISOString(),
      };
      const updated = [...admins, newAdmin];
      setAdmins(updated);
      initialAdmins.length = 0;
      updated.forEach((u) => initialAdmins.push(u));
      saveAdminAccounts();
      toast.success("Administrator account created successfully!");
    }

    setOpen(false);
    resetForm();
  };

  const handleToggleStatus = (admin: AdminAccount) => {
    if (admin.id === user?.id) {
      toast.error("You cannot suspend your active session account.");
      return;
    }

    const nextStatus: "active" | "suspended" = admin.status === "active" ? "suspended" : "active";
    const updated = admins.map((a) => (a.id === admin.id ? { ...a, status: nextStatus } : a));
    setAdmins(updated);
    initialAdmins.length = 0;
    updated.forEach((u) => initialAdmins.push(u));
    saveAdminAccounts();
    toast.success(
      `Account for ${admin.name} has been ${nextStatus === "active" ? "activated" : "suspended"}.`,
    );
  };

  const handleDeleteRequest = (admin: AdminAccount) => {
    if (admin.id === user?.id) {
      toast.error("You cannot delete your active session account.");
      return;
    }
    setDeleteTarget(admin);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const updated = admins.filter((a) => a.id !== deleteTarget.id);
    setAdmins(updated);
    initialAdmins.length = 0;
    updated.forEach((u) => initialAdmins.push(u));
    saveAdminAccounts();

    toast.success("Administrator account deleted successfully!");
    setDeleteTarget(null);
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Accounts</h1>
          <p className="text-muted-foreground">
            Monitor and manage administrator access privileges
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-brand text-white hover:bg-brand/90 font-semibold flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Add Admin
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role..."
            className="pl-9 h-10 text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground self-end sm:self-auto">
          Showing {filteredAdmins.length} of {admins.length} administrator accounts
        </div>
      </div>

      {filteredAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed bg-muted/40 min-h-[300px]">
          <ShieldAlert className="w-12 h-12 text-muted-foreground/60 mb-4 stroke-[1.5]" />
          <h3 className="font-bold text-lg mb-1">No Accounts Found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Try adjusting your search terms or create a new administrator account.
          </p>
        </div>
      ) : (
        <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-muted/45 border-b text-muted-foreground font-semibold">
                  <th className="p-4 pl-6">Administrator</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-muted/15 transition-colors">
                    <td className="p-4 pl-6 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {admin.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold">{admin.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(admin.dateCreated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{admin.email}</span>
                        </div>
                        {admin.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{admin.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          admin.role === "super"
                            ? "bg-brand/10 text-brand"
                            : "bg-muted text-muted-foreground border"
                        }`}
                      >
                        {admin.role === "super" ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-brand" />
                            Super Admin
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 h-3 text-muted-foreground" />
                            Sub Admin
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          admin.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger animate-pulse"
                        }`}
                      >
                        {admin.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {admin.lastLogin === "Never logged in"
                        ? admin.lastLogin
                        : new Date(admin.lastLogin).toLocaleString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(admin)}
                          title={admin.status === "active" ? "Suspend Admin" : "Activate Admin"}
                          className={`w-8 h-8 rounded-lg ${
                            admin.status === "active"
                              ? "text-danger hover:bg-danger/10 hover:text-danger"
                              : "text-success hover:bg-success/10 hover:text-success"
                          }`}
                        >
                          {admin.status === "active" ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(admin)}
                          className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                          title="Edit Info"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRequest(admin)}
                          className="w-8 h-8 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingId ? "Edit Admin Account" : "Add Admin Account"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the identity, role level, and initial status of this administrator account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="admin-name" className="text-xs font-semibold">
                Full Name <span className="text-danger">*</span>
              </Label>
              <Input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold">
                Email Address <span className="text-danger">*</span>
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@votesecure.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-phone" className="text-xs font-semibold">
                Phone Number (Optional)
              </Label>
              <Input
                id="admin-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 000-0000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-role" className="text-xs font-semibold">
                  Access Level
                </Label>
                <Select value={role} onValueChange={(val: "super" | "sub") => setRole(val)}>
                  <SelectTrigger id="admin-role" className="h-10">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super">Super Admin</SelectItem>
                    <SelectItem value="sub">Sub Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-status" className="text-xs font-semibold">
                  Account Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(val: "active" | "suspended") => setStatus(val)}
                >
                  <SelectTrigger id="admin-status" className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
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
                {editingId ? "Save Changes" : "Create Account"}
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
            <div className="flex items-center gap-2.5 text-danger mb-1">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <AlertDialogTitle className="text-lg font-bold">
                Delete Administrator Account?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to permanently delete the administrator account for{" "}
              <strong className="text-foreground">"{deleteTarget?.name}"</strong> (
              {deleteTarget?.email})?
              <div className="mt-3 p-3 bg-danger/5 border border-danger/10 text-danger text-xs font-medium rounded-xl leading-normal">
                Deleting this account will immediately revoke all dashboard session authorization
                and access keys. This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-danger text-white hover:bg-danger/90 font-semibold shadow-sm"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
