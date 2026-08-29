# Deployment checklist

1. Create a new GitHub repository and upload this project folder.
2. Go to Vercel and choose **Add New → Project**, then import the repository.
3. Add these environment variables before deploying: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET`.
4. Click **Deploy**. After the build completes, Vercel gives you a public URL.
5. Test the homepage, contact email link, `/login`, and `/admin` before submitting.

Use a strong, unique password and secret for any public deployment. Do not commit `.env.local` to GitHub.
