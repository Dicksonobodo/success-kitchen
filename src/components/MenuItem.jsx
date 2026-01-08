import { Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import { useState } from 'react';

const MenuItem = ({ item }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  // Find if item is already in cart
  const cartItem = cartItems.find((i) => i.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart(item);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1000);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(item.id, cartItem.quantity + 1);
    } else {
      addToCart(item);
    }
  };

  const handleDecrement = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(item.id, cartItem.quantity - 1);
    } else if (cartItem && cartItem.quantity === 1) {
      updateQuantity(item.id, 0); // This will remove the item
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-900 to-blue-700">
            <span className="text-white text-4xl font-bold">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Type Badge */}
        {item.type && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {item.type}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            {item.price > 0 ? (
              <span className="text-xl font-bold text-blue-900">
                {formatPrice(item.price)}
              </span>
            ) : (
              <span className="text-sm text-amber-600 font-medium">
                {item.priceNote || 'Price varies'}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Controls */}
          {item.price > 0 ? (
            <div>
              {quantityInCart === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDecrement}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-bold text-blue-900 w-8 text-center">
                    {quantityInCart}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="bg-amber-500 hover:bg-amber-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              Inquire
            </button>
          )}
        </div>

        {/* Added to Cart Notification */}
        {showAdded && (
          <div className="mt-2 text-center text-green-600 text-sm font-semibold animate-pulse">
            ✓ Added to cart!
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItem;