import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Quote, Shield } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export function AuthShell({ children, title, subtitle, footer }: { children: ReactNode; title: string; subtitle?: string; footer?: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative gradient-navy text-white p-12 flex-col justify-between overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="a" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#a)" />
        </svg>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative max-w-md">
          <Quote className="w-10 h-10 text-brand mb-3" />
          <p className="text-2xl font-semibold leading-snug">
            "Democracy is the art of building consensus. Our job is to make sure every voice counts — securely, fairly, and transparently."
          </p>
          <p className="mt-4 text-white/70 text-sm">The SecureVote Pro Team</p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-white/70">
          <Shield className="w-4 h-4" /> ISO 27001 certified · End-to-end encrypted
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-10 lg:p-16">
        <div className="lg:hidden mb-8"><Logo /></div>
        <div className="m-auto w-full max-w-md">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-center text-muted-foreground">{footer}</div>}
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-brand">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
