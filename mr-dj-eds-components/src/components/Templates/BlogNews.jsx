import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const articles = [
  {
    title: 'Zo kies je de perfecte openingsdans',
    description: 'Tips van onze DJ’s én real-life voorbeelden uit 2024 bruiloften.',
    tags: ['Bruiloft', 'Planning'],
  },
  {
    title: 'Corporate events die het verschil maken',
    description: 'Van productlancering tot jubileum: format en playlist die werken.',
    tags: ['Corporate', 'Strategie'],
  },
];

const latestPost = {
  title: 'Trendrapport 2025: Muziek & entertainment',
  author: 'Mister DJ team',
  content:
    'Van AI playlists tot live instrumentalists – een vooruitblik op de trends die we nu al testen bij onze klanten.',
};

const BlogNews = () => (
  <SlideLayout
    title="Templates: Blog & News"
    subtitle="Contentpagina’s met categorieën, aanbevolen artikelen en rich content blokken."
  >
    <div className="grid gap-spacing-xl md:grid-cols-[2fr,1fr]">
      <section className="space-y-spacing-md">
        <div className="flex items-center justify-between">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Laatste artikelen</h3>
          <Button variant="outline" size="sm">
            Alle posts
          </Button>
        </div>
        <div className="space-y-spacing-md">
          {articles.map((article) => (
            <article key={article.title} className="space-y-spacing-xs rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
              <h4 className="text-font-size-h3 font-semibold text-neutral-dark">{article.title}</h4>
              <p className="text-sm text-neutral-gray-600">{article.description}</p>
              <div className="flex flex-wrap gap-spacing-xs text-xs uppercase tracking-wide text-primary">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/10 px-spacing-sm py-[2px]">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside className="space-y-spacing-md rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Uitgelicht</p>
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">{latestPost.title}</h3>
        <p className="text-xs text-neutral-gray-500">Door {latestPost.author}</p>
        <p className="text-sm text-neutral-dark">{latestPost.content}</p>
        <Button size="sm" className="self-start">
          Lees rapport
        </Button>
      </aside>
    </div>
  </SlideLayout>
);

export default BlogNews;
