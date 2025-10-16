import React from 'react';
import { Menu, Phone, ShieldCheck, User } from 'lucide-react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb.jsx';

const primaryLinks = ['Diensten', 'Pakketten', 'Reviews', 'Over ons'];
const footerLinks = [
  ['DJ voor bruiloften', 'DJ voor bedrijfsfeesten', 'DJ + Sax', 'Silent Disco'],
  ['Werkwijze', 'FAQ', 'Contact', 'Blog'],
];

const Navigation = () => (
  <SlideLayout
    title="Molecules: Navigation"
    subtitle="Responsieve navigatiepatronen voor desktop, mobiel en ondersteunende flows."
  >
    <div className="space-y-spacing-xl">
      <header className="flex flex-wrap items-center justify-between gap-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
        <div className="flex items-center gap-spacing-md">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-neutral-light">
            DJ
          </div>
          <nav className="hidden items-center gap-spacing-lg text-sm font-semibold text-neutral-dark md:flex">
            {primaryLinks.map((link) => (
              <a key={link} href="#" className="transition hover:text-primary">
                {link}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-spacing-sm">
          <Button variant="ghost" size="sm" className="hidden gap-spacing-xs text-sm text-neutral-dark md:flex">
            <ShieldCheck className="size-4" aria-hidden />
            2500+ events
          </Button>
          <Button size="lg" className="gap-spacing-xs">
            <Phone className="size-4" aria-hidden />
            Plan een intake
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" aria-hidden />
          </Button>
        </div>
      </header>

      <section className="grid gap-spacing-lg md:grid-cols-2">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-md">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Mobile menu</h3>
          <div className="mt-spacing-md space-y-spacing-sm">
            {primaryLinks.map((link) => (
              <button
                key={link}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl bg-neutral-light px-spacing-lg py-spacing-sm text-left text-sm font-semibold text-neutral-dark shadow-sm"
              >
                {link}
                <span className="text-xs text-primary">→</span>
              </button>
            ))}
            <Button variant="secondary" size="lg" className="w-full gap-spacing-xs">
              <User className="size-4" aria-hidden />
              Inloggen klantenportal
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-md">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Breadcrumbs</h3>
          <Breadcrumb className="mt-spacing-md">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Diensten</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Bruiloft DJ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="text-primary">
                  Bruiloft DJ Eindhoven
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="mt-spacing-md text-sm text-neutral-gray-500">
            Gebruik breadcrumbs op lokale SEO pagina’s voor interne linkstructuur en betere vindbaarheid.
          </p>
        </div>
      </section>

      <footer className="grid gap-spacing-lg rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-lg md:grid-cols-2">
        {footerLinks.map((column, index) => (
          <div key={index} className="space-y-spacing-sm">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">
              {index === 0 ? 'Diensten' : 'Resources'}
            </h4>
            <ul className="space-y-spacing-xs text-sm text-neutral-dark">
              {column.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="space-y-spacing-sm">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Contact</h4>
          <p className="text-sm text-neutral-dark">Vragen? Mail naar <a href="mailto:info@misterdj.nl" className="text-primary underline">info@misterdj.nl</a></p>
          <Button variant="outline" size="lg">
            Download mediakit
          </Button>
        </div>
      </footer>
    </div>
  </SlideLayout>
);

export default Navigation;
