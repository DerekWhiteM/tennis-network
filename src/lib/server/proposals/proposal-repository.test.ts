import knex from "../knex";
import { assertType, test, expect } from "vitest";
import { userRepository } from "../users/user-repository";
import { userService } from "../users/user-service";
import { proposalRepository } from "./proposal-repository";

const validateProposalSchema = (obj: any) => {
    const NUM_KEYS = 7;
    expect(Object.keys(obj)).toHaveLength(NUM_KEYS);
    expect(obj.id).toBeGreaterThan(0);
    expect(obj.user_id).toBeGreaterThan(0);
    assertType<string>(obj.location);
    assertType<string>(obj.date_time);
    assertType<string>(obj.notes);
    assertType<string|null>(obj.ntrp_min); 
    assertType<string|null>(obj.ntrp_max);
}

// Prepare the database
await knex.raw(`TRUNCATE users RESTART IDENTITY CASCADE;`);
await knex.raw(`TRUNCATE proposals RESTART IDENTITY CASCADE;`);

test('test creating a proposal', async () => {

    const user = await userRepository.create({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password_hash: await userService.hashPassword("password"),
        type: "standard",
    });

    const proposal = await proposalRepository.create({
        user_id: user.user_id,
        location: knex.raw("ST_GeogFromText('POINT(-74.0060 40.7128)')"),
        date_time: new Date(),
        notes: "Anyone want to play?",
        ntrp_min: 3.5,
        ntrp_max: 4.0,
    });

    validateProposalSchema(proposal);
});