import { useState, useMemo } from 'react';
import { ChevronRight, Calendar as CalendarIcon, FileText, CheckSquare } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import styles from './Calendar.module.css';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Calendar() {
  const { items, isCalendarCollapsed, toggleCalendarCollapse } = useNotes();
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
  }), [currentDate]);

  // Generate year options (current year ± 10 years)
  const yearOptions = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 10; y <= currentYear + 10; y++) {
      years.push(y);
    }
    return years;
  }, []);

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, month, 1));
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(year, newMonth, 1));
  };

  // Get items grouped by date (using local timezone)
  const itemsByDate = useMemo(() => {
    const map = {};
    items.forEach(item => {
      const date = new Date(item.createdAt);
      const dateKey = formatDateKey(date);
      if (!map[dateKey]) {
        map[dateKey] = { notes: 0, todos: 0 };
      }
      if (item.type === 'note') {
        map[dateKey].notes++;
      } else {
        map[dateKey].todos++;
      }
    });
    return map;
  }, [items]);

  // Get calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Previous month padding
    for (let i = 0; i < startPadding; i++) {
      const date = new Date(year, month, -startPadding + i + 1);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  };

  const panelClasses = [
    styles.panel,
    isCalendarCollapsed ? styles.collapsed : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <button
        className={`${styles.toggleBtn} ${!isCalendarCollapsed ? styles.active : ''}`}
        onClick={toggleCalendarCollapse}
        title={isCalendarCollapsed ? '展开日历' : '折叠日历'}
      >
        <CalendarIcon size={18} />
        <ChevronRight className={styles.toggleIcon} />
      </button>

      <aside className={panelClasses}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <CalendarIcon size={14} />
            <span>日历</span>
          </h2>
          <button
            className={styles.collapseBtn}
            onClick={toggleCalendarCollapse}
            title="折叠"
          >
            <ChevronRight />
          </button>
        </div>

        <div className={styles.calendar}>
          <div className={styles.monthNav}>
            <button className={styles.navBtn} onClick={goToPrevMonth}>
              <ChevronRight className={styles.navIcon} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <div className={styles.selectGroup}>
              <select
                className={styles.yearSelect}
                value={year}
                onChange={handleYearChange}
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
              <select
                className={styles.monthSelect}
                value={month}
                onChange={handleMonthChange}
              >
                {MONTHS.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>
            </div>
            <button className={styles.navBtn} onClick={goToNextMonth}>
              <ChevronRight className={styles.navIcon} />
            </button>
          </div>

          <button className={styles.todayBtn} onClick={goToToday}>
            今天
          </button>

          <div className={styles.weekdays}>
            {WEEKDAYS.map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>

          <div className={styles.days}>
            {calendarDays.map(({ date, isCurrentMonth }, index) => {
              const dateKey = formatDateKey(date);
              const dayItems = itemsByDate[dateKey];
              const hasItems = !!dayItems;
              const hasNotes = dayItems?.notes > 0;
              const hasTodos = dayItems?.todos > 0;

              return (
                <div
                  key={index}
                  className={`
                    ${styles.day}
                    ${!isCurrentMonth ? styles.otherMonth : ''}
                    ${isToday(date) ? styles.today : ''}
                    ${hasItems ? styles.hasItems : ''}
                    ${hasNotes ? styles.hasNotes : ''}
                    ${hasTodos ? styles.hasTodos : ''}
                  `}
                >
                  <span className={styles.dayNumber}>{date.getDate()}</span>
                  {hasItems && (
                    <div className={styles.dots}>
                      {hasNotes && <span className={styles.dotNote}></span>}
                      {hasTodos && <span className={styles.dotTodo}></span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendNote}`}></span>
              <span>笔记</span>
            </div>
            <div className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendTodo}`}></span>
              <span>待办</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
