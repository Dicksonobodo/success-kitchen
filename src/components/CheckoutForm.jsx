import { useState } from 'react';
import { User, Phone, MapPin, MessageSquare } from 'lucide-react';
import { validateOrderForm } from '../utils/helpers';

const CheckoutForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    const validation = validateOrderForm(formData);
    if (validation.errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      customerName: true,
      phone: true,
      address: true
    });

    // Validate form
    const validation = validateOrderForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit form
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Name */}
      <div>
        <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.customerName && errors.customerName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-amber-500'
            }`}
            placeholder="Enter your full name"
          />
        </div>
        {touched.customerName && errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.phone && errors.phone
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-amber-500'
            }`}
            placeholder="080XXXXXXXX"
          />
        </div>
        {touched.phone && errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Delivery Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
          Delivery Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="3"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
              touched.address && errors.address
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-amber-500'
            }`}
            placeholder="Enter your complete delivery address including landmarks"
          />
        </div>
        {touched.address && errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* Special Instructions */}
      <div>
        <label htmlFor="specialInstructions" className="block text-sm font-semibold text-gray-700 mb-2">
          Special Instructions (Optional)
        </label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows="3"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            placeholder="Any special requests or dietary requirements?"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-600'
        }`}
      >
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
};

export default CheckoutForm;