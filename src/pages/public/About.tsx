import { ShieldCheck, TrendingUp, Clock, Eye, Sparkles } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, title: "Eliminate fraud", desc: "Cryptographic integrity at every step." },
  { icon: TrendingUp, title: "Increase participation", desc: "Mobile-first design lifts turnout 2-3×." },
  { icon: Clock, title: "Save time", desc: "Set up an election in under 5 minutes." },
  { icon: Eye, title: "Full transparency", desc: "Immutable audit trail for every action." },
];

const timeline = [
  { year: "2022", title: "Platform founded", desc: "Built by election security experts." },
  { year: "2023", title: "First 100 institutions", desc: "Universities across West Africa onboard." },
  { year: "2024", title: "ISO 27001 certified", desc: "International security compliance achieved." },
  { year: "2025", title: "Multi-region rollout", desc: "Now serving institutions in 12 countries." },
  { year: "2026", title: "50,000+ active voters", desc: "Trusted with critical democratic decisions." },
];

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold">About SecureVote Pro</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">Bringing democracy into the digital age</h1>
      </div>

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-navy to-navy/90 text-white p-10 md:p-14 relative overflow-hidden">
        <Sparkles className="absolute right-6 top-6 w-10 h-10 text-white/10" />
        <p className="text-2xl md:text-3xl font-bold leading-snug">
          "Every vote deserves to be heard, counted, and protected. We exist to ensure no institution has to choose between security and accessibility."
        </p>
        <p className="mt-4 text-white/70">— Our mission statement</p>
      </div>

      {/* Alternating */}
      <div className="mt-20 space-y-20">
        {[
          { title: "Built for institutions", desc: "SecureVote Pro was designed from the ground up for universities, churches, and associations that need rigorous election integrity without enterprise complexity. Every workflow is tuned for real institutional needs.", reverse: false },
          { title: "Security at every layer", desc: "From end-to-end ballot encryption to per-action audit logging, our platform is engineered to withstand scrutiny. Independently audited, ISO 27001 certified.", reverse: true },
          { title: "Accessible to everyone", desc: "WCAG 2.1 AA compliant, multilingual, and built mobile-first. Voters cast ballots from anywhere, on any device.", reverse: false },
        ].map((s) => (
          <div key={s.title} className={`grid md:grid-cols-2 gap-10 items-center ${s.reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="aspect-video rounded-xl bg-gradient-to-br from-brand/20 to-purple/20 border border-border flex items-center justify-center">
              <ShieldCheck className="w-20 h-20 text-brand/40" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{s.title}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center">Why institutions choose us</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => (
            <div key={b.title} className="p-6 rounded-xl bg-card border border-border shadow-soft">
              <b.icon className="w-8 h-8 text-brand mb-3" />
              <h3 className="font-bold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center">Our journey</h2>
        <div className="mt-10 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
          {timeline.map((t, i) => (
            <div key={t.year} className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-8 mb-10 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className={`md:text-right ${i % 2 ? "md:text-left" : ""}`}>
                <div className="font-mono text-sm text-brand font-bold">{t.year}</div>
                <h3 className="text-lg font-bold">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </div>
              <div className="hidden md:block" />
              <div className="absolute left-4 md:left-1/2 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-brand ring-4 ring-background" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
