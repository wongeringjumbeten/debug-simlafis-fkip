---
paths:
  - 'app/Http/Requests/Settings/**'
---

# Settings

## Never accept role or kategori from profile updates
Self-registration must always create role='ekst' (Fortify only exposes register to external users per BR-1); the `role` column default is 'ekst' as defense-in-depth. ProfileUpdateRequest validates name/email always, plus instansi/no_hp ONLY when the user is 'ekst'. `kategori` (tariff, BR-2) and `role` are deliberately NOT in profile rules so a user can never escalate their own role or change their tariff category — only Admin may. Never add role/kategori to the profile validated() set.
