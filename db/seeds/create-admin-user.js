import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex.raw(`TRUNCATE users RESTART IDENTITY CASCADE;`);
    const defaultEmailAddress = process.env.DEFAULT_EMAIL_ADDRESS;
    const defaultPassword = process.env.DEFAULT_PASSWORD;
    if (!defaultEmailAddress || !defaultPassword) {
        console.error("Missing default email address or password environment variables");
        process.exit();
    }
    await knex("users").insert([
        {
            user_id: 1,
            first_name: "Site",
            last_name: "Admin",
            email: defaultEmailAddress,
            password_hash: await bcrypt.hash(defaultPassword, 10),
            type: "admin",
        },
    ]);
}
