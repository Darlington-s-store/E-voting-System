import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Vote,
  History,
  Bell,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Star,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/auth-store";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { elections, notifications } from "@/lib/mock-data";

export function VoterLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  // Dynamic Badge Counts
  const activeElectionsCount = elections.filter(
    (e) => e.type !== "Campus Awards" && e.status === "open",
  ).length;

  const activeAwardsCount = elections.filter(
    (e) => e.type === "Campus Awards" && e.status === "open",
  ).length;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const links = [
    { to: "/voter/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/voter/elections",
      label: "Active Elections",
      icon: Vote,
      badge: activeElectionsCount > 0 ? activeElectionsCount : undefined,
      badgeColor: "bg-[#059669] text-white font-extrabold",
    },
    {
      to: "/voter/elections?tab=awards",
      label: "Campus Awards",
      icon: Star,
      badge: activeAwardsCount > 0 ? activeAwardsCount : undefined,
      badgeColor: "bg-[#F4C430] text-black font-extrabold",
    },
    { to: "/voter/history", label: "Voting History", icon: History },
    {
      to: "/voter/notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: "bg-[#F97316] text-white font-extrabold",
    },
    { to: "/voter/profile", label: "My Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-45 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#022C22] border-r border-emerald-900/30 transition-all duration-300 flex flex-col ${
          open ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-16" : "lg:w-64"}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-900/30 shrink-0 bg-[#022C22]">
          <div className="overflow-hidden flex items-center">
            {collapsed ? (
              <div className="w-8 h-8 flex items-center justify-center bg-white/10 text-[#34D399] border border-emerald-700/20 rounded-lg font-black text-lg">
                EV
              </div>
            ) : (
              <Logo light />
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md border border-emerald-900/40 hover:bg-white/5 text-emerald-200/50 hover:text-[#34D399] transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Voter Profile Banner (Sidebar) */}
        {!collapsed && user && (
          <div className="p-4 mx-3 my-4 bg-emerald-900/25 border border-emerald-800/20 rounded-xl flex items-center gap-3 shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-emerald-800/20 shadow-sm object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-emerald-200/60 truncate font-mono mt-0.5">
                {user.studentId}
              </p>
            </div>
          </div>
        )}
        {collapsed && user && (
          <div className="py-4 flex justify-center border-b border-emerald-900/30 shrink-0 bg-[#022C22]">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-emerald-800/20 shadow-sm object-cover"
            />
          </div>
        )}

        {/* Sidebar Nav */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto bg-[#022C22]">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-white/10 text-[#34D399] font-bold"
                    : "text-emerald-200/70 hover:text-[#34D399] hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <l.icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-[#34D399]" : "text-emerald-200/50 group-hover:text-[#34D399]"
                    }`}
                  />
                  {!collapsed && <span className="truncate flex-1">{l.label}</span>}
                  {l.badge && !collapsed && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${l.badgeColor}`}
                    >
                      {l.badge}
                    </span>
                  )}

                  {/* Tooltip & Badge in collapsed state */}
                  {collapsed && (
                    <div className="absolute left-14 bg-[#022C22] border border-emerald-800/50 text-[#34D399] px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-soft opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all z-50 pointer-events-none whitespace-nowrap">
                      {l.label}
                      {l.badge && (
                        <span
                          className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-black ${l.badgeColor}`}
                        >
                          {l.badge}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-emerald-900/30 shrink-0 bg-[#022C22]">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors group relative`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
            {collapsed && (
              <div className="absolute left-14 bg-[#022C22] border border-red-900/50 text-red-400 px-2.5 py-1 rounded-lg text-xs font-bold shadow-soft opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all z-50 pointer-events-none whitespace-nowrap">
                Sign out
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-lg tracking-tight hidden sm:block">Voter Portal</h1>
            {/* Breadcrumb snippet */}
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="text-xs font-semibold text-muted-foreground">Secure Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="w-9 h-9 rounded-xl hover:bg-muted"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#F4C430]" />
              ) : (
                <Moon className="w-4 h-4 text-brand" />
              )}
            </Button>

            {/* Notifications Bell */}
            <Link
              to="/voter/notifications"
              className="relative w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center border border-border/40"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-card">
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 p-1 rounded-xl border border-border/40 hover:bg-muted/40 transition-colors">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-border"
                  />
                  <span className="hidden md:inline text-xs font-bold pr-1">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-md border-border">
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold text-foreground">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => nav("/voter/profile")}
                  className="cursor-pointer font-medium text-xs"
                >
                  <User className="w-4 h-4 mr-2 text-muted-foreground" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-danger cursor-pointer font-medium text-xs hover:bg-danger/5"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
