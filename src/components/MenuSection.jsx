import MenuItem from './MenuItem';

const MenuSection = ({ title, items, icon }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-6">
        {icon && <span className="text-3xl">{icon}</span>}
        <h2 className="text-3xl font-bold text-blue-900 border-b-4 border-amber-500 pb-2">
          {title}
        </h2>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;