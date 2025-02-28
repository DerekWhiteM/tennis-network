export type UserType = "player" | "stringer";

export interface UserData {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    type: UserType;
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
