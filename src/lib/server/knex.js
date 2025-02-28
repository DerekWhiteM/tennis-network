import knex from "knex";

const config = {
    development: {
        client: "pg",
        connection: {
            host: "127.0.0.1",
            port: 5432,
            user: "postgres",
            password: "postgres",
            database: "string-link",
        },
        migrations: {
            tableName: "migrations",
            directory: "db/migrations",
        },
        seeds: {
            directory: "db/seeds"
        }
    },
    test: {
        client: "pg",
        connection: {
            host: "127.0.0.1",
            port: 5432,
            user: "postgres",
            password: "postgres",
            database: "test-string-link",
        },
        migrations: {
            tableName: "migrations",
            directory: "db/migrations",
        },
    },
};

export default knex(config[process.env.NODE_ENV || 'development']);
