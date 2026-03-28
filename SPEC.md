# Live Note - React 重构版本设计规格

## 1. Concept & Vision

延续原版温暖、富有质感的笔记应用理念，使用 React 框架重构，提供更流畅的用户体验和更好的代码组织。依然是 vintage 文学杂志与私人日记本的结合 — 精致的排版配合手写温度感。

## 2. Technical Stack

- **Framework**: React 18 + Vite
- **Styling**: CSS Modules + CSS Variables
- **State**: React useState/useContext (无外部状态管理)
- **Storage**: localStorage
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Playfair Display, Source Sans 3)

## 3. Design Language

### Color Palette
```css
--bg-paper: #F7F3ED;        /* 温暖米色纸张 */
--bg-sidebar: #EDE8E0;      /* 略深的侧边栏 */
--text-primary: #2C2416;    /* 深棕墨水色 */
--text-secondary: #6B5D4D;  /* 次要文字 */
--accent: #C4785A;          /* 赤陶橙点缀 */
--accent-hover: #A85F42;    /* 点缀悬停 */
--border: #D4CFC5;          /* 边框线 */
--shadow: rgba(44, 36, 22, 0.08);
--highlight: #FFF8E7;       /* 高亮背景 */
--danger: #B85450;          /* 删除警告色 */
```

### Typography
- **Display**: Playfair Display (衬线，文学感)
- **Body**: Source Sans 3 (无衬线)

### Motion
- 笔记卡片: staggered fade-in-up, 50ms 间隔
- 侧边栏折叠: width transition 300ms ease-out
- 悬停效果: translateY(-2px) + shadow
- 保存状态: pulse 动画

## 4. Component Architecture

```
src/
├── components/
│   ├── TopBar/
│   │   ├── TopBar.jsx
│   │   └── TopBar.module.css
│   ├── Sidebar/
│   │   ├── Sidebar.jsx
│   │   ├── Sidebar.module.css
│   │   ├── NoteCard.jsx
│   │   └── NoteCard.module.css
│   ├── Editor/
│   │   ├── Editor.jsx
│   │   ├── Editor.module.css
│   │   └── SaveStatus.jsx
│   └── EmptyState/
│       ├── EmptyState.jsx
│       └── EmptyState.module.css
├── hooks/
│   └── useNotes.js         # 笔记CRUD逻辑
├── context/
│   └── NotesContext.jsx    # 全局状态
├── utils/
│   └── helpers.js          # 工具函数
├── App.jsx
├── App.module.css
├── index.css               # 全局样式 + CSS变量
└── main.jsx
```

## 5. Features

### 功能清单
1. **笔记列表** - 显示所有笔记，按更新时间排序
2. **笔记编辑** - 标题 + 内容编辑，自动保存 (500ms debounce)
3. **新建笔记** - 创建空白笔记并自动聚焦
4. **删除笔记** - 悬停显示删除按钮
5. **侧边栏折叠** - 可折叠的笔记列表区域
6. **响应式** - 移动端适配

### 状态管理
- `notes`: 笔记数组
- `currentNoteId`: 当前选中笔记ID
- `isCollapsed`: 侧边栏折叠状态
- `saveStatus`: 保存状态 ('saving' | 'saved')

## 6. Responsive Breakpoints

- Desktop: > 768px (双栏布局)
- Mobile: <= 768px (侧边栏可 drawer 形式打开)
