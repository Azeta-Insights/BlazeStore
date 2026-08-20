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

export const api = {
  // === Database Status ===
  async getDbStatus(): Promise<DbStatus> {
    try {
      const res = await fetch('/api/db/status');
      if (!res.ok) throw new Error('Failed to fetch DB status');
      return await res.json();
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
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products || [];
    } catch (e) {
      console.warn('Fallback products:', e);
      return [];
    }
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
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Registration failed');
    }
    return { user: data.user, message: data.message };
  },

  async loginUser(credentials: {
    email: string;
    password?: string;
  }): Promise<{ user: User; message: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Login failed');
    }
    return { user: data.user, message: data.message };
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Failed to get current user');
      const data = await res.json();
      return data.user || null;
    } catch (e) {
      console.warn('Failed to load user:', e);
      return null;
    }
  },

  async logout(): Promise<void> {
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
    const res = await fetch('/api/admin/analytics');
    if (!res.ok) throw new Error('Failed to fetch sales analytics');
    const data = await res.json();
    return data.analytics;
  },

  // B. Inventory Management API
  async getAdminProducts(category?: string, search?: string): Promise<Product[]> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());

    const url = `/api/admin/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch inventory products');
    const data = await res.json();
    return data.products || [];
  },

  async updateProductStock(id: string, stockQuantity: number, inStock?: boolean): Promise<Product> {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/stock`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockQuantity, inStock }),
    });
    if (!res.ok) throw new Error('Failed to update product stock');
    const data = await res.json();
    return data.product;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create product');
    return data.product;
  },

  async updateProduct(id: string, updateData: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update product');
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete product');
    return true;
  },

  // C. Order Management & Process Refunds
  async getAdminOrders(status?: string, search?: string): Promise<Order[]> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const url = `/api/admin/orders${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.orders || [];
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    adminName: string,
    adminRole: AdminRole
  ): Promise<Order> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminName, adminRole }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update order status');
    return data.order;
  },

  async processRefund(refundData: {
    orderId: string;
    amount: number;
    reason: string;
    restockItems: boolean;
    adminName: string;
    adminRole: AdminRole;
  }): Promise<{ success: boolean; refund: RefundRecord; message: string }> {
    const res = await fetch('/api/admin/refunds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refundData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to process refund');
    return data;
  },

  async getRefunds(): Promise<RefundRecord[]> {
    const res = await fetch('/api/admin/refunds');
    if (!res.ok) throw new Error('Failed to fetch refunds history');
    const data = await res.json();
    return data.refunds || [];
  },

  async approveRefund(refundId: string, ownerName: string, adminRole: AdminRole): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/refunds/${encodeURIComponent(refundId)}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerName, adminRole }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to approve refund');
    return data;
  },

  async rejectRefund(refundId: string, ownerName: string, adminRole: AdminRole): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/refunds/${encodeURIComponent(refundId)}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerName, adminRole }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to reject refund');
    return data;
  },

  // D. Users & Roles Management
  async getAdminUsers(): Promise<User[]> {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Failed to fetch user directory');
    const data = await res.json();
    return data.users || [];
  },

  async createUser(userData: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    roleType?: AdminRole;
  }): Promise<{ user: User; message: string }> {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create user');
    return data;
  },

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update user');
    return data.user;
  },

  async updateUserRole(userId: string, role: string, roleType: AdminRole): Promise<User> {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, roleType }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update user role');
    return data.user;
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete user');
    return data;
  },

  async deleteOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete order');
    return data;
  },

  // E. MongoDB Direct Database Hub & Operations
  async getDbCollections(): Promise<{ name: string; count: number; type: string }[]> {
    const res = await fetch('/api/admin/db/collections');
    if (!res.ok) throw new Error('Failed to fetch collections info');
    const data = await res.json();
    return data.collections || [];
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
    const res = await fetch('/api/admin/db/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection, ...options }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to query database collection');
    return data;
  },

  async insertDbDocument(collection: string, document: any): Promise<{ success: boolean; document: any }> {
    const res = await fetch('/api/admin/db/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection, document }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to insert document');
    return data;
  },

  async updateDbDocument(collection: string, id: string, document: any): Promise<{ success: boolean; document: any }> {
    const res = await fetch(`/api/admin/db/document/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection, document }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update document');
    return data;
  },

  async deleteDbDocument(collection: string, id: string): Promise<{ success: boolean; deletedCount: number }> {
    const res = await fetch(`/api/admin/db/document/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete document');
    return data;
  },

  async exportDatabaseDump(): Promise<{ exportedAt: string; database: string; collections: Record<string, any[]> }> {
    const res = await fetch('/api/admin/db/export');
    if (!res.ok) throw new Error('Failed to export database dump');
    const data = await res.json();
    return data.data;
  },

  async seedDatabaseCatalog(): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch('/api/admin/db/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to seed database');
    return data;
  },

  // === Cloudinary Media & Upload API ===
  async getCloudinaryStatus(): Promise<{
    configured: boolean;
    cloudName: string | null;
    hasApiKey: boolean;
    hasApiSecret: boolean;
    message: string;
  }> {
    try {
      const res = await fetch('/api/cloudinary/status');
      if (!res.ok) throw new Error('Status request failed');
      return await res.json();
    } catch {
      return {
        configured: false,
        cloudName: null,
        hasApiKey: false,
        hasApiSecret: false,
        message: 'Unable to query Cloudinary server status.',
      };
    }
  },

  async uploadImage(
    imageData: string,
    options?: { folder?: string; tags?: string[] }
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
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageData,
        folder: options?.folder || 'blazestore_catalog',
        tags: options?.tags || ['blazestore', 'product'],
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to upload image');
    }
    return data;
  },

  async clearMockData(): Promise<{ success: boolean; message: string; cleared: any }> {
    const res = await fetch('/api/admin/clear-mock-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to clear mock data');
    }
    return data;
  },
};

