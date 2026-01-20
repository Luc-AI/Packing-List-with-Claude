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

/* Glass Effects */
--glass-blur: blur(24px) saturate(130%);      /* Base blur + saturation */
--glass-bg: rgba(255, 255, 255, 0.18);        /* Default cards */
--glass-bg-light: rgba(255, 255, 255, 0.14);  /* Light variant cards */
--glass-bg-hover: rgba(255, 255, 255, 0.22);  /* Hover states */
--glass-scrim: rgba(0, 0, 0, 0.08);           /* Neutral contrast layer */

/* Borders */
--glass-border: rgba(255, 255, 255, 0.35);    /* Default border */
--glass-border-light: rgba(255, 255, 255, 0.28); /* Light variant */

/* Accent Gradients */
--progress-gradient: linear-gradient(90deg, rgba(255, 183, 77, 0.95) 0%, rgba(255, 138, 101, 0.95) 100%);
--check-gradient: linear-gradient(135deg, rgba(129, 199, 132, 0.95) 0%, rgba(102, 187, 106, 0.95) 100%);
```

### 2.1.1 Desktop Enhancement - Liquid Glass System

On desktop browsers, glass effects are **significantly enhanced** to compensate for reduced `backdrop-filter` effectiveness in Chrome. This creates an Apple-like "liquid glass" effect with high readability.

#### Desktop vs Mobile Values

| Token | Mobile | Desktop | Purpose |
|-------|--------|---------|---------|
| `--glass-gradient-top` | 0.22 | 0.38 | Card top gradient |
| `--glass-gradient-bottom` | 0.14 | 0.28 | Card bottom gradient |
| `--glass-gradient-light-top` | 0.16 | 0.32 | Light card top |
| `--glass-gradient-light-bottom` | 0.10 | 0.22 | Light card bottom |
| `--glass-scrim` | 0.08 | 0.12 | Background contrast layer |
| `--glass-bg-dashed` | 0.12 | 0.20 | Dashed button background |
| `--glass-progress-track` | 0.20 | 0.28 | Progress bar track |

#### CSS Implementation

```css
@media (pointer: fine) and (min-width: 640px) {
  :root {
    --glass-blur: blur(28px) saturate(120%);
    --glass-scrim: rgba(0, 0, 0, 0.12);

    /* Enhanced glass gradients for desktop readability */
    --glass-gradient-top: rgba(255, 255, 255, 0.38);
    --glass-gradient-bottom: rgba(255, 255, 255, 0.28);
    --glass-gradient-light-top: rgba(255, 255, 255, 0.32);
    --glass-gradient-light-bottom: rgba(255, 255, 255, 0.22);

    /* Enhanced dashed button for desktop */
    --glass-bg-dashed: rgba(255, 255, 255, 0.20);
    --glass-bg-dashed-hover: rgba(255, 255, 255, 0.28);

    /* Enhanced progress track */
    --glass-progress-track: rgba(255, 255, 255, 0.28);
  }
}
```

#### Important Rule

**NEVER hardcode opacity values** in components. Always use CSS variables so desktop enhancement applies automatically:

```tsx
// ❌ BAD - hardcoded, won't get desktop enhancement
style={{ background: 'rgba(255, 255, 255, 0.12)' }}

// ✅ GOOD - uses CSS variable, desktop enhancement automatic
style={{ background: 'var(--glass-bg-dashed)' }}

// ✅ BEST - use utility class
className="glass-button-dashed"
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

## 11. Modal Windows

> The modal system follows Apple-inspired glassmorphism principles: soft, calm, and visually lightweight while maintaining clear hierarchy and focus.

### 11.1 Design Tokens

```css
/* Modal Overlay */
--modal-overlay: rgba(0, 0, 0, 0.4);          /* Dark scrim behind modal */
--modal-overlay-blur: blur(4px);               /* Optional subtle blur on backdrop */

/* Modal Container - uses layered glass surface */
--modal-bg: linear-gradient(to bottom, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.14)), rgba(0, 0, 0, 0.08);
--modal-border: rgba(255, 255, 255, 0.35);     /* Subtle white border */
--modal-radius: 24px;                          /* Large, soft corners */
--modal-radius-mobile: 20px;                   /* Slightly smaller on mobile */
--modal-shadow: 0 8px 32px rgba(0, 0, 0, 0.18); /* Soft, diffused elevation */
--modal-blur: blur(24px) saturate(130%);       /* Frosted glass effect */

/* Modal Spacing */
--modal-padding: 24px;                         /* Internal padding */
--modal-section-gap: 20px;                     /* Vertical space between sections */
--modal-max-width: 420px;                      /* Default max width */
--modal-max-width-sm: 320px;                   /* Small modal variant */
--modal-max-width-lg: 520px;                   /* Large modal variant */
```

> **Note on glass surfaces:** The modal background uses a layered approach:
> 1. A top-to-bottom gradient (brighter top, darker bottom) for Apple-like depth
> 2. A neutral scrim (`rgba(0, 0, 0, 0.08)`) to normalize background luminance
> 3. Desktop browsers receive slightly enhanced values via `@media (pointer: fine)`

