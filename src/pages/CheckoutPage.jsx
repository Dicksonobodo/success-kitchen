import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CheckoutForm from '../components/CheckoutForm';
import { formatPrice } from '../utils/helpers';
import { createOrder } from '../services/orderService';
import { sendOrderToWhatsApp } from '../services/whatsappService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const total = getCartTotal();

  // If cart is empty, redirect to menu
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out</p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        specialInstructions: formData.specialInstructions,
        items: cartItems,
        total: total
      };

      // Save order to Firebase first
      const createdOrder = await createOrder(orderData);

      // Send order to WhatsApp - this will open WhatsApp
      sendOrderToWhatsApp(createdOrder);

      // Clear cart
      clearCart();

      // Small delay to ensure WhatsApp opens, then navigate
      setTimeout(() => {
        navigate('/order-success', { state: { order: createdOrder } });
      }, 1000);

    } catch (err) {
      console.error('Error submitting order:', err);
      setError('Failed to place order. Please try again or contact us on WhatsApp.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 mb-6 font-semibold transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Menu</span>
        </button>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Checkout Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Delivery Information
              </h2>
              
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <CheckoutForm 
                onSubmit={handleSubmitOrder} 
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-bold text-blue-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Subtotal</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold text-gray-700">Delivery Fee</span>
                  <span className="text-lg font-semibold text-gray-800">
                    To be confirmed
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-amber-500">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> After placing your order, WhatsApp will open with your order details. Send the message to complete your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;