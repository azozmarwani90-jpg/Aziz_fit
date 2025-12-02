# Quick Reference Card 📋

## Essential Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for linting errors
npm run lint
```

## File Locations

### Need to modify...

**Authentication logic**
→ `src/services/supabase.ts`
→ `src/pages/login.tsx`
→ `src/pages/signup.tsx`

**Database operations**
→ `src/services/database.ts`

**OpenAI meal analysis**
→ `src/pages/api/analyze-meal.ts`
→ `src/services/openai.ts`

**Dashboard/Home page**
→ `src/pages/dashboard.tsx`

**Meal scanning page**
→ `src/pages/scan.tsx`

**Profile & goals**
→ `src/pages/profile.tsx`

**Meal details**
→ `src/pages/meals/[id].tsx`

**Navbar/Layout**
→ `src/components/Layout.tsx`

**Styles & colors**
→ `src/styles/globals.css`
→ `tailwind.config.js`

**TypeScript types**
→ `src/types/database.ts`

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
OPENAI_API_KEY=sk-xxx...
```

## Common Tasks

### Change primary color
Edit `tailwind.config.js` → `theme.extend.colors.emerald`

### Add new page
1. Create `src/pages/newpage.tsx`
2. Add route in `Layout.tsx` navbar

### Modify meal analysis prompt
Edit `src/pages/api/analyze-meal.ts` → `system` message

### Change activity factors
Edit `src/services/database.ts` → `activityFactors` object

### Update macro distribution
Edit `src/services/database.ts` → calories calculation (currently 25/50/25)

### Add new database table query
Add function in `src/services/database.ts`

## API Endpoints

### Internal API Routes
- `POST /api/analyze-meal` - Analyze meal image with OpenAI

### Supabase Tables
- `users` - User accounts
- `meals` - Meal records
- `daily_goals` - Nutritional goals
- `user_profiles` - User settings
- `weight_entries` - Weight tracking
- `ai_logs` - AI interaction logs

### Supabase Storage
- `meal-images` - Uploaded meal photos

## Debugging Tips

### Check browser console
Press `F12` → Console tab

### Check terminal/server logs
Look at terminal running `npm run dev`

### Common errors

**"Module not found"**
→ Run `npm install`

**"NEXT_PUBLIC_SUPABASE_URL is undefined"**
→ Create `.env.local` file

**"Failed to fetch"**
→ Check Supabase URL/key in `.env.local`

**"OpenAI API error"**
→ Verify OPENAI_API_KEY in `.env.local`

**"Image upload failed"**
→ Create `meal-images` bucket in Supabase Storage

**Build fails**
→ Delete `.next` folder and run `npm run dev` again

## RTL (Arabic) Tips

All text is automatically RTL because:
- `_document.tsx` has `dir="rtl"`
- Tailwind has RTL support
- Use `mr-` instead of `ml-` for margins
- Use `text-right` for text alignment

## Keyboard Shortcuts (Dev Mode)

- `Ctrl + C` - Stop server
- `Ctrl + R` - Refresh browser
- `Ctrl + Shift + I` - Open DevTools
- `Ctrl + Shift + M` - Toggle mobile view

## Deployment Checklist

- [ ] Test all features locally
- [ ] Set environment variables on host
- [ ] Build succeeds (`npm run build`)
- [ ] Database tables exist
- [ ] Storage bucket created
- [ ] OpenAI API key valid
- [ ] Test on mobile devices

## Quick Fixes

### Reset everything
```powershell
rm -rf node_modules .next
npm install
npm run dev
```

### Clear Supabase cache
Delete `.next` folder and restart

### Update all dependencies
```powershell
npm update
```

## Performance Tips

- Images auto-optimized by Next.js
- Use `loading="lazy"` for images
- Enable caching in production
- Use Vercel CDN for assets

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **OpenAI API**: https://platform.openai.com/docs

## Project Statistics

- **Total Files**: 35+
- **Lines of Code**: ~3,500
- **Components**: 3
- **Pages**: 8
- **Hooks**: 3
- **Services**: 3
- **API Routes**: 1

---

**Pro Tip**: Keep this file open while developing! 📌
