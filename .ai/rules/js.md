---
paths:
    - 'resources/js/**'
---

# Js

## Never run wayfinder:generate without rebuilding

`@laravel/vite-plugin-wayfinder` generates the `.form()` variants for route functions. Running `php artisan wayfinder:generate` manually OVERWRITES the generated types WITHOUT the `.form()` variants, breaking every `<Form {...route.form()}>` usage. Fix: rely on `npm run build` (or `npm run dev`) to regenerate routes; only run `wayfinder:generate` if you immediately rebuild afterward.
