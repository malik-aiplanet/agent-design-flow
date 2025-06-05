import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API configuration and base service
const API_BASE_URL = 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Public endpoints
  PUBLIC: {
    LOGIN: `${API_BASE_URL}/public/users/login`,
    REGISTER: `${API_BASE_URL}/public/users/register`,
    REFRESH: `${API_BASE_URL}/public/users/refresh`,
  },
  // Private endpoints
  PRIVATE: {
    USER_ME: `${API_BASE_URL}/private/users/me`,
    MODELS: `${API_BASE_URL}/private/models`,
    AGENTS: `${API_BASE_URL}/private/agents`,
    TOOLS: `${API_BASE_URL}/private/tools`,
    // Add other private endpoints as needed
  }
};

export interface ApiError {
  message: string;
  status?: number;
}

class ApiServiceClass {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token && config.url?.includes('/private/')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            // Call refresh endpoint
            const response = await axios.post(`${API_BASE_URL}/public/users/refresh`, refreshToken, {
              headers: { 'Content-Type': 'application/json' }
            });

            const { access_token, refresh_token, token_type } = response.data;

            // Update stored tokens
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('token_type', token_type);

            // Retry all queued requests with new token
            this.refreshSubscribers.forEach(callback => callback(access_token));
            this.refreshSubscribers = [];

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens();
            this.refreshSubscribers = [];

            // Redirect to login or emit auth error event
            window.dispatchEvent(new CustomEvent('auth:logout'));

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Transform axios error to our ApiError format
        const apiError: ApiError = {
          message: error.response?.data?.detail ||
                   error.response?.data?.message ||
                   error.message ||
                   'Network error occurred',
          status: error.response?.status || 0
        };

        return Promise.reject(apiError);
      }
    );
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
  }

  async request<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance({
        url,
        ...config,
      });
      return response.data;
    } catch (error) {
      throw error; // Already transformed by interceptor
    }
  }

  async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      data,
    });
  }

  async put<T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      data,
    });
  }

  async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  // Method to make requests without base URL (for full URLs)
  async requestFullUrl<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        url,
        ...config,
      });
      return response.data;
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.response?.data?.detail ||
                 error.response?.data?.message ||
                 error.message ||
                 'Network error occurred',
        status: error.response?.status || 0
      };
      throw apiError;
    }
  }
}

// Export singleton instance
export const ApiService = new ApiServiceClass();