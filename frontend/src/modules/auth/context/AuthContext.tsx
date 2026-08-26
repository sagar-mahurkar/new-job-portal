import { useState, useEffect, createContext } from "react";
import type { ReactNode } from "react";
import type { User } from "@/shared/types/user";
import { STORAGE_KEYS } from "@/shared/constants/storage";

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

type AuthState = {
    token: string | null;
    user: User | null;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    user: null,
  });

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const restoreSession = () => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {        
        setAuth({
          token: storedToken,
          user: JSON.parse(storedUser)
        })
      } catch {
        clearSession();
      }
    }
  };

  // Restore token from localStorage on app load
  useEffect(() => {
    restoreSession();
    setLoading(false); 
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setAuth({
      token: newToken,
      user: newUser,
    });
  };

  const logout = () => {
    clearSession();
    setAuth({
      token: null,
      user: null,
    });
  };
  const { token, user } = auth;
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ token, user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };