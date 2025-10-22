import React, { useId } from "react";
import { useTranslation } from "react-i18next";
import Button from "./Buttons.jsx";

const defaultOverlayGradient = "from-neutral-dark/90 via-neutral-dark/60 to-primary/80";

const ArrowIcon = ({ direction = "right" }) => {
  const rotation = direction === "right" ? "rotate-0" : "rotate-180";

  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 transition-transform duration-200 ease-out group-hover/cta:translate-x-1 ${rotation}`}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8h10m0 0l-4-4m4 4l-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const ScrollIndicatorIcon = () => (
  <svg
    aria-hidden="true"
    className="h-10 w-10 text-neutral-light/80"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="17" y="6" width="14" height="24" rx="7" className="opacity-60" strokeWidth="2" />
    <path
      d="M24 32v10m0 0l-6-6m6 6 6-6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const HeroDecorativeVisual = () => (
  <div className="relative mx-auto h-[320px] w-full max-w-[420px]">
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent blur-3xl" />
    <div className="absolute inset-y-4 inset-x-6 rounded-[2.5rem] bg-gradient-to-br from-primary/40 via-primary/20 to-secondary/50 backdrop-blur-md border border-white/20 shadow-[0_25px_60px_rgba(17,24,39,0.35)]" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-spacing-lg">
      <div className="rounded-full border border-white/30 bg-white/10 px-spacing-lg py-spacing-sm text-font-size-small font-semibold uppercase tracking-[0.3em] text-neutral-light">
        Live energy
      </div>
      <p className="max-w-[260px] text-center text-font-size-body text-neutral-light/90">
        Dynamische visual die plek vrijhoudt voor fotografie, video of een animatie.
      </p>
    </div>
  </div>
);

const HeroSection = ({
  title,
  subtitle,
  supportingCopy,
  badge,
  testimonial,
  stats,
  ctaPrimaryText,
  ctaSecondaryText,
  ctaPrimaryProps = {},
  ctaSecondaryProps = {},
  backgroundClass = "bg-neutral-dark",
  overlayGradient = defaultOverlayGradient,
  overlayOpacityClass = "opacity-90",
  backgroundImage,
  mediaContent,
  showScrollIndicator = true,
  onScrollIndicatorClick,
  titleColor = "text-secondary",
  subtitleColor = "text-neutral-light",
  supportingColor = "text-neutral-light/90",
  children,
}) => {
  const { t } = useTranslation();

  const resolvedTitle = title ?? t("hero.title");
  const resolvedSubtitle = subtitle ?? t("hero.subtitle");
  const resolvedPrimaryCta = ctaPrimaryText ?? t("hero.ctaPrimaryText");
  const resolvedSecondaryCta = ctaSecondaryText ?? t("hero.ctaSecondaryText");
  const resolvedBadge = badge ?? t("hero.badge");
  const resolvedSupportingCopy = supportingCopy ?? t("hero.supportingCopy");
  const translatedStats = stats ?? t("hero.stats", { returnObjects: true });
  const resolvedStats = Array.isArray(translatedStats) ? translatedStats : [];
  const translatedTestimonial = testimonial ?? t("hero.testimonial", { returnObjects: true });
  const resolvedTestimonial =
    translatedTestimonial && typeof translatedTestimonial === "object" ? translatedTestimonial : {};

  const heroTitleId = useId();
  const ctaGroupLabelId = useId();
  const ctaGroupDescriptionId = useId();
  const statsGroupLabelId = useId();

  const {
    className: primaryClassName = "",
    leadingIcon: primaryLeadingIcon,
    trailingIcon: primaryTrailingIcon,
    variant: primaryVariant = "secondary",
    ...primaryButtonRest
  } = ctaPrimaryProps;
  const {
    className: secondaryClassName = "",
    leadingIcon: secondaryLeadingIcon,
    trailingIcon: secondaryTrailingIcon,
    variant: secondaryVariant = "outline",
    ...secondaryButtonRest
  } = ctaSecondaryProps;

  const resolvedPrimaryTrailingIcon =
    primaryTrailingIcon === undefined ? <ArrowIcon /> : primaryTrailingIcon;
  const resolvedSecondaryLeadingIcon =
    secondaryLeadingIcon === undefined ? <ArrowIcon direction="left" /> : secondaryLeadingIcon;

  return (
    <section
      aria-labelledby={heroTitleId}
      className={`${backgroundClass} relative overflow-hidden`}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {backgroundImage ? (
          <img alt="" className="h-full w-full object-cover" src={backgroundImage} />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15)_0%,_rgba(255,255,255,0)_60%)]" />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${overlayGradient} ${overlayOpacityClass}`}
        />
      </div>

      <div className="relative z-10 px-spacing-xl py-spacing-4xl">
        <div className="container mx-auto grid max-w-[1200px] items-center gap-spacing-3xl lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div className="space-y-spacing-xl text-left text-balance">
            {resolvedBadge && (
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/60 bg-secondary/20 px-spacing-md py-spacing-xs text-font-size-small font-semibold uppercase tracking-[0.28em] text-secondary shadow-[0_8px_20px_rgba(59,130,246,0.35)]">
                <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_0_4px_rgba(59,130,246,0.15)]" />
                {resolvedBadge}
              </span>
            )}

            <div className="space-y-spacing-md">
              <h1
                id={heroTitleId}
                className={`text-font-size-h1 font-extrabold leading-tight ${titleColor}`}
              >
                {resolvedTitle}
              </h1>
              <p className={`text-font-size-h3 max-w-2xl ${subtitleColor}`}>{resolvedSubtitle}</p>
              <p className={`max-w-2xl text-font-size-body ${supportingColor}`}>
                {resolvedSupportingCopy}
              </p>
            </div>

            <div
              aria-describedby={ctaGroupDescriptionId}
              aria-labelledby={ctaGroupLabelId}
              className="flex flex-col gap-spacing-sm sm:flex-row sm:items-center"
              role="group"
            >
              <span id={ctaGroupLabelId} className="sr-only">
                {t("hero.ctaGroupLabel", {
                  defaultValue: "Hero call to action knoppen",
                })}
              </span>
              <p id={ctaGroupDescriptionId} className="sr-only">
                {t("hero.ctaGroupDescription", {
                  defaultValue:
                    "Knoppen hebben 220ms ease-out hover-animaties en geven richting met pijltjesiconen.",
                })}
              </p>

              <Button
                {...primaryButtonRest}
                className={`group/cta shadow-[0_20px_45px_rgba(14,116,144,0.35)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_25px_55px_rgba(14,116,144,0.45)] focus-visible:-translate-y-0.5 ${primaryClassName}`.trim()}
                leadingIcon={primaryLeadingIcon}
                size="lg"
                trailingIcon={resolvedPrimaryTrailingIcon}
                variant={primaryVariant}
              >
                {resolvedPrimaryCta}
              </Button>

              {resolvedSecondaryCta ? (
                <Button
                  {...secondaryButtonRest}
                  className={`group/cta border border-neutral-light/40 bg-white/10 text-neutral-light transition-all duration-200 ease-out hover:bg-white/20 focus-visible:bg-white/20 ${secondaryClassName}`.trim()}
                  leadingIcon={resolvedSecondaryLeadingIcon}
                  size="lg"
                  trailingIcon={secondaryTrailingIcon}
                  variant={secondaryVariant}
                >
                  {resolvedSecondaryCta}
                </Button>
              ) : null}
            </div>

            {resolvedStats.length > 0 || children ? (
              <div className="space-y-spacing-md">
                <h2 id={statsGroupLabelId} className="sr-only">
                  {t("hero.statsLabel", {
                    defaultValue: "Belangrijkste MR-DJ statistieken",
                  })}
                </h2>
                <dl
                  aria-labelledby={statsGroupLabelId}
                  className="grid grid-cols-2 gap-spacing-lg sm:grid-cols-3"
                >
                  {resolvedStats.map((stat, index) => (
                    <div
                      key={`${stat.label ?? "stat"}-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-spacing-md backdrop-blur-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-white/25"
                    >
                      <dt className="text-font-size-small font-semibold uppercase tracking-[0.2em] text-neutral-light/80">
                        {stat.label}
                      </dt>
                      <dd className="text-font-size-h3 font-black text-neutral-light">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {children && <div className="text-neutral-light/90">{children}</div>}
              </div>
            ) : null}

            {resolvedTestimonial.quote ? (
              <figure className="max-w-xl space-y-spacing-xs text-neutral-light/80">
                <blockquote className="text-font-size-body italic">
                  “{resolvedTestimonial.quote}”
                </blockquote>
                {resolvedTestimonial.author ? (
                  <figcaption className="text-font-size-small font-semibold uppercase tracking-[0.25em] text-neutral-light/60">
                    {resolvedTestimonial.author}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>

          <div className="relative flex justify-center lg:justify-end">
            {mediaContent ?? <HeroDecorativeVisual />}
          </div>
        </div>

        {showScrollIndicator ? (
          <div className="mt-spacing-4xl flex justify-center">
            <button
              className="group inline-flex flex-col items-center gap-spacing-xs text-neutral-light/80 transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:-translate-y-1"
              onClick={onScrollIndicatorClick}
              type="button"
            >
              <ScrollIndicatorIcon />
              <span className="text-font-size-small font-semibold uppercase tracking-[0.4em]">
                {t("hero.scrollIndicator", {
                  defaultValue: "Scroll naar beneden",
                })}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default HeroSection;
