# Project Spec – Packing List Web App

## 1. Definition

Eine mobile-responsive Web App zur Verwaltung von Packlisten. Full-Stack Lern- und Portfolio-Projekt mit realer Nutzbarkeit.

Kein Startup, kein Overengineering – pragmatische Umsetzung mit modernem Stack.

## 2. Goals & Non-Goals

### Goals
- Funktionierende, nutzbare Packing List App
- Clean Code & solide Architektur (Portfolio-tauglich)
- Mobile-first, aber desktop-fähig
- Authentifizierung & Persistenz
- Schnelle, intuitive UX

### Non-Goals
- Keine Monetarisierung
- Keine Multi-User Collaboration (MVP)
- Keine Offline-Funktionalität (MVP)
- Keine native App
- Kein Over-Engineering für hypothetische Features

## 3. Target User & Usage Context

**User:** Einzelperson, die Packlisten für Reisen, Events oder wiederkehrende Aktivitäten erstellt.

**Context:**
- Primär mobil (unterwegs packen, Liste checken)
- Sekundär desktop (Liste vorbereiten)
- Wiederkehrende Listen (z.B. "Skiurlaub", "Festival", "Gym")

**Nutzungsmuster:**
1. Liste erstellen → Items hinzufügen
2. Beim Packen: Items abhaken
3. Nach Nutzung: Reset für nächstes Mal

## 4. Functional Scope

### 4.1 MVP (Version 1)

**Auth**
- Supabase Magic Link (Email-basiert)
- Session-Handling
- Logout

**Listen-Management**
- Liste erstellen (Name, Emoji/Icon, Hintergrundfarbe)
- Liste bearbeiten
- Liste löschen (mit Confirm-Modal)

**Listen-Übersicht**
- Alle Listen des Users anzeigen
- Visuell: Emoji + Farbe + Name + Progress
- Responsive Grid/List Layout

**Items**
- Item hinzufügen (Text)
- Item bearbeiten
- Item löschen
- Checkbox: checked/unchecked

**Progress**
- Progress Bar pro Liste (% der abgehakten Items)
- Echtzeit-Update beim Checken

**Reset**
- Reset-Button: Alle Items auf unchecked
- Confirm-Modal vor Reset

**UI**
- Minimalistisch, clean
- Mobile-first responsive
- Keine überflüssigen Animationen

### 4.2 Version 2

- Drag & Drop (Items sortieren)
- Subsections/Kategorien mit Toggle (z.B. "Kleidung", "Technik")
- Google OAuth als zusätzliche Login-Option
- Subtle Animationen (Micro-Interactions)

### 4.3 Version 3

- Listen teilen (read-only Link)
- Listen duplizieren
- Templates (vorgefertigte Listen)
- Dark Mode

## 5. Key Product Decisions

| Entscheidung | Gewählt | Begründung |
|--------------|---------|------------|
| Auth-Methode | Magic Link | Einfach, keine Passwörter, Supabase-nativ |
| Datenbank | Supabase (Postgres) | Auth + DB aus einer Hand, gute DX |
| Styling | Tailwind CSS | Utility-first, schnell, responsive |
| State | React State + Supabase Realtime (optional) | Einfach starten, später erweiterbar |
| Routing | React Router | Standard, bewährt |
| Deployment | Vercel | Einfach, kostenlos, gut für Next.js/Vite |

## 6. Technical Design

### 6.1 Tech Stack

**Frontend**
- React 18+
- TypeScript
- Tailwind CSS
- React Router v6
- Vite (Build Tool)
- emoji-mart (Emoji Picker)

**Testing**
- Jest
- React Testing Library

**Backend**
- Supabase (Auth, Database, API)
- PostgreSQL (via Supabase)

**Deployment**
- Vercel (Frontend)
- Supabase Cloud (Backend)

### 6.2 Data Model (High-Level)

```
users (Supabase Auth)
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
├── position: integer (für späteres Sorting)
├── created_at: timestamp
└── updated_at: timestamp
```

**RLS (Row Level Security):**
- Users sehen nur eigene Listen
- Users sehen nur Items ihrer eigenen Listen

### 6.3 State Management

**MVP Ansatz:**
- React `useState` / `useReducer` für lokalen UI State
- Supabase Client für Server State (fetch on mount, mutations)
- Optional: React Query / TanStack Query für Caching & Sync

**Kein Redux** – zu viel Overhead für diesen Scope.

### 6.4 Navigation & Routing

```
/                   → Redirect zu /lists (wenn auth) oder /login
/login              → Magic Link Login
/lists              → Listen-Übersicht (Dashboard)
/lists/:id          → Einzelne Liste mit Items
/lists/:id/edit     → Liste bearbeiten (oder Modal)
```

### 6.5 Auth & Persistence

**Auth Flow:**
1. User gibt Email ein
2. Supabase sendet Magic Link
3. User klickt Link → Session wird erstellt
4. App prüft Session bei jedem Load
5. Protected Routes redirecten zu /login wenn keine Session

**Persistence:**
- Alle Daten in Supabase Postgres
- Kein LocalStorage für Daten (nur Session Token)
- Supabase JS Client handhabt Auth Token automatisch

## 7. Quality Bar & Constraints

### Must Have
- Funktioniert auf iOS Safari & Android Chrome
- Responsive: 320px – 1440px+
- Keine JS-Errors in Console (Production)
- Auth funktioniert zuverlässig
- Daten werden nicht verloren

### Nice to Have
- Lighthouse Score > 90
- Loading States für alle async Operations
- Error Boundaries

### Constraints
- Solo-Projekt (1 Entwickler)
- Lernprojekt → Code-Qualität vor Speed
- Kostenlos (Supabase Free Tier, Vercel Free)

## 8. Resolved Decisions

| Frage | Entscheidung | Details |
|-------|--------------|---------|
| Emoji-Picker | Library | emoji-mart (oder ähnlich) |
| Color-Picker | Preset | 12–16 vordefinierte Farben |
| UI Updates | Optimistic | Sofort UI updaten, bei Fehler rollback |
| Testing | Ja | Jest + React Testing Library |
