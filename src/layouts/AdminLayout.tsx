import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Vote, PlusCircle, Briefcase, Users, UserCheck,
  TrendingUp, Award, FileBarChart, ScrollText, Bell, Settings,
  Menu, Moon, Sun, ChevronDown, LogOut, Search, User,
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/auth-store";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const sections = [
  { label: "OVERVIEW", items: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { label: "ELECTIONS", items: [
    { to: "/admin/elections", label: "All Elections", icon: Vote },
    { to: "/admin/elections/create", label: "Create Election", icon: PlusCircle },
    { to: "/admin/positions", label: "Positions", icon: Briefcase },
  ]},
  { label: "PEOPLE", items: [
    { to: "/admin/voters", label: "Voters", icon: Users },
    { to: "/admin/candidates", label: "Candidates", icon: UserCheck },
  ]},
  { label: "RESULTS", items: [
    { to: "/admin/elections/e1/results", label: "Live Results", icon: TrendingUp },
    { to: "/admin/elections/e3/results", label: "Published Results", icon: Award },
  ]},
  { label: "REPORTS", items: [
    { to: "/admin/reports", label: "Generate Reports", icon: FileBarChart },
  ]},
  { label: "SYSTEM", items: [
    { to: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ]},
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const handleLogout = () => { logout(); nav("/login"); };

  return (
    <div className="min-h-screen bg-background flex">
      {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-sidebar border-r border-sidebar-border transition-transform overflow-y-auto ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border sticky top-0 bg-sidebar z-10">
          <Logo />
        </div>
        <nav className="p-3 space-y-4 pb-20">
          {sections.map((sec) => (
            <div key={sec.label}>
              <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-muted-foreground">{sec.label}</div>
              <div className="space-y-0.5">
                {sec.items.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    end={l.to === "/admin/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                        isActive
                          ? "bg-brand/10 text-brand"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                      }`
                    }
                  >
                    <l.icon className="w-4 h-4" />
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button className="lg:hidden p-2 rounded-md hover:bg-muted" onClick={() => setOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-md flex-1 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search elections, voters, candidates..." className="pl-9 bg-muted/40 border-transparent" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button className="relative p-2 rounded-md hover:bg-muted">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted">
                  <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full" />
                  <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/admin/settings")}>
                  <User className="w-4 h-4 mr-2" /> Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-danger">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
