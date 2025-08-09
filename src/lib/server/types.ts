export type UserType = "admin" | "standard";

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    type: UserType;
    created_at: Date;
    location?: Object;
}

export interface UserWithDistance extends User {
    distance_meters: number;
}

export interface UserDTO {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    type: UserType;
    created_at: Date;
    location?: Object;
}

export interface CreateUserData {
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    type: UserType;
    location?: Object;
}

export interface RegisterUserData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    type: UserType;
    location?: { latitude: number; longitude: number };
}

export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    location?: { latitude: number; longitude: number } | null | Object;
}

export interface Session {
    session_id: string;
    user_id: number;
    expires_at: Date;
}

export interface Proposal {
    id: number;
    user_id: number;
    location: Object;
    date_time: Date;
    notes: string | null;
    ntrp_min: number | null;
    ntrp_max: number | null;
}

export interface CreateProposalData {
    user_id: number;
    location: Object;
    date_time: Date;
    notes: string | null;
    ntrp_min: number | null;
    ntrp_max: number | null;
}