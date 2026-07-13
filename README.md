# Portfolio Website

A bold, modern portfolio built with **Next.js**, **Tailwind CSS**, **Framer Motion**, and **Supabase**. Deploy free on Vercel with Supabase as your backend.

## Features

- Hero section with gradient animations
- About, Projects, Skills, Experience, Education sections
- Contact form (stored in Supabase)
- Blog powered by Supabase
- Resume download link
- Fully responsive, dark creative theme

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Customize your content

Edit `src/data/portfolio.ts` with your name, bio, projects, experience, skills, and social links.

Add your resume PDF to `public/resume.pdf`.

### 3. Set up Supabase (free tier)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings → API**
4. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel (free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add the same environment variables from `.env.local`
4. Deploy — Vercel auto-detects Next.js

Your site will be live at `your-project.vercel.app`.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components
├── data/             # Portfolio content (edit this!)
├── lib/supabase/     # Supabase clients
└── types/            # TypeScript types
supabase/
└── schema.sql        # Database schema for Supabase
public/
└── resume.pdf        # Your resume (add this)
```

## Adding Blog Posts

Insert rows into the `blog_posts` table via Supabase Dashboard or SQL:

```sql
insert into blog_posts (title, slug, excerpt, content, published)
values ('My Post', 'my-post', 'Short summary', '# Hello\n\nPost content here.', true);
```

## License

MIT
