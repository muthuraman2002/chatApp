import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [apiUrl, setApiUrl] = useState('http://localhost:3000');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <UserContext.Provider value={{ theme, toggleTheme, apiUrl, setApiUrl }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}