import type { ComponentProps } from 'react';
import { AuthorInfo } from './AuthorInfo';
import { RelatedArticlesList } from './RelatedArticlesList';

export interface ArticleSidebarProps {
  slug?: string;
  authorSlug?: string;
  className?: string;
  relatedArticlesTitle?: string;
  authorSectionTitle?: string;
  relatedArticlesProps?: Omit<ComponentProps<typeof RelatedArticlesList>, 'slug'>;
  authorInfoProps?: Omit<ComponentProps<typeof AuthorInfo>, 'authorSlug'>;
}

export function ArticleSidebar({
  slug,
  authorSlug,
  className,
  relatedArticlesTitle = 'Related articles',
  authorSectionTitle = 'About the author',
  relatedArticlesProps,
  authorInfoProps,
}: ArticleSidebarProps) {
  const { className: authorInfoClassName, title: authorInfoTitle, ...restAuthorInfoProps } = authorInfoProps ?? {};
  const { className: relatedArticlesClassName, title: relatedTitle, ...restRelatedArticlesProps } =
    relatedArticlesProps ?? {};

  const sidebarClassName = ['space-y-spacing-xl', className].filter(Boolean).join(' ');
  const authorInfoSectionClassName = [authorInfoClassName].filter(Boolean).join(' ') || undefined;
  const relatedArticlesSectionClassName = [relatedArticlesClassName].filter(Boolean).join(' ') || undefined;

  return (
    <aside className={sidebarClassName} aria-label="Article sidebar">
      <AuthorInfo
        authorSlug={authorSlug}
        title={authorInfoTitle ?? authorSectionTitle}
        className={authorInfoSectionClassName}
        {...restAuthorInfoProps}
      />
      <RelatedArticlesList
        slug={slug}
        title={relatedTitle ?? relatedArticlesTitle}
        className={relatedArticlesSectionClassName}
        {...restRelatedArticlesProps}
      />
    </aside>
  );
}

export default ArticleSidebar;
