import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  login,
  signup,
  logout,
  forgotPassword,
  resetPassword,
} from '../api/auth';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('authUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    };
    checkLoggedIn();
  }, []);

  const authLogin = async (email: string, password: string) => {
    const userData = await login(email, password);
    setUser(userData.user);
    localStorage.setItem('authUser', JSON.stringify(userData.user));
  };

  const authSignup = async (
    username: string,
    email: string,
    password: string,
  ) => {
    await signup(username, email, password);
  };

  const authLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const handleForgotPassword = async (email: string) => {
    await forgotPassword(email);
    // Handle any necessary state updates or user feedback
  };

  const handleResetPassword = async (
    token: string | undefined,
    newPassword: string,
  ) => {
    await resetPassword(token, newPassword);
    // Handle any necessary state updates or user feedback
  };

  const value = {
    user,
    login: authLogin,
    signup: authSignup,
    logout: authLogout,
    setUser,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
