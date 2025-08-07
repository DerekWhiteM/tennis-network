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

test('test getting coordinates by user ID', async () => {
    // Test getting coordinates for Alice (user with location)
    const aliceCoordinates = await userRepository.getCoordinatesById(2); // Alice was created as user ID 2
    expect(aliceCoordinates).not.toBeNull();
    expect(aliceCoordinates!.latitude).toBeCloseTo(40.7128, 4); // NYC latitude
    expect(aliceCoordinates!.longitude).toBeCloseTo(-74.0060, 4); // NYC longitude
    
    // Test getting coordinates for Bob (user with location)
    const bobCoordinates = await userRepository.getCoordinatesById(3); // Bob was created as user ID 3
    expect(bobCoordinates).not.toBeNull();
    expect(bobCoordinates!.latitude).toBeCloseTo(39.9526, 4); // Philadelphia latitude
    expect(bobCoordinates!.longitude).toBeCloseTo(-75.1652, 4); // Philadelphia longitude
    
    // Test getting coordinates for John (user without location)
    const johnCoordinates = await userRepository.getCoordinatesById(1); // John was created as user ID 1 without location
    expect(johnCoordinates).toBeNull();
    
    // Test getting coordinates for non-existent user
    const nonExistentCoordinates = await userRepository.getCoordinatesById(999);
    expect(nonExistentCoordinates).toBeNull();
});

test('test updating a user (non-location fields)', async () => {
    // Create a user
    const user = await userRepository.create({
        first_name: 'Charlie',
        last_name: 'Brown',
        email: 'charlie@example.com',
        password_hash: await userService.hashPassword('password'),
        type: 'standard',
    });
    // Update the user's first and last name
    const updated = await userRepository.update(user.user_id, {
        first_name: 'Charles',
        last_name: 'Browne',
    });
    expect(updated.user_id).toBe(user.user_id);
    expect(updated.first_name).toBe('Charles');
    expect(updated.last_name).toBe('Browne');
    expect(updated.email).toBe('charlie@example.com');
    validateUserSchema(updated);
});

test('test updating a user location', async () => {
    // Create a user
    const user = await userRepository.create({
        first_name: 'Daisy',
        last_name: 'Duck',
        email: 'daisy@example.com',
        password_hash: await userService.hashPassword('password'),
        type: 'standard',
    });
    // Update the user's location (Philadelphia)
    const updated = await userRepository.update(user.user_id, {
        location: { latitude: 39.9526, longitude: -75.1652 }
    });
    expect(updated.user_id).toBe(user.user_id);
    expect(updated.location).toBeDefined();
    validateUserSchema(updated);
    // Confirm coordinates are correct
    const coords = await userRepository.getCoordinatesById(user.user_id);
    expect(coords).not.toBeNull();
    expect(coords!.latitude).toBeCloseTo(39.9526, 4);
    expect(coords!.longitude).toBeCloseTo(-75.1652, 4);
});
