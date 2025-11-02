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
      
       // ✅ Token expired - try to refresh
      if (response.status === 401 && !url.includes('/auth/')) {
        console.log('🔄 Token expired, attempting auto-refresh...');
        return await this.handleTokenRefresh(url, options);
      }

      return response;
    }catch (error) {
      // ✅ COMPLETELY SILENT for network errors during refresh
      // Don't log anything, don't throw to console
      if (error.message.includes('Authentication') || 
          error.message.includes('token') ||
          error.name === 'TypeError') {
        // Silent fail - no console logging
      } else {
        console.error('API request failed:', error);
      }
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
       
      const refreshResponse = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include', // Refresh token cookie is automatically sent
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
 
        this.retryFailedRequests();
        
        // ✅ Retry the original request
        return await fetch(originalUrl, {
          ...originalOptions,
          credentials: 'include',
        });
      } else {
        
        this.handleRefreshFailure();
        // ✅ Throw silent error
        const error = new Error('Authentication failed');
        error.silent = true;
        throw error;

      }
    } catch (error) {
      this.handleRefreshFailure();
         // ✅ Mark as silent error
      error.silent = true;
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  retryFailedRequests() {
    
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