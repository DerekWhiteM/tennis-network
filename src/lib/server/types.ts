export type UserType = "admin" | "standard";

export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    type: UserType;
}

export interface UserDTO {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    type: UserType;
    created_at: Date;
}

export interface CreateUserData {
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    type: UserType;
}

export interface RegisterUserData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    type: UserType;
}

export interface Session {
    session_id: string;
    user_id: number;
    expires_at: Date;
}
