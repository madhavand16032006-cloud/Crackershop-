import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Authentication middleware helper
const checkAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'sivakasi_admin_token_active' && !token.startsWith('sivakasi_token_')) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
  next();
};

// ==================== AUTH API ====================
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.verifyAdmin(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = `sivakasi_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    res.json({
      success: true,
      token,
      user
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.get('/api/auth/me', checkAuth, (req, res) => {
  res.json({
    user: {
      id: "admin_1",
      name: "Shop Owner Admin",
      email: "admin@sivakasifireworks.com",
      role: "admin"
    }
  });
});

// ==================== SHOP PROFILE API ====================
app.get('/api/shop', (req, res) => {
  try {
    const settings = db.getShopSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/shop', checkAuth, (req, res) => {
  try {
    const updated = db.updateShopSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CATEGORIES API ====================
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', checkAuth, (req, res) => {
  try {
    const { name, image, description, active, order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const newCategory = db.addCategory({
      name,
      slug: req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: image || 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=600&q=80',
      description: description || '',
      active: active !== undefined ? active : true,
      order: Number(order) || 1
    });
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', checkAuth, (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', checkAuth, (req, res) => {
  try {
    const deleted = db.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PRODUCTS API ====================
app.get('/api/products', (req, res) => {
  try {
    const {
      category,
      categoryId,
      search,
      featured,
      activeOnly,
      minPrice,
      maxPrice,
      inStockOnly,
      sort
    } = req.query;

    const products = db.getProducts({
      category: category as string,
      categoryId: categoryId as string,
      search: search as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
      activeOnly: activeOnly !== undefined ? activeOnly === 'true' : false,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStockOnly === 'true',
      sort: sort as any
    });

    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', checkAuth, (req, res) => {
  try {
    const {
      name,
      category,
      categoryId,
      price,
      originalPrice,
      description,
      image,
      stock,
      soundLevel,
      pieceCount,
      featured,
      active,
      tags,
      safetyRating
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const newProduct = db.addProduct({
      name,
      slug: req.body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category || 'General Fireworks',
      categoryId: categoryId || 'cat_sparklers',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=600&q=80',
      stock: stock !== undefined ? Number(stock) : 100,
      soundLevel: soundLevel || 'Medium',
      pieceCount: pieceCount || '1 Box',
      featured: Boolean(featured),
      active: active !== undefined ? Boolean(active) : true,
      tags: tags || [],
      safetyRating: safetyRating || 'Green Certified'
    });

    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', checkAuth, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', checkAuth, (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/bulk', checkAuth, (req, res) => {
  try {
    const { action, ids, payload } = req.body;
    if (!action || !ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Action and array of product IDs required' });
    }
    const success = db.bulkUpdateProducts(action, ids, payload);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ORDERS API ====================
app.get('/api/orders', checkAuth, (req, res) => {
  try {
    const { status, search } = req.query;
    const orders = db.getOrders({
      status: status as string,
      search: search as string
    });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || !customer.fullName || !customer.mobile || !customer.address || !customer.city) {
      return res.status(400).json({ error: 'Customer name, mobile number, address, and city are required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const newOrder = db.createOrder({
      customer,
      items
    });

    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', checkAuth, (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/whatsapp', (req, res) => {
  try {
    const { whatsappStatus } = req.body;
    const updated = db.updateWhatsAppStatus(req.params.id, whatsappStatus || 'SENT');
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:id', checkAuth, (req, res) => {
  try {
    const deleted = db.deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD STATS API ====================
app.get('/api/dashboard/stats', checkAuth, (req, res) => {
  try {
    const stats = db.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CUSTOMER ENQUIRIES API ====================
app.get('/api/enquiries', checkAuth, (req, res) => {
  try {
    const enquiries = db.getEnquiries();
    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/enquiries', (req, res) => {
  try {
    const { name, mobile, email, city, subject, message } = req.body;
    if (!name || !mobile || !message) {
      return res.status(400).json({ error: 'Name, mobile and message are required' });
    }
    const enquiry = db.addEnquiry({
      name,
      mobile,
      email,
      city: city || '',
      subject: subject || 'General Enquiry',
      message
    });
    res.status(201).json(enquiry);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/enquiries/:id/status', checkAuth, (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateEnquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/enquiries/:id', checkAuth, (req, res) => {
  try {
    const deleted = db.deleteEnquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VITE & STATIC SERVING ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Sivakasi Fireworks Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
