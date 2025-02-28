/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("stringers", table => {
        table.increments("stringer_id", { primaryKey: true }).references("user_id").inTable("users");
        table.geography("location");
        table.integer("price_per_racket").notNullable().defaultTo(0);
        table.boolean("is_available").defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("stringers");
};
