/**
 * Format price to Nigerian Naira
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount) => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

/**
 * Generate a unique order ID
 * @returns {string} Order ID in format: ORD-YYYYMMDD-XXXXX
 */
export const generateOrderId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${dateStr}-${randomNum}`;
};

/**
 * Format order details for WhatsApp message
 * @param {object} orderData - Order data object
 * @returns {string} Formatted WhatsApp message
 */
export const formatWhatsAppMessage = (orderData) => {
  const { orderId, customerName, phone, address, items, total, specialInstructions, timestamp } = orderData;
  
  let message = `🍽️ *NEW ORDER ALERT!*\n\n`;
  message += `📋 *Order ID:* ${orderId}\n`;
  message += `📅 *Date:* ${new Date(timestamp).toLocaleString('en-NG')}\n\n`;
  
  message += `👤 *Customer Details:*\n`;
  message += `Name: ${customerName}\n`;
  message += `Phone: ${phone}\n`;
  message += `Address: ${address}\n\n`;
  
  message += `🛒 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
  });
  
  message += `\n💰 *Total: ${formatPrice(total)}*\n`;
  
  if (specialInstructions) {
    message += `\n📝 *Special Instructions:*\n${specialInstructions}\n`;
  }
  
  message += `\n✅ Please confirm this order.`;
  
  return encodeURIComponent(message);
};

/**
 * Validate phone number (Nigerian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export const validatePhone = (phone) => {
  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Check if it matches Nigerian phone format
  // Accepts: 080xxxxxxxx, 234xxxxxxxx, +234xxxxxxxx
  const phoneRegex = /^(\+?234|0)[7-9][0-1]\d{8}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Format phone number to international format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Convert to international format
  if (cleaned.startsWith('0')) {
    return `234${cleaned.slice(1)}`;
  } else if (cleaned.startsWith('+234')) {
    return cleaned.slice(1);
  } else if (cleaned.startsWith('234')) {
    return cleaned;
  }
  
  return cleaned;
};

/**
 * Validate form data
 * @param {object} formData - Form data to validate
 * @returns {object} Validation result with errors
 */
export const validateOrderForm = (formData) => {
  const errors = {};
  
  if (!formData.customerName || formData.customerName.trim().length < 2) {
    errors.customerName = 'Please enter a valid name';
  }
  
  if (!formData.phone || !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid Nigerian phone number';
  }
  
  if (!formData.address || formData.address.trim().length < 10) {
    errors.address = 'Please enter a complete delivery address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Calculate estimated delivery time
 * @returns {string} Estimated delivery time string
 */
export const getEstimatedDeliveryTime = () => {
  const now = new Date();
  const deliveryTime = new Date(now.getTime() + 45 * 60000); // Add 45 minutes
  
  return deliveryTime.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if restaurant is open
 * @returns {boolean} Whether restaurant is currently open
 */
export const isRestaurantOpen = () => {
  const now = new Date();
  const hour = now.getHours();
  
  // Example: Open 9 AM to 9 PM, 7 days a week
  // Adjust these hours based on actual business hours
  const openingHour = 9;
  const closingHour = 21;
  
  return hour >= openingHour && hour < closingHour;
};