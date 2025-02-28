import { userRepository } from "#src/lib/server/users/user-repository.js";
import { validateUserSchema } from "../utils/validateUserSchema";
import { test, expect } from "vitest";
import knex from "#src/lib/server/knex.js";
import { userService } from "./user-service";

// Prepare the database
await knex.raw(`TRUNCATE users RESTART IDENTITY CASCADE;`);

test('test creating a user', async () => {
    const user = await userRepository.create({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password_hash: await userService.hashPassword("password"),
        type: "player",
    });
    validateUserSchema(user);
});

test('test finding a user by ID', async () => {
    const user = await userRepository.findById(1);
    expect(user.user_id).toBe(1);
    validateUserSchema(user);
});

test('test finding a user by email', async () => {
    const user = await userRepository.findByEmail("johndoe@example.com");
    expect(user.email).toBe("johndoe@example.com");
    validateUserSchema(user);
});
