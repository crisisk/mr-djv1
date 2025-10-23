import { useTranslation } from "react-i18next";
import "./App.css";

import LanguageSwitcher from "./components/LanguageSwitcher";
import BookingSummary from "./components/BookingSummary";
import QuickBookingForm from "./components/booking/QuickBookingForm";
import EventTypeSelector from "./components/booking/EventTypeSelector";
import { EventTypeProvider } from "./context/EventTypeContext";
import UserBehaviorTracker from "./components/analytics/UserBehaviorTracker";
import HeroSection from "../../HeroSection.jsx";
import Testimonials from "../../Testimonials.jsx";

type HeroContent = {
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText?: string;
};

type AppCopy = {
  title: string;
  subtitle?: string;
};

function App() {
  const { t } = useTranslation();
  const heroContent = t("hero", { returnObjects: true }) as HeroContent;
  const appCopy = t("app", { returnObjects: true }) as AppCopy;

  return (
    <EventTypeProvider>
      <div className="App">
        <UserBehaviorTracker />
        <header className="app-header">
          <div className="app-brand">
            <p className="app-badge">{t("hero.badge")}</p>
            <h1 className="app-title">{appCopy.title}</h1>
            {appCopy.subtitle ? <p className="app-subtitle">{appCopy.subtitle}</p> : null}
          </div>
          <LanguageSwitcher />
        </header>

        <main className="app-main">
          <HeroSection
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            ctaPrimaryText={heroContent.ctaPrimaryText}
            ctaSecondaryText={heroContent.ctaSecondaryText}
          />

          <EventTypeSelector />

          <section className="booking-grid" aria-label={t("app.bookingSectionLabel") ?? "Boekingsflow"}>
            <QuickBookingForm origin="landing-page" autoFocus />
            <BookingSummary />
          </section>

          <Testimonials />
        </main>
      </div>
    </EventTypeProvider>
  );
}

export default App;
