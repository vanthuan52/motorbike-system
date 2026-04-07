# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** MotoServ  
**Updated:** 2026-04-07  
**Category:** Motorbike Maintenance Management System  
**Brand Style:** Coolors-inspired — Clean, White, Electric Blue  
**Brand Vibe:** Clean · Dynamic · Tech-Startup  
**Full Guideline:** See `docs/brand-guideline.md`

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Primary** | `#0066FF` | `--color-primary-500` | CTA buttons, links, active badges |
| Primary Hover | `#005CE6` | `--color-primary-600` | Hover state on primary |
| Primary Active | `#004CBF` | `--color-primary-700` | Pressed / active state |
| Primary Light | `#E6F0FF` | `--color-primary-50` | Light tints, focus rings |
| **Background** | `#FFFFFF` | `--color-bg` | Main page background |
| Background Soft | `#F8F9FA` | `--color-bg-soft` | Cards, sidebar, sections |
| Background Hover | `#F1F3F5` | `--color-bg-hover` | Hover state on surfaces |
| **Text Primary** | `#212529` | `--color-text-primary` | Headings, body text |
| Text Secondary | `#495057` | `--color-text-secondary` | Secondary body text |
| Text Muted | `#868E96` | `--color-text-muted` | Captions, inactive icons |
| Text Disabled | `#ADB5BD` | `--color-text-disabled` | Disabled state text |
| Text Inverse | `#FFFFFF` | `--color-text-inverse` | Text on dark backgrounds |
| **Surface** | `#FFFFFF` | `--color-surface` | Card backgrounds |
| **Border** | `#E9ECEF` | `--color-border` | Default borders |
| Border Strong | `#DEE2E6` | `--color-border-strong` | Emphasized borders |
| **Secondary 900** | `#212529` | `--color-secondary-900` | Topbar, footer dark areas |
| Secondary 800 | `#343A40` | `--color-secondary-800` | Secondary dark elements |
| Secondary 200 | `#E9ECEF` | `--color-secondary-200` | Skeleton loaders |
| Secondary 100 | `#F1F3F5` | `--color-secondary-100` | Hover backgrounds |
| **Success** | `#059669` | `--color-success` | Success states |
| **Warning** | `#D97706` | `--color-warning` | Warning states |
| **Error** | `#DC2626` | `--color-error` | Error states, required marks |
| **Info** | `#0066FF` | `--color-info` | Info states (= Primary) |

**Color Philosophy:**
- **White backgrounds** are the dominant surface — cards "float" with soft shadows
- **Electric Blue (#0066FF)** is used sparingly — only for CTAs, links, and active indicators
- **Dark neutral (#212529)** for structural dark elements (topbar, footer), NOT primary blue
- **High contrast** — Dark text on white creates sharp, readable interfaces

### Typography

- **Font:** Inter
- **Mood:** Clean, tech-startup, professional, sharp
- **Google Fonts:** [Inter](https://fonts.google.com/specimen/Inter)
- **CSS Variable:** `--font-inter`

**Font Loading (Next.js):**
```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600", "700", "800"] });
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Hero Title | 36px / 2.25rem | 800 (ExtraBold) | 1.2 |
| H1 | 36px / 2.25rem | 700 (Bold) | 1.2 |
| H2 | 30px / 1.875rem | 700 | 1.25 |
| H3 | 24px / 1.5rem | 600 | 1.3 |
| H4 | 20px / 1.25rem | 600 | 1.35 |
| H5 | 18px / 1.125rem | 600 | 1.4 |
| H6 | 16px / 1rem | 600 | 1.4 |
| Body | 16px / 1rem | 400 | 1.6 |
| Body SM | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 500 | 1.5 |
| Small | 11px / 0.6875rem | 400 | 1.45 |

### Spacing (4px base)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badge, tag |
| `--radius-md` | 8px | Button, input |
| `--radius-lg` | 12px | Card, modal |
| `--radius-xl` | 16px | Featured card |
| `--radius-full` | 9999px | Avatar, pill |

### Shadow Depths (Soft & Subtle — Coolors style)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle lift |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards resting |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)` | Card hover |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)` | Modal |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.03)` | Toast |

---

## Semantic Token Mapping (Tailwind v4)

Use these semantic classes instead of raw Tailwind gray/blue/black:

| Purpose | ✅ Use This | ❌ Not This |
|---------|------------|------------|
| Page background | `bg-bg-soft` | `bg-gray-100` |
| Card background | `bg-surface` | `bg-white` (acceptable) |
| Primary text | `text-text-primary` | `text-gray-900`, `text-black` |
| Secondary text | `text-text-secondary` | `text-gray-700` |
| Muted text | `text-text-muted` | `text-gray-500`, `text-gray-600` |
| Disabled text | `text-text-disabled` | `text-gray-400` |
| Default border | `border-border` | `border-gray-200` |
| Strong border | `border-border-strong` | `border-gray-300` |
| CTA button | `bg-primary-500` | `bg-blue-500`, `bg-violet-600` |
| CTA hover | `hover:bg-primary-600` | `hover:bg-blue-600` |
| Dark structure | `bg-secondary-900` | `bg-black` |
| Error text/mark | `text-error` | `text-red-500` |
| Success text | `text-success` | `text-green-600` |
| Focus ring | `focus:ring-primary-500` | `focus:ring-blue-400` |

---

## Style Guidelines

**Style:** Clean & Dynamic + Tech-Startup Authority

**Keywords:** White-first interface, sharp contrast, Electric Blue accents, professional service management, clear hierarchy

**Key Effects:** Soft shadows (rgba 0.05), smooth transitions (200ms), hover lift (-1px translateY)

### Layout

- **Grid:** 12 columns, 24px gutter
- **Max Width:** 1280px
- **Container Padding:** 16px (mobile) → 24px (tablet) → 48px (desktop)

---

## Anti-Patterns (Do NOT Use)

- ❌ Hardcoded color values (`bg-gray-*`, `text-gray-*`, `bg-black`) — Use design tokens
- ❌ Old brand colors (`violet-*`, `#0F172A` deep navy) — Use Electric Blue `#0066FF`
- ❌ Playful/cartoon design
- ❌ Purple/Pink AI gradients
- ❌ Emojis as icons — Use SVG icons (Lucide, Heroicons)
- ❌ Missing cursor:pointer on interactive elements
- ❌ Layout-shifting hover transforms
- ❌ Low contrast text (< 4.5:1)
- ❌ Instant state changes — Always use transitions (150-300ms)
- ❌ Font-size below 11px
- ❌ Using `Lexend` font — Brand font is now **Inter**

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Lucide/Heroicons)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] All CSS values use design tokens (no hardcoded hex/px)
- [ ] Primary color is Electric Blue `#0066FF`, NOT navy/violet
- [ ] Font is Inter, NOT Lexend
- [ ] `bg-black` replaced with `bg-secondary-900`
- [ ] `text-gray-*` replaced with `text-text-*` semantic tokens
