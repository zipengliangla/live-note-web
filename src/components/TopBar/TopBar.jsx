import { Plus, CheckSquare } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import styles from './TopBar.module.css';

export default function TopBar() {
  const { createNote, createTodo } = useNotes();

  return (
    <header className={styles.topbar}>
      <div className={styles.logo}>
        <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
          <path d="M2 2l7.586 7.586"/>
          <circle cx="11" cy="11" r="2"/>
        </svg>
        <span className={styles.logoText}>Live Note</span>
        <span className={styles.logoTagline}>
          <span className={styles.taglineMain}>你的随身笔记</span>
          <span className={styles.taglineSub}>随遇而安</span>
        </span>
      </div>
      <div className={styles.btnGroup}>
        <button className={styles.btnNewSecondary} onClick={createTodo}>
          <CheckSquare />
          <span>待办清单</span>
        </button>
        <button className={styles.btnNew} onClick={createNote}>
          <Plus />
          <span>新建笔记</span>
        </button>
      </div>
    </header>
  );
}
