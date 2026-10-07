import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Zap } from "lucide-react";
import { ConsoleCard, ConsolePage } from "@/components/console/ConsolePage";
import { useAppPage } from "@/components/console/useAppPage";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/console/apps/$appId/security")({
  component: SecurityPage,
});

const FLOWS = [
  { id: "seamless", icon: Zap, title: "Seamless", text: "Ingelogde gebruikers gaan met één klik verder." },
  { id: "strict", icon: ShieldCheck, title: "Strict", text: "Altijd een 6-cijferige code per e-mail vóór toegang." },
] as const;

function SecurityPage() {
  const { appId } = Route.useParams();
  const { app, persist, saving } = useAppPage(appId);

  return (
    <ConsolePage title="Security & Flows" description="Hoe streng ROUT is bij het aanmelden op je app.">
      <ConsoleCard title="Flow">
        <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
          {FLOWS.map(({ id, icon: Icon, title, text }) => {
            const active = app.flowPreference === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={saving}
                onClick={() => !active && persist({ flowPreference: id })}
                className={`rounded-xl border p-4 text-left transition-colors ${active ? "border-foreground bg-muted" : "border-border hover:border-foreground/40"}`}
              >
                <Icon className="mb-2 h-5 w-5" />
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{text}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Ook in Seamless vraagt ROUT een code wanneer je app <code>prompt=login</code>, <code>max_age</code> of{" "}
          <code>acr_values=urn:rout:acr:strict</code> meestuurt.
        </p>
      </ConsoleCard>
      <ConsoleCard title="Rich Identity">
        <div className="flex items-start gap-4">
          <p className="flex-1 text-sm text-muted-foreground">
            Vraag gebruikers om hun publieke activiteit te delen. Ze zien een extra vinkje dat standaard uit staat; er wordt enkel iets gedeeld als zij het aanzetten.
          </p>
          <Switch
            aria-label="Rich Identity"
            checked={app.richIdentityEnabled}
            disabled={saving}
            onCheckedChange={(on) => persist({ richIdentityEnabled: on })}
          />
        </div>
      </ConsoleCard>
    </ConsolePage>
  );
}
