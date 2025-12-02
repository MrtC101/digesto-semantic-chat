import authService from '@/lib/auth_service';
import { CaseUpper } from 'lucide-react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  username: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const data = await authService.checkAuth();
      setIsAuthenticated(data.logged_in);
      setUser(data.usuario);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    setIsLoading(true);
    try {
      const username = await authService.validateToken(token);
      setUser(username);
      setIsAuthenticated(true);
    } catch (err) {
      await authService.logout();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    }finally {
      setIsLoading(false);
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username: username,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};