// src/utils/apiInterceptor.js
class ApiInterceptor {
  constructor() {
    this.isRefreshing = false;
    this.failedRequests = [];
  }

  async request(url, options = {}) {
    // ✅ Cookies are automatically included with credentials: 'include'
    const config = {
      ...options,
      credentials: 'include', // Ensure cookies are sent
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // ✅ Token expired - try to refresh (only for 401 and not auth endpoints)
      if (response.status === 401 && !url.includes('/auth/')) {
        return await this.handleTokenRefresh(url, options);
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async handleTokenRefresh(originalUrl, originalOptions) {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedRequests.push({ 
          resolve, 
          reject, 
          originalUrl, 
          originalOptions 
        });
      });
    }

    this.isRefreshing = true;

    try {
      console.log('Attempting token refresh...');
      
      // ✅ CHANGE: Use '/api/auth/refresh-token' instead of '/api/auth/refresh'
      const refreshResponse = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include', // Refresh token cookie is automatically sent
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
        console.log('Token refresh successful');
        
        // ✅ Retry all failed requests
        this.retryFailedRequests();
        
        // ✅ Retry the original request
        return await fetch(originalUrl, {
          ...originalOptions,
          credentials: 'include',
        });
      } else {
        console.log('Token refresh failed');
        this.handleRefreshFailure();
        throw new Error('Authentication session expired. Please sign in again.');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.handleRefreshFailure();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  retryFailedRequests() {
    console.log(`Retrying ${this.failedRequests.length} failed requests`);
    
    this.failedRequests.forEach(({ resolve, reject, originalUrl, originalOptions }) => {
      fetch(originalUrl, {
        ...originalOptions,
        credentials: 'include',
      })
        .then(resolve)
        .catch(reject);
    });
    this.failedRequests = [];
  }

  handleRefreshFailure() {
    // Clear any auth state and redirect to login
    console.log('Redirecting to signin page...');
    
    // Clear Redux state if needed
    if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
      window.location.href = '/signin';
    }
  }

  // ✅ Helper methods for different HTTP methods
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(url, data, options = {}) {
    return this.request(url, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    });
  }

  async put(url, data, options = {}) {
    return this.request(url, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(data) 
    });
  }

  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

export const apiInterceptor = new ApiInterceptor();