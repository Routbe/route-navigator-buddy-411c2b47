import { createFileRoute } from "@tanstack/react-router";

/**
 * ROUT's own auth endpoint (self-hosted Better Auth). Sign-up, sign-in,
 * magic links, social OAuth callbacks (`/api/auth/callback/<provider>`) and
 * sign-out all terminate here — no managed middleman.
 */
async function handle({ request }: { request: Request }) {
  try {
    const { createRoutAuth } = await import("@/lib/better-auth.server");
    return await createRoutAuth(request).handler(request);
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    console.error("[auth] handler failed:", raw);
    const code = /SECRET/.test(raw) ? "missing_secret" : /DATABASE_URL/.test(raw) ? "missing_database" : /relation|column|database|ECONN|pool/i.test(raw) ? "db_error" : "auth_error";
    const message = {
      missing_secret: "Inloggen is niet ingesteld: BETTER_AUTH_SECRET ontbreekt op de server.",
      missing_database: "Inloggen is niet ingesteld: DATABASE_URL ontbreekt op de server.",
      db_error: "Inloggen faalt door een databaseprobleem. Probeer later opnieuw.",
      auth_error: "Inloggen faalt aan serverzijde. Probeer later opnieuw.",
    }[code];
    return Response.json({ code, message }, { status: 500, headers: { "cache-control": "no-store" } });
  }
}

export const Route = createFileRoute("/api_/auth/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
