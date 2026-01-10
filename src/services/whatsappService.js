import { formatWhatsAppMessage } from '../utils/helpers';

/**
 * Build WhatsApp order URL (ADMIN)
 * @param {object} orderData
 * @returns {string} WhatsApp URL
 */
export const sendOrderToWhatsApp = (orderData) => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!phoneNumber) {
    throw new Error('WhatsApp number not configured');
  }

  const message = encodeURIComponent(
    formatWhatsAppMessage(orderData)
  );

  return `https://wa.me/${phoneNumber}?text=${message}`;
};

/**
 * Build WhatsApp confirmation URL (CUSTOMER)
 * @param {string} customerPhone
 * @param {object} orderData
 * @returns {string}
 */
export const sendCustomerConfirmation = (customerPhone, orderData) => {
  const { orderId, total } = orderData;

  let message = `✅ *Order Confirmed!*\n\n`;
  message += `Thank you for your order!\n\n`;
  message += `📋 Order ID: ${orderId}\n`;
  message += `💰 Total: ₦${total.toLocaleString('en-NG')}\n\n`;
  message += `Your order is being prepared and will be delivered soon.\n\n`;
  message += `*Success Signature Meals*\n`;
  message += `📞 0816 086 0973`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${customerPhone}?text=${encodedMessage}`;
};

/**
 * Build WhatsApp status update URL
 * @param {string} customerPhone
 * @param {string} orderId
 * @param {string} status
 * @returns {string}
 */
export const sendStatusUpdate = (customerPhone, orderId, status) => {
  // Format phone number if it starts with 0
  let formattedPhone = customerPhone;
  if (customerPhone.startsWith('0')) {
    formattedPhone = '234' + customerPhone.slice(1);
  } else if (customerPhone.startsWith('+234')) {
    formattedPhone = customerPhone.slice(1);
  } else if (!customerPhone.startsWith('234')) {
    formattedPhone = '234' + customerPhone;
  }

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
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

/**
 * General WhatsApp link
 * @param {string} message
 * @returns {string}
 */
export const getWhatsAppLink = (message = '') => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${phoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};