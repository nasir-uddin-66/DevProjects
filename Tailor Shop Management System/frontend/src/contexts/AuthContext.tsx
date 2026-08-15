// @refresh reset
// AuthContext for managing authentication state

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { authService } from "../api/services";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserContext: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage and verify token
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify token is still valid by fetching current user
        authService
          .getCurrentUser()
          .then((currentUser) => {
            if (currentUser) {
              // Update stored user with latest data but keep token
              const updatedUser = { ...currentUser, token: parsedUser.token };
              setUser(currentUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
              // Token invalid, clear storage
              localStorage.removeItem("user");
              setUser(null);
            }
            setLoading(false);
          })
          .catch(() => {
            localStorage.removeItem("user");
            setUser(null);
            setLoading(false);
          });
      } catch (error) {
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = await authService.login(email, password);
      if (loggedInUser) {
        // Get token from localStorage (set by authService)
        const storedUser = localStorage.getItem("user");
        const userWithToken = storedUser
          ? JSON.parse(storedUser)
          : loggedInUser;
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address: string
  ): Promise<boolean> => {
    try {
      const newUser = await authService.signup(
        email,
        password,
        fullName,
        phone,
        address
      );
      // Token is already stored by authService
      setUser(newUser);
      return true;
    } catch (error: any) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUserContext = (updatedUser: User) => {
    setUser(updatedUser);
    const storedUser = localStorage.getItem("user");
    const userWithToken = storedUser ? JSON.parse(storedUser) : updatedUser;
    const userToStore = { ...updatedUser, token: userWithToken.token };
    localStorage.setItem("user", JSON.stringify(userToStore));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUserContext,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
