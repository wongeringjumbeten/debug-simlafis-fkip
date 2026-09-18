---
paths:
    - app/Services/RegistrationService.php
---

# Services

## Sprint 1 multi-category registration rules

Self-registration covers mahasiswa/dosen/eksternal (Sprint 1 latest supersedes old internal-register ban). Keep role codes (dosen/mhs/ekst) separate from external tariff category (internal_unej/luar_unej). NIK/NIM/NIP are strings, never integers. Wilayah must pass hierarchy checks (kabupaten in province, etc.). All writes run in one DB transaction with files stored on the public disk; uploads are JPG/PNG max 2MB.
