export async function up(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS postgis');

    return knex.schema.table('users', (table) => {
        table.specificType('location', 'GEOGRAPHY(POINT, 4326)').nullable();
    });
};

export function down(knex) {
    return knex.schema.table('users', (table) => {
        table.dropColumn('location');
    });
}
