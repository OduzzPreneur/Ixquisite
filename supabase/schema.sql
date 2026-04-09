create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone);

  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  caption text not null,
  tone text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists image_alt text;
alter table public.categories add column if not exists image_position text;

create table if not exists public.occasions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  tone text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.occasions add column if not exists image_url text;
alter table public.occasions add column if not exists image_alt text;
alter table public.occasions add column if not exists image_position text;

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  tone text not null,
  cta text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.collections add column if not exists image_url text;
alter table public.collections add column if not exists image_alt text;
alter table public.collections add column if not exists image_position text;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category_slug text not null references public.categories(slug) on update cascade,
  collection_slug text not null references public.collections(slug) on update cascade,
  price integer not null check (price >= 0),
  tone text not null,
  blurb text not null,
  description text not null,
  delivery text not null,
  fit text not null,
  colors text[] not null default '{}',
  swatches jsonb not null default '[]'::jsonb,
  sizes text[] not null default '{}',
  availability text not null,
  details text[] not null default '{}',
  card_features text[] not null default '{}',
  rating_value numeric(2,1) not null default 4.8,
  review_count integer not null default 0,
  complete_the_look text[] not null default '{}',
  featured_rank integer not null default 100,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists image_alt text;
alter table public.products add column if not exists image_position text;
alter table public.products add column if not exists swatches jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists card_features text[] not null default '{}';
alter table public.products add column if not exists rating_value numeric(2,1) not null default 4.8;
alter table public.products add column if not exists review_count integer not null default 0;

