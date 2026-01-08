import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { menuData } from '../data/menuData';

const MenuManagement = () => {
  const [activeCategory, setActiveCategory] = useState('snacks');
  const [items, setItems] = useState(menuData);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    description: '',
    type: '',
    image: ''
  });

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

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (isAddingNew) {
      // Add new item
      const newId = formData.name.toLowerCase().replace(/\s+/g, '-');
      const newItem = { ...formData, id: newId };
      
      setItems((prev) => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          items: [...prev[activeCategory].items, newItem]
        }
      }));
      
      alert('New item added successfully! Note: This is temporary and will reset on page refresh.');
    } else {
      // Update existing item
      setItems((prev) => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          items: prev[activeCategory].items.map((item) =>
            item.id === editingItem ? formData : item
          )
        }
      }));
      
      alert('Item updated successfully! Note: This is temporary and will reset on page refresh.');
    }

    handleCancel();
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems((prev) => ({
        ...prev,
        [activeCategory]: {
          ...prev[activeCategory],
          items: prev[activeCategory].items.filter((item) => item.id !== itemId)
        }
      }));
      
      alert('Item deleted successfully! Note: This is temporary and will reset on page refresh.');
    }
  };

  const currentItems = items[activeCategory]?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Menu Management
          </h1>
          <p className="text-gray-600">Add, edit, or remove menu items</p>
          <div className="mt-4 bg-amber-50 border border-amber-300 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Changes made here are temporary for demo purposes. 
              To make permanent changes, update the menuData.js file in your codebase.
            </p>
          </div>
        </div>

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

          {/* Add New Button */}
          {!isAddingNew && !editingItem && (
            <button
              onClick={handleAddNew}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add New Item</span>
            </button>
          )}
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
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
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

          {currentItems.length === 0 ? (
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
                        onClick={() => handleDelete(item.id)}
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
  );
};

export default MenuManagement;