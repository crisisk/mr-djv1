import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '../../lib/apiClient'

type Nullable<T> = T | null | undefined

type CmsImage = {
  url?: Nullable<string>
  alt?: Nullable<string>
}

type CmsAuthor = {
  name?: Nullable<string>
  role?: Nullable<string>
  avatar?: Nullable<CmsImage>
}

type CmsContentSection = {
  id?: Nullable<string>
  heading?: Nullable<string>
  title?: Nullable<string>
  body?: Nullable<string>
  content?: Nullable<string>
}

type CmsArticle = {
  slug?: Nullable<string>
  title?: Nullable<string>
  headline?: Nullable<string>
  subtitle?: Nullable<string>
  summary?: Nullable<string>
  description?: Nullable<string>
  heroImage?: Nullable<CmsImage>
  featuredImage?: Nullable<CmsImage>
  image?: Nullable<CmsImage>
  author?: Nullable<CmsAuthor>
  publishedAt?: Nullable<string>
  updatedAt?: Nullable<string>
  readTimeMinutes?: Nullable<number>
  readTime?: Nullable<string | number>
  body?: Nullable<string>
  bodyHtml?: Nullable<string>
  contentHtml?: Nullable<string>
  sections?: Nullable<CmsContentSection[]>
}

type CmsCtaButton = {
  label?: Nullable<string>
  text?: Nullable<string>
  href?: Nullable<string>
  url?: Nullable<string>
}

type CmsCta = {
  heading?: Nullable<string>
  title?: Nullable<string>
  body?: Nullable<string>
  description?: Nullable<string>
  copy?: Nullable<string>
  primaryButton?: Nullable<CmsCtaButton>
  primaryCta?: Nullable<CmsCtaButton>
  secondaryButton?: Nullable<CmsCtaButton>
  secondaryCta?: Nullable<CmsCtaButton>
}

type CmsMetadata = {
  metaTitle?: Nullable<string>
  metaDescription?: Nullable<string>
  structuredData?: Nullable<Record<string, unknown>>
}

type ArticleApiResponse = {
  article?: Nullable<CmsArticle>
  cta?: Nullable<CmsCta>
  metadata?: Nullable<CmsMetadata>
}

type ArticleHeaderData = {
  title: string
  subtitle?: string
  authorName: string
  authorRole?: string
  heroImage?: string
  heroImageAlt: string
  publishedAt?: string
  readingTime?: string
}

type ArticleContentData = {
  html?: string
  sections?: Array<{
    id?: string
    heading?: string
    body?: string
  }>
  fallbackText: string
}

type ArticleCtaData = {
  heading: string
  body: string
  primaryButton: { label: string; href: string }
  secondaryButton?: { label: string; href: string }
}

type ArticleMetadata = {
  metaTitle: string
  metaDescription: string
  structuredData?: Record<string, unknown>
}

type ArticleState = {
  header: ArticleHeaderData
  content: ArticleContentData
  cta: ArticleCtaData
  metadata: ArticleMetadata
}

const DEFAULT_AUTHOR = 'Team Mister DJ'
const DEFAULT_CTA: ArticleCtaData = {
  heading: 'Plan direct jullie perfecte feest',
  body: 'Vertel ons meer over jullie event en ontvang binnen 24 uur een voorstel op maat.',
  primaryButton: {
    label: 'Plan een kennismaking',
    href: '/contact',
  },
  secondaryButton: {
    label: 'Ontdek onze pakketten',
    href: '/#pakketten',
  },
}

const DEFAULT_CONTENT_FALLBACK = 'De inhoud van dit artikel wordt binnenkort aangevuld. Houd deze pagina in de gaten voor updates.'

const getSiteBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '')
  }

  return 'https://staging.sevensa.nl'
}

const normaliseImage = (image?: Nullable<CmsImage>): { url?: string; alt?: string } => {
  if (!image) {
    return {}
  }

  const url = image?.url ?? (typeof image === 'string' ? image : undefined)

  if (!url) {
    return {}
  }

  return {
    url,
    alt: image?.alt ?? 'Artikel afbeelding',
  }
}

const formatDate = (value?: Nullable<string>): string | undefined => {
  if (!value) {
    return undefined
  }

  try {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return undefined
    }

    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch (error) {
    console.warn('Failed to format article date', error)
    return undefined
  }
}

