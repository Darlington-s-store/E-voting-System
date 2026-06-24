import { useState } from "react";
import { Search, HelpCircle, Mail, UserPlus, Vote, ShieldCheck, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = {
  General: [
    { q: "What is SecureVote Pro?", a: "A secure digital voting platform for institutions of any size." },
    { q: "Who can use it?", a: "Universities, schools, churches, associations, and any organization that runs elections." },
    { q: "How much does it cost?", a: "We offer flexible pricing based on voter count. Contact sales for a quote." },
  ],
  "Voting Process": [
    { q: "How do I vote?", a: "Log in with your credentials, select the active election, and follow the on-screen steps." },
    { q: "Can I change my vote?", a: "No. Once submitted, votes are sealed and cannot be changed for integrity." },
    { q: "Will I get a receipt?", a: "Yes. Every voter receives a cryptographic receipt to verify their vote was counted." },
  ],
  Security: [
    { q: "Is my vote anonymous?", a: "Yes. We separate voter identity from ballot content using zero-knowledge proofs." },
    { q: "How is the platform secured?", a: "End-to-end encryption, 2FA, ISO 27001 certification, and routine independent audits." },
  ],
  Technical: [
    { q: "What browsers are supported?", a: "All modern browsers including Chrome, Safari, Firefox, and Edge." },
    { q: "Can I vote on mobile?", a: "Yes. The platform is fully responsive on any device." },
  ],
};

const steps = [
  { icon: UserPlus, title: "Register", desc: "Create your account using your institutional email and student/staff ID." },
  { icon: ShieldCheck, title: "Verify identity", desc: "Confirm your email and enable two-factor authentication." },
  { icon: Vote, title: "Cast your ballot", desc: "Select candidates for each position and review before submitting." },
  { icon: BarChart3, title: "View results", desc: "Once the election closes, results are published in real time." },
];

export default function Help() {
  const [query, setQuery] = useState("");
  const filter = (q: string) => q.toLowerCase().includes(query.toLowerCase());
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold">How can we help?</h1>
        <p className="mt-3 text-muted-foreground">Find answers, learn the platform, and get support.</p>
      </div>

      <div className="mt-8 max-w-xl mx-auto relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." className="pl-12 h-12 shadow-soft" />
      </div>

      <div className="mt-12 space-y-6">
        {Object.entries(faqs).map(([cat, items]) => {
          const visible = items.filter((i) => filter(i.q) || filter(i.a));
          if (visible.length === 0) return null;
          return (
            <div key={cat} className="p-6 rounded-xl bg-card border border-border shadow-soft">
              <h2 className="text-lg font-bold mb-2">{cat}</h2>
              <Accordion type="single" collapsible>
                {visible.map((it, i) => (
                  <AccordionItem key={i} value={`${cat}-${i}`}>
                    <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        })}
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold text-center">Step-by-step voting guide</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="p-6 rounded-xl bg-card border border-border shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center font-bold">{i + 1}</div>
                <s.icon className="w-5 h-5 text-brand" />
              </div>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 p-8 rounded-xl gradient-navy text-white text-center">
        <HelpCircle className="w-10 h-10 mx-auto mb-3 text-brand" />
        <h2 className="text-2xl font-bold">Still need help?</h2>
        <p className="mt-2 text-white/80">Our support team responds within 24 hours.</p>
        <Button className="mt-5 bg-brand text-white hover:bg-brand/90">
          <Mail className="w-4 h-4 mr-2" /> support@securevote.pro
        </Button>
      </div>
    </div>
  );
}
