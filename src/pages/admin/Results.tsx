import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Trophy,
  Download,
  FileText,
  RefreshCw,
  Crown,
  Sparkles,
  Users,
  Play,
  Pause,
  List,
  BarChart2,
  CheckCircle2,
  ShieldAlert,
  Send,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  Award,
} from "lucide-react";
import {
  getElection,
  getPositionsForElection,
  getCandidatesForPosition,
  elections,
  saveElections,
  candidates,
  saveCandidates,
  partylists,
  type Candidate,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { toast } from "sonner";

const colors = [
  "var(--color-brand)",
  "var(--color-success)",
  "var(--color-purple)",
  "var(--color-warning)",
  "var(--color-destructive)",
];

export default function Results() {
  const { id = "e1" } = useParams();
  const election = getElection(id);
  const positions = useMemo(
    () => (election ? getPositionsForElection(election.id) : []),
    [election],
  );

  // States
  const [simulating, setSimulating] = useState(false);
  const [votesCast, setVotesCast] = useState(election?.votesCast ?? 0);
  const [activeTab, setActiveTab] = useState("all");
  const [viewModes, setViewModes] = useState<Record<string, "chart" | "list">>({});

  // Initialize candidates list for simulation
  const [localCandidates, setLocalCandidates] = useState<Record<string, Candidate[]>>(() => {
    const map: Record<string, Candidate[]> = {};
    if (election) {
      positions.forEach((p) => {
        map[p.id] = getCandidatesForPosition(election.id, p.id);
      });
    }
    return map;
  });

  // Calculate overall stats
  const totalEligible = election?.totalEligible ?? 0;
  const turnoutPercent = totalEligible > 0 ? Math.round((votesCast / totalEligible) * 100) : 0;

  // Auto-refresh and live updates interval
  useEffect(() => {
    if (!election || election.status !== "open") return;

    const intervalDuration = simulating ? 3000 : 10000;
    const interval = setInterval(() => {
      // Simulation adds a larger burst, regular live view simulates small trickles
      const count = simulating ? Math.floor(Math.random() * 12) + 4 : Math.floor(Math.random() * 2);

      if (count === 0) return;

      positions.forEach((p) => {
        setLocalCandidates((prev) => {
          const list = prev[p.id] || [];
          if (list.length === 0) return prev;
          const updated = [...list];
          const randomIdx = Math.floor(Math.random() * list.length);
          updated[randomIdx] = {
            ...updated[randomIdx],
            votes: updated[randomIdx].votes + count,
          };

          // Sync to global mock array
          const candIndex = candidates.findIndex((c) => c.id === updated[randomIdx].id);
          if (candIndex !== -1) {
            candidates[candIndex].votes += count;
          }
          return { ...prev, [p.id]: updated };
        });
      });

      setVotesCast((v) => {
        const newVotes = v + count * positions.length;
        const electionIdx = elections.findIndex((e) => e.id === election.id);
        if (electionIdx !== -1) {
          elections[electionIdx].votesCast = newVotes;
          saveElections();
        }
        saveCandidates();
        return newVotes;
      });

      if (simulating) {
        toast.info("Live Update: New votes received!");
      }
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [election, simulating, positions]);

  // Handle early return check after all hooks
  if (!election) {
    return (
      <div className="text-center py-20 bg-card rounded-xl border border-border">
        <h2 className="text-xl font-bold">Election not found</h2>
        <p className="text-muted-foreground mt-2">
          The requested election results could not be found.
        </p>
      </div>
    );
  }

  // Voter Route Guard
  const isVoter = window.location.pathname.startsWith("/voter");

  if (isVoter && election.status !== "archived") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-card rounded-2xl border border-border max-w-2xl mx-auto my-10 space-y-6 shadow-soft">
        <div className="p-4 rounded-full bg-warning/10 text-warning animate-bounce">
          <ShieldAlert className="w-16 h-16" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Results are Confidential
        </h2>
        <p className="text-muted-foreground text-md max-w-md">
          Live election results are hidden for voters to ensure neutrality and prevent bandwagon
          effects. Official certified results will be published here once the election has closed
          and been audited by administrators.
        </p>
        <div className="text-xs text-muted-foreground bg-muted px-4 py-2 rounded-lg border">
          Current Election Status:{" "}
          <span className="font-bold uppercase text-warning">{election.status}</span>
        </div>
      </div>
    );
  }

  // Handle Mock refresh (Only for admins)
  const handleRefresh = () => {
    if (election.status === "open") {
      const burst = Math.floor(Math.random() * 45) + 10;
      positions.forEach((p) => {
        setLocalCandidates((prev) => {
          const list = prev[p.id] || [];
          if (list.length === 0) return prev;
          const updated = [...list];
          const randomIdx = Math.floor(Math.random() * list.length);
          updated[randomIdx] = { ...updated[randomIdx], votes: updated[randomIdx].votes + burst };

          const candIndex = candidates.findIndex((c) => c.id === updated[randomIdx].id);
          if (candIndex !== -1) {
            candidates[candIndex].votes += burst;
          }
          return { ...prev, [p.id]: updated };
        });
      });
      setVotesCast((v) => {
        const newVotes = v + burst * positions.length;
        const electionIdx = elections.findIndex((e) => e.id === election.id);
        if (electionIdx !== -1) {
          elections[electionIdx].votesCast = newVotes;
          saveElections();
        }
        saveCandidates();
        return newVotes;
      });
      toast.success("Results refreshed and updated!");
    } else {
      toast.success("Results loaded and up to date");
    }
  };

  // Export handlers
  const exportToCSV = () => {
    let csvContent = "";
    csvContent += `"Election Name","${election.name.replace(/"/g, '""')}"\n`;
    csvContent += `"Status","${election.status.toUpperCase()}"\n`;
    csvContent += `"Total Registered Voters","${totalEligible}"\n`;
    csvContent += `"Total Ballots Cast","${votesCast}"\n`;
    csvContent += `"Turnout Rate","${turnoutPercent}%"\n\n`;

    csvContent += `"Position","Candidate","Party","Votes","Percentage"\n`;

    positions.forEach((p) => {
      const cands = localCandidates[p.id] || [];
      const totalPosVotes = cands.reduce((sum, c) => sum + c.votes, 0);
      cands.forEach((c) => {
        const pct = totalPosVotes > 0 ? Math.round((c.votes / totalPosVotes) * 100) : 0;
        const party = partylists.find((pl) => pl.id === c.partylistId)?.name || "Independent";
        csvContent += `"${p.name.replace(/"/g, '""')}","${c.name.replace(/"/g, '""')}","${party.replace(/"/g, '""')}","${c.votes}","${pct}%"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${election.name.replace(/\s+/g, "_")}_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report downloaded!");
  };

  const exportToExcel = () => {
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    html += `<head><meta charset="utf-8"/><style>
      body { font-family: sans-serif; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #1E3A5F; color: white; }
      .header-row { background-color: #f2f2f2; font-weight: bold; }
    </style></head><body>`;

    html += `<h2>${election.name} — Final Results</h2>`;
    html += `<p><b>Status:</b> ${election.status.toUpperCase()}</p>`;
    html += `<p><b>Total Registered Voters:</b> ${totalEligible.toLocaleString()}</p>`;
    html += `<p><b>Total Ballots Cast:</b> ${votesCast.toLocaleString()} (${turnoutPercent}%)</p>`;
    html += `<br/>`;

    html += `<table>`;
    html += `<thead>`;
    html += `<tr>`;
    html += `<th>Position</th>`;
    html += `<th>Candidate Name</th>`;
    html += `<th>Party List</th>`;
    html += `<th>Votes Received</th>`;
    html += `<th>Percentage</th>`;
    html += `<th>Result Status</th>`;
    html += `</tr>`;
    html += `</thead>`;
    html += `<tbody>`;

    positions.forEach((p) => {
      const cands = localCandidates[p.id] || [];
      const totalPosVotes = cands.reduce((sum, c) => sum + c.votes, 0);
      const sorted = [...cands].sort((a, b) => b.votes - a.votes);

      sorted.forEach((c, i) => {
        const pct = totalPosVotes > 0 ? Math.round((c.votes / totalPosVotes) * 100) : 0;
        const party = partylists.find((pl) => pl.id === c.partylistId)?.name || "Independent";
        const status =
          i === 0
            ? election.status === "closed" || election.status === "archived"
              ? "Winner"
              : "Leading"
            : "Contending";

        html += `<tr>`;
        html += `<td>${p.name}</td>`;
        html += `<td>${c.name}</td>`;
        html += `<td>${party}</td>`;
        html += `<td>${c.votes}</td>`;
        html += `<td>${pct}%</td>`;
        html += `<td>${status}</td>`;
        html += `</tr>`;
      });
    });

    html += `</tbody></table></body></html>`;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${election.name.replace(/\s+/g, "_")}_results.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel (.xls) report downloaded!");
  };

  const handlePublishResults = () => {
    const electionIdx = elections.findIndex((e) => e.id === election.id);
    if (electionIdx !== -1) {
      elections[electionIdx].status = "archived";
      saveElections();
      toast.success("Election results successfully published to voter panels!");
      // Force page update
      window.location.reload();
    }
  };

  const generateCertificate = (
    positionName: string,
    winnerName: string,
    votes: number,
    percentage: number,
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#FFFDF9";
    ctx.fillRect(0, 0, 800, 600);

    // Outer Border (Dark Blue)
    ctx.strokeStyle = "#1E3A5F";
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, 760, 560);

    // Inner Border (Gold)
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, 730, 530);

    // Header Title
    ctx.font = "italic bold 28px Georgia, serif";
    ctx.fillStyle = "#1E3A5F";
    ctx.textAlign = "center";
    ctx.fillText("SecureVote Pro Certification", 400, 90);

    // Gold Seal / Trophy Decoration
    ctx.beginPath();
    ctx.arc(400, 160, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "#D4AF37";
    ctx.fill();
    ctx.strokeStyle = "#B8860B";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.fillText("🏆", 400, 170);

    // Certificate text
    ctx.font = "36px Georgia, serif";
    ctx.fillStyle = "#111827";
    ctx.fillText("CERTIFICATE OF ELECTION", 400, 240);

    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("This official certificate is proudly presented to", 400, 280);

    // Winner Name
    ctx.font = "bold 32px Georgia, serif";
    ctx.fillStyle = "#1E3A5F";
    ctx.fillText(winnerName, 400, 330);

    // Divider line
    ctx.beginPath();
    ctx.moveTo(250, 350);
    ctx.lineTo(550, 350);
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Position and Election Info
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#374151";
    ctx.fillText(`declaring them the winner of the contested position of`, 400, 380);

    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "#111827";
    ctx.fillText(positionName.toUpperCase(), 400, 415);

    ctx.font = "italic 16px sans-serif";
    ctx.fillStyle = "#4B5563";
    ctx.fillText(`held during the ${election.name}`, 400, 450);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText(
      `with a total mandate of ${votes.toLocaleString()} votes (${percentage}% of total cast)`,
      400,
      480,
    );

    // Signatures
    ctx.beginPath();
    ctx.moveTo(150, 530);
    ctx.lineTo(320, 530);
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = "italic 12px sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("Election Commissioner", 235, 545);
    ctx.font = "italic 14px Georgia, serif";
    ctx.fillStyle = "#1E3A5F";
    ctx.fillText("SecureVote Auditor", 235, 522);

    ctx.beginPath();
    ctx.moveTo(480, 530);
    ctx.lineTo(650, 530);
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("Date of Final Audit", 565, 545);

    const auditDate = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#111827";
    ctx.fillText(auditDate, 565, 522);

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Certificate_${winnerName.replace(/\s+/g, "_")}_${positionName.replace(/\s+/g, "_")}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Generated and downloaded certificate for ${winnerName}!`);
  };

  const filteredPositions =
    activeTab === "all" ? positions : positions.filter((p) => p.id === activeTab);

  return (
    <div className="space-y-6">
      {/* CSS Styles for Print layout */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-family: Arial, sans-serif !important;
          }
          header, footer, nav, aside, .no-print, button, .btn,
          .tabs, [role="tablist"], .alert, .banner, .actions-row,
          .lucide-play, .lucide-pause, .lucide-refresh-cw {
            display: none !important;
          }
          main, .main-content, .container, .space-y-6 {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
          .bg-card {
            background: white !important;
            border: 1px solid #ddd !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin-bottom: 20px !important;
          }
          h1 {
            font-size: 24pt !important;
            margin-bottom: 10px !important;
          }
          h2 {
            font-size: 18pt !important;
            margin-bottom: 5px !important;
          }
          .text-3xl {
            font-size: 20pt !important;
          }
          .bg-muted {
            background-color: #eee !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .bg-brand {
            background-color: #1E3A5F !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `,
        }}
      />

      {/* Sealed Ledger Security Alert */}
      {(election.status === "closed" || election.status === "archived") && (
        <div className="bg-success/10 border border-success/30 text-success p-4 rounded-xl flex items-start gap-3 shadow-soft alert">
          <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Sealed & Cryptographically Locked</h3>
            <p className="text-xs text-success/80 mt-0.5">
              These election results have been audited, signed, and written to the secure ledger.
              Further votes cannot be cast and the existing vote counts are permanently locked
              against alterations.
            </p>
          </div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {election.name} — {isVoter ? "Official Results" : "Live Results"}
            </h1>
            <StatusBadge status={election.status} />
            {election.status === "open" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> LIVE UPDATES
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Electoral analytics, turnout metrics, and winner projections.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 no-print">
          {!isVoter && election.status === "open" && (
            <Button
              onClick={() => {
                setSimulating(!simulating);
                toast(
                  simulating
                    ? "Simulation paused"
                    : "Simulation started! Watching votes come in...",
                );
              }}
              variant={simulating ? "destructive" : "outline"}
              className="h-10 px-4"
            >
              {simulating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Pause Live Sim
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 text-success" /> Start Live Sim
                </>
              )}
            </Button>
          )}
          {!isVoter && (
            <Button variant="outline" onClick={handleRefresh} className="h-10">
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          )}
          {election.status === "closed" && !isVoter && (
            <Button
              onClick={handlePublishResults}
              className="h-10 bg-success text-success-foreground hover:bg-success/90 font-bold"
            >
              <Send className="w-4 h-4 mr-2" /> Publish Results
            </Button>
          )}
          <Button variant="outline" onClick={() => window.print()} className="h-10">
            <Printer className="w-4 h-4 mr-2" /> Print / PDF
          </Button>
          <Button variant="outline" onClick={exportToExcel} className="h-10">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-success" /> Export Excel
          </Button>
          <Button onClick={exportToCSV} className="h-10 bg-brand text-white hover:bg-brand/90">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Voter Turnout */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Voter Turnout</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold">{turnoutPercent}%</div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-brand transition-all duration-500"
                style={{ width: `${Math.min(100, turnoutPercent)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Target turnout: 85% based on previous elections
          </p>
        </div>

        {/* Card 2: Total Ballots Cast */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Total Ballots Cast</span>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold">{votesCast.toLocaleString()}</div>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              out of {totalEligible.toLocaleString()}
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Remaining eligible: {(totalEligible - votesCast).toLocaleString()}
          </p>
        </div>

        {/* Card 3: Voter Abstentions */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Abstention Rate</span>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold">
              {totalEligible > 0
                ? Math.round(((totalEligible - votesCast) / totalEligible) * 100)
                : 0}
              %
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {(totalEligible - votesCast).toLocaleString()} abstained
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Registered voters who did not cast ballots
          </p>
        </div>

        {/* Card 4: Contested Positions */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Active Positions</span>
            <Trophy className="w-4 h-4 text-warning" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold">{positions.length}</div>
            <p className="text-sm font-medium text-muted-foreground mt-1">Contested portfolios</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Total active candidates: {Object.values(localCandidates).flat().length}
          </p>
        </div>
      </div>

      {/* Position Filter Tabs */}
      <div className="border-b border-border flex items-center overflow-x-auto gap-2 pb-px scrollbar-none no-print">
        <button
          onClick={() => setActiveTab("all")}
          className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition shrink-0 ${
            activeTab === "all"
              ? "border-brand text-brand"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          All Positions ({positions.length})
        </button>
        {positions.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={`py-2.5 px-4 text-sm font-semibold border-b-2 transition shrink-0 ${
              activeTab === p.id
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Detailed Position Results Cards */}
      <div className="space-y-6">
        {filteredPositions.map((p) => {
          const cands = localCandidates[p.id] || [];
          const totalVotes = cands.reduce((sum, c) => sum + c.votes, 0);
          const sorted = [...cands].sort((a, b) => b.votes - a.votes);
          const winner = sorted[0];
          const runnerUp = sorted[1];
          const margin = winner && runnerUp ? winner.votes - runnerUp.votes : 0;
          const viewMode = viewModes[p.id] ?? "chart";

          return (
            <div
              key={p.id}
              className="rounded-xl bg-card border border-border p-6 shadow-soft space-y-5"
            >
              {/* Card Header & Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">{p.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {totalVotes.toLocaleString()} votes cast for this position
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto no-print">
                  <Button
                    size="sm"
                    variant={viewMode === "chart" ? "secondary" : "ghost"}
                    onClick={() => setViewModes((prev) => ({ ...prev, [p.id]: "chart" }))}
                    className="h-8 px-2.5"
                  >
                    <BarChart2 className="w-4 h-4 mr-1.5" /> Chart
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    onClick={() => setViewModes((prev) => ({ ...prev, [p.id]: "list" }))}
                    className="h-8 px-2.5"
                  >
                    <List className="w-4 h-4 mr-1.5" /> Table
                  </Button>
                </div>
              </div>

              {/* Leader Spotlight / Projected Winner banner */}
              {winner && (
                <div
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    election.status === "closed" || election.status === "archived"
                      ? "bg-gradient-to-r from-warning/10 to-success/15 border-warning/30"
                      : "bg-brand/5 border-brand/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={winner.photo}
                        className="w-14 h-14 rounded-full object-cover"
                        alt=""
                      />
                      <div className="absolute -top-1.5 -right-1.5 bg-card rounded-full p-1 border shadow-sm">
                        {election.status === "closed" || election.status === "archived" ? (
                          <Trophy className="w-4 h-4 text-warning" />
                        ) : (
                          <Crown className="w-4 h-4 text-brand" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {election.status === "closed" || election.status === "archived"
                            ? "Winner Elect"
                            : "Current Frontrunner"}
                        </span>
                        {simulating && (
                          <span
                            className="w-2 h-2 rounded-full bg-brand animate-ping"
                            title="Auto-updating"
                          />
                        )}
                      </div>
                      <div className="text-lg font-extrabold mt-0.5">{winner.name}</div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {winner.votes.toLocaleString()} votes (
                        {totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 100) : 0}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-semibold text-muted-foreground">
                        Margin of Lead
                      </div>
                      <div className="text-md font-bold mt-0.5">
                        +{margin.toLocaleString()} votes
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">
                        {runnerUp ? `Ahead of ${runnerUp.name.split(" ")[0]}` : "Unopposed"}
                      </span>
                    </div>

                    {(election.status === "closed" || election.status === "archived") &&
                      !isVoter && (
                        <Button
                          size="sm"
                          onClick={() =>
                            generateCertificate(
                              p.name,
                              winner.name,
                              winner.votes,
                              totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 100) : 0,
                            )
                          }
                          className="bg-warning text-warning-foreground hover:bg-warning/90 font-bold gap-1 self-start sm:self-auto no-print"
                        >
                          <Award className="w-4 h-4" /> Certify Winner
                        </Button>
                      )}
                  </div>
                </div>
              )}

              {/* Chart or Table/List content */}
              {viewMode === "chart" ? (
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          width={110}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--color-card)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                          {sorted.map((_, i) => (
                            <Cell key={i} fill={colors[i % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3.5">
                    {sorted.map((c, i) => {
                      const cpct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
                      return (
                        <div key={c.id} className="flex items-center gap-3">
                          <span className="text-xs font-extrabold w-5 text-muted-foreground text-center">
                            #{i + 1}
                          </span>
                          <img
                            src={c.photo}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline text-sm">
                              <span className="font-semibold text-foreground truncate flex items-center gap-1.5">
                                {c.name}
                                {i === 0 &&
                                  (election.status === "closed" ||
                                    election.status === "archived") && (
                                    <Trophy className="w-3.5 h-3.5 text-warning shrink-0" />
                                  )}
                              </span>
                              <span className="font-mono text-xs font-bold text-muted-foreground">
                                {c.votes.toLocaleString()} votes ({cpct}%)
                              </span>
                            </div>
                            <div className="h-2 mt-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${cpct}%`, background: colors[i % colors.length] }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Beautiful Detailed Table view */
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-3 text-center w-14">Rank</th>
                        <th className="p-3 text-left">Candidate</th>
                        <th className="p-3 text-right">Votes</th>
                        <th className="p-3 text-right">Percentage</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sorted.map((c, i) => {
                        const cpct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
                        return (
                          <tr key={c.id} className="hover:bg-muted/20">
                            <td className="p-3 text-center font-bold text-muted-foreground">
                              #{i + 1}
                            </td>
                            <td className="p-3 flex items-center gap-3 font-medium text-foreground">
                              <img
                                src={c.photo}
                                className="w-7 h-7 rounded-full object-cover"
                                alt=""
                              />
                              <span className="flex items-center gap-1.5">
                                {c.name}
                                {i === 0 &&
                                  (election.status === "closed" ||
                                    election.status === "archived") && (
                                    <Trophy className="w-3.5 h-3.5 text-warning shrink-0" />
                                  )}
                              </span>
                            </td>
                            <td className="p-3 text-right font-mono font-semibold">
                              {c.votes.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono font-semibold">{cpct}%</td>
                            <td className="p-3 text-right">
                              {i === 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                                  {election.status === "closed" ||
                                  election.status === "archived" ? (
                                    <>
                                      <Trophy className="w-3.5 h-3.5 text-warning" /> Winner
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="w-3.5 h-3.5 text-warning" /> Leading
                                    </>
                                  )}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground font-medium">
                                  Contending
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
