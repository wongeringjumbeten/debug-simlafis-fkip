---
paths:
    - app/Concerns/ProfileValidationRules.php
---

# Concerns

## External registration fields must be coupled

When adding conditional validation rules for paired fields (like instansi/kategori), combine them in a single rule method with `required_with` and other rules inline — spreading separate arrays with the same key into the validator will override earlier rules.
