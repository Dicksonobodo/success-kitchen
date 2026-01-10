import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-amber-500">Success</span> Signature Meals
            </h3>
            <p className="text-gray-300">
              Delicious Nigerian cuisine delivered to your doorstep
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-amber-500 transition-colors">
                  Menu
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <a
              href="https://wa.me/2348160860973"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-amber-500 transition-colors"
            >
              <Phone size={18} />
              <span>0816 086 0973</span>
            </a>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Success Signature Meals. All rights reserved.</p>
          {/* Discreet admin link - looks like copyright text */}
          <Link 
            to="/admin" 
            className="text-gray-500 hover:text-gray-400 transition-colors text-xs mt-2 inline-block"
          >
            0
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;