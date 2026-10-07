import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Press";

const TITLE = "Brand & press kit | ROUT";
const DESCRIPTION =
  "Officiële ROUT-logo's (SVG/PNG), kleurenpalet met HEX-codes, standaardtekst en perscontact.";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://rout.be/press/rout-lockup.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://rout.be/press/rout-lockup.png" },
    ],
  }),
  component: Page,
});
