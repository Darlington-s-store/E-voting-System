import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Camera,
  KeyRound,
  ShieldCheck,
  QrCode,
  Download,
  User,
  Phone,
  Edit2,
  Check,
  X,
  Smartphone,
  MapPin,
  Clock,
  Vote,
  Trophy,
  Activity,
  Save,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { voters, saveVoters, elections, departments, faculties, levels } from "@/lib/mock-data";

export default function VoterProfile() {
  const user = useAuth((s) => s.user);
  const update = useAuth((s) => s.update);

  // States
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editFaculty, setEditFaculty] = useState(user?.faculty || "");
  const [editDept, setEditDept] = useState(user?.department || "");
  const [editLevel, setEditLevel] = useState(user?.level || "");

  const [twoFA, setTwoFA] = useState(user?.twoFAEnabled ?? false);
  const [phone, setPhone] = useState(user?.phone || "");
  const [tempPhone, setTempPhone] = useState(phone);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const startEditing = () => {
    setEditName(user?.name || "");
    setEditFaculty(user?.faculty || "");
    setEditDept(user?.department || "");
    setEditLevel(user?.level || "");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveProfile = () => {
    update({ name: editName, faculty: editFaculty, department: editDept, level: editLevel });
    const idx = voters.findIndex((v) => v.studentId === user?.studentId);
    if (idx !== -1) {
      voters[idx].name = editName;
      voters[idx].faculty = editFaculty;
      voters[idx].department = editDept;
      voters[idx].level = editLevel;
      saveVoters();
    }
    setEditing(false);
    toast.success("Profile updated successfully");
  };

  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    const val = localStorage.getItem("votesecure_voted_elections");
    if (val) {
      setVotedIds(JSON.parse(val));
    }
  }, []);

  const handlePhoneSave = () => {
    if (!tempPhone.trim()) {
      toast.error("Phone number cannot be empty");
      return;
    }
    setPhone(tempPhone);
    update({ phone: tempPhone });

    // Sync to mock-data voters
    const idx = voters.findIndex((v) => v.studentId === user?.studentId);
    if (idx !== -1) {
      voters[idx].phoneNumber = tempPhone;
      saveVoters();
    }
    setIsEditingPhone(false);
    toast.success("Phone number updated successfully!");
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Generate QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    user?.studentId || "",
  )}&color=1E3A5F&margin=10`;

  const activeSessions: {
    device: string;
    ip: string;
    location: string;
    status: string;
    current: boolean;
  }[] = [];

  // Dynamic voting history timeline
  const votedElectionsList = elections.filter((e) => votedIds.includes(e.id));

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Review your student credentials, manage security tokens, and view voting logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: PROFILE CARD & QR CODE (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft text-center flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-brand/10 shadow-md object-cover"
              />
              <button
                onClick={() => toast.success("Upload photo feature coming soon")}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand text-white border-2 border-card flex items-center justify-center hover:bg-brand/90 transition-all hover:scale-105 shadow-sm"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="font-extrabold text-lg text-foreground leading-tight">{user?.name}</h2>
            <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
              {user?.role} Account
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">{user?.department}</p>
          </div>

          {/* QR Code Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft text-center space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center justify-center gap-1.5 border-b border-border pb-3">
              <QrCode className="w-4 h-4 text-brand" /> Digital Voter ID Card
            </h3>

            <div className="bg-white p-3 rounded-xl border border-border/80 w-fit mx-auto shadow-inner">
              <img src={qrCodeUrl} alt="Voter QR ID" className="w-40 h-40" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Voter token data
              </span>
              <p className="font-mono text-xs font-bold text-foreground truncate">
                {user?.studentId}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold border-border/80 hover:bg-muted/10"
              onClick={() => {
                const link = document.createElement("a");
                link.href = qrCodeUrl;
                link.target = "_blank";
                link.download = `Voter_ID_QR_${user?.studentId}.png`;
                link.click();
                toast.success("QR Code download triggered!");
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download QR Code
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL TABS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-soft">
            {/* Native CSS tabs */}
            <div className="flex border-b border-border/60 pb-3 mb-6 gap-6 overflow-x-auto">
              {/* Personal Info Tab trigger */}
              <button
                id="tab-btn-personal"
                onClick={() => {
                  document.getElementById("profile-tab-personal")?.classList.remove("hidden");
                  document.getElementById("profile-tab-security")?.classList.add("hidden");
                  document.getElementById("profile-tab-summary")?.classList.add("hidden");
                  document
                    .getElementById("tab-btn-personal")
                    ?.classList.add("border-brand", "text-brand");
                  document
                    .getElementById("tab-btn-security")
                    ?.classList.remove("border-brand", "text-brand");
                  document
                    .getElementById("tab-btn-summary")
                    ?.classList.remove("border-brand", "text-brand");
                }}
                className="text-xs font-extrabold uppercase tracking-wider pb-1.5 border-b-2 border-brand text-brand whitespace-nowrap transition-colors"
              >
                Personal Info
              </button>
              {/* Security Tab trigger */}
              <button
                id="tab-btn-security"
                onClick={() => {
                  document.getElementById("profile-tab-personal")?.classList.add("hidden");
                  document.getElementById("profile-tab-security")?.classList.remove("hidden");
                  document.getElementById("profile-tab-summary")?.classList.add("hidden");
                  document
                    .getElementById("tab-btn-personal")
                    ?.classList.remove("border-brand", "text-brand");
                  document
                    .getElementById("tab-btn-security")
                    ?.classList.add("border-brand", "text-brand");
                  document
                    .getElementById("tab-btn-summary")
                    ?.classList.remove("border-brand", "text-brand");
                }}
                className="text-xs font-extrabold uppercase tracking-wider pb-1.5 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
              >
                Security & 2FA
              </button>
              {/* Summary Tab trigger */}
              <button
                id="tab-btn-summary"
                onClick={() => {
                  document.getElementById("profile-tab-personal")?.classList.add("hidden");
                  document.getElementById("profile-tab-security")?.classList.add("hidden");
                  document.getElementById("profile-tab-summary")?.classList.remove("hidden");
                  document
                    .getElementById("tab-btn-personal")
                    ?.classList.remove("border-brand", "text-brand");
                  document
                    .getElementById("tab-btn-security")
                    ?.classList.remove("border-brand", "text-brand");
                  document
                    .getElementById("tab-btn-summary")
                    ?.classList.add("border-brand", "text-brand");
                }}
                className="text-xs font-extrabold uppercase tracking-wider pb-1.5 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
              >
                Voting Summary ({votedIds.length})
              </button>
            </div>

            {/* TAB 1: PERSONAL INFORMATION */}
            <div id="profile-tab-personal" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                  <User className="w-4 h-4 text-brand" /> Personal Details
                </h3>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startEditing}
                    className="text-xs font-bold"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelEditing}
                      className="text-xs font-bold"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveProfile}
                      className="bg-brand text-white text-xs font-bold"
                    >
                      <Save className="w-3.5 h-3.5 mr-1" /> Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {editing ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-semibold uppercase">
                        Full Name
                      </Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-10 text-sm font-bold"
                      />
                    </div>
                    <ReadOnlyField label="Student Index ID" value={user?.studentId ?? ""} />
                    <ReadOnlyField label="Official Email" value={user?.email ?? ""} />
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-semibold uppercase">
                        Faculty
                      </Label>
                      <Select value={editFaculty} onValueChange={setEditFaculty}>
                        <SelectTrigger className="h-10 text-sm font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {faculties.map((f: string) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-semibold uppercase">
                        Department
                      </Label>
                      <Select value={editDept} onValueChange={setEditDept}>
                        <SelectTrigger className="h-10 text-sm font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((d: string) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-semibold uppercase">
                        Level
                      </Label>
                      <Select value={editLevel} onValueChange={setEditLevel}>
                        <SelectTrigger className="h-10 text-sm font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((l: string) => (
                            <SelectItem key={l} value={l}>
                              Level {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <ReadOnlyField label="Full Name" value={user?.name ?? ""} />
                    <ReadOnlyField label="Student Index ID" value={user?.studentId ?? ""} />
                    <ReadOnlyField label="Official Email" value={user?.email ?? ""} />
                    <ReadOnlyField label="Faculty" value={user?.faculty ?? ""} />
                    <ReadOnlyField label="Department" value={user?.department ?? ""} />
                    <ReadOnlyField
                      label="Current Level"
                      value={user?.level ? `Level ${user.level}` : ""}
                    />
                  </>
                )}
              </div>

              {/* Editable Phone number */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <Label className="text-sm font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Contact Phone Number
                </Label>

                {isEditingPhone ? (
                  <div className="flex gap-2 max-w-md">
                    <Input
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="h-10 text-sm font-semibold"
                    />
                    <Button
                      onClick={handlePhoneSave}
                      className="bg-success text-white shrink-0 h-10 w-10 p-0 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTempPhone(phone);
                        setIsEditingPhone(false);
                      }}
                      className="shrink-0 h-10 w-10 p-0 rounded-lg border-border"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-muted/10 max-w-md justify-between">
                    <span className="text-sm font-bold text-foreground">{phone}</span>
                    <button
                      onClick={() => setIsEditingPhone(true)}
                      className="p-1.5 rounded-lg border border-border/85 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* TAB 2: SECURITY & TWO FACTOR */}
            <div id="profile-tab-security" className="hidden space-y-6">
              {/* Change Password form */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-foreground border-b border-border/40 pb-2">
                  <KeyRound className="w-4 h-4 text-brand" /> Password Security
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Current password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">New password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Confirm password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePasswordUpdate}
                  className="bg-brand text-white hover:bg-brand/90 text-xs font-bold h-9"
                >
                  Update Password
                </Button>
              </div>

              {/* Two factor switch */}
              <div className="p-4 rounded-xl border border-border bg-muted/15 flex items-center justify-between gap-4 mt-6">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                    <ShieldCheck className="w-4 h-4 text-success" /> Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-muted-foreground leading-normal max-w-md">
                    Require a TOTP passcode from an authenticator app (Google Authenticator, Duo)
                    when signing in.
                  </p>
                </div>
                <Switch
                  checked={twoFA}
                  onCheckedChange={(v) => {
                    setTwoFA(v);
                    update({ twoFAEnabled: v });
                    toast.success(
                      v ? "2FA authentication tokens enabled" : "2FA authentication disabled",
                    );
                  }}
                />
              </div>

              {/* Active Sessions Log */}
              <div className="space-y-3 mt-6">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                  <Smartphone className="w-4.5 h-4.5 text-brand" /> Active Login Sessions
                </h3>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-muted text-muted-foreground border-b border-border font-bold uppercase tracking-wider">
                        <tr>
                          <th className="text-left p-3">Device Platform</th>
                          <th className="text-left p-3">Location</th>
                          <th className="text-left p-3">IP Address</th>
                          <th className="text-right p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {activeSessions.map((session, i) => (
                          <tr key={i} className="hover:bg-muted/10 transition-colors">
                            <td className="p-3 font-semibold flex items-center gap-2">
                              <Smartphone
                                className={`w-3.5 h-3.5 ${session.current ? "text-brand" : "text-muted-foreground"}`}
                              />
                              {session.device}
                            </td>
                            <td className="p-3 text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {session.location}
                            </td>
                            <td className="p-3 font-mono text-muted-foreground">{session.ip}</td>
                            <td className="p-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded font-bold ${
                                  session.current
                                    ? "bg-success/15 text-success border border-success/30"
                                    : "bg-muted text-muted-foreground border border-border"
                                }`}
                              >
                                {session.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 3: VOTING SUMMARY TIMELINE */}
            <div id="profile-tab-summary" className="hidden space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-muted/10">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Portfolios Voted
                  </span>
                  <span className="text-2xl font-black text-foreground mt-1 block">
                    {votedIds.length}
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-border bg-[#F4C430]/5 border-[#F4C430]/15">
                  <span className="text-[10px] font-bold text-[#F4C430] uppercase tracking-wider block">
                    Award Casts
                  </span>
                  <span className="text-2xl font-black text-white mt-1 block">
                    {votedIds.filter((id) => id.includes("awards")).length}
                  </span>
                </div>
              </div>

              {/* Vertical Timeline List */}
              <div className="space-y-4 mt-6">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-foreground">
                  <Activity className="w-4.5 h-4.5 text-brand" /> Voting Activity Log
                </h3>

                {votedElectionsList.length > 0 ? (
                  <div className="relative border-l border-border pl-6 space-y-6">
                    {votedElectionsList.map((e) => {
                      const isAward = e.type === "Campus Awards";
                      return (
                        <div key={e.id} className="relative">
                          {/* Timeline node */}
                          <span
                            className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-card ${
                              isAward ? "bg-[#F4C430] text-black" : "bg-brand text-white"
                            }`}
                          >
                            {isAward ? (
                              <Trophy className="w-2.5 h-2.5" />
                            ) : (
                              <Vote className="w-2.5 h-2.5" />
                            )}
                          </span>

                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-foreground">{e.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Category: <strong className="text-foreground">{e.type}</strong> ·
                              Ballot Cast successfully
                            </p>
                            <span className="text-[10px] font-semibold text-muted-foreground/60 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" /> cast on {format(new Date(), "PPpp")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs font-semibold text-muted-foreground">
                    No active voting timeline log recorded yet. Cast a ballot to see activities.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground font-semibold uppercase">{label}</Label>
      <Input
        value={value}
        readOnly
        className="bg-muted/40 h-10 text-sm font-bold text-foreground border-border/80 select-all"
      />
    </div>
  );
}
