# Cal AI Web App 🔥

A modern web application for tracking daily calorie intake with AI-powered meal analysis using OpenAI Vision API.

## Features ✨

- 🔐 **Authentication** - Secure login/signup with Supabase Auth
- 📸 **AI Meal Scanning** - Upload meal images and get instant nutritional analysis
- 📊 **Daily Tracking** - Track calories, protein, carbs, and fats
- 🎯 **Smart Goals** - Calculate personalized daily nutritional goals based on BMI/BMR
- 🍽️ **Meal Management** - Add, edit, delete meals
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌙 **Modern UI** - Beautiful RTL Arabic interface with premium design

## Tech Stack 🛠️

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenAI Vision API (GPT-4 Vision)
- **State Management**: React Hooks
- **Notifications**: React Hot Toast

## Database Schema 📦

The app uses the same database schema as the Flutter mobile app:

- `users` - User accounts
- `meals` - Meal records
- `daily_goals` - Personalized nutritional goals
- `user_profiles` - User profile data
- `weight_entries` - Weight tracking
- `ai_logs` - AI interaction logs

## Getting Started 🚀

### Prerequisites

- Node.js 18+ installed
- Supabase project created
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
cd web_app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure 📁

```
web_app/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── pages/            # Next.js pages
│   │   ├── api/          # API routes
│   │   │   └── analyze-meal.ts
│   │   ├── meals/        # Meal pages
│   │   │   └── [id].tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── dashboard.tsx
│   │   ├── scan.tsx
│   │   └── profile.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useMeals.ts
│   │   └── useDailyGoals.ts
│   ├── services/         # API services
│   │   ├── supabase.ts
│   │   ├── database.ts
│   │   └── openai.ts
│   ├── types/            # TypeScript types
│   │   └── database.ts
│   ├── utils/            # Utility functions
│   │   └── formatters.ts
│   └── styles/           # Global styles
│       └── globals.css
├── public/               # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Features Documentation 📖

### Authentication
- Sign up with email/password
- Login with existing account
- Auto-redirect based on auth state
- Secure session management

### Meal Scanning
1. Upload meal image
2. AI analyzes and extracts:
   - Meal name (Arabic)
   - Calories
   - Macros (protein, carbs, fats)
   - Meal type
3. Review and edit if needed
4. Save to database

### Daily Goals Calculation
Based on Mifflin-St Jeor BMR formula:
- Male: BMR = 10W + 6.25H - 5A + 5
- Female: BMR = 10W + 6.25H - 5A - 161
- TDEE = BMR × Activity Factor
- Macros: 25% protein, 50% carbs, 25% fats

### Activity Levels
- Sedentary (1.2): No exercise
- Light (1.375): 1-3 days/week
- Moderate (1.55): 3-5 days/week  
- Heavy (1.7): 6-7 days/week
- Athlete (1.9): Intense daily + physical job

## API Routes 🔌

### POST /api/analyze-meal
Analyzes meal image using OpenAI Vision API

**Request:**
```json
{
  "image": "base64_encoded_image"
}
```

**Response:**
```json
{
  "name": "دجاج مشوي مع أرز",
  "calories": 450,
  "protein": 35,
  "carbs": 48,
  "fat": 12,
  "meal_type": "lunch"
}
```

## Deployment 🌐

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Manual Build

```bash
npm run build
npm start
```

## Environment Variables 🔐

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `OPENAI_API_KEY` | OpenAI API key for Vision API |

## Contributing 🤝

This is a companion web app to the Flutter mobile version. Both share the same database schema and API logic.

## License 📄

Private project - All rights reserved

## Support 💬

For issues or questions, please contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