### 11.2 Modal Structure

```
┌─────────────────────────────────────┐
│  [X] Close button (top-right)       │  ← Optional
├─────────────────────────────────────┤
│  Title                              │  ← Header (bold, white)
├─────────────────────────────────────┤
│                                     │
│  Content Area                       │  ← Flexible height
│  (forms, selectors, text)           │
│                                     │
├─────────────────────────────────────┤
│  [Secondary]  [Primary]             │  ← Footer actions
└─────────────────────────────────────┘
```

### 11.3 Visual Specifications

#### Container
```tsx
// Glass modal container classes
className="
  relative
  w-full
  max-w-md
  mx-4
  glass-card
  rounded-[24px]
  sm:rounded-[24px]
  p-6
  animate-slide-up
"
style={{
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}}
```

#### Overlay (Backdrop)
```tsx
// Full-screen overlay
className="
  fixed
  inset-0
  z-50
  flex
  items-end              /* Mobile: bottom sheet */
  sm:items-center        /* Desktop: centered */
  justify-center
"

// Dark scrim
<div className="absolute inset-0 bg-black/40" />
```

#### Typography Hierarchy

| Element | Style | Class |
|---------|-------|-------|
| Modal title | Bold, white, 18-20px | `text-lg font-bold text-white` |
| Section labels | Medium, 85% white, 14px | `text-sm font-medium text-glass-secondary` |
| Input text | Regular, white, 15px | `text-white` |
| Placeholder | Regular, 50% white | `placeholder-white/50` |
| Helper text | Regular, 60% white, 13px | `text-sm text-glass-muted` |

### 11.4 Interactive Elements

#### Close Button (X)
```tsx
<button
  onClick={onClose}
  className="
    absolute
    top-4
    right-4
    p-1
    text-white/50
    hover:text-white/80
    transition-colors
  "
>
  <X size={20} />
</button>
```

#### Form Inputs
```tsx
<input
  className="
    w-full
    px-4
    py-3
    rounded-xl
    bg-white/10
    border
    border-white/20
    text-white
    placeholder-white/50
    focus:outline-none
    focus:ring-2
    focus:ring-white/30
    focus:border-transparent
    transition-all
  "
  placeholder="z.B. Sommerurlaub 2025"
/>
```

#### Button Pair (Footer Actions)
```tsx
<div className="flex gap-3 mt-6">
  {/* Secondary / Cancel */}
  <button
    onClick={onClose}
    className="
      flex-1
      px-4
      py-3
      rounded-xl
      bg-white/10
      text-white
      font-medium
      hover:bg-white/15
      transition-colors
    "
  >
    Abbrechen
  </button>

  {/* Primary / Confirm */}
  <button
    onClick={onSubmit}
    className="
      flex-1
      px-4
      py-3
      rounded-xl
      bg-white/20
      text-white
      font-medium
      hover:bg-white/25
      transition-colors
    "
  >
    Erstellen
  </button>
</div>
```

#### Icon/Emoji Selector Grid
```tsx
<div className="grid grid-cols-8 gap-2">
  {emojis.map((emoji) => (
    <button
      key={emoji}
      onClick={() => setSelected(emoji)}
      className={`
        w-10
        h-10
        rounded-lg
        flex
        items-center
        justify-center
        text-xl
        transition-all
        ${selected === emoji
          ? 'bg-white/25 ring-2 ring-white/40'
          : 'bg-white/10 hover:bg-white/15'
        }
      `}
    >
      {emoji}
    </button>
  ))}
</div>
```

### 11.5 Animation

#### Slide Up (Mobile-first)
```css
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

#### Fade In (Desktop alternative)
```css
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### 11.6 Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Bottom sheet, rounded top corners only, full width minus margins |
| Desktop (≥640px) | Centered, fully rounded, max-width constrained |

```tsx
// Responsive modal positioning
className="
  w-full
  sm:max-w-md
  mx-0
  sm:mx-4
  rounded-t-[24px]
  sm:rounded-[24px]
  mb-0
  sm:mb-0
"
```

### 11.7 Modal Variants

| Variant | Max Width | Use Case |
|---------|-----------|----------|
| Small | 320px | Confirmations, simple alerts |
| Default | 420px | Forms, selections |
| Large | 520px | Multi-step flows, complex forms |

### 11.8 Modal Backdrop Styles

> **WICHTIG für Claude/AI:** Bei der Implementierung eines neuen Modals MUSS zuerst gefragt werden, welcher Backdrop-Stil verwendet werden soll.

There are **two backdrop styles** based on context:

#### Style A: Global Modal (UserMenu Style)
**Use when:** Background context is NOT relevant (creating new items, user settings, account actions)

```tsx
{/* Backdrop - darker with blur */}
<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
```

| Property | Value |
|----------|-------|
| Opacity | 60% (`bg-black/60`) |
| Blur | 4px (`backdrop-blur-sm`) |
| Effect | Fully obscures background, focuses attention on modal |

**Examples:** UserMenu, ListModal (add mode), confirmation dialogs

