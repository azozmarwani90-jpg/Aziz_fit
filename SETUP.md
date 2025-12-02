# Quick Setup Guide 🚀

## Step-by-Step Installation

### 1. Navigate to web_app folder
```bash
cd web_app
```

### 2. Install dependencies
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase Client
- OpenAI SDK
- React Hot Toast

### 3. Create environment file

Copy `.env.local.example` to `.env.local`:
```bash
copy .env.local.example .env.local
```

Then edit `.env.local` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-your-openai-key-here
```

### 4. Verify Supabase tables exist

Make sure your Supabase database has these tables:
- ✅ users
- ✅ meals
- ✅ daily_goals
- ✅ user_profiles
- ✅ weight_entries
- ✅ ai_logs

If `daily_goals` table doesn't exist, run the SQL migration from the Flutter project:
```sql
-- Located in: cal_ai_clone/supabase_migration_daily_goals.sql
```

### 5. Configure Supabase Storage

Create a storage bucket named `meal-images`:
1. Go to Supabase Dashboard → Storage
2. Create new bucket: `meal-images`
3. Make it public
4. Add policy: Allow authenticated users to upload

### 6. Test OpenAI API Key

Make sure your OpenAI account has:
- ✅ GPT-4 Vision API access
- ✅ Sufficient credits
- ✅ API key is active

### 7. Run development server
```bash
npm run dev
```

### 8. Open browser
Visit: http://localhost:3000

## First Time Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Calculate Goals**: Go to Profile → Set your biometrics
3. **Scan Meal**: Click "تحليل وجبة جديدة" → Upload image
4. **View Dashboard**: See your daily progress

## Troubleshooting 🔧

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Supabase connection issues
- Verify URL and anon key in `.env.local`
- Check if RLS policies allow operations
- Ensure user exists in `public.users` table

### OpenAI API errors
- Check API key validity
- Verify GPT-4 Vision access
- Check account credits/billing

### Image upload fails
- Verify storage bucket exists
- Check bucket is public
- Verify RLS policies on storage

## Production Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Tips 💡

- Use Chrome/Edge for best compatibility
- Enable Arabic fonts in browser settings
- Test on mobile viewport (responsive design)
- Check browser console for any errors

## Need Help?

Check the main README.md for full documentation.
