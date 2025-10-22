import React from "react";
import styles from "./BlogListItem.module.css";

const formatDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const resolvePostUrl = (post) => {
  if (!post) return "#";
  if (typeof post.url === "string" && post.url.length > 0) {
    return post.url;
  }
  if (typeof post.href === "string" && post.href.length > 0) {
    return post.href;
  }
  if (typeof post.slug === "string" && post.slug.length > 0) {
    return post.slug.startsWith("/") ? post.slug : `/blog/${post.slug}`;
  }
  if (typeof post.permalink === "string" && post.permalink.length > 0) {
    return post.permalink;
  }
  if (typeof post.path === "string" && post.path.length > 0) {
    return post.path;
  }
  return "#";
};

const resolveReadingTime = (value) => {
  if (!value && value !== 0) return null;
  if (typeof value === "number") {
    return `${Math.max(1, Math.round(value))} min`;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  return null;
};

const resolveCategory = (post) => {
  if (!post) return null;
  const { category, categories, categoryName } = post;
  if (typeof categoryName === "string") {
    return categoryName;
  }
  if (typeof category === "string") {
    return category;
  }
  if (category && typeof category === "object" && typeof category.name === "string") {
    return category.name;
  }
  if (Array.isArray(categories) && categories.length > 0) {
    const first = categories[0];
    if (typeof first === "string") return first;
    if (first && typeof first.name === "string") return first.name;
  }
  return null;
};

const resolveAuthorName = (post) => {
  if (!post) return null;
  if (typeof post.authorName === "string" && post.authorName.trim()) {
    return post.authorName;
  }
  if (typeof post.author === "string" && post.author.trim()) {
    return post.author;
  }
  if (post.author && typeof post.author === "object") {
    if (typeof post.author.name === "string" && post.author.name.trim()) {
      return post.author.name;
    }
  }
  if (Array.isArray(post.authors) && post.authors.length > 0) {
    const first = post.authors[0];
    if (typeof first === "string" && first.trim()) {
      return first;
    }
    if (first && typeof first.name === "string" && first.name.trim()) {
      return first.name;
    }
  }
  return null;
};

const BlogListItem = ({ post }) => {
  if (!post) {
    return null;
  }

  const { title, excerpt, thumbnailUrl, publishedAt, readingTime } = post;

  const authorName = resolveAuthorName(post);
  const categoryName = resolveCategory(post);
  const displayReadingTime = resolveReadingTime(
    readingTime ?? post?.meta?.readingTime ?? post?.read_time,
  );
  const formattedDate = formatDate(
    publishedAt ?? post?.date ?? post?.created_at ?? post?.createdAt,
  );
  const metadataParts = [];

  if (authorName && formattedDate) {
    metadataParts.push(`Door ${authorName} op ${formattedDate}`);
  } else {
    if (authorName) metadataParts.push(`Door ${authorName}`);
    if (formattedDate) metadataParts.push(formattedDate);
  }

  if (categoryName) {
    metadataParts.push(`Categorie: ${categoryName}`);
  }

  if (displayReadingTime) {
    metadataParts.push(`Leestijd: ${displayReadingTime}`);
  }

  const href = resolvePostUrl(post);
  const metaText = metadataParts.join(" | ");

  return (
    <article className={styles.item}>
      <a className={styles.thumbnailLink} href={href} aria-label={`Lees ${title ?? "dit artikel"}`}>
        {thumbnailUrl ? (
          <img
            className={styles.thumbnailImage}
            src={thumbnailUrl}
            alt={title ? `Thumbnail voor ${title}` : "Blog thumbnail"}
          />
        ) : (
          <span className={styles.thumbnailPlaceholder}>Geen afbeelding</span>
        )}
      </a>

      <div className={styles.meta}>
        {title ? (
          <h3 className={styles.title}>
            <a className={styles.titleLink} href={href}>
              {title}
            </a>
          </h3>
        ) : null}

        {metaText ? <p className={styles.metadata}>{metaText}</p> : null}

        {excerpt ? <p className={styles.excerpt}>{excerpt}</p> : null}
      </div>
    </article>
  );
};

export default BlogListItem;
