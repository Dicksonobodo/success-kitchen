import { CheckCircle, Phone, MapPin, ShoppingBag, Copy, Check } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = ({ order }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. We have received your order and will start preparing it shortly.
        </p>
      </div>

      {/* Order ID */}
      <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-xl font-bold text-blue-900">{order.orderId}</p>
          </div>
          <button
            onClick={handleCopyOrderId}
            className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span className="text-sm font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span className="text-sm font-medium">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-amber-500 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="font-semibold text-gray-800">{order.phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-amber-500 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Delivery Address</p>
              <p className="font-semibold text-gray-800">{order.address}</p>
            </div>
          </div>

          {order.specialInstructions && (
            <div className="flex items-start space-x-3">
              <ShoppingBag className="w-5 h-5 text-amber-500 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Special Instructions</p>
                <p className="font-semibold text-gray-800">{order.specialInstructions}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
        
        <div className="space-y-3 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-blue-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-amber-500">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      {/* What Next */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">What happens next?</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">1.</span>
            <span>Our team has received your order via WhatsApp</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">2.</span>
            <span>We will confirm your order and start preparing your meal</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">3.</span>
            <span>Your order will be delivered to your address</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 font-bold">4.</span>
            <span>We will contact you on WhatsApp if we need any clarification</span>
          </li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
        <p className="text-gray-600 mb-2">Questions about your order?</p>
        <a
          href="https://wa.me/2348160860973"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold"
        >
          <Phone size={18} />
          <span>Contact us on WhatsApp: 0816 086 0973</span>
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleBackToMenu}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition-colors"
        >
          Order More Items
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-white hover:bg-gray-50 text-blue-900 border-2 border-blue-900 py-3 rounded-lg font-bold transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;