/*
    The userRepository contains methods for interacting with the users table.
*/

import knex from "../knex";
import type { CreateUserData, User } from "../types";

const table = "users";
const columns = [
    "user_id",
    "first_name",
    "last_name",
    "email",
    "password_hash",
    "type",
    "created_at",
];

export const userRepository = {

    async create(data: CreateUserData): Promise<User> {
        const rows = await knex(table).returning(columns).insert(data);
        return rows[0] as unknown as User;
    },

    async findById(id: number) {
        const row = await knex
            .select([...columns])
            .from(table)
            .where("user_id", id)
            .first();
        return row;
    },

    async findByEmail(email: string) {
        const row = await knex
            .select([...columns])
            .from(table)
            .where("email", email)
            .first();
        return row;
    },

};
