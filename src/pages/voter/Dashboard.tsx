import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Vote, CheckCircle2, Clock, ArrowRight, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { elections, notifications, getPositionsForElection } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/shared/Countdown";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function VoterDashboard() {
  const user = useAuth((s) => s.user);
  const active = elections.filter((e) => e.status === "open");
  const upcoming = elections.filter((e) => e.status === "scheduled");
  const history = [
    { election: "Hostel Governor Elections", position: "President", date: "2026-05-04T14:32:00Z" },
    { election: "Hostel Governor Elections", position: "Vice President", date: "2026-05-04T14:33:00Z" },
  ];
  return (
    <div className="space-y-8">
      <div className="rounded-xl p-6 md:p-8 gradient-navy text-white shadow-soft">
        <h1 className="text-2xl md:text-3xl font-extrabold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
        <p className="mt-1 text-white/80">{user?.department} · {format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Vote className="w-5 h-5 text-success" /> Active Elections</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {active.map((e) => {
            const positions = getPositionsForElection(e.id);
            return (
              <div key={e.id} className="rounded-xl bg-card border border-border p-6 shadow-soft">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-lg">{e.name}</h3>
                  <StatusBadge status={e.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{positions.length} positions available</p>
                <div className="text-xs text-muted-foreground mb-1">Ends in</div>
                <Countdown target={e.endDate} compact />
                <Link to={`/voter/elections/${e.id}/vote`} className="block mt-5">
                  <Button className="w-full bg-success text-white hover:bg-success/90">Vote Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-brand" /> Upcoming Elections</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {upcoming.map((e) => (
            <div key={e.id} className="rounded-xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-lg">{e.name}</h3>
                <StatusBadge status={e.status} />
              </div>
              <div className="text-xs text-muted-foreground mb-1">Starts in</div>
              <Countdown target={e.startDate} compact />
              <Button disabled className="w-full mt-5" variant="outline">Not yet open</Button>
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-purple" /> My Voting History</h2>
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr><th className="text-left p-3">Election</th><th className="text-left p-3">Position</th><th className="text-left p-3">Date Voted</th><th className="text-left p-3">Status</th></tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/30">
                    <td className="p-3 font-medium">{h.election}</td>
                    <td className="p-3 text-muted-foreground">{h.position}</td>
                    <td className="p-3 font-mono text-xs">{format(new Date(h.date), "MMM d, yyyy HH:mm")}</td>
                    <td className="p-3"><span className="inline-flex items-center gap-1 text-success font-semibold text-xs"><CheckCircle2 className="w-4 h-4" /> Recorded</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-warning" /> Notifications</h2>
          <div className="rounded-xl bg-card border border-border divide-y divide-border">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className={`p-4 ${!n.read ? "bg-brand/5" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-brand mt-1.5 shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
