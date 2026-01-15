# Claude.md - Project Context for AI Assistance

> This file provides Claude with project context, guidelines, and constraints for effective assistance.

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Name** | Packing List Web App |
| **Purpose** | Mobile-responsive web app for managing packing lists |
| **Target User** | Individuals managing travel, event, or recurring activity packing lists |
| **Type** | Learning & portfolio project |
| **Status** | MVP development phase |

**Core Use Case:** Create reusable packing lists, check off items while packing, reset for next use.

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18+, TypeScript, Tailwind CSS, Vite |
| Routing | React Router v6 |
| UI Libraries | emoji-mart (emoji picker) |
| Backend | Supabase (Auth + PostgreSQL) |
| Testing | Jest, React Testing Library |
| Deployment | Vercel (frontend), Supabase Cloud (backend) |

---

## 3. Architecture

### 3.1 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI: Button, Modal, Input, Checkbox
│   └── features/        # Feature-specific: ListCard, ItemRow, ProgressBar
├── pages/               # Route components: Login, Lists, ListDetail
├── hooks/               # Custom hooks: useAuth, useLists, useItems
├── lib/
│   ├── supabase.ts      # Supabase client initialization
│   └── utils.ts         # Helper functions (cn, formatDate, etc.)
├── types/               # TypeScript types: Database types, component props
├── context/             # React context: AuthContext
└── App.tsx              # Root component with router setup
```

### 3.2 Data Model

```
users (managed by Supabase Auth)
├── id: uuid (PK)
├── email: string
└── created_at: timestamp

lists
├── id: uuid (PK)
├── user_id: uuid (FK → users)
├── name: string
├── emoji: string
├── color: string (hex)
├── created_at: timestamp
└── updated_at: timestamp

items
├── id: uuid (PK)
├── list_id: uuid (FK → lists)
├── text: string
├── checked: boolean
├── position: integer
├── created_at: timestamp
└── updated_at: timestamp
```

**Row Level Security (RLS):** Users can only access their own lists and items.

### 3.3 Routing

```
/           → Redirect to /lists (authenticated) or /login (unauthenticated)
/login      → Magic Link authentication
/lists      → Dashboard showing all user's lists
/lists/:id  → Single list view with items
```

### 3.4 State Management

- **Local UI state:** `useState`, `useReducer`
- **Server state:** Direct Supabase queries (consider TanStack Query for caching later)
- **Auth state:** React Context (`AuthContext`)
- **No Redux** - keep it simple for this scope

---

## 4. Design & UX Guidelines

- **Responsive:** Mobile-first design, 320px to 1440px+
- **Aesthetic:** Minimalist, clean, functional
- **Colors:** 12-16 preset background colors for lists (no custom color picker)
- **Updates:** Optimistic UI - update instantly, rollback on error
- **Animations:** None in MVP (add subtle micro-interactions in v2)
- **Browser support:** iOS Safari, Android Chrome, modern desktop browsers

---

## 5. Accessibility (a11y)

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<ul>`, `<li>`)
- All interactive elements must be keyboard accessible
- Visible focus states using Tailwind (`focus:ring-2 focus:ring-blue-500`)
- ARIA labels for icon-only buttons (`aria-label="Delete item"`)
- Form inputs must have associated `<label>` elements
- Color contrast: minimum 4.5:1 ratio for text

---

## 6. Code Style & Conventions

### Components
- Functional components only (no class components)
- Props interface defined directly above the component
- Destructure props in function parameters

### Naming
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ListCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `ListItem`, `User` |

### Import Order
1. React imports
2. Third-party libraries
3. Local components/hooks
4. Types
5. Styles/assets

### Tailwind
- Prefer utility classes over custom CSS
- Use `cn()` helper for conditional classes (from `lib/utils.ts`)
- Extract repeated patterns to components, not `@apply`

---

## 7. Code Examples

