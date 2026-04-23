# API Integration Checklist

## Frontend Endpoints to Integrate

### ✅ Authentication Endpoints
- [ ] POST `/auth/login` - User login
- [ ] POST `/auth/signup` - User registration

### ✅ Movie Endpoints
- [ ] GET `/movies` - List all movies
- [ ] GET `/movies/{id}` - Get movie details
- [ ] GET `/movies/search?q=query` - Search movies
- [ ] GET `/movies/upcoming` - Get upcoming movies

### ✅ Theatre Endpoints
- [ ] GET `/theatres` - List all theatres
- [ ] GET `/theatres?movieId={id}` - Get theatres for a movie

### ✅ Show Endpoints
- [ ] GET `/shows?movieId={id}&theatreId={id}` - Get shows
- [ ] GET `/shows/{id}` - Get show details

### ✅ Seat Endpoints
- [ ] GET `/shows/{showId}/seats` - Get seats for a show

### ✅ Booking Endpoints
- [ ] POST `/bookings` - Create booking
- [ ] GET `/bookings/{id}` - Get booking details
- [ ] GET `/bookings/user/history` - Get user's booking history
- [ ] PUT `/bookings/{id}/confirm` - Confirm booking

### ✅ Payment Endpoints
- [ ] POST `/payments` - Initiate payment
- [ ] POST `/payments/verify` - Verify payment
- [ ] GET `/payments/status/{bookingId}` - Get payment status

## Backend Response Format Expected

### Authentication Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Movie Response
```json
{
  "id": "movie_id",
  "title": "Movie Title",
  "description": "Movie description",
  "posterUrl": "url",
  "backdropUrl": "url",
  "trailerUrl": "youtube_embed_url",
  "rating": 8.5,
  "reviewCount": 1000,
  "duration": 120,
  "language": "English",
  "genre": "Action, Adventure",
  "certification": "UA",
  "releaseDate": "2024-01-01",
  "cast": "Actor names"
}
```

### Theatre Response
```json
{
  "id": "theatre_id",
  "name": "Theatre Name",
  "location": "City, Area",
  "distance": 2.5
}
```

### Show Response
```json
{
  "id": "show_id",
  "showTime": "14:30",
  "showDate": "2024-01-15",
  "format": "2D",
  "price": 250
}
```

### Seat Response
```json
{
  "id": "seat_id",
  "row": "A",
  "seatNumber": 1,
  "status": "AVAILABLE",
  "seatType": "REGULAR",
  "price": 250
}
```

### Booking Response
```json
{
  "id": "booking_id",
  "movie": { /* movie object */ },
  "theatre": { /* theatre object */ },
  "show": { /* show object */ },
  "seats": [ /* seat objects */ ],
  "totalAmount": 500,
  "convenienceFee": 10,
  "status": "PENDING"
}
```

## Environment Variables

Create `.env.local`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_ENV=development
```

## Testing the Integration

1. Start backend server on port 8080
2. Run `npm install` and `npm run dev`
3. Open browser on http://localhost:3000
4. Test each flow:
   - Authentication (Login/Signup)
   - Browse movies
   - View movie details
   - Select theatre and show
   - Select seats
   - Process payment
   - View booking confirmation

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API calls failing | Check VITE_API_URL in .env.local |
| CORS errors | Configure CORS in backend |
| Blank movie data | Verify API response format |
| Payment not working | Check payment gateway setup |
| Auth token not persisting | Verify localStorage permissions |

## Performance Optimization

- [ ] Lazy load images
- [ ] Implement pagination for movie list
- [ ] Cache theatre/show data
- [ ] Optimize seat rendering (virtualization for large grids)
- [ ] Use React.memo for expensive components

---

Ready to integrate with your backend! ✨
# API Integration Guide

## Overview

The frontend uses **Axios** for HTTP requests with automatic JWT token attachment. All endpoints have **mock data fallbacks** for development.

## Base Setup

### Axios Configuration (`src/services/api.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Proxied to http://localhost:8080/api
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## API Services

