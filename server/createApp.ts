import express from 'express';
import dotenv from 'dotenv';
import {
  getDatabase,
  getDatabaseStatus,
  getProducts,
  getAllProductsAdmin,
  updateProductStock,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getWishlist,
  toggleWishlist,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrderAdmin,
  processRefund,
  approveRefund,
  rejectRefund,
  getRefunds,
  getSalesAnalytics,
  getAllUsers,
  updateUserRole,
  updateUserAdmin,
  deleteUserAdmin,
  getDbCollectionsInfo,
  queryDbCollection,
  insertDbDocument,
  updateDbDocument,
  deleteDbDocument,
  exportDatabaseData,
  seedCatalogToDatabase,
  getNotifications,
  markNotificationsRead,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  clearAllMockData,
} from './db';
import {
  uploadImageToCloudinary,
  getCloudinaryStatus,
} from './cloudinary';

dotenv.config();

export function createApp() {
  const app = express();

  // Middlewares with high payload limit for direct image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Basic CORS support for serverless API
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // === Cloudinary Image Upload API ===
  app.get('/api/cloudinary/status', (req, res) => {
    try {
      const status = getCloudinaryStatus();
      res.json({ success: true, ...status });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/upload', async (req, res) => {
    try {
      const { image, folder, tags } = req.body;
      if (!image) {
        return res.status(400).json({ success: false, error: 'Image data is required (file or base64).' });
      }
      const result = await uploadImageToCloudinary(image, { folder, tags });
      res.json(result);
    } catch (err: any) {
      console.error('[Upload API] Error:', err);
      res.status(500).json({ success: false, error: err?.message || 'Failed to process image upload' });
    }
  });

  // === MongoDB API Routes ===

  // 1. Health & Database Status
  app.get('/api/db/status', async (req, res) => {
    try {
      const status = await getDatabaseStatus();
      res.json({
        success: true,
        ...status,
        serverTime: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'DB check failed' });
    }
  });

  // 2. Products API (Storefront)
  app.get('/api/products', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const products = await getProducts(category, search);
      res.json({ success: true, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 3. Cart API
  app.get('/api/cart', async (req, res) => {
    try {
      const cart = await getCart();
      res.json({ success: true, cart });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/cart', async (req, res) => {
    try {
      const item = req.body;
      if (!item || !item.productId) {
        return res.status(400).json({ success: false, error: 'Product data is required' });
      }
      const cart = await addToCart(item);
      res.json({ success: true, cart });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.put('/api/cart/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { delta } = req.body;
      const cart = await updateCartQuantity(id, Number(delta) || 1);
      res.json({ success: true, cart });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.delete('/api/cart/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const cart = await removeFromCart(id);
      res.json({ success: true, cart });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.delete('/api/cart', async (req, res) => {
    try {
      const cart = await clearCart();
      res.json({ success: true, cart });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 4. Wishlist API
  app.get('/api/wishlist', async (req, res) => {
    try {
      const wishlist = await getWishlist();
      res.json({ success: true, wishlist });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/wishlist/toggle', async (req, res) => {
    try {
      const product = req.body;
      if (!product || !product.id) {
        return res.status(400).json({ success: false, error: 'Product is required' });
      }
      const wishlist = await toggleWishlist(product);
      res.json({ success: true, wishlist });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 5. Orders API (Storefront customer placement)
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = req.body;
      const order = await createOrder(orderData);
      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 6. Notifications API
  app.get('/api/notifications', async (req, res) => {
    try {
      const notifications = await getNotifications();
      res.json({ success: true, notifications });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/notifications/read', async (req, res) => {
    try {
      const notifications = await markNotificationsRead();
      res.json({ success: true, notifications });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // 7. User Registration & Auth API
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, phone, roleType } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required.' });
      }
      const result = await registerUser({ name, email, password, phone, roleType });
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err?.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required.' });
      }
      const result = await loginUser({ email, password });
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err?.message || 'Login failed' });
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      const user = await getCurrentUser();
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    try {
      const result = await logoutUser();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // === ADMIN DASHBOARD API ROUTES ===

  // A. Sales Analytics & Reports
  app.get('/api/admin/analytics', async (req, res) => {
    try {
      const analytics = await getSalesAnalytics();
      res.json({ success: true, analytics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // B. Inventory Management API
  app.get('/api/admin/products', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const products = await getAllProductsAdmin(category, search);
      res.json({ success: true, products });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/admin/products', async (req, res) => {
    try {
      const productData = req.body;
      if (!productData.name || !productData.price) {
        return res.status(400).json({ success: false, error: 'Product name and price are required.' });
      }
      const product = await createProductAdmin(productData);
      res.json({ success: true, product, message: 'Product added to MongoDB inventory.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.put('/api/admin/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await updateProductAdmin(id, updateData);
      res.json({ success: true, product: updated, message: 'Product details updated.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.put('/api/admin/products/:id/stock', async (req, res) => {
    try {
      const { id } = req.params;
      const { stockQuantity, inStock } = req.body;
      const updated = await updateProductStock(id, Number(stockQuantity), inStock);
      res.json({ success: true, product: updated, message: 'Stock quantity updated.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.delete('/api/admin/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteProductAdmin(id);
      res.json({ success: true, ...result, message: 'Product removed from catalog.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // C. Order Management & Process Refunds API
  app.get('/api/admin/orders', async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const orders = await getAllOrders(status, search);
      res.json({ success: true, orders });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.put('/api/admin/orders/:orderId/status', async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, adminName, adminRole } = req.body;
      const updated = await updateOrderStatus(orderId, status, { name: adminName, role: adminRole });
      res.json({ success: true, order: updated, message: `Order status updated to ${status}.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/admin/refunds', async (req, res) => {
    try {
      const { orderId, amount, reason, restockItems, adminName, adminRole } = req.body;
      if (!orderId || !amount) {
        return res.status(400).json({ success: false, error: 'Order ID and refund amount are required.' });
      }
      const result = await processRefund({
        orderId,
        amount: Number(amount),
        reason: reason || 'Customer Refund',
        restockItems: Boolean(restockItems),
        adminName: adminName || 'Admin',
        adminRole: adminRole || 'manager',
      });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err?.message || 'Refund failed' });
    }
  });

  app.get('/api/admin/refunds', async (req, res) => {
    try {
      const refunds = await getRefunds();
      res.json({ success: true, refunds });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/admin/refunds/:id/approve', async (req, res) => {
    try {
      const { id } = req.params;
      const { ownerName, adminRole } = req.body;
      if (adminRole !== 'owner') {
        return res.status(403).json({ success: false, error: 'Only Store Owners can approve queued refunds.' });
      }
      const result = await approveRefund(id, ownerName || 'Store Owner');
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err?.message || 'Approval failed' });
    }
  });

  app.post('/api/admin/refunds/:id/reject', async (req, res) => {
    try {
      const { id } = req.params;
      const { ownerName, adminRole } = req.body;
      if (adminRole !== 'owner') {
        return res.status(403).json({ success: false, error: 'Only Store Owners can reject queued refunds.' });
      }
      const result = await rejectRefund(id, ownerName || 'Store Owner');
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err?.message || 'Rejection failed' });
    }
  });

  // D. Users & Roles Management API
  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json({ success: true, users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/admin/users', async (req, res) => {
    try {
      const { name, email, password, phone, roleType } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required.' });
      }
      const result = await registerUser({ name, email, password, phone, roleType });
      res.json({ success: true, user: result.user, message: 'Staff member account created.' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err?.message || 'Failed to create user' });
    }
  });

  app.put('/api/admin/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await updateUserAdmin(id, updateData);
      res.json({ success: true, user: updated, message: 'User updated.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.put('/api/admin/users/:id/role', async (req, res) => {
    try {
      const { id } = req.params;
      const { role, roleType } = req.body;
      const updated = await updateUserRole(id, role, roleType);
      res.json({ success: true, user: updated, message: 'User role updated.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.delete('/api/admin/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteUserAdmin(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err?.message || 'Failed to remove user' });
    }
  });

  app.delete('/api/admin/orders/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const result = await deleteOrderAdmin(orderId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // E. Direct MongoDB Database Hub & Operations API
  app.get('/api/admin/db/collections', async (req, res) => {
    try {
      const collections = await getDbCollectionsInfo();
      res.json({ success: true, collections });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/admin/db/query', async (req, res) => {
    try {
      const { collection, filter, limit, skip, sort } = req.body;
      if (!collection) {
        return res.status(400).json({ success: false, error: 'Collection name is required.' });
      }
      const result = await queryDbCollection(collection, { filter, limit, skip, sort });
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/admin/db/document', async (req, res) => {
    try {
      const { collection, document } = req.body;
      if (!collection || !document) {
        return res.status(400).json({ success: false, error: 'Collection name and document data are required.' });
      }
      const result = await insertDbDocument(collection, document);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.put('/api/admin/db/document/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { collection, document } = req.body;
      if (!collection || !document) {
        return res.status(400).json({ success: false, error: 'Collection name and document data are required.' });
      }
      const result = await updateDbDocument(collection, id, document);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.delete('/api/admin/db/document/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { collection } = req.body;
      if (!collection) {
        return res.status(400).json({ success: false, error: 'Collection name is required.' });
      }
      const result = await deleteDbDocument(collection, id);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.get('/api/admin/db/export', async (req, res) => {
    try {
      const data = await exportDatabaseData();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  app.post('/api/admin/db/seed', async (req, res) => {
    try {
      const result = await seedCatalogToDatabase();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message });
    }
  });

  // F. Clear All Mock / Test Data
  app.post('/api/admin/clear-mock-data', async (req, res) => {
    try {
      const result = await clearAllMockData();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Failed to clear mock data' });
    }
  });

  return app;
}
