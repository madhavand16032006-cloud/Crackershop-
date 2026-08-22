export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  stock: number;
  soundLevel?: 'Mute' | 'Low' | 'Medium' | 'High';
  pieceCount?: string; // e.g. "10 Pieces / Box" or "1 Box (5 Pcs)"
  featured?: boolean;
  active: boolean;
  tags?: string[];
  safetyRating?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount?: number;
  active: boolean;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
}

export interface OrderItemSummary {
  productId: string;
  productName: string;
  category: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  subtotal: number;
  image: string;
  pieceCount?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #ORD1025
  customer: CustomerDetails;
  items: OrderItemSummary[];
  totalItems: number;
  totalAmount: number;
  totalSavings: number;
  status: OrderStatus;
  whatsappStatus: 'SENT' | 'PENDING' | 'CLICKED';
  paymentNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  ownerName: string;
  ownerPhoto: string;
  logo: string;
  banner: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  announcement: string;
  minimumOrderAmount: number;
  upiId?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  festivalSeason: string;
  licenseNumber?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  profileImage?: string;
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  city: string;
  subject: string;
  message: string;
  status: 'NEW' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalOrders: number;
  newOrders: number;
  confirmedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  estimatedOrderValue: number;
  lowStockCount: number;
  recentOrders: Order[];
  popularProducts: (Product & { orderCount: number })[];
  lowStockProducts: Product[];
  recentEnquiries: CustomerEnquiry[];
}
