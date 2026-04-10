import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  nickname: string;
  avatar: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, 'isLoggedIn'>) => void;
  logout: () => void;
  updateProfile: (nickname: string, avatar: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('aether-auth-user');
    const savedNickname = localStorage.getItem('aether-nickname');
    const savedAvatar = localStorage.getItem('aether-avatar');
    const savedId = localStorage.getItem('aether-user-id');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (savedNickname && savedNickname !== 'Guest' && savedId) {
      // Migrate from old storage if exists
      const newUser = {
        id: savedId,
        nickname: savedNickname,
        avatar: savedAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${savedId}`,
        isLoggedIn: true
      };
      setUser(newUser);
      localStorage.setItem('aether-auth-user', JSON.stringify(newUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: Omit<User, 'isLoggedIn'>) => {
    const newUser = { ...userData, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('aether-auth-user', JSON.stringify(newUser));
    localStorage.setItem('aether-user-id', newUser.id);
    localStorage.setItem('aether-nickname', newUser.nickname);
    localStorage.setItem('aether-avatar', newUser.avatar);
    
    // Dispatch event for components that don't use context (like legacy parts)
    window.dispatchEvent(new Event('authStatusChanged'));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aether-auth-user');
    // We might keep aether-user-id for history but isLoggedIn will be false
    window.dispatchEvent(new Event('authStatusChanged'));
  };

  const updateProfile = (nickname: string, avatar: string) => {
    if (user) {
      const updatedUser = { ...user, nickname, avatar };
      setUser(updatedUser);
      localStorage.setItem('aether-auth-user', JSON.stringify(updatedUser));
      localStorage.setItem('aether-nickname', nickname);
      localStorage.setItem('aether-avatar', avatar);
      window.dispatchEvent(new Event('authStatusChanged'));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
