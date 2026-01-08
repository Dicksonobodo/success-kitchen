import { useState } from 'react';
import { Lock } from 'lucide-react';

const AdminAuth = ({ children }) => {
  // Initialize state from sessionStorage directly
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = sessionStorage.getItem('adminAuth');
    return auth === 'authenticated';
  });
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set your admin password here - CHANGE THIS!
    const ADMIN_PASSWORD = 'success2024';
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'authenticated');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter password to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter admin password"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold transition-colors"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-colors z-50"
      >
        Logout
      </button>
    </>
  );
};

export default AdminAuth;