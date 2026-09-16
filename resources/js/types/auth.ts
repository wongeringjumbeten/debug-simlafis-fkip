export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    instansi?: string | null;
    kategori?: 'internal_unej' | 'luar_unej' | null;
    no_hp?: string | null;
    role: 'admin' | 'kalab' | 'plp' | 'dosen' | 'mhs' | 'ekst';
    active: boolean;
    suspension_reason?: number | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
