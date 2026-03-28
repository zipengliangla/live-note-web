import { useEffect, useRef, useCallback } from 'react';
import { Pencil, Check, Loader } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import TodoEditor from './TodoEditor';
import styles from './Editor.module.css';

export default function Editor() {
  const {
    currentItem,
    currentItemId,
    saveStatus,
    updateItem,
  } = useNotes();

  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Handle input changes with debounce
  const handleInput = useCallback(() => {
    if (!currentItemId) return;

    const title = titleRef.current?.value || '';
    const body = bodyRef.current?.value || '';

    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      updateItem(currentItemId, { title, body });
    }, 500);
  }, [currentItemId, updateItem]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Update input values when currentItem changes
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.value = currentItem?.title || '';
    }
    if (bodyRef.current) {
      bodyRef.current.value = currentItem?.body || '';
    }
  }, [currentItemId, currentItem?.title, currentItem?.body]);

  // Focus title when creating new note
  useEffect(() => {
    if (currentItemId && currentItem?.type === 'note' && !currentItem?.title && !currentItem?.body) {
      titleRef.current?.focus();
    }
  }, [currentItemId, currentItem?.title, currentItem?.body, currentItem?.type]);

  const SaveStatusIcon = () => {
    if (saveStatus === 'saving') {
      return <Loader className={styles.saveIcon} />;
    }
    return <Check className={styles.saveIcon} />;
  };

  const isTodo = currentItem?.type === 'todo';

  return (
    <section className={styles.editor}>
      <div className={styles.editorContent}>
        {!currentItemId ? (
          <div className={styles.placeholder}>
            <Pencil />
            <h3>选择或创建内容</h3>
            <p>
              从左侧选择一个笔记或待办清单开始<br />
              或点击上方按钮创建新内容
            </p>
          </div>
        ) : isTodo ? (
          <TodoEditor />
        ) : (
          <>
            <input
              ref={titleRef}
              type="text"
              className={styles.editorTitle}
              placeholder="笔记标题"
              onChange={handleInput}
              defaultValue={currentItem?.title || ''}
            />
            <textarea
              ref={bodyRef}
              className={styles.editorBody}
              placeholder="开始书写你的想法..."
              onChange={handleInput}
              defaultValue={currentItem?.body || ''}
            />
          </>
        )}
      </div>

      {currentItemId && !isTodo && (
        <div className={styles.editorFooter}>
          <div className={`${styles.saveStatus} ${styles[saveStatus]}`}>
            <SaveStatusIcon />
            <span>{saveStatus === 'saving' ? '保存中...' : '已保存'}</span>
          </div>
        </div>
      )}
    </section>
  );
}
