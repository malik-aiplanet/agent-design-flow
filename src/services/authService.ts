import { ApiService, API_ENDPOINTS, ApiError } from '@/lib/api';

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
      const response = await fetch(API_ENDPOINTS.PUBLIC.LOGIN, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage: string;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || 'Login failed';
        } catch {
          errorMessage = 'Login failed';
        }

        throw new Error(errorMessage);
      }

      const data: TokenResponse = await response.json();

      const tokens: AuthTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type
      };

      AuthService.setTokens(tokens);
      return tokens;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  static async register(userData: RegisterRequest): Promise<User> {
    const payload = {
      ...userData,
      role: userData.role || 'normal'
    };

    try {
      const response = await ApiService.post<User>(
        API_ENDPOINTS.PUBLIC.REGISTER,
        payload
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
      const response = await ApiService.post<TokenResponse>(
        API_ENDPOINTS.PUBLIC.REFRESH,
        tokens.refreshToken
      );

      const newTokens: AuthTokens = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type
      };

      AuthService.setTokens(newTokens);
      return newTokens;
    } catch (error) {
      AuthService.clearTokens();
      throw new Error('Token refresh failed');
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      // Check if token needs refresh
      const tokens = AuthService.getTokens();
      if (tokens && AuthService.isTokenExpired(tokens.accessToken)) {
        await AuthService.refreshToken();
      }

      const user = await ApiService.get<User>(API_ENDPOINTS.PRIVATE.USER_ME);
      return user;
    } catch (error) {
      const apiError = error as ApiError;

      // If unauthorized, clear tokens
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

    // Automatic token refresh for API calls
  static async ensureValidToken(): Promise<string | null> {
    const tokens = AuthService.getTokens();

    if (!tokens) {
      return null;
    }

    if (AuthService.isTokenExpired(tokens.accessToken)) {
      try {
        const refreshedTokens = await AuthService.refreshToken();
        return refreshedTokens?.accessToken || null;
      } catch {
        return null;
      }
    }

    return tokens.accessToken;
  }
}

export default AuthService;