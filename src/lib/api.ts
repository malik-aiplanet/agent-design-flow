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

export class ApiService {
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private static async ensureValidToken(): Promise<void> {
    try {
      const AuthService = (await import('@/services/authService')).default;
      await AuthService.ensureValidToken();
    } catch (error) {
      // If auth service fails, we'll let the request proceed
      // The backend will return 401 if token is invalid
      console.warn('Failed to refresh token:', error);
    }
  }

    static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure valid token for private endpoints
    if (url.includes('/private/')) {
      await this.ensureValidToken();
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}`;
        } catch {
          errorMessage = errorText || `HTTP ${response.status}`;
        }

        throw {
          message: errorMessage,
          status: response.status
        } as ApiError;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text() as T;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        message: 'Network error occurred',
        status: 0
      } as ApiError;
    }
  }

  static async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  static async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}