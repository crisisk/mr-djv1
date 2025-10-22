import { useEffect, useState } from "react";

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface AuthorRecord {
  id?: string;
  slug?: string;
  name: string;
  title?: string;
  bio?: string;
  headshotUrl?: string;
  websiteUrl?: string;
  twitterHandle?: string;
  linkedinUrl?: string;
}

export interface AuthorInfoProps {
  authorSlug?: string;
  className?: string;
  title?: string;
  fetcher?: Fetcher;
  endpoint?: string;
}

const defaultFetcher: Fetcher = (input, init) => fetch(input, init);

const buildRequestUrl = (endpoint: string, slug: string) => {
  if (!endpoint) {
    endpoint = "/api/blog/author";
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
    console.error("Failed to construct author endpoint", error);
    return `${endpoint}?slug=${encodeURIComponent(slug)}`;
  }
};

const normalizeAuthor = (record: unknown, fallbackSlug: string): AuthorRecord | null => {
  if (!record || typeof record !== "object") {
    return null;
  }

  const data = record as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name : "Unknown author";

  const headshotUrl =
    typeof data.headshotUrl === "string"
      ? data.headshotUrl
      : typeof data.headshot_url === "string"
        ? data.headshot_url
        : undefined;

  const websiteUrl =
    typeof data.websiteUrl === "string"
      ? data.websiteUrl
      : typeof data.website_url === "string"
        ? data.website_url
        : undefined;

  const twitterHandle =
    typeof data.twitterHandle === "string"
      ? data.twitterHandle
      : typeof data.twitter_handle === "string"
        ? data.twitter_handle
        : undefined;

  const linkedinUrl =
    typeof data.linkedinUrl === "string"
      ? data.linkedinUrl
      : typeof data.linkedin_url === "string"
        ? data.linkedin_url
        : undefined;

  return {
    id: typeof data.id === "string" ? data.id : undefined,
    slug: typeof data.slug === "string" ? data.slug : fallbackSlug,
    name,
    title: typeof data.title === "string" ? data.title : undefined,
    bio: typeof data.bio === "string" ? data.bio : undefined,
    headshotUrl,
    websiteUrl,
    twitterHandle,
    linkedinUrl,
  } satisfies AuthorRecord;
};

const getInitials = (name: string) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || name.slice(0, 2).toUpperCase();
};

export function AuthorInfo({
  authorSlug,
  className,
  title = "About the author",
  fetcher = defaultFetcher,
  endpoint = "/api/blog/author",
}: AuthorInfoProps) {
  const [author, setAuthor] = useState<AuthorRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    if (!authorSlug) {
      setAuthor(null);
      setIsLoading(false);
      setError(null);
      return () => controller.abort();
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetcher(buildRequestUrl(endpoint, authorSlug), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload: unknown = await response.json();
        const record = normalizeAuthor(
          (payload as { author?: unknown })?.author ?? payload,
          authorSlug,
        );

        setAuthor(record);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Unknown error");
        setAuthor(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => controller.abort();
  }, [authorSlug, fetcher, endpoint]);

  return (
    <section className={className} aria-busy={isLoading} aria-live="polite">
      <h3 className="text-font-size-h5 font-semibold text-neutral-dark mb-spacing-sm">{title}</h3>
      {isLoading ? (
        <p className="text-sm text-neutral-medium">Loading author information…</p>
      ) : error ? (
        <p className="text-sm text-error" role="alert">
          Unable to load author details.
        </p>
      ) : !author ? (
        <p className="text-sm text-neutral-medium">No author details available.</p>
      ) : (
        <div className="flex items-start gap-spacing-sm">
          {author.headshotUrl ? (
            <img
              src={author.headshotUrl}
              alt={author.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-light flex items-center justify-center text-lg font-semibold text-neutral-dark flex-shrink-0">
              {getInitials(author.name)}
            </div>
          )}
          <div className="space-y-spacing-xs">
            <div>
              <p className="text-base font-semibold text-neutral-dark">{author.name}</p>
              {author.title ? <p className="text-sm text-neutral-medium">{author.title}</p> : null}
            </div>
            {author.bio ? (
              <p className="text-sm leading-relaxed text-neutral-dark">{author.bio}</p>
            ) : null}
            <div className="flex flex-wrap gap-spacing-xs text-sm">
              {author.websiteUrl ? (
                <a
                  className="text-secondary hover:underline"
                  href={author.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              ) : null}
              {author.linkedinUrl ? (
                <a
                  className="text-secondary hover:underline"
                  href={author.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              ) : null}
              {author.twitterHandle ? (
                <a
                  className="text-secondary hover:underline"
                  href={
                    author.twitterHandle.startsWith("http")
                      ? author.twitterHandle
                      : `https://twitter.com/${author.twitterHandle.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Twitter
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AuthorInfo;
