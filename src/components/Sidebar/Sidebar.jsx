import { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Clock, FileText, CheckSquare, Menu } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import styles from './Sidebar.module.css';

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Sidebar() {
  const {
    notes,
    todos,
    currentItemId,
    isSidebarCollapsed,
    createNote,
    createTodo,
    selectItem,
    deleteItem,
    toggleSidebarCollapse,
  } = useNotes();

  const [activeTab, setActiveTab] = useState('notes');

  const handleSelectItem = (id) => {
    selectItem(id);
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    deleteItem(id);
  };

  const sidebarClasses = [
    styles.sidebar,
    isSidebarCollapsed ? styles.collapsed : '',
  ].filter(Boolean).join(' ');

  const hasNotes = notes.length > 0;
  const hasTodos = todos.length > 0;
  const isEmpty = !hasNotes && !hasTodos;

  const displayNotes = activeTab === 'notes';
  const displayTodos = activeTab === 'todos';

  return (
    <>
      <aside className={sidebarClasses}>
        <div className={styles.sidebarHeader}>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabBtn} ${displayNotes ? styles.active : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <FileText size={14} />
              <span>笔记</span>
              {hasNotes && <span className={styles.tabCount}>{notes.length}</span>}
            </button>
            <button
              className={`${styles.tabBtn} ${displayTodos ? styles.active : ''}`}
              onClick={() => setActiveTab('todos')}
            >
              <CheckSquare size={14} />
              <span>待办</span>
              {hasTodos && <span className={styles.tabCount}>{todos.length}</span>}
            </button>
          </div>
          <button
            className={styles.sidebarToggle}
            onClick={toggleSidebarCollapse}
            title={isSidebarCollapsed ? '展开' : '折叠'}
          >
            <ChevronLeft />
          </button>
        </div>

        <div className={styles.noteList}>
          {isEmpty ? (
            <div className={styles.emptyState}>
              <FileText className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>还没有内容</h3>
              <p className={styles.emptyDesc}>创建笔记或待办清单吧</p>
              <div className={styles.emptyBtnGroup}>
                <button className={styles.emptyBtn} onClick={createNote}>
                  <Plus />
                  创建笔记
                </button>
                <button className={styles.emptyBtnSecondary} onClick={createTodo}>
                  <CheckSquare />
                  待办清单
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Notes Section */}
              {displayNotes && hasNotes && (
                <div className={styles.section}>
                  {notes.map((note, index) => (
                    <div
                      key={note.id}
                      className={`${styles.noteCard} ${note.id === currentItemId ? styles.selected : ''}`}
                      onClick={() => handleSelectItem(note.id)}
                      style={{ animationDelay: `${Math.min(index * 50, 350)}ms` }}
                    >
                      <div className={styles.noteCardIcon}>
                        <FileText size={14} />
                      </div>
                      <div className={styles.noteCardContent}>
                        <div className={styles.noteCardTitle}>
                          {note.title || '无标题笔记'}
                        </div>
                        <div className={styles.noteCardMeta}>
                          <Clock size={10} />
                          <span>{formatDateTime(note.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        className={styles.noteCardDelete}
                        onClick={(e) => handleDeleteItem(e, note.id)}
                        title="删除"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes empty state when tab is active but no notes */}
              {displayNotes && !hasNotes && (
                <div className={styles.tabEmptyState}>
                  <p>暂无笔记</p>
                  <button className={styles.emptyBtn} onClick={createNote}>
                    <Plus size={14} />
                    创建笔记
                  </button>
                </div>
              )}

              {/* Todos Section */}
              {displayTodos && hasTodos && (
                <div className={styles.section}>
                  {todos.map((todo, index) => (
                    <div
                      key={todo.id}
                      className={`${styles.noteCard} ${todo.id === currentItemId ? styles.selected : ''}`}
                      onClick={() => handleSelectItem(todo.id)}
                      style={{ animationDelay: `${Math.min(index * 50, 350)}ms` }}
                    >
                      <div className={styles.noteCardIcon}>
                        <CheckSquare size={14} />
                      </div>
                      <div className={styles.noteCardContent}>
                        <div className={styles.noteCardTitle}>
                          {todo.title || '无标题待办'}
                        </div>
                        <div className={styles.noteCardMeta}>
                          <Clock size={10} />
                          <span>{formatDateTime(todo.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        className={styles.noteCardDelete}
                        onClick={(e) => handleDeleteItem(e, todo.id)}
                        title="删除"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Todos empty state when tab is active but no todos */}
              {displayTodos && !hasTodos && (
                <div className={styles.tabEmptyState}>
                  <p>暂无待办</p>
                  <button className={styles.emptyBtn} onClick={createTodo}>
                    <Plus size={14} />
                    创建待办
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button className={styles.mobileToggle} onClick={toggleSidebarCollapse}>
        <Menu />
      </button>
    </>
  );
}
