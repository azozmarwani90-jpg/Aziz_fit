# Deployment Guide 🚀

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier works)

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Cal AI Web App"
git remote add origin your-github-repo-url
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Select the `web_app` folder as root directory

3. **Configure Environment Variables**

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_key
OPENAI_API_KEY = your_openai_key
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Visit your live URL!

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

---

## Netlify Deployment

### Steps

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build Project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Set Environment Variables**
- Go to Site Settings → Build & Deploy → Environment
- Add all environment variables

---

## Self-Hosted (VPS/Cloud)

### Prerequisites
- Node.js 18+ installed on server
- Nginx or Apache
- SSL certificate (Let's Encrypt)

### Steps

1. **Build Application**
```bash
npm run build
```

2. **Start with PM2**
```bash
npm install -g pm2
pm2 start npm --name "cal-ai-web" -- start
pm2 save
pm2 startup
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Enable SSL**
```bash
sudo certbot --nginx -d your-domain.com
```

---

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Run
```bash
docker build -t cal-ai-web .
docker run -p 3000:3000 --env-file .env.local cal-ai-web
```

---

## Performance Optimization

### Before Deployment

1. **Optimize Images**
```bash
npm install sharp
```

2. **Enable Compression**
Already configured in `next.config.js`

3. **Set up CDN**
- Use Vercel Edge Network (automatic)
- Or configure Cloudflare

4. **Database Optimization**
- Add indexes on frequently queried columns
- Enable connection pooling in Supabase

### After Deployment

1. **Monitor Performance**
- Use Vercel Analytics
- Set up Sentry for error tracking

2. **Enable Caching**
```javascript
// next.config.js
module.exports = {
  ...
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

---

## Security Checklist ✅

Before going live:

- [ ] Environment variables are set correctly
- [ ] No API keys in client-side code
- [ ] Supabase RLS policies are active
- [ ] CORS is configured properly
- [ ] Rate limiting enabled on API routes
- [ ] HTTPS/SSL certificate active
- [ ] CSP headers configured
- [ ] Authentication flows tested

---

## Post-Deployment Testing

### Test Checklist

1. **Authentication**
   - [ ] Sign up works
   - [ ] Login works
   - [ ] Logout works
   - [ ] Session persistence

2. **Meal Scanning**
   - [ ] Image upload works
   - [ ] OpenAI analysis works
   - [ ] Meal save works
   - [ ] Image displays correctly

3. **Dashboard**
   - [ ] Meals display
   - [ ] Stats calculate correctly
   - [ ] Delete works
   - [ ] Navigation works

4. **Profile**
   - [ ] Goals calculation works
   - [ ] Data persists
   - [ ] Updates correctly

5. **Mobile Responsive**
   - [ ] Works on iOS Safari
   - [ ] Works on Android Chrome
   - [ ] Touch interactions work
   - [ ] Layout adapts properly

---

## Monitoring & Maintenance

### Set up Monitoring

1. **Vercel Analytics** (if using Vercel)
```bash
npm install @vercel/analytics
```

Add to `_app.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

2. **Error Tracking (Sentry)**
```bash
npm install @sentry/nextjs
```

### Regular Maintenance

- Update dependencies monthly
- Monitor API usage (OpenAI, Supabase)
- Check error logs weekly
- Backup database regularly
- Review and optimize slow queries

---

## Scaling Considerations

### When to Scale

- 1000+ users → Enable caching
- 10,000+ users → Database read replicas
- 100,000+ users → Consider serverless functions

### Optimization Strategies

1. **API Rate Limiting**
2. **Image CDN (Cloudinary/ImageKit)**
3. **Database Connection Pooling**
4. **Edge Caching**
5. **Progressive Web App (PWA)**

---

## Support

For deployment issues:
1. Check Vercel/Netlify logs
2. Review Next.js documentation
3. Check Supabase status page
4. Contact support team

---

Built with ❤️ - Ready for production!
