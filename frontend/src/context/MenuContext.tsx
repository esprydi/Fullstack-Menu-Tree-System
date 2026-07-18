"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { menuApi, MenuData } from '../services/api';

interface MenuContextType {
  trees: MenuData[];
  selectedMenu: MenuData | null;
  setSelectedMenu: (menu: MenuData | null) => void;
  refreshTrees: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [trees, setTrees] = useState<MenuData[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTrees = async () => {
    setIsLoading(true);
    try {
      const data = await menuApi.getTrees();
      setTrees(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat menu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTrees();
  }, []);

  return (
    <MenuContext.Provider value={{ trees, selectedMenu, setSelectedMenu, refreshTrees, isLoading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
