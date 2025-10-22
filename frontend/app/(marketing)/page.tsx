import RegionLinks from "@/components/RegionLinks";

export default function MarketingHomePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-12 lg:px-0">
      <section className="space-y-6" id="hero">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">Dé feestspecialist van het zuiden</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Mister DJ verzorgt bruiloften, bedrijfsfeesten en events met 100% dansgarantie
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Met meer dan 15 jaar ervaring en een clubwaardig licht- en geluidsplan creëren we voor ieder event een onvergetelijke
          avond. Kies uit maatwerk pakketten, combineer met live saxofonist of laat ons een compleet feestconcept samenstellen.
        </p>
        <div className="flex flex-wrap gap-3">
          <a className="btn btn-primary" href="#pakketten">
            Bekijk pakketten
          </a>
          <a className="btn btn-outline" href="/contact">
            Vraag een offerte aan
          </a>
        </div>
      </section>

      <section className="space-y-4" id="pakketten">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">DJ pakketten op maat</h2>
        <p className="max-w-2xl text-slate-600">
          Van compacte setups tot all-in shows met verlichting, visuals en live muzikanten: Mister DJ bouwt een pakket dat past
          bij jullie locatie, gastenlijst en favoriete muziekstijlen.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          <li className="rounded-lg border border-slate-200 p-5">
            <h3 className="text-xl font-semibold">Bruiloft pakket</h3>
            <p className="text-sm text-slate-600">Intieme intake, ceremonie-audio, openingsdans coaching en avondshow.</p>
          </li>
          <li className="rounded-lg border border-slate-200 p-5">
            <h3 className="text-xl font-semibold">Business event</h3>
            <p className="text-sm text-slate-600">Opening, plenaire begeleiding en feestavond met branding visuals.</p>
          </li>
        </ul>
      </section>

      <section className="space-y-6" id="faq">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Veelgestelde vragen</h2>
        <div className="space-y-4">
          <details className="rounded-lg border border-slate-200 p-5">
            <summary className="font-medium">Hoe snel kunnen we een offerte verwachten?</summary>
            <p className="mt-2 text-sm text-slate-600">Binnen 24 uur ontvang je een voorstel op maat voor jouw event.</p>
          </details>
          <details className="rounded-lg border border-slate-200 p-5">
            <summary className="font-medium">Kunnen jullie afstemmen met de locatie?</summary>
            <p className="mt-2 text-sm text-slate-600">Ja, we nemen direct contact op met de locatie voor techniek en planning.</p>
          </details>
        </div>
      </section>

      <section aria-labelledby="region-links-heading" className="space-y-4">
        <h2 id="region-links-heading" className="text-3xl font-semibold tracking-tight text-slate-900">
          Populaire regio’s in Brabant &amp; Limburg
        </h2>
        <p className="max-w-2xl text-slate-600">
          We staan klaar voor events in de volledige regio. Verken de meest gevraagde steden en bekijk direct wat we lokaal
          kunnen betekenen.
        </p>
        <RegionLinks />
      </section>
    </main>
  );
}
