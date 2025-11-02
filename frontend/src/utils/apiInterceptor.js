// src/utils/apiInterceptor.js
class ApiInterceptor {
  constructor() {
    this.isRefreshing = false;
    this.failedRequests = [];
  }

  async request(url, options = {}) {
    const config = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
        const response = await fetch(url, config);
        
        // ✅ 401 Error - Silent refresh (no console log)
        if (response.status === 401 && !url.includes('/auth/')) {
          return await this.handleTokenRefresh(url, options);
        }

        return response;
      } catch (error) {
        // ✅ COMPLETELY SILENT for auth/token errors
        const isSilentError = 
          error.message?.includes('Authentication') || 
          error.message?.includes('Unauthorized') ||
          error.message?.includes('token') ||
          error.name === 'TypeError' ||
          error.silent;

        if (!isSilentError) {
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
      // ✅ Silent refresh token call
      const refreshResponse = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
        // ✅ Retry all failed requests silently
        this.retryFailedRequests();
        
        // ✅ IMPORTANT: Use this.request() instead of fetch()
        return await this.request(originalUrl, originalOptions);
      } else {
        // ✅ Silent failure - no console logs
        this.handleRefreshFailure();
        const error = new Error('Authentication failed');
        error.silent = true;
        throw error;
      }
    } catch (error) {
      // ✅ Silent error handling
      this.handleRefreshFailure();
      error.silent = true;
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  retryFailedRequests() {
    // ✅ Use this.request() for all retries to avoid console logs
    this.failedRequests.forEach(({ resolve, reject, originalUrl, originalOptions }) => {
      this.request(originalUrl, originalOptions)
        .then(resolve)
        .catch(reject);
    });
    this.failedRequests = [];
  }

  handleRefreshFailure() {
    // ✅ Silent redirect to login
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

  async patch(url, data, options = {}) {
    return this.request(url, { 
      ...options, 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    });
  }
}

export const apiInterceptor = new ApiInterceptor();