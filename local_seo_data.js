// mr-djv1/mr-dj-eds-components/src/data/local_seo_data.js

export const DEFAULT_LOCAL_SEO_LOCALE = 'nl-NL';
export const DEFAULT_LOCAL_SEO_SLUG = 'eindhoven';

export const localSeoData = [
    {
        city: "Eindhoven",
        province: "Noord-Brabant",
        slug: "eindhoven",
        locales: ["nl-NL"],
        localUSP: "Dé beste DJ voor uw feest in Eindhoven en omgeving. Bekend met alle top-locaties zoals het Evoluon en de Effenaar.",
        localReviews: "Fantastische service in Eindhoven! De gasten waren laaiend enthousiast.",
        localVenues: ["Evoluon", "Effenaar", "Strijp-S", "Klokgebouw"],
        seoTitle: "DJ Huren in Eindhoven | De Beste Feest DJ voor uw Event",
        seoDescription: "Zoek niet verder! Huur de beste DJ van Eindhoven voor uw bruiloft, bedrijfsfeest of verjaardag. Bekend met alle locaties.",
        isDefault: true,
    },
    {
        city: "Maastricht",
        province: "Limburg",
        slug: "maastricht",
        locales: ["nl-NL"],
        localUSP: "Uw specialist in sfeervolle feesten in het hart van Limburg. Van het Vrijthof tot de Maas, wij kennen de Limburgse gezelligheid.",
        localReviews: "Onze bruiloft in Maastricht was onvergetelijk dankzij de perfecte muziekkeuze!",
        localVenues: ["Kasteel Vaeshartelt", "Bonnefanten Museum", "Theater aan het Vrijthof"],
        seoTitle: "DJ Huren in Maastricht | Sfeervolle Muziek voor uw Limburgse Feest",
        seoDescription: "Huur een professionele DJ in Maastricht voor een onvergetelijke avond. Wij zorgen voor de perfecte Limburgse sfeer.",
    },
    {
        city: "Tilburg",
        province: "Noord-Brabant",
        slug: "tilburg",
        locales: ["nl-NL"],
        localUSP: "De DJ die de Tilburgse kermismentaliteit naar uw feest brengt. Van de Piushaven tot de Spoorzone, wij maken er een knalfeest van.",
        localReviews: "Wat een feest in Tilburg! De dansvloer was geen moment leeg.",
        localVenues: ["De Koepelhal", "TextielMuseum", "Poppodium 013"],
        seoTitle: "DJ Huren in Tilburg | Knalfeest Garantie voor uw Event",
        seoDescription: "Zoekt u een DJ in Tilburg? Wij garanderen een onvergetelijk feest op elke locatie in en rondom Tilburg.",
    },
    {
        city: "Breda",
        province: "Noord-Brabant",
        slug: "breda",
        locales: ["nl-NL"],
        localUSP: "Stijlvolle en energieke DJ-sets voor de bourgondische feesten in Breda. Van de Grote Markt tot het Mastbos, wij zijn uw muzikale partner.",
        localReviews: "Zeer professioneel en een geweldige sfeer neergezet in Breda.",
        localVenues: ["Kasteel Bouvigne", "Breepark", "Chassé Theater"],
        seoTitle: "DJ Huren in Breda | Stijlvolle Muziek voor de Bourgondische Feester",
        seoDescription: "Huur een professionele DJ in Breda voor uw bruiloft of bedrijfsfeest. Wij leveren maatwerk voor een onvergetelijke avond.",
    },
    {
        city: "Venlo",
        province: "Limburg",
        slug: "venlo",
        locales: ["nl-NL"],
        localUSP: "De perfecte mix van Limburgse gezelligheid en internationale hits voor uw feest in Venlo. Wij kennen de lokale smaak.",
        localReviews: "Fantastische avond gehad in Venlo! De DJ wist precies wat het publiek wilde.",
        localVenues: ["De Maaspoort", "Grenswerk", "Kasteel Arcen"],
        seoTitle: "DJ Huren in Venlo | De Beste Feest DJ voor uw Limburgse Event",
        seoDescription: "Zoek een DJ in Venlo die uw feest naar een hoger niveau tilt. Van bruiloft tot bedrijfsfeest, wij regelen de muziek.",
    },
];

// Function to find data by slug, useful for routing
export const getLocalSeoDataBySlug = (slug) => {
    if (!slug) {
        return undefined;
    }

    const normalizedSlug = slug.toLowerCase();
    return localSeoData.find(data => data.slug.toLowerCase() === normalizedSlug);
};

const normalize = (value) => (typeof value === 'string' ? value.toLowerCase() : undefined);

const getDefaultEntry = () =>
    localSeoData.find((entry) => entry.isDefault) || getLocalSeoDataBySlug(DEFAULT_LOCAL_SEO_SLUG) || localSeoData[0];

const entrySupportsLocale = (entry, locale) => {
    if (!locale) {
        return false;
    }

    return Array.isArray(entry.locales)
        ? entry.locales.map(normalize).includes(locale)
        : false;
};

const findByLocale = (locale) => {
    const normalizedLocale = normalize(locale);
    if (!normalizedLocale) {
        return [];
    }

    return localSeoData.filter((entry) => entrySupportsLocale(entry, normalizedLocale));
};

const pickBySlug = (entries, slug) => {
    if (!slug || !entries?.length) {
        return undefined;
    }

    const normalizedSlug = normalize(slug);
    return entries.find((entry) => normalize(entry.slug) === normalizedSlug);
};

export const selectLocalSeoContent = ({
    locale,
    fallbackLocale = DEFAULT_LOCAL_SEO_LOCALE,
    citySlug,
} = {}) => {
    const normalizedLocale = normalize(locale);
    const normalizedFallbackLocale = normalize(fallbackLocale);
    const normalizedSlug = normalize(citySlug);

    const primaryMatches = findByLocale(normalizedLocale);
    const fallbackMatches =
        normalizedFallbackLocale && normalizedFallbackLocale !== normalizedLocale
            ? findByLocale(normalizedFallbackLocale)
            : [];

    return (
        pickBySlug(primaryMatches, normalizedSlug) ||
        primaryMatches[0] ||
        pickBySlug(fallbackMatches, normalizedSlug) ||
        fallbackMatches[0] ||
        pickBySlug(localSeoData, normalizedSlug) ||
        getDefaultEntry()
    );
};

