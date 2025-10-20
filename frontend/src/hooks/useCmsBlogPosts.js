import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/apiClient'

const DEFAULT_ENDPOINT = import.meta.env.VITE_CMS_BLOG_ENDPOINT ?? '/api/cms/blog/posts'

const ensureValue = (value, fallback) => {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'string' && value.trim().length === 0) return fallback
  return value
}

const createPagination = (page, pageSize, total) => {
  const safePageSize = pageSize && Number.isFinite(pageSize) ? Math.max(1, Number(pageSize)) : 1
  const safeTotal = Number.isFinite(total) ? Math.max(0, Number(total)) : 0
  const safePage = page && Number.isFinite(page) ? Math.max(1, Number(page)) : 1
  const pageCount = safePageSize > 0 ? Math.max(1, Math.ceil(safeTotal / safePageSize)) : 1

  return {
    page: safePage,
    pageSize: safePageSize,
    total: safeTotal,
    pageCount,
  }
}

const toArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  return []
}

const extractEdges = (value) => {
  if (!value || !Array.isArray(value)) return []
  return value
    .map((edge) => {
      if (edge && typeof edge === 'object' && 'node' in edge) {
        return edge.node
      }
      return edge
    })
    .filter(Boolean)
}

const extractPosts = (response) => {
  if (!response) return []
  if (Array.isArray(response)) return response

  if (response?.errors && Array.isArray(response.errors) && response.errors.length > 0) {
    const message = response.errors.map((error) => error?.message).filter(Boolean).join(', ')
    throw new Error(message || 'CMS responded with an error')
  }

  if (Array.isArray(response.posts)) return response.posts
  if (Array.isArray(response.data)) return response.data
  if (Array.isArray(response.items)) return response.items
  if (Array.isArray(response.results)) return response.results
  if (Array.isArray(response.nodes)) return response.nodes

  if (response.data?.posts) {
    if (Array.isArray(response.data.posts)) return response.data.posts
    if (Array.isArray(response.data.posts.data)) return response.data.posts.data
    if (Array.isArray(response.data.posts.items)) return response.data.posts.items
    if (Array.isArray(response.data.posts.nodes)) return response.data.posts.nodes
    if (Array.isArray(response.data.posts.edges)) return extractEdges(response.data.posts.edges)
  }

  if (response.data?.blogPosts) {
    if (Array.isArray(response.data.blogPosts)) return response.data.blogPosts
    if (Array.isArray(response.data.blogPosts.data)) return response.data.blogPosts.data
    if (Array.isArray(response.data.blogPosts.nodes)) return response.data.blogPosts.nodes
    if (Array.isArray(response.data.blogPosts.edges)) return extractEdges(response.data.blogPosts.edges)
  }

  if (Array.isArray(response.edges)) {
    return extractEdges(response.edges)
  }

  return []
}

const extractPagination = (response) => {
  if (!response || typeof response !== 'object') return null
  if (response.pagination && typeof response.pagination === 'object') return response.pagination
  if (response.meta?.pagination && typeof response.meta.pagination === 'object') return response.meta.pagination
  if (response.data?.pagination && typeof response.data.pagination === 'object') return response.data.pagination
  if (response.data?.posts?.meta?.pagination && typeof response.data.posts.meta.pagination === 'object') {
    return response.data.posts.meta.pagination
  }
  if (response.data?.posts?.pagination && typeof response.data.posts.pagination === 'object') {
    return response.data.posts.pagination
  }
  if (response.data?.blogPosts?.meta?.pagination && typeof response.data.blogPosts.meta.pagination === 'object') {
    return response.data.blogPosts.meta.pagination
  }
  if (response.data?.blogPosts?.pagination && typeof response.data.blogPosts.pagination === 'object') {
    return response.data.blogPosts.pagination
  }
  return null
}

const resolveThumbnailUrl = (post) => {
  if (!post || typeof post !== 'object') return null
  const candidates = [
    post.thumbnailUrl,
    post.thumbnail,
    post.image,
    post.featuredImage,
    post.featured_image,
    post.coverImage,
    post.cover_image,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate
    }
    if (candidate && typeof candidate === 'object') {
      if (typeof candidate.url === 'string' && candidate.url.trim().length > 0) {
        return candidate.url
      }
      if (typeof candidate.src === 'string' && candidate.src.trim().length > 0) {
        return candidate.src
      }
    }
  }

  return null
}

const resolveAuthor = (post) => {
  if (!post || typeof post !== 'object') return null

  if (typeof post.authorName === 'string' && post.authorName.trim().length > 0) {
    return post.authorName
  }

  if (typeof post.author === 'string' && post.author.trim().length > 0) {
    return post.author
  }

  if (post.author && typeof post.author === 'object') {
    if (typeof post.author.name === 'string' && post.author.name.trim().length > 0) {
      return post.author.name
    }
  }

  if (Array.isArray(post.authors) && post.authors.length > 0) {
    const first = post.authors[0]
    if (typeof first === 'string' && first.trim().length > 0) {
      return first
    }
    if (first && typeof first.name === 'string' && first.name.trim().length > 0) {
      return first.name
    }
  }

  return null
}

const resolveCategoryName = (post) => {
  if (!post || typeof post !== 'object') return null

  if (typeof post.categoryName === 'string') {
    return post.categoryName
  }

  if (typeof post.category === 'string') {
    return post.category
  }

  if (post.category && typeof post.category === 'object' && typeof post.category.name === 'string') {
    return post.category.name
  }

  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const first = post.categories[0]
    if (typeof first === 'string') return first
    if (first && typeof first.name === 'string') return first.name
  }

  return null
}

