import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

/**
 /**
 * Get all menu items from Firebase
 * @returns {Promise<Object>} Menu data organized by category
 */
export const getAllMenuItems = async () => {
  try {
    const menuRef = collection(db, 'menu');
    const q = query(menuRef, orderBy('category'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const menuData = {
      snacks: { category: 'Small Chops & Snacks', items: [] },
      meals: { category: 'Main Dishes', items: [] }
    };
    
    querySnapshot.forEach((document) => {
      // Use Firebase document ID, not the old id from menuData.js
      const itemData = document.data();
      const item = {
        ...itemData,
        id: document.id, // This is the Firebase document ID (abc123xyz format)
        originalId: itemData.id // Keep the old id as originalId if it exists
      };
      
      if (item.category === 'snacks') {
        menuData.snacks.items.push(item);
      } else if (item.category === 'meals') {
        menuData.meals.items.push(item);
      }
    });
    
    return menuData;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Add a new menu item to Firebase
 * @param {Object} itemData - Menu item data
 * @returns {Promise<Object>} Created item with ID
 */
export const addMenuItem = async (itemData) => {
  try {
    const docRef = await addDoc(collection(db, 'menu'), {
      ...itemData,
      createdAt: new Date().toISOString()
    });
    
    return {
      id: docRef.id,
      ...itemData
    };
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
};

/**
/**
 * Update a menu item in Firebase
 * @param {string} itemId - Item ID (Firebase document ID)
 * @param {Object} itemData - Updated item data
 * @returns {Promise<void>}
 */
export const updateMenuItem = async (itemId, itemData) => {
  try {
    console.log('Updating Firebase document:', itemId, itemData);
    const itemRef = doc(db, 'menu', itemId);
    await updateDoc(itemRef, {
      ...itemData,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Update successful');
  } catch (error) {
    console.error('❌ Error updating menu item:', error);
    throw error;
  }
};

/**
 * Delete a menu item from Firebase
 * @param {string} itemId - Item ID
 * @returns {Promise<void>}
 */
export const deleteMenuItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'menu', itemId));
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
};

/**
 /**
 * Initialize menu from menuData.js (run once to populate Firebase)
 * @param {Object} menuData - Menu data from menuData.js
 * @returns {Promise<void>}
 */
export const initializeMenuInFirebase = async (menuData) => {
  try {
    const batch = [];
    
    // Add snacks - don't include the old 'id' field
    menuData.snacks.items.forEach((item, index) => {
      const { id, ...itemData } = item; // Remove the old id
      batch.push(addDoc(collection(db, 'menu'), {
        ...itemData,
        category: 'snacks',
        order: index,
        originalId: id // Store old id for reference
      }));
    });
    
    // Add meals - don't include the old 'id' field
    menuData.meals.items.forEach((item, index) => {
      const { id, ...itemData } = item; // Remove the old id
      batch.push(addDoc(collection(db, 'menu'), {
        ...itemData,
        category: 'meals',
        order: index,
        originalId: id // Store old id for reference
      }));
    });
    
    await Promise.all(batch);
    console.log('✅ Menu initialized in Firebase');
  } catch (error) {
    console.error('Error initializing menu:', error);
    throw error;
  }
};