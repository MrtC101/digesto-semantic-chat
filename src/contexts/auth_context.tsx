import authService from '@/lib/auth_service';
import { buildTags } from '@/components/predfined';
import { Modo, Tag } from '@/components/chat/types';
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

interface AuthContextType {
  username: string | null;
  modos: Modo[];
  tags: Tag[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUser] = useState<string | null>(null);
  const [modos, setModos] = useState<Modo[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const data = await authService.checkAuth();
      setIsAuthenticated(data.logged_in);
      setUser(data.usuario);
      setModos(data.modos ?? []);
    } catch (error) {
      setIsAuthenticated(false);
      setModos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    setIsLoading(true);
    try {
      const data = await authService.validateToken(token);
      setUser(data.usuario);
      setModos(data.modos ?? []);
      setIsAuthenticated(true);
    } catch (err) {
      await authService.logout();
      setIsAuthenticated(false);
      setModos([]);
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
    setModos([]);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Los modos habilitados del usuario definen qué chats puede crear
  const tags = useMemo(() => buildTags(modos), [modos]);

  return (
    <AuthContext.Provider
      value={{
        username: username,
        modos,
        tags,
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