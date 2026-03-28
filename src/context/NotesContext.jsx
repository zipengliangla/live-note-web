import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotesContext = createContext(null);

const STORAGE_KEY = 'liveNote_items';

export function NotesProvider({ children }) {
  const [items, setItems] = useState([]);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');

  // Load items from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // Save items to localStorage
  const saveItems = useCallback((itemsToSave) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));
  }, []);

  // Create new note
  const createNote = useCallback(() => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'note',
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => {
      const updated = [...prev, newItem];
      saveItems(updated);
      return updated;
    });
    setCurrentItemId(newItem.id);
    return newItem.id;
  }, [saveItems]);

  // Create new todo
  const createTodo = useCallback(() => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'todo',
      title: '',
      todos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => {
      const updated = [...prev, newItem];
      saveItems(updated);
      return updated;
    });
    setCurrentItemId(newItem.id);
    return newItem.id;
  }, [saveItems]);

  // Update item
  const updateItem = useCallback((id, updates) => {
    setSaveStatus('saving');
    setItems(prev => {
      const updated = prev.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      );
      saveItems(updated);
      return updated;
    });
    setTimeout(() => setSaveStatus('saved'), 300);
  }, [saveItems]);

  // Delete item
  const deleteItem = useCallback((id) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveItems(updated);
      return updated;
    });
    if (currentItemId === id) {
      setCurrentItemId(null);
    }
  }, [currentItemId, saveItems]);

  // Select item
  const selectItem = useCallback((id) => {
    setCurrentItemId(id);
  }, []);

  // Toggle sidebar collapse
  const toggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Toggle calendar collapse
  const toggleCalendarCollapse = useCallback(() => {
    setIsCalendarCollapsed(prev => !prev);
  }, []);

  // Get current item
  const currentItem = items.find(item => item.id === currentItemId) || null;

  // Get sorted items (notes first, then todos)
  const sortedItems = [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'note' ? -1 : 1;
    }
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // Get notes
  const notes = sortedItems.filter(item => item.type === 'note');

  // Get todos
  const todos = sortedItems.filter(item => item.type === 'todo');

  const value = {
    items: sortedItems,
    notes,
    todos,
    currentItem,
    currentItemId,
    isSidebarCollapsed,
    isCalendarCollapsed,
    saveStatus,
    createNote,
    createTodo,
    updateItem,
    deleteItem,
    selectItem,
    toggleSidebarCollapse,
    toggleCalendarCollapse,
    setCurrentItemId,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
