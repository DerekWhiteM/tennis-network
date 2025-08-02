import type { RegisterUserData } from "../types";
import { userRepository } from "./user-repository";
import bcrypt from "bcrypt";

export const userService = {

    /**
     * Register a user.
     * @throws If the passwords don't match or a user with the same email already exists.
     */
    async register(data: RegisterUserData) {
        if (data.password !== data.confirm_password) {
            throw "Passwords don't match";
        }
        const existing_user = await userRepository.findByEmail(data.email);
        if (existing_user) {
            throw "User already exists";
        }
        const user = await userRepository.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password_hash: await this.hashPassword(data.password),
            type: data.type,
        });
        return user;
    },

    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10) as string;
    },

    async verifyPassword(password: string, password_hash: string) {
        return await bcrypt.compare(password, password_hash) as boolean;
    },

    async getUsersWithinRadius(latitude: number, longitude: number, radiusMiles: number = 10) {
        return await userRepository.findWithinRadius(latitude, longitude, radiusMiles);
    }

}
