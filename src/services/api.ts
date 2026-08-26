import { Product, Category, Order, ShopSettings, AdminUser, DashboardStats, CustomerEnquiry } from '../types';

const getAuthHeader = () => {
  const token = localStorage.getItem('sivakasi_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Shop Settings
  async getShopSettings(): Promise<ShopSettings> {
    const res = await fetch('/api/shop');
    if (!res.ok) throw new Error('Failed to fetch shop settings');
    return res.json();
  },

  async updateShopSettings(data: Partial<ShopSettings>): Promise<ShopSettings> {
    const res = await fetch('/api/shop', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update shop settings');
    return res.json();
  },

  async updateSettings(data: Partial<ShopSettings> & { adminPassword?: string }): Promise<ShopSettings> {
    return this.updateShopSettings(data);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async deleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return true;
  },

  // Products
  async getProducts(params?: {
    category?: string;
    categoryId?: string;
    search?: string;
    featured?: boolean;
    activeOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.search) query.append('search', params.search);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    if (params?.activeOnly !== undefined) query.append('activeOnly', String(params.activeOnly));
    if (params?.minPrice !== undefined) query.append('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) query.append('maxPrice', String(params.maxPrice));
    if (params?.inStockOnly) query.append('inStockOnly', 'true');
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update product');
    }
    return res.json();
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return true;
  },

  async bulkUpdateProducts(action: string, ids: string[], payload?: any): Promise<boolean> {
    const res = await fetch('/api/products/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ action, ids, payload })
    });
    if (!res.ok) throw new Error('Bulk update failed');
    return true;
  },

  // Orders
  async createOrder(data: {
    customer: {
      fullName: string;
      mobile: string;
      whatsapp: string;
      address: string;
      city: string;
      pincode: string;
      notes?: string;
    };
    items: { productId: string; quantity: number }[];
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create order');
    }
    return res.json();
  },

  async getOrders(params?: { status?: string; search?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/orders?${query.toString()}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrder(id: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  async markWhatsAppSent(id: string): Promise<void> {
    await fetch(`/api/orders/${id}/whatsapp`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsappStatus: 'SENT' })
    }).catch(() => {});
  },

  async deleteOrder(id: string): Promise<boolean> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return true;
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/dashboard/stats', {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
    return res.json();
  },

  async getStats(): Promise<DashboardStats> {
    return this.getDashboardStats();
  },

  // Customer Enquiries
  async sendEnquiry(data: { name: string; mobile: string; email?: string; city?: string; subject?: string; message: string }): Promise<CustomerEnquiry> {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit enquiry');
    return res.json();
  },

  async submitEnquiry(data: { name: string; mobile: string; email?: string; city?: string; subject?: string; message: string }): Promise<CustomerEnquiry> {
    return this.sendEnquiry(data);
  },

  async getEnquiries(): Promise<CustomerEnquiry[]> {
    const res = await fetch('/api/enquiries', {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },

  async updateEnquiryStatus(id: string, status: string): Promise<CustomerEnquiry> {
    const res = await fetch(`/api/enquiries/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update enquiry status');
    return res.json();
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to delete enquiry');
    return true;
  },

  // Auth
  async login(usernameOrEmail: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid username or password');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: AdminUser }> {
    const res = await fetch('/api/auth/me', {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!res.ok) throw new Error('Failed to fetch authenticated user profile');
    return res.json();
  },

  async updateProfile(data: { name?: string; username?: string; email?: string; password?: string; profileImage?: string }): Promise<{ success: boolean; user: AdminUser }> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update admin profile');
    }
    return res.json();
  }
};
