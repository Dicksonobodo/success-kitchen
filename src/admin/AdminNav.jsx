import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, Home } from 'lucide-react';

const AdminNav = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-2">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base"
          >
            <Home size={18} />
            <span className="font-semibold hidden sm:inline">Back to Store</span>
            <span className="font-semibold sm:hidden">Store</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isActive('/admin')
                  ? 'bg-amber-500 text-white'
                  : 'hover:bg-blue-800'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="font-semibold">Dashboard</span>
            </Link>
            
            <Link
              to="/admin/menu"
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isActive('/admin/menu')
                  ? 'bg-amber-500 text-white'
                  : 'hover:bg-blue-800'
              }`}
            >
              <Menu size={18} />
              <span className="font-semibold">Menu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;