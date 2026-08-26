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
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(() => {
    try {
      const cached = localStorage.getItem('sivakasi_shop_settings');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const cached = localStorage.getItem('sivakasi_categories');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(!shopSettings);
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
      try {
        localStorage.setItem('sivakasi_shop_settings', JSON.stringify(settingsData));
        localStorage.setItem('sivakasi_categories', JSON.stringify(categoriesData));
      } catch (e) {
        console.warn('Could not cache shop data in localStorage', e);
      }
    } catch (err) {
      console.error('Failed to load shop configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (data: Partial<ShopSettings> & { adminPassword?: string; adminUsername?: string; adminName?: string; adminEmail?: string }) => {
    const updated = await api.updateShopSettings(data);
    setShopSettings(updated);
    try {
      localStorage.setItem('sivakasi_shop_settings', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not cache shop data in localStorage', e);
    }
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
