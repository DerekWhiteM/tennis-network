/*
    The userRepository contains methods for interacting with the users table.
*/

import knex from "../knex";
import type { CreateUserData, UpdateUserData, User, UserWithDistance } from "../types";

const table = "users";
const columns = [
    "user_id",
    "first_name",
    "last_name",
    "email",
    "password_hash",
    "type",
    "created_at",
    "location",
];

export const userRepository = {

    async create(data: CreateUserData): Promise<User> {
        // If location is provided as raw SQL, handle it separately
        if (data.location) {
            const { location, ...userData } = data;
            const rows = await knex(table)
                .returning(columns)
                .insert({
                    ...userData,
                    location: location // This will be a knex.raw() object
                });
            return rows[0] as unknown as User;
        } else {
            const rows = await knex(table).returning(columns).insert(data);
            return rows[0] as unknown as User;
        }
    },

    async findById(id: number) {
        const row = await knex
            .select([...columns])
            .from(table)
            .where("user_id", id)
            .first();
        return row;
    },

    async findByEmail(email: string) {
        const row = await knex
            .select([...columns])
            .from(table)
            .where("email", email)
            .first();
        return row;
    },

    async findWithinRadius(latitude: number, longitude: number, radiusMiles: number = 10) {
        // Convert miles to meters (1 mile = 1609.34 meters)
        const radiusMeters = radiusMiles * 1609.34;
        
        const rows = await knex
            .select([
                "user_id",
                "first_name",
                "last_name",
                "email",
                "type",
                "created_at",
                "location",
                knex.raw("ST_Distance(location, ST_GeogFromText(?)) as distance_meters", [`POINT(${longitude} ${latitude})`])
            ])
            .from(table)
            .whereRaw("ST_DWithin(location, ST_GeogFromText(?), ?)", [`POINT(${longitude} ${latitude})`, radiusMeters])
            .whereNotNull("location")
            .orderByRaw("ST_Distance(location, ST_GeogFromText(?)) ASC", [`POINT(${longitude} ${latitude})`]);
        
        return rows as unknown as UserWithDistance[];
    },

    async getCoordinatesById(userId: number): Promise<{ latitude: number; longitude: number } | null> {
        const row = await knex
            .select([
                knex.raw('ST_Y(location::geometry) as latitude'),
                knex.raw('ST_X(location::geometry) as longitude')
            ])
            .from(table)
            .where('user_id', userId)
            .whereNotNull('location')
            .first() as { latitude: string; longitude: string } | undefined;
            
        if (!row) {
            return null;
        }
        
        return {
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude)
        };
    },

    async update(userId: number, data: UpdateUserData) {
        let updateData = { ...data };
        if (data.location && typeof data.location === 'object' && 'latitude' in data.location && 'longitude' in data.location) {
            updateData = {
                ...data,
                location: knex.raw(`ST_GeogFromText('POINT(${data.location.longitude} ${data.location.latitude})')`)
            };
        }
        if (data.location === null) {
            updateData = {
                ...data,
                location: null
            };
        }
        const rows = await knex(table)
            .where('user_id', userId)
            .update(updateData)
            .returning(columns);
        return rows[0] as unknown as User;
    },

};
