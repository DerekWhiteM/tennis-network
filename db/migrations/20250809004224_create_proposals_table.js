/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("proposals", table => {
        // (id) -- identifier
        table.increments("id", { primaryKey: true });

        // (user_id) -- user that created the proposal
        table.integer("user_id").notNullable().references("user_id").inTable("users");

        // (location) -- proposed location
        table.specificType('location', 'GEOGRAPHY(POINT, 4326)').notNullable();

        // (date_time) -- proposed time of play
        table.timestamp('date_time').notNullable();

        // (notes) -- additional notes added by the proposer
        table.text('notes').nullable();

        // (ntrp_min) -- minimum NTRP of accepting players
        table.decimal('ntrp_min', 3, 1).nullable();

        // (ntrp_max) -- maximum NTRP of accepting players
        table.decimal('ntrp_max', 3, 1).nullable();

        table.check('ntrp_min >= 1.0 AND ntrp_min <= 7.0 AND ntrp_min % 0.5 = 0', [], 'valid_ntrp_min');
        table.check('ntrp_max >= 1.0 AND ntrp_max <= 7.0 AND ntrp_max % 0.5 = 0', [], 'valid_ntrp_max');
        table.check('ntrp_min <= ntrp_max', [], 'valid_ntrp_range')
    }); 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("proposals");
};
