import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboard from './admin/AdminDashboard';
import MenuManagement from './admin/MenuManagement';
import AdminAuth from './admin/AdminAuth';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              
              {/* Admin Routes - Protected with password */}
              <Route 
                path="/admin" 
                element={
                  <AdminAuth>
                    <AdminDashboard />
                  </AdminAuth>
                } 
              />
              <Route 
                path="/admin/menu" 
                element={
                  <AdminAuth>
                    <MenuManagement />
                  </AdminAuth>
                } 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;