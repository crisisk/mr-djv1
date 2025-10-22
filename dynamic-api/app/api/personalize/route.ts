// nextjs/app/api/personalize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { thompsonPick } from "../../../services/experimentation/decision";

// Demo in-memory registry; replace by DB in production
const experiments: Record<string, any> = {
  "HERO_WEDDING_EVALUATION": {
    zone: "hero",
    targeting: { wedding: true, journey: "evaluation" },
    variants: [
      { key: "A", assets: { headline: "Jullie avond, onze soundtrack", subline: "Van openingsdans tot laatste knaller – zorgeloos in Brabant.", cta: { label: "Plan gratis intake", href: "/bruiloft/intake" }, img: "/images/wedding_hero_1.webp" }, metrics: { exposures: 40, clicks: 8, conversions: 3 } },
      { key: "B", assets: { headline: "Dansvloer altijd vol", subline: "DJ + licht & geluid + photobooth – pakketten op maat.", cta: { label: "Bekijk bruiloftspakketten", href: "/bruiloft/pakketten" }, img: "/images/wedding_hero_2.webp" }, metrics: { exposures: 37, clicks: 7, conversions: 2 } },
      { key: "C", assets: { headline: "Ja-woord. Ja-feest.", subline: "Lokale bruiloft DJ in Brabant & Limburg met 100% dansgarantie.", cta: { label: "Check beschikbaarheid", href: "/check" }, img: "/images/wedding_hero_3.webp" }, metrics: { exposures: 33, clicks: 6, conversions: 2 } }
    ]
  },
  "HERO_NONWEDD_AWARENESS": {
    zone: "hero",
    targeting: { wedding: false, journey: "awareness" },
    variants: [
      { key: "A", assets: { headline: "Scherp geluid. Strak licht.", subline: "Zakelijke events zonder gedoe – all-in show.", cta: { label: "Vraag offerte", href: "/zakelijk/offerte" }, img: "/images/corp_hero_1.webp" }, metrics: { exposures: 50, clicks: 6, conversions: 1 } },
      { key: "B", assets: { headline: "Van borrel tot bedrijfsfeest", subline: "Allround DJ + drive-in show in Brabant & Limburg.", cta: { label: "Check beschikbaarheid", href: "/check" }, img: "/images/corp_hero_2.webp" }, metrics: { exposures: 45, clicks: 5, conversions: 1 } }
    ]
  }
};

function inferSegmentFromHeaders(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname.toLowerCase();
  const params = url.searchParams;
  const ref = req.headers.get("referer") || "";
  const cookieHeader = req.headers.get("cookie") || "";
  const device = /Mobile|Android|iPhone/.test(req.headers.get("user-agent") || "") ? "mobile" : "desktop";

  const wedding = path.includes("bruiloft") || params.get("event") === "wedding" || /trouw/i.test(ref);
  // naive journey guess for demo:
  let journey: any = "awareness";
  if (/pakketten|prijzen|faq|reviews|impressies|foto/.test(path)) journey = "consideration";
  if (/offerte|intake|check|contact|aanvraag|form/.test(path)) journey = "intent";
  if (/bedankt|bevestiging|dashboard/.test(path)) journey = "booking";

  return { wedding, journey, device, cookieHeader };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zone = searchParams.get("zone") || "hero";

  const seg = inferSegmentFromHeaders(req);
  const key =
    zone === "hero" && seg.wedding && seg.journey === "evaluation" ? "HERO_WEDDING_EVALUATION" :
    zone === "hero" && !seg.wedding && seg.journey === "awareness" ? "HERO_NONWEDD_AWARENESS" :
    "HERO_NONWEDD_AWARENESS"; // fallback

  const exp = experiments[key];
  const arms = exp.variants.map((v: any) => ({ variant: v, metrics: v.metrics }));
  const choice = thompsonPick(arms).variant;

  const payload = {
    segment: { wedding: !!seg.wedding, journey: seg.journey },
    variant: choice,
    exposure_token: `exp_${key}_${choice.key}_${Date.now()}`
  };

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
