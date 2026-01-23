# Claude Code Instructions

Project-specific instructions for Claude Code when working on this codebase.

## Styling Guidelines

**CRITICAL:** Before making any UI changes, read the full style guide:

- **[docs/ui_styleguide.md](docs/ui_styleguide.md)** - Complete design system documentation

### Key Rules

1. **Never hardcode opacity values** - Always use CSS variables from `src/index.css`
2. **Desktop glass enhancement is automatic** - CSS variables are overridden via media query for desktop
3. **Use utility classes** - `.glass-card`, `.glass-card-light`, `.glass-button-dashed`
4. **backdrop-filter property order** - When writing custom CSS with `backdrop-filter`, ALWAYS declare `-webkit-backdrop-filter` BEFORE `backdrop-filter`. CSS processors strip the standard property if it comes first, breaking Chrome desktop.

### Glass Effect Quick Reference

| Element | Class/Variable |
|---------|----------------|
| Header cards | `.glass-card` |
| List item cards/containers | `.glass-card-light` |
| Add/Create buttons | `.glass-button-dashed` |
| Progress bar track | `var(--glass-progress-track)` |

### Item Row Rules (Section 12 in styleguide)

1. **Drag handles (6 dots) must ALWAYS be visible** - Never use `opacity-0` or hide on hover
2. **Menu buttons (3 dots) must ALWAYS be visible** - Same rule, always `text-white/50`
3. **Icon size minimum 20px** - Never use `size={16}` for interactive elements
4. **Use `glass-card-light` for item containers** - Never hardcode `bg-white/10 backdrop-blur-md`
5. **Checkbox uses CSS variables** - `var(--check-gradient)` and `var(--check-shadow)`

### Desktop Liquid Glass System

Desktop browsers (Chrome) render `backdrop-filter` differently than mobile Safari. The CSS automatically enhances opacity on desktop via:

```css
@media (pointer: fine) and (min-width: 640px) {
  /* Enhanced values applied automatically */
}
```

**Do NOT create separate desktop styling in components** - the CSS variables handle this.

## Versioning

**Update version in `package.json` for every major feature update and release.** The version is displayed in the user menu (UserMenu.tsx) along with build timestamp.

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
