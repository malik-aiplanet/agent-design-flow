import { ApiService, API_ENDPOINTS, ApiError } from '@/lib/api';
import axios from 'axios';

// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  role: string;
  organization_id: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  username: string; // API expects email as username
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  role?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TOKEN_TYPE_KEY = 'token_type';

  // Token management
  static setTokens(tokens: AuthTokens): void {
    localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(AuthService.TOKEN_TYPE_KEY, tokens.tokenType);
  }

  static getTokens(): AuthTokens | null {
    const accessToken = localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);
    const tokenType = localStorage.getItem(AuthService.TOKEN_TYPE_KEY);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      tokenType: tokenType || 'bearer'
    };
  }

  static clearTokens(): void {
    localStorage.removeItem(AuthService.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AuthService.TOKEN_TYPE_KEY);
  }

  // Check if access token is expired or will expire soon (5 minutes)
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp - currentTime < 300; // 5 minutes buffer
    } catch {
      return true;
    }
  }

  // Auth API calls
  static async login(credentials: LoginRequest): Promise<AuthTokens> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
      const response = await axios.post<TokenResponse>(API_ENDPOINTS.PUBLIC.LOGIN, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const tokens: AuthTokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenType: response.data.token_type
      };

      AuthService.setTokens(tokens);
      return tokens;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message ||
                          error.message ||
                          'Login failed';
      throw new Error(errorMessage);
    }
  }

  static async register(userData: RegisterRequest): Promise<User> {
    const payload = {
      ...userData,
      role: userData.role || 'normal'
    };

    try {
      const response = await ApiService.requestFullUrl<User>(
        API_ENDPOINTS.PUBLIC.REGISTER,
        {
          method: 'POST',
          data: payload,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Registration failed');
    }
  }

  static async refreshToken(): Promise<AuthTokens | null> {
    const tokens = AuthService.getTokens();
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<TokenResponse>(
        API_ENDPOINTS.PUBLIC.REFRESH,
        tokens.refreshToken,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newTokens: AuthTokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenType: response.data.token_type
      };

      AuthService.setTokens(newTokens);
      return newTokens;
    } catch (error: any) {
      AuthService.clearTokens();
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.message ||
                          'Token refresh failed';
      throw new Error(errorMessage);
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      // The axios interceptor will handle token refresh automatically
      const user = await ApiService.get<User>(API_ENDPOINTS.PRIVATE.USER_ME);
      return user;
    } catch (error) {
      const apiError = error as ApiError;

      // If unauthorized, clear tokens (interceptor should have already handled this)
      if (apiError.status === 401) {
        AuthService.clearTokens();
      }

      throw new Error(apiError.message || 'Failed to get user data');
    }
  }

  static async logout(): Promise<void> {
    AuthService.clearTokens();
    // Could call a logout endpoint here if needed
  }

  static isAuthenticated(): boolean {
    const tokens = AuthService.getTokens();
    return !!tokens?.accessToken;
  }

  // This method is now simplified since axios interceptors handle token refresh automatically
  static async ensureValidToken(): Promise<string | null> {
    const tokens = AuthService.getTokens();
    return tokens?.accessToken || null;
  }
}

export default AuthService;