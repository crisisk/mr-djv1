import React from 'react';

const VisuallyHidden = ({ children }) => (
    <span
        style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
        }}
    >
        {children}
    </span>
);

const featuredTestimonial = {
    badge: '⭐ FEATURED REVIEW',
    quote:
        'Onze bruiloft was absoluut perfect dankzij Mr. DJ! De hele avond stond de dansvloer vol en hij wist precies welke muziek wanneer te draaien. Professioneel, flexibel en super enthousiast. Onze gasten praten er nog steeds over!',
    author: 'Sarah & Mark',
    event: 'Bruiloft • Evoluon Eindhoven • 28 juli 2024',
    initials: 'SM',
    rating: 5,
    ratingText: '10/10 Perfect',
    platform: {
        icon: '📘',
        label: 'Facebook Reviews',
    },
};

const testimonialsData = [
    {
        initials: 'LB',
        name: 'Linda Bakker',
        event: 'Bedrijfsfeest',
        rating: 5,
        quote:
            'Voor ons bedrijfsfeest hebben we Mr. DJ ingehuurd en wat een succes! Hij las de sfeer perfect aan en zorgde ervoor dat iedereen zich vermaakt heeft. De lichtshow was spectaculair!',
        date: '12 september 2024',
        dateISO: '2024-09-12',
        platform: {
            icon: '📷',
            label: 'Instagram',
        },
    },
    {
        initials: 'JD',
        name: 'Jan de Vries',
        event: 'Bruiloft',
        rating: 5,
        quote:
            'Onze bruiloft was een droom die uitkwam, mede dankzij de geweldige DJ service van Mr. DJ. Hij nam alle tijd voor een intakegesprek en speelde precies de muziek die wij wilden.',
        date: '5 augustus 2024',
        dateISO: '2024-08-05',
        platform: {
            icon: '⭐',
            label: 'Google Reviews',
        },
    },
    {
        initials: 'MJ',
        name: 'Maria Jansen',
        event: 'Verjaardag',
        rating: 5,
        quote:
            'Voor mijn 50e verjaardag wilde ik een onvergetelijk feest en Mr. DJ heeft dat mogelijk gemaakt! Professionele apparatuur, geweldige muziek en een DJ die echt met je meedenkt.',
        date: '20 juni 2024',
        dateISO: '2024-06-20',
        platform: {
            icon: '📘',
            label: 'Facebook',
        },
    },
    {
        initials: 'PH',
        name: 'Peter Hendriks',
        event: 'Bedrijfsfeest',
        rating: 5,
        quote:
            "Als eventmanager heb ik met veel DJ's gewerkt, maar Mr. DJ springt er echt uit. Betrouwbaar, professioneel en altijd goed voorbereid. De communicatie vooraf was uitstekend.",
        date: '15 oktober 2024',
        dateISO: '2024-10-15',
        platform: {
            icon: '💼',
            label: 'LinkedIn',
        },
    },
];

const statsData = [
    {
        id: 'avg-score',
        highlight: '⭐⭐⭐⭐⭐',
        value: '10/10',
        label: 'Gemiddelde Score',
        srLabel: 'Gemiddelde score: tien op tien',
    },
    {
        id: 'verified-reviews',
        value: '250+',
        label: 'Verified Reviews',
        srLabel: 'Meer dan tweehonderdvijftig geverifieerde reviews',
    },
    {
        id: 'recommendation-rate',
        value: '98%',
        label: 'Zou Aanbevelen',
        srLabel: 'Achtennegentig procent van de klanten zou aanbevelen',
    },
    {
        id: 'successful-events',
        value: '2500+',
        label: 'Geslaagde Events',
        srLabel: 'Meer dan tweeduizend vijfhonderd geslaagde events',
    },
];

const StarRating = ({ rating, label }) => {
    const stars = Array(5)
        .fill(0)
        .map((_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-secondary' : 'text-neutral-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));

    return (
        <div className="relative flex items-center" aria-label={label ?? `Beoordeling: ${rating} van 5 sterren`}>
            <VisuallyHidden>{label ?? `Beoordeling: ${rating} van 5 sterren`}</VisuallyHidden>
            <div className="flex" aria-hidden="true">
                {stars}
            </div>
        </div>
    );
};

const InitialsAvatar = ({ initials, className = '' }) => (
    <div
        className={`w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold flex items-center justify-center ${className}`}
        aria-hidden="true"
    >
        {initials}
    </div>
);

