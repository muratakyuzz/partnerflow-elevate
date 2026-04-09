

# Partner Ecosystem Platform (PRM) — MVP Redesign Plan

## Design System Foundation

### Color Tokens
- **Background**: Deep slate `#0F1729` (sidebar), `#F8F9FC` (content area)
- **Primary**: Indigo `#6366F1` (actions, links, active states)
- **Accent**: Amber `#F59E0B` (warnings, pending states)
- **Success**: Emerald `#10B981` / **Destructive**: Rose `#EF4444`
- **Cards**: White with subtle shadow + 1px border
- **Text**: `#1E293B` primary, `#64748B` muted

### Typography
- Headings: Inter (700/600 weight), large page titles 28-32px
- Body: Inter (400/500), 14-16px
- Mono: JetBrains Mono for IDs/codes

### Status Badge System
Consistent across Leads, Deals, Documents:
- DRAFT → gray, SUBMITTED → blue, APPROVED → green, REJECTED → red
- OPEN → blue, WON → green, LOST → red

---

## Architecture & Routing

### App Shell Pattern
- `AppShell` component wrapping sidebar + topbar + content
- Role-based route guards (`/app/admin/*` vs `/app/partner/*`)
- Sidebar with role-specific nav items, collapsible with icon-only mode
- Topbar: breadcrumb, user avatar/menu, notifications bell (placeholder)

### Shared Components
- `PageHeader` — title, subtitle, primary action button zone
- `DataTable` — sortable columns, search bar, filters, pagination
- `StatusBadge` — color-coded pill per status
- `EmptyState` — illustration + message + CTA
- `LoadingState` — skeleton shimmer
- `ErrorState` — retry action
- `ConfirmDialog` — for destructive actions (delete, reject)
- `FormSection` — grouped form fields with section headers

---

## Screens (Build Order)

### 1. Login / Forgot Password / Reset Password
- Split layout: left = form panel (dark), right = abstract SaaS illustration
- Trust cues: logo, tagline, subtle partner logos strip
- Clean form with validation states

### 2. Admin Sidebar + Topbar + Page Header
- Sidebar sections: Dashboard, Partners, Users, Leads, Deals, Documents
- Active state highlighting, icons per section
- Topbar: search (placeholder), user dropdown

### 3. Partner Sidebar (reduced nav)
- Dashboard, Leads, Deals, Documents only
- Same shell, different nav config

### 4. Admin Dashboard
- KPI cards row (total partners, active leads, deals pipeline, documents)
- Recent activity feed
- Quick actions zone

### 5. Partner Dashboard
- KPI cards (my leads, my deals, available documents)
- Recent lead status changes

### 6. Admin Leads List
- DataTable with status filter tabs (All/Draft/Submitted/Approved/Rejected)
- Search, columns: lead name, partner, status, date, actions
- Empty/loading/error states

### 7. Admin Lead Detail
- Lead info card (read-only fields when submitted)
- **Decision Zone** — prominent section with Approve (green) / Reject (red + reason textarea) buttons
- Status timeline/history
- Disabled states when not actionable

### 8. Partner Leads List + New Lead + Lead Detail
- Similar table, filtered to partner's own leads
- New lead form (only when DRAFT)
- Edit allowed on DRAFT/REJECTED only
- Read-only view for SUBMITTED/APPROVED

### 9. Admin Deals List + Deal Detail
- Table: deal name, partner, status, value, date
- Detail page split into:
  - **Edit Section** — editable fields
  - **Status Change Section** — separate card with WON/LOST buttons + confirm

### 10. Partner Deals (read-only)
- Same table, no create/edit actions
- Detail view is fully read-only

### 11. Admin Partners List + Detail + New
- Table with partner org info
- Detail: partner profile, associated users, linked leads/deals counts
- New partner form

### 12. Admin Users List + Detail + New
- Table with user info, role, partner assignment
- CRUD forms

### 13. Documents List (Admin variant)
- Table: file name, storage key, uploaded date, actions (delete)
- Upload = metadata form (fileName + storageKey fields)
- Delete with confirm dialog

### 14. Documents List (Partner variant)
- Same table, download action only, no delete/upload

---

## User Flows

### Admin Lead Review Flow
Login → Dashboard → Leads → Click submitted lead → Review info → Approve or Reject (with reason) → Toast confirmation → Back to list

### Partner Lead Submission Flow
Login → Dashboard → Leads → New Lead → Fill form → Save as Draft → Edit → Submit → See status change

### Admin Deal Management Flow
Deals list → Click deal → Edit fields → Save → Change status (WON/LOST) → Confirm dialog → Done

---

## Mock Data
All screens will use realistic mock data (no backend integration) with proper loading/empty/error state demos via a simple context-based mock data layer.

