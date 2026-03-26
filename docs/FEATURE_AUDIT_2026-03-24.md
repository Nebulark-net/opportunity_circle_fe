# Feature Audit — Opportunity Circle FE

Date: 2026-03-24 (UTC)
Scope: `src/` and route structure in `src/App.jsx`

## 1) What is implemented and wired

### Public experience
- Public landing page exists at `/` with modular sections (`Hero`, `SearchSection`, `FeaturedSection`, `ValueProps`, `HomeCTA`).
- Public opportunity discovery and detail routes are wired:
  - `/explore`
  - `/opportunity/:id`
  - `/publishers`

### Authentication
- Login, register, forgot-password, reset-password, OAuth callback, and OAuth role selection routes are present.
- Auth persistence and token storage are implemented through Zustand `persist` middleware.
- API client adds Bearer token and enforces logout + redirect on `401`.

### Seeker dashboard
- Protected `/dashboard/*` route with role-gate for `SEEKER`.
- Feed tabs by opportunity type, saved opportunities, my applications, resources, profile, and settings routes are present.
- Shared dashboard shell with left nav + conditional right sidebar is implemented.

### Publisher workspace
- Protected `/publisher/*` route with role-gate for `PUBLISHER`.
- Publisher dashboard, create/edit opportunity, listings, applicants, insights, profile, and settings routes are present.
- Publisher service endpoints are implemented for stats, CRUD opportunities, applicants, and profile updates.

### Admin workspace
- Protected `/admin/*` route with role-gate for `ADMIN`.
- Admin dashboard, users, moderation queue, settings, CMS, and mentors routes are present.
- Admin service endpoints are implemented for stats, users, moderation, profile, CMS, and mentors.

### Infra and baseline quality
- Project builds successfully in production mode (`vite build`).
- Existing unit tests run and pass (2 files, 6 tests).

## 2) Features that are incomplete or currently broken

### Critical runtime break risk
1. **OAuth role selection page has missing imports/identifiers**.
   - `useNavigate`, `useAuthStore`, `useState`, `api`, and `toast` are referenced without imports in `src/pages/auth/OAuthRoleSelection.jsx`.
   - This will throw runtime errors when users land on `/oauth-role-selection`.

2. **Onboarding flow references missing imports/identifiers**.
   - `useAuthStore` and `Navigate` are used without imports in `src/pages/onboarding/OnboardingFlow.jsx`.
   - This can break onboarding redirects and role-aware step logic.

### Incomplete feature behavior
3. **Resources page is not connected to a resources backend endpoint**.
   - Query currently calls notifications endpoint as placeholder shape.
   - UI renders hardcoded mock resources even after fetch.
   - “Access Content” buttons have no link/action behavior.

4. **Contact page form has no submit handler/service integration**.
   - UI inputs exist, but there is no mutation call, validation flow, or success/error UX tied to backend.

### Quality blockers (developer velocity / CI risk)
5. **Linting currently fails with 45 errors**.
   - Includes no-undef and many no-unused-vars violations across auth, onboarding, dashboard, publisher, admin, and shared components.
   - This blocks strict quality gates if lint is required in CI.

6. **Large bundle warning (main chunk ~830kB)**.
   - Build succeeds, but warning indicates missing code splitting strategy and potential performance impact.

## 3) Potentially confusing architecture / duplication

1. **Duplicate/overlapping page/component paths suggest stale code paths**.
   - e.g., both `src/pages/opportunities/OpportunityDetail.jsx` and `src/pages/opportunity/OpportunityDetail.jsx`.
   - multiple `OpportunityCard` implementations across folders.
   - increases maintenance risk and can cause inconsistent UX behavior.

2. **Multiple auth/register style pages (`Register` + `SignUp`) exist**.
   - App routes use `Register`; `SignUp` still exists and has lint warnings.
   - indicates either migration-in-progress or abandoned flow.

## 4) Suggested completion order (high impact first)

1. **Fix all `no-undef` runtime blockers** for OAuth and onboarding pages first.
2. **Stabilize lint to zero errors** (minimum: eliminate errors, warnings can be phased).
3. **Finish resources feature**:
   - add dedicated resources API endpoint/service,
   - replace hardcoded list with API data,
   - wire CTA to actual link/download/detail.
4. **Finish contact workflow**:
   - submit mutation,
   - request validation,
   - toast + disabled/loading states.
5. **Refactor duplicate modules**:
   - standardize single source for opportunity detail and card components.
6. **Performance pass**:
   - route-based lazy loading and chunk splitting for dashboard/admin/publisher areas.

## 5) Verification checklist used in this audit

- Route and role gate review in `src/App.jsx` and layouts.
- Service layer capability review in `src/services/*.js`.
- Runtime-risk file inspection for auth/onboarding pages.
- Static quality checks:
  - `npm run lint` (fails with errors)
  - `npm run build` (passes with chunk-size warning)
  - `npx vitest run` (passes)

