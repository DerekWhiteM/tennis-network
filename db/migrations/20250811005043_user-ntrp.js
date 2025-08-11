/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.table("users", (table) => {
        table.decimal('ntrp', 3, 1).nullable();
        table.check('ntrp >= 1.0 AND ntrp <= 7.0 AND ntrp % 0.5 = 0', [], 'valid_ntrp');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.table("users", (table) => {
        table.dropColumn("ntrp");
    });
};
