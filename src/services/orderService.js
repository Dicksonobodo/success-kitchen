import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { generateOrderId } from '../utils/helpers';

/**
 * Create a new order in Firestore
 */
export const createOrder = async (orderData) => {
  try {
    const orderId = generateOrderId();
    const timestamp = new Date().toISOString();

    // 🔥 Remove undefined values (Firestore does not allow them)
    const sanitizedOrderData = Object.fromEntries(
      Object.entries(orderData).filter(
        ([, value]) => value !== undefined
      )
    );

    const order = {
      orderId,
      ...sanitizedOrderData,
      status: 'pending',
      timestamp,
      createdAt: timestamp
    };

    console.log('FINAL ORDER SENT TO FIRESTORE:', order);

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
 * Get all orders (admin)
 */
export const getAllOrders = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

/**
 * Get orders by status
 */
export const getOrdersByStatus = async (status) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', status),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw new Error('Failed to fetch orders');
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

/**
 * Get order by orderId
 */
export const getOrderByOrderId = async (orderId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('orderId', '==', orderId),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Order not found');
    }

    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Get today's orders
 */
export const getTodayOrders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'orders'),
      where('timestamp', '>=', today.toISOString()),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    throw new Error("Failed to fetch today's orders");
  }
};
