import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  Vote,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bell,
  Star,
  Trophy,
  Sparkles,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { elections, notifications, getPositionsForElection, voters } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/shared/Countdown";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";

export default function VoterDashboard() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  // Keep time updated for live greeting checks
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hr = time.getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get voted election IDs from localStorage
  const getVotedElections = (): string[] => {
    if (typeof window === "undefined") return [];
    const val = localStorage.getItem("votesecure_voted_elections");
    return val ? JSON.parse(val) : [];
  };

  const votedElectionIds = getVotedElections();

  const activeElections = elections.filter(
    (e) => e.type !== "Campus Awards" && e.status === "open",
  );

  const activeAwards = elections.filter((e) => e.type === "Campus Awards" && e.status === "open");

  const upcoming = elections.filter((e) => e.status === "scheduled");

  // Stats Counters
  const electionsToVoteCount = activeElections.filter(
    (e) => !votedElectionIds.includes(e.id),
  ).length;
  const awardsToVoteCount = activeAwards.filter((e) => !votedElectionIds.includes(e.id)).length;
  const completedVotesCount = votedElectionIds.length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const dynamicTurnoutData = elections.map((e) => ({
    name: e.name.length > 18 ? e.name.substring(0, 15) + "..." : e.name,
    turnout: e.totalEligible > 0 ? Math.round((e.votesCast / e.totalEligible) * 100) : 0,
  }));

  const totalElectionsCount = elections.length;
  const dynamicBallotStatusData = [
    { name: "Voted", value: completedVotesCount, color: "var(--color-success)" },
    {
      name: "Pending",
      value: Math.max(0, totalElectionsCount - completedVotesCount),
      color: "var(--color-brand)",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Time-Based Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#022C22] to-[#059669] text-white shadow-soft flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5 relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-white/85 text-sm font-medium">
            {user?.department} · Level {user?.level} · {format(time, "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        {/* Quick status message */}
        <div className="relative z-10 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs font-bold shrink-0 self-start md:self-auto flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-green-300 fill-green-300/10" />
          Voter Status:{" "}
          <span className="text-green-300 uppercase tracking-wider">
            {voters.find((v) => v.studentId === user?.studentId)?.status || "active"}
          </span>
        </div>

        {/* Backdrop visual elements */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-1" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl -z-1" />
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Elections to Vote",
            value: electionsToVoteCount,
            icon: Vote,
            color: "bg-brand/15 text-brand",
            trend: "Active student ballots",
          },
          {
            label: "Awards to Vote",
            value: awardsToVoteCount,
            icon: Trophy,
            color: "bg-[#F4C430]/15 text-[#F4C430]",
            trend: "Nomination categories",
          },
          {
            label: "Completed Votes",
            value: completedVotesCount,
            icon: CheckCircle2,
            color: "bg-success/15 text-success",
            trend: "Submitted ballots",
          },
          {
            label: "Unread Alerts",
            value: unreadNotificationsCount,
            icon: Bell,
            color: "bg-danger/15 text-danger",
            trend: "Recent notification logs",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold">
                <AnimatedCounter value={s.value} />
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">Elections Participation Turnout</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Percentage of votes cast relative to eligible voters
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dynamicTurnoutData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} unit="%" />
              <Tooltip
                formatter={(val) => [`${val}%`, "Turnout"]}
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="turnout" fill="var(--color-brand)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 shadow-soft">
          <h3 className="font-bold mb-1">My Voting Completion</h3>
          <p className="text-xs text-muted-foreground mb-4">Completed ballots vs pending tasks</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={dynamicBallotStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
              >
                {dynamicBallotStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Campaigns sections */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ACTIVE ELECTIONS & AWARDS (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Active Standard Elections */}
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-foreground">
              <Vote className="w-5 h-5 text-brand" /> Active Student Elections
            </h2>

            {activeElections.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {activeElections.map((e) => {
                  const positions = getPositionsForElection(e.id);
                  const hasVoted = votedElectionIds.includes(e.id);
                  return (
                    <div
                      key={e.id}
                      className="group rounded-2xl bg-card border border-border/80 p-5 shadow-soft hover:shadow-md hover:border-brand/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-extrabold text-base text-foreground leading-tight group-hover:text-brand transition-colors">
                            {e.name}
                          </h3>
                          <StatusBadge status={hasVoted ? "submitted" : e.status} />
                        </div>
                        <p className="text-xs text-muted-foreground font-semibold">
                          {positions.length} portfolios available to choose
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                            <span>Voter Progress</span>
                            <span>{hasVoted ? "100%" : "0% Completed"}</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${hasVoted ? "bg-success" : "bg-brand/40"}`}
                              style={{ width: hasVoted ? "100%" : "0%" }}
                            />
                          </div>
                        </div>

                        <div className="mt-4 border-t border-border/40 pt-3">
                          <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider">
                            Ends in
                          </span>
                          <div className="mt-1 font-semibold">
                            <Countdown target={e.endDate} compact />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        {hasVoted ? (
                          <Button
                            disabled
                            className="w-full bg-muted text-muted-foreground font-bold text-xs h-9 rounded-xl border border-border"
                          >
                            <CheckCircle2 className="mr-1.5 w-4 h-4 text-success" /> Vote Completed
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-brand text-white hover:bg-brand/90 font-bold text-xs h-9 rounded-xl transition-all shadow-sm"
                            onClick={() => navigate(`/voter/elections/${e.id}/vote`)}
                          >
                            Access Ballot Box <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-muted-foreground text-sm font-semibold">
                No active student elections at the moment.
              </div>
            )}
          </section>

          {/* Active Campus Awards */}
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-[#F4C430]" /> Live Campus Awards
            </h2>

            {activeAwards.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {activeAwards.map((e) => {
                  const categories = getPositionsForElection(e.id);
                  const hasVoted = votedElectionIds.includes(e.id);
                  return (
                    <div
                      key={e.id}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064e3b] to-[#022c22] border border-[#F4C430]/20 hover:border-[#F4C430]/60 p-6 text-white shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Background star accents */}
                      <div className="absolute top-2 right-2 text-white/5 pointer-events-none">
                        <Sparkles className="w-24 h-24" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="font-extrabold text-base leading-snug text-[#F4C430]">
                            {e.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              hasVoted
                                ? "bg-success/20 text-green-300 border border-success/30"
                                : "bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]/30"
                            }`}
                          >
                            {hasVoted ? "Voted" : "Awards Live"}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-200/80 font-medium">
                          {categories.length} award categories to vote on
                        </p>

                        {/* Progress Bar (Gold styling) */}
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-emerald-200/70">
                            <span>Voted Categories</span>
                            <span>{hasVoted ? "100%" : "0% Completed"}</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${hasVoted ? "bg-success" : "bg-[#F4C430]"}`}
                              style={{ width: hasVoted ? "100%" : "0%" }}
                            />
                          </div>
                        </div>

                        <div className="mt-4 border-t border-white/5 pt-3">
                          <span className="text-[10px] font-bold text-emerald-200/60 block uppercase tracking-wider">
                            Voting window closes in
                          </span>
                          <div className="mt-1 font-bold text-[#F4C430]">
                            <Countdown target={e.endDate} compact />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 relative z-10">
                        {hasVoted ? (
                          <Button
                            disabled
                            className="w-full bg-white/5 border border-white/10 text-white/50 font-bold text-xs h-9 rounded-xl"
                          >
                            <CheckCircle2 className="mr-1.5 w-4 h-4 text-green-400" /> Ballot
                            Submitted
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-[#F4C430] hover:bg-[#F4C430]/95 text-black font-extrabold text-xs h-9 rounded-xl transition-all shadow-md"
                            onClick={() => navigate(`/voter/awards/${e.id}/vote`)}
                          >
                            Enter Awards Hall{" "}
                            <Trophy className="ml-1.5 w-3.5 h-3.5 fill-black/10" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center text-muted-foreground text-sm font-semibold">
                No active awards programs today.
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: EVENTS & NOTIFICATIONS (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Schedule */}
          <section className="bg-card border border-border rounded-2xl p-5 shadow-soft">
            <h2 className="text-base font-extrabold mb-4 flex items-center gap-2 text-foreground">
              <Calendar className="w-4.5 h-4.5 text-brand" /> Upcoming Events
            </h2>
            <div className="space-y-4">
              {upcoming.length > 0 ? (
                upcoming.map((e) => (
                  <div key={e.id} className="p-3 bg-muted/30 rounded-xl border border-border/60">
                    <h3 className="font-bold text-xs text-foreground truncate">{e.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Starts in:</p>
                    <div className="mt-1 font-bold text-xs">
                      <Countdown target={e.startDate} compact />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground font-medium">
                  No upcoming events listed.
                </div>
              )}
            </div>
          </section>

          {/* Recent Alerts (Last 3) */}
          <section className="bg-card border border-border rounded-2xl p-5 shadow-soft">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-extrabold flex items-center gap-2 text-foreground">
                <Bell className="w-4.5 h-4.5 text-[#F4C430]" /> Recent Alerts
              </h2>
              <Link
                to="/voter/notifications"
                className="text-[10px] font-bold text-brand hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3.5">
              {notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all ${
                    !n.read
                      ? "bg-brand/5 border-brand/10 shadow-sm"
                      : "bg-muted/10 border-border/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <p className="font-bold text-xs text-foreground leading-tight">{n.title}</p>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                    {n.message}
                  </p>
                  <span className="text-[9px] font-semibold text-muted-foreground/60 mt-1.5 block">
                    {n.time}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
