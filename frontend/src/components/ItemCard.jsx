import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar } from 'lucide-react';

const ItemCard = ({ item, index, onEdit, onDelete, categoryColors }) => {
  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors['General'];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {item.name}
          </h3>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${getCategoryColor(
              item.category
            )}`}
          >
            {item.category}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Edit item"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Delete item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
        {item.description || 'No description provided'}
      </p>

      <div className="flex justify-between items-end">
        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          {formatPrice(item.price)}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <Calendar size={14} />
          {getRelativeTime(item.created_at)}
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
