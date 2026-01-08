import { formatWhatsAppMessage } from '../utils/helpers';

/**
 * Send order details to WhatsApp
 * @param {object} orderData - Order data to send
 * @returns {void}
 */
export const sendOrderToWhatsApp = (orderData) => {
  try {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    
    console.log('📱 WhatsApp Service - Phone number:', phoneNumber);
    console.log('📱 Order data received:', orderData);
    
    if (!phoneNumber) {
      console.error('❌ WhatsApp number not configured');
      alert('WhatsApp number is not configured. Please add VITE_WHATSAPP_NUMBER=2348160860973 to your .env file and restart the server.');
      throw new Error('WhatsApp number not configured');
    }
    
    // Format the message
    console.log('📝 Formatting message for order:', orderData.orderId);
    const message = formatWhatsAppMessage(orderData);
    console.log('📝 Formatted message:', message.substring(0, 100) + '...'); // Show first 100 chars
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    console.log('🔗 WhatsApp URL created (length):', whatsappUrl.length);
    console.log('🔗 Full URL:', whatsappUrl);
    
    // Open WhatsApp in a new window
    console.log('🚀 Attempting to open WhatsApp...');
    const newWindow = window.open(whatsappUrl, '_blank');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.error('❌ Pop-up was blocked by browser!');
      alert('Pop-up blocked! Please allow pop-ups for this site.\n\nClick the 🚫 icon in your address bar and select "Always allow pop-ups"');
    } else {
      console.log('✅ WhatsApp window opened successfully');
    }
    
  } catch (error) {
    console.error('❌ Error sending to WhatsApp:', error);
    alert('Error opening WhatsApp: ' + error.message);
    throw error;
  }
};

/**
 * Send order confirmation to customer via WhatsApp
 * @param {string} customerPhone - Customer's phone number
 * @param {object} orderData - Order data
 * @returns {void}
 */
export const sendCustomerConfirmation = (customerPhone, orderData) => {
  try {
    const { orderId, total } = orderData;
    
    let message = `✅ *Order Confirmed!*\n\n`;
    message += `Thank you for your order!\n\n`;
    message += `📋 Order ID: ${orderId}\n`;
    message += `💰 Total: ₦${total.toLocaleString('en-NG')}\n\n`;
    message += `Your order is being prepared and will be delivered soon.\n\n`;
    message += `*Success Signature Meals*\n`;
    message += `📞 Call us: 0816 086 0973`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
    
    // Return the URL instead of opening it (admin can choose to send)
    return whatsappUrl;
    
  } catch (error) {
    console.error('Error creating customer confirmation:', error);
    throw error;
  }
};

/**
 * Send order status update to customer
 * @param {string} customerPhone - Customer's phone number
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {string} WhatsApp URL
 */
export const sendStatusUpdate = (customerPhone, orderId, status) => {
  try {
    let statusMessage = '';
    
    switch (status) {
      case 'preparing':
        statusMessage = '👨‍🍳 Your order is being prepared!';
        break;
      case 'ready':
        statusMessage = '✅ Your order is ready for delivery/pickup!';
        break;
      case 'completed':
        statusMessage = '🎉 Your order has been delivered! Enjoy your meal!';
        break;
      default:
        statusMessage = `📦 Order status updated: ${status}`;
    }
    
    let message = `*Order Update*\n\n`;
    message += `📋 Order ID: ${orderId}\n\n`;
    message += `${statusMessage}\n\n`;
    message += `*Success Signature Meals*\n`;
    message += `📞 0816 086 0973`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodedMessage}`;
    
    return whatsappUrl;
    
  } catch (error) {
    console.error('Error creating status update:', error);
    throw error;
  }
};

/**
 * Create a WhatsApp link for general inquiries
 * @param {string} message - Optional pre-filled message
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppLink = (message = '') => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${phoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};