### Component Pattern

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}
```

### Custom Hook Pattern

```tsx
export function useLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLists() {
      try {
        const { data, error } = await supabase
          .from('lists')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLists(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lists');
      } finally {
        setLoading(false);
      }
    }

    fetchLists();
  }, []);

  return { lists, loading, error, setLists };
}
```

### Supabase Query Pattern

```tsx
async function addItem(listId: string, text: string) {
  // Optimistic update
  const tempId = crypto.randomUUID();
  const newItem = { id: tempId, list_id: listId, text, checked: false };
  setItems(prev => [...prev, newItem]);

  // Server request
  const { data, error } = await supabase
    .from('items')
    .insert({ list_id: listId, text, checked: false })
    .select()
    .single();

  if (error) {
    // Rollback on error
    setItems(prev => prev.filter(item => item.id !== tempId));
    toast.error('Failed to add item');
    return;
  }

  // Replace temp item with server response
  setItems(prev => prev.map(item =>
    item.id === tempId ? data : item
  ));
}
```

---

## 8. Error Handling

| Error Type | Handling |
|------------|----------|
| API errors | Display user-friendly toast notification |
| Form validation | Inline error message below the input |
| Auth errors | Redirect to /login with error message |
| Network errors | Show retry button/option |

**Rules:**
- Never expose raw error messages, stack traces, or Supabase internals to users
- Use `console.error` in development only (guard with `import.meta.env.DEV`)
- Provide actionable feedback ("Try again" button, not just "Error occurred")

---

## 9. Testing Strategy

### What to Test
- Custom hooks (data fetching logic, state management)
- Utility functions (pure functions in `lib/utils.ts`)
- Critical user flows (login, create list, check/uncheck item)

### File Naming
Place test files alongside components: `Button.test.tsx` next to `Button.tsx`

### Not Required for MVP
- Visual regression tests
- E2E tests (add with Playwright in v2)
- 100% code coverage

---

## 10. Environment Setup

### Required Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rules
- Never commit `.env` or `.env.local` files
- Use `VITE_` prefix for all client-accessible variables
- Document all variables in `.env.example` (without real values)

---

## 11. Common Pitfalls (Avoid These)

| Pitfall | Solution |
|---------|----------|
| Using `any` type | Always define proper TypeScript types |
| Inline styles | Use Tailwind utility classes |
| `console.log` in production | Remove or guard with `import.meta.env.DEV` |
| Direct DOM manipulation | Use React state and refs |
| Secrets in client code | Use Supabase RLS, keep secrets server-side |
| Over-fetching data | Select only needed columns in queries |
| Missing loading states | Always show feedback during async operations |
| Missing error states | Handle all async operation failures |
| Giant components | Extract components when exceeding ~150 lines |

---

## 12. Repository Etiquette

### Commit Messages (Conventional Commits)

```
feat: add list creation modal
fix: resolve checkbox toggle state bug
refactor: extract useAuth hook from Login page
docs: update README with setup instructions
chore: update dependencies
```

### Branch Naming

```
main              # Production-ready code
feature/add-list  # New features
fix/checkbox-bug  # Bug fixes
docs/readme       # Documentation updates
```

### .gitignore Essentials

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

---

## 13. Commands

```bash
npm run dev       # Start Vite development server
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
npm run test      # Run Jest tests
npm run lint      # ESLint check
npm run lint:fix  # Auto-fix lint issues
```

---

## 14. Documentation References

- **Project Specification:** [project_spec.md](./project_spec.md)
- **Project Status:** [project_status.md](./project_status.md)
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **React Router Docs:** https://reactrouter.com

---

## 15. Documentation Maintenance

**Update these docs after major milestones:**

| Event | Update |
|-------|--------|
| Phase completed | Mark phase complete in `project_status.md`, update "Current Phase" |
| New component added | Add to folder structure in section 3.1 if it introduces a new pattern |
| New route added | Update routing table in section 3.3 |
| New dependency added | Add to Tech Stack table in section 2 |
| Architecture change | Update relevant Architecture subsection |
| New environment variable | Add to section 10 and `.env.example` |

**Files to keep in sync:**
- `Claude.md` - Architecture, tech stack, patterns
- `project_status.md` - Progress tracking, completed tasks, current phase
