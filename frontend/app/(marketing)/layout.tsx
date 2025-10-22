import type { ReactNode } from "react";
import RegionLinks from "@/components/RegionLinks";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white text-slate-900">
      {children}
      <footer className="mt-16 border-t border-slate-200 bg-slate-950 py-10 text-slate-200">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 lg:flex-row lg:items-start lg:justify-between lg:px-0">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-400">Mister DJ</p>
            <p className="max-w-sm text-sm text-slate-300">
              Premium DJ shows met licht, geluid en live-musici voor bruiloften en corporate events in Brabant &amp; Limburg.
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <a className="hover:text-white" href="tel:+31408422594">
                +31 (0) 40 842 2594
              </a>
              <a className="hover:text-white" href="mailto:hallo@misterdj.nl">
                hallo@misterdj.nl
              </a>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-lg font-semibold text-white">DJ per stad</h2>
            <RegionLinks />
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-5xl px-4 text-xs text-slate-500 lg:px-0">© {new Date().getFullYear()} Mister DJ. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
}
