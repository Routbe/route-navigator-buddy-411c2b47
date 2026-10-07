import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Palette, Link2, ListChecks, ShieldCheck } from "lucide-react";
import { useConsoleApp } from "@/components/console/console-data";
import { AppLogo } from "@/components/console/AppLogo";

export const Route = createFileRoute("/_authenticated/console/apps/$appId")({
  component: AppLayout,
});

const NAV = [
  { to: "/console/apps/$appId/credentials", label: "Credentials", icon: KeyRound },
  { to: "/console/apps/$appId/branding", label: "Branding", icon: Palette },
  { to: "/console/apps/$appId/redirects", label: "Redirects", icon: Link2 },
  { to: "/console/apps/$appId/scopes", label: "Scopes", icon: ListChecks },
  { to: "/console/apps/$appId/security", label: "Security & Flows", icon: ShieldCheck },
] as const;

function AppLayout() {
  const { appId } = Route.useParams();
  const { app, isLoading } = useConsoleApp(appId);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="hidden w-60 shrink-0 border-r border-border p-4 md:block">
        <Link to="/console/apps" className="mb-5 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Alle apps
        </Link>
        {app && (
          <div className="mb-5 flex items-center gap-2">
            <AppLogo app={app} size="sm" />
            <span className="truncate text-sm font-medium">{app.name}</span>
          </div>
        )}
        <nav className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              params={{ appId }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {NAV.map(({ to, label }) => (
            <Link key={to} to={to} params={{ appId }} className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs text-muted-foreground" activeProps={{ className: "bg-muted text-foreground" }}>
              {label}
            </Link>
          ))}
        </nav>
        {isLoading ? <p className="p-10 text-sm text-muted-foreground">Laden…</p> : app ? <Outlet /> : (
          <p className="p-10 text-sm text-muted-foreground">Deze app bestaat niet of je hebt er geen toegang toe.</p>
        )}
      </div>
    </div>
  );
}
