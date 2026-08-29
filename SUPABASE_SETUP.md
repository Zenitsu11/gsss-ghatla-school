# Supabase permanent storage setup

## What this enables

After this one-time setup, every change made through `/admin` stays permanent on Vercel. The administrator can edit text, notices and activities, and upload photos or PDF documents up to 8 MB.

## 1. Create a free project

1. Open https://supabase.com and sign in with GitHub.
2. Click **New project**.
3. Choose a project name such as `gsss-ghatla-school` and set a database password you will keep safe.
4. Choose the closest region and click **Create new project**. Wait until it is ready.

## 2. Create the table and upload bucket

1. In the left menu, open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy all of it and paste it in the query box.
3. Click **Run**. You should see a success message.

## 3. Get the two values for the website

1. In Supabase, open **Project Settings** → **API**.
2. Copy the **Project URL**.
3. Copy the **service_role** key. This is secret: never paste it into GitHub, WhatsApp, or a public document.

## 4. Add them to Vercel

In Vercel open the website project → **Settings** → **Environment Variables**, then add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | The Project URL from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | The service_role key from Supabase |
| `ADMIN_EMAIL` | `admin@gsssghatla.edu.in` |
| `ADMIN_PASSWORD` | Choose a strong private password |
| `SESSION_SECRET` | A long unique random phrase |

Select **Production**, **Preview**, and **Development** for every value. Then open Vercel → **Deployments** → latest deployment → **Redeploy**.

## 5. Test

1. Open `https://your-website.vercel.app/login`.
2. Log in with your chosen `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. Make a small change and click **सभी परिवर्तन सहेजें**.
4. Open the home page in an incognito window and confirm the change is visible.

Do not upload identity documents or any private student record to the public media bucket. Only upload public school photos, notices, and circulars.
