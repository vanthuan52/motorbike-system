# 🛵 MotoServ — Brand Guideline

> **Phiên bản:** 2.0  
> **Cập nhật:** 2026-04-07  
> **Brand Style:** Coolors-inspired — Clean, White, Electric Blue  
> **Font:** Inter  
> **Brand Vibe:** Sạch sẽ · Năng động · Công nghệ

---

## 1. Màu sắc (Color Palette)

### 1.1. Background

| Token | Hex | Tailwind Class | Dùng cho |
|-------|-----|----------------|----------|
| `--color-bg` | `#FFFFFF` | `bg-surface` | Nền chính toàn trang |
| `--color-bg-soft` | `#F8F9FA` | `bg-bg-soft` | Cards, sidebar, vùng phân cách |
| `--color-bg-hover` | `#F1F3F5` | `bg-bg-hover` | Hover state trên nền |

### 1.2. Text

| Token | Hex | Tailwind Class | Dùng cho |
|-------|-----|----------------|----------|
| `--color-text-primary` | `#212529` | `text-text-primary` | Heading, body text chính |
| `--color-text-secondary` | `#495057` | `text-text-secondary` | Body text phụ, labels |
| `--color-text-muted` | `#868E96` | `text-text-muted` | Caption, icon inactive |
| `--color-text-disabled` | `#ADB5BD` | `text-text-disabled` | Disabled elements |
| `--color-text-inverse` | `#FFFFFF` | `text-white` | Text trên nền tối |
| `--color-text-link` | `#0066FF` | `text-primary-500` | Link text |

### 1.3. Primary (Electric Blue — Thương hiệu chính)

| Token | Hex | Tailwind Class | Dùng cho |
|-------|-----|----------------|----------|
| `--color-primary-50` | `#E6F0FF` | `bg-primary-50` | Light tints, focus backgrounds |
| `--color-primary-100` | `#CCE0FF` | `bg-primary-100` | Active backgrounds |
| `--color-primary-500` | `#0066FF` | `bg-primary-500` | **Brand Primary** — CTA buttons |
| `--color-primary-600` | `#005CE6` | `bg-primary-600` | Hover state |
| `--color-primary-700` | `#004CBF` | `bg-primary-700` | Active / pressed state |

### 1.4. Secondary (Neutral Gray — Cấu trúc)

| Token | Hex | Tailwind Class | Dùng cho |
|-------|-----|----------------|----------|
| `--color-secondary-100` | `#F1F3F5` | `bg-secondary-100` | Hover backgrounds |
| `--color-secondary-200` | `#E9ECEF` | `bg-secondary-200` | Skeleton loaders |
| `--color-secondary-300` | `#DEE2E6` | `border-border-strong` | Borders nhấn |
| `--color-secondary-800` | `#343A40` | `bg-secondary-800` | Secondary dark |
| `--color-secondary-900` | `#212529` | `bg-secondary-900` | Topbar, footer dark |

### 1.5. Semantic

| Status | Màu | Background | Tailwind |
|--------|------|-----------|----------|
| Success | `#059669` | `#ECFDF5` | `text-success`, `bg-success-bg` |
| Warning | `#D97706` | `#FFFBEB` | `text-warning`, `bg-warning-bg` |
| Error | `#DC2626` | `#FEF2F2` | `text-error`, `bg-error-bg` |
| Info | `#0066FF` | `#E6F0FF` | `text-info`, `bg-info-bg` |

---

## 2. Typography

**Font:** Inter (sans-serif, tech-startup style)  
**Font Stack:** `Inter, system-ui, -apple-system, sans-serif`  
**Google Fonts:** [Inter](https://fonts.google.com/specimen/Inter)

| Element | Size | Weight |
|---------|------|--------|
| Hero Title | `2.25rem` (36px) | `800` (ExtraBold) |
| H1 | `2.25rem` (36px) | `700` (Bold) |
| H2 | `1.875rem` (30px) | `700` |
| H3 | `1.5rem` (24px) | `600` |
| H4 | `1.25rem` (20px) | `600` |
| Body | `1rem` (16px) | `400` |
| Small | `0.875rem` (14px) | `400` |
| Caption | `0.75rem` (12px) | `500` |

---

## 3. Khoảng cách & Hình khối

### Border Radius
| Token | Value | Dùng cho |
|-------|-------|---------|
| `--radius-sm` | `4px` | Tags, badges |
| `--radius-md` | `8px` | Buttons, inputs |
| `--radius-lg` | `12px` | Cards, panels |
| `--radius-xl` | `16px` | Featured cards |
| `--radius-full` | `9999px` | Avatars, pills |

### Shadows (Soft & Subtle — kiểu Coolors)
| Token | Value |
|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)` |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.03)` |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.03)` |

### Spacing (4px base)
Bội số 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

---

## 4. Token Mapping — Chống dùng màu cứng

| Mục đích | ✅ Dùng | ❌ Không dùng |
|----------|---------|--------------|
| Nền trang | `bg-bg-soft` | `bg-gray-100` |
| Nền card | `bg-surface` | `bg-white` (chấp nhận được) |
| Chữ chính | `text-text-primary` | `text-gray-900`, `text-black` |
| Chữ phụ | `text-text-secondary` | `text-gray-700` |
| Chữ mờ | `text-text-muted` | `text-gray-500`, `text-gray-600` |
| Chữ disabled | `text-text-disabled` | `text-gray-400` |
| Border mặc định | `border-border` | `border-gray-200` |
| Border nhấn | `border-border-strong` | `border-gray-300` |
| Nút CTA | `bg-primary-500` | `bg-blue-500`, `bg-violet-600` |
| Nút CTA hover | `hover:bg-primary-600` | `hover:bg-blue-600` |
| Nền tối (topbar) | `bg-secondary-900` | `bg-black` |
| Lỗi / bắt buộc | `text-error` | `text-red-500` |
| Thành công | `text-success` | `text-green-600` |
| Focus ring | `focus:ring-primary-500` | `focus:ring-blue-400` |

---

## 5. Nguyên tắc áp dụng

- **Nền trắng** là chủ đạo — cards "nổi" bằng shadow cực nhẹ
- **Contrast sắc nét** — Chữ đen `#212529` trên nền trắng
- **Accent tiết kiệm** — Electric Blue chỉ dùng cho CTA, link, badge active
- **Font weight đậm** cho heading — tạo hierarchy mạnh bằng boldness
- **Không dùng bg-black** — Thay bằng `bg-secondary-900`
- **Không dùng text-gray-*** — Thay bằng `text-text-*` semantic tokens
- **Không dùng violet/navy** — Thương hiệu cũ, thay bằng Electric Blue
- **Font Inter** — KHÔNG dùng Lexend (brand cũ)
