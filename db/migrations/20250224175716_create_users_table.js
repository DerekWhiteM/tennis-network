/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("users", table => {
        table.increments("user_id", { primaryKey: true });
        table.string("first_name", 127).notNullable();
        table.string("last_name", 127).notNullable();
        table.string("email", 255).unique().notNullable();
        table.string("password_hash", 255).notNullable();
        table.enum("type", ["admin", "standard"]).notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("users");
}
