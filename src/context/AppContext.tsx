import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  cartItemCount: number;
  favouriteCount: number;
  isLoggedIn: boolean;
  updateCartCount: (count: number) => void;
  updateFavouriteCount: (count: number) => void;
  setLoggedIn: (loggedIn: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [cartItemCount, setCartItemCount] = useState(3);
  const [favouriteCount, setFavouriteCount] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateCartCount = (count: number) => {
    setCartItemCount(count);
  };

  const updateFavouriteCount = (count: number) => {
    setFavouriteCount(count);
  };

  const setLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  const value = {
    cartItemCount,
    favouriteCount,
    isLoggedIn,
    updateCartCount,
    updateFavouriteCount,
    setLoggedIn,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
