# Ashuthosh M. R. — Portfolio

Personal portfolio and blog built with Next.js.

Live site: https://ashuthosh.de

## About

This site presents the profile of **Ashuthosh M. R.**:

- Senior Hardware Design Engineer at Calligo Technologies
- M.Tech (by Research), Electronics and Communication Engineering at PES University
- Previously Research Assistant at the CHIPS Lab, PES University
- Focused on computer architecture, many-core RISC-V SoCs, and performance modeling

All profile content is sourced from [`src/data/resume.tsx`](./src/data/resume.tsx).

## Highlights

- Sections: Work Experience, Education, Skills, Projects, Publications, Teaching & Mentoring, Contact
- Blog (`/blog`) and Bookshelf (`/bookshelf`) — routes are live and currently empty,
  ready for MDX content
- Photography lives in a separate repo, served at https://ashuthosh.de/foto

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- content-collections (MDX blog)

## Local Development

1. Install dependencies:

```bash
pnpm install
```

2. Run the dev server:

```bash
pnpm dev
```

3. Open http://localhost:3000

## Build

```bash
pnpm build
```

This project is configured for static export (`output: "export"`) and deploys to
GitHub Pages via [`.github/workflows/nextjs.yml`](./.github/workflows/nextjs.yml).

The custom domain is pinned by [`public/CNAME`](./public/CNAME), which is copied
into the export output on every build.

## Content Editing

- Main profile/config: [`src/data/resume.tsx`](./src/data/resume.tsx) — work,
  education, skills, projects, publications, teaching, contact and navbar links
- Blog posts: [`content/*.mdx`](./content) — frontmatter `title`, `publishedAt`,
  `summary` (optional `updatedAt`, `author`, `image`)
- Bookshelf entries: [`content/books/*.mdx`](./content/books) — frontmatter
  `title`, `author`, `cover` (optional `summary`)
- Avatar: `public/me.jpg`

## Notes

- `jekyll_backup/` holds the previous al-folio Jekyll site, kept for reference.
- **Empty collections:** Next's `output: export` refuses to build a dynamic route
  whose `generateStaticParams()` returns an empty array. Because the blog and
  bookshelf ship with no entries, [`src/lib/static-params.ts`](./src/lib/static-params.ts)
  emits one throwaway `__empty` slug. It disappears automatically as soon as you
  add a real `.mdx` file — nothing to undo.
- Adding a `logoUrl` to a work or education entry renders a logo next to it;
  entries without one fall back to a neutral placeholder circle.

## License

MIT - see [`LICENSE`](./LICENSE).
