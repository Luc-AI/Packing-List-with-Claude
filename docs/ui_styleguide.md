# UI Style Guide

> Design system and UI/UX guidelines for the Packing List app.

---

## 1. Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Glassmorphism** | Semi-transparent surfaces with blur effects create depth |
| **Mobile-first** | Design for 320px screens first, enhance for larger |
| **Consistency** | Use established patterns, components, and tokens |
| **Accessibility** | Readable text, sufficient contrast, keyboard support |

---

## 2. Color System

### 2.1 CSS Custom Properties

All colors are defined in `src/index.css`. Use these variables, not hard-coded values.

```css
/* Text Colors - ALWAYS use these for text */
--text-primary: white;                    /* Headings, important text */
--text-secondary: rgba(255, 255, 255, 0.85);  /* Labels, body text */
--text-muted: rgba(255, 255, 255, 0.6);       /* Timestamps, hints */

/* Glass Backgrounds */
--glass-bg: rgba(255, 255, 255, 0.15);        /* Default cards */
--glass-bg-light: rgba(255, 255, 255, 0.12);  /* Light variant cards */
--glass-bg-hover: rgba(255, 255, 255, 0.18);  /* Hover states */

/* Borders */
--glass-border: rgba(255, 255, 255, 0.3);     /* Default border */
--glass-border-light: rgba(255, 255, 255, 0.25); /* Light variant */

/* Accent Gradients */
--progress-gradient: linear-gradient(90deg, rgba(255, 183, 77, 0.95) 0%, rgba(255, 138, 101, 0.95) 100%);
--check-gradient: linear-gradient(135deg, rgba(129, 199, 132, 0.95) 0%, rgba(102, 187, 106, 0.95) 100%);
```

### 2.2 Tailwind Utility Classes

```css
/* Text utilities (defined in index.css) */
.text-glass-primary   /* White + text shadow - for headings */
.text-glass-secondary /* 85% white + light shadow - for labels */
.text-glass-muted     /* 60% white - for timestamps, hints */

/* Card utilities */
.glass-card           /* Default glass card styling */
.glass-card-light     /* Lighter variant for list items */
```

### 2.3 Color Usage Rules

| Element | Color | Class/Variable |
|---------|-------|----------------|
| Page headings | White with shadow | `text-glass-primary` |
| Form labels | 85% white | `text-glass-secondary` |
| Timestamps | 60% white | `text-glass-muted` |
| Input text | White | `text-white` |
| Placeholders | 50% white | `placeholder-white/50` |
| Errors | Red with transparency | `text-red-300` or `bg-red-500/20` |
| Success | Green with transparency | `text-green-200` or `bg-green-500/20` |

**NEVER use gray-based Tailwind classes** (`text-gray-700`, `bg-gray-50`, etc.) on glass backgrounds - they are unreadable.

---

## 3. Typography

### 3.1 Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### 3.2 Responsive Font Sizes

Use `clamp()` for fluid typography:

```css
/* Headings */
text-[clamp(24px,5vw,36px)]   /* Page titles */
text-[clamp(16px,3.5vw,20px)] /* Card titles */

/* Body */
text-[clamp(14px,2.8vw,15px)] /* Regular text */
text-[clamp(12px,2.2vw,13px)] /* Small text, timestamps */
```

### 3.3 Text Shadows

Always apply text shadows on glass backgrounds for readability:

```css
--text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);       /* Primary text */
--text-shadow-light: 0 1px 4px rgba(0, 0, 0, 0.3); /* Secondary text */
```

---

## 4. Components

### 4.1 Available Components

| Component | Location | Usage |
|-----------|----------|-------|
| `GlassBackground` | `ui/GlassBackground.tsx` | Full-page wrapper with background image |
| `GlassCard` | `ui/GlassCard.tsx` | Container with glass effect |
| `Button` | `ui/Button.tsx` | Primary actions |
| `Input` | `ui/Input.tsx` | Form inputs with glass styling |
| `Modal` | `ui/Modal.tsx` | Dialog overlays |
| `Checkbox` | `ui/Checkbox.tsx` | Toggle checkboxes |
| `ProgressBar` | `ui/ProgressBar.tsx` | Progress indicators |

### 4.2 GlassCard

```tsx
// Default variant - for headers
<GlassCard className="p-6">
  <h1 className="text-glass-primary">Title</h1>
</GlassCard>

// Light variant - for list items
<GlassCard variant="light" className="p-4">
  <p className="text-glass-secondary">Content</p>
</GlassCard>
```

### 4.3 Input (Glass-styled)

The Input component automatically uses glass styling:

```tsx
<Input
  type="email"
  label="Email address"           // Uses text-glass-secondary
  placeholder="you@example.com"   // Uses placeholder-white/50
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

Input styling includes:
- Semi-transparent background: `bg-white/10`
- White text: `text-white`
- Glass border: `border-white/30`
- Focus ring: `focus:ring-white/50`

### 4.4 Button

```tsx
// Primary (default) - for main actions
<Button>Save</Button>

