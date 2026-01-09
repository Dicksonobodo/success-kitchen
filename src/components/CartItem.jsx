import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      // If quantity is 1, show delete modal instead of removing directly
      setShowDeleteModal(true);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    setShowDeleteModal(false);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <>
      <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        {/* Item Image/Icon */}
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-white text-xl font-bold">
              {item.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
            {item.name}
          </h3>
          <p className="text-amber-600 font-bold text-sm mb-2">
            {formatPrice(item.price)}
          </p>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecrement}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-bold text-blue-900 w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="bg-amber-500 hover:bg-amber-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Total & Remove */}
        <div className="flex flex-col items-end space-y-2">
          <span className="font-bold text-blue-900 text-sm">
            {formatPrice(itemTotal)}
          </span>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleRemove}
        title="Remove Item?"
        message={`Remove "${item.name}" from your cart?`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        isDangerous={true}
      />
    </>
  );
};

export default CartItem;