#### Style B: Contextual Modal (Edit Item/List Style)
**Use when:** Background context IS helpful (editing existing items, seeing what you're modifying)

```tsx
{/* Backdrop - lighter, no blur */}
<div className="absolute inset-0 bg-black/40" />
```

| Property | Value |
|----------|-------|
| Opacity | 40% (`bg-black/40`) |
| Blur | None |
| Effect | Background remains visible, maintains spatial awareness |

**Examples:** ItemModal, ListModal (edit mode), OptionsMenu, ListOptionsMenu

#### Decision Checklist for New Modals

Ask: *"Does the user need to see the background while this modal is open?"*

- **YES** → Use Style B (40%, no blur)
- **NO** → Use Style A (60% + blur)

```
┌─────────────────────────────────────────────────────────┐
│  NEW MODAL IMPLEMENTATION                               │
│                                                         │
│  Q: Which backdrop style should be used?                │
│                                                         │
│  [ ] Style A: Global (60% + blur)                       │
│      → UserMenu, Create New, Account, Settings          │
│                                                         │
│  [ ] Style B: Contextual (40%, no blur)                 │
│      → Edit Item, Edit List, Options Menu               │
└─────────────────────────────────────────────────────────┘
```

### 11.9 Accessibility

- **Focus trap**: Tab cycles within modal only
- **Escape to close**: `onKeyDown` handler for Escape key
- **Click outside**: Backdrop click closes modal
- **ARIA attributes**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Auto-focus**: First interactive element receives focus on open

### 11.10 Complete Modal Example

```tsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, title, children, onSubmit }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal Container */}
      <div
        className="
          relative
          w-[90%]
          max-w-md
          glass-card
          rounded-[24px]
          p-6
          animate-fade-in
        "
        style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-white/50 hover:text-white/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5">
          {children}
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/25 transition-colors"
          >
            Erstellen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
```

### 11.11 Critical: Portal Requirement

> **PFLICHT:** Alle Modals MÜSSEN mit React Portal gerendert werden.

#### Problem: Stacking Context

CSS-Eigenschaften wie `backdrop-filter`, `transform`, `opacity`, oder `filter` auf Parent-Elementen erstellen einen neuen **Stacking Context**. Ein `z-index` innerhalb dieses Contexts kann NIEMALS über Elemente außerhalb hinausragen - egal wie hoch der Wert ist.

```
❌ FALSCH - Modal als Child:
┌─────────────────────────────────────────┐
│ <GlassCard>        ← backdrop-filter    │
│   <button />         = neuer Stacking   │
│   <Modal z=9999 />   Context!           │
│ </GlassCard>                            │
│                                         │
│ → Modal erscheint HINTER anderen        │
│   Elementen trotz z-index: 9999         │
└─────────────────────────────────────────┘

✅ RICHTIG - Modal via Portal:
┌─────────────────────────────────────────┐
│ <GlassCard>                             │
│   <button />                            │
│ </GlassCard>                            │
│ ...                                     │
│ <body>                                  │
│   <Modal z=9999 />  ← direkt in body    │
│ </body>                                 │
│                                         │
│ → Modal erscheint ÜBER allem            │
└─────────────────────────────────────────┘
```

#### Lösung: React Portal

```tsx
import { createPortal } from 'react-dom';

function MyModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      {/* Modal */}
      <div className="relative glass-card rounded-[24px] p-6">
        {children}
      </div>
    </div>,
    document.body
  );
}
```

#### Checkliste für neue Modals

- [ ] `createPortal` aus `'react-dom'` importiert
- [ ] Modal-JSX in `createPortal(..., document.body)` gewrappt
- [ ] `z-index: 9999` oder höher gesetzt
- [ ] Getestet: Modal erscheint ÜBER allen UI-Elementen

---

## 12. Quick Reference

### 12.1 Common Class Combinations

```css
/* Glass button */
p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors

/* Glass input */
w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50

/* Clickable card */
cursor-pointer transition-all duration-200 hover:bg-white/[0.18] hover:-translate-y-0.5

/* Dashed add button - USE CSS CLASS instead of inline styles */
glass-button-dashed
```

### 12.1.1 CSS Utility Classes (Desktop-Enhanced)

These classes automatically apply desktop liquid glass enhancement:

| Class | Purpose |
|-------|---------|
| `.glass-card` | Default card with gradient background |
| `.glass-card-light` | Lighter variant for list items |
| `.glass-button-dashed` | Dashed border button (e.g., "Add item") |

### 12.2 Import Pattern

```tsx
import { Button, Input, GlassBackground, GlassCard, Modal } from '../components/ui';
```

### 12.3 Modal Quick Reference

```css
/* Modal overlay */
fixed inset-0 z-50 flex items-end sm:items-center justify-center

/* Modal backdrop */
absolute inset-0 bg-black/40

/* Modal container */
relative w-full sm:max-w-md mx-0 sm:mx-4 glass-card rounded-t-[24px] sm:rounded-[24px] p-6 animate-slide-up

/* Modal button pair */
flex gap-3 mt-6

/* Secondary button */
flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15

/* Primary button */
flex-1 px-4 py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/25
```
