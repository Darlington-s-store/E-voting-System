import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Search, ArrowRight } from "lucide-react";
import { elections, getPositionsForElection } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VoterElections() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "open" | "scheduled" | "closed">("all");
  const filtered = elections.filter(
    (e) =>
      (tab === "all" || e.status === tab) &&
      e.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Elections</h1>
        <p className="text-muted-foreground">Browse all elections you're eligible for</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search elections..." className="pl-9" />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((e) => {
          const positions = getPositionsForElection(e.id);
          const voted = e.status === "closed" ? positions.length : 0;
          return (
            <div key={e.id} className="rounded-xl bg-card border border-border p-6 shadow-soft flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold">{e.name}</h3>
                <StatusBadge status={e.status} />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground self-start mb-3">{e.type}</span>
              <p className="text-xs text-muted-foreground">{format(new Date(e.startDate), "MMM d")} – {format(new Date(e.endDate), "MMM d, yyyy")}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{voted}/{positions.length}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-brand" style={{ width: `${(voted / positions.length) * 100}%` }} />
                </div>
              </div>
              <div className="mt-5">
                {e.status === "open" && (
                  <Link to={`/voter/elections/${e.id}/vote`}>
                    <Button className="w-full bg-success text-white hover:bg-success/90">Vote Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
                  </Link>
                )}
                {e.status === "closed" && <Button disabled variant="outline" className="w-full">Completed</Button>}
                {e.status === "scheduled" && <Button disabled variant="outline" className="w-full">Not yet open</Button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