const normaliseReadingTime = (value?: Nullable<string | number>): string | undefined => {
  if (typeof value === 'number') {
    if (Number.isFinite(value) && value > 0) {
      return `${Math.round(value)} min leestijd`
    }
    return undefined
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) {
      return undefined
    }

    return /min/i.test(trimmed) ? trimmed : `${trimmed} min leestijd`
  }

  return undefined
}

const resolveCtaButton = (
  button?: Nullable<CmsCtaButton>,
  fallback?: { label: string; href: string }
): { label: string; href: string } | undefined => {
  if (!button) {
    return fallback
  }

  const label = button.label ?? button.text ?? fallback?.label
  const href = button.href ?? button.url ?? fallback?.href ?? '#'

  if (!label) {
    return fallback
  }

  return { label, href }
}

const createDefaultStructuredData = (
  header: ArticleHeaderData,
  slug: string,
  metadata: ArticleMetadata
): Record<string, unknown> => {
  const baseUrl = getSiteBaseUrl()
  const canonical = `${baseUrl}/blog/${slug}`

  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: header.title,
    description: metadata.metaDescription || header.subtitle,
    author: {
      '@type': 'Person',
      name: header.authorName,
    },
    mainEntityOfPage: canonical,
  }

  if (header.heroImage) {
    structuredData.image = header.heroImage
  }

  if (header.publishedAt) {
    structuredData.datePublished = header.publishedAt
  }

  return structuredData
}

const mapApiResponseToState = (
  response: ArticleApiResponse,
  slug: string
): ArticleState => {
  const article = response.article ?? {}
  const headerImage =
    normaliseImage(article.heroImage ?? article.featuredImage ?? article.image)
  const author = article.author ?? {}

  const header: ArticleHeaderData = {
    title:
      article.title ??
      article.headline ??
      'Artikel zonder titel',
    subtitle: article.subtitle ?? article.summary ?? article.description ?? undefined,
    authorName: author.name ?? DEFAULT_AUTHOR,
    authorRole: author.role ?? undefined,
    heroImage: headerImage.url,
    heroImageAlt: headerImage.alt ?? 'Artikel afbeelding',
    publishedAt: formatDate(article.publishedAt ?? article.updatedAt ?? undefined),
    readingTime: normaliseReadingTime(article.readTime ?? article.readTimeMinutes ?? undefined),
  }

  const html = article.contentHtml ?? article.bodyHtml ?? article.body ?? undefined

  const sections = Array.isArray(article.sections)
    ? article.sections
        .map((section) => ({
          id: section?.id ?? undefined,
          heading: section?.heading ?? section?.title ?? undefined,
          body: section?.body ?? section?.content ?? undefined,
        }))
        .filter((section) => section.heading || section.body)
    : undefined

  const content: ArticleContentData = {
    html,
    sections,
    fallbackText: DEFAULT_CONTENT_FALLBACK,
  }

  const ctaSource = response.cta ?? {}

  const primaryButton =
    resolveCtaButton(ctaSource.primaryButton ?? ctaSource.primaryCta, DEFAULT_CTA.primaryButton) ?? DEFAULT_CTA.primaryButton

  const secondaryButton = resolveCtaButton(
    ctaSource.secondaryButton ?? ctaSource.secondaryCta,
    DEFAULT_CTA.secondaryButton
  )

  const cta: ArticleCtaData = {
    heading: ctaSource.heading ?? ctaSource.title ?? DEFAULT_CTA.heading,
    body: ctaSource.body ?? ctaSource.description ?? ctaSource.copy ?? DEFAULT_CTA.body,
    primaryButton,
    secondaryButton,
  }

  const metadataSource = response.metadata ?? {}

  const metadata: ArticleMetadata = {
    metaTitle: metadataSource.metaTitle ?? header.title,
    metaDescription:
      metadataSource.metaDescription ??
      header.subtitle ??
      'Lees het laatste nieuws en inspiratie van Mister DJ.',
    structuredData:
      metadataSource.structuredData ?? createDefaultStructuredData(header, slug, {
        metaTitle: metadataSource.metaTitle ?? header.title,
        metaDescription:
          metadataSource.metaDescription ??
          header.subtitle ??
          'Lees het laatste nieuws en inspiratie van Mister DJ.',
        structuredData: undefined,
      }),
  }

  return {
    header,
    content,
    cta,
    metadata,
  }
}

