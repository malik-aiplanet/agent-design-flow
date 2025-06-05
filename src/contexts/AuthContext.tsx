import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AuthService, { User, LoginRequest, RegisterRequest } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  // Query for current user - only runs if authenticated
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
    error: userError
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: AuthService.getCurrentUser,
    enabled: AuthService.isAuthenticated(),
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onError: (error: Error) => {
      throw error;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
    },
  });

  // Handle authentication errors
  useEffect(() => {
    if (userError && (userError as any)?.status === 401) {
      // Token is invalid, clear everything
      AuthService.clearTokens();
      queryClient.clear();
    }
  }, [userError, queryClient]);

  // Listen for auth:logout events from axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      console.log('Auto-logout triggered by axios interceptor');
      AuthService.clearTokens();
      queryClient.clear();
      // You could also redirect to login page here if needed
      // window.location.href = '/login';
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [queryClient]);

  // Auto-refresh token when app starts if user is authenticated
  useEffect(() => {
    const initializeAuth = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          await AuthService.ensureValidToken();
          refetchUser();
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          AuthService.clearTokens();
          queryClient.clear();
        }
      }
    };

    initializeAuth();
  }, [refetchUser, queryClient]);

  const handleLogin = async (credentials: LoginRequest): Promise<void> => {
    try {
      await loginMutation.mutateAsync(credentials);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData: RegisterRequest): Promise<void> => {
    try {
      await registerMutation.mutateAsync(userData);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = (): void => {
    logoutMutation.mutate();
  };

  const isAuthenticated = AuthService.isAuthenticated() && !!user;
  const isLoading = isUserLoading || loginMutation.isPending || registerMutation.isPending;

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};