import { userRepository } from "#src/lib/server/users/user-repository.js";
import { validateUserSchema } from "../utils/validateUserSchema";
import { test, expect } from "vitest";
import knex from "#src/lib/server/knex.js";
import { userService } from "./user-service";

// Prepare the database
await knex.raw(`TRUNCATE users RESTART IDENTITY CASCADE;`);

test('test creating a user', async () => {
    const user = await userRepository.create({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password_hash: await userService.hashPassword("password"),
        type: "standard",
    });
    validateUserSchema(user);
});

test('test finding a user by ID', async () => {
    const user = await userRepository.findById(1);
    expect(user.user_id).toBe(1);
    validateUserSchema(user);
});

test('test finding a user by email', async () => {
    const user = await userRepository.findByEmail("johndoe@example.com");
    expect(user.email).toBe("johndoe@example.com");
    validateUserSchema(user);
});

test('test finding users within radius', async () => {
    await userRepository.create({
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@example.com",
        password_hash: await userService.hashPassword("password"),
        type: "standard",
        location: knex.raw("ST_GeogFromText('POINT(-74.0060 40.7128)')")
    });
    
    await userRepository.create({
        first_name: "Bob",
        last_name: "Johnson",
        email: "bob@example.com",
        password_hash: await userService.hashPassword("password"),
        type: "standard",
        location: knex.raw("ST_GeogFromText('POINT(-75.1652 39.9526)')")
    });
    
    // Test finding users within 10 miles of NYC (should only find Alice)
    const nearbyUsers = await userRepository.findWithinRadius(40.7128, -74.0060, 10);
    expect(nearbyUsers.length).toBe(1);
    expect(nearbyUsers[0].email).toBe("alice@example.com");
    expect(nearbyUsers[0].distance_meters).toBeLessThan(1000); // Should be very close
    
    // Test finding users within 100 miles of NYC (should find both Alice and Bob)
    const usersInLargerRadius = await userRepository.findWithinRadius(40.7128, -74.0060, 100);
    expect(usersInLargerRadius.length).toBe(2);
    
    // Results should be ordered by distance (Alice first, then Bob)
    expect(usersInLargerRadius[0].email).toBe("alice@example.com");
    expect(usersInLargerRadius[1].email).toBe("bob@example.com");
    expect(usersInLargerRadius[0].distance_meters).toBeLessThan(usersInLargerRadius[1].distance_meters);
});
