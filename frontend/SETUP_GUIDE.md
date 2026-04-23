# Setup & Installation Guide

## Prerequisites

Before starting, ensure you have:

### Required
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** v8 or higher (comes with Node.js)
- **Git** for version control ([Download](https://git-scm.com/))

### Recommended
- **VS Code** ([Download](https://code.visualstudio.com/))
- VS Code Extensions: ES7+ React/Redux snippets, Tailwind CSS IntelliSense

### Backend
- **Spring Boot backend** running on `http://localhost:8080`

## Installation Steps

### 1. Navigate to Frontend Directory
```bash
cd path/to/BookMyShow/frontend
```

### 2. Install Dependencies
```bash
npm install
```

This installs all packages from `package.json`:
- React 18.2
- React Router 6
- Axios 1.6
- Tailwind CSS 4
- Lucide React icons
- Vite build tool

### 3. Configure Environment

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Backend API URL (adjust if backend runs on different port/host)
VITE_API_URL=http://localhost:8080/api

# Razorpay Key (optional)
VITE_RAZORPAY_KEY=your_razorpay_key_here

# Environment
VITE_APP_ENV=development
```

### 4. Verify Installation

Check versions:
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
```

### 5. Start Development Server

```bash
npm run dev
```

Output should show:
```
VITE v5.0.8  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Press h to show help
```

Open browser: **http://localhost:3000**

## Available Commands

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check code for errors/warnings
npm run lint
```

## Project Structure Overview

```
frontend/
├── public/                 # Static assets (optional)
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Full page routes
│   ├── contexts/         # React Context for state
│   ├── services/         # API layer
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.js        # Vite config
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .gitignore            # Git ignore
├── README.md             # Documentation
├── API_INTEGRATION.md    # API guide
└── eslint.config.js      # Linting rules
```

## Common Issues & Solutions

### Issue: `Module not found` errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
**Solution:**
Change port in `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change this
  proxy: { ... }
}
```

### Issue: CORS errors when calling API
**Solution:**
1. Ensure backend is running on port 8080
2. Verify `VITE_API_URL` in `.env.local`
3. Check backend CORS configuration

### Issue: Styles not loading
**Solution:**
```bash
# Clear browser cache
Ctrl+Shift+Delete  # Windows/Linux
Cmd+Shift+Delete   # Mac

# Restart dev server
npm run dev
```

### Issue: Authentication not persisting
**Solution:**
1. Check localStorage in DevTools (Application tab)
2. Ensure token is being stored after login
3. Verify JWT token is valid

## Development Workflow

### 1. Start Backend
```bash
# In backend directory
./mvnw spring-boot:run   # For Maven
# or
gradle bootRun           # For Gradle
```

Verify backend running: `http://localhost:8080/api/movies`

### 2. Start Frontend
```bash
# In frontend directory
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

### 4. Enable DevTools
Press `F12` to open browser DevTools:
- **Console**: Check for errors/logs
- **Network**: Monitor API calls
- **Application**: Check localStorage for tokens
- **Elements**: Inspect DOM and styles

### 5. Test Features

**Test Login:**
1. Go to http://localhost:3000/auth
2. Try signup/login
3. Check console for errors
4. Verify token in localStorage

**Test Movie Listing:**
1. Go to http://localhost:3000
2. Check if movies load
3. Test search functionality
4. Check Network tab for API responses

**Test Booking Flow:**
1. Login
2. Click "Book Now" on a movie
3. Select theatre and show
4. Select seats
5. Proceed to payment
6. Complete payment
7. View confirmation

## Building for Production

### 1. Create Production Build
```bash
npm run build
```

Output files in `dist/` folder ready to deploy.

### 2. Test Production Build Locally
```bash
npm run preview
```

Opens at: `http://localhost:4173`

### 3. Deploy to Hosting

**Option A: Vercel (Recommended)**
```bash
npm i -g vercel
vercel
# Follow prompts
```

**Option B: Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Option C: Manual (AWS S3, GitHub Pages, etc.)**
```bash
# Upload dist/ folder contents to your hosting
```

**Option D: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
docker build -t bookmyshow-frontend .
docker run -p 3000:3000 bookmyshow-frontend
```

## Performance Tips

1. **Lazy Load Components**
   ```javascript
   const LazyPage = React.lazy(() => import('./pages/MovieDetailsPage'))
   ```

2. **Optimize Images**
   - Use WebP format
   - Compress before upload
   - Implement lazy loading

3. **Code Splitting**
   - Vite handles this automatically
   - Check build size: `npm run build`

4. **Caching**
   - Implement HTTP caching headers
   - Use service workers for offline support

5. **Monitor Performance**
   - Use Lighthouse in DevTools
   - Check Core Web Vitals

## Debugging Tips

### Enable API Request Logging
All API calls are logged to console. Look for patterns:
```javascript
// In browser console
localStorage.getItem('token')      // Check JWT token
localStorage.getItem('user')       // Check user data
```

### Check API Responses
Open DevTools Network tab:
1. Click on API request
2. Go to "Response" tab
3. Verify data format matches expectations

### React DevTools
Install browser extension: [React DevTools](https://react-devtools-tutorial.vercel.app/)

This helps:
- Inspect component hierarchy
- Check component props/state
- Track renders

## Environment Variables Reference

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api

# Payment Gateway (optional)
VITE_RAZORPAY_KEY=rzp_test_xxxxx

# App Configuration
VITE_APP_ENV=development
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment
3. ✅ Start backend server
4. ✅ Start frontend dev server
5. ✅ Test features in browser
6. ✅ Check console for errors
7. ✅ Review API_INTEGRATION.md for endpoints
8. ✅ Read README.md for feature details

## Support & Resources

- **React Documentation**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Axios**: https://axios-http.com
- **Vite**: https://vitejs.dev

## Quick Command Reference

```bash
# Install packages
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check code quality
npm run lint

# Update packages
npm update

# Clean install
rm -rf node_modules package-lock.json && npm install
```

---

Happy coding! 🚀
# Frontend Setup & Run Guide

## Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
node --version  # Should be 16 or higher
npm --version   # Should be 8 or higher
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

✅ Server runs at: **http://localhost:5173**

### 4. Start Backend (In separate terminal)
```bash
# From project root
mvn spring-boot:run
```

✅ Backend runs at: **http://localhost:8080**

---

## Full Setup Guide

### Step 1: Navigate to Frontend Directory
```bash
cd /path/to/BookMyShow/BookMyShow/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages:
- react@19
- react-dom@19
- react-router-dom@7
- vite@8
- tailwindcss@4
- axios@1.15
- react-hot-toast@2.6
- lucide-react@1.8

### Step 3: Configure Environment (Optional)
Create `.env.local` file:

```env
# Backend API URL
VITE_API_URL=http://localhost:8080/api

# App configuration
VITE_APP_NAME=BookMyShow
VITE_APP_ENV=development
```

### Step 4: Start Development Server
```bash
npm run dev
```

Output will show:
```
  VITE v8.x.x  ready in X ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 5: Open in Browser

🌐 Go to: **http://localhost:5173**

---

## Available Commands

```bash
# Start dev server with HMR
npm run dev

# Run ESLint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Development Workflow

### Hot Module Replacement (HMR)
- Edit any `.jsx` or `.css` file
- Changes appear instantly in browser
- State is preserved during edits

### Browser DevTools
- React DevTools extension
- Redux/Context DevTools (optional)
- Network tab for API debugging

### Console Logging
```javascript
console.log('Debug info');  // Visible in browser DevTools
```

---

## Troubleshooting

### Port Already in Use
If port 5173 is taken:
```bash
# Vite will automatically use 5174, 5175, etc.
npm run dev
```

Or free up the port manually.

### Dependencies Installation Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Blank Screen
1. Check browser console for errors (F12)
2. Ensure backend is running on port 8080
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart dev server (Ctrl+C, then `npm run dev`)

### Backend API Not Responding
```bash
# Check backend status
curl http://localhost:8080/api/movies

# If fails, start backend in new terminal
cd /path/to/BookMyShow/BookMyShow
mvn spring-boot:run
```

### Module Not Found Errors
```bash
# Delete cache and node_modules
rm -rf node_modules dist .vite
npm install
npm run dev
```

---

## Testing Features

### 1. Browse Movies
- Visit http://localhost:5173
- Search by movie name
- Filter by genre, language

### 2. View Movie Details
- Click any movie card
- Watch trailer (YouTube embedded)
- See cast, rating, description

### 3. Book Tickets
- Click "Book Tickets Now"
- Sign up or sign in (use any email)
- Select theatre and show time
- Pick seats from grid
- Review booking summary
- Complete payment

### 4. Test Demo Credentials
```
Email: demo@bookmyshow.com
Password: demo123
```

---

## Production Build

### Create Production Build
```bash
npm run build
```

Output in `dist/` folder (optimized for deployment).

### Preview Production Build Locally
```bash
npm run preview
```

Runs at: http://localhost:4173

### Deploy Production Build
```bash
# To Vercel
npm i -g vercel
vercel --prod

# To Netlify
npm run build
# Drag dist/ folder to https://app.netlify.com
```

---

## Project Structure Quick Reference

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Full page components
│   ├── contexts/           # React Context API
│   ├── services/           # API services
│   ├── App.jsx             # Main app
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static files
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── eslint.config.js        # ESLint config
└── index.html              # HTML entry

```

---

## Key Endpoints

All endpoints have mock fallback data:

```
GET    /api/movies
GET    /api/movies/:id
GET    /api/theatres
GET    /api/shows?movieId={id}&theatreId={id}
GET    /api/shows/:showId/seats
POST   /api/booking/book
POST   /api/booking/confirm/:bookingId
POST   /api/user/signup
```

---

## Performance Tips

- Use React DevTools Profiler to check component renders
- Lazy load components with React.lazy() if needed
- Check Network tab to see API response times
- Use `npm run build` to check final bundle size

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module react" | Run `npm install` |
| "Port 5173 in use" | Different port auto-selected |
| "CORS error" | Backend must allow CORS |
| "API returns 404" | Check backend is running |
| "Page goes blank" | Check Console tab for errors |
| "Styles not loading" | Restart dev server |

---

## Need Help?

1. **Check Console (F12)** - Most errors shown there
2. **Read error message** - Usually explains the issue
3. **Restart dev server** - Fixes ~80% of issues
4. **Clear cache** - `rm -rf node_modules && npm install`
5. **Check backend** - Ensure Spring Boot running

---

## Next Steps

After setup:
✅ Explore the codebase
✅ Try the booking flow
✅ Test with backend API
✅ Modify components
✅ Deploy to production

Happy coding! 🚀
