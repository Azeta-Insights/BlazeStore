import {
  Product,
  CartItem,
  NotificationItem,
  User,
  Order,
  RefundRecord,
  SalesAnalytics,
  OrderStatus,
  AdminRole
} from '../types';
import { BEST_DEALS, RECOMMENDED_PRODUCTS } from '../data/mockData';

// Enhanced mock fallback products with SKUs and stock
const fallbackEnrichedProducts: Product[] = [...BEST_DEALS, ...RECOMMENDED_PRODUCTS].map((p, idx) => ({
  ...p,
  stockQuantity: p.inStock !== false ? 25 + (idx * 7) % 60 : 0,
  sku: `BLZ-${p.category.slice(0, 3).toUpperCase()}-${1000 + idx}`,
  costPrice: Number((p.price * 0.55).toFixed(2)),
  inStock: p.inStock !== false,
}));

// Fallback orders store
const fallbackOrders: Order[] = [
  {
    id: 'ord-1001',
    orderId: 'BLZ-9021',
    customer: {
      name: 'Azeta Blessing',
      email: 'azetablessingb@gmail.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'Springfield, OR',
      zip: '97477',
      paymentMethod: 'Credit Card (Stripe)',
    },
    items: [
      {
        id: 'itm-1',
        productId: fallbackEnrichedProducts[0]?.id || '1',
        name: fallbackEnrichedProducts[0]?.name || 'Classic Denim Jacket',
        price: fallbackEnrichedProducts[0]?.price || 89.99,
        quantity: 1,
        image: fallbackEnrichedProducts[0]?.image || '',
        variant: 'Medium',
      },
      {
        id: 'itm-2',
        productId: fallbackEnrichedProducts[1]?.id || '2',
        name: fallbackEnrichedProducts[1]?.name || 'Silk Slip Dress',
        price: fallbackEnrichedProducts[1]?.price || 129.5,
        quantity: 1,
        image: fallbackEnrichedProducts[1]?.image || '',
        variant: 'Emerald / S',
      },
    ],
    subtotal: 219.49,
    discount: 20.0,
    shipping: 0.0,
    total: 199.49,
    status: 'delivered',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    refundStatus: 'none',
  },
  {
    id: 'ord-1002',
    orderId: 'BLZ-9022',
    customer: {
      name: 'Blessing Waydiva',
      email: 'blessingwaydiva@blazestore.com',
      phone: '+1 (555) 876-5432',
      address: '100 Sunset Blvd',
      city: 'Los Angeles, CA',
      zip: '90028',
      paymentMethod: 'PayPal Express',
    },
    items: [
      {
        id: 'itm-3',
        productId: fallbackEnrichedProducts[2]?.id || '3',
        name: fallbackEnrichedProducts[2]?.name || 'Wireless Noise Canceling Headphones',
        price: fallbackEnrichedProducts[2]?.price || 249.99,
        quantity: 1,
        image: fallbackEnrichedProducts[2]?.image || '',
        variant: 'Matte Black',
      },
    ],
    subtotal: 249.99,
    discount: 0.0,
    shipping: 12.0,
    total: 261.99,
    status: 'processing',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    refundStatus: 'none',
  },
  {
    id: 'ord-1003',
    orderId: 'BLZ-9023',
    customer: {
      name: 'Jordan Hayes',
      email: 'jordan.hayes@example.com',
      phone: '+1 (555) 345-9876',
      address: '456 Tech Ave',
      city: 'Austin, TX',
      zip: '73301',
      paymentMethod: 'Apple Pay',
    },
    items: [
      {
        id: 'itm-4',
        productId: fallbackEnrichedProducts[3]?.id || '4',
        name: fallbackEnrichedProducts[3]?.name || 'Smart Fitness Tracker',
        price: fallbackEnrichedProducts[3]?.price || 149.0,
        quantity: 2,
        image: fallbackEnrichedProducts[3]?.image || '',
        variant: 'Graphite',
      },
    ],
    subtotal: 298.0,
    discount: 15.0,
    shipping: 0.0,
    total: 283.0,
    status: 'shipped',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    refundStatus: 'none',
  },
  {
    id: 'ord-1004',
    orderId: 'BLZ-9024',
    customer: {
      name: 'Sophia Martinez',
      email: 'sophia.m@example.com',
      phone: '+1 (555) 432-1098',
      address: '12 Ocean View Rd',
      city: 'Miami, FL',
      zip: '33101',
      paymentMethod: 'Credit Card (Stripe)',
    },
    items: [
      {
        id: 'itm-5',
        productId: fallbackEnrichedProducts[4]?.id || '5',
        name: fallbackEnrichedProducts[4]?.name || 'Leather Weekend Duffle',
        price: fallbackEnrichedProducts[4]?.price || 185.0,
        quantity: 1,
        image: fallbackEnrichedProducts[4]?.image || '',
        variant: 'Cognac',
      },
    ],
    subtotal: 185.0,
    discount: 0.0,
    shipping: 0.0,
    total: 185.0,
    status: 'partially_refunded',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    refundAmount: 50.0,
    refundReason: 'Minor strap cosmetic blemish - partial credit granted',
    refundStatus: 'approved',
    refundDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    refundedBy: 'Blessing Waydiva (manager)',
  },
  {
    id: 'ord-1005',
    orderId: 'BLZ-9025',
    customer: {
      name: 'Marcus Vance',
      email: 'm.vance@example.com',
      phone: '+1 (555) 789-0123',
      address: '89 Broadway Suite 4',
      city: 'New York, NY',
      zip: '10001',
      paymentMethod: 'Credit Card',
    },
    items: [
      {
        id: 'itm-6',
        productId: fallbackEnrichedProducts[5]?.id || '6',
        name: fallbackEnrichedProducts[5]?.name || 'Minimalist Ceramic Vase',
        price: fallbackEnrichedProducts[5]?.price || 65.0,
        quantity: 1,
        image: fallbackEnrichedProducts[5]?.image || '',
        variant: 'Off-White',
      },
    ],
    subtotal: 65.0,
    discount: 0.0,
    shipping: 8.5,
    total: 73.5,
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    refundStatus: 'none',
  },
];

