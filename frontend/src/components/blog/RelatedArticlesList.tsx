import { useEffect, useMemo, useState } from "react";

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface RelatedArticleSummary {
  slug: string;
  title: string;
  excerpt?: string;
  url?: string;
}

export interface RelatedArticlesListProps {
  /** The slug of the article for which recommendations should be loaded. */
  slug?: string;
  /** Optional class name passed to the root element. */
  className?: string;
  /** Custom heading displayed above the list. */
  title?: string;
  /** Limit the number of rendered related articles. */
  limit?: number;
  /**
   * Custom fetch implementation, useful for dependency injection in tests.
   * Defaults to the global `fetch` implementation provided by the runtime.
   */
  fetcher?: Fetcher;
  /**
   * Override the API endpoint that should be queried. When omitted the component
   * will fall back to `/api/blog/related`.
   */
  endpoint?: string;
}

const defaultFetcher: Fetcher = (input, init) => fetch(input, init);

const buildRequestUrl = (endpoint: string, slug: string) => {
  if (!endpoint) {
    endpoint = "/api/blog/related";
  }

  try {
    const base = endpoint.includes("://")
      ? endpoint
      : new URL(
          endpoint,
          typeof window === "undefined" ? "http://localhost" : window.location.origin,
        ).toString();
    const url = new URL(base);
    url.searchParams.set("slug", slug);
    return url.toString();
  } catch (error) {
    console.error("Failed to construct related articles endpoint", error);
    return `${endpoint}?slug=${encodeURIComponent(slug)}`;
  }
};

export function RelatedArticlesList({
  slug,
  className,
  title = "Related articles",
  limit,
  fetcher = defaultFetcher,
  endpoint = "/api/blog/related",
}: RelatedArticlesListProps) {
  const [articles, setArticles] = useState<RelatedArticleSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (!slug) {
      setArticles([]);
      setIsLoading(false);
      setError(null);
      return () => controller.abort();
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetcher(buildRequestUrl(endpoint, slug), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const items: RelatedArticleSummary[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
            ? payload.items
            : [];

        const normalized = items
          .filter((item) => Boolean(item?.slug) && Boolean(item?.title))
          .map((item) => ({
            slug: item.slug,
            title: item.title,
            excerpt: item.excerpt,
            url: item.url ?? `/blog/${item.slug}`,
          }));

        setArticles(normalized);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Unknown error");
        setArticles([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, [slug, fetcher, endpoint]);

  const articlesToRender = useMemo(() => {
    if (typeof limit === "number" && limit > 0) {
      return articles.slice(0, limit);
    }

    return articles;
  }, [articles, limit]);

  return (
    <section className={className} aria-busy={isLoading} aria-live="polite">
      <h3 className="text-font-size-h5 font-semibold text-neutral-dark mb-spacing-sm">{title}</h3>
      {isLoading ? (
        <p className="text-sm text-neutral-medium">Loading related articles…</p>
      ) : error ? (
        <p className="text-sm text-error" role="alert">
          Unable to load related articles.
        </p>
      ) : articlesToRender.length === 0 ? (
        <p className="text-sm text-neutral-medium">No related articles available.</p>
      ) : (
        <ul className="space-y-spacing-xs">
          {articlesToRender.map((article) => (
            <li key={article.slug}>
              <a
                href={article.url ?? `/blog/${article.slug}`}
                className="text-secondary hover:underline"
              >
                {article.title}
              </a>
              {article.excerpt ? (
                <p className="text-xs text-neutral-medium mt-1">{article.excerpt}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RelatedArticlesList;