### Movie Service

```javascript
// Get all movies
const movies = await movieService.getAll();

// Get single movie by ID
const movie = await movieService.getById(1);
```

**Mock Data**: 8 movies with full details (title, genre, rating, cast, etc.)

---

### Theatre Service

```javascript
// Get all theatres
const theatres = await theatreService.getAll();

// Get shows for movie & theatre
const shows = await theatreService.getShowsByMovieAndTheatre(
  movieId,  // 1
  theatreId // 1
);
```

**Mock Data**: 
- 5 theatres (PVR, INOX, Cinepolis, etc.)
- 5 shows per theatre (10 AM - 11:15 PM)
- Multiple formats (2D, 3D, IMAX, 4DX)

---

### Show Service

```javascript
// Get seats for a show
const seats = await showService.getShowSeats(showId);
```

**Mock Data**:
- 96 seats per show (8 rows × 12 seats)
- 30% randomly marked as booked
- Rows A-B: Premium (₹350)
- Rows C-H: Regular (₹220)

---

### Booking Service

```javascript
// Create new booking
const response = await bookingService.book({
  showId: 1,
  userId: 1,
  seatIds: [1, 2, 3],
  totalAmount: 1050,
});

// Confirm booking
const result = await bookingService.confirm(bookingId);
```

**Response**:
```json
{
  "bookingId": 123456,
  "message": "Booking was successful",
  "responseStatus": "SUCCESS"
}
```

---

### User Service

```javascript
// Sign up
const signup = await userService.signup({
  email: 'user@example.com',
  password: 'password123',
});

// Login (mock for now)
const login = await userService.login({
  email: 'user@example.com',
  password: 'password123',
});
```

**Returns**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Complete API Reference

### Movies

#### GET /api/movies
Get all movies

**Response**:
```json
[
  {
    "id": 1,
    "name": "Avengers: Secret Wars",
    "genre": "Action/Sci-Fi",
    "duration": 150,
    "rating": 8.7,
    "description": "...",
    "languages": ["ENGLISH", "HINDI"],
    "actors": ["Robert Downey Jr.", "..."],
    "posterUrl": "https://...",
    "trailerUrl": "https://www.youtube.com/embed/...",
    "releaseDate": "2026-05-02",
    "certification": "UA",
    "votes": 124500
  },
  ...
]
```

#### GET /api/movies/:id
Get single movie

**Response**: Single movie object (same structure as above)

---

### Theatres & Shows

#### GET /api/theatres
Get all theatres

**Response**:
```json
[
  {
    "id": 1,
    "name": "PVR: IMAX Orion Mall",
    "address": "Rajajinagar, Bengaluru",
    "region": "Bengaluru",
    "distance": "2.3 km"
  },
  ...
]
```

#### GET /api/shows?movieId={movieId}&theatreId={theatreId}
Get shows for movie & theatre

**Query Parameters**:
- `movieId` (required): Movie ID
- `theatreId` (required): Theatre ID

**Response**:
```json
[
  {
    "id": 10010,
    "movieId": 1,
    "theatreId": 1,
    "time": "10:00 AM",
    "language": "ENGLISH",
    "format": "2D",
    "date": "2026-04-21"
  },
  ...
]
```

---

### Seats

#### GET /api/shows/:showId/seats
Get all seats for a show

**Response**:
```json
[
  {
    "id": 1,
    "seatNumber": "A1",
    "row": "A",
    "col": 1,
    "seatType": "PREMIUM",
    "price": 350,
    "status": "AVAILABLE",
    "showId": 10010
  },
  {
    "id": 2,
    "seatNumber": "A2",
    "row": "A",
    "col": 2,
    "seatType": "PREMIUM",
    "price": 350,
    "status": "BOOKED",
    "showId": 10010
  },
  ...
]
```

---

### Bookings

#### POST /api/booking/book
Create new booking