const TestimonialCard = ({ testimonial }) => {
    return (
        <article className="bg-white border-2 border-neutral-gray-100 rounded-xl p-spacing-xl shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg" aria-label={`Testimonial van ${testimonial.name}`}>
            <header className="flex items-start justify-between gap-spacing-md mb-spacing-lg">
                <div className="flex items-center gap-spacing-md">
                    <InitialsAvatar initials={testimonial.initials} className="w-11 h-11 text-font-size-h5" />
                    <div>
                        <p className="text-font-size-body font-extrabold text-neutral-dark leading-tight">{testimonial.name}</p>
                        <p className="text-font-size-small text-neutral-gray-500">{testimonial.event}</p>
                    </div>
                </div>
                <StarRating rating={testimonial.rating} label={`${testimonial.rating} van 5 sterren`} />
            </header>
            <p className="text-font-size-body text-neutral-gray-700 italic mb-spacing-lg">“{testimonial.quote}”</p>
            <footer className="flex items-center justify-between border-t border-neutral-gray-100 pt-spacing-md text-font-size-small text-neutral-gray-500">
                <time dateTime={testimonial.dateISO}>{testimonial.date}</time>
                <span className="flex items-center gap-1 font-semibold text-primary">
                    <span aria-hidden="true">{testimonial.platform.icon}</span>
                    {testimonial.platform.label}
                </span>
            </footer>
        </article>
    );
};

const StatsSection = () => (
    <section className="bg-neutral-light border-2 border-primary rounded-xl p-spacing-xl grid grid-cols-2 md:grid-cols-4 gap-spacing-lg" aria-label="Service statistieken">
        {statsData.map((stat) => (
            <div key={stat.id} className="relative text-center">
                <VisuallyHidden>{stat.srLabel}</VisuallyHidden>
                {stat.highlight ? (
                    <p className="text-font-size-h4 text-secondary mb-spacing-xs" aria-hidden="true">
                        {stat.highlight}
                    </p>
                ) : null}
                <p className="text-font-size-h2 font-black text-neutral-dark">{stat.value}</p>
                <p className="text-font-size-small font-semibold text-neutral-gray-600 uppercase tracking-wide">
                    {stat.label}
                </p>
            </div>
        ))}
    </section>
);

const FeaturedTestimonial = () => (
    <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-neutral-dark text-white p-spacing-2xl" aria-label={`Uitgelichte testimonial van ${featuredTestimonial.author}`}>
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-b from-secondary/30 to-transparent opacity-50 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 flex flex-col gap-spacing-xl md:flex-row md:items-start md:justify-between">
            <div className="md:max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-spacing-md py-spacing-xs text-font-size-small font-bold text-secondary">
                    {featuredTestimonial.badge}
                </p>
                <p className="mt-spacing-lg text-font-size-h4 font-semibold leading-relaxed italic">
                    “{featuredTestimonial.quote}”
                </p>
                <div className="mt-spacing-xl flex items-center gap-spacing-md">
                    <InitialsAvatar initials={featuredTestimonial.initials} className="w-12 h-12 text-font-size-h4" />
                    <div>
                        <p className="text-font-size-body font-extrabold">{featuredTestimonial.author}</p>
                        <p className="text-font-size-small text-neutral-gray-100">{featuredTestimonial.event}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-spacing-md text-center md:text-right">
                <StarRating rating={featuredTestimonial.rating} label={`${featuredTestimonial.rating} van 5 sterren`} />
                <p className="text-font-size-body font-semibold text-secondary">{featuredTestimonial.ratingText}</p>
                <p className="flex items-center gap-2 rounded-lg bg-white/10 px-spacing-md py-spacing-xs text-font-size-small font-semibold">
                    <span aria-hidden="true">{featuredTestimonial.platform.icon}</span>
                    {featuredTestimonial.platform.label}
                </p>
            </div>
        </div>
    </article>
);

const Testimonials = () => {
    return (
        <section className="py-spacing-3xl bg-neutral-gray-100" aria-labelledby="testimonials-heading">
            <div className="container mx-auto px-spacing-md">
                <div className="mx-auto max-w-3xl text-center mb-spacing-2xl">
                    <h2 id="testimonials-heading" className="text-font-size-h2 text-neutral-dark font-extrabold">
                        Wat Klanten Zeggen
                    </h2>
                    <p className="mt-spacing-sm text-font-size-body text-neutral-gray-600">
                        Sociale bewijskracht met echte verhalen van klanten die vertrouwen en conversie versterken.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-spacing-xl md:grid-cols-2">
                    <div className="md:col-span-2">
                        <FeaturedTestimonial />
                    </div>
                    {testimonialsData.map((testimonial) => (
                        <TestimonialCard key={`${testimonial.name}-${testimonial.date}`} testimonial={testimonial} />
                    ))}
                    <div className="md:col-span-2">
                        <StatsSection />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