const ArticleHeader = ({
  title,
  subtitle,
  authorName,
  authorRole,
  heroImage,
  heroImageAlt,
  publishedAt,
  readingTime,
}: ArticleHeaderData) => (
  <header className="article-header">
    <p className="article-breadcrumb">Blog</p>
    <h1>{title}</h1>
    {subtitle ? <p className="article-subtitle">{subtitle}</p> : null}
    <div className="article-meta">
      <span className="article-author">
        {authorName}
        {authorRole ? <span className="article-author-role"> · {authorRole}</span> : null}
      </span>
      {publishedAt ? <span className="article-published">{publishedAt}</span> : null}
      {readingTime ? <span className="article-reading-time">{readingTime}</span> : null}
    </div>
    {heroImage ? (
      <div className="article-hero">
        <img src={heroImage} alt={heroImageAlt} loading="lazy" />
      </div>
    ) : null}
  </header>
)

const ArticleContent = ({ html, sections, fallbackText }: ArticleContentData) => {
  if (html) {
    return (
      <section
        className="article-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  if (sections?.length) {
    return (
      <section className="article-content">
        {sections.map((section) => (
          <article key={section.id ?? section.heading} className="article-section">
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.body ? <p>{section.body}</p> : null}
          </article>
        ))}
      </section>
    )
  }

  return (
    <section className="article-content">
      <p>{fallbackText}</p>
    </section>
  )
}

const CTABox = ({ heading, body, primaryButton, secondaryButton }: ArticleCtaData) => (
  <aside className="article-cta">
    <div className="article-cta-content">
      <h2>{heading}</h2>
      <p>{body}</p>
      <div className="article-cta-actions">
        <a className="article-cta-primary" href={primaryButton.href}>
          {primaryButton.label}
        </a>
        {secondaryButton ? (
          <a className="article-cta-secondary" href={secondaryButton.href}>
            {secondaryButton.label}
          </a>
        ) : null}
      </div>
    </div>
  </aside>
)

const INITIAL_STATE: ArticleState = {
  header: {
    title: 'Artikel wordt geladen…',
    subtitle: undefined,
    authorName: DEFAULT_AUTHOR,
    heroImageAlt: 'Artikel afbeelding',
  },
  content: {
    fallbackText: DEFAULT_CONTENT_FALLBACK,
  },
  cta: DEFAULT_CTA,
  metadata: {
    metaTitle: 'Artikel | Mister DJ',
    metaDescription: 'Lees het laatste nieuws en inspiratie van Mister DJ.',
  },
}

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<ArticleState>(INITIAL_STATE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const controller = new AbortController()

    const loadArticle = async () => {
      if (!slug) {
        setError('Geen geldig artikel gevonden.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const data = await apiClient.get<ArticleApiResponse>(`/cms/articles/${slug}`, {
          signal: controller.signal,
        })

        if (!isActive) {
          return
        }

        const mapped = mapApiResponseToState(data ?? {}, slug)
        setState(mapped)
      } catch (fetchError) {
        if (!isActive) {
          return
        }

        console.error('Kon artikel niet ophalen', fetchError)
        setError('We konden dit artikel niet laden. Probeer het later opnieuw.')
        setState(mapApiResponseToState({}, slug))
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadArticle()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [slug])

  useEffect(() => {
    if (state.metadata.metaTitle && typeof document !== 'undefined') {
      document.title = state.metadata.metaTitle
    }
  }, [state.metadata.metaTitle])

  const structuredDataJson = useMemo(() => {
    if (!state.metadata.structuredData) {
      return null
    }

    try {
      return JSON.stringify(state.metadata.structuredData, null, 2)
    } catch (error) {
      console.warn('Kon structured data niet serialiseren', error)
      return null
    }
  }, [state.metadata.structuredData])

  if (isLoading) {
    return (
      <main className="article-page" aria-busy="true">
        <p>Artikel wordt geladen…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="article-page" role="alert">
        <h1>Er ging iets mis</h1>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main className="article-page">
      <ArticleHeader {...state.header} />
      <ArticleContent {...state.content} />
      <CTABox {...state.cta} />
      {structuredDataJson ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredDataJson }} />
      ) : null}
    </main>
  )
}

export default ArticlePage
