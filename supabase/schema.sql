-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)

-- Blog posts table
create table if not exists public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact messages table
create table if not exists public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;

-- Anyone can read published blog posts
create policy "Public can read published posts"
  on public.blog_posts for select
  using (published = true);

-- Anyone can submit contact messages
create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  with check (true);

-- Sample blog post (optional)
insert into public.blog_posts (title, slug, excerpt, content, published)
values (
  'Welcome to My Portfolio',
  'welcome-to-my-portfolio',
  'A quick intro to this site and what I build.',
  E'# Welcome!\n\nThis is my first blog post. I write about web development, tools I use, and lessons learned along the way.\n\nStay tuned for more!',
  true
);
