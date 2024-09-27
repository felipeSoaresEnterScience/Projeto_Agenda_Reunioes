// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface AuthContextType {
  token: string | undefined;
  login: (newToken: string, userData: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // AuthContext criado

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | undefined>();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("userData");

    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (newToken: string, userData: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(undefined);
    setIsAuthenticated(false);
    setUser(undefined);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Exportando o AuthContext para que outros arquivos possam utilizá-lo
export { AuthContext };
