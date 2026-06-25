import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Vote,
  User,
  Shield,
  CheckCircle2,
  Clock,
  Trophy,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import {
  getElection,
  getPositionsForElection,
  type Election,
  type Position,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/shared/Countdown";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function ElectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState<Election | null>(null);
  const [positionsList, setPositionsList] = useState<Position[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (id) {
      const e = getElection(id);
      if (e) {
        setElection(e);
        setPositionsList(getPositionsForElection(id));

        // Check if user has voted in this election
        const voted = localStorage.getItem("votesecure_voted_elections");
        if (voted) {
          const list = JSON.parse(voted) as string[];
          setHasVoted(list.includes(id));
        }
      } else {
        navigate("/voter/dashboard");
      }
    }
  }, [id, navigate]);

  if (!election) return null;

  const isAwards = election.type === "Campus Awards";
  const isOpen = election.status === "open";
  const isScheduled = election.status === "scheduled";

  // Format Date for humans
  const formatDateString = (isoString: string) => {
    try {
      return format(new Date(isoString), "PPP p");
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Back Button */}
      <Link
        to="/voter/elections"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Elections
      </Link>

      {/* Detail Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 md:p-8 border shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
          isAwards
            ? "bg-gradient-to-br from-[#1A0533] to-[#1E3A5F] text-white border-[#F4C430]/20"
            : "bg-card border-border text-card-foreground"
        }`}
      >
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isAwards
                  ? "bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]/30"
                  : "bg-brand/10 text-brand border border-brand/20"
              }`}
            >
              {election.type}
            </span>
            <StatusBadge status={hasVoted ? "submitted" : election.status} />
          </div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isAwards ? "text-[#F4C430]" : "text-foreground"}`}
          >
            {election.name}
          </h1>
          <p
            className={`text-sm max-w-xl leading-relaxed ${isAwards ? "text-purple-200/80" : "text-muted-foreground"}`}
          >
            {election.description}
          </p>
        </div>

        {/* Dynamic Voting Button block */}
        <div className="relative z-10 shrink-0 self-stretch md:self-auto flex flex-col justify-center">
          {hasVoted ? (
            <div className="p-4 rounded-xl bg-success/10 border border-success/35 text-center flex flex-col items-center gap-1">
              <CheckCircle2 className="w-8 h-8 text-success" />
              <span className="text-xs font-extrabold text-success uppercase tracking-wider mt-1">
                Vote Recorded
              </span>
              <p className="text-[10px] text-muted-foreground max-w-[150px] leading-tight mt-0.5">
                Your digital receipt has been signed and logged in history.
              </p>
            </div>
          ) : isOpen ? (
            <Button
              className={`w-full md:w-auto font-extrabold text-sm px-6 h-11 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 ${
                isAwards
                  ? "bg-[#F4C430] hover:bg-[#F4C430]/95 text-black"
                  : "bg-brand text-white hover:bg-brand/90"
              }`}
              onClick={() => {
                if (isAwards) {
                  navigate(`/voter/awards/${election.id}/vote`);
                } else {
                  navigate(`/voter/elections/${election.id}/vote`);
                }
              }}
            >
              {isAwards ? "Enter Awards Hall" : "Access Ballot Box"}{" "}
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          ) : isScheduled ? (
            <div className="p-4 rounded-xl bg-muted/40 border border-border text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Starts in
              </span>
              <div className="mt-1.5 font-bold text-sm">
                <Countdown target={election.startDate} compact />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-muted/20 border border-border text-center text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Ballots Closed
            </div>
          )}
        </div>
      </div>

      {/* Election Specs / Info Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[
          {
            label: "Start Date & Time",
            value: formatDateString(election.startDate),
            icon: Calendar,
          },
          { label: "End Date & Time", value: formatDateString(election.endDate), icon: Clock },
          { label: "Available Positions", value: `${positionsList.length} Categories`, icon: Vote },
        ].map((spec, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border bg-card shadow-soft flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5 border border-border/30">
              <spec.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                {spec.label}
              </span>
              <span className="text-xs font-bold text-foreground mt-1.5 leading-snug block">
                {spec.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rules / Eligibility Alert */}
      <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 flex gap-3.5 items-start">
        <Shield className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm text-foreground">Secure Voting Regulations</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This election uses end-to-end cryptographic voter verification. You must authenticate
            with your Student ID and complete the safety checklist before accessing the ballot box.
            Each transaction is signed anonymously.
          </p>
        </div>
      </div>

      {/* Portfolios / Positions Checklist */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          {isAwards ? (
            <Trophy className="w-5 h-5 text-[#F4C430]" />
          ) : (
            <Vote className="w-5 h-5 text-brand" />
          )}
          {isAwards ? "Award Categories Preset Checklist" : "Student Positions & Details"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {positionsList.map((pos) => (
            <div
              key={pos.id}
              className="p-5 rounded-xl border border-border bg-card shadow-soft space-y-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-foreground truncate">{pos.name}</h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/30 font-mono">
                    {pos.code}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-normal line-clamp-2">
                  {pos.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/40 flex justify-between items-center text-[10px] font-semibold text-muted-foreground">
                <span>
                  Method: <strong className="text-foreground">{pos.votingMethod}</strong>
                </span>
                <span>
                  Winners: <strong className="text-foreground">{pos.winners}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
