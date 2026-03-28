import { NotesProvider } from './context/NotesContext';
import TopBar from './components/TopBar/TopBar';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import Calendar from './components/Calendar/Calendar';
import styles from './App.module.css';

export default function App() {
  return (
    <NotesProvider>
      <TopBar />
      <main className={styles.main}>
        <Sidebar />
        <Editor />
        <Calendar />
      </main>
    </NotesProvider>
  );
}
