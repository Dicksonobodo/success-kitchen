import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import MenuSection from '../components/MenuSection';
import Cart from '../components/Cart';
import { getAllMenuItems } from '../services/menuService';
import { menuData as localMenuData } from '../data/menuData';
import { useCart } from '../hooks/useCart';

const MenuPage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menuData, setMenuData] = useState(localMenuData); // Start with local data
  const [loading, setLoading] = useState(true);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await getAllMenuItems();
        // Only update if we got data from Firebase
        if (data.snacks.items.length > 0 || data.meals.items.length > 0) {
          setMenuData(data);
          console.log('✅ Loaded menu from Firebase');
        } else {
          console.log('ℹ️ Using local menu data (Firebase is empty)');
        }
      } catch (error) {
        console.error('⚠️ Error loading menu from Firebase, using local data:', error);
        // Keep using local menu data on error
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-gray-200">
            Choose from our delicious selection of Nigerian cuisine
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Small Chops & Snacks Section */}
        <MenuSection
          title={menuData.snacks.category}
          items={menuData.snacks.items}
        />

        {/* Main Dishes Section */}
        <MenuSection
          title={menuData.meals.category}
          items={menuData.meals.items}
        />

        {/* Empty State if no items */}
        {menuData.snacks.items.length === 0 && menuData.meals.items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No menu items available at the moment.</p>
            <p className="text-gray-400 mt-2">Please check back later!</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <button
          onClick={toggleCart}
          className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg z-40 flex items-center space-x-2 transition-all md:hidden"
        >
          <ShoppingCart size={24} />
          <span className="bg-white text-amber-500 font-bold px-2 py-1 rounded-full text-sm">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default MenuPage;