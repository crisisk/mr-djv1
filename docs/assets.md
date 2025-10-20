# Asset Workflow

This project keeps a curated set of marketing assets that are reused across the statically generated pages and component library. The sections below describe how to manage the files so that new additions stay lightweight and use the optimized delivery formats.

## Directory structure

- `frontend/public/images/` — Source images that ship with the marketing site. Subfolders group the files by use case (for example `events/` for hero imagery and `dj-setups/` for equipment shots).
- `frontend/public/assets/` — Bundled output generated during static builds. Optimized images should live here alongside the compiled CSS/JS that reference them.
- `scripts/` — Utility scripts that help with recurring maintenance tasks, such as image optimization.

## Optimizing images with Sharp

A Sharp-based helper script takes care of compressing PNG, JPEG and WebP files inside `frontend/public/assets`.

```bash
npm install    # only required once to install the Sharp dependency
npm run optimize-images
```

The script rewrites a file only when the recompressed version is smaller, so it is safe to run whenever new assets are added. SVG files are ignored because Sharp focuses on raster formats.

## Hero background guidance

Hero backgrounds are stored in `frontend/public/images/events/` as WebP files (for example `hero-feest-dj.webp`). CSS modules and inline styles should reference these WebP variants directly to avoid 404s and reduce payload size. When adding a new hero block:

1. Place the WebP file in the `events/` folder.
2. Update the related CSS module or component props to point at the WebP path, e.g. `url('/images/events/<file>.webp')`.
3. Regenerate any derived bundles if necessary and rerun the optimization script so the compressed copy is available in `frontend/public/assets`.

Following this workflow keeps the hero imagery consistent across modules (such as `Hero.module.css`) and ensures mobile fallbacks load the same lightweight WebP assets.
