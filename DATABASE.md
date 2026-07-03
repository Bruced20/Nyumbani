# Nyumbani Database Schema & Security

Nyumbani uses Supabase (PostgreSQL) as its primary database.

---

## 📊 Database Tables

- `profiles`: synched with auth users. Tracks user roles (`Renter`, `Owner`, `Moderator`, `Admin`).
- `properties`: main apartment listing metadata (Neighborhood, price bounds, security, road type).
- `reviews`: anonymized resident ratings (Water, security, caretaker). Has a unique constraint on `(property_id, user_id)` to prevent multiple submissions.
- `claims`: verified landlord requests to claim apartment listings.
- `reports`: tenant abuse reports on reviews.
- `audit_logs`: tracking table for moderation logs.
- `property_images` (virtual join): links image links to properties.
- `property_amenities` (virtual join): links specific amenities (perimeter fence, backup generator).
- `nearby_places` (virtual join): walking distance transit times.

---

## 🛡️ Row Level Security (RLS) Policies

All tables have RLS enabled.

- `profiles`: select policies allow users to read only their own profile (`auth.uid() = id`), or admins to select all profiles.
- `properties`: select policies allow anonymous public reads. Insert policies require authentication.
- `reviews`: select policies allow anyone to query unmoderated reviews (`is_moderated = false`). Insert policies check that `auth.uid() = user_id`.
- `claims`: select/insert policies restrict access to the submitting user (`auth.uid() = user_id`), while admins have full access.

---

## ⚡ Indexing Strategy

To keep database query latency low under high traffic, the following indexes are active:

- `idx_properties_neighborhood` (optimizes searches by neighborhood)
- `idx_properties_rent_range` (optimizes searches by rent limits)
- `idx_properties_health_score` (optimizes sorting/filtering by health)
- `idx_properties_slug` (optimizes details lookups by slug)
- `idx_reviews_property_id` (optimizes reviews fetches per listing)
- `idx_claims_status` (optimizes moderation queue checks)
