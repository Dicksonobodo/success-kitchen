import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './firebase';
import { generateOrderId } from '../utils/helpers';

/**
 * Create a new order in Firestore
 * @param {object} orderData - Order data
 * @returns {Promise<object>} Created order with ID
 */
export const createOrder = async (orderData) => {
  try {
    const orderId = generateOrderId();
    const timestamp = new Date().toISOString();
    
    const order = {
      orderId,
      ...orderData,
      status: 'pending',
      timestamp,
      createdAt: timestamp
    };
    
    const docRef = await addDoc(collection(db, 'orders'), order);
    
    return {
      id: docRef.id,
      ...order
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order. Please try again.');
  }
};

/**
 * Get all orders (for admin dashboard)
 * @param {number} limitCount - Number of orders to fetch
 * @returns {Promise<Array>} Array of orders
 */
export const getAllOrders = async (limitCount = 50) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

/**
 * Get orders by status
 * @param {string} status - Order status (pending, preparing, ready, completed)
 * @returns {Promise<Array>} Array of orders
 */
export const getOrdersByStatus = async (status) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('status', '==', status),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw new Error('Failed to fetch orders');
  }
};

/**
 * Update order status
 * @param {string} orderId - Firestore document ID
 * @param {string} newStatus - New status
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

/**
 * Get a single order by order ID
 * @param {string} orderId - Order ID (not Firestore doc ID)
 * @returns {Promise<object>} Order object
 */
export const getOrderByOrderId = async (orderId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('orderId', '==', orderId), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Order not found');
    }
    
    const orderDoc = querySnapshot.docs[0];
    return {
      id: orderDoc.id,
      ...orderDoc.data()
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Get orders for today (for admin dashboard)
 * @returns {Promise<Array>} Array of today's orders
 */
export const getTodayOrders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('timestamp', '>=', today.toISOString()),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching today\'s orders:', error);
    throw new Error('Failed to fetch today\'s orders');
  }
};