import { useState } from "react";
import {
  Building2,
  Palette,
  Bell,
  Shield,
  Save,
  Wrench,
  Trash2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/auth-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  resetVoteCounts,
  wipeAllElectionsAndVotes,
  restoreDemoData,
  restoreCleanDefaults,
} from "@/lib/mock-data";
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

export default function Settings() {
  const { theme, toggle } = useTheme();
  const [name, setName] = useState("University of Lagos");
  const [confirmType, setConfirmType] = useState<
    "resetVotes" | "wipeData" | "restoreClean" | "restoreDemo" | null
  >(null);

  const handleMaintenanceAction = () => {
    if (!confirmType) return;

    if (confirmType === "resetVotes") {
      resetVoteCounts();
      toast.success("All votes reset successfully!");
    } else if (confirmType === "wipeData") {
      wipeAllElectionsAndVotes();
      toast.success("All elections, candidates, and positions wiped!");
    } else if (confirmType === "restoreClean") {
      restoreCleanDefaults();
      toast.success("Initial clean elections and candidates restored!");
    } else if (confirmType === "restoreDemo") {
      restoreDemoData();
      toast.success("Demo elections and candidate votes restored!");
    }

    setConfirmType(null);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold">Settings</h1>
        <p className="text-muted-foreground">Configure your platform</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Building2 className="w-4 h-4 mr-2" /> Institution
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="w-4 h-4 mr-2" /> Maintenance
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="general"
          className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4"
        >
          <div className="space-y-2">
            <Label>Institution name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Contact email</Label>
            <Input defaultValue="elections@unilag.edu.ng" />
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Input defaultValue="Africa/Lagos" />
          </div>
          <Button onClick={() => toast.success("Saved")} className="bg-brand text-white">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </TabsContent>

        <TabsContent
          value="appearance"
          className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Dark mode</div>
              <div className="text-sm text-muted-foreground">Toggle the platform appearance</div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4"
        >
          {[
            ["Email on new election", true],
            ["Email on vote cast", false],
            ["SMS reminders", true],
            ["Weekly admin digest", true],
          ].map(([label, def]) => (
            <div key={label as string} className="flex items-center justify-between">
              <span>{label}</span>
              <Switch defaultChecked={def as boolean} />
            </div>
          ))}
        </TabsContent>

        <TabsContent
          value="security"
          className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Require 2FA for admins</div>
              <div className="text-sm text-muted-foreground">Recommended</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Session timeout (30 min)</div>
              <div className="text-sm text-muted-foreground">Auto sign-out after inactivity</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">IP allowlist</div>
              <div className="text-sm text-muted-foreground">Restrict admin access by IP</div>
            </div>
            <Switch />
          </div>
        </TabsContent>

        <TabsContent
          value="maintenance"
          className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-6 animate-fade-in"
        >
          <div>
            <h3 className="text-lg font-bold text-danger flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger animate-pulse" /> Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Actions below are destructive and modify active system elections and votes. Use with
              caution.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-4">
            {/* Reset votes */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-warning animate-spin-slow" />
                  Reset Vote Counts
                </div>
                <p className="text-xs text-muted-foreground">
                  Resets votesCast to 0 on all elections and candidates. Clears voter ballots.
                  Perfect for starting the same elections over.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setConfirmType("resetVotes")}
                className="mt-4 border-warning/30 hover:bg-warning/10 hover:text-warning"
              >
                Reset Votes
              </Button>
            </div>

            {/* Wipe all data */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-danger animate-bounce-slow" />
                  Wipe All Data
                </div>
                <p className="text-xs text-muted-foreground">
                  Completely deletes all elections, candidates, and positions. Resets the database
                  to a blank state.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setConfirmType("wipeData")}
                className="mt-4 bg-danger text-white hover:bg-danger/95"
              >
                Wipe System Data
              </Button>
            </div>

            {/* Restore Clean Defaults */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-brand" />
                  Restore Clean Defaults
                </div>
                <p className="text-xs text-muted-foreground">
                  Resets system data and restores the initial sample elections and candidates, but
                  with 0 votes cast.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setConfirmType("restoreClean")}
                className="mt-4 border-brand/30 hover:bg-brand/10 hover:text-brand"
              >
                Restore Clean Defaults
              </Button>
            </div>

            {/* Restore Demo Data */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-success" />
                  Restore Demo Data
                </div>
                <p className="text-xs text-muted-foreground">
                  Resets system data and restores sample elections with populated mock votes (for
                  testing charts).
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setConfirmType("restoreDemo")}
                className="mt-4 border-success/30 hover:bg-success/10 hover:text-success"
              >
                Restore Demo Data
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={confirmType !== null}
        onOpenChange={(open) => !open && setConfirmType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmType === "resetVotes" &&
                "This will set all vote counts to zero and clear the voted status for all voters. This action cannot be undone."}
              {confirmType === "wipeData" &&
                "This will delete all elections, candidates, and positions. The system will be left completely empty. This action cannot be undone."}
              {confirmType === "restoreClean" &&
                "This will reset all elections and candidates, replacing them with the original sample records, but with 0 votes cast."}
              {confirmType === "restoreDemo" &&
                "This will reset all elections and candidates, restoring original sample records populated with simulated vote counts."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMaintenanceAction}
              className={
                confirmType === "wipeData"
                  ? "bg-danger text-white hover:bg-danger/90"
                  : "bg-brand text-white hover:bg-brand/90"
              }
            >
              Confirm Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
