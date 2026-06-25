import {
  Lock,
  BarChart3,
  Smartphone,
  ShieldCheck,
  FileSearch,
  Layers,
  Check,
  X,
} from "lucide-react";

const deepDives = [
  {
    icon: Lock,
    title: "Military-grade encryption",
    desc: "AES-256 end-to-end protection. Ballots are encrypted on-device and decrypted only during tallying.",
    points: [
      "Zero-knowledge architecture",
      "Encrypted at rest and in transit",
      "Independently audited cryptography",
    ],
  },
  {
    icon: BarChart3,
    title: "Real-time results",
    desc: "Watch votes accumulate in beautifully visualized live dashboards. Auto-refreshes every 10 seconds.",
    points: [
      "Live bar and pie charts",
      "Per-position breakdowns",
      "Turnout tracking by demographic",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile voting",
    desc: "Native-quality experience on any smartphone, tablet, or desktop. No app installs required.",
    points: [
      "Mobile-first responsive design",
      "Works on 2G connections",
      "Voice and screen-reader friendly",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Anti-fraud protection",
    desc: "Multi-factor verification, device fingerprinting, and one-person-one-vote enforcement.",
    points: ["2FA via TOTP", "Device & IP analytics", "Duplicate-vote detection"],
  },
  {
    icon: FileSearch,
    title: "Complete audit trail",
    desc: "Every login, vote, and admin action is recorded immutably with full context.",
    points: ["Tamper-evident logs", "Per-user activity timeline", "Exportable compliance reports"],
  },
  {
    icon: Layers,
    title: "Multi-election support",
    desc: "Run multiple elections in parallel with isolated voter lists, candidates, and schedules.",
    points: [
      "Unlimited concurrent elections",
      "Per-election permissions",
      "Cross-election analytics",
    ],
  },
];

const compare = [
  ["Setup time", "Weeks", "5 minutes"],
  ["Cost per election", "$$$$ (printing, staff, venue)", "Predictable subscription"],
  ["Result speed", "Hours to days", "Instant"],
  ["Voter accessibility", "In-person only", "Any device, anywhere"],
  ["Audit trail", "Manual, error-prone", "Cryptographically verified"],
  ["Fraud risk", "High", "Negligible"],
  ["Turnout", "Typically 20-40%", "70-95%"],
];

export default function Features() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold">Built for trust at every step</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Every feature exists to make your elections more secure, transparent, and accessible.
        </p>
      </div>

      <div className="mt-16 space-y-16">
        {deepDives.map((d, i) => (
          <div
            key={d.title}
            className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div>
              <div className="w-12 h-12 rounded-lg gradient-brand flex items-center justify-center mb-4">
                <d.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">{d.title}</h2>
              <p className="mt-3 text-muted-foreground">{d.desc}</p>
              <ul className="mt-5 space-y-2">
                {d.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-muted to-card border border-border shadow-soft p-6 aspect-[4/3] flex flex-col">
              <div className="flex gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning" />
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
              </div>
              <div className="flex-1 rounded-md bg-card border border-border p-4 space-y-2">
                <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
                <div className="h-3 w-1/2 rounded bg-muted-foreground/20" />
                <div className="mt-4 space-y-2">
                  {[80, 60, 40].map((w) => (
                    <div key={w} className="space-y-1">
                      <div className="h-2 w-20 rounded bg-muted-foreground/20" />
                      <div className="h-3 rounded gradient-brand" style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center">Traditional vs E-voting system</h2>
        <div className="mt-8 overflow-hidden rounded-xl border border-border shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Aspect</th>
                <th className="text-left p-4 font-semibold text-danger">Traditional voting</th>
                <th className="text-left p-4 font-semibold text-success">E-voting system</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((row) => (
                <tr key={row[0]} className="border-t border-border">
                  <td className="p-4 font-medium">{row[0]}</td>
                  <td className="p-4 text-muted-foreground">
                    <X className="inline w-4 h-4 text-danger mr-1" />
                    {row[1]}
                  </td>
                  <td className="p-4">
                    <Check className="inline w-4 h-4 text-success mr-1" />
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
