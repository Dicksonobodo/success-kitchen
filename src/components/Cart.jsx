import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();
  
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearCartModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-900 text-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={24} />
              <h2 className="text-xl font-bold">Your Cart</h2>
              <span className="bg-amber-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="hover:text-amber-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingBag size={64} className="mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-2">Add some delicious items!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {/* Total */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  Total:
                </span>
                <span className="text-2xl font-bold text-blue-900">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => setShowClearCartModal(true)}
                  className="w-full bg-white hover:bg-gray-100 text-red-600 border border-red-600 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 size={18} />
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearCartModal}
        onClose={() => setShowClearCartModal(false)}
        onConfirm={handleClearCart}
        title="Clear Cart?"
        message={`Are you sure you want to remove all ${cartItems.length} items from your cart?`}
        confirmText="Yes, Clear Cart"
        cancelText="Cancel"
        isDangerous={true}
      />
    </>
  );
};

export default Cart;