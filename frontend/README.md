# BookMyShow Frontend - Complete Guide

A modern, production-ready movie booking application built with React, fully integrated with a Spring Boot backend API.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation & Setup

```bash
# Navigate to frontend directory
cd BookMyShow/frontend

# Install dependencies
npm install

# Create .env.local file (copy from .env.example)
cp .env.example .env.local

# Edit .env.local with your backend URL
VITE_API_URL=http://localhost:8080/api
```

### Running the Application

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation bar with search
│   │   ├── Footer.jsx       # Footer component
│   │   ├── MovieCard.jsx    # Movie card component
│   │   └── LoadingAndError.jsx # Loading spinners & error messages
│   │
│   ├── pages/               # Full page components
│   │   ├── HomePage.jsx                 # Movie listing & filtering
│   │   ├── AuthPage.jsx                 # Login/Signup
│   │   ├── MovieDetailsPage.jsx         # Movie details & trailer
│   │   ├── TheatreSelectionPage.jsx     # Theatre & show time selection
│   │   ├── SeatBookingPage.jsx          # Interactive seat map
│   │   ├── PaymentPage.jsx              # Payment processing
│   │   └── BookingConfirmationPage.jsx  # Booking confirmation
│   │
│   ├── contexts/            # React Context API state management
│   │   ├── AuthContext.jsx    # User authentication state
│   │   └── BookingContext.jsx  # Booking cart state
│   │
│   ├── services/            # API integration layer
│   │   └── apiService.js    # Axios instances & API calls
│   │
│   ├── utils/               # Utility functions
│   │   ├── helpers.js       # Common helper functions
│   │   └── errorHandler.js  # Error handling utilities
│   │
│   ├── App.jsx              # Main app & routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles & Tailwind
│
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies & scripts
├── .env.example             # Environment variables template
└── eslint.config.js         # ESLint configuration
```

## 🔗 API Integration

### Base Configuration
- **Base URL**: `http://localhost:8080/api`
- **Timeout**: 10 seconds
- **Authentication**: JWT Bearer token in Authorization header

### Available Endpoints

#### Authentication
```javascript
// POST /auth/login
POST /auth/login
Body: { email: string, password: string }
Response: { token: string, user: { id, name, email } }

// POST /auth/signup
POST /auth/signup
Body: { name: string, email: string, password: string }
Response: { token: string, user: { id, name, email } }
```

#### Movies
```javascript
// GET /movies
GET /movies
Response: [{ id, title, description, posterUrl, rating, ... }]

// GET /movies/{movieId}
GET /movies/{movieId}
Response: { id, title, description, backdropUrl, trailerUrl, ... }

// GET /movies/search?q=query
GET /movies/search?q=query
Response: [{ ... }]

// GET /movies/upcoming
GET /movies/upcoming
Response: [{ ... }]
```

#### Theatres
```javascript
// GET /theatres
GET /theatres
Response: [{ id, name, location, distance, ... }]

// GET /theatres?movieId={movieId}
GET /theatres?movieId={movieId}
Response: [{ ... }]
```

#### Shows
```javascript
// GET /shows?movieId={movieId}&theatreId={theatreId}
GET /shows?movieId={movieId}&theatreId={theatreId}
Response: [{ id, showTime, format, price, ... }]

// GET /shows/{showId}
GET /shows/{showId}
Response: { id, showTime, format, price, ... }
```

#### Seats
```javascript
// GET /shows/{showId}/seats
GET /shows/{showId}/seats
Response: [{ id, row, seatNumber, status, seatType, price }]
// status: "AVAILABLE", "BOOKED", "SELECTED"
// seatType: "REGULAR", "PREMIUM"
```

#### Bookings
```javascript
// POST /bookings
POST /bookings
Body: {
  showId: string,
  userId: string,
  seats: string[],
  totalAmount: number
}
Response: { id, bookingId, status, ... }

// GET /bookings/{bookingId}
GET /bookings/{bookingId}
Response: { id, movie, theatre, seats, totalAmount, ... }

// GET /bookings/user/history
GET /bookings/user/history
Response: [{ id, movie, theatre, bookingDate, ... }]

// PUT /bookings/{bookingId}/confirm
PUT /bookings/{bookingId}/confirm
Response: { id, status: "CONFIRMED", ... }
```

#### Payments
```javascript
// POST /payments
POST /payments
Body: { bookingId: string, amount: number, paymentMethod: string }
Response: { paymentId, orderId, signature, ... }

// POST /payments/verify
POST /payments/verify
Body: { bookingId: string, paymentId: string, signature: string }
Response: { status: "SUCCESS", paymentStatus: "COMPLETED" }

// GET /payments/status/{bookingId}
GET /payments/status/{bookingId}
Response: { paymentStatus: "PENDING" | "COMPLETED" | "FAILED" }
```