// With loading state
<Button isLoading={isSaving}>Save</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

**Note:** Button currently uses blue colors. Consider updating to glass-themed variant for consistency.

### 4.5 Icon Buttons

For icon-only buttons (like logout), use this pattern:

```tsx
<button
  onClick={handleAction}
  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
  title="Action name"  // For accessibility
>
  <IconComponent size={20} className="text-white/80" />
</button>
```

---

## 5. Layout Patterns

### 5.1 Page Structure

```tsx
<GlassBackground>
  {/* Header Card */}
  <GlassCard className="p-[clamp(20px,4vw,28px)] mb-[clamp(16px,3vw,24px)]">
    <div className="flex items-center justify-between">
      <h1 className="text-glass-primary">Page Title</h1>
      {/* Actions */}
    </div>
  </GlassCard>

  {/* Content */}
  <div className="space-y-[clamp(12px,2vw,16px)]">
    {/* Cards */}
  </div>
</GlassBackground>
```

### 5.2 Responsive Spacing

Use `clamp()` for fluid spacing:

```css
/* Padding */
p-[clamp(16px,3vw,20px)]     /* Card padding */
p-[clamp(20px,4vw,28px)]     /* Header padding */

/* Margins */
mb-[clamp(16px,3vw,24px)]    /* Section spacing */
gap-[clamp(12px,2vw,16px)]   /* Item gaps */

/* Border radius */
rounded-[clamp(14px,3vw,20px)] /* Large cards */
rounded-[clamp(16px,3vw,24px)] /* Glass cards */
```

### 5.3 Max Width

Content is constrained by GlassBackground:

```tsx
<div className="max-w-[640px] w-full">{children}</div>
```

---

## 6. Interactive States

### 6.1 Hover States

```css
/* Cards */
hover:bg-white/[0.18]
hover:-translate-y-0.5

/* Buttons */
hover:bg-white/20

/* Links/Text */
hover:text-white
```

### 6.2 Focus States

Always provide visible focus for keyboard navigation:

```css
focus:outline-none
focus:ring-2
focus:ring-white/50
focus:border-transparent
```

### 6.3 Disabled States

```css
opacity-50
cursor-not-allowed
```

### 6.4 Loading States

Use spinner for async operations:

```tsx
<div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
```

---

## 7. Feedback & Messages

### 7.1 Success Messages

```tsx
<div className="p-3 rounded-lg bg-green-500/20 text-green-200 border border-green-500/30">
  Success message
</div>
```

### 7.2 Error Messages

```tsx
<div className="p-3 rounded-lg bg-red-500/20 text-red-200 border border-red-500/30">
  Error message
</div>
```

### 7.3 Inline Errors (Form Fields)

```tsx
<p className="mt-1 text-sm text-red-300">{error}</p>
```

---

## 8. Icons

### 8.1 Library

Use **Lucide React** for icons:

```tsx
import { Plus, LogOut, Check, X } from 'lucide-react';
```

### 8.2 Sizing

| Context | Size |
|---------|------|
| Inline with text | `size={16}` |
| Buttons | `size={20}` |
| Empty states | `size={48}` or larger |

### 8.3 Styling

```tsx
<Icon className="text-white/80" />     // Subtle
<Icon className="text-white" />        // Prominent
<Icon className="text-glass-muted" />  // Very subtle
```

---

## 9. Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible (ring-2)
- [ ] Icon buttons have `title` or `aria-label`
- [ ] Form inputs have associated labels
- [ ] Text has sufficient contrast (white on dark backgrounds)
- [ ] Loading states are announced (consider aria-live)
- [ ] Error messages are associated with inputs

---

## 10. Anti-Patterns (Avoid These)

| Don't | Do Instead |
|-------|------------|
| `text-gray-700` on glass | `text-glass-secondary` |
| `bg-gray-50` for backgrounds | `GlassBackground` component |
| `border-gray-300` | `border-white/30` |
| Hard-coded colors | CSS custom properties |
| Fixed pixel sizes | `clamp()` for responsiveness |
| Missing text shadows | Apply `text-glass-*` classes |
| Blue focus rings | `focus:ring-white/50` |

---

## 11. Quick Reference

### Common Class Combinations

```css
/* Glass button */
p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors

/* Glass input */
w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50

/* Clickable card */
cursor-pointer transition-all duration-200 hover:bg-white/[0.18] hover:-translate-y-0.5

/* Dashed add button */
bg-white/12 border-2 border-dashed border-white/35 hover:bg-white/18 hover:border-white/50
```

### Import Pattern

```tsx
import { Button, Input, GlassBackground, GlassCard } from '../components/ui';
```
