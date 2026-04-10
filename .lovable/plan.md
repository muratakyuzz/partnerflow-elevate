

# 3-Step Wizard for Partner "New Lead" Page

## Overview
Replace the single-form `PartnerLeadNew` page with a 3-step wizard (Account → Contacts → Product), reusing existing components and design system.

## Implementation

### 1. Rewrite `src/pages/partner/LeadNew.tsx`
- Replace the single form with a wizard using React `useState` for step tracking (1/2/3) and form data persistence across steps.
- Keep the back-to-leads link, `PageHeader`, and `max-w-2xl` container.
- Add a **step indicator** at top: three labeled steps (Account / Contacts / Product) with active/completed/upcoming visual states using existing color tokens.
- Bottom navigation: Back (step > 1) + Next/Create Lead buttons.

### 2. Step 1 — Account Information
- `FormSection` titled "Account Information"
- Two-column grid with fields: Company Name (input), Industry (Select dropdown), Employee Count (Select dropdown), Website (input), Address (input), City (input), Country (Select dropdown)
- Industry options: Technology, Finance, Retail, Healthcare, Manufacturing, Education, Other
- Employee count options: 1–10, 10–50, 50–200, 200–500, 500+
- Country: common list (US, UK, Germany, France, etc.)
- Basic validation: Company Name required before proceeding

### 3. Step 2 — Contacts
- `FormSection` titled "Contacts"
- Contact entry form: Job Title, First Name, Last Name, Email, Mobile No, Gender (Select: Male/Female/Other)
- "Add Contact" button appends to contacts array, resets form
- Below: table/card list of added contacts showing Name, Email, Job Title, with delete action (Trash2 icon)
- Validation: at least 1 contact required before proceeding

### 4. Step 3 — Product Selection
- `FormSection` titled "Product Selection"
- **Package cards**: 3 radio-selectable cards (Small/Medium/Large) in a 3-column grid, each showing package name, metrics (Team Size, Requirements, PBI Generation, Analysis, Lorem Metric 1, Lorem Metric 2, Monthly RQP), highlighted border on selection
- **Add-ons**: conditionally rendered (hidden when Small selected) — checkbox list: Accessibility WCAG 2.2, HealthCheck, Devicer
- **Notes**: `Textarea` field
- Validation: package must be selected

### 5. Final Submit
- "Create Lead" button aggregates all state and shows `toast.success("Lead created successfully")`, navigates to `/app/partner/leads`

### Components Used (no new shared components needed)
- `FormSection`, `PageHeader`, `Input`, `Textarea`, `Label`, `Button`, `Select/SelectContent/SelectItem/SelectTrigger/SelectValue`, `Checkbox` — all existing
- Step indicator built inline with Tailwind classes

### Files Changed
- `src/pages/partner/LeadNew.tsx` — full rewrite (single file change)

