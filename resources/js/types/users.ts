export type UserRole = 'admin' | 'kalab' | 'plp' | 'dosen' | 'mhs' | 'ekst';

export type KategoriEksternal = 'internal_unej' | 'luar_unej';

/** Bentuk paginator Laravel yang diserialisasi Inertia. */
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    to: number | null;
    per_page: number;
    last_page: number;
    total: number;
}

export interface Pagination<T> {
    data: T[];
    links: PaginationLink[];
    meta: PaginationMeta;
}

export interface UserRow {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
    instansi: string | null;
    kategori: KategoriEksternal | null;
    no_hp: string | null;
    suspension_reason: string | null;
    terdaftar: string | null;
}

export interface UserListProps {
    users: Pagination<UserRow>;
    filters: { q: string; role: string };
    roleOptions: UserRole[];
    currentUserId: number;
}

export const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    kalab: 'Kepala Lab',
    plp: 'PLP',
    dosen: 'Dosen',
    mhs: 'Mahasiswa',
    ekst: 'Eksternal',
};

export const kategoriLabels: Record<KategoriEksternal, string> = {
    internal_unej: 'Internal UNEJ',
    luar_unej: 'Luar UNEJ',
};
