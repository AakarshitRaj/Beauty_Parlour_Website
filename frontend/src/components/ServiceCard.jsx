import { Link } from 'react-router-dom';
import { FiClock, FiTag, FiArrowRight } from 'react-icons/fi';

const ServiceCard = ({ service }) => {
  const defaultImages = {
    facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600',
    hair: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
    makeup: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600',
    spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600',
    nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600',
    other: 'https://images.unsplash.com/photo-1560066984-138daaa14d4a?w=600',
  };

  const imageUrl = service.imageUrl || defaultImages[service.category] || defaultImages.other;

  return (
    <div className="card group">
      <div className="relative overflow-hidden h-56">
        <img
          src={imageUrl}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute top-4 right-4 bg-gold text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
          {service.category}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">{service.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <FiClock size={14} />
            <span>{service.duration} min</span>
          </div>
          <div className="flex items-center gap-1 text-gold font-semibold text-lg">
            <span>₹{service.price.toLocaleString()}</span>
          </div>
        </div>
        <Link
          to={`/booking?service=${service._id}`}
          className="flex items-center justify-center gap-2 w-full btn-primary group"
        >
          Book Now
          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