create table if not exists public.product_occasions (
  product_slug text not null references public.products(slug) on delete cascade on update cascade,
  occasion_slug text not null references public.occasions(slug) on delete cascade on update cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (product_slug, occasion_slug)
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  tone text not null,
  reading_time text not null,
  category text not null,
  body text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lookbook_looks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  tone text not null,
  product_slugs text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  recipient_name text,
  phone text,
  city text,
  address_line text not null,
  delivery_notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null references public.products(slug) on delete cascade on update cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, product_slug)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  cart_token text unique,
  status text not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_slug text not null references public.products(slug) on update cascade,
  quantity integer not null check (quantity > 0),
  selected_size text,
  selected_color text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  cart_id uuid references public.carts(id) on delete set null,
  reference text not null unique,
  email text not null,
  full_name text not null,
  phone text,
  city text,
  shipping_address text,
  shipping_method text,
  payment_method text,
  status text not null default 'pending_payment',
  payment_status text not null default 'initialized',
  currency text not null default 'NGN',
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  paystack_access_code text,
  paystack_authorization_url text,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text,
  product_title text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0),
  selected_size text,
  selected_color text,
  line_total integer not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  reference text not null unique,
  status text not null,
  amount integer not null,
  currency text not null default 'NGN',
  access_code text,
  authorization_url text,
  transaction_id bigint,
  gateway_response text,
  paid_at timestamptz,
  raw_response jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.wedding_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  timeline text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.homepage_settings (
  id text primary key default 'default',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists cart_items_identity_idx on public.cart_items (cart_id, product_slug, coalesce(selected_size, ''), coalesce(selected_color, ''));
create index if not exists products_category_slug_idx on public.products(category_slug);
create index if not exists products_collection_slug_idx on public.products(collection_slug);
create index if not exists product_occasions_occasion_slug_idx on public.product_occasions(occasion_slug);
create index if not exists carts_user_id_idx on public.carts(user_id);
create index if not exists carts_status_idx on public.carts(status);
create index if not exists cart_items_cart_id_idx on public.cart_items(cart_id);
create index if not exists user_addresses_user_id_idx on public.user_addresses(user_id);
create index if not exists user_addresses_default_idx on public.user_addresses(user_id, is_default);
create index if not exists wishlist_items_user_id_idx on public.wishlist_items(user_id);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_reference_idx on public.orders(reference);
create index if not exists payments_order_id_idx on public.payments(order_id);
create index if not exists contact_requests_email_idx on public.contact_requests(email);
create index if not exists wedding_inquiries_email_idx on public.wedding_inquiries(email);

alter table public.categories enable row level security;
alter table public.occasions enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_occasions enable row level security;
alter table public.articles enable row level security;
alter table public.lookbook_looks enable row level security;
alter table public.profiles enable row level security;
alter table public.user_addresses enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.contact_requests enable row level security;
alter table public.wedding_inquiries enable row level security;
alter table public.homepage_settings enable row level security;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories for select using (true);
drop policy if exists "Public read occasions" on public.occasions;
create policy "Public read occasions" on public.occasions for select using (true);
drop policy if exists "Public read collections" on public.collections;
create policy "Public read collections" on public.collections for select using (true);
drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select using (true);
drop policy if exists "Public read product occasions" on public.product_occasions;
create policy "Public read product occasions" on public.product_occasions for select using (true);
drop policy if exists "Public read articles" on public.articles;
create policy "Public read articles" on public.articles for select using (true);
drop policy if exists "Public read lookbook looks" on public.lookbook_looks;
create policy "Public read lookbook looks" on public.lookbook_looks for select using (true);
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
drop policy if exists "Users read own addresses" on public.user_addresses;
create policy "Users read own addresses" on public.user_addresses for select using (auth.uid() = user_id);
drop policy if exists "Users insert own addresses" on public.user_addresses;
create policy "Users insert own addresses" on public.user_addresses for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own addresses" on public.user_addresses;
create policy "Users update own addresses" on public.user_addresses for update using (auth.uid() = user_id);
drop policy if exists "Users delete own addresses" on public.user_addresses;
create policy "Users delete own addresses" on public.user_addresses for delete using (auth.uid() = user_id);
drop policy if exists "Users read own wishlist" on public.wishlist_items;
create policy "Users read own wishlist" on public.wishlist_items for select using (auth.uid() = user_id);
drop policy if exists "Users insert own wishlist items" on public.wishlist_items;
create policy "Users insert own wishlist items" on public.wishlist_items for insert with check (auth.uid() = user_id);
drop policy if exists "Users delete own wishlist items" on public.wishlist_items;
create policy "Users delete own wishlist items" on public.wishlist_items for delete using (auth.uid() = user_id);
drop policy if exists "Users read own carts" on public.carts;
create policy "Users read own carts" on public.carts for select using (auth.uid() = user_id);
drop policy if exists "Users read own cart items" on public.cart_items;
create policy "Users read own cart items" on public.cart_items for select using (
  exists (select 1 from public.carts where public.carts.id = cart_items.cart_id and public.carts.user_id = auth.uid())
);
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id);
drop policy if exists "Users read own order items" on public.order_items;
create policy "Users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where public.orders.id = order_items.order_id and public.orders.user_id = auth.uid())
);
drop policy if exists "Users read own payments" on public.payments;
create policy "Users read own payments" on public.payments for select using (
  exists (select 1 from public.orders where public.orders.id = payments.order_id and public.orders.user_id = auth.uid())
);
drop policy if exists "Public read homepage settings" on public.homepage_settings;
create policy "Public read homepage settings" on public.homepage_settings for select using (true);

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user_profile();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists set_occasions_updated_at on public.occasions;
create trigger set_occasions_updated_at before update on public.occasions for each row execute function public.set_updated_at();
drop trigger if exists set_collections_updated_at on public.collections;
create trigger set_collections_updated_at before update on public.collections for each row execute function public.set_updated_at();
drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at before update on public.articles for each row execute function public.set_updated_at();
drop trigger if exists set_lookbook_looks_updated_at on public.lookbook_looks;
create trigger set_lookbook_looks_updated_at before update on public.lookbook_looks for each row execute function public.set_updated_at();
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_user_addresses_updated_at on public.user_addresses;
create trigger set_user_addresses_updated_at before update on public.user_addresses for each row execute function public.set_updated_at();
drop trigger if exists set_carts_updated_at on public.carts;
create trigger set_carts_updated_at before update on public.carts for each row execute function public.set_updated_at();
drop trigger if exists set_cart_items_updated_at on public.cart_items;
create trigger set_cart_items_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
drop trigger if exists set_contact_requests_updated_at on public.contact_requests;
create trigger set_contact_requests_updated_at before update on public.contact_requests for each row execute function public.set_updated_at();
drop trigger if exists set_wedding_inquiries_updated_at on public.wedding_inquiries;
create trigger set_wedding_inquiries_updated_at before update on public.wedding_inquiries for each row execute function public.set_updated_at();
drop trigger if exists set_homepage_settings_updated_at on public.homepage_settings;
create trigger set_homepage_settings_updated_at before update on public.homepage_settings for each row execute function public.set_updated_at();
