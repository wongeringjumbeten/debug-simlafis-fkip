---
paths:
  - 'app/Http/Controllers/Users/**'
---

# Users

## Admin-only user management with self-protection guards
All user-management routes sit behind the `admin` middleware alias (EnsureUserIsAdmin) and both form requests re-check role in authorize() (defense-in-depth). Guardrails: an admin cannot change their own role (self-demotion would lock them out) and cannot suspend their own account. `kategori` (tariff, BR-2) is admin-editable here but NEVER in the self-profile flow. On store/update, `normalizeExternal()` nulls instansi/kategori for any non-ekst role.
