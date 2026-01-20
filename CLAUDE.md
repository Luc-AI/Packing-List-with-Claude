# Claude Code Instructions

Project-specific instructions for Claude Code when working on this codebase.

## Styling Guidelines

**CRITICAL:** Before making any UI changes, read the full style guide:

- **[docs/ui_styleguide.md](docs/ui_styleguide.md)** - Complete design system documentation

### Key Rules

1. **Never hardcode opacity values** - Always use CSS variables from `src/index.css`
2. **Desktop glass enhancement is automatic** - CSS variables are overridden via media query for desktop
3. **Use utility classes** - `.glass-card`, `.glass-card-light`, `.glass-button-dashed`

### Glass Effect Quick Reference

| Element | Class/Variable |
|---------|----------------|
| Header cards | `.glass-card` |
| List item cards | `.glass-card-light` |
| Add/Create buttons | `.glass-button-dashed` |
| Progress bar track | `var(--glass-progress-track)` |

### Desktop Liquid Glass System

Desktop browsers (Chrome) render `backdrop-filter` differently than mobile Safari. The CSS automatically enhances opacity on desktop via:

```css
@media (pointer: fine) and (min-width: 640px) {
  /* Enhanced values applied automatically */
}
```

**Do NOT create separate desktop styling in components** - the CSS variables handle this.

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS v4
- Supabase (Auth + Database)
- Vite

## File Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components (GlassCard, Button, Input, Modal)
│   └── features/    # Feature-specific components
├── pages/           # Route pages
├── context/         # React context (Auth)
├── store/           # Zustand store
└── index.css        # Design system CSS variables
```
