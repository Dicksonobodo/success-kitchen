import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { getWhatsAppLink } from '../services/whatsappService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleWhatsAppClick = () => {
    const message = 'Hi! I have a question about your menu.';
    window.open(getWhatsAppLink(message), '_blank');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="text-xl sm:text-2xl font-bold">
              <span className="text-amber-500">Success</span>
              <span className="text-white hidden sm:inline"> Signature Meals</span>
              <span className="text-white sm:hidden"> SM</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="hover:text-amber-500 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="hover:text-amber-500 transition-colors font-medium"
            >
              Menu
            </Link>
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-2 hover:text-amber-500 transition-colors font-medium"
            >
              <Phone size={18} />
              <span>Contact</span>
            </button>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center space-x-4">
            <Link
              to="/checkout"
              className="relative hover:text-amber-500 transition-colors"
              onClick={closeMenu}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden hover:text-amber-500 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-800">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={closeMenu}
                className="hover:text-amber-500 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/menu"
                onClick={closeMenu}
                className="hover:text-amber-500 transition-colors font-medium"
              >
                Menu
              </Link>
              <button
                onClick={() => {
                  handleWhatsAppClick();
                  closeMenu();
                }}
                className="flex items-center space-x-2 hover:text-amber-500 transition-colors font-medium text-left"
              >
                <Phone size={18} />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;