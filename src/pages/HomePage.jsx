import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, Clock, MapPin } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-900 to-blue-700 text-white py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Welcome to <span className="text-amber-500">Success</span> Signature Meals
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-200">
            Delicious Nigerian cuisine delivered to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors inline-flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={24} />
              <span>Order Now</span>
            </Link>
            <a
              href="https://wa.me/2348160860973"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-100 text-blue-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Phone size={24} />
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <ShoppingBag className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Wide Selection
              </h3>
              <p className="text-gray-600">
                From small chops to full meals, we have something for every occasion and appetite.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick and reliable delivery service to ensure your food arrives fresh and hot.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Local Delivery
              </h3>
              <p className="text-gray-600">
                We deliver across Abuja and surrounding areas with care and attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-4">
            Our Specialties
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            From our signature small chops platters to authentic Nigerian dishes, every meal is prepared with love and quality ingredients.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Small Chops */}
            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-lg p-8 border-2 border-amber-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                 Small Chops & Snacks
              </h3>
              <p className="text-gray-700 mb-4">
                Perfect for parties, events, or a quick snack. Our small chops platters include samosas, spring rolls, puff puff, and more!
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• Individual packs from ₦2,000</li>
                <li>• Party platters up to ₦20,000</li>
                <li>• Fresh and crispy every time</li>
              </ul>
            </div>

            {/* Main Dishes */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                 Main Dishes
              </h3>
              <p className="text-gray-700 mb-4">
                Authentic Nigerian cuisine that brings the taste of home. From jollof rice to rich soups, we've got you covered.
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li>• Jollof & Fried Rice</li>
                <li>• Nigerian Soups (Egusi, Ogbono, Efo)</li>
                <li>• Pepper Soup & Spaghetti</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/menu"
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-block"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* How to Order Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-12">
            How to Order
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Browse Menu</h3>
              <p className="text-gray-600">Choose from our delicious selection of items</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Add to Cart</h3>
              <p className="text-gray-600">Select your items and quantities</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Checkout</h3>
              <p className="text-gray-600">Enter your delivery details</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 text-white rounded-full mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Receive Order</h3>
              <p className="text-gray-600">Get your food delivered fresh!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Get in touch with us for bulk orders, catering services, or any inquiries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2348160860973"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center justify-center space-x-2"
            >
              <Phone size={24} />
              <span>WhatsApp: 0816 086 0973</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;