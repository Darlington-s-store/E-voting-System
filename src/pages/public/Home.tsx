import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Zap, Lock, BarChart3, Smartphone, FileSearch, Layers,
  ArrowRight, CheckCircle2, Users, Building2, Globe,
  UserPlus, Vote as VoteIcon, TrendingUp, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

const features = [
  { icon: Lock, title: "Military-grade encryption", desc: "End-to-end AES-256 encryption protects every ballot from creation to count." },
  { icon: BarChart3, title: "Real-time results", desc: "Watch results update live as votes are cast, with rich visualizations." },
  { icon: Smartphone, title: "Mobile voting", desc: "Voters cast ballots from any device — fully responsive and accessible." },
  { icon: Shield, title: "Anti-fraud protection", desc: "Cryptographic receipts and device fingerprinting prevent duplicate votes." },
  { icon: FileSearch, title: "Complete audit trail", desc: "Every action is logged immutably for full transparency and compliance." },
  { icon: Layers, title: "Multi-election support", desc: "Run concurrent elections with isolated voter lists and configurations." },
];

const stats = [
  { value: 500, suffix: "+", label: "Elections Conducted", icon: VoteIcon, color: "text-brand" },
  { value: 50000, suffix: "+", label: "Verified Voters", icon: Users, color: "text-success" },
  { value: 99.9, suffix: "%", label: "Platform Uptime", icon: Zap, color: "text-warning" },
  { value: 100, suffix: "%", label: "Vote Integrity", icon: Shield, color: "text-purple" },
];

const steps = [
  { icon: UserPlus, title: "Register", desc: "Voters verify identity through institutional credentials and 2FA." },
  { icon: VoteIcon, title: "Cast Vote", desc: "Securely cast ballots from any device in under 2 minutes." },
  { icon: TrendingUp, title: "View Results", desc: "Real-time, tamper-proof results published instantly when elections close." },
];

const testimonials = [
  { name: "University of Lagos", quote: "SecureVote Pro transformed our student elections. Turnout doubled and we eliminated all disputes.", role: "Office of Student Affairs", avatar: "UL" },
  { name: "Grace Cathedral", quote: "We held our deaconship election entirely online. Effortless and incredibly secure.", role: "Parish Council", avatar: "GC" },
  { name: "GIMPA Alumni Assoc.", quote: "The audit trail and live results gave members complete confidence in the outcome.", role: "Executive Board", avatar: "GA" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative gradient-navy text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.18) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(46,134,171,.4) 0, transparent 45%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/90 mb-6">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Trusted by 500+ institutions
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Secure. Transparent.<br />
                <span className="bg-gradient-to-r from-brand to-purple bg-clip-text text-transparent">Democratic.</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-xl">
                The trusted digital voting platform for universities, churches, and associations. Run secure, tamper-proof elections in minutes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register"><Button size="lg" className="bg-brand hover:bg-brand/90 text-white">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
                <Link to="/features"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent">Learn More</Button></Link>
              </div>
            </motion.div>
          </div>

          <div className="relative h-[420px] hidden lg:block">
            {[
              { delay: 0, top: "0%", left: "0%", title: "Election Active", value: "Student Union", icon: VoteIcon, color: "bg-success" },
              { delay: 0.2, top: "30%", right: "0%", title: "Votes Cast", value: "1,240", icon: BarChart3, color: "bg-brand" },
              { delay: 0.4, bottom: "0%", left: "10%", title: "Turnout", value: "98%", icon: TrendingUp, color: "bg-purple" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: c.delay, duration: 0.5 }}
                style={{ position: "absolute", top: c.top, left: c.left, right: c.right, bottom: c.bottom }}
                className="glass rounded-xl p-4 shadow-lift min-w-[200px]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center`}>
                    <c.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-navy/70 font-medium">{c.title}</div>
                    <div className="text-lg font-bold text-navy">{c.value}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className={`w-8 h-8 mx-auto mb-3 ${s.color}`} />
              <div className="text-3xl md:text-4xl font-extrabold text-foreground">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold">Everything you need for fair elections</h2>
            <p className="mt-4 text-muted-foreground">A complete toolkit built with security, transparency, and accessibility at its core.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl bg-card border border-border shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 rounded-lg gradient-brand flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold">Three steps to a secure election</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="bg-card rounded-xl p-7 border border-border shadow-soft">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                      <s.icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-muted-foreground/40 font-mono">0{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-6 h-6 text-muted-foreground/50" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold">Trusted by leading institutions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="p-7 rounded-xl bg-card border border-border shadow-soft">
                <Award className="w-6 h-6 text-warning mb-3" />
                <p className="text-foreground/90 leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-brand text-white font-bold flex items-center justify-center text-sm">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl gradient-navy text-white p-10 md:p-14 text-center relative overflow-hidden">
            <Building2 className="absolute -right-6 -bottom-6 w-48 h-48 text-white/5" />
            <Globe className="absolute -left-6 -top-6 w-40 h-40 text-white/5" />
            <h2 className="relative text-3xl md:text-4xl font-extrabold">Ready to modernize your elections?</h2>
            <p className="relative mt-3 text-white/80 max-w-xl mx-auto">Join hundreds of institutions running secure, transparent digital elections.</p>
            <div className="relative mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact"><Button size="lg" className="bg-brand hover:bg-brand/90 text-white">Request Demo <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
              <Link to="/register"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent">Create Account</Button></Link>
            </div>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
              {["Free trial", "No credit card", "Setup in 5 min"].map((t) => (
                <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-success" /> {t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
