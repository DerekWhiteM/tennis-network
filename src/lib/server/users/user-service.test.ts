import { userService } from "#src/lib/server/users/user-service.js";
import { validateUserSchema } from "../utils/validateUserSchema.js";
import { test } from "vitest";
import knex from "#src/lib/server/knex.js";

// Prepare the database
await knex.raw(`TRUNCATE users RESTART IDENTITY CASCADE;`);

test('test registering a user', async () => {
    const user = await userService.register({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password: "password",
        confirm_password: "password",
        type: "player",
    });
    validateUserSchema(user);
});