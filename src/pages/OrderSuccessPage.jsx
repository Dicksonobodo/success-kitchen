import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderConfirmation from '../components/OrderConfirmation';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If no order data, redirect to home
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <OrderConfirmation order={order} />
    </div>
  );
};

export default OrderSuccessPage;