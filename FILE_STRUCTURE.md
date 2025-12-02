# Project Structure 📁

Complete file tree of the Cal AI Web App

```
web_app/
│
├── 📄 package.json                 # Dependencies & scripts
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 next.config.js               # Next.js configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 .eslintrc.json               # ESLint rules
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env.local.example           # Environment variables template
│
├── 📚 Documentation/
│   ├── 📄 README.md                # Main documentation
│   ├── 📄 SETUP.md                 # Setup instructions
│   ├── 📄 DEPLOYMENT.md            # Deployment guide
│   ├── 📄 START_HERE.md            # Quick start guide
│   └── 📄 QUICK_REFERENCE.md       # Command reference
│
├── 📂 public/                      # Static files
│   ├── 📄 manifest.json            # PWA manifest
│   └── 📄 robots.txt               # SEO robots file
│
└── 📂 src/                         # Source code
    │
    ├── 📂 components/              # Reusable UI components
    │   ├── 📄 Layout.tsx           # Main layout with navbar
    │   ├── 📄 LoadingSpinner.tsx   # Loading indicator
    │   └── 📄 EmptyState.tsx       # Empty state component
    │
    ├── 📂 pages/                   # Next.js pages (routes)
    │   │
    │   ├── 📂 api/                 # API routes (server-side)
    │   │   └── 📄 analyze-meal.ts  # OpenAI Vision API endpoint
    │   │
    │   ├── 📂 meals/               # Meal-related pages
    │   │   └── 📄 [id].tsx         # Meal details page (dynamic route)
    │   │
    │   ├── 📄 _app.tsx             # App wrapper (global state)
    │   ├── 📄 _document.tsx        # HTML document structure
    │   ├── 📄 index.tsx            # Landing/redirect page
    │   ├── 📄 login.tsx            # Login page
    │   ├── 📄 signup.tsx           # Signup page
    │   ├── 📄 dashboard.tsx        # Main dashboard (home)
    │   ├── 📄 scan.tsx             # Meal scanning page
    │   └── 📄 profile.tsx          # User profile & goals
    │
    ├── 📂 hooks/                   # Custom React hooks
    │   ├── 📄 useAuth.ts           # Authentication hook
    │   ├── 📄 useMeals.ts          # Today's meals hook
    │   └── 📄 useDailyGoals.ts     # Daily goals hook
    │
    ├── 📂 services/                # API service layer
    │   ├── 📄 supabase.ts          # Supabase client & auth
    │   ├── 📄 database.ts          # Database operations
    │   └── 📄 openai.ts            # OpenAI service
    │
    ├── 📂 types/                   # TypeScript type definitions
    │   └── 📄 database.ts          # Database schema types
    │
    ├── 📂 utils/                   # Utility functions
    │   └── 📄 formatters.ts        # Number/date formatters
    │
    └── 📂 styles/                  # Global styles
        └── 📄 globals.css          # Tailwind + custom CSS
```

## File Descriptions

### 📄 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, dependencies, scripts |
| `tsconfig.json` | TypeScript compiler settings |
| `next.config.js` | Next.js framework configuration |
| `tailwind.config.js` | Tailwind CSS theme customization |
| `postcss.config.js` | CSS processing configuration |
| `.eslintrc.json` | Code linting rules |
| `.gitignore` | Files to exclude from git |
| `.env.local.example` | Environment variables template |

### 📚 Documentation Files

| File | Content |
|------|---------|
| `README.md` | Complete project documentation |
| `SETUP.md` | Step-by-step installation guide |
| `DEPLOYMENT.md` | Production deployment instructions |
| `START_HERE.md` | Quick start for new developers |
| `QUICK_REFERENCE.md` | Common commands & tips |

### 🎨 Components (`src/components/`)

| Component | Purpose |
|-----------|---------|
| `Layout.tsx` | Navbar, logout, page wrapper |
| `LoadingSpinner.tsx` | Loading indicator |
| `EmptyState.tsx` | Empty state with icon & message |

### 📄 Pages (`src/pages/`)

| Page | Route | Purpose |
|------|-------|---------|
| `index.tsx` | `/` | Redirect to login or dashboard |
| `login.tsx` | `/login` | User login form |
| `signup.tsx` | `/signup` | User registration form |
| `dashboard.tsx` | `/dashboard` | Main home page with meals |
| `scan.tsx` | `/scan` | Meal image upload & analysis |
| `profile.tsx` | `/profile` | User profile & goals calculator |
| `meals/[id].tsx` | `/meals/:id` | Individual meal details |

### 🔌 API Routes (`src/pages/api/`)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/analyze-meal` | POST | Analyze meal image with OpenAI |

### 🪝 Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useAuth.ts` | Get current user & auth state |
| `useMeals.ts` | Fetch today's meals & totals |
| `useDailyGoals.ts` | Fetch user's daily goals |

### 🔧 Services (`src/services/`)

| Service | Purpose |
|---------|---------|
| `supabase.ts` | Supabase client, auth utilities |
| `database.ts` | All database CRUD operations |
| `openai.ts` | OpenAI Vision API integration |

### 📊 Types (`src/types/`)

| File | Purpose |
|------|---------|
| `database.ts` | TypeScript interfaces for DB tables |

### 🛠️ Utils (`src/utils/`)

| File | Purpose |
|------|---------|
| `formatters.ts` | Format numbers, dates, Arabic text |

### 🎨 Styles (`src/styles/`)

| File | Purpose |
|------|---------|
| `globals.css` | Tailwind imports + custom CSS |

## Import Examples

```typescript
// Import a component
import Layout from '@/components/Layout';

// Import a hook
import { useAuth } from '@/hooks/useAuth';

// Import a service
import { getMealsForDay } from '@/services/database';

// Import types
import { Meal, DailyGoals } from '@/types/database';

// Import utils
import { formatCalories } from '@/utils/formatters';
```

## Path Aliases

The `@` symbol maps to `src/` directory:

```typescript
// Instead of:
import Layout from '../../components/Layout';

// You can use:
import Layout from '@/components/Layout';
```

Configured in `tsconfig.json` → `paths`

## Page Routing

Next.js uses file-based routing:

| File | URL |
|------|-----|
| `pages/index.tsx` | `/` |
| `pages/login.tsx` | `/login` |
| `pages/dashboard.tsx` | `/dashboard` |
| `pages/meals/[id].tsx` | `/meals/123` (dynamic) |

## When to Edit Each File

### Need to add a new page?
→ Create file in `src/pages/`

### Need to modify authentication?
→ Edit `src/services/supabase.ts` or `src/hooks/useAuth.ts`

### Need to add database operation?
→ Add function in `src/services/database.ts`

### Need to change UI colors?
→ Edit `tailwind.config.js`

### Need to modify OpenAI prompt?
→ Edit `src/pages/api/analyze-meal.ts`

### Need to add new component?
→ Create file in `src/components/`

### Need to add new hook?
→ Create file in `src/hooks/`

### Need to add TypeScript type?
→ Edit `src/types/database.ts`

## Build Output

After running `npm run build`:

```
web_app/
├── .next/              # Built files (ignored by git)
│   ├── static/         # Static assets
│   └── server/         # Server-side code
└── out/                # Static export (if using)
```

## Dependencies Overview

### Production Dependencies
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM renderer
- `@supabase/supabase-js` - Supabase client
- `openai` - OpenAI API client
- `react-hot-toast` - Notifications
- `date-fns` - Date utilities

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/*` - TypeScript type definitions
- `tailwindcss` - CSS framework
- `eslint` - Code linting
- `autoprefixer` - CSS processing
- `postcss` - CSS transformations

## Total Statistics

- **Total Files**: 37
- **Configuration Files**: 8
- **Documentation Files**: 5
- **Source Files**: 24
- **Components**: 3
- **Pages**: 8
- **Hooks**: 3
- **Services**: 3
- **Types**: 1
- **Utils**: 1

---

**Navigation Tip**: Use VS Code's file explorer or `Ctrl+P` to quickly find files! 🔍