const resolveReadingTime = (post) => {
  if (!post || typeof post !== 'object') return null

  const candidates = [post.readingTime, post.read_time, post.meta?.readingTime, post.meta?.readTime]
  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) {
      return Math.max(1, Math.round(candidate))
    }
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate
    }
  }
  return null
}

const resolvePublishedAt = (post) => {
  if (!post || typeof post !== 'object') return null
  return (
    post.publishedAt ??
    post.published_at ??
    post.date ??
    post.created_at ??
    post.createdAt ??
    null
  )
}

const createFallbackIdentifier = (post) => {
  if (!post) return undefined
  const slugCandidate = post.slug ?? post.permalink ?? post.path
  if (typeof slugCandidate === 'string' && slugCandidate.trim().length > 0) {
    return slugCandidate
  }

  const titleCandidate = post.title ?? post.name ?? post.heading
  if (typeof titleCandidate === 'string' && titleCandidate.trim().length > 0) {
    return titleCandidate.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  return undefined
}

const normalisePostSummary = (post) => {
  if (!post || typeof post !== 'object') return post

  const thumbnailUrl = resolveThumbnailUrl(post)
  const authorName = resolveAuthor(post)
  const categoryName = resolveCategoryName(post)
  const readingTime = resolveReadingTime(post)
  const publishedAt = resolvePublishedAt(post)
  const fallbackId = createFallbackIdentifier(post)

  return {
    ...post,
    id: ensureValue(post.id, ensureValue(post.uuid, ensureValue(post._id, fallbackId))),
    slug: ensureValue(
      post.slug,
      ensureValue(post.permalink, ensureValue(post.path, undefined))
    ),
    title: ensureValue(post.title, ensureValue(post.name, ensureValue(post.heading, 'Ongetiteld artikel'))),
    excerpt: ensureValue(post.excerpt, ensureValue(post.summary, ensureValue(post.description, post.teaser ?? ''))),
    thumbnailUrl: ensureValue(post.thumbnailUrl, thumbnailUrl),
    authorName: ensureValue(post.authorName, authorName),
    categoryName: ensureValue(post.categoryName, categoryName),
    readingTime: ensureValue(post.readingTime, readingTime),
    publishedAt: ensureValue(post.publishedAt, publishedAt),
  }
}

export const useCmsBlogPosts = ({
  initialPage = 1,
  pageSize = 6,
  endpoint = DEFAULT_ENDPOINT,
  enabled = true,
  initialData = [],
} = {}) => {
  const [page, setPage] = useState(initialPage)
  const [posts, setPosts] = useState(() => toArray(initialData))
  const [pagination, setPagination] = useState(() =>
    createPagination(initialPage, pageSize, Array.isArray(initialData) ? initialData.length : 0)
  )
  const [isLoading, setIsLoading] = useState(Boolean(enabled))
  const [error, setError] = useState(null)
  const [refreshIndex, setRefreshIndex] = useState(0)

  const resolvedEndpoint = endpoint || DEFAULT_ENDPOINT

  const fetchPosts = useCallback(
    async (targetPage, signal) => {
      const params = new URLSearchParams({
        page: String(targetPage),
        pageSize: String(pageSize),
      })

      let requestUrl = resolvedEndpoint
      if (requestUrl.includes('{page}')) {
        requestUrl = requestUrl
          .replace('{page}', String(targetPage))
          .replace('{pageSize}', String(pageSize))
      } else if (requestUrl) {
        const separator = requestUrl.includes('?') ? '&' : '?'
        requestUrl = `${requestUrl}${separator}${params.toString()}`
      }

      const response = await apiFetch(requestUrl, {
        signal,
      })

      const normalisedPosts = extractPosts(response).map(normalisePostSummary)
      const paginationInfo = extractPagination(response)
      const resolvedPagination = paginationInfo
        ? createPagination(
            ensureValue(paginationInfo.page, targetPage),
            ensureValue(paginationInfo.pageSize, pageSize),
            ensureValue(paginationInfo.total, normalisedPosts.length)
          )
        : createPagination(targetPage, pageSize, ensureValue(response?.total, normalisedPosts.length))

      return { posts: normalisedPosts, pagination: resolvedPagination }
    },
    [pageSize, resolvedEndpoint]
  )

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      setError(null)
      return undefined
    }

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetchPosts(page, controller.signal)
      .then(({ posts: newPosts, pagination: newPagination }) => {
        if (controller.signal.aborted) return
        setPosts(newPosts)
        setPagination(newPagination)
        setIsLoading(false)
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return
        const normalisedError =
          fetchError instanceof Error ? fetchError : new Error('Onbekende fout bij het laden van blogartikelen')
        setError(normalisedError)
        setIsLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [enabled, fetchPosts, page, refreshIndex])

  useEffect(() => {
    if (!enabled) return
    setPage(initialPage)
  }, [enabled, initialPage])

  const goToPage = useCallback((nextPage) => {
    setPage((currentPage) => {
      const target = Math.max(1, Number.isFinite(nextPage) ? Math.round(nextPage) : 1)
      if (target === currentPage) return currentPage
      return target
    })
  }, [])

  const refetch = useCallback(() => {
    if (!enabled) return
    setRefreshIndex((index) => index + 1)
  }, [enabled])

  const value = useMemo(
    () => ({
      posts,
      pagination,
      page,
      pageSize,
      isLoading,
      error,
      goToPage,
      setPage: goToPage,
      refetch,
    }),
    [posts, pagination, page, pageSize, isLoading, error, goToPage, refetch]
  )

  return value
}
