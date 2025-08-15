import type { CreateProposal, Proposal } from "../types";
import knex from "../knex";

const table = "proposals";
const columns = [
    "id",
    "user_id",
    "location",
    "date_time",
    "notes",
    "ntrp_min",
    "ntrp_max",
];

export const proposalRepository = {

    async create(data: CreateProposal): Promise<Proposal> {
        const { latitude, longitude } = data.location;
        data.location = knex.raw(`ST_GeogFromText('POINT(${longitude} ${latitude})')`) as any;
        const rows = await knex(table).returning(columns).insert(data);
        return rows[0] as unknown as Proposal;
    }

};