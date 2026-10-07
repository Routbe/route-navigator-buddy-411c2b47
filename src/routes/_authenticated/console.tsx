import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, Blocks, KeyRound, LayoutGrid, WalletCards } from "lucide-react";
import { RoutLogo } from "@/components/RoutLogo";

const NAV = [
  { to: "/console", label: "Overview", icon: LayoutGrid },
  { to: "/console/apps", label: "Identity & OAuth", icon: Blocks },
  { to: "/console/api", label: "API Keys & Webhooks", icon: KeyRound },
  { to: "/console/connectors", label: "AI & MCP Connectors", icon: WalletCards },
] as const;

export const Route = createFileRoute("/_authenticated/console")({
  component: ConsoleWorkspace,
});

function ConsoleWorkspace() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-background/90 px-4 backdrop-blur md:px-6">
        <Link to="/console" className="flex items-center gap-3">
          <RoutLogo size={25} />
          <span className="hidden border-l border-border pl-3 text-sm font-medium sm:block">Developer Console</span>
        </Link>
        <nav className="ml-8 hidden items-center gap-1 lg:flex">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/console" }} className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-muted text-foreground" }}>
              <Icon className="h-3.5 w-3.5" /> {label}
            </Link>
          ))}
        </nav>
        <a href="/dashboard" className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Terug naar ROUT</span>
        </a>
      </header>
      <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 lg:hidden">
        {NAV.map(({ to, label }) => <Link key={to} to={to} activeOptions={{ exact: to === "/console" }} className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-muted-foreground" activeProps={{ className: "bg-muted text-foreground" }}>{label}</Link>)}
      </nav>
      <Outlet />
    </div>
  );
}