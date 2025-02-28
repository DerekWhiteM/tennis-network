/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    await knex.raw(`TRUNCATE users RESTART IDENTITY CASCADE;`);
    await knex("users").insert([
        {
            user_id: 1,
            first_name: "Default",
            last_name: "User",
            email: "default.user@example.com",
            password_hash: "$2b$10$ZeuQBeDGSz3EeAYjKNbF/ejfFaXHpFlQR11C1EredaHvDL/0PoXPa", // password
            type: "player",
        },
    ]);
}
