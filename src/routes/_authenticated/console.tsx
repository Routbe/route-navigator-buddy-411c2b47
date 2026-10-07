import { useState } from "react";
import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Blocks,
  Bot,
  Gauge,
  KeyRound,
  LayoutGrid,
  Link2,
  ListChecks,
  Menu,
  Palette,
  ReceiptText,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  Webhook,
} from "lucide-react";
import { RoutLogo } from "@/components/RoutLogo";
import { AppLogo } from "@/components/console/AppLogo";
import { useConsoleApp } from "@/components/console/console-data";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const GLOBAL_NAV = [
  { to: "/console", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/console/apps", label: "Auth & Identity", icon: Blocks, exact: false },
  { to: "/console/api", label: "API & Webhooks", icon: Webhook, exact: false },
  { to: "/console/connectors", label: "AI Connectors (MCP)", icon: Bot, exact: false },
  { to: "/console/billing", label: "Billing", icon: ReceiptText, exact: false },
] as const;

const APP_NAV = [
  { to: "/console/apps/$appId/overview", label: "Dashboard", icon: Gauge },
  { to: "/console/apps/$appId/credentials", label: "Credentials", icon: KeyRound },
  { to: "/console/apps/$appId/branding", label: "Branding", icon: Palette },
  { to: "/console/apps/$appId/redirects", label: "Redirects", icon: Link2 },
  { to: "/console/apps/$appId/scopes", label: "Scopes", icon: ListChecks },
  { to: "/console/apps/$appId/publishing", label: "Publishing", icon: Rocket },
  { to: "/console/apps/$appId/security", label: "Security", icon: ShieldCheck },
  { to: "/console/apps/$appId/advanced", label: "Advanced", icon: SlidersHorizontal },
] as const;

export const Route = createFileRoute("/_authenticated/console")({
  component: ConsoleWorkspace,
});

const itemClass =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";
const activeClass = { className: "bg-muted text-foreground" };

function AppSidebar({ appId, onNavigate }: { appId: string; onNavigate?: () => void }) {
  const { app } = useConsoleApp(appId);
  return (
    <>
      <Link to="/console/apps" onClick={onNavigate} className="mb-5 flex items-center gap-2 px-3 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to all apps
      </Link>
      {app && (
        <div className="mb-4 flex items-center gap-2.5 px-3">
          <AppLogo app={app} size="sm" />
          <span className="truncate text-sm font-medium">{app.name}</span>
        </div>
      )}
      <nav className="space-y-0.5">
        {APP_NAV.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} params={{ appId }} onClick={onNavigate} className={itemClass} activeProps={activeClass}>
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
    </>
  );
}

function GlobalSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-0.5">
      {GLOBAL_NAV.map(({ to, label, icon: Icon, exact }) => (
        <Link key={to} to={to} onClick={onNavigate} activeOptions={{ exact }} className={itemClass} activeProps={activeClass}>
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const params = useParams({ strict: false }) as { appId?: string };
  return (
    <div className="flex h-full flex-col">
      <Link to="/console" onClick={onNavigate} className="mb-8 flex items-center gap-3 px-3">
        <RoutLogo size={22} />
        <span className="border-l border-border pl-3 text-sm font-medium">Developer Console</span>
      </Link>
      <div className="flex-1">
        {params.appId ? <AppSidebar appId={params.appId} onNavigate={onNavigate} /> : <GlobalSidebar onNavigate={onNavigate} />}
      </div>
      <a href="/dashboard" className="mt-6 flex items-center gap-2 px-3 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to ROUT
      </a>
    </div>
  );
}

function ConsoleWorkspace() {
  const [open, setOpen] = useState(false);
  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border p-4 md:block">
        <SidebarBody />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="dark w-72 border-border bg-background p-4 text-foreground">
          <SheetTitle className="sr-only">Console menu</SheetTitle>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
          <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-md p-1.5 hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
          <RoutLogo size={20} />
          <span className="text-sm font-medium">Developer Console</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
