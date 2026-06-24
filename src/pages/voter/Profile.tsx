import { useState } from "react";
import { Camera, KeyRound, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Profile() {
  const user = useAuth((s) => s.user);
  const update = useAuth((s) => s.update);
  const [twoFA, setTwoFA] = useState(user?.twoFAEnabled ?? false);
  const [phone, setPhone] = useState(user?.phone ?? "");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information and security settings</p>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img src={user?.avatar} alt="" className="w-20 h-20 rounded-full" />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand/90">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="text-lg font-bold">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <h2 className="font-bold mb-4">Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <ReadOnlyField label="Full Name" value={user?.name ?? ""} />
          <ReadOnlyField label="Student ID" value={user?.studentId ?? ""} />
          <ReadOnlyField label="Email" value={user?.email ?? ""} />
          <ReadOnlyField label="Department" value={user?.department ?? ""} />
          <ReadOnlyField label="Faculty" value={user?.faculty ?? ""} />
          <ReadOnlyField label="Level" value={user?.level ?? ""} />
          <div className="space-y-2 sm:col-span-2">
            <Label>Phone (editable)</Label>
            <div className="flex gap-2">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button onClick={() => { update({ phone }); toast.success("Phone updated"); }}>Save</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft space-y-5">
        <h2 className="font-bold flex items-center gap-2"><KeyRound className="w-4 h-4" /> Change Password</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input type="password" placeholder="Current password" />
          <Input type="password" placeholder="New password" />
          <Input type="password" placeholder="Confirm new" />
        </div>
        <Button onClick={() => toast.success("Password updated")} className="bg-brand text-white">Update Password</Button>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Two-Factor Authentication</h2>
            <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security with TOTP</p>
          </div>
          <Switch checked={twoFA} onCheckedChange={(v) => { setTwoFA(v); update({ twoFAEnabled: v }); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} readOnly className="bg-muted/40" />
    </div>
  );
}
