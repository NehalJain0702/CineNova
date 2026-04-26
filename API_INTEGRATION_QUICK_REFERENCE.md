# Quick Reference - API Integration Best Practices

## 🚀 Template Code for API Services

### **Complete Axios Setup with Interceptors**

```javascript
import axios from 'axios'

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const DEBUG_API = import.meta.env.VITE_DEBUG_API === 'true'

if (DEBUG_API) {
  console.log('🔧 API Configuration:', { baseURL: API_BASE_URL })
}

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Add authorization token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (DEBUG_API) {
      console.log('📤 API Request:', {
        method: config.method.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        params: config.params,
      })
    }

    return config
  },
  error => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    if (DEBUG_API) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
      })
    }
    return response
  },
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    })

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
```

---

## 🎯 Template: Get Resource by ID with Full Error Handling

```javascript
/**
 * Service for fetching a resource by ID
 * 
 * KEY POINTS:
 * ✅ Convert string ID to number
 * ✅ Validate ID before API call
 * ✅ Handle all error scenarios
 * ✅ Provide detailed logging
 */
export const resourceService = {
  /**
   * Get resource by ID
   * @param {string|number} id - Resource ID (usually from URL params)
   * @returns {Promise<Object>} Resource data
   * @throws {Error} Detailed error message
   */
  getById: async (id) => {
    // Step 1: Validate ID exists
    if (!id) {
      const error = 'Resource ID is required'
      console.error(`❌ ${error}`)
      throw new Error(error)
    }

    // Step 2: Check for invalid string representations
    if (id === 'undefined' || id === 'null' || id === '') {
      const error = `Resource ID is invalid: "${id}"`
      console.error(`❌ ${error}`)
      throw new Error(error)
    }

    // Step 3: Convert to number (important for URL params)
    const numericId = Number(id)
    
    // Step 4: Validate it's a valid positive number
    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
      const error = `Resource ID must be a positive integer, received: "${id}"`
      console.error(`❌ ${error}`)
      throw new Error(error)
    }

    if (DEBUG_API) {
      console.log(`🔍 Fetching resource:`, {
        original: id,
        converted: numericId,
        endpoint: `/resources/${numericId}`,
      })
    }

    try {
      // Step 5: Make the API call with numeric ID
      const response = await axiosInstance.get(`/resources/${numericId}`)
      
      if (DEBUG_API) {
        console.log(`✅ Resource fetched:`, { id: response.data.id })
      }

      return response.data
    } catch (error) {
      // Step 6: Detailed error handling
      const statusCode = error.response?.status
      const message = error.response?.data?.message || error.message

      // Map HTTP status to user-friendly message
      let userMessage
      if (statusCode === 404) {
        userMessage = 'Resource not found'
      } else if (statusCode === 400) {
        userMessage = 'Invalid request'
      } else if (statusCode >= 500) {
        userMessage = 'Server error. Please try again later.'
      } else {
        userMessage = message
      }

      console.error(`❌ Error fetching resource:`, {
        status: statusCode,
        message,
        userMessage,
      })

      throw error // Re-throw so component can handle it
    }
  },
}
```

---

## ⚛️ Template: React Component Using getById

```javascript
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resourceService } from '../services/apiService'

function ResourceDetailPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Validate and convert ID from URL params
   * ⚠️ CRITICAL: useParams() returns strings!
   */
  const validateResourceId = () => {
    if (!resourceId) return null

    const numericId = Number(resourceId)
    
    // Validate
    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
      console.error('❌ Invalid resource ID:', resourceId)
      return null
    }

    console.log('✅ Valid resource ID:', numericId)
    return numericId
  }

  useEffect(() => {
    loadResource()
  }, [resourceId])

  const loadResource = async () => {
    try {
      setLoading(true)
      setError(null)

      // Validate ID before API call
      const validId = validateResourceId()
      
      if (!validId) {
        setError(`Invalid resource ID: "${resourceId}"`)
        setLoading(false)
        return
      }

      // Fetch resource
      console.log(`📤 Fetching resource: ${validId}`)
      const data = await resourceService.getById(validId)
      
      if (!data) {
        throw new Error('Empty response from server')
      }

      console.log('✅ Resource loaded:', data)
      setResource(data)
    } catch (err) {
      // Detailed error handling
      const statusCode = err.response?.status
      const message = err.response?.data?.message || err.message

      // User-friendly error messages
      const userError = statusCode === 404
        ? 'Resource not found'
        : statusCode === 400
        ? 'Invalid request'
        : statusCode >= 500
        ? 'Server error. Please try again later.'
        : message || 'Failed to load resource'

      console.error('🔴 Error loading resource:', {
        status: statusCode,
        message,
        userError,
      })

      setError(userError)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadResource()
  }

  // Loading state
  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-red-600">
        <p>{error}</p>
        <button onClick={handleRetry} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Retry
        </button>
      </div>
    )
  }

  // Not found state
  if (!resource) {
    return <div className="p-8 text-gray-600">Resource not found</div>
  }

  // Success state
  return (
    <div className="p-8">
      <h1>{resource.name}</h1>
      {/* Render resource details */}
    </div>
  )
}

export default ResourceDetailPage
```

