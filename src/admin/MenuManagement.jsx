import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../services/menuService';
import { menuData as localMenuData } from '../data/menuData';
import { initializeMenuInFirebase } from '../services/menuService';
import AdminNav from './AdminNav';
import ConfirmModal from '../components/ConfirmModal';

const MenuManagement = () => {
  const [activeCategory, setActiveCategory] = useState('snacks');
  const [items, setItems] = useState({ snacks: { items: [] }, meals: { items: [] } });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showInitModal, setShowInitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    description: '',
    type: '',
    image: ''
  });

  // Load menu from Firebase
  const loadMenu = async () => {
    setLoading(true);
    try {
      const menuData = await getAllMenuItems();
      setItems(menuData);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  // Initialize Firebase with local menu data
  const handleInitializeMenu = async () => {
    setLoading(true);
    try {
      await initializeMenuInFirebase(localMenuData);
      alert('✅ Menu initialized successfully!');
      await loadMenu();
    } catch (error) {
      console.error('Error initializing menu:', error);
      alert('Failed to initialize menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear all menu items from Firebase
  const handleClearMenu = async () => {
    setLoading(true);
    try {
      const { collection, getDocs, deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');

      const menuRef = collection(db, 'menu');
      const querySnapshot = await getDocs(menuRef);

      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, 'menu', document.id)));
      });

      await Promise.all(deletePromises);
      alert(`✅ Successfully cleared ${deletePromises.length} menu items!`);
      await loadMenu();
    } catch (error) {
      console.error('Error clearing menu:', error);
      alert('Failed to clear menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData(item);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setFormData({
      id: '',
      name: '',
      price: 0,
      description: '',
      type: '',
      image: ''
    });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAddingNew(false);
    setFormData({
      id: '',
      name: '',
      price: 0,
      description: '',
      type: '',
      image: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isAddingNew) {
        // Add new item
        const newItem = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          type: formData.type,
          image: formData.image,
          category: activeCategory,
          order: items[activeCategory].items.length
        };
        
        await addMenuItem(newItem);
        alert('✅ Item added successfully!');
      } else {
        // Update existing item - formData.id is the Firebase document ID
        const updateData = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          type: formData.type,
          image: formData.image,
          category: activeCategory
        };
        
        console.log('Updating Firebase document ID:', formData.id);
        console.log('Update data:', updateData);
        await updateMenuItem(formData.id, updateData);
        alert('✅ Item updated successfully!');
      }
      
      await loadMenu();
      handleCancel();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      await deleteMenuItem(itemToDelete.id);
      alert('✅ Item deleted successfully!');
      await loadMenu();
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentItems = items[activeCategory]?.items || [];
  const totalItems = items.snacks.items.length + items.meals.items.length;

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Menu Management
            </h1>
            <p className="text-gray-600">Add, edit, or remove menu items permanently</p>
          </div>

          {/* Initialize Menu Button - Only show if no items in Firebase */}
          {!loading && totalItems === 0 && !isAddingNew && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                🎉 First Time Setup
              </h3>
              <p className="text-amber-800 mb-4">
                It looks like your menu is empty. Click below to load your menu items into Firebase.
              </p>
              <button
                onClick={() => setShowInitModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Upload size={20} />
                <span>Initialize Menu from menuData.js</span>
              </button>
            </div>
          )}

          {/* Category Tabs */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setActiveCategory('snacks')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeCategory === 'snacks'
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🍢 Small Chops & Snacks
              </button>
              <button
                onClick={() => setActiveCategory('meals')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeCategory === 'meals'
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🍛 Main Dishes
              </button>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              {!isAddingNew && !editingItem && (
                <button
                  onClick={handleAddNew}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add New Item</span>
                </button>
              )}
              
              {totalItems > 0 && !isAddingNew && !editingItem && (
                <button
                  onClick={() => setShowClearModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={20} />
                  <span>Clear All Menu ({totalItems})</span>
                </button>
              )}
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAddingNew || editingItem) && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {isAddingNew ? 'Add New Item' : 'Edit Item'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Meat Pie"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave as 0 for items with variable pricing</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    placeholder="Describe the item..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., pack, platter, individual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="/images/item.jpg"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Save size={20} />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <X size={20} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {items[activeCategory]?.category} ({currentItems.length} items)
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                <p className="mt-4 text-gray-600">Loading menu...</p>
              </div>
            ) : currentItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No items in this category</p>
            ) : (
              <div className="space-y-4">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          {item.price > 0 ? (
                            <span className="font-bold text-amber-600">
                              {formatPrice(item.price)}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">Price varies</span>
                          )}
                          {item.type && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                              {item.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                          title="Edit item"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(item)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                          title="Delete item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Initialize Menu Confirmation Modal */}
      <ConfirmModal
        isOpen={showInitModal}
        onClose={() => setShowInitModal(false)}
        onConfirm={handleInitializeMenu}
        title="Initialize Menu?"
        message="This will load all menu items from menuData.js into Firebase. This is a one-time setup and should only be done once."
        confirmText="Initialize Menu"
        cancelText="Cancel"
        isDangerous={false}
      />

      {/* Clear Menu Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearMenu}
        title="Clear All Menu Items?"
        message={`You are about to permanently delete all ${totalItems} menu items. You can re-initialize the menu afterwards. This action cannot be undone.`}
        confirmText="Yes, Clear All"
        cancelText="Cancel"
        isDangerous={true}
      />

      {/* Delete Item Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Item?"
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </>
  );
};

export default MenuManagement;