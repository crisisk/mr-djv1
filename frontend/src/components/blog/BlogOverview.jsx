import React, { useMemo } from "react";
import BlogListItem from "./BlogListItem";
import styles from "./BlogOverview.module.css";
import { useCmsBlogPosts } from "../../hooks/useCmsBlogPosts";

const buildKeyForPost = (post, index) => {
  if (!post) return `post-${index}`;
  return (
    post.id ??
    post.slug ??
    post.uuid ??
    post._id ??
    (typeof post.title === "string"
      ? `post-${post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
      : `post-${index}`)
  );
};

const BlogOverview = ({
  posts: postsProp,
  initialPage = 1,
  pageSize = 6,
  cmsEndpoint,
  title = "Templates: Blog & Nieuws",
  subtitle = "Blijf op de hoogte van de nieuwste tips, trends en verhalen uit de Mr. DJ community.",
}) => {
  const shouldFetch = !Array.isArray(postsProp);
  const { posts, isLoading, error, pagination, page, goToPage, refetch } = useCmsBlogPosts({
    initialPage,
    pageSize,
    endpoint: cmsEndpoint,
    enabled: shouldFetch,
    initialData: shouldFetch ? undefined : postsProp,
  });

  const displayPosts = useMemo(() => {
    if (Array.isArray(postsProp)) return postsProp;
    return posts;
  }, [postsProp, posts]);

  const pageCount = pagination?.pageCount ?? 1;
  const totalItems = pagination?.total;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </header>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.state}>
            <p>We laden de nieuwste blogartikelen voor je...</p>
          </div>
        ) : error ? (
          <div className={styles.state}>
            <p className={styles.errorMessage}>Het ophalen van blogartikelen is mislukt.</p>
            <button type="button" className={styles.retryButton} onClick={refetch}>
              Probeer opnieuw
            </button>
          </div>
        ) : !displayPosts || displayPosts.length === 0 ? (
          <div className={styles.state}>
            <p>Er zijn nog geen blogartikelen beschikbaar.</p>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {displayPosts.map((post, index) => (
                <BlogListItem key={buildKeyForPost(post, index)} post={post} />
              ))}
            </div>

            {pageCount > 1 ? (
              <footer className={styles.pagination}>
                <div className={styles.paginationControls}>
                  <button
                    type="button"
                    className={styles.paginationButton}
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1 || isLoading}
                  >
                    Vorige
                  </button>
                  <button
                    type="button"
                    className={styles.paginationButton}
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= pageCount || isLoading}
                  >
                    Volgende
                  </button>
                </div>

                <div className={styles.paginationInfo}>
                  Pagina {page} van {pageCount}
                  {typeof totalItems === "number" ? ` • ${totalItems} artikelen` : ""}
                </div>
              </footer>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogOverview;