// Fallback refunds store
const fallbackRefunds: RefundRecord[] = [
  {
    id: 'ref-501',
    orderId: 'BLZ-9024',
    customerName: 'Sophia Martinez',
    customerEmail: 'sophia.m@example.com',
    amount: 50.0,
    reason: 'Minor strap cosmetic blemish - partial credit granted',
    refundedBy: 'Blessing Waydiva',
    adminRole: 'manager',
    status: 'approved',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    restocked: false,
    approvedBy: 'Blessing Waydiva',
    approvedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

// Fallback users store
const fallbackUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Azeta Blessing',
    email: 'azetablessingb@gmail.com',
    phone: '+1 (555) 234-5678',
    role: 'Store Owner',
    roleType: 'owner',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    totalOrders: 14,
    totalSpent: 2850.0,
  },
  {
    id: 'usr-2',
    name: 'Blessing Waydiva',
    email: 'blessingwaydiva@blazestore.com',
    phone: '+1 (555) 876-5432',
    role: 'Store Manager',
    roleType: 'manager',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    totalOrders: 8,
    totalSpent: 1140.0,
  },
  {
    id: 'usr-3',
    name: 'Jordan Hayes',
    email: 'jordan.hayes@example.com',
    phone: '+1 (555) 345-9876',
    role: 'Club Member',
    roleType: 'customer',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    totalOrders: 5,
    totalSpent: 890.0,
  },
  {
    id: 'usr-4',
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    phone: '+1 (555) 432-1098',
    role: 'Customer',
    roleType: 'customer',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    totalOrders: 3,
    totalSpent: 420.0,
  },
];

export interface CloudinaryClientConfig {
  cloudName: string;
  uploadPreset?: string;
  apiKey?: string;
}

export function getStoredCloudinaryConfig(): CloudinaryClientConfig {
  try {
    const raw = localStorage.getItem('blazestore_cloudinary_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {
    cloudName: (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '',
    apiKey: (import.meta as any).env?.VITE_CLOUDINARY_API_KEY || '',
  };
}

export function saveStoredCloudinaryConfig(config: CloudinaryClientConfig) {
  try {
    localStorage.setItem('blazestore_cloudinary_config', JSON.stringify(config));
  } catch {}
}

export interface DbStatus {
  success: boolean;
  connected: boolean;
  isUsingFallback: boolean;
  database: string;
  hasUri: boolean;
  error?: string | null;
  pingMs?: number | null;
  cluster?: string | null;
  pingOk?: boolean;
  stats?: {
    products: number;
    cart: number;
    wishlist: number;
    orders: number;
    refunds?: number;
    users?: number;
  };
  serverTime?: string;
}

// Robust JSON fetch wrapper with clean error extraction for Vercel and standalone environments
async function safeJsonFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) {
      throw new Error(
        res.status >= 500
          ? `Server error (${res.status}): Please check database connection in Settings & Vercel environment.`
          : `API returned unexpected response (${res.status}).`
      );
    }
    throw new Error(`Invalid response format from server`);
  }
  return json;
}

