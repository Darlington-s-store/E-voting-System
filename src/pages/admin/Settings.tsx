import { useState } from "react";
import { Building2, Palette, Bell, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/lib/auth-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Settings() {
  const { theme, toggle } = useTheme();
  const [name, setName] = useState("University of Lagos");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold">Settings</h1>
        <p className="text-muted-foreground">Configure your platform</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general"><Building2 className="w-4 h-4 mr-2" /> Institution</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="w-4 h-4 mr-2" /> Appearance</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4">
          <div className="space-y-2"><Label>Institution name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Contact email</Label><Input defaultValue="elections@unilag.edu.ng" /></div>
          <div className="space-y-2"><Label>Timezone</Label><Input defaultValue="Africa/Lagos" /></div>
          <Button onClick={() => toast.success("Saved")} className="bg-brand text-white"><Save className="w-4 h-4 mr-2" /> Save</Button>
        </TabsContent>

        <TabsContent value="appearance" className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div><div className="font-semibold">Dark mode</div><div className="text-sm text-muted-foreground">Toggle the platform appearance</div></div>
            <Switch checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4">
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

        <TabsContent value="security" className="rounded-xl bg-card border border-border p-6 shadow-soft mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div><div className="font-semibold">Require 2FA for admins</div><div className="text-sm text-muted-foreground">Recommended</div></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><div className="font-semibold">Session timeout (30 min)</div><div className="text-sm text-muted-foreground">Auto sign-out after inactivity</div></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><div className="font-semibold">IP allowlist</div><div className="text-sm text-muted-foreground">Restrict admin access by IP</div></div>
            <Switch />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
