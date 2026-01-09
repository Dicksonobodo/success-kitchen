import { useState, useEffect, useCallback } from 'react';
import { Package, Clock, CheckCircle, Trash2 } from 'lucide-react';
import OrdersList from './OrdersList';
import { getAllOrders, getTodayOrders } from '../services/orderService';
import { formatPrice } from '../utils/helpers';
import AdminNav from './AdminNav';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    todayRevenue: 0
  });

  // Calculate statistics
  const calculateStats = (ordersList) => {
    const todayOrders = ordersList.filter(order => {
      const orderDate = new Date(order.timestamp);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });

    const newStats = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.status === 'pending').length,
      preparing: ordersList.filter(o => o.status === 'preparing').length,
      ready: ordersList.filter(o => o.status === 'ready').length,
      completed: ordersList.filter(o => o.status === 'completed').length,
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0)
    };

    setStats(newStats);
  };

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let fetchedOrders = [];
      
      if (filter === 'today') {
        fetchedOrders = await getTodayOrders();
      } else if (filter === 'all') {
        fetchedOrders = await getAllOrders();
      } else {
        const allOrders = await getAllOrders();
        fetchedOrders = allOrders.filter(order => order.status === filter);
      }
      
      setOrders(fetchedOrders);
      calculateStats(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Delete all orders
  const handleDeleteAllOrders = async () => {
    setLoading(true);
    try {
      const { collection, getDocs, deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');

      const ordersRef = collection(db, 'orders');
      const querySnapshot = await getDocs(ordersRef);

      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(deleteDoc(doc(db, 'orders', document.id)));
      });

      await Promise.all(deletePromises);

      alert(`✅ Successfully deleted ${deletePromises.length} orders!`);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting orders:', error);
      alert('Failed to delete orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your orders and track performance</p>
            </div>
            
            {/* Delete All Orders Button */}
            {orders.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-lg"
                title="Clear all orders"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Clear All Orders ({orders.length})</span>
                <span className="sm:hidden">Clear All</span>
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-semibold">Total Orders</h3>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-semibold">Pending</h3>
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-semibold">Preparing</h3>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.preparing}</p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 text-sm font-semibold">Completed</h3>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
            </div>
          </div>

          {/* Today's Revenue */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-md p-6 mb-8 text-white">
            <h3 className="text-lg font-semibold mb-2">Today's Revenue</h3>
            <p className="text-4xl font-bold">{formatPrice(stats.todayRevenue)}</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Filter Orders</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'today'
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'pending'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('preparing')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'preparing'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Preparing
              </button>
              <button
                onClick={() => setFilter('ready')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'ready'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'completed'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : (
            <OrdersList orders={orders} onRefresh={fetchOrders} />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAllOrders}
        title="Delete All Orders?"
        message={`You are about to permanently delete all ${orders.length} orders. This action cannot be undone. Are you sure you want to continue?`}
        confirmText="Yes, Delete All"
        cancelText="Cancel"
        isDangerous={true}
      />
    </>
  );
};

export default AdminDashboard;