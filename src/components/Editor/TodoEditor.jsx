import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import styles from './TodoEditor.module.css';

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TodoEditor() {
  const { currentItem, currentItemId, updateItem } = useNotes();
  const [newTodoText, setNewTodoText] = useState('');
  const inputRef = useRef(null);

  // Update local state when item changes
  useEffect(() => {
    setNewTodoText('');
  }, [currentItemId]);

  // Add new todo item
  const handleAddTodo = useCallback((e) => {
    e.preventDefault();
    if (!newTodoText.trim() || !currentItem) return;

    const newTodo = {
      id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTodos = [...(currentItem.todos || []), newTodo];
    updateItem(currentItem.id, { todos: updatedTodos });
    setNewTodoText('');
    inputRef.current?.focus();
  }, [newTodoText, currentItem, updateItem]);

  // Toggle todo completion
  const handleToggleTodo = useCallback((todoId) => {
    if (!currentItem) return;

    const updatedTodos = currentItem.todos.map(todo =>
      todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : todo
    );
    updateItem(currentItem.id, { todos: updatedTodos });
  }, [currentItem, updateItem]);

  // Delete todo item
  const handleDeleteTodo = useCallback((todoId) => {
    if (!currentItem) return;

    const updatedTodos = currentItem.todos.filter(todo => todo.id !== todoId);
    updateItem(currentItem.id, { todos: updatedTodos });
  }, [currentItem, updateItem]);

  // Update title
  const handleTitleChange = useCallback((e) => {
    if (!currentItem) return;
    updateItem(currentItem.id, { title: e.target.value });
  }, [currentItem, updateItem]);

  const todos = currentItem?.todos || [];
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className={styles.todoEditor}>
      <div className={styles.header}>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="待办清单标题"
          value={currentItem?.title || ''}
          onChange={handleTitleChange}
        />
      </div>

      <div className={styles.createdTime}>
        <Clock size={14} />
        <span>创建于 {formatDateTime(currentItem?.createdAt)}</span>
      </div>

      <form className={styles.addForm} onSubmit={handleAddTodo}>
        <input
          ref={inputRef}
          type="text"
          className={styles.addInput}
          placeholder="添加新待办事项..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <button
          type="submit"
          className={styles.addBtn}
          disabled={!newTodoText.trim()}
        >
          <Plus size={18} />
          添加
        </button>
      </form>

      <div className={styles.todoList}>
        {todos.length === 0 ? (
          <div className={styles.empty}>
            <p>暂无待办事项</p>
            <p className={styles.emptyHint}>添加一个开始吧</p>
          </div>
        ) : (
          <>
            <div className={styles.progress}>
              已完成 {completedCount} / {todos.length}
            </div>
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <span className={styles.checkmark}>
                    {todo.completed && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                </label>
                <div className={styles.todoContent}>
                  <span className={styles.todoText}>{todo.text}</span>
                  <span className={styles.todoCreated}>
                    {formatDateTime(todo.createdAt)}
                  </span>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteTodo(todo.id)}
                  title="删除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
