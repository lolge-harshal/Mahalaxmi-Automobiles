# Mahalaxmi Automobiles — Deployment Guide

## 1. Prerequisites

- Node.js 18+
- A Supabase project with migrations applied
- A hosting account (Hostinger, Netlify, Vercel, etc.)

---

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Never commit `.env` to version control.**

---

## 3. Supabase Setup

### Run migrations (in order)
In the Supabase SQL Editor, run:
1. `supabase/migrations/001_profiles.sql`
2. `supabase/migrations/002_workshop_schema.sql`

### Storage bucket
Migration 002 creates the `product-images` bucket automatically.
Verify it exists: Supabase Dashboard → Storage → Buckets.

### Set your site URL
Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: `https://yourdomain.com/**`

---

## 4. Production Build

```bash
cd my-app
npm install
npm run build
```

Output is in `my-app/dist/`.

---

## 5. Deploying to Hostinger

### Option A — File Manager upload
1. Run `npm run build`
2. Zip the contents of `dist/` (not the folder itself)
3. Log in to Hostinger → File Manager → `public_html`
4. Upload and extract the zip
5. The `.htaccess` file in `dist/` handles SPA routing automatically

### Option B — FTP/SFTP
```bash
# Using rsync (replace with your credentials)
rsync -avz --delete dist/ user@yourdomain.com:public_html/
```

### Option C — Git deployment (if Hostinger supports it)
1. Push your repo to GitHub
2. Hostinger → Git → connect repo → set build command: `npm run build`
3. Set publish directory: `dist`

---

## 6. Deploying to Netlify (alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd my-app
npm run build
netlify deploy --prod --dir=dist
```

The `public/_redirects` file handles SPA routing on Netlify.

---

## 7. Deploying to Vercel (alternative)

```bash
npm install -g vercel
cd my-app
vercel --prod
```

Vercel auto-detects Vite and handles routing.

---

## 8. Post-Deployment Checklist

- [ ] Site loads at your domain
- [ ] Home page shows (may be empty if no DB data yet)
- [ ] `/login` and `/signup` work
- [ ] After login, `/dashboard` is accessible
- [ ] `/admin` redirects non-admins to `/dashboard`
- [ ] Contact form submits successfully
- [ ] Product enquiry modal works for logged-in users
- [ ] Admin can add/edit/delete products and services
- [ ] Images upload to Supabase Storage
- [ ] Enquiry status updates work in admin panel

---

## 9. Making a User an Admin

In the Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@yourdomain.com'
);
```

The user must log out and back in for the role change to take effect.

---

## 10. Security Notes

- RLS is enabled on all tables — users can only access their own data
- Admin operations are protected by both RLS (`is_admin()`) and the frontend `ProtectedRoute`
- Input is sanitized before submission on all forms
- The anon key is safe to expose publicly — it only allows what RLS permits
- Never expose your `service_role` key in the frontend
