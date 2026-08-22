import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShopSettings, Category } from '../types';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ShopContextType {
  shopSettings: ShopSettings | null;
  categories: Category[];
  loading: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshShopData: () => Promise<void>;
  updateSettings: (data: Partial<ShopSettings>) => Promise<ShopSettings>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const refreshShopData = async () => {
    try {
      const [settingsData, categoriesData] = await Promise.all([
        api.getShopSettings(),
        api.getCategories()
      ]);
      setShopSettings(settingsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load shop configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (data: Partial<ShopSettings>) => {
    const updated = await api.updateShopSettings(data);
    setShopSettings(updated);
    showToast('Shop details updated successfully!');
    return updated;
  };

  useEffect(() => {
    refreshShopData();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shopSettings,
        categories,
        loading,
        toasts,
        showToast,
        removeToast,
        refreshShopData,
        updateSettings
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