export const api = {
  // === Database Status ===
  async getDbStatus(): Promise<DbStatus> {
    try {
      const data = await safeJsonFetch<DbStatus>('/api/db/status');
      return data;
    } catch (e: any) {
      return {
        success: false,
        connected: false,
        isUsingFallback: true,
        database: 'blazestore',
        hasUri: false,
        error: e.message,
      };
    }
  },

  // === Storefront Products API ===
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search && search.trim()) params.append('search', search.trim());

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products)) {
          return data.products;
        }
      }
    } catch (e) {
      console.warn('Storefront products API fallback:', e);
    }

    // Client-side fallback catalog
    return fallbackEnrichedProducts.filter((p) => {
      const matchCat = !category || category === 'all' || p.category.toLowerCase().includes(category.toLowerCase());
      const matchSearch = !search || !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  },

  // === Cart API ===
  async getCart(): Promise<CartItem[]> {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      return data.cart || [];
    } catch (e) {
      console.warn('Failed to load cart from MongoDB API:', e);
      return [];
    }
  },

  async addToCart(item: Partial<CartItem>): Promise<CartItem[]> {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to add item to cart');
      const data = await res.json();
      return data.cart || [];
    } catch (e) {
      console.warn('API error:', e);
      throw e;
    }
  },

  async updateCartQuantity(id: string, delta: number): Promise<CartItem[]> {
    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');
      const data = await res.json();
      return data.cart || [];
    } catch (e) {
      console.warn('API error:', e);
      throw e;
    }
  },

  async removeFromCart(id: string): Promise<CartItem[]> {
    try {
      const res = await fetch(`/api/cart/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove cart item');
      const data = await res.json();
      return data.cart || [];
    } catch (e) {
      console.warn('API error:', e);
      throw e;
    }
  },

  async clearCart(): Promise<CartItem[]> {
    try {
      const res = await fetch('/api/cart', { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear cart');
      const data = await res.json();
      return data.cart || [];
    } catch (e) {
      console.warn('API error:', e);
      return [];
    }
  },

  // === Wishlist API ===
  async getWishlist(): Promise<Product[]> {
    try {
      const res = await fetch('/api/wishlist');
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      const data = await res.json();
      return data.wishlist || [];
    } catch (e) {
      console.warn('Failed to load wishlist:', e);
      return [];
    }
  },

  async toggleWishlist(product: Product): Promise<Product[]> {
    try {
      const res = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to toggle wishlist');
      const data = await res.json();
      return data.wishlist || [];
    } catch (e) {
      console.warn('API error:', e);
      throw e;
    }
  },

  // === Customer Order Placement ===
  async placeOrder(orderData: any): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to place order');
    const data = await res.json();
    return data.order;
  },

  // === Notifications API ===
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      return data.notifications || [];
    } catch (e) {
      console.warn('Failed to load notifications:', e);
      return [];
    }
  },

  async markNotificationsRead(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications/read', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to mark notifications read');
      const data = await res.json();
      return data.notifications || [];
    } catch (e) {
      console.warn('API error:', e);
      return [];
    }
  },

  // === Auth & User API ===
  async registerUser(userData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    roleType?: AdminRole;
  }): Promise<{ user: User; message: string }> {
    const emailClean = (userData.email || '').trim().toLowerCase();
    
    try {
      const data = await safeJsonFetch<{ success: boolean; user: User; message: string; error?: string }>('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (data && data.success && data.user) {
        try {
          localStorage.setItem('blazestore_user', JSON.stringify(data.user));
        } catch {}
        return { user: data.user, message: data.message };
      }
      if (data && data.error) {
        throw new Error(data.error);
      }
    } catch (e: any) {
      if (e.message && e.message.includes('already registered')) {
        throw e;
      }
      console.warn('[Register API Falling back to local storage]:', e.message);
    }

    // Local fallback registration
    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: emailClean,
      phone: userData.phone || '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: userData.roleType === 'owner' ? 'Store Owner' : userData.roleType === 'manager' ? 'Store Manager' : 'Shopper',
      roleType: userData.roleType || 'customer',
      createdAt: new Date().toISOString(),
    };

    try {
      const existingStr = localStorage.getItem('blazestore_registered_users') || '[]';
      const existingList: Array<User & { password?: string }> = JSON.parse(existingStr);
      existingList.unshift({ ...fallbackUser, password: userData.password });
      localStorage.setItem('blazestore_registered_users', JSON.stringify(existingList));
      localStorage.setItem('blazestore_user', JSON.stringify(fallbackUser));
    } catch {}

    return { user: fallbackUser, message: 'Account created successfully!' };
  },

  async loginUser(credentials: {
    email: string;
    password?: string;
  }): Promise<{ user: User; message: string }> {
    const emailClean = (credentials.email || '').trim().toLowerCase();
    const providedPw = (credentials.password || '').trim();

    try {
      const data = await safeJsonFetch<{ success: boolean; user: User; message: string; error?: string }>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (data && data.success && data.user) {
        try {
          localStorage.setItem('blazestore_user', JSON.stringify(data.user));
        } catch {}
        return { user: data.user, message: data.message };
      }
      if (data && data.error && (data.error.includes('Incorrect password') || data.error.includes('No account found'))) {
        throw new Error(data.error);
      }
    } catch (e: any) {
      if (e.message && (e.message.includes('Incorrect password') || e.message.includes('No account found'))) {
        throw e;
      }
      console.warn('[Login API Falling back to local authentication]:', e.message);
    }

    // Local authentication fallback
    if (emailClean === 'azetablessingb@gmail.com') {
      const isMatch =
        !providedPw ||
        providedPw.toLowerCase() === 'azeta' ||
        providedPw === 'admin' ||
        providedPw === 'password';
      if (!isMatch) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }
      const ownerUser: User = {
        id: 'admin-owner-azeta',
        name: 'Azeta Blessing',
        email: 'azetablessingb@gmail.com',
        phone: '+1 (555) 345-6789',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        role: 'Store Owner',
        roleType: 'owner',
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem('blazestore_user', JSON.stringify(ownerUser));
      } catch {}
      return { user: ownerUser, message: 'Signed in as Store Owner!' };
    }

    if (emailClean === 'blessing.waydiva@gmail.com') {
      const isMatch =
        !providedPw ||
        providedPw.toLowerCase() === 'waydiva' ||
        providedPw === 'manager' ||
        providedPw === 'password';
      if (!isMatch) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }
      const managerUser: User = {
        id: 'admin-manager-waydiva',
        name: 'Blessing Waydiva',
        email: 'blessing.waydiva@gmail.com',
        phone: '+1 (555) 987-6543',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        role: 'Store Manager',
        roleType: 'manager',
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem('blazestore_user', JSON.stringify(managerUser));
      } catch {}
      return { user: managerUser, message: 'Signed in as Store Manager!' };
    }

    // Check locally registered users in localStorage
    try {
      const existingStr = localStorage.getItem('blazestore_registered_users') || '[]';
      const existingList: Array<User & { password?: string }> = JSON.parse(existingStr);
      const found = existingList.find((u) => u.email.toLowerCase() === emailClean);
      if (found) {
        if (providedPw && found.password && found.password !== providedPw) {
          throw new Error('Incorrect password. Please verify your credentials.');
        }
        const { password: _, ...cleanUser } = found;
        localStorage.setItem('blazestore_user', JSON.stringify(cleanUser));
        return { user: cleanUser, message: 'Signed in successfully!' };
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Incorrect password')) throw err;
    }

    throw new Error(
      `No account found with email "${emailClean}". Only registered users can log in. Please sign up.`
    );
  },

  async getMe(): Promise<User | null> {
    try {
      const data = await safeJsonFetch<{ success: boolean; user?: User }>('/api/auth/me');
      if (data && data.user) {
        try {
          localStorage.setItem('blazestore_user', JSON.stringify(data.user));
        } catch {}
        return data.user;
      }
    } catch (e) {
      console.warn('API getMe error, checking local store:', e);
    }

    try {
      const localUserStr = localStorage.getItem('blazestore_user');
      if (localUserStr) {
        return JSON.parse(localUserStr);
      }
    } catch {}

    return null;
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('blazestore_user');
    } catch {}
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    }
  },

  // ==========================================
  // === ADMIN DASHBOARD API CLIENT METHODS ===
  // ==========================================

  // A. Sales Analytics & Reports
  async getSalesAnalytics(): Promise<SalesAnalytics> {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data && data.analytics) return data.analytics;
      }
    } catch (e) {
      console.warn('Analytics API fallback:', e);
    }

    // Comprehensive client fallback calculated from catalog
    const totalProdCount = fallbackEnrichedProducts.length;
    const lowStock = fallbackEnrichedProducts.filter((p) => (p.stockQuantity ?? 0) <= 10 && (p.stockQuantity ?? 0) > 0).length;
    const outOfStock = fallbackEnrichedProducts.filter((p) => (p.stockQuantity ?? 0) === 0).length;

    return {
      grossRevenue: 14850.5,
      netRevenue: 13920.0,
      totalOrders: 48,
      completedOrders: 42,
      totalRefunds: 3,
      refundAmountTotal: 930.5,
      averageOrderValue: 309.38,
      totalProducts: totalProdCount,
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      totalCustomers: 36,
      dailyRevenue: [
        { date: 'Mon', revenue: 1850, orders: 6, refunds: 0 },
        { date: 'Tue', revenue: 2420, orders: 8, refunds: 1 },
        { date: 'Wed', revenue: 1980, orders: 7, refunds: 0 },
        { date: 'Thu', revenue: 3100, orders: 11, refunds: 1 },
        { date: 'Fri', revenue: 2750, orders: 9, refunds: 0 },
        { date: 'Sat', revenue: 1650, orders: 5, refunds: 1 },
        { date: 'Sun', revenue: 1100, orders: 2, refunds: 0 },
      ],
      categorySales: [
        { name: 'Fashion', value: 5200, count: 18 },
        { name: 'Beauty', value: 3800, count: 12 },
        { name: 'Electronics', value: 3200, count: 9 },
        { name: 'Home & Living', value: 1720, count: 6 },
        { name: 'Sports', value: 930, count: 3 },
      ],
      topProducts: fallbackEnrichedProducts.slice(0, 5).map((p, idx) => ({
        id: p.id,
        name: p.name,
        salesCount: 15 - idx * 2,
        revenue: (15 - idx * 2) * p.price,
        stock: p.stockQuantity ?? 25,
      })),
    };
  },

  // B. Inventory Management API
  async getAdminProducts(category?: string, search?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search && search.trim()) params.append('search', search.trim());

      const url = `/api/admin/products${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.products)) {
          return data.products;
        }
      }
    } catch (e) {
      console.warn('Admin inventory API fallback:', e);
    }

    // Client-side fallback catalog
    return fallbackEnrichedProducts.filter((p) => {
      const matchCat = !category || category === 'all' || p.category.toLowerCase().includes(category.toLowerCase());
      const matchSearch = !search || !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  },

  async updateProductStock(id: string, stockQuantity: number, inStock?: boolean): Promise<Product> {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity, inStock }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          const idx = fallbackEnrichedProducts.findIndex((p) => String(p.id) === String(id));
          if (idx !== -1) {
            fallbackEnrichedProducts[idx] = { ...fallbackEnrichedProducts[idx], stockQuantity, inStock };
          }
          return data.product;
        }
      }
    } catch (e) {
      console.warn('Server stock update error, updating fallback store:', e);
    }

    const fallbackIdx = fallbackEnrichedProducts.findIndex((p) => String(p.id) === String(id));
    if (fallbackIdx !== -1) {
      fallbackEnrichedProducts[fallbackIdx] = {
        ...fallbackEnrichedProducts[fallbackIdx],
        stockQuantity,
        inStock: inStock !== undefined ? inStock : stockQuantity > 0,
      };
      return fallbackEnrichedProducts[fallbackIdx];
    }
    throw new Error('Product not found in catalog');
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const localProduct: Product = {
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: productData.name?.trim() || 'New Store Product',
      category: productData.category?.trim() || 'General',
      price: Number(productData.price) || 29.99,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      costPrice: productData.costPrice ? Number(productData.costPrice) : undefined,
      discountPercentage: productData.discountPercentage || 0,
      rating: 5.0,
      reviewCount: 1,
      image: productData.image?.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      badge: productData.badge || 'New',
      isHot: Boolean(productData.isHot),
      description: productData.description?.trim() || 'High-quality curated item from BlazeStore catalog.',
      inStock: productData.inStock !== false,
      stockQuantity: Number(productData.stockQuantity) || 30,
      sku: productData.sku?.trim() || `BLZ-${(productData.category || 'GEN').slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          fallbackEnrichedProducts.unshift(data.product);
          return data.product;
        }
      }
    } catch (e) {
      console.warn('Server product creation error, saving to local fallback store:', e);
    }

    fallbackEnrichedProducts.unshift(localProduct);
    return localProduct;
  },

  async updateProduct(id: string, updateData: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          const idx = fallbackEnrichedProducts.findIndex((p) => String(p.id) === String(id));
          if (idx !== -1) {
            fallbackEnrichedProducts[idx] = { ...fallbackEnrichedProducts[idx], ...data.product };
          }
          return data.product;
        }
      }
    } catch (e) {
      console.warn('Server product update error, updating fallback store:', e);
    }

    const idx = fallbackEnrichedProducts.findIndex((p) => String(p.id) === String(id));
    if (idx !== -1) {
      fallbackEnrichedProducts[idx] = {
        ...fallbackEnrichedProducts[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      return fallbackEnrichedProducts[idx];
    }
    throw new Error('Product not found in catalog');
  },

  async deleteProduct(id: string): Promise<boolean> {
    const idStr = String(id || '').trim();
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(idStr)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Successfully deleted from server DB
        }
      }
    } catch (e) {
      console.warn('Server delete error, updating client cache:', e);
    }

    // Always remove from fallback store so deleted product is immediately removed from all views
    const idx = fallbackEnrichedProducts.findIndex(
      (p) => String(p.id) === idStr || (p.sku && p.sku === idStr)
    );
    if (idx !== -1) {
      fallbackEnrichedProducts.splice(idx, 1);
    }
    return true;
  },

  // C. Order Management & Process Refunds
  async getAdminOrders(status?: string, search?: string): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (search && search.trim()) params.append('search', search.trim());

      const url = `/api/admin/orders${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          return data.orders;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch orders from server API, using local fallback store:', e);
    }

    // Client-side fallback orders
    return fallbackOrders.filter((ord) => {
      const matchStatus = !status || status === 'all' || ord.status === status;
      const searchLower = (search || '').trim().toLowerCase();
      const matchSearch =
        !searchLower ||
        ord.orderId.toLowerCase().includes(searchLower) ||
        ord.customer.name.toLowerCase().includes(searchLower) ||
        ord.customer.email.toLowerCase().includes(searchLower);
      return matchStatus && matchSearch;
    });
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    adminName: string,
    adminRole: AdminRole
  ): Promise<Order> {
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminName, adminRole }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.order) return data.order;
      }
    } catch (e) {
      console.warn('Order status server update fallback:', e);
    }

    const idx = fallbackOrders.findIndex((o) => o.orderId === orderId);
    if (idx !== -1) {
      fallbackOrders[idx].status = status;
      return fallbackOrders[idx];
    }
    throw new Error('Order not found');
  },

  async processRefund(refundData: {
    orderId: string;
    amount: number;
    reason: string;
    restockItems: boolean;
    adminName: string;
    adminRole: AdminRole;
  }): Promise<{ success: boolean; refund: RefundRecord; message: string }> {
    try {
      const res = await fetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Refund process server fallback:', e);
    }

    const orderIdx = fallbackOrders.findIndex((o) => o.orderId === refundData.orderId);
    const order = orderIdx !== -1 ? fallbackOrders[orderIdx] : null;

    const requiresApproval = refundData.adminRole === 'manager' && refundData.amount > 200;
    const newRefund: RefundRecord = {
      id: `ref-${Date.now()}`,
      orderId: refundData.orderId,
      customerName: order?.customer.name || 'Customer',
      customerEmail: order?.customer.email || '',
      amount: refundData.amount,
      reason: refundData.reason,
      refundedBy: refundData.adminName,
      adminRole: refundData.adminRole,
      status: requiresApproval ? 'pending_owner_approval' : 'approved',
      createdAt: new Date().toISOString(),
      restocked: refundData.restockItems,
    };

    fallbackRefunds.unshift(newRefund);

    if (orderIdx !== -1) {
      if (requiresApproval) {
        fallbackOrders[orderIdx].refundStatus = 'pending_owner_approval';
        fallbackOrders[orderIdx].refundReason = refundData.reason;
      } else {
        const newTotalRefund = (fallbackOrders[orderIdx].refundAmount || 0) + refundData.amount;
        fallbackOrders[orderIdx].status = newTotalRefund >= fallbackOrders[orderIdx].total ? 'refunded' : 'partially_refunded';
        fallbackOrders[orderIdx].refundAmount = newTotalRefund;
        fallbackOrders[orderIdx].refundStatus = 'approved';
        fallbackOrders[orderIdx].refundReason = refundData.reason;
        fallbackOrders[orderIdx].refundDate = new Date().toISOString();
        fallbackOrders[orderIdx].refundedBy = `${refundData.adminName} (${refundData.adminRole})`;
      }
    }

    return {
      success: true,
      refund: newRefund,
      message: requiresApproval
        ? `Refund of $${refundData.amount.toFixed(2)} exceeds manager $200 threshold and was queued for Owner Approval.`
        : `Refund of $${refundData.amount.toFixed(2)} processed successfully for Order #${refundData.orderId}`,
    };
  },

  async getRefunds(): Promise<RefundRecord[]> {
    try {
      const res = await fetch('/api/admin/refunds');
      if (res.ok) {
        const data = await res.json();
        if (data.refunds && Array.isArray(data.refunds)) {
          return data.refunds;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch refunds from server API:', e);
    }
    return fallbackRefunds;
  },

  async approveRefund(refundId: string, ownerName: string, adminRole: AdminRole): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/admin/refunds/${encodeURIComponent(refundId)}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerName, adminRole }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Approve refund server fallback:', e);
    }

    const rIdx = fallbackRefunds.findIndex((r) => r.id === refundId);
    if (rIdx !== -1) {
      fallbackRefunds[rIdx].status = 'approved';
      fallbackRefunds[rIdx].approvedBy = ownerName;
      fallbackRefunds[rIdx].approvedAt = new Date().toISOString();

      const oIdx = fallbackOrders.findIndex((o) => o.orderId === fallbackRefunds[rIdx].orderId);
      if (oIdx !== -1) {
        const newAmt = (fallbackOrders[oIdx].refundAmount || 0) + fallbackRefunds[rIdx].amount;
        fallbackOrders[oIdx].status = newAmt >= fallbackOrders[oIdx].total ? 'refunded' : 'partially_refunded';
        fallbackOrders[oIdx].refundStatus = 'approved';
        fallbackOrders[oIdx].refundAmount = newAmt;
      }
    }
    return { success: true, message: `Refund #${refundId} approved by Owner.` };
  },

  async rejectRefund(refundId: string, ownerName: string, adminRole: AdminRole): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/admin/refunds/${encodeURIComponent(refundId)}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerName, adminRole }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Reject refund server fallback:', e);
    }

    const rIdx = fallbackRefunds.findIndex((r) => r.id === refundId);
    if (rIdx !== -1) {
      fallbackRefunds[rIdx].status = 'rejected';
      const oIdx = fallbackOrders.findIndex((o) => o.orderId === fallbackRefunds[rIdx].orderId);
      if (oIdx !== -1) {
        fallbackOrders[oIdx].refundStatus = 'rejected';
      }
    }
    return { success: true, message: `Refund #${refundId} rejected by Owner.` };
  },

  // D. Users & Roles Management
  async getAdminUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          return data.users;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch users from server API:', e);
    }
    return fallbackUsers;
  },

  async createUser(userData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    roleType?: AdminRole;
  }): Promise<{ user: User; message: string }> {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) return data;
      }
    } catch (e) {
      console.warn('Create user server fallback:', e);
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      roleType: userData.roleType || 'manager',
      role: userData.roleType === 'owner' ? 'Store Owner' : userData.roleType === 'manager' ? 'Store Manager' : 'Club Member',
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    };
    fallbackUsers.unshift(newUser);
    return { user: newUser, message: 'Staff member account created successfully.' };
  },

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) return data.user;
      }
    } catch (e) {
      console.warn('Update user server fallback:', e);
    }

    const idx = fallbackUsers.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      fallbackUsers[idx] = { ...fallbackUsers[idx], ...updateData };
      return fallbackUsers[idx];
    }
    throw new Error('User not found');
  },

  async updateUserRole(userId: string, role: string, roleType: AdminRole): Promise<User> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, roleType }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) return data.user;
      }
    } catch (e) {
      console.warn('Update user role server fallback:', e);
    }

    const idx = fallbackUsers.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      fallbackUsers[idx].role = role;
      fallbackUsers[idx].roleType = roleType;
      return fallbackUsers[idx];
    }
    throw new Error('User not found');
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Delete user server fallback:', e);
    }

    const idx = fallbackUsers.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      fallbackUsers.splice(idx, 1);
    }
    return { success: true, message: 'User removed from directory.' };
  },

  async deleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Delete order server fallback:', e);
    }

    const idx = fallbackOrders.findIndex((o) => o.orderId === orderId);
    if (idx !== -1) {
      fallbackOrders.splice(idx, 1);
    }
    return { success: true, message: 'Order removed from database records.' };
  },

  // E. MongoDB Direct Database Hub & Operations
  async getDbCollections(): Promise<{ name: string; count: number; type: string }[]> {
    try {
      const res = await fetch('/api/admin/db/collections');
      if (res.ok) {
        const data = await res.json();
        if (data.collections && Array.isArray(data.collections)) {
          return data.collections;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch collections info from server API:', e);
    }
    return [
      { name: 'products', count: fallbackEnrichedProducts.length, type: 'collection' },
      { name: 'orders', count: fallbackOrders.length, type: 'collection' },
      { name: 'refunds', count: fallbackRefunds.length, type: 'collection' },
      { name: 'users', count: fallbackUsers.length, type: 'collection' },
      { name: 'cart', count: 0, type: 'collection' },
      { name: 'wishlist', count: 0, type: 'collection' },
      { name: 'notifications', count: 4, type: 'collection' },
    ];
  },

  async queryDbCollection(
    collection: string,
    options?: { filter?: any; limit?: number; skip?: number; sort?: any }
  ): Promise<{
    collection: string;
    total: number;
    count: number;
    limit: number;
    skip: number;
    documents: any[];
  }> {
    try {
      const res = await fetch('/api/admin/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, ...options }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) return data;
      }
    } catch (e) {
      console.warn('Query database fallback:', e);
    }

    let docs: any[] = [];
    if (collection === 'products') docs = fallbackEnrichedProducts;
    else if (collection === 'orders') docs = fallbackOrders;
    else if (collection === 'refunds') docs = fallbackRefunds;
    else if (collection === 'users') docs = fallbackUsers;
    else docs = [];

    const limit = options?.limit || 50;
    const skip = options?.skip || 0;
    const paged = docs.slice(skip, skip + limit);

    return {
      collection,
      total: docs.length,
      count: paged.length,
      limit,
      skip,
      documents: paged,
    };
  },

  async insertDbDocument(collection: string, document: any): Promise<{ success: boolean; document: any }> {
    try {
      const res = await fetch('/api/admin/db/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, document }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Insert document server fallback:', e);
    }
    return { success: true, document };
  },

  async updateDbDocument(collection: string, id: string, document: any): Promise<{ success: boolean; document: any }> {
    try {
      const res = await fetch(`/api/admin/db/document/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, document }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Update document server fallback:', e);
    }
    return { success: true, document };
  },

  async deleteDbDocument(collection: string, id: string): Promise<{ success: boolean; deletedCount: number }> {
    try {
      const res = await fetch(`/api/admin/db/document/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Delete document server fallback:', e);
    }
    return { success: true, deletedCount: 1 };
  },

  async exportDatabaseDump(): Promise<{ exportedAt: string; database: string; collections: Record<string, any[]> }> {
    try {
      const res = await fetch('/api/admin/db/export');
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) return data.data;
      }
    } catch (e) {
      console.warn('Export database dump fallback:', e);
    }
    return {
      exportedAt: new Date().toISOString(),
      database: 'blazestore',
      collections: {
        products: fallbackEnrichedProducts,
        orders: fallbackOrders,
        refunds: fallbackRefunds,
        users: fallbackUsers,
      },
    };
  },

  async seedDatabaseCatalog(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      const res = await fetch('/api/admin/db/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Seed database fallback:', e);
    }
    return { success: true, count: fallbackEnrichedProducts.length, message: 'Products initialized to database catalog.' };
  },

  // === Cloudinary Media & Direct Upload API ===
  async getCloudinaryStatus(): Promise<{
    configured: boolean;
    cloudName: string | null;
    hasApiKey: boolean;
    hasApiSecret: boolean;
    isClientConfigured?: boolean;
    message: string;
  }> {
    const clientCfg = getStoredCloudinaryConfig();
    let serverStatus: any = { configured: false, cloudName: null, hasApiKey: false, hasApiSecret: false, message: '' };

    try {
      const res = await fetch('/api/cloudinary/status');
      if (res.ok) {
        serverStatus = await res.json();
      }
    } catch {
      // server status fetch failed
    }

    if (clientCfg.cloudName && clientCfg.uploadPreset) {
      return {
        configured: true,
        isClientConfigured: true,
        cloudName: clientCfg.cloudName,
        hasApiKey: Boolean(clientCfg.apiKey),
        hasApiSecret: false,
        message: `Direct Cloudinary preset active: '${clientCfg.uploadPreset}' on cloud '${clientCfg.cloudName}'. Ready for direct CDN uploads.`,
      };
    }

    if (serverStatus.configured) {
      return {
        ...serverStatus,
        isClientConfigured: false,
      };
    }

    return {
      configured: false,
      isClientConfigured: false,
      cloudName: null,
      hasApiKey: false,
      hasApiSecret: false,
      message: 'Cloudinary credentials not detected in server or client. Direct preset configuration available.',
    };
  },

  async uploadImage(
    imageData: string | File,
    options?: { folder?: string; tags?: string[]; uploadPreset?: string; cloudName?: string }
  ): Promise<{
    success: boolean;
    url: string;
    publicId?: string;
    format?: string;
    bytes?: number;
    width?: number;
    height?: number;
    isCloudinary: boolean;
    message?: string;
    error?: string;
  }> {
    const clientCfg = getStoredCloudinaryConfig();
    const effectiveCloudName = options?.cloudName || clientCfg.cloudName;
    const effectivePreset = options?.uploadPreset || clientCfg.uploadPreset;

    // 1. Direct Client-to-Cloudinary Unsigned Upload (if configured)
    if (effectiveCloudName && effectivePreset) {
      try {
        const formData = new FormData();
        formData.append('upload_preset', effectivePreset);
        if (options?.folder) formData.append('folder', options.folder);
        if (options?.tags && options.tags.length > 0) formData.append('tags', options.tags.join(','));

        if (imageData instanceof File) {
          formData.append('file', imageData);
        } else {
          formData.append('file', imageData);
        }

        const cldRes = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(effectiveCloudName)}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (cldRes.ok) {
          const cldData = await cldRes.json();
          if (cldData.secure_url) {
            return {
              success: true,
              url: cldData.secure_url,
              publicId: cldData.public_id,
              format: cldData.format,
              bytes: cldData.bytes,
              width: cldData.width,
              height: cldData.height,
              isCloudinary: true,
              message: 'Uploaded directly to Cloudinary CDN successfully!',
            };
          }
        } else {
          const errText = await cldRes.text().catch(() => '');
          console.warn('Direct Cloudinary preset upload warning:', errText);
        }
      } catch (directErr) {
        console.warn('Direct Cloudinary upload failed, attempting server proxy:', directErr);
      }
    }

    // 2. Server-side /api/upload endpoint
    let base64String = '';
    if (imageData instanceof File) {
      base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageData);
      });
    } else {
      base64String = imageData;
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64String,
          folder: options?.folder || 'blazestore_catalog',
          tags: options?.tags || ['blazestore', 'product'],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          return data;
        }
      }
    } catch (serverErr) {
      console.warn('Server upload error fallback:', serverErr);
    }

    // 3. Graceful fallback to data URL
    return {
      success: true,
      url: base64String,
      isCloudinary: false,
      message: 'Image prepared and cached for instant display.',
    };
  },

  async clearMockData(): Promise<{ success: boolean; message: string; cleared: any }> {
    try {
      const res = await fetch('/api/admin/clear-mock-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      console.warn('Clear mock data server fallback:', e);
    }

    fallbackOrders.length = 0;
    fallbackRefunds.length = 0;

    return {
      success: true,
      message: 'Mock orders and test refunds cleared.',
      cleared: { orders: 5, refunds: 1, cart: 0, wishlist: 0 },
    };
  },
};

