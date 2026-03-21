import { Plus, Package } from 'lucide-react';

const EmptyState = ({ onAddItem }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mb-4">
        <Package size={64} className="mx-auto text-slate-300 dark:text-slate-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        No items found
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
        Add your first item to get started managing your collection
      </p>
      <button
        onClick={onAddItem}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        <Plus size={20} />
        Add Item
      </button>
    </div>
  );
};

export default EmptyState;
