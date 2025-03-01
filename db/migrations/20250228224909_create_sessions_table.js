export function up(knex) {
    return knex.schema.createTable("sessions", table => {
        table.string("session_id", { primaryKey: true }).notNullable();
        table.integer("user_id").notNullable().references("user_id").inTable("users");
        table.date("expires_at").notNullable();
    })
};

export function down(knex) {
    return knex.schema.dropTable("sessions");
};