---

## 🔧 Spring Boot Controller Template

```java
package com.example.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

  /**
   * Get resource by ID
   * 
   * ✅ Validates ID is positive
   * ✅ Returns proper HTTP status codes
   * ✅ Includes detailed error messages
   * ✅ Logs for debugging
   */
  @GetMapping("/{id}")
  public ResponseEntity<Resource> getResourceById(@PathVariable int id) {
    System.out.println("🔍 GET /api/resources/" + id);

    // Validate ID
    if (id <= 0) {
      System.err.println("❌ Invalid ID: " + id);
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "ID must be a positive integer, received: " + id
      );
    }

    // Fetch from database (example)
    Resource resource = getResourceFromDatabase(id);

    // Check if found
    if (resource == null) {
      System.err.println("❌ Resource not found: " + id);
      throw new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Resource with ID " + id + " not found"
      );
    }

    System.out.println("✅ Returning resource: " + resource.getName());
    return ResponseEntity.ok(resource);
  }

  private Resource getResourceFromDatabase(int id) {
    // Implement database lookup
    // For now, return null (will trigger 404)
    return null;
  }
}
```

---

## 📋 Environment Configuration Files

### **.env.local (Development)**
```env
# Backend API URL for development
VITE_API_URL=http://localhost:8080/api

# Enable detailed API logging
VITE_DEBUG_API=true

# Environment flag
VITE_APP_ENV=development
```

### **Render Environment Variables (Production)**
In Render dashboard, set:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_DEBUG_API=false
VITE_APP_ENV=production
```

---

## 🧪 Testing Checklist

### **Frontend Testing**
- [ ] Console shows correct API URLs
- [ ] Network tab shows correct endpoints
- [ ] Status codes are correct (200, 404, etc.)
- [ ] Error messages are displayed to user
- [ ] Retry button works

### **Backend Testing**
- [ ] Spring Boot logs show incoming requests
- [ ] Response includes correct data
- [ ] 404 errors return proper message
- [ ] 400 errors for invalid IDs work
- [ ] CORS headers are present

### **Integration Testing**
- [ ] Development: Frontend on 3000, Backend on 8080
- [ ] Production: Both on Render with correct URLs
- [ ] Mobile: Test with real device or DevTools device mode
- [ ] Network: Test with throttled connection

---

## 🚨 Common Pitfalls to Avoid

| ❌ Wrong | ✅ Right |
|---------|---------|
| `movieId` from useParams (string) | `Number(movieId)` |
| `/api` as base URL | `http://localhost:8080/api` |
| No error details | Detailed error logging |
| No ID validation | Validate before API call |
| String comparison for IDs | Numeric comparison |
| No loading state | Show loading UI |
| Ignoring null response | Check response before use |
| Mixed production/dev URLs | Single source of truth in .env |

---

## 🔗 API Call Diagram

```
┌─ URL Parameter ─────────────────────────┐
│ /movie/1                                 │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ React useParams ───────────────────────┐
│ { movieId: "1" }  (STRING!)              │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ Component Validation ──────────────────┐
│ Number("1") → 1 (NUMBER)                 │
│ isNaN? No  |  > 0? Yes  |  Integer? Yes  │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ API Service Call ──────────────────────┐
│ movieService.getById(1)                  │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ Axios Request ─────────────────────────┐
│ GET http://localhost:8080/api/movies/1  │
│ Headers: { Authorization: Bearer ... }  │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ Spring Boot Handler ───────────────────┐
│ @GetMapping("/{id}")                     │
│ @PathVariable int id = 1  ✅            │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ Database Query ────────────────────────┐
│ SELECT * FROM movies WHERE id = 1       │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ Response ──────────────────────────────┐
│ HTTP 200 OK                              │
│ { id: 1, title: "Avengers", ... }       │
└─────────┬───────────────────────────────┘
          │
          ▼
┌─ Frontend Display ──────────────────────┐
│ Movie details page rendered              │
└─────────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Always convert IDs from URL params to numbers:**
   ```javascript
   const id = Number(useParams().id)
   ```

2. **Use environment variables for URLs:**
   ```javascript
   const baseURL = import.meta.env.VITE_API_URL
   ```

3. **Log at key points:**
   ```javascript
   console.log('🔍 Fetching...', { id, endpoint })
   console.log('✅ Success:', data)
   console.error('❌ Error:', error)
   ```

4. **Validate on both frontend and backend:**
   - Frontend: Fast feedback to user
   - Backend: Security and data integrity

5. **Use consistent naming:**
   ```javascript
   // Use same name throughout
   movieId → numericMovieId → numeric movie ID parameter
   ```

6. **Test error scenarios:**
   ```javascript
   // Test invalid IDs
   -1, 0, "abc", null, undefined
   ```

---

## 📞 Getting Help

If you're still having issues:

1. **Check the logs** - Browser console and Spring Boot logs
2. **Verify URLs** - Use Network tab to see exact request
3. **Test endpoints** - Use Postman/Insomnia to test backend directly
4. **Check CORS** - Make sure backend allows frontend origin
5. **Verify environment** - Ensure .env variables are set correctly

---

