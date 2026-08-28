import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Customer Layout Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { ToastContainer } from './components/common/ToastContainer';
import { AddToCartNotification } from './components/common/AddToCartNotification';
import { ScrollToTop } from './components/common/ScrollToTop';
import { FestiveLoader } from './components/common/FestiveLoader';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CartPage } from './pages/CartPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AboutPage } from './pages/AboutPage';
import { SafetyPage } from './pages/SafetyPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSettings } from './pages/admin/AdminSettings';

// Public Customer Shell with Header, Footer, and Floating WhatsApp
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Header />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <MobileBottomNav />
    </div>
  );
};

export function App() {
  const [showLoader, setShowLoader] = React.useState(() => {
    // Only show on initial load
    if (typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem('sivakasi_intro_viewed');
      // If user directly visits admin login or admin panel, don't delay
      if (window.location.pathname.startsWith('/admin')) {
        return false;
      }
      return !alreadyShown;
    }
    return true;
  });

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem('sivakasi_intro_viewed', 'true');
    } catch {
      // ignore storage errors
    }
    setShowLoader(false);
  };

  return (
    <ShopProvider>
      <CartProvider>
        <AuthProvider>
          {showLoader && (
            <FestiveLoader
              minDurationMs={2600}
              onComplete={handleLoaderComplete}
            />
          )}
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="my-orders" element={<MyOrdersPage />} />
                <Route path="orders" element={<MyOrdersPage />} />
                <Route path="order-confirmation/:id" element={<OrderConfirmationPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="safety" element={<SafetyPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="faq" element={<FAQPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<CustomerLayout />}>
                <Route path="*" element={<HomePage />} />
              </Route>
            </Routes>
            <AddToCartNotification />
            <ToastContainer />
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </ShopProvider>
  );
}

export default App;
