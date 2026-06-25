import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, Star } from "lucide-react";
import {
  notifications as mockNotifications,
  saveNotifications,
  type AppNotification,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  alert: Bell,
};

const colors = {
  info: "bg-brand/10 text-brand border-brand/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  alert: "bg-danger/10 text-danger border-danger/20",
};

export default function VoterNotifications() {
  const [items, setItems] = useState<AppNotification[]>(() => mockNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "elections" | "awards">("all");

  const markAllAsRead = () => {
    mockNotifications.forEach((n) => {
      n.read = true;
    });
    saveNotifications();
    setItems([...mockNotifications]);
    toast.success("All alerts marked as read");
  };

  const toggleRead = (id: string) => {
    const idx = mockNotifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      mockNotifications[idx].read = !mockNotifications[idx].read;
      saveNotifications();
      setItems([...mockNotifications]);
    }
  };

  // Advanced filters
  const filteredItems = items.filter((n) => {
    const titleLower = n.title.toLowerCase();
    const msgLower = n.message.toLowerCase();
    const isAwards =
      titleLower.includes("award") || msgLower.includes("award") || msgLower.includes("nomination");

    if (activeTab === "unread" && n.read) return false;
    if (activeTab === "elections" && isAwards) return false;
    if (activeTab === "awards" && !isAwards) return false;

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F4C430]/5 border border-[#F4C430]/10 flex items-center justify-center text-[#F4C430]">
            <Bell className="w-6 h-6 fill-current/5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay up to date on elections, nominations, and security updates.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          className="h-10 text-xs font-bold border-border/80 text-muted-foreground hover:text-foreground shrink-0 shadow-sm"
        >
          Mark all as read
        </Button>
      </div>

      {/* Tabs list */}
      <div className="flex bg-muted p-1 rounded-lg border border-border w-fit">
        {[
          { value: "all", label: "All Alerts" },
          { value: "unread", label: "Unread" },
          { value: "elections", label: "Elections" },
          { value: "awards", label: "Campus Awards" },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value as typeof activeTab)}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === t.value
                ? "bg-brand text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications stack */}
      {filteredItems.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden divide-y divide-border/60 animate-fade-in">
          {filteredItems.map((n) => {
            const Icon = icons[n.type] || Info;
            return (
              <div
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={`p-5 flex items-start gap-4 cursor-pointer hover:bg-muted/10 transition-colors relative group ${
                  !n.read ? "bg-brand/5 border-l-2 border-l-brand" : ""
                }`}
              >
                {/* Visual marker */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colors[n.type]}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`text-sm leading-none font-bold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground/60 font-semibold">
                        {n.time}
                      </span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                </div>

                {/* Hover indicator tooltip */}
                <span className="absolute right-4 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-black text-muted-foreground/60 uppercase">
                  Click to mark as {n.read ? "unread" : "read"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-4">
            <Bell className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <h3 className="font-bold text-lg font-extrabold">All caught up!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No notifications found matching your current filter tab.
          </p>
        </div>
      )}
    </div>
  );
}