## 🔐 Authentication Flow

1. **Login/Signup**
   - User enters credentials on `/auth`
   - Frontend sends to backend
   - Backend validates and returns JWT token + user data
   - Token stored in localStorage

2. **JWT Token Management**
   - Token automatically attached to all API requests via interceptor
   - Key: `Authorization: Bearer {token}`
   - User data stored as JSON in localStorage

3. **Protected Routes**
   - Routes like `/movie/:id`, `/payment`, etc. require authentication
   - Users redirected to `/auth` if not logged in

4. **Logout**
   - Clears token and user data from localStorage
   - Redirects to `/auth`

## 💳 Payment Integration

### Payment Methods Supported
1. **UPI** - Indian digital payment system
2. **Credit/Debit Card** - Visa, Mastercard, etc.
3. **Net Banking** - Multiple bank options

### Payment Flow
1. User selects payment method on `/payment`
2. Frontend calls `POST /payments` with booking details
3. Backend processes payment (integration with Razorpay/Stripe)
4. Frontend verifies payment with `POST /payments/verify`
5. On success, booking is confirmed
6. User redirected to `/confirmation/{bookingId}`

## 📱 Features

### Pages
- ✅ **Home Page** - Movie listing with search & filters
- ✅ **Auth Page** - Login/Signup with form validation
- ✅ **Movie Details** - Full movie info + trailer embed
- ✅ **Theatre Selection** - Theatre list & show times
- ✅ **Seat Booking** - Interactive seat grid with pricing
- ✅ **Payment** - Multiple payment methods
- ✅ **Booking Confirmation** - Success page with booking reference

### Components
- ✅ **Navbar** - Navigation with search & user menu
- ✅ **Footer** - Footer with links & social media
- ✅ **MovieCard** - Reusable movie card component
- ✅ **Loading & Error States** - Spinners, skeletons, error messages

### Functionality
- ✅ Search movies by title
- ✅ Filter by language
- ✅ View movie details & trailer
- ✅ Select theatre & show time
- ✅ Interactive seat selection
- ✅ Real-time price calculation
- ✅ Process payments
- ✅ Booking confirmation
- ✅ JWT authentication
- ✅ Error handling with retry

## 🎨 Styling

- **Framework**: Tailwind CSS 4
- **Icons**: Lucide React
- **Colors**: Rose/Pink theme
- **Responsive**: Mobile, tablet, desktop
- **Animations**: Fade-in, slide-up effects

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Create `.env.local` with:
```env
VITE_API_URL=https://your-backend-url/api
VITE_APP_ENV=production
```

### Deploy Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### Static Hosting (AWS S3, GitHub Pages, etc.)
```bash
npm run build
# Upload contents of dist/ folder to your hosting provider
```

## 🔍 Debugging

### Enable Console Logging
All API calls log to browser console. Check:
1. **Network Tab** - See actual HTTP requests/responses
2. **Console Tab** - See error messages and debugging info
3. **Application Tab** - Check localStorage for token/user data

### Common Issues

**Problem**: CORS errors
- **Solution**: Ensure backend is running and VITE_API_URL is correct in .env.local

**Problem**: Blank page after login
- **Solution**: Check if authentication token is in localStorage, verify backend token validation

**Problem**: "No seats available"
- **Solution**: Backend may not have returned seat data, check API response format

**Problem**: Payment failing
- **Solution**: Verify payment credentials in backend, check payment gateway configuration

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.5",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^4.2.3"
}
```

## 📝 Code Examples

### Using API Service
```javascript
import { movieService, bookingService } from '../services/apiService'

// Fetch movies
const movies = await movieService.getAll()
const movie = await movieService.getById(movieId)

// Create booking
const booking = await bookingService.createBooking({
  showId: '123',
  userId: user.id,
  seats: ['seat1', 'seat2'],
  totalAmount: 500
})
```

### Using Contexts
```javascript
import { useAuth } from '../contexts/AuthContext'
import { useBooking } from '../contexts/BookingContext'

function MyComponent() {
  const { user, login, logout } = useAuth()
  const { booking, setMovie, setSeats } = useBooking()

  // Your component logic
}
```

### Error Handling
```javascript
import { handleApiError } from '../utils/errorHandler'

try {
  const data = await apiService.get('/endpoint')
} catch (err) {
  const apiError = handleApiError(err)
  console.error(apiError.message)
  console.error(apiError.status)
}
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project

## 📞 Support

For issues or questions:
1. Check the debugging section above
2. Review API integration documentation
3. Check browser console for errors
4. Verify backend is running and accessible

---

**Happy Booking! 🎬🎟️**
#   C i n e N o v a  
 