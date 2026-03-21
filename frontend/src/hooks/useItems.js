import { useState, useCallback, useEffect } from 'react';
import * as api from '../services/api';

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getItems();
      if (response.success) {
        setItems(response.data);
      } else {
        setError(response.error || 'Failed to fetch items');
      }
    } catch (err) {
      setError(err.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create item
  const handleCreate = useCallback(
    async (itemData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.createItem(itemData);
        if (response.success) {
          await fetchItems();
          return { success: true, message: response.message };
        } else {
          setError(response.error || 'Failed to create item');
          return { success: false, message: response.error };
        }
      } catch (err) {
        const errorMsg = err.error || 'Failed to create item';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  // Update item
  const handleUpdate = useCallback(
    async (id, itemData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.updateItem(id, itemData);
        if (response.success) {
          await fetchItems();
          setSelectedItem(null);
          return { success: true, message: response.message };
        } else {
          setError(response.error || 'Failed to update item');
          return { success: false, message: response.error };
        }
      } catch (err) {
        const errorMsg = err.error || 'Failed to update item';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  // Delete item
  const handleDelete = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.deleteItem(id);
        if (response.success) {
          await fetchItems();
          return { success: true, message: response.message };
        } else {
          setError(response.error || 'Failed to delete item');
          return { success: false, message: response.error };
        }
      } catch (err) {
        const errorMsg = err.error || 'Failed to delete item';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [fetchItems]
  );

  // Search items
  const handleSearch = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchItems(query);
      if (response.success) {
        setItems(response.data);
      } else {
        setError(response.error || 'Failed to search items');
      }
    } catch (err) {
      setError(err.error || 'Failed to search items');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    selectedItem,
    setSelectedItem,
    fetchItems,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSearch,
  };
};
