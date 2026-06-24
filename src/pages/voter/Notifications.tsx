import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { notifications as initial } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const icons = {
  info: Info, success: CheckCircle2, warning: AlertTriangle, alert: Bell,
};
const colors = {
  info: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  alert: "bg-danger/10 text-danger",
};

export default function Notifications() {
  const [items, setItems] = useState(initial);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Notifications</h1>
          <p className="text-muted-foreground">Stay up to date on elections and your account</p>
        </div>
        <Button variant="outline" onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}>
          Mark all as read
        </Button>
      </div>
      <div className="rounded-xl bg-card border border-border divide-y divide-border overflow-hidden">
        {items.map((n) => {
          const Icon = icons[n.type];
          return (
            <div key={n.id} className={`p-5 flex items-start gap-4 ${!n.read ? "bg-brand/5" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[n.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-brand mt-1.5 shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
