# Nyumbani Production Deployment

This guide outlines deployment steps on Vercel.

---

## 🚀 Deployment Steps

1.  **Repository Connection:** Connect your GitHub repository to Vercel.
2.  **Framework Preset:** Select **Next.js** as the preset.
3.  **Environment Variables:** Add the following variables:
    - `NEXT_PUBLIC_SUPABASE_URL` (Supabase API URL)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase Anon Key)
    - `SUPABASE_SERVICE_ROLE_KEY` (Supabase Service Key)
    - `UPSTASH_REDIS_REST_URL` (Upstash Redis URL)
    - `UPSTASH_REDIS_REST_TOKEN` (Upstash Redis Token)
    - `NEXT_PUBLIC_APP_URL` (Set to `https://nyumbani.co.ke` or your custom domain)
4.  **Click Deploy:** Vercel will automatically build and distribute the site.

---

## 🔒 Security Headers

Vercel deployment inherits standard OWASP security headers defined inside [middleware.ts](file:///c:/Users/Mwangi/OneDrive/Desktop/Nyumbani/src/middleware.ts):

- `X-Frame-Options: DENY` (prevents clickjacking)
- `X-Content-Type-Options: nosniff` (prevents mime sniffing)
- `Referrer-Policy: origin-when-cross-origin`
- `Content-Security-Policy` (enforces strict domains for scripts and assets, allowing only safe sources like Supabase and Unsplash)
