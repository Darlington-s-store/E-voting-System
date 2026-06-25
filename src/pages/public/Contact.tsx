import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll be in touch within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 900);
  };
  const info = [
    { icon: Mail, title: "Email", value: "support@evoting.system" },
    { icon: Phone, title: "Phone", value: "+233 (0) 20 000 0000" },
    { icon: MapPin, title: "Office", value: "Accra, Ghana" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">
          We'd love to hear from you. Send us a message and we'll respond shortly.
        </p>
      </div>
      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <form
          onSubmit={onSubmit}
          className="p-8 rounded-xl bg-card border border-border shadow-soft space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Name <span className="text-danger">*</span>
              </Label>
              <Input required placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label>
                Email <span className="text-danger">*</span>
              </Label>
              <Input type="email" required placeholder="you@institution.edu" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Subject <span className="text-danger">*</span>
            </Label>
            <Input required placeholder="How can we help?" />
          </div>
          <div className="space-y-2">
            <Label>
              Message <span className="text-danger">*</span>
            </Label>
            <Textarea required rows={6} placeholder="Tell us about your election needs..." />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white hover:bg-brand/90"
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Send Message <Send className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>
        <div className="space-y-4">
          {info.map((c) => (
            <div
              key={c.title}
              className="p-6 rounded-xl bg-card border border-border shadow-soft flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{c.title}</div>
                <div className="font-semibold">{c.value}</div>
              </div>
            </div>
          ))}
          <div className="aspect-video rounded-xl bg-gradient-to-br from-brand/10 to-purple/10 border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Map placeholder — Accra, Ghana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
