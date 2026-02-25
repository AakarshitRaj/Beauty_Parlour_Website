import { Link } from 'react-router-dom';

const EmptyState = ({ emoji = '📭', title, description, actionLabel, actionTo }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-6xl mb-5">{emoji}</div>
    <h3 className="text-xl font-serif font-semibold text-charcoal mb-3">{title}</h3>
    {description && <p className="text-gray-400 mb-8 max-w-sm">{description}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary">{actionLabel}</Link>
    )}
  </div>
);

export default EmptyState;