**Request Body**:
```json
{
  "showId": 10010,
  "userId": 1,
  "seatIds": [1, 2, 3],
  "totalAmount": 1050
}
```

**Response**:
```json
{
  "bookingId": 999123,
  "message": "Booking was successful",
  "responseStatus": "SUCCESS"
}
```

#### POST /api/booking/confirm/:bookingId
Confirm booking (payment processed)

**Response**:
```json
{
  "bookingId": 999123,
  "message": "Booking confirmed",
  "responseStatus": "SUCCESS"
}
```

---

### User Management

#### POST /api/user/signup
Register new user

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "phone": "+919876543210"
}
```

**Response**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "responseStatus": "SUCCESS"
}
```

#### POST /api/user/login
Login user

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Error Handling

### API Error Pattern

```javascript
try {
  const data = await movieService.getAll();
  setMovies(data);
} catch (error) {
  console.error('Error:', error.message);
  // Mock data is returned if API call fails
  setMovies(MOCK_MOVIES);
}
```

### Common Error Codes

```
400 - Bad Request (invalid data)
401 - Unauthorized (invalid token)
404 - Not Found
500 - Server Error
```

---

## Usage Examples

### Example 1: Fetch and Display Movies

```javascript
import { useState, useEffect } from 'react';
import { movieService } from '../services/api';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await movieService.getAll();
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>
          <h3>{movie.name}</h3>
          <p>{movie.genre}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Book Seats

```javascript
import { useState } from 'react';
import { bookingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function BookSeats({ showId, seats }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);
      const total = selected.reduce((sum, s) => sum + s.price, 0);
      
      const response = await bookingService.book({
        showId,
        userId: user.id,
        seatIds: selected.map(s => s.id),
        totalAmount: total,
      });

      if (response.responseStatus === 'SUCCESS') {
        console.log('Booking successful:', response.bookingId);
        // Redirect to summary page
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {seats.map(seat => (
        <button
          key={seat.id}
          onClick={() => setSelected([...selected, seat])}
          disabled={seat.status === 'BOOKED'}
        >
          {seat.seatNumber}
        </button>
      ))}
      <button onClick={handleBooking} disabled={loading}>
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </div>
  );
}
```

### Example 3: Authenticate User

```javascript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await userService.login({ email, password });
      login(userData);  // Save to context
      navigate('/');    // Redirect
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Mock Data Reference

All services include comprehensive mock data:

- **8 Movies**: With ratings, cast, trailers, descriptions
- **5 Theatres**: In different locations
- **40 Shows**: Multiple times and formats
- **96 Seats**: Per show with realistic pricing
- **Mock Auth**: ID 1, any email/password

### Toggle Mock Data

To always use mock data (even if API works), modify in `src/services/api.js`:

```javascript
// Add this to force mock data
const API_DISABLED = true;

export const movieService = {
  getAll: async () => {
    // Always return mock
    return MOVIES;
  },
};
```

---

## Debugging API Calls

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action
4. See request/response details

### Console Logging
```javascript
// In api.js interceptors
api.interceptors.request.use((config) => {
  console.log('API Request:', config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);
```

---

## Testing Checklist

- [ ] All 8 movies load and display
- [ ] Movie details show trailer
- [ ] Theatres list appears
- [ ] Shows display for selected theatre
- [ ] Seat grid renders correctly
- [ ] Seat selection works
- [ ] Booking confirmation page appears
- [ ] User can login/signup
- [ ] Protected routes redirect to auth

---

## Production Deployment

Update API URL in `.env`:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

The proxy in `vite.config.js` will automatically route `/api` requests there.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| 404 errors | Check backend running, endpoint exists |
| 401 errors | JWT token expired, re-login |
| CORS errors | Backend must have CORS enabled |
| Slow responses | Check network tab, API timeout set to 10s |
| Always returns mock | Check API endpoint is correct |

---

Need more info? Check `src/services/api.js` for all service methods!
