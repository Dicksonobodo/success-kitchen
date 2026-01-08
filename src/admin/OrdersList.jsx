import { useState } from 'react';
import { Phone, MapPin, Calendar, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { updateOrderStatus } from '../services/orderService';
import { sendStatusUpdate } from '../services/whatsappService';

const OrdersList = ({ orders, onRefresh }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusUpdate = async (order, newStatus) => {
    setUpdatingStatus(order.id);
    try {
      await updateOrderStatus(order.id, newStatus);
      
      // Show success message
      alert(`Order ${order.orderId} status updated to ${newStatus}`);
      
      // Refresh orders list
      onRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleNotifyCustomer = (order, status) => {
    const whatsappUrl = sendStatusUpdate(order.phone, order.orderId, status);
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'ready':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">No orders found</p>
        <p className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Order Header */}
          <div
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleOrderExpand(order.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-blue-900">
                    {order.orderId}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{formatDate(order.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone size={16} />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="font-bold text-blue-900">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>
              <div>
                {expandedOrder === order.id ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Expanded Order Details */}
          {expandedOrder === order.id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {/* Customer Info */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-amber-500 mt-1" />
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-800">{order.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-amber-500 mt-1" />
                    <div>
                      <p className="text-gray-600">Delivery Address</p>
                      <p className="font-semibold text-gray-800">{order.address}</p>
                    </div>
                  </div>
                  {order.specialInstructions && (
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-amber-500 mt-1" />
                      <div>
                        <p className="text-gray-600">Special Instructions</p>
                        <p className="font-semibold text-gray-800">{order.specialInstructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-blue-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center bg-amber-50 p-3 rounded border-2 border-amber-300">
                    <p className="font-bold text-gray-800">Total</p>
                    <p className="text-xl font-bold text-amber-600">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {order.status !== 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(order, 'pending')}
                      disabled={updatingStatus === order.id}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      Mark as Pending
                    </button>
                  )}
                  {order.status !== 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order, 'preparing')}
                      disabled={updatingStatus === order.id}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      Mark as Preparing
                    </button>
                  )}
                  {order.status !== 'ready' && (
                    <button
                      onClick={() => handleStatusUpdate(order, 'ready')}
                      disabled={updatingStatus === order.id}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusUpdate(order, 'completed')}
                      disabled={updatingStatus === order.id}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>

              {/* Notify Customer */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3">Notify Customer</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleNotifyCustomer(order, 'preparing')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Phone size={18} />
                    <span>Order Preparing</span>
                  </button>
                  <button
                    onClick={() => handleNotifyCustomer(order, 'ready')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Phone size={18} />
                    <span>Order Ready</span>
                  </button>
                  <button
                    onClick={() => handleNotifyCustomer(order, 'completed')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <Phone size={18} />
                    <span>Order Delivered</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersList;